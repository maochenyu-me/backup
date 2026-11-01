# Teek 迁移实施与验证记录

已实施 Teek 1.6.2 文档风，保留 VitePress 1.6.4、任务首页、人工导航、local search、原生代码分组和 group-icons。现有 DSH / DSH-TUI 内容与核对日期未因主题更新改写；未提交、推送或部署。

## 自动验证

- 默认 build：成功，7.83s，无此前的 iconfont 未解析警告。
- Node tests：21/21。
- 根路径：27 页，26 个唯一内链，0 失效。
- `/theme-check/`：27 页，26 个唯一内链，0 失效。
- `/theme-check/` + cleanUrls=false：27 页，28 个唯一内链，0 失效。
- 三种输出均通过主题产物检查：必要页面、关键页单 H1、内部设计/计划排除、未解析图标字体检测。
- `git diff --check` 通过。
- 独立审阅及补充审阅：无未处理的重要代码问题；按审阅补充 H1 回归测试。

## 浏览器证据

- 正确加载本站 CSS 后验证：首页 8 步、单 H1、单页脚；1187px 双栏、390px 单栏。
- 390px 首页和 Node 页面 scrollWidth=390，正文16px；未以 body overflow hidden 掩盖错误。
- 搜索 DSH 返回 DSH 和 DSH-TUI 教程；代码组切到 macOS 成功。
- 通过导航扩展菜单点击标准明暗开关，深色切浅色成功。
- 子路径预览 CSS 从 `/theme-check/assets/` 加载；HTML 模式首页三个入口均带正确 `.html`；资源性能记录无失败请求。

## 验收限制（不能据自动测试推断通过）

- 当前模型不支持读图，截图已取得但无法做视觉审阅。
- 复制按钮调用遇浏览器 `Document is not focused`；未核对完整剪贴板命令，不声称复制验收通过。
- 宿主窗口最终为1187 CSS px，未达到计划中的1440；未逐页穷尽390px两种模式、锚点和键盘焦点检查。
- 未验证 file:// 离线行为。扩展注入的 analysis.chatglm.cn 请求错误与站点统计无关。

## 实施中核实的偏差

- 样式使用 `vitepress-theme-teek/theme-chalk/index.css`，避免根 index.css 夹带未使用的社交图标字体和错误相对字体 URL。
- 通过 `teek-footer-info` 插槽禁用重复主题页脚，保留本站页脚。
- VitePress preview 不采用 CLI 的 --outDir；增加可选 DOCS_OUT_DIR 保证构建/预览同目录。正确子路径预览示例：

```powershell
$env:DOCS_BASE='/theme-check/'
$env:DOCS_OUT_DIR="$PWD/docs/.vitepress/dist-base-check"
pnpm build
pnpm preview --port 4177
```

设置 cleanUrls=false 时再设置 `$env:DOCS_CLEAN_URLS='false'`。默认预览使用 `pnpm build; pnpm preview`，先清除自定义 DOCS_BASE、DOCS_OUT_DIR、DOCS_CLEAN_URLS。

所有本次预览服务已停止；原有 browser-skill daemon 保留。
