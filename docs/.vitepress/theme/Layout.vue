<script setup lang="ts">
import Teek from 'vitepress-theme-teek'
import { useData } from 'vitepress'
import Home from './Home.vue'

const { frontmatter } = useData()
const { Layout: TeekLayout } = Teek
</script>

<template>
  <TeekLayout>
    <!-- Keep the site's existing footer; don't render a second theme footer. -->
    <template #teek-footer-info><span /></template>
    <template #home-hero-after>
      <Home v-if="frontmatter.layout === 'home'" />
    </template>
  </TeekLayout>
</template>
