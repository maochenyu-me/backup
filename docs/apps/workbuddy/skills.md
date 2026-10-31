---
title: WorkBuddy Skills
---

# WorkBuddy Skills

<div class="filmhead">
  <div class="filmhead__title">WorkBuddy Skills <span class="badge">47 个</span></div>
  <p class="filmhead__lede">WorkBuddy 本地可调用的技能目录。迁移时是重点备份对象。</p>
  <dl class="spec">
    <dt>目录</dt><dd>~/.workbuddy/skills</dd>
    <dt>格式</dt><dd>&lt;name&gt;/SKILL.md，frontmatter 同上</dd>
    <dt>总数</dt><dd>47 个</dd>
    <dt>生成方式</dt><dd>pnpm skills（扫描 SKILL.md 自动生成）</dd>
  </dl>
</div>

## 和 OpenCode 的区别

WorkBuddy 的 skills 目录结构跟 OpenCode 一样（一个文件夹一个 `SKILL.md`），
但两者的**加载机制不同**：

- OpenCode 有明确的 `skill` 工具，模型显式调用
- WorkBuddy 的技能是它自己的 agent 运行时按需读取，行为取决于版本

所以同一个 skill 文件夹在两边都能放，但效果不一定一致。

## 迁移时怎么处理

skills 目录是纯文件，直接拷就行：

```powershell
# 备份
Compress-Archive -Path "$env:USERPROFILE\.workbuddy\skills" -DestinationPath "备份目录\workbuddy-skills.zip"
```

::: warning 数量会变
这些 skill 里有相当一部分是应用内市场装的，重装 WorkBuddy 后可能自动回来一部分。
本页清单反映的是**生成那一刻**的目录状态，重装后记得重跑 `pnpm skills` 对比。



## 全局 skills

路径：`C:\Users\Administrator\.workbuddy\skills`　·　47 个　·　另有 1 个与前面目录重名，已被遮蔽

