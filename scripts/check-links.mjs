#!/usr/bin/env node
/**
 * 校验构建产物里的内链：扫 dist 下所有 .html，收集 href="/..."，
 * 确认每个都对应一个真实存在的 .html 文件。
 *
 * 用法：先 pnpm build，再 pnpm verify:links
 */

import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'docs', '.vitepress', 'dist')

if (!existsSync(DIST)) {
  console.error('dist 不存在，先跑 pnpm build')
  process.exit(1)
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else if (entry.name.endsWith('.html')) yield p
  }
}

/** /guide/order/ → docs/.vitepress/dist/guide/order.html 或 .../order/index.html */
function linkToFile(link) {
  const clean = decodeURIComponent(link.split('#')[0].split('?')[0])
  if (clean === '' || clean === '/') return ['index.html']
  const noSlash = clean.replace(/^\/|\/$/g, '')
  return [`${noSlash}.html`, join(noSlash, 'index.html')]
}

const links = new Map() // href → [来源页...]
let pageCount = 0

for await (const file of walk(DIST)) {
  pageCount++
  const html = await readFile(file, 'utf8')
  const rel = file.slice(DIST.length + 1)

  for (const m of html.matchAll(/href="(\/[^"#]*)?(#[^"]*)?"/g)) {
    const path = m[1]
    if (!path) continue // 纯锚点
    if (/\.(svg|png|jpg|css|js|ico|json|xml|txt|webmanifest)$/i.test(path)) continue
    if (path.startsWith('/assets/')) continue
    if (!links.has(path)) links.set(path, [])
    if (links.get(path).length < 3) links.get(path).push(rel)
  }
}

let broken = 0
for (const [link, sources] of links) {
  const candidates = linkToFile(link)
  const found = candidates.some((c) => existsSync(join(DIST, c)))
  if (!found) {
    broken++
    console.error(`✗ ${link}\n    引用自: ${sources.join(', ')}`)
  }
}

console.log(`\n扫描 ${pageCount} 个页面，${links.size} 个唯一内链，${broken} 个失效`)

if (broken > 0) process.exit(1)
console.log('内链全部有效 ✓')
