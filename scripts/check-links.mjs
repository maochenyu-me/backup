#!/usr/bin/env node
// Validate built internal links, including project bases and .html mode.
import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export function linkCandidates(href, base = '/') {
  if (href.startsWith('//')) return []
  const clean = decodeURIComponent(href.split('#')[0].split('?')[0])
  if (!clean.startsWith(base)) throw new Error(`Link outside base ${base}: ${href}`)
  const path = clean.slice(base.length).replace(/\/$/, '')
  if (!path) return ['index.html']
  if (path.endsWith('.html')) return [path]
  return [`${path}.html`, `${path}/index.html`]
}
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (entry.name.endsWith('.html')) yield path
  }
}
export async function checkLinks(dist, base = '/') {
  if (!existsSync(dist)) throw new Error('dist 不存在，先跑 pnpm build')
  const links = new Map()
  let pages = 0
  for await (const file of walk(dist)) {
    pages++
    const html = await readFile(file, 'utf8')
    for (const m of html.matchAll(/href="(\/[^"#]*)?(#[^"]*)?"/g)) {
      const path = m[1]
      if (!path || path.startsWith('//') || /\.(svg|png|jpe?g|css|js|ico|json|xml|txt|webmanifest)(?:\?|$)/i.test(path) || path.startsWith(`${base}assets/`)) continue
      if (!links.has(path)) links.set(path, file.slice(dist.length + 1))
    }
  }
  const issues = []
  for (const [link, source] of links) {
    try {
      if (!linkCandidates(link, base).some(path => existsSync(join(dist, path)))) issues.push(`${link} ← ${source}`)
    } catch (error) { issues.push(`${error.message} ← ${source}`) }
  }
  return { pages, links: links.size, issues }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback
  const result = await checkLinks(resolve(option('--dist', join(ROOT, 'docs/.vitepress/dist'))), option('--base', '/'))
  for (const issue of result.issues) console.error(`✗ ${issue}`)
  console.log(`扫描 ${result.pages} 个页面，${result.links} 个唯一内链，${result.issues.length} 个失效`)
  process.exitCode = result.issues.length ? 1 : 0
}
