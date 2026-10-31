# Hugo

静态站生成器。单文件二进制，构建速度极快。

<div class="filmhead">
  <div class="filmhead__title">Hugo <span class="badge">0.166.0+extended</span></div>
  <p class="filmhead__lede">必须装 extended 版。普通版缺 SCSS 编译，一半主题会构建失败。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>0.166.0+extended windows/amd64</dd>
    <dt>安装方式</dt><dd>winget install Hugo.Hugo.Extended</dd>
    <dt>安装位置</dt><dd>%LOCALAPPDATA%\Microsoft\WinGet\Links\hugo.exe</dd>
    <dt>配置文件</dt><dd>hugo.toml / hugo.yaml（在各自项目里）</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 把 Markdown 编译成静态网站
- 主题生态成熟，构建比 Hexo 快一个量级
- 本机用来写博客站（如 Mizuki 主题）

## 先搞清楚选哪个版本

Hugo 有三个发行版本，装错了后面会踩坑：

| 版本 | 能干什么 | 什么时候选 |
| --- | --- | --- |
| standard | 基础功能 | 基本不选 |
| **extended** | 基础 + 编译 SCSS/SASS | **默认选这个** |
| extended/deploy | extended + 云部署能力 | 需要 `hugo deploy` 时 |

`hugo.Hugo.Extended` 这个 winget 包就是 extended 版本，名字里的 "Extended" 就是标识。

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id Hugo.Hugo.Extended
```

```powershell [Windows（Chocolatey） ~simple-icons:windows11~]
choco install hugo-extended
```

```powershell [Windows（Scoop） ~simple-icons:windows11~]
scoop install hugo-extended
```

```bash [macOS（Homebrew） ~simple-icons:apple~]
# 注意：brew 的 hugo 已经是 extended/deploy 版本
brew install hugo
```

```bash [macOS（MacPorts） ~simple-icons:apple~]
sudo port install hugo
```

```bash [Linux（Debian / Ubuntu） ~simple-icons:linux~]
# 仓库版本可能偏旧，装完务必 hugo version 检查
sudo apt install hugo
```

```bash [Linux（Snap） ~simple-icons:linux~]
sudo snap install hugo
# snap 版是严格沙箱，站点必须放在家目录内
```

```bash [Linux（Arch） ~simple-icons:linux~]
sudo pacman -S hugo
```

:::

::: warning apt 装的 Hugo 常常很老
Debian/Ubuntu 仓库里的 Hugo 可能落后几十个小版本，导致新主题用不了。
稳妥做法是直接下 release 的二进制：

```bash
# 以 0.166.0 为例，去 https://github.com/gohugoio/hugo/releases 查最新
wget https://github.com/gohugoio/hugo/releases/download/v0.166.0/hugo_extended_0.166.0_linux-amd64.tar.gz
tar -xf hugo_extended_0.166.0_linux-amd64.tar.gz
sudo mv hugo /usr/local/bin/
```
:::

## 验证

```powershell
hugo version
```

输出必须**同时包含** `extended` 和架构信息，像这样：

```
hugo v0.166.0-78400b4de8adc99273d3e674ed6c4d14c3bdf669+extended windows/amd64 BuildDate=2026-09-09
```

看到 `+extended` 才算装对。只有 `v0.166.0` 没有 `+extended` 的是标准版，用 SCSS 主题会报错。

```powershell
# 确认实际执行的是哪个文件
where.exe hugo
```

## 配置在哪

Hugo 本身没有全局配置。配置都在各自项目根目录：

| 文件 | 说明 |
| --- | --- |
| `hugo.toml` / `hugo.yaml` / `hugo.json` | 站点配置，新版本推荐用 `hugo.toml` |
| `config/_default/` | 配置拆分目录（多环境时用） |
| `themes/` | 主题目录；用 Hugo Modules 时不在这里 |
| `content/` | 文章 |
| `public/` | 构建输出（不要提交到 git） |

## 备份与还原

Hugo 本体不需要备份（重装即可），**要备份的是你的站点项目**：

```powershell
# 站点项目里这些要拷
content/      # 文章
static/       # 静态资源
layouts/      # 自定义布局
themes/       # 主题（如果是 git clone 的，可只记仓库地址）
hugo.toml     # 配置
```

```powershell
# 如果主题是 git submodule，新机器上要重新拉
git submodule update --init --recursive
```

::: tip public/ 千万别备份
构建产物，体积大且可以随时重新生成。把它加进 `.gitignore`。
:::

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `hugo new site <名字>` | 新建站点 |
| `hugo new content posts/hello.md` | 新建文章 |
| `hugo server -D` | 本地预览（含草稿） |
| `hugo server --bind 0.0.0.0` | 局域网内手机也能访问 |
| `hugo` | 构建到 `public/` |
| `hugo --gc --minify` | 构建并清理、压缩 |
| `hugo mod clean` | 清模块缓存 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `TOCSS: failed to transform` | 装的是标准版 | 换 extended 版 |
| `error: module not found` | 主题用 Hugo Modules 但没装 Go | 装 Go，或改用 git submodule 方式 |
| 构建输出到奇怪的地方 | 工作目录不对 | `cd` 到有 `hugo.toml` 的目录再构建 |
| 中文 slug 乱码 | 主题 URL 编码设置 | 在配置里设 `permalinks` 或改用英文文件名 |

## 官方链接

- 官网：<https://gohugo.io/>
- 安装 · Windows：<https://gohugo.io/installation/windows/>
- 安装 · macOS：<https://gohugo.io/installation/macos/>
- 安装 · Linux：<https://gohugo.io/installation/linux/>
- 版本发布页（下二进制）：<https://github.com/gohugoio/hugo/releases>
- 主题站：<https://themes.gohugo.io/>
- 文档：<https://gohugo.io/documentation/>
