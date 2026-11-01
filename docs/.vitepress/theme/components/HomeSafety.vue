<script setup lang="ts">
import { useData } from 'vitepress'
import { homeLink } from '../home-links.mjs'
const { site } = useData()
const link = (path: string) => homeLink(path, site.value.base, site.value.cleanUrls)
</script>

<template>
    <div class="home-safety">
      <p><strong>目前仅供自用。</strong> 本迁移指南记录个人电脑的实际环境与换机流程，不是通用安装教程；版本、路径和配置以个人环境为准，不保证适用于其他机器。</p>
      <p>
        站点只写「怎么装、装完怎么验、配置在哪个目录」。
        真实的密钥、订阅链接、API Key 一律不出现在这里 —— 原因见
        <a :href="link('/migrate/secrets')">密钥与脱敏</a>。
      </p>
      <p>命令与下载链接均在页面标注的核对日期实查过；过期时以官网为准。</p>
    </div>
</template>
