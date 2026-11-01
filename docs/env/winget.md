# winget

Windows 的官方包管理器。后面所有 Windows 软件都从它装，但它自己**通常不用装**——
Win11 和较新的 Win10 是随系统自带的。

<div class="filmhead">
  <div class="filmhead__title">winget <span class="badge">v1.29.380</span></div>
  <p class="filmhead__lede">先查有没有，再决定装不装。没有它，后面每一步都得去官网翻下载页。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>Windows Package Manager v1.29.380</dd>
    <dt>宿主组件</dt><dd>App Installer（应用安装程序）v1.29.379.0</dd>
    <dt>系统要求</dt><dd>Windows 10 1809（17763）+ / Windows 11 / Server 2025</dd>
    <dt>安装方式</dt><dd>系统自带；缺失时装 App Installer</dd>
    <dt>用户设置</dt><dd>%LOCALAPPDATA%\Packages\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe\LocalState\settings.json</dd>
    <dt>最近核对</dt><dd>2026-11-01</dd>
  </dl>
</div>

## 干什么用

- 命令行装、升、卸软件，不用去官网找安装包、不用点下一步
- 装的是什么版本、从哪个包装的，`winget list` 一屏看完，有据可查
- 批量升级：`winget upgrade --all`，不用一个个开软件自己更新
- 换机还原：`winget export` / `import`，部分软件能一条命令装回来（但**不是全部**，见下文）

