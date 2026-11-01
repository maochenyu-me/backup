import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const required = ['index.html', 'guide/order.html', 'env/nodejs.html', 'apps/dsh/index.html', 'apps/dsh-tui/index.html', 'migrate/backup.html']
export async function inspectThemeArtifacts(dist, base = '/') {
  const issues = []
  for (const page of required) {
    if (!existsSync(join(dist, page))) issues.push(`Missing required page: ${page}`)
  }
  if (!existsSync(dist)) return issues
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name)
      if (entry.isDirectory()) { await walk(file); continue }
      if (!/\.(html|xml|js|json|css)$/.test(entry.name)) continue
      const path = relative(dist, file).replaceAll('\\', '/')
      const text = await readFile(file, 'utf8')
      if (path.startsWith('superpowers/') || /superpowers\/(specs|plans)/.test(text) || text.includes('换机手册：Teek 文档风主题迁移设计') || text.includes('Teek 文档风主题迁移 Implementation Plan')) {
        issues.push(`Internal planning content leaked: ${path}`)
      }
      if (['index.html', 'env/nodejs.html', 'apps/dsh/index.html', 'apps/dsh-tui/index.html'].includes(path) && [...text.matchAll(/<h1(?:\s|>)/gi)].length !== 1) issues.push(`Expected exactly one H1: ${path}`)
      if (path.endsWith('.css') && /url\(["']?iconfont\./.test(text)) issues.push(`Unresolved iconfont URL: ${path}`)
      if (path === 'index.html') {
        if (!text.includes('tk-layout')) issues.push('Missing Teek tk-layout shell')
        if (!/class="[^"]*\bVPHomeHero\b/.test(text)) issues.push('Missing native Hero')
        const steps = text.match(/<ol\b[^>]*class="[^"]*\bhome-steps\b[^>]*>([\s\S]*?)<\/ol>/)?.[1] || ''
        if ([...steps.matchAll(/<a\s/g)].length !== 8) issues.push('Expected eight homepage step links')
        if (/class="[^"]*\bmasthead\b/.test(text)) issues.push('Old masthead still rendered')
      }
    }
  }
  await walk(dist)
  return issues
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback
  const issues = await inspectThemeArtifacts(resolve(option('--dist', join(root, 'docs/.vitepress/dist'))), option('--base', '/'))
  console.log(issues.length ? issues.join('\n') : 'Theme artifacts valid: required pages present; internal documents excluded ✓')
  process.exitCode = issues.length ? 1 : 0
}
