<script setup lang="ts">
import site from '../site.config.mts'
</script>

<template>
  <div class="vp-doc home-wrap">
    <div class="masthead">
      <div>
        <h1 class="masthead__name">{{ site.title }}</h1>
        <p class="masthead__lede">{{ site.tagline }}</p>
        <p class="masthead__note">
          这里记着每一样东西的版本、装法、配置在哪、怎么搬回来。新机器到手，照着顺序走一遍；老机器退役前，
          照着清单把该拷的拷走。
        </p>
        <ul class="masthead__links">
          <li><a href="./guide/order">从第一步开始</a></li>
          <li><a href="./guide/snapshot">看全部版本号</a></li>
          <li><a href="./migrate/backup">只要备份清单</a></li>
        </ul>
        <p class="masthead__meta">最近核对 {{ site.lastChecked }}</p>
      </div>

      <div>
        <p class="panel__title">换机顺序</p>
        <ul class="checklist">
          <li v-for="(step, i) in site.steps" :key="step.text">
            <a :href="'.' + step.link.replace(/\/$/, '')">
              <span class="checklist__idx">{{ String(i).padStart(2, '0') }}</span>
              {{ step.text }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="home-section">
      <div class="home-section__head">
        <h2 class="home-section__title">这台机器上装了什么</h2>
        <a class="home-section__more" href="./guide/snapshot">完整版本表</a>
      </div>
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
            <td><a href="./env/nodejs">Node.js</a></td>
            <td><code>24.21.0</code></td>
            <td><code>winget</code></td>
            <td><code>~/.npmrc</code></td>
          </tr>
          <tr>
            <td><a href="./env/pnpm">pnpm</a></td>
            <td><code>12.8.1</code></td>
            <td><code>npm -g</code></td>
            <td><code>pnpm config</code></td>
          </tr>
          <tr>
            <td><a href="./env/git">Git</a></td>
            <td><code>2.56.0</code></td>
            <td><code>winget</code></td>
            <td><code>~/.gitconfig</code></td>
          </tr>
          <tr>
            <td><a href="./env/hugo">Hugo</a></td>
            <td><code>0.166.0 ext</code></td>
            <td><code>winget</code></td>
            <td>—</td>
          </tr>
          <tr>
            <td><a href="./env/hexo">Hexo</a></td>
            <td><code>4.3.2</code></td>
            <td><code>npm -g</code></td>
            <td><code>_config.yml</code></td>
          </tr>
          <tr>
            <td><a href="./apps/opencode/">OpenCode</a></td>
            <td><code>2.2.5</code></td>
            <td>安装包</td>
            <td><code>opencode.json</code></td>
          </tr>
          <tr>
            <td><a href="./apps/workbuddy/">WorkBuddy</a></td>
            <td><code>5.9.2</code></td>
            <td><code>winget</code></td>
            <td><code>~/.workbuddy</code></td>
          </tr>
          <tr>
            <td><a href="./apps/flclash">FlClash</a></td>
            <td><code>0.8.99</code></td>
            <td><code>winget</code></td>
            <td><code>%APPDATA%\com.follow</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="home-foot">
      <p>
        站点只写「怎么装、装完怎么验、配置在哪个目录」。
        真实的密钥、订阅链接、API Key 一律不出现在这里 —— 原因见
        <a href="./migrate/secrets">密钥与脱敏</a>。
      </p>
      <p>命令与下载链接均在页面标注的核对日期实查过；过期时以官网为准。</p>
    </div>
  </div>
</template>
