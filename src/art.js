import { escapeHTML as esc } from './catalog.js'

// Keep image size and selection feedback, without reproducing any artwork.
export function art(product, { view = 0, variant = 0, className = '', label = true } = {}) {
  const viewName = product.views[view] || '正面'
  const variantName = product.variants[variant] || product.variants[0]
  const accessible = label ? `role="img" aria-label="${esc(product.name)}の画像枠（${esc(viewName)}・${esc(variantName)}）"` : 'aria-hidden="true"'
  return `<div class="product-art image-view-${view} image-variant-${variant} ${esc(className)}" ${accessible}><span class="art-placeholder-label" aria-hidden="true">PRODUCT IMAGE</span>${label ? `<span class="art-caption">${esc(viewName)} / ${esc(variantName)} / 仮画像</span>` : ''}</div>`
}
