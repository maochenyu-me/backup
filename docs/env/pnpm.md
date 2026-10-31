# pnpm

比 npm 快的包管理器，用硬链接共享依赖，磁盘占用小很多。

<div class="filmhead">
  <div class="filmhead__title">pnpm <span class="badge">12.8.1</span></div>
  <p class="filmhead__lede">本机所有前端项目都用它。装一次，全局可用。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>12.8.1</dd>
    <dt>安装方式</dt><dd>npm i -g pnpm</dd>
    <dt>全局 bin</dt><dd>%APPDATA%\npm</dd>
    <dt>store 位置</dt><dd>E:\.pnpm-store\v11</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 替代 npm 装依赖，速度快 2–3 倍
- 多个项目共享同一份包，磁盘占用大幅下降
- VitePress 站点本身就用 pnpm（见 [部署本站](/migrate/deploy)）

## 装

::: code-group

```powershell [Windows（npm） ~simple-icons:windows11~]
npm install -g pnpm@latest
```

```powershell [Windows（独立脚本） ~simple-icons:windows11~]
# 不依赖 Node 也能装（但官方建议 Windows 用 npm 装，避免 Defender 拦截）
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

```powershell [Windows（corepack） ~simple-icons:windows11~]
# corepack 随 Node 附带，用它启用 pnpm
corepack enable pnpm
corepack prepare pnpm@latest --activate
```

```bash [macOS（Homebrew） ~simple-icons:apple~]
brew install pnpm
```

```bash [macOS（Linux / npm） ~simple-icons:apple~]
npm install -g pnpm@latest
```

```bash [Linux（独立脚本） ~simple-icons:linux~]
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

:::

::: tip pnpm 12 起是原生二进制
从 pnpm 12 开始，用独立脚本装的话**不需要 Node** 也能运行。
但用 npm 装的话仍然要求 Node 18+。本机是用 npm 装的。
:::

## 验证

```powershell
pnpm -v          # 12.8.1
pnpm store path  # E:\.pnpm-store\v11
```

`pnpm store path` 的输出很重要——迁移时可以整个 store 目录拷走，新机器省下大量下载时间。

## 配置

pnpm 的配置分两处：

| 文件 | 位置 | 作用 |
| --- | --- | --- |
| `pnpm-workspace.yaml` | 项目根目录 | **项目级**设置，含构建白名单 |
| 全局 `config.yaml` | `%LOCALAPPDATA%\pnpm\config.yaml` | 机器级设置（store 位置等） |

::: warning pnpm 12 起不再读 package.json 的 pnpm 字段
以前写在 `package.json` 里的 `"pnpm": { "onlyBuiltDependencies": [...] }` 现在**被忽略**。
要放到项目根的 `pnpm-workspace.yaml` 里：

```yaml
packages: []

allowBuilds:
  esbuild: true
```

本仓库就需要这一条，否则 `pnpm install` 会报 `ERR_PNPM_IGNORED_BUILDS`。
:::

### 换镜像

```powershell
pnpm config set registry https://registry.npmmirror.com/
```

### 换 store 位置

store 默认在 `%LOCALAPPDATA%\pnpm\store`。想挪到大盘（本机在 E 盘）：

```powershell
pnpm config set store-dir E:\.pnpm-store
```

## 备份与还原

**要拷的**：

- 全局配置：`%LOCALAPPDATA%\pnpm\config.yaml`（含镜像、store 位置）
- 可选：整个 store 目录（体积大，但省下载）

```powershell
Copy-Item "$env:LOCALAPPDATA\pnpm\config.yaml" 备份目录\
```

**还原**：

1. 装 Node
2. `npm i -g pnpm@latest`
3. 拷回 `config.yaml`
4. 有拷 store 的话，把 store 放到同路径再 `pnpm config set store-dir <路径>`

## 常见命令

| 命令 | 作用 |
| --- | --- |
| `pnpm install` | 装依赖 |
| `pnpm dev` | 跑 package.json 里的 dev 脚本 |
| `pnpm build` | 构建 |
| `pnpm add <pkg>` | 加依赖 |
| `pnpm add -g <pkg>` | 全局装 |
| `pnpm self-update` | 升级 pnpm 自身 |
| `pnpm store path` | 查 store 位置 |
| `pnpm store prune` | 清理没被引用的包 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `ERR_PNPM_IGNORED_BUILDS` | 有包需要跑构建脚本但你没批准 | 在 `pnpm-workspace.yaml` 加 `allowBuilds` |
| `pnpm` is not recognized | 全局 bin 不在 PATH | 检查 `%APPDATA%\npm` |
| 安装时提示 store 无法硬链接 | store 和项目不在同盘 | 把 store 挪到与项目同盘，或用 `--shamefully-hoist` |
| 版本和 `npm view pnpm version` 不一致 | 正常，本机不追最新 | 需要时 `pnpm self-update` |

## 官方链接

- 官网：<https://pnpm.io/>
- 安装：<https://pnpm.io/installation>
- 设置项全表：<https://pnpm.io/settings>
- CLI 文档：<https://pnpm.io/cli/install>
- GitHub：<https://github.com/pnpm/pnpm>
