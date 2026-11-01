# DSH 安装

DeepSeek Harness（简称 DSH）是 DeepSeek 开源的 AI Agent 工具。桌面端直接安装，CLI 则可以在终端启动本地 Web 界面。

<div class="filmhead">
  <div class="filmhead__title">DeepSeek Harness <span class="badge">桌面端 / CLI</span></div>
  <p class="filmhead__lede">换机先装主体并确认能启动；个人扩展和配置备份留到后续恢复。</p>
  <dl class="spec">
    <dt>推荐入口</dt><dd>Windows 官方桌面安装包</dd>
    <dt>CLI 包名</dt><dd>@deepseek-ai/dsh</dd>
    <dt>默认数据根目录</dt><dd>%USERPROFILE%\.dsh（可由 DSH_HOME 更改）</dd>
    <dt>来源核对</dt><dd>2026-11-01（安装说明，非本机版本快照）</dd>
  </dl>
</div>

## 干什么用

读写工作区文件、辅助编码、处理资料和执行任务。几个入口不要混淆：

| 入口 | 是什么 | 怎么启动 |
| --- | --- | --- |
| 官方桌面端 | 独立桌面应用，自带运行时 | 开始菜单打开 DeepSeek Harness |
| 官方 CLI / Web | npm 包提供的命令，Web 模式在本机启动服务 | `dsh web` |
| [DSH-TUI](/apps/dsh-tui/) | 社区维护的终端交互界面，不是官方桌面端 | `dsh-tui` |

**不用把三个全装齐才可用**。只用桌面界面，先装桌面端就够；要在终端里用，再选 CLI 或 DSH-TUI。

## 装

### 官方桌面端

::: code-group

```powershell [Windows ~simple-icons:windows11~]
# 打开官方页面，选择 Windows 版本
Start-Process 'https://www.deepseek.com/download/'
```

```bash [macOS ~simple-icons:apple~]
# 官方当前提供 Apple 芯片版本，要求 macOS 13 或更高
open https://www.deepseek.com/download/
```

```bash [Linux ~simple-icons:linux~]
# 当前官方页面未列 Linux 桌面安装包；使用下方 CLI / Web 路线
```

:::

Windows 安装顺序：

1. 在 [官方下载页](https://www.deepseek.com/download/) 选择 **Windows**，下载 `.exe` 安装包。
2. 运行安装程序，选择安装目录并完成安装。当前安装器按用户安装，不要把磁盘根目录当安装目录。
3. 打开 DeepSeek Harness，按欢迎页提示完成账号登录或模型接入。
4. 添加并选中一个测试工作区，确认能创建会话。先使用无敏感资料的目录。

便捷直链：[Windows x64 安装包](https://download.deepseek.com/desktop/dsh-latest-windows-x64.exe)、[macOS Apple 芯片安装包](https://download.deepseek.com/desktop/dsh-latest-macos-arm64.dmg)。
直链指向滚动更新版本；如果地址变动，以官方下载页为准，不把它当固定版本备份。

::: tip 桌面端不要求先装系统 Node.js
官方桌面端携带自己的运行时。下面的 Node.js / npm 前置条件针对 **npm CLI**，不是桌面端的安装前提。
:::

### CLI / Web

先准备 [Node.js](/env/nodejs)、[npm](/env/npm) 和 [pnpm](/env/pnpm)。官方当前 Node.js 要求为 `^22.19.0 || >=24.0.0`，换机建议用 Node 24 LTS；pnpm 使用 10 或更高版本。

以下命令在 Windows PowerShell、macOS 和 Linux 终端均可执行：

```shell
node --version
npm --version
pnpm --version

npm install -g @deepseek-ai/dsh

dsh --version
dsh web
```

先在终端进入目标项目目录，再运行 `dsh web`。命令默认启动 `http://127.0.0.1:3080` 并打开浏览器，实际访问地址以终端输出为准。首次运行会初始化 Web profile，并可能下载依赖，需保持联网。

不想全局安装，也可按官网的快速入口启动：

```shell
npx @deepseek-ai/dsh web
```

只启动服务、不自动打开浏览器：

```shell
dsh web --no-open
```

打开页面后添加并选中工作区，再完成账号或模型接入。**网页打开只代表服务启动成功，不代表模型已可用**；发送一条简单消息并收到回复，才算接入完成。

### 桌面端也能提供 dsh 命令

桌面应用菜单里的 **管理 dsh 命令…** 可安装、修复或移除终端入口。Windows 会注册到当前用户的 PATH；操作后重新打开终端，再执行 `dsh --version`。

这是复用桌面端运行时的另一条路线，**不是必须再 npm 装一次**。如果已有 npm 版，先检查命令来源，不要无意中切换：

```powershell
Get-Command dsh -All | Select-Object CommandType, Source
where.exe dsh
```

## 验证

- **桌面端**：能打开应用、选中工作区、创建会话；模型接好后能收到简单消息的回复。
- **npm CLI**：`dsh --version` 有版本输出；`dsh web` 打印服务地址且页面可访问。
- **命令来源**：Windows 用上面的 `Get-Command`；macOS / Linux 用 `command -v dsh`。

本页没有把官网最新版写成本机已安装版本，也不会为了验证说明而重装或升级当前电脑的 DSH。

## 配置在哪

默认 Harness 主目录是 `~/.dsh`，Windows 对应 `%USERPROFILE%\.dsh`；设置了 `DSH_HOME` 时以该变量为准。
桌面端与 CLI 使用各自的运行 profile，例如桌面端的 `profiles/desktop`，不能当作同一套可执行依赖目录混用。

这里只帮助辨认安装与数据位置，**不展开配置文件修改或账号凭据迁移**。

## 备份与还原

命令安装项已单独归集到 [桌面端扩展清单](/apps/dsh/extensions) 和 [MCP 与配套工具](/apps/dsh/mcp)。先恢复主体，再按需逐项恢复发布包。本地创建、手工打包插件及个人数据暂不处理；不提供整profile备份包或云盘占位链接。

## 常见问题

| 现象 | 先检查什么 |
| --- | --- |
| 装完提示找不到 `dsh` | 重新打开终端，检查 PATH 和 `Get-Command dsh -All` |
| PowerShell 提示 `.ps1` 不允许运行 | 可用同目录的 `dsh.cmd` / `npm.cmd`；不要为此盲目放开全局执行策略 |
| CLI 首次初始化很慢 | 检查 npm registry、代理及网络，保留终端里的具体错误 |
| Web 页面打开但不能输入 | 是否已经添加并选中工作区 |
| 版本或入口与预期不一致 | 桌面端提供的命令与 npm 全局命令可能同时存在，先确认 PATH 优先级 |

## 官方链接

- 产品官网：<https://www.deepseek.com/harness/>
- 桌面端下载：<https://www.deepseek.com/download/>
- GitHub：<https://github.com/deepseek-ai/deepseek-harness>
- 中文 README：<https://github.com/deepseek-ai/deepseek-harness/blob/master/README.zh.md>
- 开发者文档 / Web 快速开始：<https://deepseek-harness.github.io/deepseek-harness/guide/quickstart>
- 桌面端与终端命令说明：<https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.zh.md>
- CLI 说明：<https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.zh.md>
- npm：<https://www.npmjs.com/package/@deepseek-ai/dsh>
