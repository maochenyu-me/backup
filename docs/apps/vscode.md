# VS Code

主力编辑器。本机的特殊之处是**系统级安装、但装在 E 盘**，配置也不在安装目录里。

<div class="filmhead">
  <div class="filmhead__title">VS Code <span class="badge">1.140.0</span></div>
  <p class="filmhead__lede">换机时真正要搬的是 <code>%APPDATA%\Code\User</code> 下的几个文件，不是整个安装目录。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>1.140.0（x64，commit 07f806f999）</dd>
    <dt>安装方式</dt><dd>系统级安装包（非 winget，装到 E 盘）</dd>
    <dt>安装目录</dt><dd>E:\vscode\Microsoft VS Code</dd>
    <dt>用户配置</dt><dd>%APPDATA%\Code\User</dd>
    <dt>扩展目录</dt><dd>%USERPROFILE%\.vscode\extensions（28 个，388 MB）</dd>
    <dt>最近核对</dt><dd>2026-11-02</dd>
  </dl>
</div>

## 干什么用

- 主力代码编辑器，前端 / Markdown / Shell / 配置文件的日常编辑
- 通过扩展变成「带 Git 图形界面 + AI 补全 + 远程开发」的半个 IDE
- 本仓库（VitePress 站点）和大多数本机项目都在这里写

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id Microsoft.VisualStudioCode
```

```powershell [Windows（官网安装包） ~simple-icons:windows11~]
# https://code.visualstudio.com/download
# User Installer（推荐，装到 %LOCALAPPDATA%\Programs，免管理员）或 System Installer（全局，可改路径）
```

```bash [macOS（Homebrew） ~simple-icons:apple~]
brew install --cask visual-studio-code
```

```bash [Linux（snap） ~simple-icons:linux~]
sudo snap install code --classic
```

:::

::: warning 本机的装法不是 winget
本机用的是**系统安装包 + 自定义路径 `E:\vscode\Microsoft VS Code`**，`winget install` 默认会装到
`C:\Program Files\Microsoft VS Code`。想复刻本机（装 C 盘之外），只能用官网的 System Installer 手动选目录。

装完记得勾选「添加到 PATH」，否则终端里没有 `code` 命令。
:::

## 验证

```powershell
code --version                    # 1.140.0 / 07f806f999 / x64
where.exe code                    # E:\vscode\Microsoft VS Code\bin\code
code --list-extensions | Measure-Object -Line   # 扩展数量
```

`code` 命令能出三行（版本 / commit / 架构）才算正常。

## 配置在哪

**配置不在安装目录**。改设置也不用翻路径，`Ctrl+Shift+P` → `Preferences: Open User Settings (JSON)` 直接打开。

| 内容 | 路径 | 本机实测 |
| --- | --- | --- |
| 用户设置 | `%APPDATA%\Code\User\settings.json` | 有，约 6 KB |
| 快捷键 | `%APPDATA%\Code\User\keybindings.json` | **没有**（没改过键位就不生成，正常） |
| 代码片段 | `%APPDATA%\Code\User\snippets\` | 空 |
| AI 模型配置 | `%APPDATA%\Code\User\chatLanguageModels.json` | 有，含模型服务 endpoint |
| 启动参数 | `%USERPROFILE%\.vscode\argv.json` | 有（语言、crash reporter） |
| 扩展 | `%USERPROFILE%\.vscode\extensions` | 28 个，388 MB |
| 扩展全局状态 | `%APPDATA%\Code\User\globalStorage` | 540 MB，**不用备份** |
| 工作区状态 | `%APPDATA%\Code\User\workspaceStorage` | 140 个目录 / 200 MB，**不用备份** |
| 编辑历史 | `%APPDATA%\Code\User\History` | 体积大，**不用备份** |

项目级配置另算：`.vscode\settings.json`、`tasks.json`、`launch.json`、`extensions.json` 跟着仓库走，
不在这里。

## 自用配置与插件

本机的完整配置包（设置 + 28 个扩展清单 + 逐扩展配置 + 常用工作区路径 + 一键还原脚本）：

::: tip 自用备份
**夸克网盘：<https://pan.quark.cn/s/cb47e413dcdf>**

包文件名 `vscode-backup-2026-11-02.zip`（约 30 KB，18 个文件）。包里所有凭据都已替换成
占位符 `__请填入__`，可以安全分享；还原后照着包内 `config/secrets-checklist.md` 补 5 处即可。
:::

### 包里有什么

| 路径 | 内容 |
| --- | --- |
| `config/settings.json` | 用户设置（凭据处为 `__请填入__`） |
| `config/settings.core.json` | 其中 VS Code 内置的键（editor / files / workbench …） |
| `config/settings.orphans.json` | 已卸载扩展留下的残留配置（27 个键，可整块删） |
| `config/chatLanguageModels.json` | AI 模型配置 |
| `config/argv.json` | 启动参数 |
| `config/secrets-checklist.md` | 还原后要手动补的 5 项凭据 |
| `extensions/extensions.txt` | 28 个扩展的 `id@version` |
| `extensions/restore-extensions.ps1` | 按清单批量重装 |
| `extensions/settings/<扩展 id>.json` | 单个扩展自己的那部分配置 |
| `projects/workspaces.txt` | 打开过的 130 个工作区路径 |
| `restore-all.ps1` | 一键还原，支持 `-DryRun` 先看后做 |

### 本机的 28 个扩展

| 类别 | 扩展 |
| --- | --- |
| AI | `Anthropic.claude-code`、`zstings.claude-code-zhcn` |
| 主题 | `PKief.material-icon-theme`、`zhuangtongfa.material-theme` |
| Git | `eamodio.gitlens`、`donjayamanne.githistory`、`github.vscode-github-actions` |
| 前端 | `vue.volar`、`esbenp.prettier-vscode`、`dbaeumer.vscode-eslint`、`formulahendry.auto-rename-tag`、`christian-kohler.path-intellisense` |
| 文档 | `DavidAnson.vscode-markdownlint`、`cschlosser.doxdocgen`、`MS-CEINTL.vscode-language-pack-zh-hans` |
| 容器与远程 | `ms-azuretools.vscode-containers`、`ms-vscode-remote.remote-ssh`、`ms-vscode-remote.remote-ssh-edit`、`ms-vscode.remote-explorer` |
| 效率 | `usernamehw.errorlens`、`adpyke.codesnap`、`jasonlhy.hungry-delete`、`kisstkondoros.vscode-gutter-preview`、`wayou.vscode-todo-highlight`、`ritwickdey.liveserver`、`rangav.vscode-thunder-client`、`ms-vscode.hexeditor`、`ms-edgedevtools.vscode-edge-devtools` |

### 还原步骤

```powershell
# 1. 解压到任意目录，进入 vscode-backups
# 2. 先看会动什么（不写文件）
powershell -ExecutionPolicy Bypass -File restore-all.ps1 -DryRun

