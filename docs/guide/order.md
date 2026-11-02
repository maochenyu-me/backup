# 换机顺序

新机器到手，从头到尾照着走。顺序不是随便排的，每一步都依赖上一步已经把东西装好。

<div class="filmhead">
  <div class="filmhead__title">八层顺序 <span class="badge">按依赖关系排列</span></div>
  <p class="filmhead__lede">每层做完再进下一层，跳步骤会在后面卡住。</p>
  <dl class="spec">
    <dt>预计耗时</dt><dd>2–4 小时（不含下载等待）</dd>
    <dt>最近核对</dt><dd>2026-11-02</dd>
  </dl>
</div>

## 动手之前

::: warning 第 0 步永远是联网
新机器没有代理时，`github.com`、`nodejs.org`、`hugo` release 页、`dl.google.com` 都可能很慢或打不开。
**先把网络通掉再干别的**，否则你会在第一分钟就开始等下载。装代理的方法见 [FlClash](/apps/flclash)。
:::

如果目标机器上已经能上网，从第 2 步开始。

---

<ol class="timeline">

<li>
<div class="timeline__head">联网与代理</div>
<div class="timeline__body">

先把网搞通。装 [FlClash](/apps/flclash)，导入订阅，确认能打开 `github.com`。
这一步不做完，后面每一步都会慢十倍。

</div>
</li>

<li>
<div class="timeline__head">包管理器</div>
<div class="timeline__body">

Windows 用 [winget](/env/winget)（Win11 自带，Win10 多数自带，LTSC / 精简版需装 App Installer）。
这一步只装包管理器本身，不装软件。装好后 `winget --version` 有输出就过了。

::: tip Win11 用户大概率什么都不用做
先跑 `winget --version`。有版本号就跳过这一步，别为了「按流程走」去重装一遍。
只有 LTSC、Server、砍掉 Store 的精简版才真的要装，装法见 [winget](/env/winget#装)。
:::

后续所有 Windows 软件都通过它安装，好处是"装的是什么版本、从哪装的"有据可查。

</div>
</li>

<li>
<div class="timeline__head">Git 与凭据</div>
<div class="timeline__body">

先装 [Git](/env/git)，因为后面 `npm i -g` 从 GitHub 拉包、`hugo` 主题下载、`hexo` 主题都靠它。

装完立刻配两件事：`user.name` / `user.email`，以及凭据管理（Windows 用 Git Credential Manager），
否则第一次 `git push` 会卡在认证上。代理也要在这里一并配好。

</div>
</li>

<li>
<div class="timeline__head">Node 系</div>
<div class="timeline__body">

装 [Node.js](/env/nodejs) → 确认 [npm](/env/npm) 可用 → 装 [pnpm](/env/pnpm)。

顺序不能反：pnpm 依赖 Node；而如果你要用 `corepack` 启用 pnpm，也得先有 Node。
三个都装完后 `node -v && npm -v && pnpm -v` 三条都给出版本号才算过。

</div>
</li>

<li>
<div class="timeline__head">Hugo 与 Hexo</div>
<div class="timeline__body">

[Hugo](/env/hugo) 是单文件二进制，装完直接能跑；注意选 **extended** 版本，
普通版缺 SCSS 支持，很多主题会构建失败。

[Hexo](/env/hexo) 是 npm 全局包，必须在 Node 装好之后。装完 `hexo -v` 验证。

</div>
</li>

<li>
<div class="timeline__head">AI 工具</div>
<div class="timeline__body">

按需安装 [DSH](/apps/dsh/)、[DSH-TUI](/apps/dsh-tui/)、[OpenCode](/apps/opencode/) 与 [WorkBuddy](/apps/workbuddy/)。
DSH 官方桌面端自带运行时；npm CLI 与 DSH-TUI 的 npm 路线则依赖前面准备的 Node.js 和 pnpm。
DSH-TUI 还提供自带依赖的 Windows x64 安装包，不必先装官方桌面端。

装好主体后接入账号或模型，再发一条简单消息验证。DSH 和 DSH-TUI 的扩展、配置备份本次不展开；
OpenCode 与 WorkBuddy 的已有说明仍见各自页面。

</div>
</li>

<li>
<div class="timeline__head">桌面软件</div>
<div class="timeline__body">

[Chrome](/apps/chrome)、[Steam](/apps/steam)、[VS Code](/apps/vscode)，以及 [顺带装的那些](/apps/extras)。

Chrome / Steam 装完就能用，不需要配置。VS Code 要单独处理一下：它的**配置和 28 个插件**要搬，
一键还原包见 [VS Code · 自用配置与插件](/apps/vscode#自用配置与插件)。

</div>
</li>

<li>
<div class="timeline__head">配置恢复</div>
<div class="timeline__body">

前面七步装的是"软件"，这一步搬的是"你的设置"：`~/.gitconfig`、`.npmrc`、`opencode.json`、
FlClash 的配置与订阅、以及各个 skills 目录。

具体拷哪些、怎么拷，看 [恢复演练](/migrate/restore)。

</div>
</li>

</ol>

---

## 装完的验收

跑一遍下面这段，全部有输出就说明环境齐了。

::: code-group

```powershell [Windows ~simple-icons:windows11~]
winget --version; node -v; npm -v; pnpm -v; git --version; hugo version; hexo -v
```

```bash [macOS ~simple-icons:apple~]
node -v && npm -v && pnpm -v && git --version && hugo version && hexo -v
```

```bash [Linux ~simple-icons:linux~]
node -v && npm -v && pnpm -v && git --version && hugo version && hexo -v
```

:::

对照 [版本快照](/guide/snapshot) 看版本号是否接近。不必完全一致，但大版本不要差太多——
比如 Node 从 24 跳到 26 一般没事，但跨两个 LTS 大版本时某些老项目可能会炸。

## 相关的两件事

- **老机器还没退役**：先去 [备份清单](/migrate/backup) 把该拷的拷走，别等它坏了才想起来。
- **不确定某样东西要不要装**：看 [顺带装的那些](/apps/extras)，里面是"装了但不常用"的清单。
