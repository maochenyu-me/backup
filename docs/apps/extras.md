# 顺带装的那些

装了、但不常用。换机时可以缓着装，也可以不装。

<div class="filmhead">
  <div class="filmhead__title">次要软件 <span class="badge">缓装</span></div>
  <p class="filmhead__lede">先让核心环境跑起来，这些等有空再说。</p>
  <dl class="spec">
    <dt>优先级</dt><dd>低于 [换机顺序](/guide/order) 的前六层</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 开发辅助

### Python

两个版本并存：`3.12.10`（脚本兼容老依赖）和 `3.14.3`（新项目）。

::: code-group

```powershell [Windows ~simple-icons:windows11~]
winget install -e --id Python.Python.3.12
winget install -e --id Python.Python.3.14
```

```bash [macOS ~simple-icons:apple~]
brew install python@3.12 python@3.14
```

```bash [Linux ~simple-icons:linux~]
sudo apt install python3 python3-pip python3-venv
```

:::

验证：

```powershell
py -0              # 列出所有已装版本（Windows 专有）
python --version
pip --version
```

::: tip Windows 用 py launcher
`py -3.12` 可以精确指定版本，不用改 PATH。这是 Windows 上多版本共存最省事的办法。
:::

官方链接：<https://www.python.org/downloads/>

### PowerShell 7

比 Windows 自带的 5.1 好用得多：支持 `&&`、三目运算、更快的管道。

::: code-group

```powershell [Windows ~simple-icons:windows11~]
winget install -e --id Microsoft.PowerShell
```

```bash [macOS ~simple-icons:apple~]
brew install --cask powershell
```

```bash [Linux ~simple-icons:linux~]
sudo apt install powershell    # 需先加 Microsoft 源
```

:::

验证：

```powershell
pwsh --version    # 注意是 pwsh，不是 powershell
```

`powershell` 是系统自带的 5.1，`pwsh` 才是 7.x。

官方链接：<https://github.com/PowerShell/PowerShell>

### GitHub Desktop

不想敲命令时用。底层还是 git，配置共享同一份 `.gitconfig`。

```powershell
winget install -e --id GitHub.GitHubDesktop
```

官方链接：<https://github.com/apps/desktop>

## 常用工具

这些装了几乎每天都会用到，但**不属于环境依赖**，装不装都不影响开发：

| 名称 | winget ID | 用途 |
| --- | --- | --- |
| VS Code | `Microsoft.VisualStudioCode` | 编辑器 |
| 7-Zip | `7zip.7zip` | 解压 |
| Windows Terminal | `Microsoft.WindowsTerminal` | 终端 |
| Notion | `Notion.Notion` | 笔记 |
| SPlayer | `Rikazu.SPlayer` | 播放器 |

批量装：

```powershell
winget install -e --id Microsoft.VisualStudioCode
winget install -e --id 7zip.7zip
winget install -e --id Microsoft.WindowsTerminal
```

## 命令行工具

本机通过 `npm i -g` 装的：

| 名称 | 版本 | 用途 |
| --- | --- | --- |
| vercel | `50.32.5` | 部署前端 |
| wrangler | — | Cloudflare Workers |
| tsx | `4.21.0` | 直接跑 TS 文件 |
| http-server | `14.1.1` | 临时起静态服务 |
| cnpm | `9.4.0` | 国内镜像备用 |
| yarn | `1.22.22` | 老项目可能还在用 |

一次装完：

```powershell
npm i -g tsx http-server yarn cnpm
```

::: tip wrangler 建议改用项目级安装
全局装 wrangler 容易和项目要求版本冲突。现在官方推荐在项目里 `npm i -D wrangler`。
全局那份是历史遗留。
:::

## 怎么决定装不装

| 情况 | 建议 |
| --- | --- |
| 只是想让环境跑起来 | 全跳过 |
| 要写 Python 脚本 | 装 Python |
| 经常用命令行 | 装 PowerShell 7 |
| 经常处理压缩包 | 装 7-Zip |
| 不确定 | 先不装，需要时装也只要一条命令 |
