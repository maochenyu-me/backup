import { defineTeekConfig } from 'vitepress-theme-teek/config'

// Only document enhancements: URLs, navigation and content stay owned by this site.
export default defineTeekConfig({
  teekTheme: true,
  teekHome: false,
  vpHome: true,
  pageStyle: 'default',
  anchorScroll: false,
  windowTransition: false,
  viewTransition: { enabled: false },
  themeEnhance: { enabled: false },
  codeBlock: { enabled: false },
  articleAnalyze: { showInfo: false, imageViewer: { enabled: false } },
  articleUpdate: { enabled: false },
  articleShare: { enabled: false },
  comment: false,
  notice: { enabled: false },
  siteAnalytics: [],
  vitePlugins: {
    sidebar: false,
    permalink: false,
    mdH1: false,
    docAnalysis: false,
    autoFrontmatter: false,
    fileContentLoaderIgnore: ['**/superpowers/**'],
  },
})
