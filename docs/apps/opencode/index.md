# OpenCode 安装与配置

终端里的 AI 编码 agent。装起来一分钟，配起来一小时。

<div class="filmhead">
  <div class="filmhead__title">OpenCode <span class="badge">2.2.5</span></div>
  <p class="filmhead__lede">真正的成本不在安装，在配置：提供商、模型、插件、skills。</p>
  <dl class="spec">
    <dt>本机版本</dt><dd>2.2.5</dd>
    <dt>安装方式</dt><dd>独立安装包（非 npm）</dd>
    <dt>主目录</dt><dd>E:\opencode</dd>
    <dt>配置目录</dt><dd>E:\opencode\data\config\opencode</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 干什么用

- 在终端里跟模型对话，让它读写代码、跑命令
- 加载 skills 做特定领域的活（前端设计、Cloudflare、代码审查……）
- 接自己的模型提供商（本机接的是中转站）

## 装

::: code-group

```powershell [Windows（winget） ~simple-icons:windows11~]
winget install -e --id SST.opencode
```

```powershell [Windows（安装脚本） ~simple-icons:windows11~]
# 官方脚本
irm https://opencode.ai/install.ps1 | iex
```

```bash [macOS（Homebrew） ~simple-icons:apple~]
brew install sst/tap/opencode
```

```bash [macOS（Linux / 安装脚本） ~simple-icons:apple~]
curl -fsSL https://opencode.ai/install.sh | bash
```

```bash [任意平台（npm） ~simple-icons:windows11~]
npm i -g opencode-ai
```

:::

::: warning 本机不是用 npm 装的
本机 `opencode.exe` 在 `E:\opencode\opencode.exe`，版本 2.2.5；
而 npm 全局里还残留一个 `opencode-ai@1.17.7`（旧版本，没在用）。

**两个版本并存会互相抢 PATH**。迁移时先确认 `where.exe opencode` 指向哪个，
别让旧的那份抢先。
:::

## 验证

```powershell
opencode --version     # opencode v2.2.5
where.exe opencode     # 确认路径
```

## 配置在哪

这是 OpenCode 最容易搞混的地方。**配置目录 ≠ 安装目录**，而且可以被环境变量重定向。

| 层级 | 默认路径 | 本机实际路径 |
| --- | --- | --- |
| 全局配置 | `~/.config/opencode/` | `E:\opencode\data\config\opencode\` |
| 数据（会话、缓存） | `~/.local/share/opencode/` | `E:\opencode\data\share\` |
| 缓存 | `~/.cache/opencode/` | `E:\opencode\data\cache\` |
| 状态 | `~/.local/state/opencode/` | `E:\opencode\data\state\` |
| 项目配置 | `<项目>/.opencode/` | 随项目 |

本机通过四个环境变量把 XDG 目录整体搬到了 E 盘：

```powershell
XDG_CONFIG_HOME = E:\opencode\data\config
XDG_DATA_HOME   = E:\opencode\data\share
XDG_CACHE_HOME  = E:\opencode\data\cache
XDG_STATE_HOME  = E:\opencode\data\state
```

::: tip 迁移时这四个变量必须一起搬
只拷文件不设变量，OpenCode 会去默认位置找配置，看起来像"配置全丢了"。
要么把变量写进系统环境变量，要么把文件放回 `~/.config/opencode`。
:::

## 配置文件结构

本机 `E:\opencode\data\config\opencode\` 下有这些文件：

| 文件 | 作用 |
| --- | --- |
| `opencode.json` | **主配置**：提供商、模型、插件、websearch |
| `cli.json` | TUI 外观：主题、thinking 显示、侧边栏 |
| `service.json` | 服务密码（敏感） |
| `skills/` | 技能目录，见 [Skills 清单](/apps/opencode/skills) |

### opencode.json 的结构

本机这份是"接自己的中转站"的写法，关键结构如下（**值已脱敏**）：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // 默认模型与轻量模型，格式是 <提供商ID>/<模型ID>
  "model": "relay/deepseek-v4.1-flash",
  "small_model": "relay/deepseek-v4-flash",

  "providers": {
    "relay": {
      "name": "中转站",
      // 用 openai 兼容协议接入
      "package": "@opencode/ai/providers/openai-compatible",
      "settings": {
        // 这两个值是文件引用，不是明文
        "baseURL": "{file:E:/opencode/data/secrets/relay.url}",
        "apiKey": "{file:E:/opencode/data/secrets/relay.key}"
      },
      "compatibility": {
        // 中转站把推理内容放在 reasoning_content 字段
        "reasoningField": "reasoning_content"
      },
      "models": {
        "deepseek-v4.1-flash": {
          "modelID": "deepseek-v4.1-flash",
          "name": "DeepSeek V4.1 Flash",
          "limit": { "context": 1048576, "output": 131072 },
          "capabilities": {
            "reasoning": { "supported": true, "effort": ["low", "high", "max"] },
            "input": ["text", "image"]
          },
          "body": { "reasoning_effort": "high" }
        }
      }
    }
  },

  "plugins": [
    {
      "package": "E:/opencode/plugins/win-notify",
      "options": { "mode": "popup", "seconds": 8 }
    },
    {
      "package": "E:/opencode/plugins/searxng",
      "options": { "url": "https://search.example.com", "language": "auto" }
    }
  ],

  "websearch": { "provider": "searxng" }
}
```

