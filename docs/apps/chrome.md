# Chrome

浏览器。登录账号后书签、密码、扩展会自己同步回来，基本不需要手动备份。

<div class="filmhead">
  <div class="filmhead__title">Google Chrome <span class="badge">156.0.8078.79</span></div>
  <p class="filmhead__lede">装完登录 Google 账号就行。真正要留意的是扩展和本地 profile。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>156.0.8078.79</dd>
    <dt>安装方式</dt><dd>官网安装包（本机非 winget 装的）</dd>
    <dt>安装位置</dt><dd>C:\Program Files\Google\Chrome\Application</dd>
    <dt>用户数据</dt><dd>%LOCALAPPDATA%\Google\Chrome\User Data</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

日常浏览、调试网页、跑 PWA。开发时还会用到它的 DevTools。

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id Google.Chrome
```

```powershell [Windows（官网） ~simple-icons:windows11~]
# 国内可用 https://www.google.cn/chrome/
# 或国际版 https://www.google.com/chrome/
# 下载 ChromeSetup.exe 双击
```

```bash [macOS ~simple-icons:apple~]
brew install --cask google-chrome
```

```bash [Linux（Debian / Ubuntu） ~simple-icons:linux~]
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt update && sudo apt install google-chrome-stable
```

:::

::: tip winget 装的是企业版 MSI
`winget install Google.Chrome` 实际下载 `googlechromestandaloneenterprise64.msi`。
功能与官网版一致，只是不自动更新到 beta 通道。日常用没有区别。
:::

## 验证

```powershell
# 查版本
(Get-Item "C:\Program Files\Google\Chrome\Application\chrome.exe").VersionInfo.FileVersion

# 或者在浏览器里打开
# chrome://version
```

## 配置在哪

| 位置 | 内容 | 要备份吗 |
| --- | --- | --- |
| Google 账号同步 | 书签、密码、历史、扩展列表、设置 | 不需要，登录即回来 |
| `%LOCALAPPDATA%\Google\Chrome\User Data\Default` | 本地 profile（Cookie、缓存、扩展数据） | 一般不需要 |
| `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Extensions` | 已装扩展的本地文件 | 不需要，同步会重装 |

## 备份与还原

**结论：基本不用备份。**

登录 Google 账号后，这些会自动回来：

- 书签
- 密码
- 历史记录
- 扩展（**但扩展的配置数据可能丢**，比如某些插件的本地设置）
- 主题、搜索引擎、自动填充

**什么情况下需要手动拷 profile**：

| 场景 | 做法 |
| --- | --- |
| 有扩展的配置很重要（如密码管理器本地库） | 拷 `User Data\Default` 下对应扩展的目录 |
| 有多套 profile（工作/个人） | 拷整个 `User Data` 目录 |
| 公司电脑不能登 Google 账号 | 拷整个 `User Data` |

```powershell
# 拷整个 profile（Chrome 必须先完全退出）
Copy-Item "$env:LOCALAPPDATA\Google\Chrome\User Data" "备份目录\ChromeUserData" -Recurse
```

::: warning 拷 profile 前先退出 Chrome
Chrome 运行时 profile 里的 SQLite 文件是锁定状态，拷出来的数据可能损坏。
任务管理器里确认 `chrome.exe` 全部结束后再拷。
:::

## 换机流程

1. 新机器装 Chrome
2. 登录同一个 Google 账号
3. 等几分钟同步完成（右上角头像处能看到同步状态）
4. 检查扩展是否都在，缺的手动去商店装

## 常用页面

| 地址 | 作用 |
| --- | --- |
| `chrome://version` | 版本、profile 路径、命令行参数 |
| `chrome://extensions` | 扩展管理 |
| `chrome://settings/syncSetup` | 同步设置 |
| `chrome://flags` | 实验性功能 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 无法登录 Google 账号 | 网络 | 先开代理（[FlClash](/apps/flclash)） |
| 扩展没同步回来 | 该扩展已下架 | 手动装替代品 |
| 书签重复 | 多次同步冲突 | 书签管理器里合并 |
| 更新失败 | 权限或磁盘 | 重装 |

## 官方链接

- 官网（国际）：<https://www.google.com/chrome/>
- 官网（国内可访问）：<https://www.google.cn/chrome/>
- 企业版 MSI 直链：<https://dl.google.com/dl/chrome/install/googlechromestandaloneenterprise64.msi>
- 扩展商店：<https://chromewebstore.google.com/>
- 版本记录：<https://chromereleases.googleblog.com/>
