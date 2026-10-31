# Steam

游戏平台。登录账号后，已安装的游戏库会回来（游戏本体要重新下载）。

<div class="filmhead">
  <div class="filmhead__title">Steam <span class="badge">2.10.91.91</span></div>
  <p class="filmhead__lede">装在非系统盘的话，换机时把游戏库目录接上就能免下载。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>2.10.91.91</dd>
    <dt>安装方式</dt><dd>winget install Valve.Steam</dd>
    <dt>本机装在</dt><dd>E:\steam</dd>
    <dt>配置文件</dt><dd>&lt;Steam&gt;\config、userdata</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

装游戏、玩、云存档。开发场景基本用不到，但它是"电脑配好了"的一部分。

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id Valve.Steam
```

```powershell [Windows（官网） ~simple-icons:windows11~]
# https://store.steampowered.com/about/
# 下载 SteamSetup.exe
```

```bash [macOS ~simple-icons:apple~]
brew install --cask steam
```

```bash [Linux（Debian / Ubuntu） ~simple-icons:linux~]
sudo apt install steam
```

:::

## 验证

```powershell
# 查注册表里的安装路径
Get-ItemProperty "HKCU:\Software\Valve\Steam" | Select-Object SteamPath, SteamExe
```

本机输出 `SteamPath : e:/steam`，说明装在 E 盘而不是默认的 `C:\Program Files (x86)\Steam`。

## 配置在哪

| 路径 | 内容 |
| --- | --- |
| `<Steam>\config\config.vdf` | 客户端设置、库目录列表 |
| `<Steam>\userdata\<账号ID>\` | 各账号的本地数据、截图、部分存档 |
| `<Steam>\steamapps\common\` | 游戏本体 |
| `<Steam>\steamapps\libraryfolders.vdf` | 记录所有游戏库位置 |

## 备份与还原

**不需要备份的**：

- 游戏本体（巨大，重新下载）
- 账号信息（登录即回来）

**值得备份的**（可选）：

```powershell
# 本地设置与库目录配置
Copy-Item "E:\steam\config" "备份目录\steam-config" -Recurse

# 截图（如果你在意）
Copy-Item "E:\steam\userdata" "备份目录\steam-userdata" -Recurse
```

::: tip 真正的存档在云上
Steam Cloud 会自动同步支持云存档的游戏。不支持的（部分老游戏）存档在
`steamapps\common\<游戏名>\` 里或用户文档目录下，这些要单独找。
:::

## 换机省下载的办法

如果游戏装在移动硬盘或另一块盘上：

1. 新机器装 Steam，登录
2. 「设置 → 存储」→ 添加驱动器 → 指向原来那块盘的游戏库目录
3. Steam 会识别已有游戏文件，无需重新下载

::: warning 别直接拷 steamapps 目录
正确做法是让 Steam 自己识别库（通过 `libraryfolders.vdf`），
手动拷进去再改配置容易让 Steam 认为文件损坏然后整个重下。
:::

## 常用启动参数

Steam 客户端本身可以加参数，右键快捷方式 → 属性 → 目标后面追加：

| 参数 | 作用 |
| --- | --- |
| `-no-browser` | 不预加载内置浏览器（省内存，但商店页面需另开浏览器） |
| `-console` | 打开控制台 |
| `-clearbeta` | 退出 beta 通道 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 登录一直转圈 | 网络 | 开代理或用社区加速 |
| 游戏库为空 | 新机器没配库目录 | 「设置 → 存储」添加驱动器和目录 |
| 下载速度慢 | 下载区设置 | 「设置 → 下载」换区域 |
| 装在非系统盘但读不到 | `libraryfolders.vdf` 路径不对 | 让 Steam 自己添加，别手改 |

## 官方链接

- 商店：<https://store.steampowered.com/>
- 客户端下载：<https://store.steampowered.com/about/>
- 帮助中心：<https://help.steampowered.com/>
- 状态页：<https://www.steamstatic.com/status/>
