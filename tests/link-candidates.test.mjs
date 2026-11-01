import test from 'node:test'
import assert from 'node:assert/strict'
import { linkCandidates } from '../scripts/check-links.mjs'
for (const [href, want] of [
  ['/theme-check/guide/order.html', ['guide/order.html']],
  ['/theme-check/apps/dsh/', ['apps/dsh.html','apps/dsh/index.html']],
  ['/theme-check/guide/order?q=x#anchor', ['guide/order.html','guide/order/index.html']],
  ['//example.com/page', []],
]) {
  test(`resolves ${href}`, () => assert.deepEqual(linkCandidates(href, '/theme-check/'), want))
}
test('rejects links that escape project base', () => {
  assert.throws(() => linkCandidates('/guide/order', '/theme-check/'), /outside base/)
})
