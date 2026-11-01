# DSH 桌面端：命令安装的扩展

本机盘点日期：2026-11-01。本页只归集公开发布、能按包名复装的扩展；不搬动安装目录，不复制账号配置，不处理本地创建或手工打包项。

入口：[DSH 安装](/apps/dsh/) · [DSH-TUI 扩展](/apps/dsh-tui/extensions) · [MCP 与配套工具](/apps/dsh/mcp)

## 先确认命令来源

桌面端 profile 由桌面应用管理。先启动桌面端完成初始化，再通过应用的“管理 dsh 命令…”配置终端入口，**完全退出桌面端后**操作：

```powershell
Get-Command dsh -All | Select-Object CommandType, Source
where.exe dsh
dsh plugin --profile desktop list --depth 0
```

::: warning 不要直接用 npm 全局 dsh 修改桌面 profile
本机当前 PATH 优先命中 npm 的 dsh.ps1，不应照抄下方命令直接执行。官方说明：桌面端安装的命令可以管理 desktop profile；npm 安装的 CLI 不拥有这个 profile。先确认实际使用的是桌面端提供的命令。不要手改 package.json 或直接 pnpm add 来绕过保护。
:::

## 已声明的发布包

版本来自本机已安装包的 package.json；每个下列版本均已核对 npm registry 存在。不是最新版推荐，也不表示每个功能都已经运行验证。“已声明”指在 dsh.profile.bundles 内，不能单凭此判断所有插件行均启用或服务健康。

| 包名 | 本机版本 | 用途 |
| --- | --- | --- |
| `dshmarket` | 1.66.27 | 可视化插件市场 |
| `dsh-better-sidebar` | 0.26.0 | 文件树、编辑器等侧栏 |
| `@furongjun1999/dsh-memory` | 0.8.1 | 灵枢认知图与长期记忆 |
| `@kenz1117/dsh-engram` | 0.8.12 | 跨会话记忆与检索 |
| `@michengai/dsh-btw` | 0.1.24 | 一次性只读旁问 |
| `dsh-mnemon` | 0.5.29 | 分层上下文与记忆来源 |
| `@wxg-prc-cpg/browser-skill-dsh-plugin` | 0.3.3 | BrowserSkill 工具接入 |
| `dsh-web-fetch-playwright` | 0.2.11 | 浏览器渲染抓取 |
| `dsh-context` | 0.72.0 | 上下文观察与管理 |
| `dsh-vision-router` | 3.0.3 | 图片路由与视觉工具 |
| `@michengai/dsh-skills-manager` | 1.1.22 | Skills 加载与管理 |
| `dsh-dream-skin` | 10.15.0 | 桌面/Web 外观主题 |
| `dsh-free-search` | 0.9.0 | 多引擎联网搜索 |
| `dsh-workbuddy-connect` | 0.7.5 | WorkBuddy 模型接入 |

以下是**逐项选择的复装命令清单，不是一键全装建议**。先确认桌面命令来源和兼容性，一次装一个、重新启动后检查。多个记忆、搜索、模型插件可能能力重叠；安装包不等于恢复记忆数据库、账号或个人配置。

```powershell
dsh plugin --profile desktop add dshmarket@1.66.27
dsh plugin --profile desktop add dsh-better-sidebar@0.26.0
dsh plugin --profile desktop add @furongjun1999/dsh-memory@0.8.1
dsh plugin --profile desktop add @kenz1117/dsh-engram@0.8.12
dsh plugin --profile desktop add @michengai/dsh-btw@0.1.24
dsh plugin --profile desktop add dsh-mnemon@0.5.29
dsh plugin --profile desktop add @wxg-prc-cpg/browser-skill-dsh-plugin@0.3.3
dsh plugin --profile desktop add dsh-web-fetch-playwright@0.2.11
dsh plugin --profile desktop add dsh-context@0.72.0
dsh plugin --profile desktop add dsh-vision-router@3.0.3
dsh plugin --profile desktop add @michengai/dsh-skills-manager@1.1.22
dsh plugin --profile desktop add dsh-dream-skin@10.15.0
dsh plugin --profile desktop add dsh-free-search@0.9.0
dsh plugin --profile desktop add dsh-workbuddy-connect@0.7.5
```

视觉路由可能把图片发送给外部服务；先检查隐私设置。BrowserSkill 插件还需要 CLI 与浏览器扩展配套，见 [MCP 与配套工具](/apps/dsh/mcp)。模型接入插件仍需相应应用、授权与账号，文档不收录任何令牌。

## 已安装但不纳入自动恢复

| 包名 | 本机版本 | 为什么不放入上面的命令组 |
| --- | --- | --- |
| `@liustack/modsearch` | 5.10.6 | 依赖仍在，但不在 bundles；market 状态及 patch 明确禁用 |
| `billion-context` | 0.1.189 | 依赖在，但不在 bundles；未确认当前使用方式 |
| `dsh-ops` | 0.3.0 | 依赖在，但不在 bundles；未确认当前使用方式 |
| `dsh-our-free-model` | 2.3.0 | 本机有包，但 npm 精确版本查询404；来源/手工安装情况留待后续，不给假定可用的安装命令 |

前三个版本在 registry 可查，但 `dsh plugin add` 可能重新协调 bundles 并激活，不能用它“原样恢复一个禁用状态”。本页不替你重新启用。

官方自带的 base、web-app、实验性团队/审阅/定时任务 bundles 不当作第三方扩展批量复装，交由当前桌面版本管理。

## 验证与依据

复装后重开桌面端，检查插件列表、配置界面与实际工具调用；失败时记录具体错误，不通过放开全局权限解决。本文整理期间未执行任何 add/remove/update。

依据：本机 desktop/package.json、已安装包元数据、market 状态及脱敏后的 patch 结构；公开版本使用 registry 精确版本接口核对。

- [官方桌面端：安装归属与命令运行时](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.md)
- [官方 CLI：插件管理](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md)
