# 换机手册

> **目前仅供自用。** 本指南记录个人电脑的实际环境与换机流程，不是面向公众的通用安装教程；版本、路径和配置选择均以个人环境为准，不保证适用于其他机器。密钥、令牌等敏感信息仍不写入文档。

一份给自己用的换机交接单：记录电脑基础环境与常用软件的**版本、装法、配置路径、备份还原方法**。
新机器到手照着 [换机顺序](docs/guide/order.md) 走一遍；老机器退役前照着 [备份清单](docs/migrate/backup.md) 把该拷的拷走。

> 站点内容全部中文，明暗模式自适应，Windows / macOS / Linux 三端命令分栏。

## 快速开始

```powershell
pnpm install
pnpm dev          # 本地开发  http://localhost:5173
pnpm build        # 构建到 docs/.vitepress/dist
pnpm preview      # 预览构建产物
pnpm skills       # 重新扫描本机 skills 目录，刷新两个 Skills 清单页
pnpm verify:links # 校验构建产物里的内链（先 build）
```

环境要求：Node.js 20+（本机 24 LTS），pnpm 10+（本机 12）。

## 目录结构

```
docs/
├── .vitepress/
│   ├── site.config.mts    ★ 站名、副标题、核对日期、仓库地址 —— 改这里
│   ├── config.mts           VitePress 配置（导航、侧栏、插件），一般不动
│   └── theme/
│       ├── tokens.css       设计令牌：色板、字体栈、圆角
│       ├── components.css   胶片头 / 定义列表 / 时间线 / 表格 / 提示块
│       ├── home.css         首页版式
│       ├── Layout.vue       把自定义首页挂进默认主题
│       └── Home.vue         首页内容
├── guide/                   换机顺序、版本快照、使用说明
├── env/                     Node.js / npm / pnpm / Git / Hugo / Hexo
├── apps/                    Chrome / FlClash / Steam / DSH / DSH-TUI / OpenCode / WorkBuddy / 顺带项
├── migrate/                 备份清单 / 密钥与脱敏 / 恢复演练 / 部署本站
└── public/logo.svg

scripts/
├── gen-skills.mjs           扫描本机 skills 目录 → 生成两个 Skills 清单页
└── check-links.mjs          内链校验
```

## 内容维护

| 要做什么 | 怎么做 |
| --- | --- |
| 改站名 / 副标题 | 编辑 `docs/.vitepress/site.config.mts` |
| 装了新版本 | 改对应页面顶部胶片头里的版本徽标 + `site.config.mts` 的 `lastChecked` |
| 装了新 skill | 什么都不用改，重跑 `pnpm skills` 即可刷新清单 |
| 加新软件页 | 在 `env/` 或 `apps/` 建 `.md`，仿照现有页面的七段结构，并加进 `config.mts` 侧栏 |
| 校对链接 | `pnpm build && pnpm verify:links` |

### 每页固定七段

定位一句话 → 干什么用 → 装（三端分栏）→ 验证 → 配置在哪 → 备份与还原 → 官方链接。
所有命令标注核对日期；写不进来的密钥一律占位符（原因见站内「密钥与脱敏」页）。

## 部署

四个平台都支持，配置文件已就位：

| 平台 | 配置 | 备注 |
| --- | --- | --- |
| GitHub Pages | `.github/workflows/deploy.yml` | 项目页需在仓库 Variables 设 `DOCS_BASE=/<仓库名>/` |
| Vercel | `vercel.json` | 零额外配置 |
| Cloudflare Pages | `wrangler.jsonc` | 或 dashboard 填 build 命令 |
| EdgeOne Pages | dashboard 配置 | 构建命令 `pnpm build`，输出 `docs/.vitepress/dist` |

`base` 通过环境变量 `DOCS_BASE` 控制，见 `docs/.vitepress/config.mts`。

## 设计约定

- **一个强调色**（信号青 `#0E7C86`，暗色 `#3FBFB0`）只表达「可点击」；琥珀色只表达「需注意」
- **零卡片、零阴影堆叠**，信息密度靠字重、等宽数字、hairline 分隔建立
- **不引 web 字体** —— 换机场景可能离线，字体加载失败比排版平庸更糟
- 版本号 / 路径 / 命令一律等宽 + `tabular-nums`
- 序号（00、01…）只用于真正的序列（换机顺序、时间线），不做装饰

细节见 [DESIGN.md](DESIGN.md)。
