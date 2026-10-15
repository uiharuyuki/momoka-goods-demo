import { products, escapeHTML as esc } from './catalog.js'
import { art } from './art.js'
import characterWire from './assets/momoka-pose-wire.svg?no-inline'
import './popup.css'

const featured = products.slice(0, 3)
const doodle = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 33C-4 18 6 1 20 13 34 1 44 18 20 33Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
export function popupHome() {
  return `<section class="popup-hero" aria-labelledby="hero-title">
    <div class="popup-hero-inner">
      <div class="popup-copy"><p class="popup-kicker">MOMOKA GOODS / POP-UP COLLECTION</p><h1 id="hero-title"><span>いつもの場所に、</span><strong>ももかを。</strong></h1><p class="popup-intro">飾って、持ち歩いて、そばに置いて。<br />好きなところに、ももかを少し。</p><a class="button primary popup-cta" href="#/items">アイテムを見る <span aria-hidden="true">→</span></a></div>
      <div class="popup-character" role="img" aria-label="大きなキャラクターイラストの配置枠。手を振る立ち絵の仮線画。">
        <svg class="popup-scallop" viewBox="0 0 700 600" preserveAspectRatio="none" aria-hidden="true"><path d="M68 104Q15 70 49 34Q83 5 122 38Q152-5 196 30Q240-9 278 30Q327-5 367 30Q414-3 454 32Q505 1 541 40Q590 15 615 61Q668 47 677 101Q714 131 675 171Q714 214 680 254Q715 303 674 337Q705 390 664 419Q687 474 637 497Q638 550 582 550Q549 592 506 560Q461 602 419 568Q371 605 329 567Q282 600 240 565Q191 594 156 554Q99 565 85 516Q29 514 40 461Q-8 429 28 388Q-9 343 28 302Q-8 252 27 218Q-5 165 43 148Q19 120 68 104Z"/></svg>
        <img src="${characterWire}" alt="" width="640" height="650" />
        <span class="character-wire-note">CHARACTER ART / 仮線画</span>
      </div>
      <div class="floating-goods" aria-label="ピックアップ商品の入口">${featured.map((product,i) => `<a class="floating-item floating-item-${i + 1}" href="#/item/${product.id}" aria-label="${esc(product.name)}の詳細">${art(product,{label:false})}<span class="floating-caption">${esc(product.name)}</span></a>`).join('')}</div>
      <span class="popup-doodle doodle-one" aria-hidden="true">${doodle}</span><span class="popup-doodle doodle-two" aria-hidden="true">✧</span><span class="popup-doodle doodle-three" aria-hidden="true">${doodle}</span>
      <span class="popup-ticket">A / POP-UP STORE<span>WIREFRAME</span></span>
      <p class="popup-material-note">立ち絵・商品画像は、形状確認用の仮素材です。</p>
    </div>
  </section>
  <nav class="sticker-navigation section-width" aria-label="グッズのショートカット">${featured.map((p,i) => `<a href="#/items" data-quick-query="${esc(p.name)}" class="sticker sticker-${i + 1}"><span class="sticker-icon" aria-hidden="true">${['◇','♧','▱'][i]}</span><span>${esc(p.name)}</span><span class="sticker-arrow" aria-hidden="true">↗</span></a>`).join('')}<button class="sticker sticker-4" type="button" data-collections-scroll aria-controls="collections"><span>コレクションで探す</span><span class="sticker-icon" aria-hidden="true">♡</span></button></nav>
  <section class="pickup section-width" aria-labelledby="pickup-title"><header><p class="eyebrow">PICK UP ITEMS</p><h2 id="pickup-title">まずは、<br />このあたり。</h2><span class="pickup-doodle" aria-hidden="true">♡</span></header><div class="pickup-grid">${featured.map(product => `<a class="pickup-card" href="#/item/${product.id}">${art(product,{label:false})}<h3>${esc(product.name)}</h3><span>アイテムを見る ↗</span></a>`).join('')}</div><p class="pickup-note">いつもの場所に、<br />小さな楽しみを。</p></section>
  <section id="collections" class="collections section-width" aria-labelledby="collections-title"><div class="section-heading"><div><p class="eyebrow">COLLECTIONS</p><h2 id="collections-title" tabindex="-1">ふたつの楽しみ方。</h2></div><span class="section-aside">好きな場所から、選んでみて。</span></div><div class="collection-grid"><a href="#/items" data-collection="BASIC" class="collection-link"><span class="collection-index">01</span><div><span class="eyebrow">BASIC COLLECTION</span><h3>暮らしのそばに。</h3><p>飾るもの、持ち歩くもの。</p></div><span class="round-arrow" aria-hidden="true">↗</span></a><a href="#/items" data-collection="DIGITAL" class="collection-link digital"><span class="collection-index">02</span><div><span class="eyebrow">DIGITAL COLLECTION</span><h3>画面の中にも。</h3><p>壁紙と、ひとことのカード。</p></div><span class="round-arrow" aria-hidden="true">↗</span></a></div></section>`
}
