# 基础环境

七个东西，装完就有完整的本地开发能力。按依赖关系排的，从上往下装。

<div class="filmhead">
  <div class="filmhead__title">基础环境总览 <span class="badge">7 项</span></div>
  <p class="filmhead__lede">Node 系三个 + Git + 两个静态站生成器。</p>
  <dl class="spec">
    <dt>依赖顺序</dt><dd>Git → Node → npm → pnpm → Hugo / Hexo</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 清单

| 名称 | 本机版本 | 装它干嘛 | 必须吗 |
| --- | --- | --- | --- |
| [Git](/env/git) | `2.56.0` | 版本控制，也是 npm 拉 GitHub 包的前提 | 必须 |
| [Node.js](/env/nodejs) | `24.21.0` | 跑一切 JS 工具 | 必须 |
| [npm](/env/npm) | `12.2.0` | 随 Node 附带，包管理 | 必须 |
| [pnpm](/env/pnpm) | `12.8.1` | 更快的包管理，磁盘占用小 | 建议 |
| [Hugo](/env/hugo) | `0.166.0+extended` | 静态站生成，编译快到离谱 | 按需 |
| [Hexo](/env/hexo) | `4.3.2` | 另一个静态站生成器，中文生态好 | 按需 |
| corepack | `0.36.0` | 随 Node 附带，管 pnpm/yarn 版本 | 随附 |
| yarn | `1.22.22` | 老项目可能还在用 | 可选 |

## 为什么要分顺序

| 顺序 | 原因 |
| --- | --- |
| Git 在 Node 前 | npm 从 GitHub 拉包、Hugo 主题、Hexo 主题都走 git 协议 |
| Node 在 npm/pnpm 前 | npm 随 Node 捆绑，pnpm 的 npm 安装方式需要 Node |
| Node 在 Hexo 前 | Hexo 是 npm 全局包 |
| Hugo 随意 | 单文件二进制，不依赖任何东西 |

## 装完之后

环境齐了的验收命令在 [换机顺序 · 装完的验收](/guide/order#装完的验收)。
想核对具体版本号，看 [版本快照](/guide/snapshot)。

::: tip 一个常被忽略的前置
Windows 上 `npm i -g` 装的东西都在 `%APPDATA%\npm`，这个目录必须在 PATH 里。
Node 官方安装包会自动加，但如果你用 fnm / nvm 之类管理版本，可能要手动确认一下：

```powershell
$env:PATH -split ';' | Select-String 'npm'
```

没有输出就说明全局包装了也调不到。
:::
