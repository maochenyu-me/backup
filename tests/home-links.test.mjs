import test from 'node:test'
import assert from 'node:assert/strict'
import { homeLink } from '../docs/.vitepress/theme/home-links.mjs'

for (const [path, base, clean, want] of [
  ['/guide/order', '/theme-check/', true, '/theme-check/guide/order'],
  ['/guide/order', '/theme-check/', false, '/theme-check/guide/order.html'],
  ['/apps/dsh/', '/theme-check/', false, '/theme-check/apps/dsh/index.html'],
  ['/', '/theme-check/', false, '/theme-check/'],
  ['/guide/order.html', '/', false, '/guide/order.html'],
  ['/guide/order?q=x#step', '/', false, '/guide/order.html?q=x#step'],
  ['/apps/dsh/', '/', true, '/apps/dsh/'],
]) {
  test(`${path}, base=${base}, clean=${clean}`, () => {
    assert.equal(homeLink(path, base, clean), want)
  })
}
