import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectThemeArtifacts } from '../scripts/check-theme.mjs'

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'handbook-theme-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  for (const path of ['index.html', 'guide/order.html', 'env/nodejs.html', 'apps/dsh/index.html', 'apps/dsh-tui/index.html', 'migrate/backup.html']) {
    await mkdir(join(dir, path, '..'), { recursive: true })
    await writeFile(join(dir, path), '<main class="tk-layout"><h1>手册 Teek</h1></main>')
  }
  await writeFile(join(dir, 'index.html'), '<main class="tk-layout"><header class="VPHomeHero"><h1>手册</h1></header><ol class="home-steps">' + Array.from({ length: 8 }, (_, i) => `<li><a href="/step-${i}">步骤</a></li>`).join('') + '</ol></main>')
  return dir
}

test('accepts clean documentation artifacts', async t => {
  assert.deepEqual(await inspectThemeArtifacts(await fixture(t)), [])
})
for (const [name, mutate, issue] of [
  ['missing Hero', html => html.replace('VPHomeHero', 'old-header'), 'Hero'],
  ['missing step', html => html.replace(/<li><a[^>]*>步骤<\/a><\/li>/, ''), 'eight'],
  ['old masthead', html => html.replace('<main ', '<main class="masthead" '), 'masthead'],
]) {
  test(`rejects homepage with ${name}`, async t => {
    const dir = await fixture(t)
    const { readFile } = await import('node:fs/promises')
    const file = join(dir, 'index.html')
    await writeFile(file, mutate(await readFile(file, 'utf8')))
    assert.ok((await inspectThemeArtifacts(dir)).some(e => e.includes(issue)))
  })
}
test('rejects published internal pages', async t => {
  const dir = await fixture(t)
  await mkdir(join(dir, 'superpowers'))
  await writeFile(join(dir, 'superpowers/design.html'), '<h1>内部设计</h1>')
  assert.ok((await inspectThemeArtifacts(dir)).some(e => e.includes('superpowers')))
})
for (const [path, content] of [
  ['sitemap.xml', '<loc>https://example.com/superpowers/specs/design</loc>'],
  ['search.js', '换机手册：Teek 文档风主题迁移设计'],
  ['posts.json', 'Teek 文档风主题迁移 Implementation Plan'],
]) {
  test(`rejects internal content leaked through ${path}`, async t => {
    const dir = await fixture(t)
    await writeFile(join(dir, path), content)
    assert.ok((await inspectThemeArtifacts(dir)).some(e => e.includes(path)))
  })
}
for (const content of ['<main>No heading</main>', '<h1>Node</h1><h1>Node</h1>']) {
  test(`rejects incorrect critical-page heading count: ${content}`, async t => {
    const dir = await fixture(t)
    await writeFile(join(dir, 'env/nodejs.html'), content)
    assert.ok((await inspectThemeArtifacts(dir)).some(e => e.includes('H1') && e.includes('nodejs')))
  })
}
test('rejects unresolved icon font URLs in built CSS', async t => {
  const dir = await fixture(t)
  await writeFile(join(dir, 'style.css'), '@font-face{src:url(iconfont.woff2?t=123)}')
  assert.ok((await inspectThemeArtifacts(dir)).some(e => e.includes('iconfont')))
})
test('detects missing theme shell and missing required pages', async t => {
  const dir = await fixture(t)
  await writeFile(join(dir, 'index.html'), '<h1>手册</h1>')
  await rm(join(dir, 'apps/dsh-tui/index.html'))
  const issues = await inspectThemeArtifacts(dir)
  assert.ok(issues.some(e => e.includes('tk-layout')))
  assert.ok(issues.some(e => e.includes('dsh-tui')))
})
