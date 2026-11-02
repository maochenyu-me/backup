import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import site from './site.config.mts'
import teekConfig from './teek.config.mts'

export default defineConfig(() => {
  const base = process.env.DOCS_BASE || site.base
  // 离线包（file:// 直接双击）需要带 .html 的链接，设 DOCS_CLEAN_URLS=false
  const cleanUrls = process.env.DOCS_CLEAN_URLS !== 'false'

  return {
    extends: teekConfig,
    ignoreDeadLinks: false,
    srcExclude: ['superpowers/**'],
    lang: site.lang,
    title: site.title,
    titleTemplate: site.titleTemplate,
    description: site.description,

    base,
    ...(process.env.DOCS_OUT_DIR ? { outDir: process.env.DOCS_OUT_DIR } : {}),
    cleanUrls,
    lastUpdated: true,
    appearance: true,
    transformPageData(page) {
      if (page.relativePath === 'index.md' && page.frontmatter.hero) {
        page.frontmatter.hero.name = site.title
        page.frontmatter.hero.text = site.tagline
      }
    },

    head: [
      ['meta', { name: 'theme-color', content: '#0E7C86' }],
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      // 这里必须手动拼 base，head 里的绝对路径不会被自动改写
      ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ],

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark-dimmed',
    },
  },

  vite: {
    plugins: [groupIconVitePlugin()],
  },

  sitemap: {
    hostname: process.env.DOCS_HOSTNAME || site.hostname,
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: site.title,

    outline: { level: [2, 3], label: '本页目录' },

    nav: [
      { text: '换机顺序', link: '/guide/order', activeMatch: '/guide/' },
      { text: '版本快照', link: '/guide/snapshot' },
      { text: '基础环境', link: '/env/nodejs', activeMatch: '/env/' },
      { text: '软件', link: '/apps/chrome', activeMatch: '/apps/' },
      { text: '迁移', link: '/migrate/backup', activeMatch: '/migrate/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '换机顺序', link: '/guide/order' },
            { text: '版本快照', link: '/guide/snapshot' },
            { text: '怎么用这份文档', link: '/guide/how-to-use' },
          ],
        },
      ],

      '/env/': [
        {
          text: '基础环境',
          items: [
            { text: '总览', link: '/env/' },
            { text: 'winget', link: '/env/winget' },
            { text: 'Node.js', link: '/env/nodejs' },
            { text: 'npm', link: '/env/npm' },
            { text: 'pnpm', link: '/env/pnpm' },
            { text: 'Git', link: '/env/git' },
            { text: 'Hugo', link: '/env/hugo' },
            { text: 'Hexo', link: '/env/hexo' },
          ],
        },
      ],

      '/apps/': [
        {
          text: '桌面软件',
          items: [
            { text: '总览', link: '/apps/' },
            { text: 'Chrome', link: '/apps/chrome' },
            { text: 'FlClash', link: '/apps/flclash' },
            { text: 'Steam', link: '/apps/steam' },
            { text: 'VS Code', link: '/apps/vscode' },
            { text: '顺带装的那些', link: '/apps/extras' },
          ],
        },
        {
          text: 'AI 工具',
          items: [
            { text: 'DSH 安装（桌面端 / CLI）', link: '/apps/dsh/' },
            { text: 'DSH 桌面端扩展', link: '/apps/dsh/extensions' },
            { text: 'DSH / TUI MCP 与配套', link: '/apps/dsh/mcp' },
            { text: 'DSH-TUI 安装', link: '/apps/dsh-tui/' },
            { text: 'DSH-TUI 扩展', link: '/apps/dsh-tui/extensions' },
            { text: 'OpenCode 安装与配置', link: '/apps/opencode/' },
            { text: 'OpenCode Skills', link: '/apps/opencode/skills' },
            { text: 'WorkBuddy 安装与配置', link: '/apps/workbuddy/' },
            { text: 'WorkBuddy Skills', link: '/apps/workbuddy/skills' },
          ],
        },
      ],

      '/migrate/': [
        {
          text: '迁移',
          items: [
            { text: '备份清单', link: '/migrate/backup' },
            { text: '密钥与脱敏', link: '/migrate/secrets' },
            { text: '恢复演练', link: '/migrate/restore' },
            { text: '部署本站', link: '/migrate/deploy' },
          ],
        },
      ],
    },

    socialLinks: site.repo ? [{ icon: 'github', link: site.repo }] : [],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清空',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '明暗',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    langMenuLabel: '语言',
    externalLinkIcon: true,

    footer: site.footer,
    },
  }
})
