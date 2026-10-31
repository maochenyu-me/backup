# 进度记录

> 最后更新：2026-10-31
> 状态：**可用，已本地提交**（`main` 分支，1 个 commit）。等待远端仓库地址后推送。

给接手的人（或未来的自己）：这份文件记录**已经做完了什么、为什么这么做、还剩什么**。
设计理由见 [DESIGN.md](DESIGN.md)，使用说明见 [README.md](README.md)。

---

## 1. 当前状态

| 项 | 状态 |
| --- | --- |
| 站点工程 | ✅ 完成，VitePress 1.6.4 |
| 内容页 | ✅ 24 个（构建出 25 个 HTML） |
| 设计系统 | ✅ 完成（令牌 + 组件样式 + 首页版式） |
| 多端分栏 | ✅ code-group + 平台图标 |
| 明暗模式 | ✅ 跟随系统 + 手动切换 |
| 移动端 | ✅ 390px 验证无溢出、汉堡菜单正常 |
| Skills 自动清单 | ✅ 脚本生成，72 + 47 条 |
| 内链校验 | ✅ 24 个唯一内链全通 |
| 构建 | ✅ `pnpm build` 通过（约 7 s） |
| 部署配置 | ✅ 四平台配置齐备 |
| 远端仓库 | ⏳ 等用户提供 GitHub 地址 |
| 域名 | ⏳ `site.config.mts` 里 `hostname` 仍是占位符 |

**验证方式**：Playwright 程序化验收 194 项断言全通过（当前运行模型读不了截图，
所以全部用 DOM 断言：HTTP 状态、h1、横向溢出、斑马纹残留、列表 marker、
品牌色变量、暗色变量切换、移动端侧栏与汉堡菜单、内链逐个请求、控制台错误）。

---

## 2. 已核实的本机事实（2026-10-31）

这些数字直接写进了「版本快照」页，改动前请先核对。

**基础环境**

| 工具 | 版本 | 来源 |
| --- | --- | --- |
| Node.js | 24.21.0 | `winget` `OpenJS.NodeJS.LTS` |
| npm | 12.2.0 | 随 Node |
| pnpm | 12.8.1 | `npm i -g` |
| Git | 2.56.0.windows.4 | `winget` `Git.Git` |
| Hugo | 0.166.0+extended | `winget` `Hugo.Hugo.Extended` |
| hexo-cli | 4.3.2 | `npm i -g` |
| corepack | 0.36.0 | 随 Node |
| yarn | 1.22.22 | `npm i -g` |

**软件**

| 软件 | 版本 | 备注 |
| --- | --- | --- |
| Chrome | 156.0.8078.79 | 非 winget 装 |
| FlClash | 0.8.99+2026100301 | `chen08209.FlClash` |
| Steam | 2.10.91.91 | 装在 `E:\steam` |
| WorkBuddy | 5.9.2 | winget 源只有 5.8.3，更新慢 |
| OpenCode | 2.2.5 | 独立安装包，主目录 `E:\opencode` |

**关键路径**

