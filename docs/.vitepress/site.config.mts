/**
 * ─────────────────────────────────────────────────────────────
 *  站点配置 — 改这里，别去动 config.mts
 * ─────────────────────────────────────────────────────────────
 *  站名、副标题、描述、仓库地址、最近核对日期，全部集中在本文件。
 *  改完重启 dev server（或重新 build）即可生效。
 */

export default {
  /** 浏览器标签与左上角站点名 */
  title: '换机手册',

  /** 站点名后缀，拼在 <title> 后面 */
  titleTemplate: ':title — 换机手册',

  /** 一句话定位，出现在首页与 meta description */
  tagline: '换一台电脑，半天回到工作状态。',
  description:
    '个人使用的换机交接单：记录基础环境与常用软件的版本、安装方式、配置路径与备份还原方法，供 Windows / macOS / Linux 新机器从零搭建。',

  /** 界面语言 */
  lang: 'zh-CN',

  /**
   * 全站「最近核对日期」。页面上所有命令与链接都在这一天复核过。
   * 更新任何一页的内容后，顺手把这里改成当天。
   */
  lastChecked: '2026-11-02',

  /** 仓库地址，留空则不显示右上角 GitHub 入口 */
  repo: '',

  /** 部署到 GitHub Pages 项目页时设为 '/仓库名/'，其它平台留 '/' */
  base: '/',

  /** 站点正式域名，用于生成 sitemap；留空则 sitemap 用占位域名 */
  hostname: 'https://setup-handbook.example.com',

  /** 首页列出的换机顺序，与 /guide/order 保持同步 */
  steps: [
    { text: '联网与代理', link: '/apps/flclash' },
    { text: '包管理器', link: '/env/npm' },
    { text: 'Git 与凭据', link: '/env/git' },
    { text: 'Node 系', link: '/env/nodejs' },
    { text: 'Hugo / Hexo', link: '/env/hugo' },
    { text: 'AI 工具', link: '/apps/opencode/' },
    { text: '桌面软件', link: '/apps/chrome' },
    { text: '配置恢复', link: '/migrate/restore' },
  ],

  /** 页脚 */
  footer: {
    message: '目前仅供自用 · 记录个人环境，非通用安装教程',
    copyright: '命令与链接均标注核对日期，过期请以官网为准',
  },
}
