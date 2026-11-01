# DSH / DSH-TUI：MCP 与配套工具

本机盘点日期：2026-11-01。本页区分“用命令启动的服务”“远程MCP”和“本地手写适配器”。只整理可公开复装部分，不原样复制profile、请求头、环境变量值或凭据。

入口：[桌面端扩展](/apps/dsh/extensions) · [TUI扩展](/apps/dsh-tui/extensions)

## MCP现状与本轮处理

以下5项在TUI的 `cordis.patch.yml` 中明确声明；桌面端profile的本次结构检查没有发现相同MCP声明，**不能据此认定桌面端没有MCP**，也不能把TUI配置当两端共用配置。当前会话暴露的工具也不能证明桌面端配置相同。

| MCP | TUI配置方式 | 本轮归类 |
| --- | --- | --- |
| GitHub | stdio；Node运行本地包装脚本，再启动本地exe | 本地适配器/二进制来源待核，暂不提供恢复命令 |
| DeepWiki | streamable-http，`https://mcp.deepwiki.com/mcp` | 远程服务，无本地npm包可备份 |
| Context7 | streamable-http，`https://mcp.context7.com/mcp` | 远程服务；授权信息另行配置，不复制 |
| Parallel Search | streamable-http | 远程服务；本轮不导出认证配置或连接URL |
| Chrome DevTools | stdio；本地包装脚本转发npx命令 | 发布包命令可归集；本地包装脚本暂缓 |

本地GitHub包装器和Chrome包装器是本地文件，不因它们最后启动公开工具就算作可直接重建的整体配置。没有复制、替换或删除这些文件。

### Chrome DevTools：可复装部分

本机配置最终使用 `npx -y chrome-devtools-mcp@latest`，另带两个启动参数。本页只保留最小、较保守的入口，不照搬放宽文件路径访问的参数：

```shell
# 查看当前版本支持的参数，不是安装或连接成功证明
npx -y chrome-devtools-mcp@latest --help
```

`npx` 会下载并运行第三方代码；运行前核对包来源。`@latest` 为滚动版本，不保证与本机缓存一致。本次未执行此命令，不声称已经验证重连；需要浏览器连接设置和宿主MCP配置，不能仅靠这一行恢复。发布包：[chrome-devtools-mcp](https://www.npmjs.com/package/chrome-devtools-mcp)。

### 远程MCP的恢复边界

远程服务不需要把node_modules搬到新电脑。需在目标profile的MCP设置中重新添加服务、完成必要授权，然后验证工具列表与一次实际调用。不能把GitHub访问令牌、Context7请求头或其他服务密钥写进此站。

本轮不提供把5项完整注入patch的脚本：当前连接中夹有本地包装器和认证配置，超出“仅归集命令安装项”的范围。

## BrowserSkill：不是MCP

`@wxg-prc-cpg/browser-skill-dsh-plugin` 是DSH工具插件，提供 `bsk_*`；不能和Chrome DevTools MCP混作同一套安装。

| 部件 | 本机盘点 | 恢复方式 |
| --- | --- | --- |
| DSH插件 | desktop0.3.3 / TUI0.4.0 | 用各自扩展页的固定版本命令 |
| BrowserSkill CLI | 命令解析到用户 `.local/bin/bsk.exe` | 官方安装方式本轮未追溯，不编造npm包名 |
| Chromium扩展 | 此前会话已验证连接 | 新电脑需安装并配对，扩展不在profile依赖里 |

已有CLI时可只读查看：

```shell
bsk --version
```

此命令只确认CLI版本，不能证明扩展在线。不要在恢复清单里自动执行update、改浏览器权限或复制已登录浏览器资料。

项目：[Tencent/BrowserSkill](https://github.com/Tencent/BrowserSkill)。

## Skills、模型与数据

- 桌面端的发布版Skills管理器已归入[桌面端扩展](/apps/dsh/extensions)。TUI本地创建的Skills/MCP包暂缓，不移动共享Skills目录。
- 模型接入、顾问、回退、记忆相关发布插件分别归入两端扩展页；装包只恢复程序，不恢复账号、模型渠道配置或记忆数据库。
- 不复制 `.credentials.yaml`、会话正文、账号缓存、Token、浏览器Cookie，也不生成整profile备份包。

本轮未改变任何MCP配置，未调用业务写入工具测试服务。后续整理本地项时，再逐一处理源码、包装器、版本固定和脱敏恢复模板。
