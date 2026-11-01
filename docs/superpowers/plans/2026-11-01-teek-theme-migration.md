# Teek 文档风主题迁移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` or `executing-plans` to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 将换机手册接入 Teek 文档风，改善首页与正文 UI，保留已有内容、URL 和部署选项。

**Architecture:** Teek 负责主题框架，本站 Layout 只通过已核实的 `home-hero-before` 插槽挂载任务型首页。新增独立 `teek.config.mts` 管理精简配置；现有人工导航、本地搜索和代码分组继续由站点配置负责。使用静态产物检查与真实浏览器交互两层验收。

**Tech Stack:** VitePress 1.6.4、Teek 1.6.2、Vue 3 / TypeScript、pnpm 12.8.1、Node 内置测试、browser-skill。

**Spec:** `docs/superpowers/specs/2026-11-01-teek-theme-design.md`（已确认）。

## Global Constraints

- VitePress 固定 1.6.4；Teek 固定 1.6.2，不额外升级框架。
- 保留所有既有文档 URL、安装正文、人工侧栏、local search 和 group-icons。
- 不启用博客首页、评论、统计、壁纸、外部字体、自动 frontmatter、永久链接或自动侧栏。
- 保留任务型首页三个入口、八步清单、版本表和安全提示；不得因 UI 更新改变内容核对日期。
- 设计及计划不得进入构建、搜索、sitemap 或 Teek posts 数据。
- 保留工作区原有未提交的 DSH / DSH-TUI 修改；禁止整体 reset/restore、清理未跟踪文件或覆盖 config。
- 本计划不授权部署、推送或自动提交；需要提交时仅提交本任务增量，不能把先前工作一起提交。

## Review Focus

1. 嵌套 base 下首页自写 href：必须进入 `/theme-check/` 下正确目标，不跳回站点根目录（任务 2、4）。
2. `cleanUrls=false` 下首页与侧栏链接：应使用可用的 `.html` / `index.html` 目标，不只验证根路径（任务 2、4）。
3. 现有胶片头与 Teek 自动标题：每页只出现一个主标题，代码分组复制不丢行（任务 1、3）。
4. VitePress 源排除不等于 Teek 文件扫描排除：设计文字不得藏进 posts 数据或搜索 chunk（任务 1）。
5. 手机上长路径、命令和宽表格：局部滚动，不撑宽页面，不遮挡菜单和复制按钮（任务 3、4）。

## 已核实的 1.6.2 接口与实现细节

核对源为 npm 发布物，不以旧 Wiki 代替实际版本：

- `vitepress-theme-teek` 默认导出包含 `extends`、`Layout`、异步 `enhanceApp`。继承该主题，不手动重复调用 enhanceApp，也不直接用裸 `TkLayout` 绕开 ConfigProvider。
- CSS 入口：`vitepress-theme-teek/index.css`。先导入主题，再加载本站变量和组件样式，最后保留 `virtual:group-icons.css`。
- `defineTeekConfig` 从 `vitepress-theme-teek/config` 导入。它返回 VitePress 配置，作为现有配置的 `extends`；它会设置 `ignoreDeadLinks: true`，本站必须显式覆盖为 `false`。
- 该函数默认启用 sidebar、permalink、mdH1、docAnalysis；即使关闭这些，仍注册 Catalogue 和 FileContentLoader。不能假设 `srcExclude` 会传给这些插件。
- `vitePlugins.fileContentLoaderIgnore: ['**/superpowers/**']` 可排除 posts 扫描。Catalogue 没有布尔关闭项，本项目不启用 catalogue 页面，并检查最终产物未泄露设计文字。
- `teekHome: false, vpHome: true` 关闭博客首页并保留默认首页容器；源码确实转发 `home-hero-before`，不需要第二套布局。
- `articleAnalyze.showInfo: false` 关闭文章元信息；`articleUpdate.enabled: false` 关闭主题更新栏；`codeBlock.enabled: false` 保留 VitePress 原生代码块和复制行为，避免与 group-icons 重复改造 DOM。
- `windowTransition: false`、`viewTransition: { enabled: false }` 关闭非必要动效；`themeEnhance: { enabled: false }` 避免用户偏好面板覆盖本站布局及颜色。

