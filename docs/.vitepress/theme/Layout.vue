<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Home from './Home.vue'

const { frontmatter } = useData()
const { Layout: DefaultLayout } = DefaultTheme
</script>

<template>
  <DefaultLayout>
    <template #home-hero-before>
      <Home v-if="frontmatter.layout === 'home'" />
    </template>
  </DefaultLayout>
</template>
