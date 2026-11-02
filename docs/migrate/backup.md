# 备份清单

老机器退役前，把这些拷走。按优先级排的，时间不够就从上面开始拷。

<div class="filmhead">
  <div class="filmhead__title">备份清单 <span class="badge">4 类</span></div>
  <p class="filmhead__lede">真正的价值不在软件，在配置和记忆。</p>
  <dl class="spec">
    <dt>总量估计</dt><dd>约 200 MB（不含游戏和项目代码）</dd>
    <dt>耗时</dt><dd>10–20 分钟</dd>
    <dt>最近核对</dt><dd>2026-11-02</dd>
  </dl>
</div>

## 优先级一：丢了要重建的

这些丢了不是"重装一下"，是"重新想一遍"。

| 内容 | 路径 | 为什么重要 |
| --- | --- | --- |
| Git 全局配置 | `~/.gitconfig` | 身份、代理、换行符、LFS 全部在这 |
| Git SSH 密钥 | `~/.ssh/` | 丢了要重新生成并在各平台加公钥 |
| npm 配置 | `~/.npmrc` | 镜像源、私有源 token |
| WorkBuddy 个性化 | `~/.workbuddy/user-*-personal/*.md` | 长期记忆与角色设定 |
| OpenCode 主配置 | `~/.config/opencode/opencode.json` | 提供商、模型、插件 |
| OpenCode 密钥 | `~/.config/opencode/secrets/` | API Key |
| FlClash 配置 | `%APPDATA%\com.follow\clash\` | 订阅与规则 |

## 优先级二：丢了要重配的

| 内容 | 路径 | 说明 |
| --- | --- | --- |
| pnpm 全局配置 | `%LOCALAPPDATA%\pnpm\config.yaml` | store 位置、镜像 |
| OpenCode 插件 | `E:\opencode\plugins\` | 自写的本地插件 |
| OpenCode TUI 配置 | `~/.config/opencode/cli.json` | 主题、界面偏好 |
| WorkBuddy skills | `~/.workbuddy/skills/` | 47 个技能 |
| OpenCode skills | 见 [Skills 清单](/apps/opencode/skills) | 3 个目录 |
| Chrome profile（可选） | `%LOCALAPPDATA%\Google\Chrome\User Data` | 多账号或不登录时用 |
| VS Code 配置 | `%APPDATA%\Code\User\`（settings / keybindings / snippets / chatLanguageModels） | 插件清单另用 `code --list-extensions` 记；外传前必须脱敏，见 [VS Code](/apps/vscode#备份与还原) |

## 优先级三：项目代码

代码本身应该在 Git 远端，但要确认：

```powershell
# 找出所有还没推到远端的仓库
Get-ChildItem E:\ -Directory -Depth 2 -Filter ".git" -Force -ErrorAction SilentlyContinue |
  ForEach-Object {
    $repo = $_.Parent.FullName
    Push-Location $repo
    $status = git status --porcelain 2>$null
    $unpushed = git log --branches --not --remotes --oneline 2>$null
    if ($status -or $unpushed) {
      Write-Output "未同步: $repo"
      if ($unpushed) { Write-Output "  有未推送提交: $($unpushed.Count) 个" }
      if ($status) { Write-Output "  有未提交改动: $($status.Count) 个文件" }
    }
    Pop-Location
  }
```

## 优先级四：可选

| 内容 | 为什么可能不需要 |
| --- | --- |
| Chrome 书签/密码 | 登录 Google 账号自动回来 |
| Steam 游戏 | 太大，重新下载或用库目录识别 |
| npm 全局包 | 有清单就能重装 |
| Hexo/Hugo 的 `public/` | 构建产物，随时重生成 |
| pnpm store | 大，但能省大量下载时间 |

## 一条命令打包

把优先级一和二打成一个压缩包（**注意：这个包含密钥，只能放私有位置**）：

```powershell
$dest = "D:\backup\env-$(Get-Date -f yyyyMMdd)"
New-Item -ItemType Directory -Path $dest -Force | Out-Null

# Git
Copy-Item "$env:USERPROFILE\.gitconfig" $dest -ErrorAction SilentlyContinue
Copy-Item "$env:USERPROFILE\.ssh" "$dest\.ssh" -Recurse -ErrorAction SilentlyContinue

# npm / pnpm
Copy-Item "$env:USERPROFILE\.npmrc" $dest -ErrorAction SilentlyContinue
Copy-Item "$env:LOCALAPPDATA\pnpm\config.yaml" "$dest\pnpm-config.yaml" -ErrorAction SilentlyContinue

# OpenCode
Copy-Item "E:\opencode\data\config\opencode" "$dest\opencode-config" -Recurse -ErrorAction SilentlyContinue
Copy-Item "E:\opencode\plugins" "$dest\opencode-plugins" -Recurse -ErrorAction SilentlyContinue

# WorkBuddy
Compress-Archive -Path "$env:USERPROFILE\.workbuddy\skills" -DestinationPath "$dest\workbuddy-skills.zip" -Force -ErrorAction SilentlyContinue
Get-ChildItem "$env:USERPROFILE\.workbuddy" -Directory -Filter "user-*-personal" |
  Copy-Item -Destination "$dest\workbuddy-personal" -Recurse -ErrorAction SilentlyContinue

# FlClash
Copy-Item "$env:APPDATA\com.follow\clash" "$dest\flclash" -Recurse -ErrorAction SilentlyContinue

# 全局包清单
npm ls -g --depth=0 > "$dest\npm-globals.txt"

# 已装软件清单（换机时能自动装回一部分，见 /env/winget#备份与还原）
winget export -o "$dest\winget-apps.json" --include-versions

Write-Output "备份完成: $dest"
```

::: danger 这个包不能进 Git
里面有你所有的密钥和订阅。放加密盘、私有网盘，或者至少压缩加密。
:::

## 备份存在哪

| 方式 | 适合 | 注意 |
| --- | --- | --- |
| 移动硬盘 | 大文件、游戏 | 最可靠 |
| 私有网盘 | 配置包 | 加密后上传 |
| 加密压缩包 + 任意云 | 配置包 | 用 7z 加密码 |
| Git 私有仓库 | 纯配置文件 | **先脱敏**，别提交 secrets |

::: warning 别只存一份
备份的目的是"另一台机器能拿到"。如果备份和原机器在同一个盘上，
盘坏了就一起没了。
:::

## 下一步

备份完不是结束。到新机器上还要按 [恢复演练](/migrate/restore) 走一遍，
确认真的能用。