| Skill | 作用 | 备注 |
| --- | --- | --- |
| `agent-browser-core` | 基于 agent-browser CLI 的 AI 友好型网页自动化 | — |
| `anti-fraud` | 防骗大师.Skill:你身边的生活类防骗专家。 当用户贴来可疑的短信、聊天记录、邮件、链接、App 或电话转述，想知道"这是不是骗局"时立即出动，一眼看穿套路；当对话中冒出转账… | 来自技能市场 |
| `browser` | Puppeteer 无头浏览器，渲染 JS 页面并提取纯文本 | — |
| `browser-skill` | BrowserSkill 是腾讯开源的一个智能浏览器自动化工具，让 WorkBuddy 能够像人一样操作网页——自动填表、点击、翻页、截图，完成任何需要浏览器的复杂任务。 | — |
| `browser-use` | 浏览器自动化（导航、点击、截图、数据提取、多会话、云浏览器） | — |
| `canvas-design` | 基于设计哲学创作精美视觉艺术（PNG/PDF） | — |
| `clean-web-fetch` | 获取干净、可读的现代网页正文内容，支持微信公众号文章抓取与尾部噪音清洗，减少无用信息与 token 消耗；适合新闻、博客、公告及许多普通 fetch 不稳定、存在反爬或动态渲染… | 来自技能市场 |
| `de-ai-writing` | 基于 GPT-6 官方最佳实践，专门用于清除文本中的“AI 味/废话套话”，以及对 Agent 系统提示词进行精简调优（主动推进、减少不必要打断、精简过度测试）。 | — |
| `deepseek-websearch` | 一键调用 Deepseek AI 联网搜索，快速获取实时信息与结构化结果 | — |
| `dev-expert` | 编程专家.Skill P8级编程助手,25年实战经验技能Skill，全栈：Java/Php网站/软件项目、API设计、Bug诊断、代码生成、代码审查、重构、测试用例、性能基准、… | 来自技能市场 |
| `diagnose` | 系统化调试：重现 → 假设 → 验证 → 修复 → 回归测试 | — |
| `frontend-design` | 生成极具视觉冲击力的生产级前端界面：独特排版、统一色彩主题、编排动效与非对称布局，直接产出可运行代码，告别千篇一律的 AI 味设计。 | — |
| `frontend-dev` | 前端开发与 AI 媒体生成 | — |
| `github` | 管理 GitHub Issues、PR 和 CI | — |
| `github-skill-forge` | 一个"制造技能的技能"。这个工具自动化了将任意 GitHub 仓库转换为标准化 Trae 技能的全过程，是扩展 AI Agent 能力的核心工具。 | — |
| `gongwen-format` | 把 Word 或 Markdown 文档一键排版为符合党政机关公文国标的 docx：字体字号行距标题合规、表格美化、图片防裁剪、大纲级别导航层级、Markdown H2/H3/… | — |
| `grill-me` | 深度追问式方案审查：逐层拆解设计决策，直到达成共识 | — |
| `humanizer` | 去除文本中的 AI 写作痕迹 | — |
| `ima-skill` | 统一的 IMA OpenAPI 技能，支持笔记管理和知识库操作。 | 来自技能市场 |
| `jq-skill` | （缺少 SKILL.md） | invalid |
| `markitdown-skill` | 文档转 Markdown(PDF/Word/PPT/图片OCR/音频转写/网页) | — |
| `minimax-docx` | Word 文档生成与编辑 | — |
| `minimax-xlsx` | Excel 文件创建与分析 | — |
| `multi-search-engine` | Multi search engine integration with 16 engines (7 CN + 9 Global)。 | 来自技能市场 |
| `pdf` | PDF 文档处理工具，支持文本与表格提取、PDF 创建、合并拆分、表单填写及批量分析。 | — |
| `pdf-image-text-extractor` | 零依赖提取PDF与图片文字，扫描件交AI视觉识别，支持表格结构化与批量处理 | — |
| `pdfkit-py` | PDF全能工具箱，覆盖阅读分析、自然语言编辑、格式转换、表单处理、加密签名、OCR、IR等全场景 | — |
| `pink-crystal-workbuddy-skin` | WorkBuddy 桌面端主题定制服务。 | — |
| `ppt-generator` | PPT 生成套件，覆盖 AI 配图演示、标准 PPTX（11种版式）、解决方案框架 PPT 与网页演示 PPT | — |
| `pptx` | 创建、读取、编辑 .pptx/.potx 演示文稿：幻灯片、版式、备注与模板。 | — |
| `pptx-generator` | PowerPoint 演示文稿生成 | — |
| `prompt-engineering-expert` | Advanced expert in prompt engineering, custom instructions design, and prompt… | — |
| `qq-email` | QQ邮箱收发邮件（IMAP/SMTP），支持发信、收信、查看正文 | — |
| `resume` | 粉笔报考简历完善助手，基于招考大数据，智能优化经历描述，提升人岗匹配度，让你的报考优势一目了然。 | — |
| `resume-optimizer` | 双路径简历助手：没有简历时通过分轮问答采集信息从零撰写；已有简历时（粘贴或上传 PDF/DOCX/MD）解析诊断、STAR 量化改写、匹配目标岗位 JD 定制，并用脚本做质量检… | — |
| `stealth-browser` | 四层反检测浏览器自动化，支持隐身登录与验证码绕过 | — |
| `superpowers` | Agent 软件工程方法论框架：开始写码前先头脑风暴出规格，写可执行实施计划，强制红绿 TDD，子代理驱动开发，系统化调试与代码评审，收尾合并。 | — |
| `tencent-docs` | 腾讯文档（docs.qq.com）-在线云文档平台，是创建、编辑、管理文档的首选 skill。涉及"新建/创建/编辑/读取/查看/搜索文档"、"保存文件"、"云文档"、"腾讯文… | 来自技能市场 |
| `tencentcloud-ocr` | 调用腾讯云OCR通用文字识别（高精度版）接口，对图片中的文字进行高精度识别。 | — |
| `totorosir-workbuddy-checkin` | WorkBuddy签到助手（WorkBuddy「Buddy 加油站」每日签到自动化 Skill，接口直签，跨平台 Windows/macOS/Linux）。 | — |
| `totorosir-workbuddy-score` | WorkBuddy积分助手：读取本机登录态，接口直查 Buddy 加油站数据生成每日积分播报；只读展示成长计划与派猫猫旅行状态，支持一键幂等自动签到与旅行全自动闭环（先领后派… | — |
| `upgrade-residue-cleanup` | 依赖大版本升级后，排查「报错栈里出现旧版本号」的诡异错误（典型：__vite_ssr_import_0__. | — |
| `web-access` | CDP 直连本地 Chrome，智能调度联网工具，支持登录态、并行批量操作 | — |
| `web-design-engineer` | 构建或重新设计精致的浏览器端视觉作品，包括网页、仪表盘、交互原型、幻灯片、动画、UI 模型与数据可视化；适用于视觉前端创作、设计系统探索、设计评审及明确要求的浏览器验收。 | — |
| `web-scraper` | 多策略五阶段网页抓取管道（HTTP/解析/渲染/清洗/LLM提取） | — |
| `word-docx` | 创建、检查、编辑 Word 和 . | — |
| `xlsx` | 创建、编辑、分析 Excel 表格：公式、图表、透视表与格式设置。 | — |

## 怎么加新 skill

在对应目录下建一个文件夹，里面放 `SKILL.md`，开头必须有 frontmatter：

```yaml
---
name: my-skill          # 必填，小写字母数字单横线，必须与目录名一致
description: 一句话说清它做什么、什么时候该用   # 必填，1–1024 字符
license: MIT            # 可选
---
```

规矩：

- `name` 必须和目录名完全一致，否则加载不上
- `name` 只能是小写字母、数字、单横线，不能以横线开头结尾，不能有连续横线
- `description` 决定模型会不会选中它——写清"什么时候用"，比写"它能干什么"更重要

加完后重跑 `pnpm skills` 刷新本页。

## 相关文档

- OpenCode 技能文档：<https://opencode.ai/docs/skills/>
