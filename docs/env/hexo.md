# Hexo

基于 Node 的静态博客框架，中文生态好，主题插件多。

<div class="filmhead">
  <div class="filmhead__title">Hexo <span class="badge">4.3.2</span></div>
  <p class="filmhead__lede">npm 全局包。必须先装 Node，再装它。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>hexo-cli 4.3.2</dd>
    <dt>安装方式</dt><dd>npm i -g hexo-cli</dd>
    <dt>全局 bin</dt><dd>%APPDATA%\npm\hexo</dd>
    <dt>配置文件</dt><dd>_config.yml（在各自博客项目里）</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 把 Markdown 编译成静态博客
- 主题插件比 Hugo 丰富（尤其是中文社区）
- 生成纯静态文件，可直接丢 GitHub Pages

## 装

::: code-group

```powershell [Windows ~simple-icons:windows11~]
npm install -g hexo-cli
```

```bash [macOS ~simple-icons:apple~]
npm install -g hexo-cli
```

```bash [Linux ~simple-icons:linux~]
sudo npm install -g hexo-cli
```

:::

::: warning 必须先有 Node
`hexo-cli` 是 npm 全局包，Node 没装好的话会直接报错。
先完成 [Node.js](/env/nodejs)，再回来装这个。
:::

## 验证

```powershell
hexo -v
```

会输出一大段信息，关键看前两行：

```
hexo-cli: 4.3.2
os: win32 10.0.26200
node: 24.21.0
```

`node` 版本也在里面，顺手确认了 Node 装对了。

## 新建一个博客

```powershell
# 建项目（会在当前目录创建子文件夹）
hexo init my-blog
cd my-blog

# 装项目依赖
npm install
# 或者用 pnpm（更快）
pnpm install

# 本地预览
hexo server
# 打开 http://localhost:4000
```

## 配置在哪

Hexo 的配置分两层，别搞混：

| 文件 | 位置 | 作用 |
| --- | --- | --- |
| `_config.yml` | **博客项目根目录** | 站点配置：标题、URL、主题、部署 |
| `_config.<theme>.yml` | 项目根目录 | 主题自己的配置（可覆盖主题默认值） |
| `package.json` | 项目根目录 | 主题、插件依赖清单 |

::: tip 用 _config.[主题名].yml 覆盖
改主题设置时**不要直接改 `themes/<主题>/_config.yml`**，因为主题升级会覆盖掉。
在项目根目录建 `_config.主题名.yml`，Hexo 会自动优先读它。
:::

## 备份与还原

**要备份的是博客项目整个目录**，重点这些：

```
my-blog/
├── _config.yml            配置
├── _config.<theme>.yml    主题配置覆盖
├── package.json           依赖清单（重要）
├── source/                文章、页面
│   ├── _posts/            已发布文章
│   └── _drafts/           草稿
├── themes/                主题（git clone 的话可重新拉）
└── scaffolds/             模板
```

**不用备份的**：

- `node_modules/`（重新 `npm install` 即可）
- `public/`（构建产物）
- `.deploy_git/`（部署缓存）

**还原**：

```powershell
# 1. 装 Node
# 2. 装 hexo-cli
npm install -g hexo-cli

# 3. 把项目拷回来
cd my-blog

# 4. 装依赖
npm install

# 5. 验证
hexo server
```

::: warning package.json 比 node_modules 重要
`node_modules` 不用拷，但 `package.json` 一定要有——它记录了主题和插件的准确版本。
丢了它，你就得靠记忆重建整个插件列表。
:::

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `hexo init <名字>` | 新建博客项目 |
| `hexo new "标题"` | 新建文章 |
| `hexo new draft "标题"` | 新建草稿 |
| `hexo server` | 本地预览，默认 4000 端口 |
| `hexo generate` / `hexo g` | 构建到 `public/` |
| `hexo deploy` / `hexo d` | 部署（需先配 `_config.yml` 的 deploy） |
| `hexo clean` | 清缓存和 public |
| `hexo list` 子命令 | `hexo list post` 列出所有文章 |

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `hexo: command not found` | 全局 bin 不在 PATH | 检查 `%APPDATA%\npm` |
| 主题配置改了不生效 | 改的是 themes 里的文件 | 改用根目录 `_config.[主题].yml` |
| 部署到 GitHub Pages 后样式丢失 | `_config.yml` 里的 `url`/`root` 不对 | 项目页要设 `root: /仓库名/` |
| `renderer` 相关报错 | 缺 markdown 渲染器 | `npm i hexo-renderer-marked` |
| 构建很慢 | 文章多 | 换 Hugo，或清理缓存 `hexo clean` |

## 官方链接

- 官网：<https://hexo.io/>
- 中文文档：<https://hexo.io/zh-cn/docs/>
- 主题库：<https://hexo.io/themes/>
- 插件库：<https://hexo.io/plugins/>
- GitHub：<https://github.com/hexojs/hexo>
- hexo-cli：<https://www.npmjs.com/package/hexo-cli>
