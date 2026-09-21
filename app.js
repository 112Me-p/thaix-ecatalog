const asset = path => window.THAIX_ASSETS?.[path] || path;
const products = window.THAIX_PRODUCTS;
const grid = document.querySelector('#product-grid');
const productDialog = document.querySelector('#product-dialog');
const posterDialog = document.querySelector('#poster-dialog');
const lineUrl = 'https://line.me/R/ti/p/%40thaix';
let previousFocus = null;
const icon = (type) => {
 const paths = {farm:'M7 18h23v10H7z M8 28v5m6-5v5m12-5v5 M30 21l5-2v8h-5 M9 18l-2-5m7 5-1-6',landfill:'M11 12h18l-2 22H13z M8 12h24M16 12V7h8v5M17 17v12m6-12v12',water:'M20 5C17 12 8 20 8 26a12 12 0 0 0 24 0c0-6-9-14-12-21Z',toilet:'M10 6h15v14H10z M9 20h25c0 7-5 10-11 10v5H12v-8M15 11h5'};
 return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="${paths[type]}"/></svg>`;
};
grid.innerHTML = products.map(p => `<article class="product-card" style="--accent:${p.color}"><a class="product-art" href="#product-${p.id}" aria-label="ดูรายละเอียด ${p.name}"><div class="product-scene scene-${p.id}"></div><span class="category-icon">${icon(p.id)}</span><img src="${asset(`assets/${p.id}.png`)}" alt="ซอง ${p.name} ขนาด ${p.netWeight}" loading="lazy" width="400" height="550"></a><div class="product-card-copy"><p class="product-family">${p.id==='toilet'?'BATHROOM ODOR CARE':'AGROZYME AP'}</p><h3><a href="#product-${p.id}">${p.short}</a></h3><p>${p.title}</p><span class="weight">ขนาด ${p.netWeight}</span><a class="button small" href="#product-${p.id}">ดูรายละเอียด <span aria-hidden="true">→</span></a></div></article>`).join('');
const applications = [{"label": "ฟาร์มสุกร", "id": "farm", "image": "assets/application-pig.png"}, {"label": "ฟาร์มไก่", "id": "farm", "image": "assets/application-chicken.png"}, {"label": "ฟาร์มโค / กระบือ", "id": "farm", "image": "assets/application-cattle.png"}, {"label": "สัตว์เลี้ยง", "id": "farm", "image": "assets/application-pets.png"}, {"label": "โรงงานอุตสาหกรรม", "id": "water", "image": "assets/application-industry.png"}, {"label": "ระบบบำบัดน้ำเสีย", "id": "water", "image": "assets/application-treatment.png"}, {"label": "หลุมฝังกลบขยะ", "id": "landfill", "image": "assets/application-landfill.png"}, {"label": "ห้องน้ำ / สาธารณะ", "id": "toilet", "image": "assets/application-toilet.png"}];
document.querySelector('#application-grid').innerHTML = applications.map(a=>`<a class="application-card" href="#product-${a.id}" aria-label="${a.label} — ดูผลิตภัณฑ์ที่เกี่ยวข้อง"><div class="application-picture"><img src="${asset(a.image)}" alt="${a.label}" loading="lazy" width="1254" height="1254"></div><span>${a.label}</span></a>`).join('');
function renderDetail(p) {
 document.querySelector('#product-detail').innerHTML = `<div class="detail-layout"><div class="detail-visual"><span class="eyebrow">${p.category}</span><img src="${asset(`assets/${p.id}.png`)}" alt="${p.name} ขนาด ${p.netWeight}"><button class="poster-link" data-poster="${p.id}">ดูโปสเตอร์ข้อมูลสินค้า ↗</button></div><div class="detail-copy"><p class="eyebrow">THAIX EMZ · ${p.netWeight}</p><h2 id="detail-title">${p.name}</h2><p class="detail-thai">${p.title}</p><p>${p.description}</p><a class="button detail-cta" href="${lineUrl}" target="_blank" rel="noopener noreferrer"><span class="line-mark">LINE</span> สอบถามราคา / สั่งซื้อ</a><section><h3>คุณสมบัติเด่น</h3><ul class="benefits">${p.benefits.map(b=>`<li>${b}</li>`).join('')}</ul></section><section><h3>เหมาะสำหรับ</h3><div class="tags">${p.applications.map(a=>`<span>${a}</span>`).join('')}</div></section><section><h3>วิธีใช้</h3><p class="ratio">${p.ratio}</p>${p.steps.length?`<ol class="steps">${p.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`:''}${p.note?`<p class="usage-note">${p.note}</p>`:''}</section>${p.storage?`<section><h3>การเก็บรักษา</h3><p>${p.storage}</p></section>`:''}<p class="source-note">ข้อมูลคุณสมบัติและวิธีใช้ตามข้อมูลผลิตภัณฑ์ THAIX EMZ</p></div></div>`;
 document.querySelector('[data-poster]').addEventListener('click',()=>{
   const img=document.querySelector('#poster-image'); img.src=asset(`assets/poster-${p.id}.png`);img.alt=`โปสเตอร์ข้อมูล ${p.name}`;
   posterDialog.showModal();
 });
}
function syncRoute(){
 const p=products.find(p=>location.hash===`#product-${p.id}`);
 if(p){
   if(!productDialog.open)previousFocus=document.activeElement;
   renderDetail(p);
   if(!productDialog.open)productDialog.showModal();
   productDialog.scrollTop=0;document.body.classList.add('modal-open');
 }else if(productDialog.open){productDialog.close();}
}
function closeProduct(){
 if(posterDialog.open)posterDialog.close();
 if(location.hash.startsWith('#product-'))history.replaceState(null,'',location.pathname+location.search+'#products');
 productDialog.close();document.body.classList.remove('modal-open');
 if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
}
productDialog.querySelector('.close-button').addEventListener('click',closeProduct);
productDialog.addEventListener('cancel',e=>{e.preventDefault();closeProduct();});
productDialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
posterDialog.querySelector('.close-button').addEventListener('click',()=>posterDialog.close());
for(const dialog of [productDialog,posterDialog])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){if(dialog===productDialog)closeProduct();else dialog.close();}}});
const toggle=document.querySelector('.menu-toggle');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'ปิดเมนู':'เปิดเมนู');document.querySelector('#main-nav').classList.toggle('is-open',open);});
document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');document.querySelector('#main-nav').classList.remove('is-open');}));
window.addEventListener('hashchange',syncRoute);
syncRoute();
