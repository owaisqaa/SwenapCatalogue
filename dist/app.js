(() => {
  'use strict';
  const P=window.PRODUCTS, byCode=new Map(P.map(p=>[p.code,p]));
  const BRANDS=[
    {id:'hana',name:'Hana',ar:'الهنا',description:'Luncheon, pantry & preserves',logo:'hana.svg'},
    {id:'katakit',name:'Katakit',ar:'كتاكيت',description:'Biscuits & cream wafers',logo:'katakit.svg'},
    {id:'ahlam',name:'Alahlam',ar:'الأحلام',description:'Olives, oils & preserved foods',logo:'ahlam-transparent.svg'},
    {id:'cherry',name:'Cherry Brand',ar:'كرزة',description:'Ceylon tea & infusions',logo:'cherry.svg'},
    {id:'squeeze',name:'Squeeze',ar:'سكويز',description:'Instant fruit drinks',logo:'squeeze.svg'},
    {id:'levant',name:'Levant',ar:'ليفانت',description:'Roasted seeds',logo:'levant.svg'},
    {id:'alsuhoul',name:'Alsuhoul',ar:'السهول',description:'Red & green Aleppo thyme',logo:'alsuhoul.svg'},
    {id:'mamas-bake',name:'Mama’s Bake',ar:'ماماز بيك',description:'Sweet & savoury bakes',logo:null},
    {id:'waritex',name:'Waritex',ar:'واريتكس',description:'Kitchen & scrub sponges',logo:'waritex.svg'},
    {id:'lana',name:'Lana Tex',ar:'لانا',description:'Household tissues',logo:'lana.svg'}
  ];
  const brandMap=new Map(BRANDS.map(b=>[b.id,b]));
  // Calling codes: https://www.itu.int/oth/T0202.aspx?parent=T0202
  // European countries, including microstates and countries spanning Europe/Asia.
  // Vatican City uses Italy's active +39 numbering plan.
  const PHONE_COUNTRIES=[
    ['AL','Albania','355','0'],['AD','Andorra','376'],['AM','Armenia','374','0'],
    ['AT','Austria','43','0'],['AZ','Azerbaijan','994','0'],['BY','Belarus','375','8'],
    ['BE','Belgium','32','0'],['BA','Bosnia and Herzegovina','387','0'],['BG','Bulgaria','359','0'],
    ['HR','Croatia','385','0'],['CY','Cyprus','357'],['CZ','Czechia','420'],
    ['DK','Denmark','45'],['EE','Estonia','372'],['FI','Finland','358','0'],
    ['FR','France','33','0'],['GE','Georgia','995','0'],['DE','Germany','49','0'],
    ['GR','Greece','30'],['HU','Hungary','36','06'],['IS','Iceland','354'],
    ['IE','Ireland','353','0'],['IT','Italy','39'],['KZ','Kazakhstan','7','8'],
    ['XK','Kosovo','383','0'],['LV','Latvia','371'],['LI','Liechtenstein','423'],
    ['LT','Lithuania','370','0'],['LU','Luxembourg','352'],['MT','Malta','356'],
    ['MD','Moldova','373','0'],['MC','Monaco','377'],['ME','Montenegro','382','0'],
    ['NL','Netherlands','31','0'],['MK','North Macedonia','389','0'],['NO','Norway','47'],
    ['PL','Poland','48'],['PT','Portugal','351'],['RO','Romania','40','0'],
    ['RU','Russia','7','8'],['SM','San Marino','378'],['RS','Serbia','381','0'],
    ['SK','Slovakia','421','0'],['SI','Slovenia','386','0'],['ES','Spain','34'],
    ['SE','Sweden','46','0'],['CH','Switzerland','41','0'],['TR','Türkiye (Turkey)','90','0'],
    ['UA','Ukraine','380','0'],['GB','United Kingdom','44','0'],['VA','Vatican City','39']
  ].map(([id,name,dial,trunk=''])=>({id,name,dial,trunk}));
  const phoneCountries=new Map(PHONE_COUNTRIES.map(c=>[c.id,c]));
  const brandQueries=new Map();
  const latinDigits=s=>String(s).replace(/[٠-٩]/g,d=>String(d.charCodeAt(0)-1632)).replace(/[۰-۹]/g,d=>String(d.charCodeAt(0)-1776));
  const searchText=s=>latinDigits(s).normalize('NFKD').replace(/\p{M}/gu,'').replace(/ـ/g,'').replace(/ى/g,'ي').toLowerCase().trim();
  const productSearch=new Map(P.map(p=>[p.code,searchText([p.code,p.name,p.ar,p.pack,p.caseLabel].filter(Boolean).join(' '))]));
  const WA_NUMBER='31653776637', KEY='swenap-basket-v1';
  const money=c=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(c/100);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let basket={},details={shop:'',contact:'',phoneCountry:'NL',phone:'',address:'',notes:''},ref='';
  try {const saved=JSON.parse(localStorage.getItem(KEY)||'{}');for(const [code,n] of Object.entries(saved.basket||{})){if(byCode.has(code)&&Number.isInteger(n)&&n>0&&n<=999)basket[code]=n;}for(const k of Object.keys(details)){if(typeof saved.details?.[k]==='string')details[k]=saved.details[k].slice(0,400);}if(typeof saved.ref==='string'&&/^SW-[A-Z0-9-]{1,40}$/.test(saved.ref))ref=saved.ref;}catch{}
  if(!phoneCountries.has(details.phoneCountry))details.phoneCountry='NL';
  const root=document.getElementById('app');
  function save(){try{localStorage.setItem(KEY,JSON.stringify({basket,details,ref}));}catch{}}
  function count(){return Object.values(basket).reduce((s,n)=>s+n,0)}
  function total(){return Object.entries(basket).reduce((s,[c,n])=>s+(byCode.get(c).priceCents||0)*n,0)}
  function updateCount(){document.getElementById('basket-count').textContent=count();}
  let toastTimer;function toast(text){const el=document.getElementById('status');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2800);}
  function setQuantity(code,n){if(!byCode.has(code)||!Number.isInteger(n)||n<0||n>999)throw Error('Quantity must be a whole number from 0 to 999.');if(n===0)delete basket[code];else basket[code]=n;ref='';save();updateCount();}
  const logo=b=>b.logo?`<img src="/assets/${b.logo}" alt="${esc(b.name)}" loading="lazy">`:`<span class="brand-wordmark">${esc(b.name)}</span>`;
  function home(){document.title='Swenap | Wholesale Product Catalogue';root.innerHTML=`<section class="hero"><div><p class="eyebrow">Swenap B.V. · Food trade</p><h1>Your brands.<br><span>All in one place.</span></h1><p class="ar" lang="ar">منتجات سويناب بين يديك</p><p>Explore our wholesale catalogue, choose your quantities and send your order request on WhatsApp.</p></div><div class="hero-products" aria-label="A selection of Swenap products"><img src="/assets/product-71001.svg" alt="Alahlam olive oil"><img src="/assets/product-1101.svg" alt="Hana luncheon meat"><img src="/assets/product-41001.svg" alt="Katakit biscuits"></div></section><section id="brands"><div class="section-title"><h2>Distributed Brands <span class="ar" lang="ar">· العلامات التي نوزّعها</span></h2><p>${P.length} products · ${BRANDS.length} brands</p></div><div class="brand-grid">${BRANDS.map(b=>`<a class="brand-card" href="/brands/${b.id}/"><div class="brand-image">${logo(b)}</div><div class="brand-info"><div class="brand-heading"><h3>${b.name}</h3>${b.id!=='mamas-bake'?'<span class="exclusive-tag">Exclusive</span>':''}</div><p>${b.description}</p><div class="brand-bottom"><span>${P.filter(p=>p.brand===b.id).length} products</span><span aria-hidden="true">↗</span></div></div></a>`).join('')}</div></section><div class="how-to"><span><b>01</b> Choose a brand</span><span><b>02</b> Add your quantities</span><span><b>03</b> Request your order on WhatsApp</span></div>`;}
  function productCard(p){const b=brandMap.get(p.brand),quantity=basket[p.code]||0;return `<article class="product-card" data-product-code="${p.code}"><div class="product-image ${p.image?'':'fallback'}">${p.image?`<img src="${p.image}" alt="${esc(p.name+' '+p.pack)}" loading="lazy" width="200" height="160">`:logo(b)+'<span class="photo-note">Product photo unavailable</span>'}</div><div class="product-content"><div class="product-code">ITEM ${p.code}</div><h2>${esc(p.name)}</h2>${p.ar?`<p class="ar" lang="ar">${esc(p.ar)}</p>`:''}<p class="pack">${esc(p.pack)}${p.caseLabel?`<br><strong>${esc(p.caseLabel)}</strong>`:''}</p><div class="price"><strong>${p.priceCents===null?'Price on request':money(p.priceCents)}</strong><small>/ ${esc(p.sellingUnit)}</small></div><form class="product-action" data-product="${p.code}"><input type="number" name="quantity" aria-label="${esc(p.name)} quantity to add" value="1" min="1" max="999" step="1" inputmode="numeric" required><button class="add-button" type="submit">Add to basket</button></form><div class="added" data-added="${p.code}">${quantity?quantity+' in basket':''}</div></div></article>`}
  function filterBrandProducts(id,query){
    brandQueries.set(id,query);
    const terms=searchText(query).split(/\s+/).filter(Boolean);
    let shown=0;
    const cards=document.querySelectorAll('#brand-products .product-card');
    cards.forEach(card=>{const match=terms.every(term=>productSearch.get(card.dataset.productCode).includes(term));card.hidden=!match;if(match)shown++;});
    document.getElementById('search-results').textContent=terms.length?`${shown} of ${cards.length} products`:`${cards.length} products`;
    document.getElementById('no-products').hidden=shown>0;
    document.getElementById('clear-search').hidden=!query;
  }
  function brandPage(id){
    const b=brandMap.get(id);if(!b)return missing();
    const products=P.filter(p=>p.brand===id),query=brandQueries.get(id)||'';
    document.title=b.name+' | Swenap';
    root.innerHTML=`<div class="breadcrumb"><a href="/#brands">All brands</a><span>/</span><span>${b.name}</span></div><header class="brand-header"><div class="logo">${logo(b)}</div><div><h1>${b.name}</h1><p>${b.description} <span class="ar" lang="ar">· ${b.ar}</span></p></div></header><p class="catalogue-note">Prices are per carton unless a different selling pack is shown. Select the number of cartons or selling packs.</p><form class="brand-search" id="brand-search-form" role="search"><label for="brand-search">Search ${b.name} products</label><div class="search-row"><input type="search" id="brand-search" data-brand="${id}" placeholder="Product name or code · اسم المنتج أو الرمز" value="${esc(query)}" autocomplete="off" maxlength="120" aria-controls="brand-products" aria-describedby="search-results"><button type="button" class="secondary" id="clear-search" ${query?'':'hidden'}>Clear</button></div><p id="search-results" role="status" aria-live="polite" aria-atomic="true"></p></form><div class="products-grid" id="brand-products">${products.map(productCard).join('')}</div><p class="search-empty" id="no-products" hidden>No products found. Try another name or product code.</p><a href="/#brands" class="back-link">Back to all brands</a>`;
    filterBrandProducts(id,query);
  }
  function phoneNumber(){
    const country=phoneCountries.get(details.phoneCountry);
    const entered=latinDigits(details.phone).trim();
    if(!entered)return {value:'',error:''};
    if(!country)return {value:'',error:'Choose a country from the list.'};
    if(!/^\+?[\d\s().-]+$/.test(entered))return {value:'',error:'Enter a phone number using digits, spaces, brackets or hyphens.'};
    let number=entered.replace(/[\s().-]/g,'');
    if(number.startsWith('+')||number.startsWith('00')){
      number=number.replace(/^(\+|00)/,'');
      if(!number.startsWith(country.dial))return {value:'',error:'Choose the country matching this phone number’s calling code.'};
      number=number.slice(country.dial.length);
    }
    // Remove national access prefixes; preserve significant zeros in Italy,
    // Vatican City and San Marino. Guard 8-prefix plans by national length.
    const trunk=country.trunk;
    const stripEight=country.id==='BY'?number.length===10:number.length===11;
    if(trunk&&number.startsWith(trunk)&&(trunk!=='8'||stripEight))number=number.slice(trunk.length);
    if(!/^\d{5,}$/.test(number)||country.dial.length+number.length>15)return {value:'',error:'Enter a complete phone number (up to 15 digits including the country code).'};
    return {value:'+'+country.dial+' '+number,error:''};
  }
  function validatePhone(){
    const field=document.getElementById('customer-phone');if(!field)return;
    const {error}=phoneNumber();field.setCustomValidity(error);
  }
  function phoneFields(){return `<fieldset class="phone-fields"><legend>Phone number <span>(optional)</span></legend><div class="phone-row"><label for="phone-country">Country code<select id="phone-country" name="phoneCountry" autocomplete="tel-country-code">${PHONE_COUNTRIES.map(c=>`<option value="${c.id}" ${c.id===details.phoneCountry?'selected':''}>${esc(c.name)} (+${c.dial})</option>`).join('')}</select></label><label for="customer-phone">Number<input type="tel" id="customer-phone" name="phone" autocomplete="tel-national" inputmode="tel" maxlength="40" placeholder="Your phone number" value="${esc(details.phone)}" aria-describedby="phone-help"></label></div><p id="phone-help" class="order-note">Choose your country, then enter your phone number.</p></fieldset>`;}

  function basketPage(){document.title='Your basket | Swenap';if(!count()){root.innerHTML='<section class="empty"><p class="eyebrow">Your Swenap order</p><h1>Your basket is empty</h1><p>Choose a brand and add products to begin.</p><a class="primary" href="/#brands">Browse brands</a></section>';return;}root.innerHTML=`<div class="breadcrumb"><a href="/#brands">All brands</a><span>/</span><span>Basket</span></div><h1 class="basket-title">Your order request</h1><p class="basket-lead">Review your quantities, add your shop details, then continue to WhatsApp.</p><div class="basket-layout"><section><div class="basket-list">${Object.entries(basket).map(([code,n])=>{const p=byCode.get(code),b=brandMap.get(p.brand);return `<article class="basket-item">${p.image?`<img src="${p.image}" alt="${esc(p.name)}">`:b.logo?`<img src="/assets/${b.logo}" alt="${esc(b.name)}">`:'<div></div>'}<div><h2>${b.name} · ${esc(p.name)}</h2><p class="pack">${esc(p.pack)}${p.caseLabel?' · '+esc(p.caseLabel):''}</p><span class="code">${code} · ${p.priceCents===null?'Price on request':money(p.priceCents)} / ${p.sellingUnit}</span><div class="quantity-control"><button data-step="-1" data-code="${code}" aria-label="Reduce ${esc(p.name)} quantity">−</button><input type="number" data-quantity="${code}" min="1" max="999" step="1" value="${n}" inputmode="numeric" aria-label="${esc(p.name)} quantity"><button data-step="1" data-code="${code}" aria-label="Increase ${esc(p.name)} quantity">+</button><button class="remove" data-remove="${code}">Remove</button></div></div><div class="line-total">${p.priceCents===null?'To confirm':money(p.priceCents*n)}</div></article>`}).join('')}</div><a href="/#brands" class="back-link">Continue browsing</a><p class="order-note">Your basket and shop details are saved on this device.</p></section><section class="order-panel"><h2>Shop details</h2><form id="order-form"><label>Shop name<input name="shop" autocomplete="organization" maxlength="120" value="${esc(details.shop)}" required></label><label>Contact name <span>(optional)</span><input name="contact" autocomplete="name" maxlength="100" value="${esc(details.contact)}"></label>${phoneFields()}<label>Delivery address & city<textarea name="address" autocomplete="street-address" rows="2" maxlength="300" required>${esc(details.address)}</textarea></label><label>Notes <span>(optional)</span><textarea name="notes" rows="2" maxlength="400">${esc(details.notes)}</textarea></label><div class="total-row"><span>Product subtotal</span><span>${money(total())}</span></div><p class="order-note">VAT treatment, delivery charges and availability will be confirmed by Swenap. This is an order request; it is accepted only after Swenap confirms it.</p><button class="primary whatsapp-button" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-9 9 9 9 0 0 1-4.2-1L3 21l1.5-4.8A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-2 3 2 7 5 9 2 1 4-1 3-2l-2-1-1 1c-2-1-3-2-4-4l1-1-1-2Z"/></svg>Continue to WhatsApp</button><p class="order-note">A message opens addressed to Swenap at +31 6 53776637. Review it and press Send in WhatsApp.</p><button type="button" class="secondary copy-button" id="copy-order">Copy order message</button><p id="form-status" class="form-error" role="status"></p><details class="message-preview"><summary>Preview order message</summary><textarea id="message-preview" readonly aria-label="Order message"></textarea></details></form></section></div>`;validatePhone();updateMessage();}
  function getReference(){if(!ref){ref='SW-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+Math.random().toString(36).slice(2,7).toUpperCase();save();}return ref;}
  function message(){
    const phone=phoneNumber().value;
    const customer=[`Shop: ${details.shop||'—'}`,details.contact?`Contact: ${details.contact}`:'',phone?`Phone: ${phone}`:'',`Address: ${details.address||'—'}`].filter(Boolean).join('\n');
    const items=Object.entries(basket).map(([code,n])=>{const p=byCode.get(code);return `${code} | ${brandMap.get(p.brand).name} ${p.name}\n${p.pack}${p.caseLabel?' · '+p.caseLabel:''}\n${n} ${p.sellingUnit}${n>1?'s':''} × ${p.priceCents===null?'price to confirm':money(p.priceCents)} = ${p.priceCents===null?'to confirm':money(p.priceCents*n)}`;}).join('\n\n');
    return [`SWENAP ORDER REQUEST / طلب شراء\n${getReference()}`,customer,items,`Product subtotal: ${money(total())}`,details.notes?`Notes: ${details.notes}`:'','Please confirm availability, VAT, delivery charges and the final total.\nThis is an order request, subject to Swenap confirmation.'].filter(Boolean).join('\n\n');
  }
  function updateMessage(){const box=document.getElementById('message-preview');if(box)box.value=message();}
  function missing(){document.title='Page not found | Swenap';root.innerHTML='<section class="empty"><h1>Page not found</h1><a href="/#brands" class="primary">Browse brands</a></section>';}
  function updateWholesaleNotice(isHome){
    const notice=document.querySelector('.wholesale-notice');
    if(isHome){notice?.remove();return;}
    if(!notice)root.insertAdjacentHTML('beforebegin','<aside class="wholesale-notice" aria-label="Wholesale pricing"><p><strong>All prices shown are wholesale prices, not retail prices.</strong><span class="ar" lang="ar">الأسعار المعروضة للجملة وليست للتجزئة.</span></p></aside>');
  }
  function render(){const path=location.pathname.replace(/\/+$/,'');const isHome=!path||path==='/index.html';updateWholesaleNotice(isHome);if(isHome)home();else if(path==='/basket')basketPage();else if(/^\/brands\/[^/]+$/.test(path))brandPage(path.split('/')[2]);else missing();updateCount();}
  document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.origin===location.origin&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();history.pushState({},'',a.href);render();if(a.hash)document.querySelector(a.hash)?.scrollIntoView();else window.scrollTo(0,0);return;}const b=e.target.closest('button');if(!b)return;if(b.id==='clear-search'){const field=document.getElementById('brand-search');field.value='';filterBrandProducts(field.dataset.brand,'');field.focus();return;}const c=b.dataset.code;if(c&&b.dataset.step){try{setQuantity(c,(basket[c]||0)+Number(b.dataset.step));basketPage();}catch(err){toast(err.message)}}if(b.dataset.remove){setQuantity(b.dataset.remove,0);basketPage();}if(b.id==='copy-order'){const form=document.getElementById('order-form');validatePhone();if(!form.reportValidity())return;copyMessage();}});
  async function copyMessage(){const status=document.getElementById('form-status');try{await navigator.clipboard.writeText(message());status.textContent='Order copied. Paste it into your Swenap WhatsApp chat.';toast('Order message copied');}catch{const preview=document.getElementById('message-preview');preview.closest('details').open=true;preview.focus();preview.select();status.textContent='Select and copy the message below, then paste it into WhatsApp.';}}
  document.addEventListener('submit',e=>{const f=e.target;if(f.id==='brand-search-form'){e.preventDefault();return;}if(f.matches('.product-action')){e.preventDefault();const code=f.dataset.product,n=Number(new FormData(f).get('quantity'));if(!Number.isInteger(n)||n<1||n>999)return;try{setQuantity(code,(basket[code]||0)+n);document.querySelector(`[data-added="${code}"]`).textContent=basket[code]+' in basket';toast(n+' added to your basket');}catch(err){toast(err.message)}}else if(f.id==='order-form'){e.preventDefault();validatePhone();if(!f.reportValidity())return;const text=message(),url='https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(text);if(url.length>7000){const status=document.getElementById('form-status');status.innerHTML='This is a long order. Copy the order message, then <a href="https://wa.me/'+WA_NUMBER+'" target="_blank" rel="noopener" style="text-decoration:underline">open Swenap in WhatsApp</a> and paste it.';document.getElementById('message-preview').closest('details').open=true;return;}window.open(url,'_blank','noopener,noreferrer');document.getElementById('form-status').textContent='Review the message and press Send in WhatsApp. If WhatsApp did not open, use Copy order message.';}});
  document.addEventListener('change',e=>{if(e.target.closest('#order-form')){storeDetail(e.target);return;}const code=e.target.dataset.quantity;if(!code)return;const n=Number(e.target.value);if(!Number.isInteger(n)||n<1||n>999){e.target.value=basket[code];toast('Enter a whole quantity from 1 to 999.');return;}setQuantity(code,n);basketPage();});
  function storeDetail(field){
    if(!Object.hasOwn(details,field.name))return;
    if(field.name==='phoneCountry'&&!phoneCountries.has(field.value))return;
    details[field.name]=field.value;save();validatePhone();updateMessage();
  }
  document.addEventListener('input',e=>{if(e.target.id==='brand-search'){filterBrandProducts(e.target.dataset.brand,e.target.value);return;}if(e.target.closest('#order-form'))storeDetail(e.target);});
  window.addEventListener('popstate',render);render();
  if(document.modelContext?.registerTool){const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});try{Promise.resolve(document.modelContext.registerTool({name:'stage_swenap_basket',title:'Set product quantities in the Swenap basket',description:'Stage quantities by product code in the local basket. Does not send or place an order.',inputSchema:{type:'object',properties:{items:{type:'array',items:{type:'object',properties:{code:{type:'string'},quantity:{type:'integer',minimum:0,maximum:999}},required:['code','quantity'],additionalProperties:false}}},required:['items'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||!Array.isArray(input.items)||input.items.some(i=>!byCode.has(i.code)||!Number.isInteger(i.quantity)||i.quantity<0||i.quantity>999))throw Error('Invalid product code or quantity.');input.items.forEach(i=>setQuantity(i.code,i.quantity));render();return {basket,subtotalCents:total(),status:'staged; not sent'};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}}
})();
