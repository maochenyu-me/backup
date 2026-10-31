# WorkBuddy 安装与配置

腾讯云出的 AI Agent 办公工具。装完要配账号、权限模式、skills。

<div class="filmhead">
  <div class="filmhead__title">WorkBuddy <span class="badge">5.9.2</span></div>
  <p class="filmhead__lede">桌面客户端，不是 CLI。配置主要在应用内完成，落盘在 ~/.workbuddy。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>5.9.2</dd>
    <dt>安装方式</dt><dd>winget install Tencent.WorkBuddy</dd>
    <dt>数据目录</dt><dd>%USERPROFILE%\.workbuddy</dd>
    <dt>skills 目录</dt><dd>%USERPROFILE%\.workbuddy\skills</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 让它读一个目录里的 PDF / Word / Excel，产出新的文档
- 定时任务：每小时/每天/每周跑一次
- 从消息应用远程下发任务，在本机执行
- 通过 skills 和 MCP 扩展能力

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id Tencent.WorkBuddy
```

```powershell [Windows（官网） ~simple-icons:windows11~]
# https://www.workbuddy.cn/ 下载 Windows 版
# 有用户版和共享版两种安装包，个人用选用户版
```

```bash [macOS ~simple-icons:apple~]
# 官网 https://www.workbuddy.cn/ 下载 macOS 版（DMG）
# 首次打开需在「系统设置 → 隐私与安全性」允许
```

:::

::: warning winget 源里的版本落后
本机装的是 `5.9.2`，而 `winget show Tencent.WorkBuddy` 显示源里是 `5.8.3`。
想装最新版直接去官网下，winget 那份更新慢半拍。
:::

## 验证

```powershell
winget list Tencent.WorkBuddy
Get-ChildItem "$env:USERPROFILE\.workbuddy" -ErrorAction SilentlyContinue | Select-Object Name
```

第二条有输出说明已经初始化过（首次启动后才会创建）。

## 配置在哪

WorkBuddy 的数据都在用户主目录下的 `.workbuddy`：

| 路径 | 内容 | 要备份吗 |
| --- | --- | --- |
| `.workbuddy\skills\` | **技能目录** | **要** |
| `.workbuddy\user-<id>-personal\` | 个性化设定：`IDENTITY.md`、`MEMORY.md`、`SOUL.md`、`USER.md` | **要** |
| `.workbuddy\storage\` | 本地存储 | 视情况 |
| `.workbuddy\tasks\` | 历史任务记录 | 不用 |
| `.workbuddy\traces\` | 运行追踪日志 | 不用，体积大 |
| `.workbuddy\shell-snapshots\` | shell 环境快照 | 不用 |
| `.workbuddy\unified-asset\` | 资源索引 | 不用 |
| `.workbuddy\wbipc\endpoint.json` | 进程间通信端点 | 不用，会重新生成 |

::: tip 那四个 .md 才是"你的 WorkBuddy"
`IDENTITY.md` / `MEMORY.md` / `SOUL.md` / `USER.md` 记录了它对你的理解、
长期记忆和角色设定。这些丢了，等于换了个不认识你的助手。

迁移时这四个文件优先级最高。
:::

## 备份与还原

**要拷的**：

```powershell
# skills（数量多，打包压一下）
Compress-Archive -Path "$env:USERPROFILE\.workbuddy\skills" `
                 -DestinationPath "备份目录\workbuddy-skills.zip" -Force

# 个性化设定
$personal = Get-ChildItem "$env:USERPROFILE\.workbuddy" -Directory -Filter "user-*-personal"
Copy-Item $personal.FullName "备份目录\workbuddy-personal" -Recurse
```

**不用拷的**：`traces/`、`tasks/`、`shell-snapshots/`、`storage/`。

**还原**：

1. 装 WorkBuddy，首次启动完成登录（会创建 `.workbuddy` 目录）
2. **先完全退出 WorkBuddy**
3. 把 `skills` 解压回去，把 `user-*-personal` 拷回
4. 重新启动

::: warning 目录名里的用户 ID 会变
`user-ba9c12d2-...-personal` 这个 ID 是账号绑定的。如果换了账号，
新目录名会不同，**直接把旧目录整个拷进去可能不被识别**。
稳妥做法是拷那四个 `.md` 文件到新目录里，而不是拷整个文件夹。
:::

## 权限模式

WorkBuddy 执行高风险操作（删文件、跑命令、发邮件）前会暂停等确认。
这个行为由权限模式控制，在应用设置里改。

| 模式 | 行为 | 建议 |
| --- | --- | --- |
| 每次确认 | 每个高风险操作都问 | 默认，最安全 |
| 部分放行 | 只对特定类型放行 | 熟悉后可以调 |
| 全放行 | 不问直接做 | 只在隔离环境用 |

::: danger 全放行要谨慎
它真的会删文件、真的会发邮件。全放行只在你确认任务范围完全可控时开。
:::

## 定时任务

支持每小时 / 每天 / 每周 / 指定时间一次。

任务定义存在 `.workbuddy\tasks\` 下，但这些**不建议备份**——
重装后在新环境里重建一遍更可靠，因为任务往往依赖本机路径和已装软件。

## Skills

本机有 47 个 skill，完整清单见 [WorkBuddy Skills](/apps/workbuddy/skills)。

这些 skill 一部分是应用市场装的（目录名带 `__skillhub`），一部分是本地放的。
市场装的那部分重装后可能自动回来，本地放的必须手动拷。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 装完打不开 | 系统版本太低 | 查官网的系统要求 |
| 登录不上 | 网络或账号 | 开代理后重试 |
| skills 不显示 | 目录结构不对 | 确认是 `skills/<name>/SKILL.md` |
| 个性化设定没恢复 | 用户 ID 变了 | 拷四个 .md 而不是整个目录 |
| 任务执行失败 | 依赖的本机软件没装 | 先补齐环境 |
| 占用空间大 | traces 日志堆积 | 定期清 `traces/` |

## 官方链接

- 官网：<https://www.workbuddy.cn/>
- 文档：<https://www.workbuddy.cn/docs/workbuddy/>
- 国际版：<https://www.workbuddy.ai/>
- 腾讯云产品页：<https://cloud.tencent.com/product/codebuddy>
- 帮助文档：<https://cloud.tencent.com/document/product/1749/104249>