| 用途 | 路径 |
| --- | --- |
| OpenCode 全局配置 | `E:\opencode\data\config\opencode\`（XDG 重定向） |
| OpenCode 密钥 | `E:\opencode\data\secrets\`（`relay*.key` / `relay*.url`） |
| OpenCode 插件 | `E:\opencode\plugins\` |
| OpenCode skills | 上述配置目录下 `skills/`（6 个）、`~/.config/opencode/skills/`（11 个）、`~/.agents/skills/`（65 个） |
| WorkBuddy 数据 | `%USERPROFILE%\.workbuddy\` |
| WorkBuddy skills | `%USERPROFILE%\.workbuddy\skills\`（47 个） |
| FlClash 配置 | `%APPDATA%\com.follow\clash\` |
| pnpm store | `E:\.pnpm-store\v11` |
| Git 代理 | `127.0.0.1:7080`（FlClash 端口，换机时容易不同步） |

**XDG 环境变量（迁移 OpenCode 时必须一起搬）**

```
XDG_CONFIG_HOME = E:\opencode\data\config
XDG_DATA_HOME   = E:\opencode\data\share
XDG_CACHE_HOME  = E:\opencode\data\cache
XDG_STATE_HOME  = E:\opencode\data\state
```

---

## 3. 内容可信度：哪些是查过的

| 内容 | 核实方式 |
| --- | --- |
| 全部 winget 包 ID 与版本 | `winget show <id>` 实跑 |
| Node / pnpm / Hugo / Git / Hexo / OpenCode / FlClash 安装命令 | fetch 官方文档原文比对 |
| OpenCode skills 搜索路径、frontmatter 规则、`{file:...}` 写法 | `opencode.ai/docs/skills/` 与 `/docs/config/` |
| FlClash 平台包格式、托盘依赖、headless 变量 | GitHub README |
| WorkBuddy 产品定性、文档域名、skills 目录 | `workbuddy.cn` 页面与 schema.org 数据 |
| 本机 git 配置项 | `git config --global --list` |
| npm 全局包清单 | `npm ls -g --depth=0` |

**没做的验证**：没有在沙箱里真跑这些安装命令（用户明确要求不要在本机安装新东西）。
所有命令都是「官方文档 + 包管理器元数据」双重核对，页面已标注核对日期。

---

## 4. 开发中踩到的坑（别重复踩）

| 坑 | 现象 | 解法 |
| --- | --- | --- |
| pnpm 12 的构建白名单 | `ERR_PNPM_IGNORED_BUILDS: esbuild` | pnpm 12 改用 `pnpm-workspace.yaml` 的 `allowBuilds: { esbuild: true }`（映射，不是数组）；`package.json` 的 `pnpm` 字段已失效 |
| VitePress 选择器特异性 | 自定义样式被静默压掉 | 覆盖一律带 `.vp-doc` 前缀 |
| 首页整页空白 | `Layout.vue` 判断 `frontmatter.home` | 应为 `frontmatter.layout === 'home'` |
| `home-wrap` 选择器 | 写成 `.vp-doc .home-wrap` 无效 | 它自己就是 `.vp-doc` 元素，应用 `.vp-doc.home-wrap` |
| `config.mts` 改函数式导出 | 少一个 `}`，esbuild 报 `Expected ";"` | 函数式要多一层 `return {}` 的闭合 |
| 预览服务器与重建 | 截图里 CSS 全丢 | 重建后必须重启 `vitepress preview` |
| code-group 图标 | 只有 npm/pnpm/yarn 标签自动带图标 | 用命名图标语法 `[Windows（winget） ~simple-icons:windows11~]`，并装 `@iconify-json/simple-icons` |

---

## 5. 目录速查

```
docs/.vitepress/site.config.mts   ★ 站名/副标题/核对日期/域名/首页步骤 —— 改这里
docs/.vitepress/config.mts          导航、侧栏、插件、base 处理
docs/.vitepress/theme/tokens.css     设计令牌（唯一改颜色的地方）
docs/.vitepress/theme/components.css 胶片头/定义列表/时间线/表格/提示块
docs/.vitepress/theme/home.css       首页版式
docs/.vitepress/theme/home-extra.css 首页收尾与特异性修正
docs/.vitepress/theme/Home.vue       首页内容（含清单表）
docs/.vitepress/theme/Layout.vue     把 Home 挂进默认主题
scripts/gen-skills.mjs               扫描本机 skills → 生成两个清单页
scripts/check-links.mjs              构建产物内链校验
```

每页固定七段：定位 → 干什么用 → 装（三端分栏）→ 验证 → 配置在哪 → 备份与还原 → 官方链接。

---

## 6. 还没做的（按优先级）

1. **推送到远端仓库** —— 等用户给地址。
   ```powershell
   git remote add origin <url>
   git push -u origin main
   ```
2. **设 `DOCS_BASE`**（仅 GitHub Pages 项目页需要）：仓库 Variables 里加 `DOCS_BASE=/<仓库名>/`
3. **填真实域名**：`docs/.vitepress/site.config.mts` 的 `hostname`（影响 sitemap）
4. **过目 OpenCode 模型清单**：`docs/apps/opencode/index.md` 里的模型示例只保留了 1 个
   （`deepseek-v4.1-flash`）做结构示范，实际本机有 20+ 个，按需补
5. **考虑是否要 `robots.txt`**：这是个人环境清单，公开部署时可以禁止收录以降低暴露面
6. **可选**：把 `pnpm skills` 加进 git pre-commit，避免 skills 清单长期不更新

---

## 7. 给下一位 agent 的建议

**建议加载的 skills**

| skill | 什么时候用 |
| --- | --- |
| `frontend-design` | 要改视觉、加组件、调版式时 —— 先读它，避免把站点做成模板脸 |
| `brainstorming` | 要加新功能（如勾选式清单、离线包）之前，先过设计关 |
| `playwright-skill` | 任何视觉/响应式验证。本项目已建立程序化断言模式，见下 |
| `systematic-debugging` | 样式不生效时 —— 九成是特异性问题，别猜 |

**验证脚本模式**（复用性高，建议保留这个思路）

在 `E:\CSharp\Temp\opencode\` 下有本次用的三个脚本，可复制改造：

- `vp-shots.cjs` —— 批量截图（明/暗/移动端）
- `vp-audit.cjs` —— 194 项 DOM 断言（最有用，改任何样式后跑一遍）
- `vp-measure.cjs` —— 量具体元素的 bounding box 与 computed style

运行方式：

```powershell
pnpm build
npx vitepress preview docs --port 4177
$env:TARGET_URL="http://localhost:4177"
$env:SKILL_DIR="E:\opencode\data\config\opencode\skills\playwright-skill"
node "$env:SKILL_DIR\run.js" "E:\CSharp\Temp\opencode\vp-audit.cjs"
```

**改内容时的三条规矩**

1. 改完任何页，更新页内和 `site.config.mts` 的 `lastChecked`
2. 装了什么新版本 → 同步改「版本快照」页 + 对应条目页的徽标
3. 绝不把真实密钥/订阅链接写进文档（见 `docs/migrate/secrets.md`）

---

## 8. 提交历史

```
11a1362  docs: add progress handoff; fix multi-platform code labels, offline build flags, robots
712479e  feat: setup handbook vitepress site
```

工作区干净，`node_modules` / `dist` / `cache` 已在 `.gitignore` 里。

### 第二轮补做的事（本次）

- 修正 code-group 标签批量替换的副作用：`[macOS / Linux]` 曾被压成 `macOS（Linux）`，
  丢失"双平台"语义；跨平台标签现在不带单平台图标（图标只在单平台标签上用）
- `cleanUrls` 改为可切换：`DOCS_CLEAN_URLS=false` 供离线包使用
  （开着 cleanUrls 时链接是 `./guide/order` 而文件叫 `order.html`，`file://` 会 404）
- 新增 `docs/public/robots.txt`，全站禁止收录（个人环境清单，降低暴露面）
- `package.json` 加 `engines`（node >=20.19, pnpm >=10）
- 已验证三种构建形态：
  - 默认根路径：资源为 `/assets/`
  - GH Pages 子路径 `DOCS_BASE=/setup-handbook/`：资源与 favicon 均带前缀，残留 0
  - 离线相对 `DOCS_BASE=./`：资源与站内链接均为 `./` 开头

