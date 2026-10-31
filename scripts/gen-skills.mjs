#!/usr/bin/env node
/**
 * 扫描本机的 skills 目录，生成两份清单页：
 *   docs/apps/opencode/skills.md
 *   docs/apps/workbuddy/skills.md
 *
 * 用法：pnpm skills
 *
 * 设计要点：
 * - 目录列表写在下面的 SOURCES 里，换机器或改路径只改这一处
 * - 只读 SKILL.md 的 YAML frontmatter，不读正文（正文太长且没必要）
 * - 目录不存在就跳过，不报错（这样在没装 WorkBuddy 的机器上也能跑）
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HOME = homedir()

/** 本机 skills 目录。依据：OpenCode 官方文档的搜索路径 + 本机实际存在的目录 */
const SOURCES = {
  opencode: [
    {
      label: '全局配置（XDG 重定向）',
      path: process.env.OPENCODE_GLOBAL_SKILLS || join('E:', 'opencode', 'data', 'config', 'opencode', 'skills'),
    },
    {
      label: '全局配置（默认位置）',
      path: join(HOME, '.config', 'opencode', 'skills'),
    },
    {
      label: 'Agent Skills 兼容目录',
      path: join(HOME, '.agents', 'skills'),
    },
    {
      label: 'Claude 兼容目录',
      path: join(HOME, '.claude', 'skills'),
    },
  ],
  workbuddy: [
    {
      label: '全局 skills',
      path: join(HOME, '.workbuddy', 'skills'),
    },
  ],
}

/**
 * 取出 frontmatter 里的 key: value。
 * 只处理单行标量——SKILL.md 的 frontmatter 基本都是这个形状，不引 yaml 依赖。
 */
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}

  const out = {}
  let currentKey = null

  for (const rawLine of m[1].split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, '')
    if (!line.trim()) continue

    // 多行折叠（key: | 或 key: >）
    if (currentKey && /^\s+/.test(line)) {
      out[currentKey] = (out[currentKey] + ' ' + line.trim()).trim()
      continue
    }

    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!kv) continue

    const [, key, rawValue] = kv
    let value = rawValue.trim()

    // 去掉包裹引号
    if (/^["'].*["']$/.test(value)) value = value.slice(1, -1)
    // 去掉 YAML 块标量标记
    if (value === '|' || value === '>' || value === '|-') value = ''

    out[key] = value
    currentKey = value === '' ? key : null
  }

  return out
}

/** 一句话摘要：优先中文描述，其次英文描述，最后退到正文首句 */
function summarize(fm) {
  const candidates = [
    fm.display_name_zh,
    fm.description_zh,
    fm.description,
    fm.summary,
  ].filter((s) => typeof s === 'string' && s.trim())

  let text = candidates[0] || ''
  if (!text) return '（无描述）'

  text = text.replace(/\s+/g, ' ').trim()

  // 截到第一个句末标点，避免整段塞进表格
  const cut = text.search(/[。．.!?！？]/)
  if (cut > 12) text = text.slice(0, cut + 1)

  const LIMIT = 88
  if (text.length > LIMIT) {
    let cutText = text.slice(0, LIMIT)
    // 英文按词边界退，中文直接截
    if (/[a-z]$/i.test(cutText)) {
      const space = cutText.lastIndexOf(' ')
      if (space > LIMIT * 0.6) cutText = cutText.slice(0, space)
    }
    text = cutText.trimEnd().replace(/[,;:，；：]$/, '') + '…'
  }

  return text
}

/** 是否标记为不向模型广播（本机 skills 里有这种约定） */
async function readSkill(dir, name) {
  const skillPath = join(dir, name, 'SKILL.md')
  if (!existsSync(skillPath)) {
    return { name, summary: '（缺少 SKILL.md）', version: '', note: 'invalid' }
  }

  let text = ''
  try {
    text = await readFile(skillPath, 'utf8')
  } catch {
    return { name, summary: '（读取失败）', version: '', note: 'unreadable' }
  }

  const fm = parseFrontmatter(text)
  const autoinvoke = /opencode\/autoinvoke:\s*false/i.test(text)
  const hasLicense = Boolean(fm.license)
  const fromMarket = /__skillhub$/i.test(name)

  return {
    name: fm.name || name,
    summary: summarize(fm),
    version: fm.version || '',
    note: autoinvoke ? '不自动广播' : fromMarket ? '来自技能市场' : '',
    dirName: name,
  }
}

