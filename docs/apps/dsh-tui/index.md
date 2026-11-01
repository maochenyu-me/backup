# DSH-TUI 安装

给 DeepSeek Harness 配上终端交互界面。它由社区项目维护，不是 DeepSeek 官方桌面客户端。

<div class="filmhead">
  <div class="filmhead__title">DSH-TUI <span class="badge">终端界面</span></div>
  <p class="filmhead__lede">Windows 可走独立安装包；已有 Node 环境则走 npm。选一条路线即可。</p>
  <dl class="spec">
    <dt>项目</dt><dd>ccch1mneyyy/dsh-TUI</dd>
    <dt>npm 包名</dt><dd>@deepseek-harness-tui/dsh-tui</dd>
    <dt>启动命令</dt><dd>dsh-tui（别名 dst）</dd>
    <dt>来源核对</dt><dd>2026-11-01（安装说明，非本机版本快照）</dd>
  </dl>
</div>

## 干什么用

在终端里与 DSH 对话，查看流式输出、任务状态并选择会话。它使用 DSH 的 Agent 能力，但提供自己的交互界面。

官方桌面端、CLI 和这个终端界面的区别见 [DSH 安装](/apps/dsh/)。**只为使用 DSH-TUI，不必先装官方桌面端。**

## 装

### 路线一：Windows x64 安装包

项目当前 README 提供独立 Windows 安装器：

1. 打开 [DSH-TUI Releases](https://github.com/ccch1mneyyy/dsh-TUI/releases)。
2. 在提供 Windows 安装包的发行版本中，展开 **Assets**，下载 `dsh-tui-setup-win-x64.exe`。
3. 运行安装器并按提示完成安装，然后打开安装后的终端入口。
4. 按启动界面的提示接入账号或模型，并发送一条简单消息验证。

按项目 README，这条路线 **按用户安装、无需管理员权限，安装包自带运行所需内容，不要求预装 Node.js 或 DSH**。
“离线安装”指安装器本身；使用在线模型仍需要网络及相应账号或服务。

如果当前发行版没有这个文件，不要把源码压缩包当安装器，也不要从不明转载站获取；改走下方 npm 路线。

### 路线二：npm 安装

先装好 [Node.js](/env/nodejs)、[npm](/env/npm) 和 [pnpm](/env/pnpm)：

| 前置条件 | 要求 |
| --- | --- |
| Node.js | `^22.19 || >=24`，建议 Node 24 LTS |
| pnpm | 10 或更高；首次初始化 profile 时需要 |
| 终端 | 支持交互输入的终端，Windows 建议用 Windows Terminal |
| DSH CLI | 下方命令会一并安装 `@deepseek-ai/dsh` |

Windows PowerShell、macOS / Linux 终端使用相同的 npm 命令：

```shell
node --version
npm --version
pnpm --version

npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui

dsh --version
dsh-tui --version
dsh-tui
```

如果缺 pnpm，可先执行 `npm install -g pnpm`；已经有符合要求的版本就不用重复装。
首次运行 `dsh-tui` 会自动初始化对应 profile，需要联网获取依赖。之后可以用 `dsh-tui` 或短命令 `dst` 启动。

先进入要处理的项目目录，再启动：当前目录会成为默认工作区。不要直接在包含大量敏感文件的目录试运行。

::: warning 安装包和 npm 不要无意中重复装
Windows 独立安装器与 npm 都可能提供终端入口。选定一种方式；如果已经同时安装，先用 `Get-Command dsh-tui -All` 和 `where.exe dsh-tui` 确认实际运行的是哪一份，不要仅凭版本输出猜来源。
:::

### 手动初始化 profile（备选）

已有官方 CLI、希望明确执行初始化步骤时，可按项目手册使用：

```shell
dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui
dsh --profile dsh-tui
```

这是安装 **DSH-TUI 本身** 所需的命令，不是额外扩展备份。全局 `dsh-tui` 启动器通常会自动完成这一步，不需要再重复执行。

不要把 GitHub 仓库 URL 直接作为安装目标；项目手册明确说明 Git URL 安装不受支持，应使用发布的 npm 包。

## 验证

npm 路线可执行：

```shell
dsh-tui --version
dsh-tui doctor
```

`--version` 确认启动器可运行；`doctor` 检查依赖及 profile 状态。尚未接入模型时的认证提示，不等于安装失败。

Windows 还可检查入口：

```powershell
Get-Command dsh-tui -All | Select-Object CommandType, Source
where.exe dsh-tui
```

最终验收是 **交互界面正常出现 → 能输入消息 → 接入模型后收到回复**。
不要把输出重定向到文件来测试交互启动，TUI 需要真实终端。

::: warning 先检查工具权限
项目当前 README 提醒，Windows profile 的默认权限可能为 `danger-full-access` 且审批为 `never`。首次处理真实文件前检查并收紧权限，不要把“安装成功”当作“适合直接操作敏感目录”。
:::

## 更新

以下针对 **npm / profile 路线**，不要用它混改独立安装包的运行时：

```shell
# 更新 profile 内的运行包
dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui@latest

# 如果使用全局启动器，再同步更新启动器
npm install -g @deepseek-harness-tui/dsh-tui@latest
```

profile 与全局启动器是两处安装，不能只更新其中一份就认为全部对齐。遇到版本不一致，优先照启动器提示的精确版本命令处理。
独立安装包路线则以项目 Releases 和当前版本的更新提示为准。

## 配置在哪

npm / profile 路线涉及两个位置：

| 位置 | 用途 |
| --- | --- |
| `~/.dsh/profiles/dsh-tui/` | DSH-TUI 的 profile 与依赖；设置了 `DSH_HOME` 则跟随该目录 |
| `~/.dsh-tui/` | TUI 自己的数据与设置；Windows 对应 `%USERPROFILE%\.dsh-tui` |

这里只用于区分目录，**不把 npm 路线的路径直接套用到独立安装器**。独立安装器的数据位置以其当前版本文档为准。

## 备份与还原

命令安装的发布包见 [TUI 扩展清单](/apps/dsh-tui/extensions)，MCP与浏览器配套见 [MCP 与配套工具](/apps/dsh/mcp)。本地创建插件和个人数据暂缓，不复制本机profile、不打包数据、不提供云盘占位链接。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 找不到 `dsh-tui` 或 `dsh` | 重新打开终端，检查全局命令的 PATH 和入口来源 |
| PowerShell 阻止 `.ps1` | 可改用 `dsh-tui.cmd`；不要直接放开全局执行策略 |
| 首次启动下载失败 | 检查 npm / pnpm、代理和终端中的具体错误 |
| 启动后马上退出 | npm 路线先确认 pnpm ≥10，再运行 `dsh-tui doctor` |
| 启动器与 profile 版本不一致 | 按提示对齐两处版本，别只重装其中一份 |
| 能进入界面但没有模型回复 | 安装与模型认证是两件事，按当前界面提示完成接入 |

## 项目链接

DSH-TUI 的项目入口以仓库为准，不与 DeepSeek 官方下载站混用：

- GitHub / 项目首页：<https://github.com/ccch1mneyyy/dsh-TUI>
- Windows 安装包与发行记录：<https://github.com/ccch1mneyyy/dsh-TUI/releases>
- 中文安装手册：<https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/getting-started.md>
- npm：<https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui>
- 上游 DSH：<https://github.com/deepseek-ai/deepseek-harness>
