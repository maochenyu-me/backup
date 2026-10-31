# 部署本站

这个站点本身也要能在四个平台上跑起来。配置已经写好了，填仓库信息就能用。

<div class="filmhead">
  <div class="filmhead__title">部署 <span class="badge">4 个平台</span></div>
  <p class="filmhead__lede">同一份代码，改一个环境变量适配不同路径。</p>
  <dl class="spec">
    <dt>构建命令</dt><dd>pnpm build</dd>
    <dt>产物目录</dt><dd>docs/.vitepress/dist</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 本地跑

```powershell
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # 构建到 docs/.vitepress/dist
pnpm preview    # 本地预览构建产物
```

## 一个关键点：base 路径

不同平台的访问路径不一样，这决定了 `base` 配置：

| 平台 | 访问地址 | base |
| --- | --- | --- |
| GitHub Pages（项目页） | `https://<user>.github.io/<repo>/` | `/<repo>/` |
| GitHub Pages（用户页） | `https://<user>.github.io/` | `/` |
| Vercel | `https://<project>.vercel.app/` | `/` |
| Cloudflare Pages | `https://<project>.pages.dev/` | `/` |
| EdgeOne Pages | `https://<project>.edgeone.app/` | `/` |
| 本地预览 | `http://localhost:5173/` | `/` |

配置里已经处理好了——`base` 读环境变量，不设就用 `site.config.mts` 里的默认值：

```ts
base: process.env.DOCS_BASE || site.base
```

所以部署时只需要在平台的环境变量里设 `DOCS_BASE`。

## GitHub Pages

仓库里已经有 `.github/workflows/deploy.yml`，推送到 `main` 自动部署。

**要做的事**：

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**
2. 如果是项目页（`github.io/<repo>/`），在仓库 Settings → Secrets and variables → Actions → Variables 里加：
   - Name: `DOCS_BASE`
   - Value: `/<你的仓库名>/`

**工作流做的事**：

```yaml
- 检出代码
- 装 pnpm
- pnpm install --frozen-lockfile
- pnpm build
- 上传 docs/.vitepress/dist 并部署
```

## Vercel

仓库里有 `vercel.json`，导入仓库即可。

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "docs/.vitepress/dist",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

Vercel 上 `base` 是 `/`，不用设环境变量。

## Cloudflare Pages

仓库里有 `wrangler.jsonc`。两种方式：

**方式一：Dashboard 连接 Git**

| 配置项 | 值 |
| --- | --- |
| Framework preset | None |
| Build command | `pnpm build` |
| Build output directory | `docs/.vitepress/dist` |
| Node version | 22 或更高 |

**方式二：命令行**

```powershell
pnpm build
npx wrangler pages deploy docs/.vitepress/dist --project-name=<项目名>
```

## EdgeOne Pages

腾讯云 EdgeOne Pages，国内访问速度好。

**连接 Git 仓库**：

| 配置项 | 值 |
| --- | --- |
| 构建命令 | `pnpm build` |
| 输出目录 | `docs/.vitepress/dist` |
| Node 版本 | 22+ |

EdgeOne 会自动检测 VitePress 项目，通常不用手动填。

## 离线可用

这是"换机"场景的特殊需求：新机器可能还没网。

构建产物是纯静态文件，拷到 U 盘也能看，但直接双击 `index.html` 会因为绝对路径打不开。
正确做法是起一个本地服务：

::: code-group

```powershell [Windows ~simple-icons:windows11~]
# 用 Python（本机装了）
cd docs\.vitepress\dist
python -m http.server 8080

# 或用 npx（需先有 Node）
npx http-server docs\.vitepress\dist -p 8080
```

```bash [macOS / Linux]
cd docs/.vitepress/dist
python3 -m http.server 8080
```

:::

然后浏览器打开 `http://localhost:8080`。

::: tip 想双击 index.html 就能看的话
要同时满足两个条件：相对路径 + 带 .html 的链接。

```powershell
$env:DOCS_BASE="./"
$env:DOCS_CLEAN_URLS="false"
pnpm build
```

第一条把资源与站内链接改成相对路径，第二条关掉 cleanUrls（否则链接是
`./guide/order` 而文件实际叫 `order.html`，双击会 404）。

代价：搜索索引和部分 SPA 跳转在 `file://` 下可能异常。只给离线包用，别拿去部署。
:::

## 构建验证

部署前本地先跑一遍，确保没坏：

```powershell
pnpm build
```

看到 `✓ building client + server bundles...` 和 `build complete` 就成功了。
产物在 `docs/.vitepress/dist`，可以 `pnpm preview` 看一眼。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 部署后样式全丢 | `base` 没设对 | 项目页要 `/<repo>/` |
| 部署后 404 | 输出目录配错 | 必须是 `docs/.vitepress/dist` |
| 构建失败 `ERR_PNPM_IGNORED_BUILDS` | pnpm 12 的构建白名单 | 确认 `pnpm-workspace.yaml` 里有 `allowBuilds` |
| 中文搜索搜不到 | 内置搜索的分词限制 | 页面少时用侧边栏导航替代 |
| 构建很慢 | 依赖缓存没命中 | 平台一般会自动缓存 `node_modules` |

## 相关

- 站点的配置都在 `docs/.vitepress/site.config.mts`，改站名改这里
- 内容和样式分开：内容在 `docs/`，样式在 `docs/.vitepress/theme/`
