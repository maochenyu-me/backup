<script setup lang="ts">
import { useData } from 'vitepress'
import { homeLink } from '../home-links.mjs'
const { site } = useData()
const link = (path: string) => homeLink(path, site.value.base, site.value.cleanUrls)
</script>

<template>
    <div class="home-snapshot">
      <div class="home-section__head">
        <h2 class="home-section__title">这台机器上装了什么</h2>
        <a class="home-section__more" :href="link('/guide/snapshot')">完整版本表</a>
      </div>
      <div class="home-table-scroll">
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>本机版本</th>
            <th>装法</th>
            <th>配置文件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a :href="link('/env/nodejs')">Node.js</a></td>
            <td><code>24.21.0</code></td>
            <td><code>winget</code></td>
            <td><code>~/.npmrc</code></td>
          </tr>
          <tr>
            <td><a :href="link('/env/pnpm')">pnpm</a></td>
            <td><code>12.8.1</code></td>
            <td><code>npm -g</code></td>
            <td><code>pnpm config</code></td>
          </tr>
          <tr>
            <td><a :href="link('/env/git')">Git</a></td>
            <td><code>2.56.0</code></td>
            <td><code>winget</code></td>
            <td><code>~/.gitconfig</code></td>
          </tr>
          <tr>
            <td><a :href="link('/env/hugo')">Hugo</a></td>
            <td><code>0.166.0 ext</code></td>
            <td><code>winget</code></td>
            <td>—</td>
          </tr>
          <tr>
            <td><a :href="link('/env/hexo')">Hexo</a></td>
            <td><code>4.3.2</code></td>
            <td><code>npm -g</code></td>
            <td><code>_config.yml</code></td>
          </tr>
          <tr>
            <td><a :href="link('/apps/opencode/')">OpenCode</a></td>
            <td><code>2.2.5</code></td>
            <td>安装包</td>
            <td><code>opencode.json</code></td>
          </tr>
          <tr>
            <td><a :href="link('/apps/workbuddy/')">WorkBuddy</a></td>
            <td><code>5.9.2</code></td>
            <td><code>winget</code></td>
            <td><code>~/.workbuddy</code></td>
          </tr>
          <tr>
            <td><a :href="link('/apps/flclash')">FlClash</a></td>
            <td><code>0.8.99</code></td>
            <td><code>winget</code></td>
            <td><code>%APPDATA%\com.follow</code></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

</template>
