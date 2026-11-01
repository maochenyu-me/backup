# Teek 视觉修订 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把保留旧外观的主题接入修正为结构明显不同的任务首页与分层文档页。

**Architecture:** Teek 保持单一框架；VitePress 原生 Hero 展示标题与三个操作，通过 home-hero-after 挂载轻量 Home 内容编排组件。原 Home 的版本表和安全提醒拆成独立展示组件；删除旧 masthead 样式和全局正文压平覆盖，新增有限的文档内容面样式。

**Tech Stack:** VitePress1.6.4、Teek1.6.2、Vue3 Composition API、Node tests、browser-skill。

**Spec:** `docs/superpowers/specs/2026-11-01-teek-visual-revision-design.md`（用户已回复“开始”确认修订设计；本计划待确认）。

## Global Constraints

- 保留八步、三个入口、现有版本表事实、安全提醒、安装正文、URL、核对日期及人工导航。
- 不新增博客文章流、评论、统计、外部字体、依赖升级或动画。
- 在现有工作区增量修改，不重置上一轮主题或 DSH 文档改动；不提交、推送、部署。
- 保留单布局、单页脚、单 H1、内部设计双重排除与所有部署模式。
- 不能以 DOM/构建成功代替截图视觉验收；读图仍受阻时请用户实际查看。

## Review Focus

1. 原生 Hero 的链接归一化可能与 homeLink 重复加 base：Hero 只给根相对路径，由 VPButton 处理；任务区继续调用 homeLink（Task1/3）。
2. Hero/自定义标题同时输出造成重复 H1：首页只由 Hero 输出 H1（Task1）。
3. 新旧 CSS 同时生效，视觉又退回旧版：不再导入 home-extra.css，重写 home.css，移除 masthead 与全局压平规则（Task1/2）。
4. 内容面内边距挤压手机长命令和路径：390px正文减边距，表格局部滚动，测试页面总宽和局部溢出（Task2/3）。
5. 预览打开旧 dist、错误 base 或未加载 CSS：明确 DOCS_OUT_DIR、检查实际 stylesheet URL与版本标记，不把旧页面证据当新结果（Task3）。

## 已核实接口

VitePress1.6.4 官方文档和已安装源码：VPHomeHero 仅在 frontmatter.hero 存在时渲染；name/text/tagline/actions 是原生字段；home-hero-after 在 Hero 之后。VPButton 使用 normalizeLink 归一化 href，故 Hero.actions 使用 `/guide/order` 等根相对路径，不预先拼 base。VPDoc 的 `.content-container` 包含 main 与文档页脚，可作为内容面，不另包第二层 main。

来源：https://github.com/vuejs/vitepress/blob/v1.6.4/docs/en/reference/default-theme-home-page.md 与 docs/en/guide/extending-default-theme.md；Teek 转发插槽需在实施前再核实其已安装 Layout。

## 文件职责

- `docs/index.md`：原生 Hero 与 `pageClass: handbook-home`，保留 layout:home。
- `theme/Layout.vue`：home-hero-after 挂 Home；保留单页脚适配。
- `theme/Home.vue`：编排三个子区域，不再输出 H1/旧 masthead。
- 新建 `theme/components/HomeSteps.vue`：从 site.steps 读取八步，homeLink 生成 href。
- 新建 `theme/components/HomeSnapshot.vue`：搬迁原八行表格和完整版本表链接，不改事实。
- 新建 `theme/components/HomeSafety.vue`：搬迁原安全提示。
- `theme/home.css`：仅 handbook-home/Home 子区域的 Hero、栅格与容器布局。
- 新建 `theme/docs.css`：文档内容面与侧栏层次；`tokens.css` 仅品牌/字体/必要明暗色。
- `theme/components.css`：业务组件，不再全面覆盖原生表格、标题、代码、提示块。
- `theme/index.ts`：主题、变量、业务样式、docs、home、group-icons；停止导入 home-extra.css（旧文件不必删除）。
- `scripts/check-theme.mjs` / `tests/theme-artifacts.test.mjs`：新增首页真实产物结构检查；保留原全部校验。

## Task 1：原生 Hero 与任务网格首页

**Interfaces:** 子组件无 props/emits，读取只读 site 配置及 useData；不新增持久状态。`.home-steps` 为八个链接的列表，`.home-snapshot` 为版本内容面，`.home-safety` 为安全区；外层 `.handbook-home-content`。

