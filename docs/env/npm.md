# npm

Node 自带的包管理器。不用单独装，但需要单独配。

<div class="filmhead">
  <div class="filmhead__title">npm <span class="badge">12.2.0</span></div>
  <p class="filmhead__lede">随 Node 一起装好。真正要做的只有两件事：配镜像、配凭据。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>12.2.0</dd>
    <dt>安装方式</dt><dd>随 Node.js 附带，无需单独安装</dd>
    <dt>配置文件</dt><dd>~/.npmrc</dd>
    <dt>全局目录</dt><dd>%APPDATA%\npm</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 装全局 CLI（`npm i -g`）
- 在项目里装依赖（多数场景已被 pnpm 取代）
- 发布自己的包

## 装

装好 Node 就有 npm，不用单独操作。确认一下：

```powershell
npm -v
```

想升级 npm 自身：

```powershell
npm install -g npm@latest
```

## 配置

### 镜像源

国内直连 `registry.npmjs.org` 经常超时。写进 `~/.npmrc`：

```ini
registry=https://registry.npmmirror.com/
```

或者用命令写（等价）：

```powershell
npm config set registry https://registry.npmmirror.com/
```

::: tip 装私有包时切回来
镜像站不同步私有包。遇到 404 时临时切回官方源：

```powershell
npm config set registry https://registry.npmjs.org/
```
:::

### 全局包目录

如果 `npm i -g` 报 `EPERM`，说明全局目录在受保护路径。改到用户目录：

```powershell
npm config set prefix "$env:USERPROFILE\.npm-global"
# 然后把 %USERPROFILE%\.npm-global\bin 加进 PATH（Windows 是 .npm-global 本身）
```

## 验证

```powershell
npm -v
npm config get registry
npm ls -g --depth=0
```

`npm config get registry` 应该输出你配的镜像地址。

## 备份与还原

**要拷的**：就一个文件 `~/.npmrc`。

```powershell
Copy-Item "$env:USERPROFILE\.npmrc" 备份目录\
```

**还原**：拷回 `~/.npmrc`，然后重装全局包（清单见 [Node.js · 备份与还原](/env/nodejs#备份与还原)）。

::: warning .npmrc 里可能有 token
如果你配过私有源，`.npmrc` 里会有 `//registry.xxx.com/:_authToken=xxxx`。
拷给别人或传到公开仓库前必须删掉这一行。
:::

## 常用命令速查

| 命令 | 作用 |
| --- | --- |
| `npm ls -g --depth=0` | 列出所有全局包及版本 |
| `npm view <pkg> version` | 查某个包的最新版 |
| `npm outdated -g` | 查哪些全局包该升级 |
| `npm update -g` | 升级全部全局包（谨慎，可能破坏老项目） |
| `npm cache clean --force` | 清缓存 |

## 官方链接

- 官网：<https://www.npmjs.com/>
- 文档：<https://docs.npmjs.com/>
- `.npmrc` 全部配置项：<https://docs.npmjs.com/cli/v12/configuring-npm/npmrc>
- 镜像站：<https://registry.npmmirror.com/>
