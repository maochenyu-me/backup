# Git

版本控制。也是 npm 从 GitHub 拉包、Hugo/Hexo 拉主题的前提。

<div class="filmhead">
  <div class="filmhead__title">Git <span class="badge">2.56.0</span></div>
  <p class="filmhead__lede">装完必须配两样：身份和凭据。少一样就会在第一次 push 时卡住。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>2.56.0.windows.4</dd>
    <dt>安装方式</dt><dd>winget install Git.Git</dd>
    <dt>安装位置</dt><dd>C:\Program Files\Git</dd>
    <dt>配置文件</dt><dd>~/.gitconfig、~/.ssh/</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 克隆仓库、提交、推送
- npm 从 GitHub 拉依赖（某些包走 git+https 协议）
- Hugo 主题、Hexo 主题的安装
- GitHub Desktop、VS Code 等 GUI 工具底层都用它

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id Git.Git
```

```powershell [Windows（安装包） ~simple-icons:windows11~]
# https://git-scm.com/download/win 下载 64-bit Git for Windows Setup
# 安装时建议：默认分支选 main、换行符选 Checkout as-is / Commit as-is
```

```bash [macOS（Homebrew） ~simple-icons:apple~]
brew install git
```

```bash [macOS（Xcode 命令行工具） ~simple-icons:apple~]
xcode-select --install
```

```bash [Linux（Debian / Ubuntu） ~simple-icons:linux~]
sudo apt install git
```

```bash [Linux（Fedora） ~simple-icons:linux~]
sudo dnf install git
```

:::

## 验证

```powershell
git --version
where.exe git
```

## 装完必须配的两件事

### 1. 身份

```powershell
git config --global user.name "Moretti815"
git config --global user.email "kemiaomcy@outlook.com"
```

不配的话，提交记录里是空的，GitHub 不认这是你。

### 2. 凭据

::: code-group

```powershell [Windows ~simple-icons:windows11~]
# Git for Windows 自带 Credential Manager，装完通常已经启用
git config --global credential.helper manager

# 确认
git config --global --get credential.helper
```

```bash [macOS ~simple-icons:apple~]
git config --global credential.helper osxkeychain
```

```bash [Linux ~simple-icons:linux~]
# 需要装 libsecret
sudo apt install libsecret-1-0 libsecret-1-dev
git config --global credential.helper libsecret
```

:::

配好后第一次 `git push` 会弹窗要账号，输一次之后就不再问了。

## 本机的实际配置

从本机 `git config --global --list` 读出来的，换机时可以照着抄：

```ini
[user]
    name = Moretti815
    email = kemiaomcy@outlook.com
[core]
    editor = "E:\vscode\Microsoft VS Code\bin\code" --wait
    autocrlf = input
    longpaths = true
    protectntfs = false
[credential "https://gitee.com"]
    provider = generic
[filter "lfs"]
    clean = git-lfs clean -- %f
    smudge = git-lfs smudge -- %f
    process = git-lfs filter-process
    required = true
[http]
    proxy = http://127.0.0.1:7080
[https]
    proxy = http://127.0.0.1:7080
[url "https://github.com/"]
    insteadOf = git+ssh://git@github.com/
```

::: warning 注意代理那两行
本机的 `http.proxy` 指向 `127.0.0.1:7080`，这是 FlClash 的本地端口。
**新机器上 FlClash 没跑起来时，这两行会让所有 git 操作失败**（连接被拒绝）。

所以还原顺序是：先装并启动 FlClash，再写这两行配置。

```powershell
# 临时关掉代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```
:::

::: tip core.autocrlf=input
如果你只在 Windows 上开发，`input` 是合适的：检出时保持仓库原样，提交时把 CRLF 转成 LF。
这样和 Linux/macOS 协作不会有换行符噪音。
:::

## 配置在哪

| 文件 | 位置 | 内容 |
| --- | --- | --- |
| 全局配置 | `~/.gitconfig`（Windows: `C:\Users\<user>\.gitconfig`） | 上表所有内容 |
| SSH 密钥 | `~/.ssh/id_ed25519`、`id_ed25519.pub` | 免密推送用 |
| SSH 配置 | `~/.ssh/config` | 多账号、多密钥时用 |
| 凭据 | Windows 凭据管理器 | 不要手动备份，重新登录即可 |

## SSH 密钥（可选，但推荐）

比每次输密码省事，也避开 2FA 的麻烦。

```powershell
ssh-keygen -t ed25519 -C "kemiaomcy@outlook.com"
# 一路回车；想设密码就设，不想直接回车

# 查看公钥，复制到 GitHub → Settings → SSH and GPG keys
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"

# 测试
ssh -T git@github.com
```

macOS / Linux 同样命令，查看公钥用 `cat ~/.ssh/id_ed25519.pub`。

## 备份与还原

**要拷的**：

```powershell
# 全局配置
Copy-Item "$env:USERPROFILE\.gitconfig" 备份目录\

# SSH 密钥（可选，但拷了就不用重新加公钥到 GitHub）
Copy-Item "$env:USERPROFILE\.ssh" 备份目录\.ssh -Recurse
```

::: danger 私钥别进公开仓库
`id_ed25519` 是私钥，泄露等于别人能冒充你推代码。
放在私有备份里，或者干脆不拷、新机器重新生成再往 GitHub 加一次公钥。
:::

**还原**：

1. 装 Git
2. 拷回 `.gitconfig`、`.ssh`
3. 如果是新生成的密钥，把公钥加到 GitHub
4. **确认代理配置与实际代理端口一致**

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `git config --global --list` | 看全部全局配置 |
| `git config --global user.name "x"` | 改用户名 |
| `git remote -v` | 看远程地址 |
| `git log --oneline -10` | 看最近 10 次提交 |
| `git status` | 看当前状态 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `Failed to connect to 127.0.0.1 port 7080` | 配了代理但代理没跑 | 启动 FlClash，或 unset 代理 |
| `Permission denied (publickey)` | 公钥没加到 GitHub | 复制 `.pub` 内容到 GitHub |
| `fatal: detected dubious ownership` | 仓库属于其他用户 | `git config --global --add safe.directory <路径>` |
| 文件名中文乱码 | `core.quotepath` | `git config --global core.quotepath false` |

## 官方链接

- 官网：<https://git-scm.com/>
- Windows 下载：<https://git-scm.com/download/win>
- 官方书籍 Pro Git（免费）：<https://git-scm.com/book/zh/v2>
- 凭据管理器：<https://github.com/git-ecosystem/git-credential-manager>
- 安装文档：<https://git-scm.com/install/windows>