- [ ] 保存本轮执行前差异基线，运行 pnpm test、pnpm build、pnpm verify:links、pnpm verify:theme。
- [ ] 扩展产物 fixture：正常首页含 `VPHomeHero`、`.home-steps` 下八个链接；新增缺少 Hero、七个步骤、旧 `.masthead` 残留三个失败场景。测试检查 DOM标签/类与数量，不检查整个HTML字符串或哈希。
- [ ] 运行新增测试确认失败；再扩展 inspectThemeArtifacts，只对首页启用上述约束，给正常 fixture 补最小有效首页。旧产物应不满足新首页要求。
- [ ] index.md 增加 Hero：name换机手册、text换一台电脑，半天回到工作状态。、tagline沿用旧首页导语；actions沿用三个入口文字及路径。site.config 的 title/tagline仍为事实源，实施时在 config.transformPageData 首页分支读取 site 值写 hero.name/text，避免两处漂移；不改变 lastChecked。
- [ ] 拆出三个展示子组件；Home只编排区域与核对日期；Layout 从 home-hero-before 改用 home-hero-after。停止加载旧 home-extra，home.css 重写为新作用域。
- [ ] `.home-steps` 使用 >=1100px四列、640–1099px两列、<640px单列，gap16px；卡片12px圆角、24px内边距、细边框；Hero不加图片或渐变。版本表外层局部 overflow-x:auto。
- [ ] pnpm test/build/verify:theme/verify:links通过，确认首页一H1、三个原生入口、八步骤、八版本行且无旧 masthead。

## Task 2：文档内容面与旧覆盖退场

**Interfaces:** `.VPDoc .content-container` 是唯一正文内容面；业务类 filmhead/badge/spec/timeline保留。首页和文档CSS分离。

- [ ] 在浏览器记录 Node/DSH/DSH-TUI 现状：body/content背景、边框、radius、正文宽度及总scrollWidth，作为修正前证据。
- [ ] 删除 components.css 中全局表格去边框、提示块透明、H2分隔线与代码标签压平规则；保留业务类和无障碍规则。tokens保留青色品牌、字体栈、明暗底色，不重设主题标题/表格排版。
- [ ] 新增 docs.css：>=960px正文内容面12px圆角、1px分隔色边框、32px内边距；手机取消内容面边框及多余内边距。侧栏背景与正文区分，当前链接可辨认；不改主题源文件，不隐藏body溢出。
- [ ] 重画filmhead/spec为同一内容面内的层次，不再重复一个重卡片；保留原Markdown不变。table恢复原生样式且自身横滚；inline code长路径可换行，代码块保留原生滚动。
- [ ] 390px/桌面两种模式检查首页及Node/DSH/DSH-TUI/顺序/备份；断言 scrollWidth<=innerWidth+1、正文>=16px，桌面内容面与页面底不同，手机内容宽度不因32px重复内边距损失。通过浏览器结果验证，不写只匹配CSS源码的测试。
- [ ] 更新 DESIGN.md，说明新首页结构、12px内容面与旧覆盖退出；pnpm build及全部checks通过。

## Task 3：部署、交互与用户视觉验收

**Interfaces:** 保留 DOCS_BASE/DOCS_CLEAN_URLS/DOCS_OUT_DIR、homeLink 和两个产物检查器现有接口；每种预览在独立进程设置匹配env。

- [ ] 默认构建和子路径两模式构建：DOCS_OUT_DIR分别使用绝对 docs/.vitepress/dist-base-check、dist-html-check；pnpm build后两个检查器指定相同dist/base并检查退出码。不得同时构建共享临时缓存。
- [ ] 浏览器明确访问对应预览URL，核对stylesheet含正确base且成功加载；点击三个Hero入口与步骤中的目录型链接，确认不重复base、不丢.html。
- [ ] 搜索DSH-TUI、检查内部标题不入索引、移动菜单、目录锚点、键盘焦点与明暗切换；代码组切换后复制完整命令。文档无焦点时请求用户将Agent窗口置前，不能伪造剪贴板成功。
- [ ] 同一浏览器地址展示首页和Node页，请用户查看新结构；能读图则审阅截图，仍受工具能力阻断则报告并等待用户视觉确认。仅自动检查不能判定最终UI完成。
- [ ] 运行 pnpm test/build/verify:theme/verify:links、两种部署产物checks及git diff --check；独立审阅全部本轮差异并处理重要问题。
- [ ] 验证教程正文与lastChecked diff未改变；记录结果及未完成项；收集后台任务，停止本次测试服务，不停止既有browser daemon。用户查看用预览若需保留，先明确地址及停止方式。

## 执行方式与回退

沿用用户此前选择的 **Native**：主代理顺序修改，最终独立审阅。不自动commit；逐文件保存执行前基线，仅撤回本轮增量。该计划需用户确认后实施，不能以“开始”对设计的确认跳过尚不存在的计划审阅。
