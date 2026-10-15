import { escapeHTML } from './catalog.js'
const forms = {
  stand: `<ellipse cx="220" cy="400" rx="105" ry="22"/><path class="acrylic-outline" d="M137 374V174c0-76 34-126 83-126s83 50 83 126v200Z"/><circle cx="220" cy="134" r="43"/><path d="M169 143c-6-62 16-94 51-94s57 32 51 94M171 130c13-8 35-26 47-43 10 20 27 35 51 42"/><path d="m178 201-33 149 52 8 8-86h30l8 86 52-8-33-149-42-22Z"/><path d="m179 218-26 67m108-67 25 67M195 357v32m50-32v32M176 391h38m12 0h38"/><path class="pose-line" d="M166 248h108"/>`,
  keyring: `<circle cx="220" cy="72" r="30"/><circle cx="220" cy="72" r="19"/><path d="M220 102v38"/><rect x="117" y="139" width="206" height="236" rx="48"/><path d="m220 183 22 49 54 7-40 38 10 53-46-25-46 25 10-53-40-38 54-7Z"/>`,
  mug: `<path d="M106 145h214v191c0 32-22 56-53 56H159c-31 0-53-24-53-56Z"/><ellipse cx="213" cy="145" rx="107" ry="21"/><path d="M321 174h29c58 0 58 119 0 119h-29M153 77v38M213 57v57M273 77v38"/><path d="m162 297 25-58 25 58 26-58 25 58"/>`,
  tote: `<path d="M114 146h212l22 252H92Z"/><path d="M165 169V113c0-78 110-78 110 0v56M148 170V113c0-99 144-99 144 0v57"/><path d="m148 308 35-80 37 80 37-80 35 80"/><path d="M113 372h214"/>`,
  print: `<rect x="87" y="59" width="266" height="351" rx="5"/><rect x="103" y="76" width="234" height="318"/><circle cx="220" cy="176" r="50"/><path d="M145 343c0-81 26-120 75-120s75 39 75 120M126 364h188"/><path d="m132 117 13-18 13 18m122 0 13-18 13 18"/>`,
  badge: `<circle cx="220" cy="242" r="139"/><circle cx="220" cy="242" r="123"/><circle cx="220" cy="219" r="47"/><path d="M134 330c8-52 37-77 86-77s78 25 86 77M177 208c-5-42 12-63 43-63s48 21 43 63M193 217h10m34 0h10M206 240q14 14 28 0"/>`,
  phone: `<rect x="122" y="42" width="196" height="383" rx="34"/><rect x="135" y="56" width="170" height="355" rx="23"/><path d="M190 67h60M192 395h56"/><circle cx="220" cy="177" r="47"/><path d="M150 355c0-78 23-126 70-126s70 48 70 126"/>`,
  card: `<rect x="70" y="120" width="285" height="201" rx="10" transform="rotate(-8 212 220)"/><rect x="86" y="139" width="285" height="201" rx="10" class="filled-shape"/><circle cx="162" cy="226" r="41"/><path d="M230 192h103M230 218h103M230 244h74M124 296h211"/>`,
}
export function art(product, { view = 0, variant = 0, className = '', label = true } = {}) {
  const isPackage = product.views[view] === 'パッケージ'
  const shape = isPackage ? `<path d="m220 77 126 56v235l-126 58-126-58V133Z"/><path d="m94 133 126 55 126-55M220 188v238M159 105l126 56v60"/><path d="m251 298 19-44 20 26 19-44 19 26"/>` : forms[product.art]
  return `<div class="product-art art-${escapeHTML(product.art)} image-view-${view} image-variant-${variant} ${escapeHTML(className)}"><span class="art-code" aria-hidden="true">${escapeHTML(product.code)} / SAMPLE</span><svg viewBox="0 0 440 480" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="product-drawing">${shape}</g></svg>${label ? `<span class="art-caption">${escapeHTML(product.views[view] || '正面')} / 仮画像</span>` : ''}</div>`
}