async function scanSource(source) {
  if (!existsSync(source.path)) return null

  let entries = []
  try {
    entries = await readdir(source.path, { withFileTypes: true })
  } catch {
    return null
  }

  const dirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, 'en'))

  const skills = []
  for (const d of dirs) {
    skills.push(await readSkill(source.path, d))
  }

  return { ...source, skills }
}

function escapeCell(text) {
  return String(text)
    .replace(/`/g, "'")          // 反引号会破坏表格里的行内代码
    .replace(/\|/g, '\\|')       // 竖线会拆表格
    .replace(/\n/g, ' ')
}

function renderTable(skills) {
  if (!skills.length) return '_（本目录没有独有的 skill）_'

  const rows = skills.map((s) => {
    const cells = [
      '`' + escapeCell(s.name) + '`',
      escapeCell(s.summary),
      s.note ? escapeCell(s.note) : '—',
    ]
    return '| ' + cells.join(' | ') + ' |'
  })

  return [
    '| Skill | 作用 | 备注 |',
    '| --- | --- | --- |',
    ...rows,
  ].join('\n')
}

/**
 * 同名 skill 会互相遮蔽（靠前的目录优先）。
 * 这里按目录顺序去重：第一次出现的位置保留，后面的只记数量。
 */
function dedupeGroups(groups) {
  const seen = new Map()
  return groups.map((g) => {
    const unique = []
    let shadowed = 0

    for (const s of g.skills) {
      const key = s.name.toLowerCase()
      if (seen.has(key)) {
        shadowed++
        continue
      }
      seen.set(key, g.label)
      unique.push(s)
    }

    return { ...g, skills: unique, shadowed }
  })
}

function renderPage({ title, badge, lede, specs, intro, groups }) {
  const total = groups.reduce((n, g) => n + g.skills.length, 0)

  const specLines = specs
    .map(([k, v]) => `    <dt>${k}</dt><dd>${v}</dd>`)
    .join('\n')

  const body = groups
    .map((g) => {
      const shadowNote = g.shadowed
        ? `　·　另有 ${g.shadowed} 个与前面目录重名，已被遮蔽`
        : ''
      return [
        `## ${g.label}`,
        '',
        `路径：\`${g.path}\`　·　${g.skills.length} 个${shadowNote}`,
        '',
        renderTable(g.skills),
      ].join('\n')
    })
    .join('\n\n')

  const missing = groups.length === 0
    ? '::: warning 没找到 skills 目录\n本机没有扫描到任何 skills 目录。确认路径后重跑 `pnpm skills`。\n:::'
    : ''

  return `---
title: ${title}
---

# ${title}

<div class="filmhead">
  <div class="filmhead__title">${title} <span class="badge">${badge}</span></div>
  <p class="filmhead__lede">${lede}</p>
  <dl class="spec">
${specLines}
    <dt>总数</dt><dd>${total} 个</dd>
    <dt>生成方式</dt><dd>pnpm skills（扫描 SKILL.md 自动生成）</dd>
  </dl>
</div>

${intro}

${missing}

${body}

## 怎么加新 skill

在对应目录下建一个文件夹，里面放 \`SKILL.md\`，开头必须有 frontmatter：

\`\`\`yaml
---
name: my-skill          # 必填，小写字母数字单横线，必须与目录名一致
description: 一句话说清它做什么、什么时候该用   # 必填，1–1024 字符
license: MIT            # 可选
---
\`\`\`

规矩：

- \`name\` 必须和目录名完全一致，否则加载不上
- \`name\` 只能是小写字母、数字、单横线，不能以横线开头结尾，不能有连续横线
- \`description\` 决定模型会不会选中它——写清"什么时候用"，比写"它能干什么"更重要

加完后重跑 \`pnpm skills\` 刷新本页。

## 相关文档

- OpenCode 技能文档：<https://opencode.ai/docs/skills/>
`
}

