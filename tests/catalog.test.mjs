import assert from 'node:assert/strict'
import { test } from 'node:test'
import { products, categories, selectProducts, getProduct, parseRoute, escapeHTML } from '../src/catalog.js'

test('the demo catalog has eight unique items with unconfirmed prices', () => {
  assert.equal(products.length, 8)
  assert.equal(new Set(products.map(p => p.id)).size, 8)
  for (const p of products) { assert.equal(p.price, null); assert.equal(p.demo, true); assert.ok(p.views.length >= 2); assert.ok(p.variants.length >= 1); assert.ok(categories.includes(p.category)) }
})
test('categories and combined search filter actual records', () => {
  assert.equal(selectProducts({ category: '飾る' }).length, 3)
  assert.equal(selectProducts({ category: 'デジタル' }).length, 2)
  assert.deepEqual(selectProducts({ category: '暮らし', query: 'マグ' }).map(p => p.id), ['mug'])
  assert.equal(selectProducts({ category: '持ち歩く', query: 'マグ' }).length, 0)
})
test('search normalizes whitespace and width without persisting data', () => {
  assert.equal(selectProducts({ query: ' ＢＡＳＩＣ ' }).length, 6)
  assert.equal(selectProducts({ query: '存在しない商品' }).length, 0)
})
test('name sorting is stable and does not mutate the canonical data', () => {
  const before = products.map(p => p.id)
  const names = selectProducts({ sort: 'name' }).map(p => p.name)
  assert.deepEqual(names, [...names].sort((a,b) => a.localeCompare(b,'ja')))
  assert.deepEqual(products.map(p => p.id), before)
})
test('direct product URLs, guide and unknown routes are deterministic', () => {
  assert.deepEqual(parseRoute('#/item/acrylic-stand'), { page: 'item', id: 'acrylic-stand' })
  assert.deepEqual(parseRoute('#/'), { page: 'home' })
  assert.deepEqual(parseRoute('#/items'), { page: 'items' })
  assert.deepEqual(parseRoute('#/guide'), { page: 'guide' })
  for (const bad of ['#/item/%E0%A4%A', '#/item/../../evil', '#/item/missing', '#/wrong']) assert.equal(parseRoute(bad).page, 'not-found')
})
test('item lookup never falls back to an unrelated product', () => {
  assert.equal(getProduct('acrylic-stand')?.name, 'アクリルスタンド')
  assert.equal(getProduct('missing'), undefined)
})
test('interpolated text is HTML-escaped', () => {
  assert.equal(escapeHTML('<img src=x onerror="x"> & \'test\''), '&lt;img src=x onerror=&quot;x&quot;&gt; &amp; &#39;test&#39;')
})
