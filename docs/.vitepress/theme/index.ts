import Teek from 'vitepress-theme-teek'
// Document styles only: index.css also bundles unused social iconfont URLs.
import 'vitepress-theme-teek/theme-chalk/index.css'
import type { Theme } from 'vitepress'

import './tokens.css'
import './components.css'
import './docs.css'
import './home.css'

import 'virtual:group-icons.css'

import Layout from './Layout.vue'

export default {
  extends: Teek,
  Layout,
} satisfies Theme
