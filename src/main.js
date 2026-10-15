import './styles.css'
import { products, categories, selectProducts, getProduct, parseRoute, escapeHTML as esc } from './catalog.js'
import { art } from './art.js'
import { popupHome } from './popup.js'

const main = document.querySelector('#main')
const zoom = document.querySelector('#image-dialog')
const filters = { category: 'すべて', query: '', sort: 'default', collection: '' }
let current = parseRoute(location.hash)
let selectedView = 0
let selectedVariant = 0
let overflowBeforeZoom = ''

function card(product) {
  return `<article class="product-card"><a class="product-card-link" href="#/item/${product.id}" aria-label="${esc(product.name)}の詳細"><div class="card-image">${art(product)}<span class="card-open" aria-hidden="true">↗</span></div><div class="card-copy"><p class="eyebrow">${product.collection} / ${esc(product.category)}</p><h3>${esc(product.name)}</h3><p class="card-price">価格未定 <span>企画サンプル</span></p></div></a></article>`
}
function catalog(isHome) {
  return `<section class="catalog section-width" aria-labelledby="items-title"><div class="section-heading"><div><p class="eyebrow">ALL ITEMS</p><${isHome ? 'h2' : 'h1'} id="items-title">アイテムを探す。</${isHome ? 'h2' : 'h1'}></div><p class="result-count" role="status"></p></div><div class="catalog-tools"><div class="search-field" role="search"><label for="search">商品を検索</label><div><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="商品名やキーワード" value="${esc(filters.query)}" autocomplete="off" maxlength="120" /></div></div><div class="sort-field"><label for="sort">並び順</label><select id="sort"><option value="default" ${filters.sort === 'default' ? 'selected' : ''}>掲載順</option><option value="name" ${filters.sort === 'name' ? 'selected' : ''}>名前順</option></select></div></div><div class="category-row" role="group" aria-label="商品カテゴリ">${categories.map(category => `<button type="button" data-category="${esc(category)}" aria-pressed="${category === filters.category}">${esc(category)}</button>`).join('')}</div><div class="filter-summary"></div><div class="product-grid" id="product-grid"></div></section>`
}
function aboutStrip() {
  return `<aside class="about-strip section-width"><div><p class="eyebrow">ABOUT THIS DEMO</p><h2>ここは、まだ小さな企画展。</h2><p>卒業制作のためのショップデモです。<br />購入・注文・個人情報の入力はできません。</p></div><a class="button" href="#/guide">このデモについて <span aria-hidden="true">↗</span></a></aside>`
}
function detail(product) {
  return `<div class="section-width detail-page"><nav class="breadcrumbs" aria-label="パンくず"><a href="#/">トップ</a><span aria-hidden="true">/</span><a href="#/items">アイテム</a><span aria-hidden="true">/</span><span>${esc(product.name)}</span></nav><div class="product-detail"><section class="detail-gallery" aria-label="商品画像"><button type="button" id="zoom-button" class="main-image" aria-label="${esc(product.name)}の仮画像を拡大">${art(product)}<span class="image-zoom-hint">画像を拡大 ＋</span></button><div class="image-thumbnails" role="group" aria-label="商品画像を選ぶ">${product.views.map((view,i) => `<button type="button" data-view="${i}" aria-pressed="${i === 0}">${art(product, { view: i, label: false })}<span>${esc(view)}</span></button>`).join('')}</div><p class="image-disclaimer">画像は形状確認用です。完成イラスト・実商品ではありません。</p></section><section class="detail-copy" aria-labelledby="product-title"><p class="eyebrow">${product.collection} COLLECTION / ${product.code}</p><div class="detail-tags"><span>${esc(product.category)}</span><span>企画サンプル</span></div><h1 id="product-title">${esc(product.name)}</h1><p class="detail-price">価格未定<span>販売予定はありません</span></p><p class="product-description">${esc(product.description)}</p><div class="variant-group" role="group" aria-label="デザインを選ぶ"><p>デザイン <span>選択イメージ</span></p><div>${product.variants.map((v,i) => `<button type="button" data-variant="${i}" aria-pressed="${i === 0}">${esc(v)}</button>`).join('')}</div></div><p class="selection-status" role="status"></p><button type="button" class="purchase-button" disabled>デモのため購入できません</button><p class="purchase-note">カート・決済・会員登録はありません。</p><div class="product-accordions"><details open><summary>商品仕様 <span aria-hidden="true">＋</span></summary><dl><div><dt>商品区分</dt><dd>${product.category === 'デジタル' ? 'デジタルアイテム（企画）' : '物理グッズ（企画）'}</dd></div><div><dt>サイズ・素材</dt><dd>未定</dd></div><div><dt>公開・販売時期</dt><dd>未定</dd></div></dl></details><details><summary>この掲載について <span aria-hidden="true">＋</span></summary><p>レイアウトと操作を確認するためのサンプルです。仕様や画像は確定したものではなく、注文・発送・ダウンロードは行いません。</p></details></div></section></div><section class="related" aria-labelledby="related-title"><div class="section-heading"><div><p class="eyebrow">YOU MAY ALSO LIKE</p><h2 id="related-title">こちらも、よかったら。</h2></div><a class="text-link" href="#/items">一覧へ戻る ↗</a></div><div class="product-grid related-grid">${products.filter(p => p.id !== product.id && p.collection === product.collection).concat(products.filter(p => p.collection !== product.collection)).slice(0,3).map(card).join('')}</div></section></div>`
}
function guide() {
  return `<section class="guide section-width"><p class="eyebrow">SHOP GUIDE / DEMO</p><h1>このデモについて。</h1><p class="guide-lead">「小鳥遊ももかの外部Goodsサイト」を想定した、<br />卒業制作のワイヤーフレームです。</p><div class="guide-notice"><span>購入できません</span><p>商品・価格・仕様は未確定です。注文、決済、会員登録、個人情報入力の機能はありません。</p></div><div class="guide-sections"><section><span class="eyebrow">01 / EXPERIENCE</span><h2>できること</h2><p>商品一覧の検索、カテゴリ絞り込み、並び替え、商品詳細の閲覧、仮画像とデザインの切替、画像の拡大を試せます。</p></section><section><span class="eyebrow">02 / MATERIALS</span><h2>掲載しているもの</h2><p>すべて企画・表示用のサンプルです。画像は配置と大きさを確認するための仮枠で、イラストや実商品の写真は使用していません。</p></section><section><span class="eyebrow">03 / PRIVACY</span><h2>入力情報の扱い</h2><p>検索語と選択状態は、このページのメモリ内だけで扱い、サイトから送信・永続保存しません。アクセス解析や広告は設置していません。配信基盤のGitHub Pagesでは、セキュリティ目的でアクセス元IPが記録されます。</p></section><section><span class="eyebrow">04 / OFFICIAL SITE</span><h2>ももかの本体サイト</h2><p>キャラクター紹介やAIとの会話は、本体の公式サイトで扱います。ショップデモからAIへの送信は行いません。</p><a class="button" href="https://momoka-cloudflare-poc.nirayuki15.workers.dev/">公式サイトへ戻る ↗</a></section></div><a class="text-link" href="#/items">アイテム一覧へ ↗</a></section>`
}
function updateResults() {
  const grid = main.querySelector('#product-grid')
  if (!grid) return
  const items = selectProducts(filters)
  main.querySelector('.result-count').innerHTML = `<strong>${items.length}</strong> ITEMS <span>全${products.length}件</span>`
  grid.innerHTML = items.length ? items.map(card).join('') : `<div class="empty-state"><span aria-hidden="true">⌕</span><h3>該当するアイテムはありません。</h3><p>別のキーワードやカテゴリで探してみてね。</p><button type="button" data-reset>条件をリセット</button></div>`
  main.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === filters.category)))
  main.querySelector('.filter-summary').innerHTML = filters.collection ? `<span>${esc(filters.collection)} COLLECTIONを表示中</span><button type="button" data-reset>絞り込みを解除 ×</button>` : ''
}
function updateGallery() {
  const product = getProduct(current.id)
  if (!product) return
  const image = main.querySelector('#zoom-button')
  image.innerHTML = art(product, { view: selectedView, variant: selectedVariant }) + '<span class="image-zoom-hint">画像を拡大 ＋</span>'
  main.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.view) === selectedView)))
  main.querySelectorAll('[data-variant]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.variant) === selectedVariant)))
  main.querySelector('.selection-status').textContent = `選択中：${product.variants[selectedVariant]} / ${product.views[selectedView]}`
}
function render(moveFocus = false) {
  if (zoom.open) zoom.close()
  current = parseRoute(location.hash)
  selectedView = 0
  selectedVariant = 0
  const product = current.page === 'item' ? getProduct(current.id) : null
  if (current.page === 'home') main.innerHTML = popupHome() + catalog(true) + aboutStrip()
  else if (current.page === 'items') main.innerHTML = catalog(false) + aboutStrip()
  else if (product) main.innerHTML = detail(product)
  else if (current.page === 'guide') main.innerHTML = guide()
  else main.innerHTML = '<section class="not-found section-width"><p class="eyebrow">NOT FOUND</p><h1>このアイテムは見つからなかった。</h1><p>一覧から、もう一度探してみてね。</p><a class="button" href="#/items">アイテム一覧へ</a></section>'
  document.title = `${product?.name || ({ home: 'MOMOKA GOODS', items: 'アイテム一覧', guide: 'ご利用案内' }[current.page] || '見つかりません')} — 卒業制作デモ`
  document.querySelectorAll('.site-header nav a').forEach(link => {
    const active = (current.page === 'items' || current.page === 'item') && link.getAttribute('href') === '#/items' || current.page === 'guide' && link.getAttribute('href') === '#/guide'
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current')
  })
  updateResults()
  if (product) updateGallery()
  if (moveFocus) { window.scrollTo(0,0); main.focus({ preventScroll: true }) }
}
main.addEventListener('input', event => {
  if (event.target.id === 'search') { filters.query = event.target.value; updateResults() }
})
main.addEventListener('change', event => {
  if (event.target.id === 'sort') { filters.sort = event.target.value; updateResults() }
})
main.addEventListener('click', event => {
  const target = event.target.closest('button, a')
  if (!target) return
  if (target.hasAttribute('data-category')) { filters.category = target.dataset.category; updateResults() }
  if (target.hasAttribute('data-reset')) {
    Object.assign(filters, { category: 'すべて', query: '', sort: 'default', collection: '' })
    main.querySelector('#search').value = ''
    main.querySelector('#sort').value = 'default'
    updateResults()
    main.querySelector('#search').focus()
  }
  if (target.hasAttribute('data-collection')) {
    Object.assign(filters, { category: 'すべて', query: '', sort: 'default', collection: target.dataset.collection })
    if (location.hash === '#/items') { event.preventDefault(); render(true) }
  }
  if (target.hasAttribute('data-quick-query')) {
    Object.assign(filters, { category: 'すべて', query: target.dataset.quickQuery, sort: 'default', collection: '' })
    if (location.hash === '#/items') { event.preventDefault(); render(true) }
  }
  if (target.hasAttribute('data-collections-scroll')) {
    main.querySelector('#collections')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    main.querySelector('#collections-title')?.focus({ preventScroll: true })
  }
  if (target.hasAttribute('data-view')) { selectedView = Number(target.dataset.view); updateGallery() }
  if (target.hasAttribute('data-variant')) { selectedVariant = Number(target.dataset.variant); updateGallery() }
  if (target.id === 'zoom-button') {
    const product = getProduct(current.id)
    document.querySelector('#zoom-art').innerHTML = art(product, { view: selectedView, variant: selectedVariant })
    overflowBeforeZoom = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    zoom.showModal()
  }
})
document.querySelector('#close-zoom').addEventListener('click', () => zoom.close())
zoom.addEventListener('close', () => { document.body.style.overflow = overflowBeforeZoom })
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); main.scrollIntoView() })
window.addEventListener('hashchange', () => render(true))
render()
