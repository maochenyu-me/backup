# Node.js

JavaScript 运行时，本机一切前端工具链的地基。

<div class="filmhead">
  <div class="filmhead__title">Node.js <span class="badge">24.21.0</span></div>
  <p class="filmhead__lede">装 LTS 版，别装 Current。所有 npm/pnpm/yarn 包都跑在它上面。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>24.21.0 (LTS Krypton)</dd>
    <dt>安装方式</dt><dd>winget install OpenJS.NodeJS.LTS</dd>
    <dt>安装位置</dt><dd>C:\Program Files\nodejs</dd>
    <dt>配置文件</dt><dd>~/.npmrc</dd>
    <dt>备份对象</dt><dd>~/.npmrc、全局包清单</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 跑 `npm` / `pnpm` / `yarn` 装包
- 跑 VitePress、Hexo、各种 CLI
- 跑 `npx` 临时执行工具
- 本机还有 OpenCode 的部分插件、wrangler、vercel 都依赖它

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id OpenJS.NodeJS.LTS
```

```powershell [Windows（安装包） ~simple-icons:windows11~]
# 从官网下 .msi 双击，一路默认即可
# https://nodejs.org/en/download
# 选 LTS 那栏，不要选 Current
```

```bash [macOS（Homebrew） ~simple-icons:apple~]
brew install node@24
```

```bash [macOS（安装包） ~simple-icons:apple~]
# https://nodejs.org/en/download 下载 .pkg
# Apple Silicon 与 Intel 都选 macOS Installer (.pkg)
```

```bash [Linux（NodeSource） ~simple-icons:linux~]
# Debian / Ubuntu
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```

```bash [Linux（发行版仓库） ~simple-icons:linux~]
# 版本可能偏旧，先查一下：apt-cache policy nodejs
sudo apt install nodejs npm
```

:::

::: warning 别用 winget 装 Current 版
包 ID `OpenJS.NodeJS`（不带 `.LTS`）是 Current 线，更新快但会踩兼容性问题。
这里要的是 `OpenJS.NodeJS.LTS`。
:::

## 验证

```powershell
node -v      # v24.21.0
npm -v       # 12.2.0
where.exe node
```

三条都有输出就成功了。`node -v` 输出的版本号与 `24.21.0` 差距在补丁号范围内都算正常。

## 多版本并存（可选）

同时维护几个项目时，老项目可能要求 Node 18/20。用 `fnm` 切换：

```powershell
winget install Schniz.fnm
fnm install 24
fnm install 20
fnm use 24
fnm default 24
```

macOS / Linux 用 `fnm` 或 `nvm`：

```bash
# fnm
brew install fnm          # macOS
curl -fsSL https://fnm.vercel.app/install | bash   # Linux

# 或者 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install 24
nvm use 24
```

## 配置在哪

| 文件 | 位置 | 作用 |
| --- | --- | --- |
| `.npmrc` | `~/.npmrc`（Windows: `C:\Users\<user>\.npmrc`） | 镜像源、token、代理 |
| 全局包 | `%APPDATA%\npm\node_modules`（Windows） | `npm i -g` 装的东西 |
| 缓存 | `%LOCALAPPDATA%\npm-cache`（Windows） | 可删，删了重新下 |

本机 `.npmrc` 里配了国内镜像，换机时这个文件要拷过去，否则装包会慢到怀疑人生。

## 备份与还原

**要拷的**：

```powershell
# Windows
Copy-Item "$env:USERPROFILE\.npmrc" 备份目录\

# 顺便把全局包清单导出
npm ls -g --depth=0
```

**还原顺序**：

1. 装 Node（`winget install -e --id OpenJS.NodeJS.LTS`）
2. 把 `.npmrc` 拷回 `~/.npmrc`
3. 按导出清单重装全局包：

```powershell
npm i -g pnpm hexo-cli yarn tsx http-server
```

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `node` 不是内部命令 | PATH 没生效 | 重开终端；还不行就检查 `C:\Program Files\nodejs` 在不在 PATH |
| `npm i -g` 后命令找不到 | `%APPDATA%\npm` 不在 PATH | 手动加进 PATH |
| 装包极慢或超时 | 没配镜像 | 在 `.npmrc` 加 `registry=https://registry.npmmirror.com/` |
| `EPERM` 权限错误 | Windows 权限 | 用管理员 PowerShell，或改 npm 全局目录到用户目录 |

## 官方链接

- 官网：<https://nodejs.org/>
- 下载页：<https://nodejs.org/en/download>
- 全部版本列表：<https://nodejs.org/dist/index.json>
- 发布计划（哪个版本还在维护）：<https://nodejs.org/en/about/previous-releases>
- LTS 说明：<https://nodejs.org/en/about/previous-releases#looking-for-latest-release-of-a-version-branch>
