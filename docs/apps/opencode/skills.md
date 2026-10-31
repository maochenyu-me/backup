---
title: OpenCode Skills
---

# OpenCode Skills

<div class="filmhead">
  <div class="filmhead__title">OpenCode Skills <span class="badge">72 个</span></div>
  <p class="filmhead__lede">模型按需加载的可复用技能。这里是从本机目录实际扫出来的清单。</p>
  <dl class="spec">
    <dt>加载方式</dt><dd>模型调用 skill 工具按需读取 SKILL.md</dd>
    <dt>目录约定</dt><dd>&lt;skills 目录&gt;/&lt;name&gt;/SKILL.md</dd>
    <dt>总数</dt><dd>72 个</dd>
    <dt>生成方式</dt><dd>pnpm skills（扫描 SKILL.md 自动生成）</dd>
  </dl>
</div>

## 它是怎么工作的

Skill 不是插件，也不是常驻上下文。OpenCode 启动时只扫描每个 `SKILL.md` 的
**name 和 description**，把它们列进 `skill` 工具的描述里。模型觉得需要时，才调用
`skill({ name: "xxx" })` 把正文读进来。

这意味着两件事：

- `description` 写得含糊，模型就选不中它，等于白装
- skills 再多也不会撑爆上下文，因为正文是惰性加载的

## 搜索顺序

OpenCode 会依次在这些位置找，同名时靠前的优先：

| 位置 | 作用域 |
| --- | --- |
| `.opencode/skills/` | 项目级 |
| `~/.config/opencode/skills/` | 全局 |
| `.claude/skills/` | 项目级，Claude 兼容 |
| `~/.claude/skills/` | 全局，Claude 兼容 |
| `.agents/skills/` | 项目级，Agent Skills 兼容 |
| `~/.agents/skills/` | 全局，Agent Skills 兼容 |

本机的全局配置被 `XDG_CONFIG_HOME` 重定向到了 `E:\opencode\data\config`，
所以实际读的是 `E:\opencode\data\config\opencode\skills`。



## 全局配置（XDG 重定向）

路径：`E:\opencode\data\config\opencode\skills`　·　6 个

| Skill | 作用 | 备注 |
| --- | --- | --- |
| `browser-automation` | Use when controlling web pages with the OpenClaw browser tool, especially multi-step… | 不自动广播 |
| `find-skills` | Helps users discover and install agent skills when they ask questions like "how do I do… | — |
| `frontend-design` | Guidance for distinctive, intentional visual design when building new UI or reshaping… | — |
| `grill-me` | Interview the user relentlessly about a plan or design until reaching shared… | — |
| `playwright-skill` | Complete browser automation with Playwright. | — |
| `Web Fetch` | Fetch any http(s) URL and turn it into clean markdown for reading, summarizing, quoting… | — |

## 全局配置（默认位置）

路径：`C:\Users\Administrator\.config\opencode\skills`　·　11 个

