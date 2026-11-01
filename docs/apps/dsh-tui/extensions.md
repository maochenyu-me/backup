# DSH-TUI：命令安装的扩展

本机盘点日期：2026-11-01。只归集已发布的命令安装项；`file:` 本地开发插件暂不整理、不打包、不迁移。

入口：[DSH-TUI 安装](/apps/dsh-tui/) · [桌面端扩展](/apps/dsh/extensions) · [MCP 与配套工具](/apps/dsh/mcp)

## 前提与边界

下面针对 npm/profile 路线的 `dsh-tui` profile，不用于覆盖 Windows 独立安装器内部运行时。先完成主体安装并退出正在运行的 TUI，再逐项选择安装：

```shell
dsh plugin --profile dsh-tui list --depth 0
```

本机 TUI 运行包是 `@deepseek-harness-tui/dsh-tui@0.17.0`；主体安装/更新见安装页，不与扩展重复装。本机桌面端与 TUI 的同名插件版本不同，不自动统一升级。

## 已声明的 npm 发布包

版本读取自本机实际包，已核对对应 registry 精确版本存在；用途是包元数据的简述，不构成功能健康证明。在 bundles 中只表示声明加载，实际行开关、服务连接和账号需另外检查。

| 包名 | 本机版本 | 用途 |
| --- | --- | --- |
| `@furongjun1999/dsh-memory` | 0.9.21 | 灵枢认知图与长期记忆 |
| `@kenz1117/dsh-engram` | 0.11.2 | 本地跨会话记忆与检索 |
| `dsh-mnemon` | 0.5.37 | 分层上下文和记忆来源 |
| `@wxg-prc-cpg/browser-skill-dsh-plugin` | 0.4.0 | BrowserSkill 工具接入 |
| `dsh-free-search` | 0.9.26 | 多引擎联网搜索 |
| `dsh-web-fetch-playwright` | 0.2.13 | 浏览器渲染抓取 |
| `dsh-context` | 0.78.2 | 上下文观察与管理 |
| `dsh-workbuddy-connect` | 0.7.9 | WorkBuddy 模型接入 |
| `dsh-advisor` | 0.6.4 | 独立顾问模型建议 |
| `dsh-llm-fallbacks` | 0.6.12 | 模型调用失败回退链 |
| `dsh-open-path` | 0.6.2 | `/open` 打开文件、目录或网址 |
| `dsh-session-cleanup` | 0.2.1 | `/nix` 会话清理；涉及删除，谨慎使用 |
| `dsh-tui-find` | 0.5.2 | 跨会话全文搜索 |
| `dsh-tui-theme` | 0.8.0 | Blossom 状态栏与设置；不是粉色主题包，粉色主题已进入TUI内置 |

以下是按需逐项执行的清单，不是建议全部启用。安装后重启TUI验证；记忆插件的数据、顾问模型的账号与回退规则不会因装包自动恢复。

```shell
dsh plugin --profile dsh-tui add @furongjun1999/dsh-memory@0.9.21
dsh plugin --profile dsh-tui add @kenz1117/dsh-engram@0.11.2
dsh plugin --profile dsh-tui add dsh-mnemon@0.5.37
dsh plugin --profile dsh-tui add @wxg-prc-cpg/browser-skill-dsh-plugin@0.4.0
dsh plugin --profile dsh-tui add dsh-free-search@0.9.26
dsh plugin --profile dsh-tui add dsh-web-fetch-playwright@0.2.13
dsh plugin --profile dsh-tui add dsh-context@0.78.2
dsh plugin --profile dsh-tui add dsh-workbuddy-connect@0.7.9
dsh plugin --profile dsh-tui add dsh-advisor@0.6.4
dsh plugin --profile dsh-tui add dsh-llm-fallbacks@0.6.12
dsh plugin --profile dsh-tui add dsh-open-path@0.6.2
dsh plugin --profile dsh-tui add dsh-session-cleanup@0.2.1
dsh plugin --profile dsh-tui add dsh-tui-find@0.5.2
dsh plugin --profile dsh-tui add dsh-tui-theme@0.8.0
```

运行中的 TUI 也支持 `/plugin install <spec>`；不要一边运行安装流程一边从外部修改同一个 profile。构建脚本和来源信任按面板提示核实，不直接开启全部脚本。

## Git 来源：单独保留，不冒充 npm 版本

本机 `cc-dsh-notifier` 的依赖规格是 `github:baobaolaodie/cc-dsh-notifier`，已安装包内版本0.1.2。它是Windows通知与点击跳转工具。

```shell
# 本机记录的来源规格；指向浮动仓库，不保证重现当前安装内容
# dsh plugin --profile dsh-tui add github:baobaolaodie/cc-dsh-notifier
```

这不是已核验的registry安装命令，也未固定commit。TUI主体不支持Git URL安装的限制不应被误解成这个插件已验证兼容；先核实当前宿主支持情况与仓库，再决定是否复装，因此命令保留为注释，未执行。

## 暂不处理的本地项

本机另有 **10个 `file:` 依赖**：9个 `dsh-pi-*` 与 `dsh-tui-filebrowser`。按本轮范围暂不展开安装、复制或恢复命令，不暴露本地源码路径。Skills包与本地MCP桥接相关部分也留到下一轮；不要把这些目录当registry包用 `@latest` 替换。

## 验证与依据

- `dsh plugin --profile dsh-tui list --depth 0` 确认包版本。
- 重启后检查插件面板/相应命令，再试一次实际功能。
- 安装成功不等于已授权模型或已连接浏览器/MCP。
- 本次只读盘点与写文档，未执行任何安装、更新、删除或会话清理。

依据：本机profile/package.json及已安装包元数据、registry精确版本；已安装TUI手册 `plugins.md` 的“装包本身已在终端里可用（C-4）”与“生命周期动作（C-5）”。

- [TUI插件手册](https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/plugins.md)
- [宿主插件命令参考](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md)