本页只讲 Windows。macOS 的对应物是 [Homebrew](https://brew.sh/)，Linux 用各发行版的包管理器（`apt` / `dnf` / `pacman`），都不需要 winget。

## 要不要装：先查再决定

::: tip 结论先给
Win11 用户基本可以跳过本页，直接 `winget --version` 验证。需要动手装的只有三类机器：
**Win10 LTSC / Server 2019**、**精简版（Ghost 系统、砍掉 Store）**、**Windows Sandbox / PE 环境**。
:::

| 你的系统 | winget 状态 | 怎么办 |
| --- | --- | --- |
| Windows 11（全部版本） | 自带 | 跳过，直接验证 |
| Windows 10 22H2 / 21H2 | 自带或随 Store 更新 | 先验证；没有就装 App Installer |
| Windows 10 1809–20H2 | 多数自带，但版本可能很旧 | 验证；版本旧就在 Store 里更新 App Installer |
| Windows 10 LTSC / Server 2019 | 通常没有 | 走「无 Store」的装法 |
| 精简版（无 Microsoft Store） | 没有 | 走「无 Store」的装法 |
| Windows Sandbox / PE | 没有（官方文档明确说不含） | 走「一行 bootstrap」的装法 |

查之前先知道两件事：winget 是 **App Installer 的一部分**，不是独立程序；它**只支持 Win10 1809（17763）及以上**，更老的系统没有官方支持。

```powershell
winget --version
Get-AppxPackage Microsoft.DesktopAppInstaller | Select-Object Name, Version
```

第一条有版本号 = 有；第二条能列出 `Microsoft.DesktopAppInstaller` = 组件在，即使 PATH 有问题也能救。

## 装

::: tip 装了却调不到，先试这一条
Win10 上最常见的情况不是「没装」，而是**首次登录后的异步注册还没跑完**，`winget` 命令暂时不认。
先试注册命令，比重装快得多：

```powershell
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
```
:::

::: code-group

```powershell [Windows（Microsoft Store，推荐） ~simple-icons:windows11~]
# 打开 Microsoft Store 的「应用安装程序 / App Installer」页
Start-Process "ms-windows-store://pdp/?productid=9NBLGGH4NNS1"

# 或直接开网页版商店
# https://apps.microsoft.com/detail/9nblggh4nns1
```

```powershell [Windows（无 Store / LTSC，装 MSIX） ~simple-icons:windows11~]
# 1. 从 https://github.com/microsoft/winget-cli/releases 下载最新的
#    Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle
# 2. 同一页 Assets 里还有两个依赖，必须先装：顺序是 VCLibs → UI.Xaml → 主包
#    Microsoft.VCLibs.140.00.UWPDesktop_*.appx
#    Microsoft.UI.Xaml.2.8_*.appx
# 3. 逐个装（管理员 PowerShell，路径按实际下载位置改）
Add-AppxPackage .\Microsoft.VCLibs.140.00.UWPDesktop_14.0.33728.0_x64__8wekyb3d8bbwe.appx
Add-AppxPackage .\Microsoft.UI.Xaml.2.8_8.2310.30001.0_x64__8wekyb3d8bbwe.appx
Add-AppxPackage .\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle
```

```powershell [Windows（一行 bootstrap） ~simple-icons:windows11~]
# 官方文档给 Windows Sandbox 的方案，机器上完全没有 App Installer 时也能用
$progressPreference = 'silentlyContinue'
Install-PackageProvider -Name NuGet -Force | Out-Null
Install-Module -Name Microsoft.WinGet.Client -Force -Repository PSGallery | Out-Null
Repair-WinGetPackageManager -AllUsers
```

```bash [macOS / Linux]
# 不需要 winget：macOS 用 brew，Linux 用发行版包管理器
# macOS： brew install --cask <应用名>
# Debian / Ubuntu： sudo apt install <包名>
```

:::

::: warning MSIX 手动装完不会自动更新
从 Store 装的 App Installer 会自己更新；从 GitHub 手动装的 **不会**。
装完 `winget --version` 会提示 `A newer version of the App Installer is available`，
偶尔回发布页手动重复一遍即可，不影响使用。
:::

## 验证

```powershell
winget --version   # v1.29.380
winget --info      # 版本、各目录、组策略状态
winget list        # 列出已装软件，能出表就算通
```

本机 2026-11-01 的 `winget --info` 关键几行：

| 项 | 本机实际输出 |
| --- | --- |
| Windows Package Manager | `v1.29.380` |
| Package（App Installer） | `Microsoft.DesktopAppInstaller v1.29.379.0` |
| User Settings | `%LOCALAPPDATA%\Packages\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe\LocalState\settings.json` |
| Portable Links（用户） | `%LOCALAPPDATA%\Microsoft\WinGet\Links` |
| Portable Package Root（用户） | `%LOCALAPPDATA%\Microsoft\WinGet\Packages` |
| Logs | `%LOCALAPPDATA%\Packages\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe\LocalState\DiagOutputDir` |

## 配置

winget 本身几乎不用配，只有三处值得知道：

| 位置 | 作用 |
| --- | --- |
| `LocalState\settings.json` | 用户设置（实验特性、默认行为）。`winget settings` 可直接打开 |
| `%LOCALAPPDATA%\Microsoft\WinGet\Links` | portable 包创建的快捷方式目录，不在 PATH 里就会「装了但敲不出来」 |
| `LocalState\DiagOutputDir` | 日志，报错排查只看这里 |

### 源

```powershell
winget source list
```

本机三个源：

| 名称 | 地址 | 说明 |
| --- | --- | --- |
| `msstore` | `https://storeedgefd.dsx.mp.microsoft.com/v9.0` | 商店分发，装 Store 应用 |
| `winget` | `https://cdn.winget.microsoft.com/cache` | 社区仓库，绝大多数开发工具在这 |
| `winget-font` | `https://cdn.winget.microsoft.com/fonts` | 字体源，默认不参与搜索 |

### 代理

winget 走的是**系统代理（WinINET）**，所以 [FlClash](/apps/flclash) 打开「系统代理」后它自动跟随，不用另配。
只给某一次命令指定代理时：

```powershell
winget install -e --id Git.Git --proxy http://127.0.0.1:7080
```

端口要和 [FlClash 的混合端口](/apps/flclash) 一致（本机 `7080`）。

## 备份与还原

winget 自带导入导出，这是换机时最快的一步，但**它只能还原当初用 winget 装的那批**。

```powershell
# 导出（带版本号，换机时能装回接近的版本）
winget export -o winget-apps.json --include-versions

# 还原
winget import -i winget-apps.json --accept-package-agreements --accept-source-agreements
```

::: warning 本机实测：导出会漏一大半
2026-11-01 在本机跑 `winget export`：**成功导出 87 条，另外 164 条被跳过**，
每条都打一行 `Installed package is not available from any source: <名字>`。

被跳过的是这些：WinRAR、微信、WPS、WorkBuddy、AutoCAD、Android Studio、DeepSeek 桌面端、
Realtek Audio Control 等等 —— 它们当初不是 winget 装的，或者社区源里根本没有对应包。

所以 `winget export` 的定位是**加速器，不是备份**：能省掉大部分下载和点击，剩下的照
[备份清单](/migrate/backup) 手工补齐。导出文件建议和配置一起放进备份目录。
:::

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `winget search <关键词>` | 搜包，拿准确 ID |
| `winget show -e --id <ID>` | 看包详情（版本、发布者、安装类型） |
| `winget install -e --id <ID>` | 精确装（`-e` = ID 完全匹配，强烈建议都加） |
| `winget list` | 已装软件 |
| `winget list --upgrade-available` | 只看有更新的 |
| `winget upgrade --all` | 全部升级 |
| `winget uninstall -e --id <ID>` | 卸载 |
| `winget export` / `winget import` | 导出 / 还原清单 |
| `winget pin add <ID>` | 钉住版本，`upgrade --all` 时跳过它 |
| `winget source list` | 看源 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `winget` 不是内部或外部命令 | PATH 缺 `%LOCALAPPDATA%\Microsoft\WindowsApps`，或首次注册未完成 | 先跑 `Add-AppxPackage -RegisterByFamilyName ...`，再查 PATH |
| `0x80073D02` | App Installer 正在被 Store 更新，文件被占用 | 关掉 Store，等它更新完再试 |
| `0x801901a0` / `0x80D03002` | 源不可达（网络 / DNS / 代理） | 确认系统代理生效，或换 `--source msstore` 试 |
| 卡在「正在下载」很久 | 走的是直连 CDN，没吃到代理 | 开系统代理，或加 `--proxy` |
| 提示 `A newer version of the App Installer is available` | 手动装的 MSIX 不会自更新 | 回发布页重装一遍（不影响当前使用） |
| `No package found matching input criteria` | 关键词或 ID 不对 | `winget search` 拿准确 ID，装的时候加 `-e --id` |
| 装的版本比官网旧 | 社区源清单更新有滞后 | 官网装包，或 `--source msstore` |
| 安装时反复弹 UAC | 部分安装包要求提权 | 正常现象；但管理员终端里不会提示，装前确认来源可信 |

## 官方链接

- 文档：<https://learn.microsoft.com/windows/package-manager/winget/>
- App Installer（Store 页）：<https://apps.microsoft.com/detail/9nblggh4nns1>
- 发布页（含 MSIX 与依赖）：<https://github.com/microsoft/winget-cli/releases>
- 包仓库：<https://github.com/microsoft/winget-pkgs>
- 网页搜索：<https://winget.run/>
- 排错手册：<https://github.com/microsoft/winget-cli/blob/master/doc/troubleshooting.md>