| Skill | 作用 | 备注 |
| --- | --- | --- |
| `agents-sdk` | Build AI agents on Cloudflare Workers using the Agents SDK. | — |
| `cloudflare` | Comprehensive Cloudflare platform skill covering Workers, Pages, storage (KV, D1, R2)… | — |
| `cloudflare-email-service` | Send and receive transactional emails with Cloudflare Email Service (Email Sending +… | — |
| `cloudflare-one` | Guides Cloudflare One Zero Trust and SASE work across Access, Gateway, WARP, Tunnel… | — |
| `cloudflare-one-migrations` | Plans migrations from Zscaler ZIA/ZPA, Palo Alto, legacy VPN, SWG, or SASE stacks to… | — |
| `durable-objects` | Create and review Cloudflare Durable Objects. | — |
| `sandbox-sdk` | Build sandboxed applications for secure code execution. | — |
| `turnstile-spin` | Set up Cloudflare Turnstile end-to-end in a project — scan the codebase, create the… | — |
| `web-perf` | Analyzes web performance using Chrome DevTools MCP. | — |
| `workers-best-practices` | Reviews and authors Cloudflare Workers code against production best practices. | — |
| `wrangler` | Cloudflare Workers CLI for deploying, developing, and managing Workers, KV, R2, D1… | — |

## Agent Skills 兼容目录

路径：`C:\Users\Administrator\.agents\skills`　·　55 个　·　另有 11 个与前面目录重名，已被遮蔽

| Skill | 作用 | 备注 |
| --- | --- | --- |
| `backend-code-review` | Use only when the user explicitly requests a review or audit of backend code under 'api/… | — |
| `brainstorming` | You MUST use this before any creative work - creating features, building components… | — |
| `caveman` | 超压缩 communication mode。 | — |
| `claude-code` | Drive Anthropic's Claude Code CLI ('claude -p') as a non-interactive coding sub-agent… | — |
| `code-review` | Review the changes since a fixed point (commit, branch, tag, or merge-base) along two… | — |
| `codex-cli` | Drive OpenAI's Codex CLI ('codex exec') as a non-interactive coding sub-agent from… | — |
| `commit-dis` | Stage and commit ONLY the work done in this session, on the CURRENT branch — no new… | — |
| `comms` | Use when writing or reviewing any Kortix-facing words — headlines, taglines, elevator… | — |
| `context7-cli` | Use the ctx7 CLI to fetch library documentation, manage AI coding skills, and configure… | — |
| `contributing` | The pull request loop for this repo: branch → commit → verify in your own box (local… | — |
| `diagnose` | 面向棘手 bug 和性能回退的纪律化 diagnosis loop。 | — |
| `diagnosing-superpowers` | Use when a superpowers session went wrong and your human partner wants to know why —… | — |
| `dispatching-parallel-agents` | Use when facing 2+ independent tasks that can be worked on without shared state or… | — |
| `dotenvx-secrets` | How this repo manages API secrets and the four local-run environments… | — |
| `executing-plans` | Use when executing an implementation plan in the current session as the implementer… | — |
| `finishing-a-development-branch` | Use when implementation is complete, all tests pass, and you need to decide how to… | — |
| `git-guardrails-claude-code` | 设置 Claude Code hooks，在危险 git commands（push, reset --hard, clean, branch -D 等）执行前阻止它们。 | — |
| `grill-with-docs` | Grilling session that challenges your plan against the existing domain model, sharpens… | — |
| `handoff` | Compact the current conversation into a handoff document for another agent to pick up. | — |
| `improve-codebase-architecture` | 根据 CONTEXT.md 中的 domain language 和 docs/adr/ 中的 decisions，寻找 codebase 的 deepening… | — |
| `kortix-brand-guidelines` | Use when choosing any concrete visual or motion value in a Kortix surface — a padding… | — |
| `kortix-design-system` | Use when building or editing any visual surface in apps/web — a page, screen, list… | — |
| `kortix-release` | How to cut a Kortix production release — the versioning philosophy (when patch vs minor… | — |
| `kortix-rollback` | How to roll Kortix PRODUCTION back to an older already-released version — the inverse… | — |
| `launch` | Launch Code OSS (VS Code from sources) into an isolated throwaway profile with unique… | — |
| `learnings` | The project's episodic memory: a timestamped ledger of rules paid for with real outages… | — |
| `migrate-to-shoehorn` | 将 test files 从 'as' type assertions 迁移到 @total-typescript/shoehorn。 | — |
| `migration` | How to change the database schema in this repo. | — |
| `modsearch` | Plug-in web search, X (Twitter) search, and page fetch for text-only models. | — |
| `prototype` | Build a throwaway prototype to flesh out a design before committing to it. | — |
| `receiving-code-review` | Use when receiving code review feedback, before implementing suggestions, especially if… | — |
| `requesting-code-review` | Use when completing tasks, implementing major features, or before merging to verify… | — |
| `scaffold-exercises` | 创建包含 sections、problems、solutions 和 explainers 的 exercise directory structures，并确保通过… | — |
| `sdk` | The hard rules for editing '@kortix/sdk' (packages/sdk) — a PUBLISHED npm package with… | — |
| `setup-pre-commit` | 在当前 repo 设置 Husky pre-commit hooks，集成 lint-staged (Prettier)、type checking 和 tests。 | — |
| `subagent-driven-development` | Use when executing implementation plans with independent tasks in the current session | — |
| `systematic-debugging` | Use when encountering any bug, test failure, or unexpected behavior, before proposing… | — |
| `tdd` | 使用 red-green-refactor loop 做 test-driven development。 | — |
| `teach` | 在这个 workspace 中教用户一个新 skill 或概念。 | — |
| `test-driven-development` | Use when implementing any feature or bugfix, before writing implementation code | — |
| `testing` | Use for every Kortix test task, behavior change, bug fix, refactor, API route change… | — |
| `to-issues` | 使用 tracer-bullet vertical slices，把 plan、spec 或 PRD 拆成项目 issue tracker 上可独立领取的 issues。 | — |
| `to-prd` | 将当前 conversation context 转成 PRD 并发布到项目 issue tracker。 | — |
| `triage` | Triage issues through a state machine driven by triage roles. | — |
| `ui-ux-pro-max` | UI/UX design intelligence for web, mobile, and desktop. | — |
| `using-git-worktrees` | Use when starting feature work that needs isolation from current workspace or before… | — |
| `using-superpowers` | Use when starting any conversation - establishes how to find and use skills, requiring… | — |
| `vercel-react-best-practices` | React and Next. | — |
| `verification-before-completion` | Use when about to claim work is complete, fixed, or passing, before committing or… | — |
| `vue-best-practices` | MUST be used for Vue. | — |
| `worktree` | How to do feature work in this repo with git worktrees via 'pnpm worktree'. | — |
| `write-a-skill` | 创建结构正确、支持 progressive disclosure 并带 bundled resources 的新 agent skills。 | — |
| `writing-plans` | Use when you have a spec or requirements for a multi-step task, before touching code | — |
| `writing-skills` | Use when creating new skills, editing existing skills, or verifying skills work before… | — |
| `zoom-out` | 让 agent zoom out，并给出更广的 context 或更高层 perspective。 | — |

## 怎么加新 skill

在对应目录下建一个文件夹，里面放 `SKILL.md`，开头必须有 frontmatter：

```yaml
---
name: my-skill          # 必填，小写字母数字单横线，必须与目录名一致
description: 一句话说清它做什么、什么时候该用   # 必填，1–1024 字符
license: MIT            # 可选
---
```

规矩：

- `name` 必须和目录名完全一致，否则加载不上
- `name` 只能是小写字母、数字、单横线，不能以横线开头结尾，不能有连续横线
- `description` 决定模型会不会选中它——写清"什么时候用"，比写"它能干什么"更重要

加完后重跑 `pnpm skills` 刷新本页。

## 相关文档

- OpenCode 技能文档：<https://opencode.ai/docs/skills/>
