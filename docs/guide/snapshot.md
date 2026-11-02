# 版本快照

这台机器上实际装着什么。换新机时对照这张表，能看出哪里落后了、哪里需要重装。

<div class="filmhead">
  <div class="filmhead__title">本机快照 <span class="badge">2026-11-02 实测</span></div>
  <p class="filmhead__lede">所有版本号都来自命令行实际输出，不是"官网最新版"。</p>
  <dl class="spec">
    <dt>系统</dt><dd>Windows 10.0.26200 (x64)</dd>
    <dt>查看方式</dt><dd>--version 命令 / winget list</dd>
    <dt>核对日期</dt><dd>2026-11-02</dd>
  </dl>
</div>

## 基础环境

| 名称 | 本机版本 | 安装来源 | 安装位置 |
| --- | --- | --- | --- |
| winget | `v1.29.380` | 系统自带（App Installer `1.29.379.0`） | `%LOCALAPPDATA%\Microsoft\WindowsApps` |
| Node.js | `24.21.0` | `winget` (`OpenJS.NodeJS.LTS`) | `C:\Program Files\nodejs` |
| npm | `12.2.0` | 随 Node 附带 | 同上 |
| pnpm | `12.8.1` | `npm i -g` | `%APPDATA%\npm` |
| Git | `2.56.0.windows.4` | `winget` (`Git.Git`) | `C:\Program Files\Git` |
| Hugo | `0.166.0+extended` | `winget` (`Hugo.Hugo.Extended`) | `%LOCALAPPDATA%\Microsoft\WinGet\Links` |
| Hexo CLI | `4.3.2` | `npm i -g hexo-cli` | `%APPDATA%\npm` |
| corepack | `0.36.0` | 随 Node 附带 | — |
| yarn | `1.22.22` | `npm i -g` | `%APPDATA%\npm` |

::: tip pnpm 版本对不上是正常的
`npm view pnpm version` 会显示 `12.16.1`（目前最新），本机装的是 `12.8.1`。
自用环境没必要追最新，**能用就不动**。真需要升级时 `pnpm add -g pnpm@latest`。
:::

## 桌面软件

| 名称 | 本机版本 | 安装来源 |
| --- | --- | --- |
| Google Chrome | `156.0.8078.79` | 官网安装包（非 winget 装的） |
| VS Code | `1.140.0` | 系统安装包，装在 `E:\vscode\Microsoft VS Code`（非 winget） |
| FlClash | `0.8.99+2026100301` | `winget` (`chen08209.FlClash`) |
| Steam | `2.10.91.91` | `winget` (`Valve.Steam`)，装在 `E:\steam` |
| WorkBuddy | `5.9.2` | `winget` (`Tencent.WorkBuddy`) |
| OpenCode | `2.2.5` | 安装包，主目录 `E:\opencode` |
| GitHub Desktop | `3.5.5` | `winget` (`GitHub.GitHubDesktop`) |

## 顺带装的

这些装了但用得少，换机时**可以缓着装**。

| 名称 | 本机版本 | 用途 |
| --- | --- | --- |
| Python | `3.12.10` / `3.14.3` | 两个版本并存，脚本兼容老依赖 |
| PowerShell | `7.6.7` | 比系统自带的 5.1 好用很多 |
| Notion | — | 笔记 |
| SPlayer | — | 播放器 |

## 命令行工具

| 名称 | 本机版本 | 用途 |
| --- | --- | --- |
| vercel | `50.32.5` | 部署 |
| wrangler | — | Cloudflare Workers |
| tsx | `4.21.0` | 直接跑 TS |
| http-server | `14.1.1` | 临时起静态服务 |
| cnpm | `9.4.0` | 国内镜像备用 |

## 怎么自己刷新这张表

想更新时在目标机器上跑一遍，把输出抄回本页：

::: code-group

```powershell [Windows ~simple-icons:windows11~]
node -v; npm -v; pnpm -v; git --version; hugo version; hexo -v; corepack -v
winget --version; winget list | Select-String "Chrome|Git|Node|Hugo|Steam|Clash|WorkBuddy|Python|PowerShell"
```

```bash [macOS ~simple-icons:apple~]
node -v; npm -v; pnpm -v; git --version; hugo version; hexo -v
brew list --versions | grep -Ei "chrome|git|node|hugo|steam|clash"
```

```bash [Linux ~simple-icons:linux~]
node -v; npm -v; pnpm -v; git --version; hugo version; hexo -v
```

:::

::: warning 别忘了改核对日期
本页顶部和 [site.config.mts](https://github.com) 里的 `lastChecked` 都要改，否则你以后看到的就是过期信息。
:::

## 版本差异怎么判断

| 差距 | 处理 |
| --- | --- |
| 补丁号不同（`24.21.0` → `24.22.2`） | 不用管 |
| 次版本不同（`24.x` → `26.x`） | 建议对齐，老项目可能不兼容 |
| 主版本不同（`24` → `26`） | 装新的，但保留旧版可用（Node 用 fnm 管理多版本） |
| Hugo 大版本不同 | 注意主题兼容性，`0.1xx` → `0.16x` 跨了很多 |

需要多版本 Node 并存时用 `fnm`：

```powershell
winget install Schniz.fnm
fnm install 24
fnm use 24
```
