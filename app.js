(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const categories=[['all','همه','✨'],['text','متن','📝'],['crypto','رمزنگاری','🔐'],['convert','تبدیل‌ها','🔢'],['web','Web','🌐'],['data','داده','📦'],['math','محاسبات','🧮'],['dev','Developer','💻']];
const tools=[
{id:'json-formatter',title:'JSON Formatter',desc:'فرمت‌بندی، فشرده‌سازی و اعتبارسنجی JSON',icon:'🗂️',cat:'data'},
{id:'base64',title:'Base64 Encoder/Decoder',desc:'تبدیل متن به Base64 و برعکس',icon:'🔤',cat:'crypto'},
{id:'url-encoder',title:'URL Encoder/Decoder',desc:'انکود و دیکود کردن آدرس‌های اینترنتی',icon:'🔗',cat:'web'},
{id:'hash-generator',title:'Hash Generator',desc:'تولید هش SHA-256، SHA-384 و SHA-512',icon:'🔒',cat:'crypto'},
{id:'uuid-generator',title:'UUID Generator',desc:'تولید شناسه‌های یکتای تصادفی UUID',icon:'🆔',cat:'dev'},
{id:'timestamp-converter',title:'Timestamp Converter',desc:'تبدیل Unix Timestamp به تاریخ خوانا و برعکس',icon:'⏱️',cat:'convert'},
{id:'color-converter',title:'Color Converter',desc:'تبدیل رنگ بین HEX، RGB و HSL',icon:'🎨',cat:'convert'},
{id:'case-converter',title:'Case Converter',desc:'تبدیل حالت نوشتار متن انگلیسی',icon:'🔡',cat:'text'},
{id:'text-counter',title:'Text Counter',desc:'شمارش کاراکتر، کلمه و خط متن',icon:'📊',cat:'text'},
{id:'regex-tester',title:'Regex Tester',desc:'تست عبارات باقاعده روی متن دلخواه',icon:'🧩',cat:'dev'},
{id:'jwt-decoder',title:'JWT Decoder',desc:'رمزگشایی محلی توکن‌های JWT',icon:'🪪',cat:'dev'},
{id:'html-encoder',title:'HTML Encoder/Decoder',desc:'انکود و دیکود موجودیت‌های HTML',icon:'🏷️',cat:'web'},
{id:'html-formatter',title:'HTML Formatter',desc:'فرمت‌بندی و مرتب‌سازی کد HTML',icon:'📐',cat:'web'},
{id:'css-formatter',title:'CSS Formatter',desc:'فرمت‌بندی و مرتب‌سازی کد CSS',icon:'🎯',cat:'web'},
{id:'js-formatter',title:'JavaScript Formatter',desc:'فرمت‌بندی ساده و محلی کد جاوااسکریپت',icon:'⚙️',cat:'dev'},
{id:'markdown-preview',title:'Markdown Preview',desc:'نوشتن Markdown و مشاهده پیش‌نمایش',icon:'📄',cat:'text'},
{id:'lorem-ipsum',title:'Lorem Ipsum Generator',desc:'تولید متن آزمایشی برای طراحی رابط کاربری',icon:'📃',cat:'text'},
{id:'password-generator',title:'Password Generator',desc:'تولید رمزهای عبور تصادفی و امن',icon:'🔑',cat:'crypto'},
{id:'number-base-converter',title:'Number Base Converter',desc:'تبدیل بین مبناهای ۲، ۸، ۱۰ و ۱۶',icon:'🔢',cat:'math'},
{id:'epoch-calculator',title:'Epoch / Date Calculator',desc:'محاسبه اختلاف زمانی بین دو تاریخ',icon:'📅',cat:'math'}];
let activeCat='all', deferredPrompt=null;
let favorites=JSON.parse(localStorage.getItem('devbox:favorites')||'[]');
const toast=(m)=>{const e=$('#toast');e.textContent=m;e.classList.add('show');clearTimeout(window.__tt);window.__tt=setTimeout(()=>e.classList.remove('show'),1800)};
const escapeHtml=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const card=t=>`<article class="tool-card" data-tool="${t.id}"><button class="fav-btn ${favorites.includes(t.id)?'active':''}" data-fav="${t.id}" title="علاقه‌مندی">${favorites.includes(t.id)?'⭐':'☆'}</button><div class="tool-icon">${t.icon}</div><h3>${t.title}</h3><p>${t.desc}</p></article>`;
function renderChips(){ $('#chips').innerHTML=categories.map(([id,l,i])=>`<button class="chip ${activeCat===id?'active':''}" data-cat="${id}">${i} ${l}</button>`).join(''); }
function filteredTools(){const q=$('#searchInput').value.trim().toLowerCase();return tools.filter(t=>(activeCat==='all'||t.cat===activeCat)&&(!q||`${t.title} ${t.desc}`.toLowerCase().includes(q)))}
function bindCards(root){$$('[data-tool]',root).forEach(el=>el.onclick=e=>{if(e.target.closest('[data-fav]'))return;openTool(el.dataset.tool)});$$('[data-fav]',root).forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(b.dataset.fav)});}
function renderTools(){const list=filteredTools();$('#toolsGrid').innerHTML=list.length?list.map(card).join(''):'<div class="empty">ابزاری پیدا نشد.</div>';bindCards($('#toolsGrid'));}
function renderFavorites(){const list=tools.filter(t=>favorites.includes(t.id));$('#favoritesGrid').innerHTML=list.length?list.map(card).join(''):'<div class="empty">هنوز ابزاری به علاقه‌مندی‌ها اضافه نشده است.</div>';bindCards($('#favoritesGrid'));}
function toggleFav(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem('devbox:favorites',JSON.stringify(favorites));renderTools();renderFavorites();toast('علاقه‌مندی‌ها به‌روزرسانی شد');}
function showView(name){['home','favorites','settings','tool'].forEach(v=>$(`#${v}View`).classList.toggle('hidden',v!==name));$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.nav===name));$('#sidebar').classList.remove('open');if(name==='favorites')renderFavorites();}
function setTheme(dark){document.body.classList.toggle('dark',dark);localStorage.setItem('devbox:theme',dark?'dark':'light');$('#themeBtn').textContent=dark?'☀️':'🌙';}
setTheme((localStorage.getItem('devbox:theme')||'light')==='dark');
function toolShell(t,body){return `<div class="tool-panel"><div class="tool-title"><div class="tool-icon">${t.icon}</div><div><h2>${t.title}</h2><p>${t.desc}</p></div></div>${body}</div>`}
const area=(id,label,ph='')=>`<div class="field full"><label>${label}</label><textarea class="textarea" id="${id}" placeholder="${escapeHtml(ph)}"></textarea></div>`;
const input=(id,label,type='text',val='')=>`<div class="field"><label>${label}</label><input class="input" id="${id}" type="${type}" value="${escapeHtml(val)}"></div>`;
const output=(id='out')=>`<div class="output" id="${id}"></div>`;
const buttons=(arr)=>`<div class="actions">${arr.map(([id,l,c=''])=>`<button class="btn ${c}" id="${id}">${l}</button>`).join('')}</div>`;
const copyText=async text=>{try{await navigator.clipboard.writeText(text);toast('کپی شد')}catch{toast('کپی در این مرورگر مجاز نیست')}};
function formatHtml(src){src=src.replace(/>\s*</g,'><').trim();if(!src)return'';let out='',indent=0;const voids=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));for(const token of src.split(/(<[^>]+>)/g).filter(x=>x.trim())){if(token.startsWith('</')){indent=Math.max(0,indent-1);out+='  '.repeat(indent)+token+'\n'}else if(token.startsWith('<')){out+='  '.repeat(indent)+token+'\n';const m=token.match(/^<([\w-]+)/);if(m&&!voids.has(m[1].toLowerCase())&&!token.endsWith('/>')&&!token.startsWith('<!'))indent++}else out+='  '.repeat(indent)+token.trim()+'\n'}return out.trim()}
function formatCss(s){return s.trim().replace(/\s*{\s*/g,' {\n  ').replace(/;\s*/g,';\n  ').replace(/\s*}\s*/g,'\n}\n').replace(/\n\s*\n/g,'\n').trim()}
function formatJs(s){return s.trim().replace(/\s*{\s*/g,' {\n  ').replace(/;\s*/g,';\n').replace(/\s*}\s*/g,'\n}\n').trim()}
function markdown(md){let x=escapeHtml(md);x=x.replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/^[-*] (.*)$/gm,'<li>$1</li>').replace(/\n/g,'<br>');return x}
function hexToRgb(hex){hex=hex.replace('#','').trim();if(hex.length===3)hex=hex.split('').map(x=>x+x).join('');if(!/^[0-9a-f]{6}$/i.test(hex))throw Error('HEX نامعتبر است');const n=parseInt(hex,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0,s=0,l=(mx+mn)/2;if(d){s=d/(1-Math.abs(2*l-1));if(mx===r)h=60*(((g-b)/d)%6);else if(mx===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4);if(h<0)h+=360}return[Math.round(h),Math.round(s*100),Math.round(l*100)]}
async function hashText(text,algo){if(!crypto.subtle)throw Error('برای Hash سایت را از HTTPS یا localhost اجرا کنید');const buf=await crypto.subtle.digest(algo,new TextEncoder().encode(text));return[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function b64enc(s){return btoa(unescape(encodeURIComponent(s)))}function b64dec(s){return decodeURIComponent(escape(atob(s)))}
function openTool(id){const t=tools.find(x=>x.id===id);if(!t)return;showView('tool');let body='';
switch(id){
case'json-formatter': body=`<div class="form-grid">${area('src','JSON ورودی','{"name":"DevBox","offline":true}')}</div>${buttons([['do1','فرمت‌بندی'],['do2','فشرده‌سازی','secondary'],['copy','کپی','secondary']])}${output()}`;break;
case'base64': body=`<div class="form-grid">${area('src','متن / Base64')}</div>${buttons([['do1','Encode'],['do2','Decode','secondary'],['copy','کپی','secondary']])}${output()}`;break;
case'url-encoder': body=`<div class="form-grid">${area('src','متن یا URL')}</div>${buttons([['do1','Encode'],['do2','Decode','secondary'],['copy','کپی','secondary']])}${output()}`;break;
case'hash-generator': body=`<div class="form-grid">${area('src','متن') }<div class="field"><label>الگوریتم</label><select class="select" id="algo"><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></div></div>${buttons([['do1','تولید Hash'],['copy','کپی','secondary']])}${output()}`;break;
case'uuid-generator': body=`${buttons([['do1','تولید UUID'],['copy','کپی','secondary']])}${output()}`;break;
case'timestamp-converter': body=`<div class="form-grid">${input('src','Unix Timestamp (ثانیه)','number',String(Math.floor(Date.now()/1000)))}${input('date','تاریخ و زمان','datetime-local')}</div>${buttons([['do1','Timestamp → Date'],['do2','Date → Timestamp','secondary']])}${output()}`;break;
case'color-converter': body=`<div class="form-grid">${input('src','HEX','text','#4f46e5')}</div>${buttons([['do1','تبدیل رنگ']])}${output()}`;break;
case'case-converter': body=`<div class="form-grid">${area('src','متن انگلیسی','hello world example')}</div>${buttons([['upper','UPPER'],['lower','lower','secondary'],['camel','camelCase','secondary'],['snake','snake_case','secondary'],['kebab','kebab-case','secondary']])}${output()}`;break;
case'text-counter': body=`<div class="form-grid">${area('src','متن')}</div><div class="stats"><div class="stat"><b id="chars">0</b><span>کاراکتر</span></div><div class="stat"><b id="words">0</b><span>کلمه</span></div><div class="stat"><b id="lines">0</b><span>خط</span></div><div class="stat"><b id="bytes">0</b><span>بایت</span></div></div>`;break;
case'regex-tester': body=`<div class="form-grid">${input('pattern','Pattern','text','\\b\\w+@\\w+\\.\\w+\\b')}${input('flags','Flags','text','gi')}${area('src','متن تست')}</div>${buttons([['do1','تست Regex']])}${output()}`;break;
case'jwt-decoder': body=`<div class="form-grid">${area('src','JWT Token')}</div>${buttons([['do1','Decode']])}${output()}`;break;
case'html-encoder': body=`<div class="form-grid">${area('src','HTML / Text')}</div>${buttons([['do1','Encode'],['do2','Decode','secondary'],['copy','کپی','secondary']])}${output()}`;break;
case'html-formatter': body=`<div class="form-grid">${area('src','HTML')}</div>${buttons([['do1','فرمت‌بندی'],['copy','کپی','secondary']])}${output()}`;break;
case'css-formatter': body=`<div class="form-grid">${area('src','CSS')}</div>${buttons([['do1','فرمت‌بندی'],['copy','کپی','secondary']])}${output()}`;break;
case'js-formatter': body=`<div class="form-grid">${area('src','JavaScript')}</div>${buttons([['do1','فرمت‌بندی'],['copy','کپی','secondary']])}${output()}`;break;
case'markdown-preview': body=`<div class="form-grid">${area('src','Markdown','# عنوان\n\n**متن پررنگ**')}</div><div class="output preview" id="out"></div>`;break;
case'lorem-ipsum': body=`<div class="form-grid">${input('count','تعداد پاراگراف','number','3')}</div>${buttons([['do1','تولید متن'],['copy','کپی','secondary']])}${output()}`;break;
case'password-generator': body=`<div class="form-grid">${input('len','طول رمز','number','16')}<div class="field"><label>گزینه‌ها</label><select class="select" id="mode"><option value="all">حروف + عدد + نماد</option><option value="alnum">حروف + عدد</option><option value="num">فقط عدد</option></select></div></div>${buttons([['do1','تولید رمز'],['copy','کپی','secondary']])}${output()}`;break;
case'number-base-converter': body=`<div class="form-grid">${input('src','عدد','text','255')}<div class="field"><label>مبنای ورودی</label><select class="select" id="base"><option>10</option><option>2</option><option>8</option><option>16</option></select></div></div>${buttons([['do1','تبدیل']])}${output()}`;break;
case'epoch-calculator': body=`<div class="form-grid">${input('d1','تاریخ اول','date')}${input('d2','تاریخ دوم','date')}</div>${buttons([['do1','محاسبه اختلاف']])}${output()}`;break;
}
$('#toolContent').innerHTML=toolShell(t,body); bindTool(id); window.scrollTo({top:0});}
function bindTool(id){const out=$('#out');const src=$('#src');const set=v=>{if(out)out.textContent=v};const copy=()=>copyText(out?.textContent||'');if($('#copy'))$('#copy').onclick=copy;
try{switch(id){
case'json-formatter':$('#do1').onclick=()=>{try{set(JSON.stringify(JSON.parse(src.value),null,2))}catch(e){set('خطا: '+e.message)}};$('#do2').onclick=()=>{try{set(JSON.stringify(JSON.parse(src.value)))}catch(e){set('خطا: '+e.message)}};break;
case'base64':$('#do1').onclick=()=>{try{set(b64enc(src.value))}catch(e){set('خطا: '+e.message)}};$('#do2').onclick=()=>{try{set(b64dec(src.value))}catch(e){set('خطا: Base64 نامعتبر')};};break;
case'url-encoder':$('#do1').onclick=()=>set(encodeURIComponent(src.value));$('#do2').onclick=()=>{try{set(decodeURIComponent(src.value))}catch{set('خطا: مقدار URL نامعتبر')}};break;
case'hash-generator':$('#do1').onclick=async()=>{try{set(await hashText(src.value,$('#algo').value))}catch(e){set('خطا: '+e.message)}};break;
case'uuid-generator':$('#do1').onclick=()=>set(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)}));$('#do1').click();break;
case'timestamp-converter':$('#do1').onclick=()=>{const n=Number($('#src').value);set(Number.isFinite(n)?new Date(n*1000).toLocaleString('fa-IR'):'مقدار نامعتبر')};$('#do2').onclick=()=>{const d=new Date($('#date').value);set(isNaN(d)?'تاریخ نامعتبر':String(Math.floor(d.getTime()/1000)))};break;
case'color-converter':$('#do1').onclick=()=>{try{const [r,g,b]=hexToRgb(src.value),[h,s,l]=rgbToHsl(r,g,b);set(`RGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${h}, ${s}%, ${l}%)`)}catch(e){set('خطا: '+e.message)}};break;
case'case-converter':{const words=()=>src.value.trim().split(/[^A-Za-z0-9]+/).filter(Boolean).map(x=>x.toLowerCase());$('#upper').onclick=()=>set(src.value.toUpperCase());$('#lower').onclick=()=>set(src.value.toLowerCase());$('#camel').onclick=()=>{const w=words();set(w.map((x,i)=>i?x[0].toUpperCase()+x.slice(1):x).join(''))};$('#snake').onclick=()=>set(words().join('_'));$('#kebab').onclick=()=>set(words().join('-'));break}
case'text-counter':{const fn=()=>{const v=src.value;$('#chars').textContent=v.length;$('#words').textContent=v.trim()?v.trim().split(/\s+/).length:0;$('#lines').textContent=v? v.split(/\r?\n/).length:0;$('#bytes').textContent=new TextEncoder().encode(v).length};src.oninput=fn;fn();break}
case'regex-tester':$('#do1').onclick=()=>{try{const r=new RegExp($('#pattern').value,$('#flags').value),m=[...src.value.matchAll(r)];set(m.length?m.map((x,i)=>`${i+1}. ${x[0]} @ ${x.index}`).join('\n'):'هیچ تطابقی پیدا نشد.')}catch(e){set('خطا: '+e.message)}};break;
case'jwt-decoder':$('#do1').onclick=()=>{try{const p=src.value.trim().split('.');if(p.length<2)throw Error('توکن JWT نامعتبر است');const dec=x=>JSON.parse(b64dec(x.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(x.length/4)*4,'=')));set(JSON.stringify({header:dec(p[0]),payload:dec(p[1])},null,2))}catch(e){set('خطا: '+e.message)}};break;
case'html-encoder':$('#do1').onclick=()=>set(escapeHtml(src.value));$('#do2').onclick=()=>{const ta=document.createElement('textarea');ta.innerHTML=src.value;set(ta.value)};break;
case'html-formatter':$('#do1').onclick=()=>set(formatHtml(src.value));break;
case'css-formatter':$('#do1').onclick=()=>set(formatCss(src.value));break;
case'js-formatter':$('#do1').onclick=()=>set(formatJs(src.value));break;
case'markdown-preview':{const fn=()=>{out.innerHTML=markdown(src.value)};src.oninput=fn;fn();break}
case'lorem-ipsum':{const txt='لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.';$('#do1').onclick=()=>{const n=Math.max(1,Math.min(20,Number($('#count').value)||1));set(Array.from({length:n},()=>txt).join('\n\n'))};break}
case'password-generator':$('#do1').onclick=()=>{const n=Math.max(4,Math.min(128,Number($('#len').value)||16)),m=$('#mode').value;let c=m==='num'?'0123456789':m==='alnum'?'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789':'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+';const a=new Uint32Array(n);crypto.getRandomValues(a);set([...a].map(x=>c[x%c.length]).join(''))};$('#do1').click();break;
case'number-base-converter':$('#do1').onclick=()=>{const b=Number($('#base').value),n=parseInt(src.value,b);set(Number.isNaN(n)?'عدد نامعتبر':`Binary: ${n.toString(2)}\nOctal: ${n.toString(8)}\nDecimal: ${n}\nHex: ${n.toString(16).toUpperCase()}`)};break;
case'epoch-calculator':$('#do1').onclick=()=>{const a=new Date($('#d1').value),b=new Date($('#d2').value);if(isNaN(a)||isNaN(b))return set('هر دو تاریخ را انتخاب کنید.');const ms=Math.abs(b-a),days=Math.floor(ms/86400000),hours=Math.floor(ms/3600000),mins=Math.floor(ms/60000);set(`${days} روز\n${hours} ساعت\n${mins} دقیقه\n${Math.floor(ms/1000)} ثانیه`)};break;
}}catch(e){set('خطا: '+e.message)}}
renderChips();renderTools();
$('#chips').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;activeCat=b.dataset.cat;renderChips();renderTools()};$('#searchInput').oninput=renderTools;
$$('.nav-item').forEach(n=>n.onclick=()=>showView(n.dataset.nav));$('#backBtn').onclick=()=>showView('home');$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
$('#themeBtn').onclick=()=>setTheme(!document.body.classList.contains('dark'));$('#settingsThemeBtn').onclick=$('#themeBtn').onclick;$('#clearDataBtn').onclick=()=>{localStorage.removeItem('devbox:favorites');favorites=[];renderTools();renderFavorites();toast('داده‌های محلی پاک شد')};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden');$('#heroInstallBtn').classList.remove('hidden')});const install=async()=>{if(!deferredPrompt)return toast('نصب از این مرورگر در دسترس نیست');deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null};$('#installBtn').onclick=install;$('#heroInstallBtn').onclick=install;
const isWeb=/^https?:$/.test(location.protocol);$('#pwaStatus').textContent=isWeb?'آماده ثبت Service Worker':'برای نصب PWA باید روی HTTPS/localhost اجرا شود؛ خود برنامه از فایل مستقیم باز می‌شود.';$('#pwaDot').classList.toggle('ok',isWeb);
if('serviceWorker'in navigator && isWeb){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(()=>{$('#pwaStatus').textContent='Service Worker فعال است';$('#pwaDot').classList.add('ok')}).catch(()=>{$('#pwaStatus').textContent='خطا در Service Worker'}))}
})();
