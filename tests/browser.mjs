import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { products } from '../src/catalog.js'

const base = process.env.UI_BASE_URL || 'http://127.0.0.1:4180/momoka-goods-demo/'
const output = process.env.UI_ARTIFACT_DIR || await mkdtemp(join(tmpdir(), 'momoka-goods-ui-'))
await mkdir(output,{recursive:true})
const checks=[]
let browser, server
async function check(name,fn){await fn();checks.push({name,status:'passed'});await writeFile(join(output,'results.json'),JSON.stringify(checks,null,2));console.log('PASS '+name)}
try {
 if(!process.env.UI_BASE_URL){
  server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4180','--strictPort'],{stdio:'pipe'})
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview not ready')),15000);server.once('error',reject);server.once('exit',code=>{clearTimeout(timer);reject(Error('preview exited '+code))});server.stdout.on('data',data=>{if(data.toString().includes('Local:')){clearTimeout(timer);resolve()}})})
 }
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']})
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
 const page=await context.newPage()
 const errors=[],unexpected=[]
 page.on('pageerror',e=>errors.push(e.message))
 page.on('request',r=>{if(!['document','script','stylesheet','image','other'].includes(r.resourceType())||new URL(r.url()).origin!==new URL(base).origin)unexpected.push({url:r.url(),type:r.resourceType()})})
 async function open(hash='#/') {await page.goto(base+hash);await page.locator('#main h1').waitFor();await page.evaluate(()=>document.fonts.ready)}
 await open()
 await check('home shows the demo boundary, collection and all eight items',async()=>{assert.match(await page.locator('.demo-banner').innerText(),/購入はできません/);assert.equal(await page.locator('.product-card').count(),8);assert.equal(await page.locator('.collection-link').count(),2)})
 await check('categories, search, zero results and reset work together',async()=>{
  await page.getByRole('button',{name:'飾る',exact:true}).click();assert.equal(await page.locator('.product-card').count(),3)
  await page.getByRole('button',{name:'すべて',exact:true}).click()
  await page.getByLabel('商品を検索',{exact:true}).fill('マグ');assert.equal(await page.locator('.product-card').count(),1)
  await page.getByLabel('商品を検索',{exact:true}).fill('not-a-product');assert.equal(await page.locator('.product-card').count(),0)
  await page.getByRole('button',{name:'条件をリセット',exact:true}).click();assert.equal(await page.locator('.product-card').count(),8)
 })
 await check('sort changes real card order',async()=>{await page.getByLabel('並び順').selectOption('name');const names=await page.locator('.product-card h3').allTextContents();assert.deepEqual(names,products.map(p=>p.name).sort((a,b)=>a.localeCompare(b,'ja')))})
 await check('collection links select a subset and can be cleared',async()=>{await page.locator('[data-collection="DIGITAL"]').click();await page.waitForURL('**/#/items');await page.getByText('DIGITAL COLLECTIONを表示中',{exact:true}).waitFor();assert.equal(await page.locator('.product-card').count(),2);await page.getByRole('button',{name:'絞り込みを解除 ×'}).click();assert.equal(await page.locator('.product-card').count(),8)})
 await check('browser back keeps filters within the current page session',async()=>{await page.getByLabel('商品を検索',{exact:true}).fill('マグ');await page.locator('.product-card-link').click();await page.waitForURL('**/#/item/mug');await page.goBack();await page.locator('#search').waitFor();assert.equal(await page.locator('#search').inputValue(),'マグ');assert.equal(await page.locator('.product-card').count(),1)})
 await open('#/item/acrylic-stand')
 await check('product URL survives reload and selects image/design variants',async()=>{
  await page.reload();await page.locator('#product-title').waitFor();assert.equal(await page.locator('#product-title').innerText(),'アクリルスタンド')
  await page.getByRole('button',{name:'パッケージ',exact:true}).click();assert.equal(await page.locator('[data-view="2"]').getAttribute('aria-pressed'),'true');assert.match(await page.locator('.main-image .art-caption').innerText(),/パッケージ/)
  await page.getByRole('button',{name:'別ポーズ',exact:true}).click();assert.equal(await page.locator('[data-variant="1"]').getAttribute('aria-pressed'),'true');assert.match(await page.locator('.selection-status').innerText(),/別ポーズ/)
 })
 await check('zoom uses a modal with Escape, close button and focus restoration',async()=>{
  await page.locator('#zoom-button').click();assert.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);assert.equal(await page.locator('#zoom-button').evaluate(e=>e===document.activeElement),true)
  await page.locator('#zoom-button').click();await page.getByRole('button',{name:'閉じる ×',exact:true}).click();assert.equal(await page.locator('dialog[open]').count(),0)
 })
 for(const product of products){await open('#/item/'+product.id);await check('direct detail: '+product.id,async()=>{assert.equal(await page.locator('#product-title').innerText(),product.name);assert.equal(await page.locator('.purchase-button').isDisabled(),true);assert.equal(await page.locator('input').count(),0)})}
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:width<=390?844:1000})
  for(const hash of ['#/','#/items','#/item/acrylic-stand','#/guide']){
   await open(hash)
   await check(`${hash} at ${width}: layout and non-selling boundary`,async()=>{
    const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}))
    assert.ok(sizes.scroll<=sizes.client,JSON.stringify(sizes));assert.equal(await page.locator('.demo-banner').isVisible(),true)
    assert.equal(await page.locator('input[type="email"],input[type="password"],form,iframe').count(),0)
    assert.ok(await page.locator('a[href="https://momoka-cloudflare-poc.nirayuki15.workers.dev/"]').count()>=2)
   })
  }
 }
 await check('mobile detail controls remain usable',async()=>{
  await page.setViewportSize({width:390,height:844});await open('#/item/acrylic-stand');await page.getByRole('button',{name:'別ポーズ',exact:true}).click();await page.locator('[data-view="1"]').click();await page.locator('#zoom-button').click();assert.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape')
  const sizes=await page.locator('button:not(:disabled)').evaluateAll(els=>els.filter(e=>e.getClientRects().length).map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})))
  assert.ok(sizes.every(s=>s.w>=44&&s.h>=44),JSON.stringify(sizes))
 })
 await open('#/item/missing')
 await check('unknown product provides a safe return path',async()=>{assert.match(await page.locator('h1').innerText(),/見つからなかった/);await page.getByRole('link',{name:'アイテム一覧へ',exact:true}).click();await page.waitForURL('**/#/items')})
 await check('favicon resolves as a real static asset',async()=>{const href=await page.locator('link[rel="icon"]').getAttribute('href');assert.match(href,/favicon\.svg$/);const response=await page.request.get(new URL(href,base).href);assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/svg/);assert.match(await response.text(),/<svg/)})
 await check('no app errors, external requests or persistent browser storage',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(unexpected,[]);assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0})})
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:1000})
  for(const [name,hash]of [['home','#/'],['detail','#/item/acrylic-stand'],['guide','#/guide']]){await open(hash);await page.screenshot({path:join(output,`${name}-${width}.png`),fullPage:false});await page.screenshot({path:join(output,`${name}-${width}-full.png`),fullPage:true})}
 }
 console.log(JSON.stringify({passed:checks.length,output}))
}finally{if(browser)await browser.close();if(server)server.kill('SIGTERM')}