参考：
[配置实现](https://unpkg.com/vitepress-theme-teek@1.6.2/es/config/index.mjs)、[插件实现](https://unpkg.com/vitepress-theme-teek@1.6.2/es/config/vite-plugins.mjs)、[布局实现](https://unpkg.com/vitepress-theme-teek@1.6.2/es/components/theme/layout/src/index.vue2.mjs)、[类型定义](https://unpkg.com/vitepress-theme-teek@1.6.2/es/config/types.d.ts)、[VitePress srcExclude](https://github.com/vuejs/vitepress/blob/v1.6.4/docs/en/reference/site-config.md)。

## 文件结构

| 文件 | 职责 |
| --- | --- |
| `docs/.vitepress/teek.config.mts`（新增） | 精简主题配置，集中禁用不需要的能力 |
| `docs/.vitepress/config.mts` | extends、srcExclude、严格死链检查，保留原有配置 |
| `docs/.vitepress/theme/index.ts` / `Layout.vue` | Teek 继承、样式顺序和首页插槽 |
| `docs/.vitepress/theme/Home.vue` | 任务首页内容及部署安全链接 |
| `docs/.vitepress/theme/home-links.mjs`（新增） | 首页 URL 纯函数，支持 base 与 cleanUrls |
| 四份现有 CSS | 品牌变量、业务组件、首页样式和窄屏行为，不重复覆盖主题框架 |
| `scripts/check-theme.mjs`（新增） | 构建产物验收，支持指定 dist 和 base |
| `scripts/check-links.mjs` | 修复已有检查器对 .html 与 base 的处理，保持默认命令兼容 |
| `tests/theme-artifacts.test.mjs`（新增） | 产物检查器 fixture 测试 |
| `tests/home-links.test.mjs`（新增） | 首页链接函数测试 |
| `package.json` / `pnpm-lock.yaml` | 固定主题依赖及验证脚本 |
| `DESIGN.md` | 同步新视觉决策 |

### Task 1: 接入可构建且不泄露内部文档的 Teek 框架

**Files:** 新增 `teek.config.mts`、`scripts/check-theme.mjs`、`tests/theme-artifacts.test.mjs`；修改 package、lock、config、theme/index、Layout。

**Interfaces:**
- `teek.config.mts` 默认导出 `defineTeekConfig(...)` 的结果。
- `check-theme.mjs` 导出 `async inspectThemeArtifacts(dist: string, base: string = '/'): Promise<string[]>`；返回问题列表，CLI 传 `--dist`、`--base`，非空列表退出 1。
- `package.json` 新增 `verify:theme: 'node scripts/check-theme.mjs'`，默认检查 `docs/.vitepress/dist`。

- [ ] 记录 `git status --short` 和现有文件差异，以当前工作区为回退基线，不以 HEAD 覆盖先前修改。先运行 `pnpm build`、`pnpm verify:links`，记录设计文件造成的新增公开页，不能把它们计为应保留的页面。
- [ ] 编写 `theme-artifacts.test.mjs`，使用临时目录 fixture 检查：出现 `superpowers/*.html`、sitemap 中 `/superpowers/`、搜索或 posts chunk 含设计独特标题均报告错误；普通正文引用 Teek 字样不误报。fixture 明确包含正常 index、DSH 和 DSH-TUI 页面。
- [ ] 运行 `node --test tests/theme-artifacts.test.mjs`，确认因检查函数未实现而失败。
- [ ] 实现检查器：遍历构建目录；要求 index、guide/order、env/nodejs、apps/dsh/index、apps/dsh-tui/index、migrate/backup 的 HTML 存在；扫描 HTML/XML/JS/JSON 的内部文档路径和独特标题。要求 HTML 中存在 `tk-layout`，不要以某个完整哈希文件名作为断言。
- [ ] 运行 fixture 测试通过，再对旧主题产物执行 `pnpm verify:theme`，应因缺少 Teek 或内部文档泄露失败；记录具体失败。
- [ ] 执行 `pnpm add -D -E vitepress-theme-teek@1.6.2`；检查 VitePress 仍为 1.6.4。依赖解析失败先诊断，不改包管理器策略或升级框架。
- [ ] 新建配置：`teekTheme: true, teekHome: false, vpHome: true, pageStyle: 'default', anchorScroll: false, windowTransition: false, viewTransition: { enabled: false }, themeEnhance: { enabled: false }, codeBlock: { enabled: false }, articleAnalyze: { showInfo: false, imageViewer: { enabled: false } }, articleUpdate: { enabled: false }, articleShare: { enabled: false }, comment: false, notice: { enabled: false }, siteAnalytics: []`。`vitePlugins` 设 `sidebar/permalink/mdH1/docAnalysis/autoFrontmatter: false` 和 `fileContentLoaderIgnore: ['**/superpowers/**']`。不提供统计 provider、图片或作者信息。
- [ ] config 增加 `extends: teekConfig`、`ignoreDeadLinks: false`、`srcExclude: ['superpowers/**']`；保留 group-icons 与原有 markdown 回调，不注册两次。theme/index 改为 `extends: Teek`，导入其 index.css；Layout 改用 `const { Layout: TeekLayout } = Teek`，保持首页插槽。保持 Vue `<script setup lang="ts">`。
- [ ] `pnpm build`、`pnpm verify:theme`、`pnpm verify:links`、fixture 测试全通过；检查 Teek 没改写安装正文/frontmatter、源码页数未意外增加。若字段类型与发布物不符，以对应声明核实后修改，不用 any 绕过。

### Task 2: 保留任务首页并修正部署链接

**Files:** Home.vue、home-links.mjs、home-links.test.mjs、home.css、home-extra.css、tokens.css。

**Interfaces:**
- `home-links.mjs` 导出 `homeLink(path: string, base: string, cleanUrls: boolean): string`。只接收站内根路径；`/` 保持 base；cleanUrls=false 时目录路径补 `index.html`，普通路径补 `.html`；cleanUrls=true 保留原路径形态。
- Home 从 `useData().site.value` 读取 `base` / `cleanUrls`，所有链接统一调用 `homeLink`，不再拼 `'.' + path`。

- [ ] 写 `home-links.test.mjs`：`homeLink('/guide/order','/theme-check/',true)` 等于 `/theme-check/guide/order`；false 等于 `/theme-check/guide/order.html`；`('/apps/dsh/','/theme-check/',false)` 等于 `/theme-check/apps/dsh/index.html`；`('/', '/theme-check/',false)` 等于 `/theme-check/`；已经 `.html` 不重复追加，`#` / `?` 后缀保留在扩展名后。
- [ ] `node --test tests/home-links.test.mjs` 确认失败，再实现纯函数并运行通过。
- [ ] Home 所有链接使用统一函数；保持标题、三个入口、八个步骤、版本表及安全提示原文。删除没有内容的默认 Hero 全局隐藏补丁；只在 `.home-wrap` 或 `.VPHome` 内调整首页，不影响其他页面。
- [ ] 首页桌面保留导语/步骤双栏，约 960px 以下单栏；三个入口中「从第一步开始」作为主操作，其余为次操作。步骤区使用浅边框容器；不加渐变和大阴影。版本表只在自身容器滚动。
- [ ] 浏览器检查首页只有一个 H1、一套首页内容、步骤总数为 8，入口确实导航到目标。使用 390px 验证正文顺序和触摸入口不重叠；1440px 验证双栏。根路径与 base 路径都检查。

### Task 3: 统一文档正文与明暗样式

**Files:** tokens.css、components.css、home.css、home-extra.css、DESIGN.md。

**Interfaces:** 保留 `.filmhead`、`.badge`、`.spec`、`.timeline` 等既有类名，安装 Markdown 无需迁移。

- [ ] 浏览器先记录未调整时 Node.js、DSH、DSH-TUI 的标题数量、表格和代码组；新增产物断言：这些页恰好一个 H1，不允许自动生成的重复主标题。若旧页面本来没有 H1，使用其现有语义标题修正局部组件，先说明，不批量改写教程。
- [ ] 使用原有品牌色：浅色 `#0E7C86`、深色 `#3FBFB0`；保留系统字体。正文 16px、行高约 1.75；常规内容容器圆角 8px、代码块 6px；焦点轮廓清晰，动画在 reduced-motion 下禁用。不用全局 `*` 重置主题组件。
- [ ] 通读四份 CSS，去掉全局隐藏 Hero、过度压平主题布局、重复表格/标题覆盖；保留并限定业务组件作用域。表格局部滚动、路径换行、代码块局部横向滚动；不能用 body overflow-x:hidden 掩盖溢出。
- [ ] 更新 DESIGN.md：替换拒绝第三方主题及零圆角的旧决定，注明 Teek 固定版本、哪些插件关闭及 CSS 作用域；保留离线字体、安全与时间线原则。
- [ ] 桌面及 390px 在浅/深色模式逐一检查关键页面；`document.documentElement.scrollWidth <= innerWidth + 1`。长路径、宽表格、代码组需实看，不能只依赖这个总宽度断言。
- [ ] 实际切换代码组，点击复制并在临时文本框或可验证剪贴板权限下核对完整命令，移除临时验证 DOM；验证目录锚点、键盘焦点和明暗切换。检查应用控制台和网络，无新增错误、404、统计/评论/字体请求。

### Task 4: 部署选项回归与交付

**Files:** scripts/check-links.mjs、tests/theme-artifacts.test.mjs（补充 fixture）、package.json（仅验证脚本）。

**Interfaces:** check-links 默认行为不变，增加 `--dist <dir>`、`--base <path>`；将链接转文件的纯函数导出为 `linkCandidates(href: string, base: string): string[]` 供测试，直接 import 时不得触发 CLI。

- [ ] 增加 fixture：`/theme-check/guide/order.html` 对应 `guide/order.html`（不得变成 .html.html）；`/theme-check/apps/dsh/` 对应 `apps/dsh/index.html`；`?q=x#anchor` 不影响文件解析；非本 base 的站内根路径报告越界而非静默跳过；忽略协议相对外链。
- [ ] 运行测试确认旧检查器缺少接口而失败，实施 CLI 参数与纯函数后全部通过。这个改动只服务本次 base/.html 回归，不升级成通用爬虫。
- [ ] 默认构建运行 `pnpm build; pnpm verify:links; pnpm verify:theme`，每条命令检查退出码，任一失败先修复。
- [ ] PowerShell 子路径构建：`$env:DOCS_BASE='/theme-check/'; pnpm exec vitepress build docs --outDir .vitepress/dist-base-check`。运行两个检查器指定该目录和 base，再用 `pnpm exec vitepress preview docs --outDir .vitepress/dist-base-check --port 4174` 真实浏览器访问 `/theme-check/`，检查首页入口、资源、搜索和文档页。结束后清除本次设置的 DOCS_BASE。
- [ ] `.html` 组合构建：设置 DOCS_BASE 为 `/theme-check/`、DOCS_CLEAN_URLS 为 `false`，输出 `.vitepress/dist-html-check`，检查器和浏览器验证 `.html` 与目录 index 链接。完成后清除本次环境变量。HTTP 测试不声称验证了 file:// 离线行为。
- [ ] 搜索 `DSH-TUI` 能找到教程，搜索设计独特标题无结果；直接访问排除的设计路径返回 404。所有模式检查一次，设计标题不能只从首页消失却保留在 chunk。
- [ ] `git diff --check`、所有 Node tests、默认构建及两个产物检查再跑一次；保留终端结果与浏览器核验清单。浏览器会话停止；收集所有后台任务输出，停止本次预览服务，不停止用户原有 daemon。
- [ ] 检查 diff：教程正文与 site.lastChecked 未被主题自动修改，DSH 导航仍在。汇报截图可读性限制、未验证项目及剩余问题；未达标不宣称完成。

## 回退与执行方式

每个任务以验证通过作为检查点，不自动提交。回退只撤销执行前基线之外的本次差异；共享 config 文件逐段恢复，不使用 `git restore` 丢弃已有 DSH 导航。

推荐 **Native（本会话由主代理顺序实施，最后独立审阅）**：四个任务共享配置与 CSS，顺序处理比多代理同时改样式更稳妥，成本更低。另一选择是逐任务子代理实施与独立审阅，隔离更强、上下文成本更高。

当前仅完成计划编写。用户审阅计划并选择执行方式后，才进入实施。
