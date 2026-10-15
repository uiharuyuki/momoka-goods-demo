import assert from 'node:assert/strict'
import { test } from 'node:test'
import { art } from '../src/art.js'
import { products, escapeHTML } from '../src/catalog.js'

test('every product view uses a labelled image frame, not a drawing', () => {
  for (const product of products) {
    for (let view = 0; view < product.views.length; view++) {
      for (let variant = 0; variant < product.variants.length; variant++) {
        const html = art(product, { view, variant })
        assert.doesNotMatch(html, /<(svg|img|canvas)\b/)
        assert.match(html, /PRODUCT IMAGE/)
        assert.ok(html.includes(escapeHTML(product.views[view])))
        assert.ok(html.includes(escapeHTML(product.variants[variant])))
      }
    }
  }
})

test('compact image frames and labels retain escaping', () => {
  const product = { ...products[0], name: '"<script>', views: ['<front>'], variants: ['"alternate"'] }
  const html = art(product)
  assert.ok(html.includes('&lt;front&gt;'))
  assert.ok(html.includes('&quot;alternate&quot;'))
  assert.doesNotMatch(html, /<script>|<front>/)
  const compact = art(product, { label: false })
  assert.match(compact, /PRODUCT IMAGE/)
  assert.doesNotMatch(compact, /class="art-caption"/)
})
