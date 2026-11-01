# 桌面软件

装完就能用、不需要配环境的那一批。

<div class="filmhead">
  <div class="filmhead__title">桌面软件总览 <span class="badge">3 项 + 顺带</span></div>
  <p class="filmhead__lede">Chrome 和 Steam 登录即恢复；FlClash 要重新导入订阅。</p>
  <dl class="spec">
    <dt>装完要配的</dt><dd>FlClash（订阅）</dd>
    <dt>装完不用管的</dt><dd>Chrome、Steam</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 清单

| 名称 | 本机版本 | 装法 | 需要备份吗 |
| --- | --- | --- | --- |
| [Chrome](/apps/chrome) | `156.0.8078.79` | 官网安装包 | 不需要，登录即同步 |
| [FlClash](/apps/flclash) | `0.8.99` | `winget` | **需要**，配置和订阅 |
| [Steam](/apps/steam) | `2.10.91.91` | `winget` | 不需要，登录即恢复 |
| [顺带装的那些](/apps/extras) | — | 混合 | 视情况 |

## 为什么先装 FlClash

新机器上很多下载源（GitHub、nodejs.org）在国内可能很慢或打不开。
先把代理弄通，后面每一步都快得多。这也是 [换机顺序](/guide/order) 把代理排在第一步的原因。

## AI 工具单独分组

| 工具 | 安装说明 |
| --- | --- |
| [DSH](/apps/dsh/) | 官方桌面端、CLI / Web，区分两种安装入口 |
| [DSH-TUI](/apps/dsh-tui/) | 社区终端界面，Windows 安装包或 npm 安装 |
| [OpenCode](/apps/opencode/) | 安装与配置 |
| [WorkBuddy](/apps/workbuddy/) | 安装与配置 |

这些工具装完还需要接入账号或模型，所以在侧栏单独分组。
DSH 与 DSH-TUI 本次只补安装和启动说明；skills、MCP、其他插件及配置备份留到后续。
