export const categories = ['すべて', '飾る', '持ち歩く', '暮らし', 'デジタル']

// All entries are fictional interface samples, not items offered for sale.
export const products = [
  { id: 'acrylic-stand', name: 'アクリルスタンド', category: '飾る', collection: 'BASIC', art: 'stand', code: 'MK-001', description: 'デスクの片隅や、お気に入りの棚に。基本ビジュアルを使ったアクリルスタンドの企画サンプルです。', variants: ['基本ポーズ', '別ポーズ'], views: ['正面', '別アングル', 'パッケージ'] },
  { id: 'keyring', name: 'アクリルキーホルダー', category: '持ち歩く', collection: 'BASIC', art: 'keyring', code: 'MK-002', description: 'いつものバッグに、小さな目印を。キャラクターモチーフを使ったキーホルダーの企画サンプルです。', variants: ['キャラクター', 'モチーフ'], views: ['正面', '裏面', 'パッケージ'] },
  { id: 'mug', name: 'マグカップ', category: '暮らし', collection: 'BASIC', art: 'mug', code: 'MK-003', description: '作業の合間も、のんびりする時間も。ワンポイントを添えたマグカップの企画サンプルです。', variants: ['ロゴ', 'モチーフ'], views: ['正面', '別アングル', 'パッケージ'] },
  { id: 'tote', name: 'トートバッグ', category: '持ち歩く', collection: 'BASIC', art: 'tote', code: 'MK-004', description: '本や小物を入れて、ちょっとそこまで。日常に馴染むトートバッグの企画サンプルです。', variants: ['ロゴ'], views: ['正面', '裏面', 'パッケージ'] },
  { id: 'art-print', name: 'アートプリント', category: '飾る', collection: 'BASIC', art: 'print', code: 'MK-005', description: '好きな場所に、ひとつの景色を。キャラクタービジュアルを飾るプリントの企画サンプルです。', variants: ['基本ビジュアル', '別ポーズ'], views: ['全体', '拡大イメージ', 'パッケージ'] },
  { id: 'badge', name: '缶バッジ', category: '飾る', collection: 'BASIC', art: 'badge', code: 'MK-006', description: '小さく飾って、並べて楽しむ。表情を切り取った缶バッジの企画サンプルです。', variants: ['通常', '笑顔'], views: ['正面', '裏面', 'パッケージ'] },
  { id: 'wallpaper', name: 'スマートフォン壁紙', category: 'デジタル', collection: 'DIGITAL', art: 'phone', code: 'MK-007', description: '画面を開くと、いつものももか。スマートフォン向け壁紙の企画サンプルです。', variants: ['ライト', 'ダーク'], views: ['全体', '使用イメージ'] },
  { id: 'message-card', name: 'デジタルメッセージカード', category: 'デジタル', collection: 'DIGITAL', art: 'card', code: 'MK-008', description: 'イラストに、短いひとことを添えて。デジタルカードの企画サンプルです。', variants: ['あいさつ', 'ありがとう'], views: ['全体', '拡大イメージ'] },
].map(product => Object.freeze({ ...product, price: null, demo: true }))

export function getProduct(id) { return products.find(product => product.id === id) }
const normalize = value => String(value || '').normalize('NFKC').trim().toLocaleLowerCase('ja')
export function selectProducts({ category = 'すべて', query = '', sort = 'default', collection = '' } = {}) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  const selected = products.filter(product => {
    const text = normalize(`${product.name} ${product.category} ${product.collection} ${product.description}`)
    return (category === 'すべて' || product.category === category) && (!collection || product.collection === collection) && words.every(word => text.includes(word))
  })
  return sort === 'name' ? selected.sort((a,b) => a.name.localeCompare(b.name,'ja')) : selected
}
export function parseRoute(hash = '') {
  if (!hash || hash === '#' || hash === '#/') return { page: 'home' }
  if (hash === '#/items') return { page: 'items' }
  if (hash === '#/guide') return { page: 'guide' }
  if (hash.startsWith('#/item/')) {
    try {
      const id = decodeURIComponent(hash.slice(7))
      if (getProduct(id)) return { page: 'item', id }
    } catch { /* Malformed URLs get the same safe not-found state. */ }
  }
  return { page: 'not-found' }
}
export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}
