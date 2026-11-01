<script setup lang="ts">
import { useData } from 'vitepress'
import handbook from '../../site.config.mts'
import { homeLink } from '../home-links.mjs'
const { site } = useData()
const link = (path: string) => homeLink(path, site.value.base, site.value.cleanUrls)
</script>

<template>
  <section class="home-task-section" aria-labelledby="home-steps-title">
    <div class="home-section__head">
      <h2 id="home-steps-title">按顺序，准备好新电脑</h2>
      <span>最近核对 {{ handbook.lastChecked }}</span>
    </div>
    <ol class="home-steps">
      <li v-for="(step, i) in handbook.steps" :key="step.link">
        <a :href="link(step.link)">
          <span class="home-step-index">{{ String(i).padStart(2, '0') }}</span>
          <span>{{ step.text }}</span>
          <span aria-hidden="true" class="home-step-arrow">↗</span>
        </a>
      </li>
    </ol>
  </section>
</template>