几个值得记的点：

| 写法 | 含义 |
| --- | --- |
| `{file:路径}` | 从文件读值，避免把密钥写进 JSON |
| `package` | 提供商协议实现，`openai-compatible` / `anthropic-compatible` |
| `compatibility.reasoningField` | 中转站把思考过程放在哪个字段 |
| `disabled: true` | 该模型不在列表里显示 |
| `plugins[].package` | 本地路径或 npm 包名 |

::: danger 密钥不能进仓库
`service.json` 里有明文密码，`secrets/` 里有 API Key 和 baseURL。
本页所有真实值都换成了占位符。原因和处理方式见 [密钥与脱敏](/migrate/secrets)。
:::

### cli.json

控制界面外观，很小：

```json
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "theme": { "name": "opencode" },
  "session": { "thinking": "show", "scrollbar": true, "sidebar": "auto" },
  "animations": true
}
```

### 自定义提供商

想接别家的模型，在 `providers` 里加一段。以 OpenAI 兼容接口为例：

```jsonc
{
  "providers": {
    "my-provider": {
      "name": "我的服务",
      "package": "@opencode/ai/providers/openai-compatible",
      "settings": {
        "baseURL": "https://api.example.com/v1",
        "apiKey": "{file:~/.secrets/my-provider.key}"
      },
      "models": {
        "some-model": {
          "modelID": "some-model",
          "name": "显示用名字",
          "limit": { "context": 128000, "output": 8192 }
        }
      }
    }
  }
}
```

改完重启 `opencode` 生效。

## 插件

本机装了两个本地插件，都在 `E:\opencode\plugins\`：

| 插件 | 作用 |
| --- | --- |
| `win-notify` | 任务完成时弹 Windows 通知 |
| `searxng` | 用自建 SearXNG 做联网搜索 |

插件目录也要一起备份，否则配置里引用的路径在新机器上不存在。

## 备份与还原

**要拷的**：

```powershell
# 整个配置目录（含 skills）
Copy-Item "E:\opencode\data\config\opencode" "备份目录\opencode-config" -Recurse

# 插件
Copy-Item "E:\opencode\plugins" "备份目录\opencode-plugins" -Recurse

# 密钥（单独处理，别混进同一个备份包）
Copy-Item "E:\opencode\data\secrets" "备份目录\opencode-secrets" -Recurse
```

**不用拷的**：`share/`（会话历史，很大）、`cache/`、`state/`。

**还原**：

1. 装 OpenCode
2. 把配置目录放回原位
3. **设置四个 XDG 环境变量**（关键）
4. 把密钥放回 `secrets/`，确认文件名与 `opencode.json` 里 `{file:...}` 引用的名字一致
5. 插件目录放回 `E:\opencode\plugins`
6. `opencode --version` 确认能跑

```powershell
# 设置环境变量（用户级，永久）
[Environment]::SetEnvironmentVariable('XDG_CONFIG_HOME', 'E:\opencode\data\config', 'User')
[Environment]::SetEnvironmentVariable('XDG_DATA_HOME', 'E:\opencode\data\share', 'User')
[Environment]::SetEnvironmentVariable('XDG_CACHE_HOME', 'E:\opencode\data\cache', 'User')
[Environment]::SetEnvironmentVariable('XDG_STATE_HOME', 'E:\opencode\data\state', 'User')
```

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 启动后配置全空 | XDG 变量没设 | 设变量或把配置放回默认位置 |
| 模型列表为空 | 提供商配置或密钥路径错 | 检查 `{file:...}` 指向的文件是否存在 |
| 两个版本打架 | npm 旧版和安装包版并存 | 卸掉 npm 那份：`npm uninstall -g opencode-ai` |
| 中文乱码 | 终端编码 | `chcp 65001` 或用 Windows Terminal |
| 插件加载失败 | 引用的本地路径不存在 | 检查 `plugins[].package` 路径 |

## 官方链接

- 官网：<https://opencode.ai/>
- 文档：<https://opencode.ai/docs/>
- 配置说明：<https://opencode.ai/docs/config/>
- Skills 说明：<https://opencode.ai/docs/skills/>
- 配置 schema：<https://opencode.ai/config.json>
- GitHub：<https://github.com/sst/opencode>
