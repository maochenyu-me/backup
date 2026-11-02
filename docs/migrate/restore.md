# 恢复演练

新机器上把备份装回去。顺序很重要，反了会卡住。

<div class="filmhead">
  <div class="filmhead__title">恢复演练 <span class="badge">按序执行</span></div>
  <p class="filmhead__lede">先装能让你上网的东西，再装能让你下载的东西，最后放配置。</p>
  <dl class="spec">
    <dt>前置</dt><dd>已完成 [备份清单](/migrate/backup)</dd>
    <dt>耗时</dt><dd>1–2 小时（含下载）</dd>
    <dt>最近核对</dt><dd>2026-11-02</dd>
  </dl>
</div>

## 顺序为什么不能反

```
winget  →  代理  →  Git  →  Node  →  pnpm  →  Hugo/Hexo  →  AI 工具  →  配置
            ↑                                          ↑
        必须最先                                  配置里可能有代理地址
```

- 代理不先装，Git 和 Node 的下载会卡死
- Git 不在 Node 前，npm 从 GitHub 拉包会失败
- 配置不最后放，因为配置里引用了前面装的软件

## 第 0 步：确认 winget

后面几乎每一步都是 `winget install`，所以先确认它在：

```powershell
winget --version
```

Win11 和较新的 Win10 自带，什么都不用做。没有输出就是缺 App Installer 组件，
按 [winget · 装](/env/winget#装) 里的三种情况选一种装上（LTSC 走 MSIX，精简版走一行 bootstrap）。

::: warning 别把自己锁死
如果 **winget 没有、代理也还没装**，那 `winget install -e --id chen08209.FlClash` 这条直接不可用。
这种情况先去 FlClash 官网手动下安装包把网搞通，再回头补 winget —— 顺序上用户态的网络永远优先。
:::

## 第 1 步：代理

装 [FlClash](/apps/flclash)，导入订阅，确认能访问 `github.com`。

```powershell
winget install -e --id chen08209.FlClash
```

装完后**先别急着拷配置**，让它用默认配置跑起来，确认能上网。

## 第 2 步：Git

```powershell
winget install -e --id Git.Git
```

装完**立刻**拷回配置：

```powershell
Copy-Item "备份目录\.gitconfig" "$env:USERPROFILE\.gitconfig" -Force
Copy-Item "备份目录\.ssh" "$env:USERPROFILE\.ssh" -Recurse -Force
```

::: warning 先确认代理端口
`.gitconfig` 里的 `http.proxy` 指向 `127.0.0.1:7080`。
如果新机器的 FlClash 用的是别的端口，先改配置：

```powershell
git config --global http.proxy "http://127.0.0.1:<新端口>"
git config --global https.proxy "http://127.0.0.1:<新端口>"
```
:::

验证：

```powershell
git config --global --list
git ls-remote https://github.com/git/git.git HEAD
```

第二条能返回 commit hash 说明网络和 git 都通了。

## 第 3 步：Node 系

```powershell
winget install -e --id OpenJS.NodeJS.LTS

# 重开一个终端让 PATH 生效
node -v
npm -v
```

拷回 npm 配置：

```powershell
Copy-Item "备份目录\.npmrc" "$env:USERPROFILE\.npmrc" -Force
```

装 pnpm：

```powershell
npm i -g pnpm@latest
pnpm -v
```

::: tip 全局包怎么重装
有 `npm-globals.txt` 的话照着装：

```powershell
npm i -g pnpm hexo-cli yarn tsx http-server
```

不用全装——只装你实际会用的。
:::

## 第 4 步：Hugo 与 Hexo

```powershell
winget install -e --id Hugo.Hugo.Extended
npm i -g hexo-cli
```

验证：

```powershell
hugo version    # 必须看到 +extended
hexo -v
```

## 第 5 步：AI 工具

### OpenCode

1. 装本体
2. 拷配置目录
3. **设四个 XDG 环境变量**（最容易漏的一步）
4. 拷密钥到 `secrets/`
5. 拷插件目录

```powershell
# 配置
Copy-Item "备份目录\opencode-config" "E:\opencode\data\config\opencode" -Recurse -Force

# 插件
Copy-Item "备份目录\opencode-plugins" "E:\opencode\plugins" -Recurse -Force

# 密钥（单独拷，注意权限）
Copy-Item "备份目录\opencode-secrets" "E:\opencode\data\secrets" -Recurse -Force

# 环境变量
[Environment]::SetEnvironmentVariable('XDG_CONFIG_HOME', 'E:\opencode\data\config', 'User')
[Environment]::SetEnvironmentVariable('XDG_DATA_HOME', 'E:\opencode\data\share', 'User')
[Environment]::SetEnvironmentVariable('XDG_CACHE_HOME', 'E:\opencode\data\cache', 'User')
[Environment]::SetEnvironmentVariable('XDG_STATE_HOME', 'E:\opencode\data\state', 'User')
```

**重开终端**后验证：

```powershell
opencode --version
where.exe opencode
```

### WorkBuddy

1. 装（官网下最新版，winget 源落后）
2. 启动一次，完成登录
3. 完全退出
4. 解压 skills，拷个性化设定
5. 重新启动

```powershell
# skills
Expand-Archive "$env:USERPROFILE\.workbuddy\skills.zip" -DestinationPath "$env:USERPROFILE\.workbuddy\" -Force

# 个性化：只拷四个 .md，不拷整个目录（用户 ID 会变）
$newDir = (Get-ChildItem "$env:USERPROFILE\.workbuddy" -Directory -Filter "user-*-personal").FullName
Copy-Item "备份目录\workbuddy-personal\*.md" $newDir -Force
```

## 第 6 步：配置收尾

### FlClash 配置

```powershell
# 先完全退出 FlClash
Copy-Item "备份目录\flclash" "$env:APPDATA\com.follow\clash" -Recurse -Force
```

启动 FlClash，确认订阅还有效，端口和 git 配置一致。

### pnpm

```powershell
Copy-Item "备份目录\pnpm-config.yaml" "$env:LOCALAPPDATA\pnpm\config.yaml" -Force
pnpm config get store-dir
```

### VS Code

配置和插件一起搬，一键还原包见 [VS Code · 自用配置与插件](/apps/vscode#自用配置与插件)：

```powershell
# 解压备份包后进入 vscode-backups
powershell -ExecutionPolicy Bypass -File restore-all.ps1 -DryRun   # 先看会动什么
powershell -ExecutionPolicy Bypass -File restore-all.ps1           # 写配置 + 装 28 个扩展
```

还原完按包内 `config/secrets-checklist.md` 补 5 处 `__请填入__`（Comate 账号与授权、
`ANTHROPIC_AUTH_TOKEN`、模型服务 API Key），再重启 VS Code。

## 第 7 步：验收

```powershell
# 环境
node -v; npm -v; pnpm -v; git --version; hugo version; hexo -v

# AI 工具
opencode --version

# 网络
git ls-remote https://github.com/git/git.git HEAD
curl.exe -x http://127.0.0.1:7080 -I https://www.google.com
```

对照 [版本快照](/guide/snapshot) 检查版本是否接近。

## 一个真实的坑

::: warning XDG 变量是最容易漏的
OpenCode 配置拷过去了，但 `opencode` 启动后显示"没有配置"。
原因：只拷了文件，没设 `XDG_CONFIG_HOME`，它去 `~/.config/opencode` 找了。

**文件在哪不重要，变量指向哪才重要。**
:::

## 恢复后的检查清单

- [ ] 代理能上 GitHub
- [ ] `git clone` 一个公开仓库成功
- [ ] `npm i -g` 能装包
- [ ] `hugo version` 有 `+extended`
- [ ] OpenCode 能启动、能看到模型列表
- [ ] WorkBuddy 能看到 skills
- [ ] Chrome 登录后书签回来了
- [ ] FlClash 端口与 git 配置一致