async function main() {
  const results = {}

  for (const [key, sources] of Object.entries(SOURCES)) {
    const scanned = []
    for (const src of sources) {
      const r = await scanSource(src)
      if (r) scanned.push(r)
    }
    results[key] = scanned
  }

  // OpenCode 页
  const ocGroups = dedupeGroups(results.opencode)
  const ocTotal = ocGroups.reduce((n, g) => n + g.skills.length, 0)

  const ocPage = renderPage({
    title: 'OpenCode Skills',
    badge: `${ocTotal} 个`,
    lede: '模型按需加载的可复用技能。这里是从本机目录实际扫出来的清单。',
    specs: [
      ['加载方式', '模型调用 skill 工具按需读取 SKILL.md'],
      ['目录约定', '&lt;skills 目录&gt;/&lt;name&gt;/SKILL.md'],
    ],
    intro: `## 它是怎么工作的

Skill 不是插件，也不是常驻上下文。OpenCode 启动时只扫描每个 \`SKILL.md\` 的
**name 和 description**，把它们列进 \`skill\` 工具的描述里。模型觉得需要时，才调用
\`skill({ name: "xxx" })\` 把正文读进来。

这意味着两件事：

- \`description\` 写得含糊，模型就选不中它，等于白装
- skills 再多也不会撑爆上下文，因为正文是惰性加载的

## 搜索顺序

OpenCode 会依次在这些位置找，同名时靠前的优先：

| 位置 | 作用域 |
| --- | --- |
| \`.opencode/skills/\` | 项目级 |
| \`~/.config/opencode/skills/\` | 全局 |
| \`.claude/skills/\` | 项目级，Claude 兼容 |
| \`~/.claude/skills/\` | 全局，Claude 兼容 |
| \`.agents/skills/\` | 项目级，Agent Skills 兼容 |
| \`~/.agents/skills/\` | 全局，Agent Skills 兼容 |

本机的全局配置被 \`XDG_CONFIG_HOME\` 重定向到了 \`E:\\opencode\\data\\config\`，
所以实际读的是 \`E:\\opencode\\data\\config\\opencode\\skills\`。`,
    groups: ocGroups,
  })

  // WorkBuddy 页
  const wbGroups = dedupeGroups(results.workbuddy)
  const wbTotal = wbGroups.reduce((n, g) => n + g.skills.length, 0)

  const wbPage = renderPage({
    title: 'WorkBuddy Skills',
    badge: `${wbTotal} 个`,
    lede: 'WorkBuddy 本地可调用的技能目录。迁移时是重点备份对象。',
    specs: [
      ['目录', '~/.workbuddy/skills'],
      ['格式', '&lt;name&gt;/SKILL.md，frontmatter 同上'],
    ],
    intro: `## 和 OpenCode 的区别

WorkBuddy 的 skills 目录结构跟 OpenCode 一样（一个文件夹一个 \`SKILL.md\`），
但两者的**加载机制不同**：

- OpenCode 有明确的 \`skill\` 工具，模型显式调用
- WorkBuddy 的技能是它自己的 agent 运行时按需读取，行为取决于版本

所以同一个 skill 文件夹在两边都能放，但效果不一定一致。

## 迁移时怎么处理

skills 目录是纯文件，直接拷就行：

\`\`\`powershell
# 备份
Compress-Archive -Path "$env:USERPROFILE\\.workbuddy\\skills" -DestinationPath "备份目录\\workbuddy-skills.zip"
\`\`\`

::: warning 数量会变
这些 skill 里有相当一部分是应用内市场装的，重装 WorkBuddy 后可能自动回来一部分。
本页清单反映的是**生成那一刻**的目录状态，重装后记得重跑 \`pnpm skills\` 对比。`,
    groups: wbGroups,
  })

  const ocPath = join(ROOT, 'docs', 'apps', 'opencode', 'skills.md')
  const wbPath = join(ROOT, 'docs', 'apps', 'workbuddy', 'skills.md')

  await mkdir(dirname(ocPath), { recursive: true })
  await mkdir(dirname(wbPath), { recursive: true })

  await writeFile(ocPath, ocPage, 'utf8')
  await writeFile(wbPath, wbPage, 'utf8')

  console.log(`OpenCode skills: ${ocTotal} 个（${ocGroups.length} 个目录）→ ${ocPath}`)
  console.log(`WorkBuddy skills: ${wbTotal} 个（${wbGroups.length} 个目录）→ ${wbPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
