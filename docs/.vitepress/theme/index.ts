import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './tokens.css'
import './components.css'
import './home.css'
import './home-extra.css'

import 'virtual:group-icons.css'

import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme
