# 密钥与脱敏

这个站点会部署到公网。所以真实的密钥、订阅链接、API Key 一律不写进来。

<div class="filmhead">
  <div class="filmhead__title">脱敏规则 <span class="badge">强制</span></div>
  <p class="filmhead__lede">写结构，不写值。写路径，不写内容。</p>
  <dl class="spec">
    <dt>暴露风险</dt><dd>公网可读 + 搜索引擎会抓</dd>
    <dt>处理方式</dt><dd>全部占位符</dd>
    <dt>最近核对</dt><dd>2026-10-31</dd>
  </dl>
</div>

## 这个站上不出现的东西

| 类型 | 例子 | 站内怎么写 |
| --- | --- | --- |
| API Key | `sk-xxxx`、中转站 key | `{file:.../relay.key}` 或 `xxxxxxxx` |
| 服务密码 | `service.json` 的 password | `"password": "xxxxxxxx"` |
| 订阅链接 | FlClash 的订阅 URL | `https://sub.example.com/xxxx` |
| 代理地址 | 中转站 baseURL | `https://api.example.com/v1` |
| 邮箱 | git user.email | 保留，但你自己决定要不要写 |
| 私钥 | `id_ed25519` | 只写路径，不写内容 |

## 为什么要脱敏

不是怕"有人专门来偷"。原因更朴素：

1. **部署平台是公开的。** GH Pages / Vercel / Cloudflare Pages 的项目页默认公开可访问。
2. **搜索引擎会索引。** 一旦被抓走，删掉也还有缓存。
3. **Git 历史删不干净。** 就算后来改了，`git log` 里还在。
4. **密钥会轮换。** 写进文档的旧值过期后只会误导你。

## 本机的真实密钥在哪

写在这里方便你以后找，但**具体值不在站内**：

| 内容 | 实际路径 | 备注 |
| --- | --- | --- |
| OpenCode 中转站 1 | `E:\opencode\data\secrets\relay.key` / `relay.url` | 文件名固定 |
| OpenCode 中转站 2 | `E:\opencode\data\secrets\relay2.key` / `relay2.url` | 文件名固定 |
| OpenCode 服务密码 | `E:\opencode\data\config\opencode\service.json` | 明文，注意 |
| FlClash 订阅 | `%APPDATA%\com.follow\clash\profiles\*.yaml` | 每个订阅一个文件 |
| Git 凭据 | Windows 凭据管理器 | 不落盘，重新登录 |

::: danger service.json 是明文密码
`E:\opencode\data\config\opencode\service.json` 里是明文的 `password` 字段。
备份时**单独处理**，不要和其他配置文件混在一个包里随手传。
:::

## 站内怎么写配置

### 反例

```json
{
  "settings": {
    "baseURL": "https://relay.真实域名.com/v1",
    "apiKey": "sk-真实密钥写在这里"
  }
}
```

### 正例

```jsonc
{
  "settings": {
    "baseURL": "{file:E:/opencode/data/secrets/relay.url}",
    "apiKey": "{file:E:/opencode/data/secrets/relay.key}"
  }
}
```

**区别**：正例记录的是"值存在哪个文件里"，而不是"值是什么"。
迁移时你只需要知道去哪找，不需要把值写进文档。

## 三种安全的写法

| 写法 | 适合 | 例子 |
| --- | --- | --- |
| 文件引用 | 配置支持 `{file:...}` 时 | `{file:~/.secrets/key}` |
| 环境变量 | 支持 `${VAR}` 时 | `apiKey: "${MY_API_KEY}"` |
| 占位符 | 只是展示结构 | `"apiKey": "xxxxxxxx"` |

## 提交前自查

```powershell
# 在这个仓库里搜可疑字符串
git grep -nE "sk-[A-Za-z0-9]{16,}|api[_-]?key\s*[:=]\s*['\"][^'\"]{12,}" -- . ':!*.md'
```

更省事的做法是装个 pre-commit 钩子，或者提交前用编辑器全局搜一遍这些词：

```
sk-
token
password
secret
subscribe
sub.example
```

## 如果已经泄露了

按这个顺序处理，别慌：

1. **立刻吊销**——去提供商后台把这个 key 停用，这比什么都重要
2. **换新的**——生成新 key，更新到本地配置
3. **清历史**——如果进了 git，用 `git filter-repo` 重写历史（复杂但必要）
4. **检查用量**——看有没有异常调用
5. **别只删文件**——`git rm` 不会删历史里的记录

::: warning 删文件 ≠ 删历史
`git rm secrets.json && git commit` 之后，`git log -p` 里仍然能看到内容。
必须重写历史，并且强制推送。
:::

## 相关

- 备份时哪些是敏感文件：[备份清单](/migrate/backup)
- 恢复时怎么放回去：[恢复演练](/migrate/restore)