# 3. 真还原：先把现有 settings.json 备份成 .bak-时间戳，再写配置、装扩展
powershell -ExecutionPolicy Bypass -File restore-all.ps1
```

4. 按包内 `config/secrets-checklist.md` 把 5 处 `__请填入__` 换成真值（Comate 账号与授权、
   `ANTHROPIC_AUTH_TOKEN`、模型服务 API Key、`crash-reporter-id`）
5. 重启 VS Code

::: warning 链接失效时
`https://pan.quark.cn/s/cb47e413dcdf` 是私人分享链接，可能过期。
本项目仓库里的 `vscode-backups/`（不随站点发布）保存了同源文件，
`node vscode-backups/collect.mjs` 可以随时按本机现状重新生成一份。
:::

## 备份与还原

最小集合就四个文件，能手拷就不必走压缩包：

```powershell
$user = "$env:APPDATA\Code\User"
$dest = "D:\backup\vscode-$(Get-Date -f yyyyMMdd)"

Copy-Item "$user\settings.json" $dest -ErrorAction SilentlyContinue
Copy-Item "$user\keybindings.json" $dest -ErrorAction SilentlyContinue
Copy-Item "$user\chatLanguageModels.json" $dest -ErrorAction SilentlyContinue
Copy-Item "$user\snippets" "$dest\snippets" -Recurse -ErrorAction SilentlyContinue
Copy-Item "$env:USERPROFILE\.vscode\argv.json" "$dest\argv.json" -ErrorAction SilentlyContinue
code --list-extensions --show-versions > "$dest\extensions.txt"
```

::: danger 别整个拷 `User` 目录，也别拷扩展目录
- `globalStorage`（540 MB）+ `workspaceStorage`（200 MB）是缓存和状态库，换机自动重建，拷了纯浪费
- `extensions` 388 MB，其中 `Anthropic.claude-code` 单个 255 MB（含平台二进制）；扩展是
  `code --install-extension id@版本` 一条命令装回来的东西
- `settings.json` 与 `chatLanguageModels.json` 里可能有第三方扩展写入的 license / API Key，
  往外传之前必须脱敏
:::

如果开了 **Settings Sync**（登录 GitHub / 微软账号），设置、键位、扩展清单、片段会存云端，
换机登录即可恢复大半；上面这套备份主要用于兜底，以及同步之外的东西（比如 `argv.json`）。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 终端里 `code` 不是命令 | 安装时没勾「添加到 PATH」 | 重跑安装包勾上，或手动把 `bin` 目录加进 PATH |
| 扩展装了但功能不生效 | 扩展宿主没重载 | `Ctrl+Shift+P` → `Developer: Reload Window` |
| 设置改了没反应 | 被工作区级 `.vscode/settings.json` 覆盖 | 看 `Preferences: Open Workspace Settings (JSON)` |
| 还原后扩展提示未授权 | 配置里的凭据还是 `__请填入__` | 按包内 `secrets-checklist.md` 补齐 |
| 中文提示在 PowerShell 5.1 里乱码 | 脚本无 BOM，被按 ANSI 读 | 备份包内的 `.ps1` 已带 BOM，自己写脚本也要带 |
| 启动报「找不到 code 命令」但已装 | 装在 E 盘、PATH 还指向旧位置 | `where.exe code` 核对，必要时改 PATH |

## 官方链接

- 官网：<https://code.visualstudio.com/>
- 下载：<https://code.visualstudio.com/download>
- 文档：<https://code.visualstudio.com/docs>
- 设置项全表：<https://code.visualstudio.com/docs/getstarted/settings>
- 扩展市场：<https://marketplace.visualstudio.com/vscode>
- 命令行参数：<https://code.visualstudio.com/docs/editor/command-line>
- 自用备份包：<https://pan.quark.cn/s/cb47e413dcdf>
