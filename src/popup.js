import { products, escapeHTML as esc } from './catalog.js'
import { art } from './art.js'
import './popup.css'

const featured = products.slice(0, 3)
export function popupHome() {
  return `<section class="popup-hero" aria-labelledby="hero-title">
    <div class="popup-hero-inner section-width">
      <div class="popup-copy"><p class="eyebrow">MOMOKA GOODS / POP-UP COLLECTION</p><h1 id="hero-title"><span>いつもの場所に、</span><strong>ももかを。</strong></h1><p class="popup-intro">飾って、持ち歩いて、そばに置いて。<br />好きなところに、ももかを少し。</p><a class="button primary popup-cta" href="#/items">アイテムを見る <span aria-hidden="true">→</span></a></div>
      <div class="popup-character" role="img" aria-label="キャラクター画像の配置枠">CHARACTER PLACEHOLDER</div>
      <div class="floating-goods" aria-label="ピックアップ商品の入口">${featured.map(product => `<a class="floating-item" href="#/item/${product.id}" aria-label="${esc(product.name)}の詳細">${art(product,{label:false})}<span class="floating-caption">${esc(product.name)}</span></a>`).join('')}</div>
      <p class="popup-material-note">画像は仮枠です。配置と操作を確認できます。</p>
    </div>
  </section>
  <nav class="sticker-navigation section-width" aria-label="グッズのショートカット">${featured.map(p => `<a href="#/items" data-quick-query="${esc(p.name)}" class="sticker"><span>${esc(p.name)}</span><span aria-hidden="true">↗</span></a>`).join('')}<button class="sticker" type="button" data-collections-scroll aria-controls="collections">コレクションで探す</button></nav>
  <section class="pickup section-width" aria-labelledby="pickup-title"><header><p class="eyebrow">PICK UP ITEMS</p><h2 id="pickup-title">ピックアップ</h2></header><div class="pickup-grid">${featured.map(product => `<a class="pickup-card" href="#/item/${product.id}">${art(product,{label:false})}<h3>${esc(product.name)}</h3><span>アイテムを見る ↗</span></a>`).join('')}</div></section>
  <section id="collections" class="collections section-width" aria-labelledby="collections-title"><div class="section-heading"><div><p class="eyebrow">COLLECTIONS</p><h2 id="collections-title" tabindex="-1">ふたつの楽しみ方。</h2></div><span class="section-aside">好きな場所から、選んでみて。</span></div><div class="collection-grid"><a href="#/items" data-collection="BASIC" class="collection-link"><span class="collection-index">01</span><div><span class="eyebrow">BASIC COLLECTION</span><h3>暮らしのそばに。</h3><p>飾るもの、持ち歩くもの。</p></div><span class="round-arrow" aria-hidden="true">↗</span></a><a href="#/items" data-collection="DIGITAL" class="collection-link digital"><span class="collection-index">02</span><div><span class="eyebrow">DIGITAL COLLECTION</span><h3>画面の中にも。</h3><p>壁紙と、ひとことのカード。</p></div><span class="round-arrow" aria-hidden="true">↗</span></a></div></section>`
}
