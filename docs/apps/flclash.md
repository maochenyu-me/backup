# FlClash

基于 mihomo (Clash.Meta) 内核的跨平台代理客户端。开源、无广告。

<div class="filmhead">
  <div class="filmhead__title">FlClash <span class="badge">0.8.99</span></div>
  <p class="filmhead__lede">换机时第一个装的东西。它不通，后面全卡。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>0.8.99+2026100301</dd>
    <dt>安装方式</dt><dd>winget install chen08209.FlClash</dd>
    <dt>配置目录</dt><dd>%APPDATA%\com.follow\clash</dd>
    <dt>本地端口</dt><dd>127.0.0.1:7080</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 让 GitHub、nodejs.org、Google 等域名可用
- 给 git、npm、curl 等命令行工具提供代理
- 订阅更新、规则分流、TUN 模式接管全部流量

::: tip 为什么排在最前面
新机器上 `github.com` 常常连不上。而 Git 安装、Hugo 主题、npm 从 GitHub 拉包都要用它。
**先把网络通掉，后面每一步都能省时间。**
:::

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id chen08209.FlClash
```

```powershell [Windows（官网 / release） ~simple-icons:windows11~]
# 官网 https://chen08209.github.io/FlClash/ 会自动识别系统给对应包
# 或直接去 https://github.com/chen08209/FlClash/releases/latest
# 选 FlClash-x.x.x-windows-amd64-setup.exe（或 portable .zip）
```

```bash [macOS（Homebrew） ~simple-icons:apple~]
brew tap chen08209/tap
brew install --cask flclash
```

```bash [macOS（安装包） ~simple-icons:apple~]
# 官网下载 DMG，Apple Silicon 和 Intel 分开选
# 首次打开可能需要在「系统设置 → 隐私与安全性」里允许
```

```bash [Linux（Debian / Ubuntu） ~simple-icons:linux~]
# 从 release 页下 .deb
sudo dpkg -i FlClash-x.x.x-linux-amd64.deb
```

```bash [Linux（AppImage 托盘图标依赖） ~simple-icons:linux~]
sudo apt-get install libayatana-appindicator3-1   # Debian / Ubuntu
sudo dnf install libayatana-appindicator-gtk3     # Fedora
```

:::

::: warning ARM64 机器别下错包
Snapdragon 之类的 ARM Windows 笔记本要选 `windows-arm64`，
x64 那个包装上去会跑不起来。
:::

## 验证

```powershell
# 进程在跑
Get-Process FlClash -ErrorAction SilentlyContinue

# 端口在监听（7080 是本机的混合端口）
netstat -ano | Select-String "7080"

# 用代理访问一下
curl.exe -x http://127.0.0.1:7080 -I https://www.google.com
```

第三条返回 `HTTP/2 200` 就通了。

## 首次配置

1. **接受免责声明** —— 首次启动会弹，必须同意才会启动内核
2. **导入订阅** —— 三种方式任选：
   - 粘贴订阅链接到「配置」页
   - 点订阅链接（`clash://install-config?url=<URL编码后的订阅>` 会自动唤起 FlClash）
   - 从本地文件导入
3. **选节点** —— 「代理」页选一个，测延迟
4. **开系统代理** —— 首页开关打开，此时命令行工具也会走代理
5. **TUN 模式（可选）** —— 需要接管全部流量（包括不认系统代理的程序）时开

## 配置在哪

| 路径 | 内容 |
| --- | --- |
| `%APPDATA%\com.follow\clash\` | **主配置目录** |
| `%APPDATA%\com.follow\clash\config.yaml` | 运行时生成的配置 |
| `%APPDATA%\com.follow\clash\profiles\*.yaml` | 订阅配置文件（每个订阅一个） |
| `%APPDATA%\com.follow\clash\shared_preferences.json` | 应用设置 |
| `%APPDATA%\com.follow\clash\database.sqlite` | 规则/统计数据库 |

macOS / Linux 上对应路径是 `~/.config/com.follow/clash` 或 `~/.local/share/com.follow/clash`，
具体以 FlClash 设置页显示的路径为准。

## 备份与还原

**要拷的**：

```powershell
# 主配置目录（含所有订阅文件与设置）
Copy-Item "$env:APPDATA\com.follow\clash" "备份目录\flclash" -Recurse
```

**不用拷的**（体积大且能自动下载）：

- `GEOIP.dat`、`GEOSITE.dat`、`ASN.mmdb` —— 规则数据库，启动时自动下载
- `cache.db` —— 缓存

::: danger 配置里含订阅地址
`profiles\*.yaml` 里就是你的订阅内容，包含节点信息。
**这是敏感数据**，别放进公开仓库。备份走私有渠道。
:::

**还原**：

1. 装 FlClash
2. 完全退出 FlClash
3. 把备份的 `clash` 目录拷回 `%APPDATA%\com.follow\clash`
4. 启动 FlClash，如果订阅过期就点「更新」
5. 确认端口号与 [Git 的代理配置](/env/git#本机的实际配置) 一致

::: warning 端口变了 git 会挂
本机 Git 配的是 `127.0.0.1:7080`。如果新机器上 FlClash 用了别的端口，
`git clone` 会报 `Failed to connect`。两边对齐一下。
:::

## 给命令行工具配代理

FlClash 开系统代理后，大部分工具会自动跟随。但有些程序不认系统代理，需要显式指定：

```powershell
# PowerShell 临时设（只影响当前窗口）
$env:HTTP_PROXY = "http://127.0.0.1:7080"
$env:HTTPS_PROXY = "http://127.0.0.1:7080"

# 验证
curl.exe -I https://www.google.com
```

```bash
# bash / zsh 临时设
export HTTP_PROXY=http://127.0.0.1:7080
export HTTPS_PROXY=http://127.0.0.1:7080
```

Git 的代理是独立配置的，见 [Git](/env/git#本机的实际配置)。

## 常用操作

| 操作 | 做法 |
| --- | --- |
| 更新订阅 | 「配置」页点刷新图标 |
| 测速选节点 | 「代理」页点闪电图标 |
| 看连接详情 | 「连接」页 |
| 看日志排错 | 「日志」页，调成 debug 级别 |
| 换端口 | 「设置」→ 混合端口 |
| 开机自启 | 「设置」→ 启动时运行 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 装完打不开 / 闪退 | ARM 机器装了 x64 包 | 下 arm64 版 |
| 订阅导入失败 | 链接失效或格式不是 Clash | 确认订阅是 Clash 格式（不是 v2ray） |
| 开了代理还是上不了网 | 节点挂了或规则不匹配 | 换节点、看日志 |
| git 报连接 7080 失败 | FlClash 没跑或端口不同 | 启动 FlClash / 对齐端口 |
| Linux 没有托盘图标 | 缺 appindicator | 见上面的 apt/dnf 命令 |
| 无头环境无法启动内核 | 需要手动接受免责声明 | 设环境变量 `FLCLASH_ACCEPT_DISCLAIMER=1` |

## 官方链接

- 官网：<https://chen08209.github.io/FlClash/>
- GitHub：<https://github.com/chen08209/FlClash>
- 最新 release：<https://github.com/chen08209/FlClash/releases/latest>
- 更新日志：<https://github.com/chen08209/FlClash/blob/main/CHANGELOG.md>
- Telegram 频道（公告与提问）：<https://t.me/FlClash>
- mihomo 内核文档：<https://wiki.metacubex.one/>
