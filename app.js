/* Rendering, petals, countdown, gallery. Text lives in data.js */
const SITE_URL=location.origin+location.pathname.replace(/index\.html$/,'');
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const q=(s,f)=>document.querySelectorAll(s).forEach(f);
let L=0,lang='en',gi=0;

q('img[data-art]',i=>{i.src=ART[i.dataset.art];if(!i.alt)i.alt='';});
/* mandala behind the hero portrait */
(function(){let s='<circle r="98"/><circle r="94" stroke-width=".3"/><circle r="64"/><circle r="60" stroke-width=".3"/>';
 for(let i=0;i<24;i++)s+='<ellipse cx="0" cy="-79" rx="7" ry="15" transform="rotate('+i*15+')"/>';
 for(let i=0;i<12;i++)s+='<path d="M0 -62 Q10 -76 0 -90 Q-10 -76 0 -62" transform="rotate('+(i*30+15)+')" stroke="#e6c476"/>';
 $('mand').innerHTML=s;})();
/* falling petals */
function petals(el,n){el.style.setProperty('--h',Math.max(el.scrollHeight,innerHeight)+'px');const c=['#e8a317','#d9731a','#f3c969','#c0392b'];for(let i=0;i<n;i++){const p=document.createElement('span');p.className='pt';const z=7+Math.random()*9;
 p.style.cssText='left:'+Math.random()*100+'%;width:'+z+'px;height:'+z*1.3+'px;background:'+c[i%4]+';--dx:'+(Math.random()*80-40)+'px;animation-duration:'+(9+Math.random()*9)+'s;animation-delay:'+(-Math.random()*14)+'s';el.appendChild(p);}}
petals($('cover'),16);petals($('hero'),14);addEventListener('load',()=>[$('cover'),$('hero')].forEach(e=>e.style.setProperty('--h',Math.max(e.scrollHeight,innerHeight)+'px')));
function render(){
  const t=S[lang];
  document.documentElement.lang=lang;
  document.title=S.en.n1+' & '+S.en.n2+' — Wedding Invitation';
  $('cinv').textContent=t.inv;$('invocation').textContent=t.inv;
  $('cn1').textContent=t.n1;$('cn2').textContent=t.n2;$('n1').textContent=t.n1;$('n2').textContent=t.n2;
  $('cdt').textContent=t.when.split(' • ')[0];$('when').textContent=t.when;
  q('nav a[data-n]',a=>a.textContent=t.nav[a.dataset.n]);
  q('[data-t]',e=>e.textContent=t[e.dataset.t]);
  $('fn').placeholder=t.nm;$('fm').placeholder=t.ms;
  $('hero').style.setProperty('--hbg',"url('"+new URL(C.couple,document.baseURI).href+"')");
  $('hph').style.backgroundImage="url('"+(C.ghibli||C.couple)+"')";
  $('names').innerHTML='<div class="couple-ghibli"><img src="'+ART.gh+'" alt="Illustrated portrait"></div><figure><div class="arch sm" role="img" aria-label="'+esc(t.n1)+'" style="background-image:url('+ART.p1+')"></div><h3>'+esc(t.n1)+'</h3><b>'+t.gh+'</b><p class="q">“'+esc(t.qg)+'”</p></figure><figure><div class="arch sm" role="img" aria-label="'+esc(t.n2)+'" style="background-image:url('+ART.p2+')"></div><h3>'+esc(t.n2)+'</h3><b>'+t.bh+'</b><p class="q">“'+esc(t.qb)+'”</p></figure>';
  $('story-list').innerHTML=t.story.map(x=>'<div class="si"><h3>'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p></div>').join('');
  $('trad').innerHTML=t.trad.map(x=>'<details><summary>'+esc(x[0])+'</summary><p>'+esc(x[1])+'</p></details>').join('');
  const im=['m','g','b'];
  $('ev').innerHTML=C.events.map((e,i)=>'<div class="ei"><div class="bd"><b>'+DAY[i]+'</b><span>'+t.mo[i]+'</span></div><article class="ec">'+(e.img?'<img class="eb" src="'+esc(e.img)+'" alt="">':'<img src="'+ART[im[i]]+'" alt="">')+'<h3>'+esc(e.t[L])+'</h3><time>'+esc(e.d[L])+'</time><p>'+esc(e.n[L])+'</p><p>🕒 '+esc(e.tm[L])+'</p><p>📍 '+esc(e.v[L])+'</p><div class="ab"><a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(e.map)+'" target="_blank" rel="noopener">'+t.dir+'</a><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(e.t[0]+' — Nagesh & Dhanyashree')+'&dates='+CAL[i]+'&location='+encodeURIComponent(e.v[0])+'" target="_blank" rel="noopener">'+t.cal+'</a></div></article></div>').join('');
  $('host').innerHTML='<p><b>'+t.inb+'</b><br>'+esc(t.in)+'</p><p><b>'+t.cb+'</b><br>'+esc(t.c)+'</p>';
  $('foot').innerHTML='<svg class="fm" viewBox="0 0 120 120" aria-hidden="true"><use href="#mono"/></svg><h3 class="gold">'+esc(t.n1)+' &amp; '+esc(t.n2)+'</h3><p>'+esc(t.foot)+'</p><p class="ht">'+esc(t.ht)+'</p><a class="wa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(t.sharet+'\n'+SITE_URL+'\n\n'+t.sharef)+'">'+t.share+'</a>';
  slide();tick();buildThumbs();
}
function slide(){
  const g=C.gallery[gi],u="url('"+g[0]+"')";
  $('sbg').style.backgroundImage=u;$('sfg').style.backgroundImage=u;
  $('slide').setAttribute('aria-label',S[lang].gal+' '+(gi+1));
  $('cnt').textContent=(gi+1)+' / '+C.gallery.length;
  const strip=$('thumb-strip');
  if(strip)[...strip.children].forEach((b,i)=>{
    b.classList.toggle('on',i===gi);
    if(i===gi)b.scrollIntoView({inline:'center',behavior:'smooth',block:'nearest'});
  });
}
function buildThumbs(){
  const strip=$('thumb-strip');if(!strip)return;
  C.gallery.forEach(([url],i)=>{
    const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Photo '+(i+1));
    b.style.backgroundImage="url('"+url+"')";b.onclick=()=>{gi=i;slide();};strip.appendChild(b);
  });
}
const go=d=>{gi=(gi+d+C.gallery.length)%C.gallery.length;const s=$('slide');s.classList.add('swap');clearTimeout(go.t);
  go.t=setTimeout(()=>{slide();s.classList.remove('swap');new Image().src=C.gallery[(gi+1)%C.gallery.length][0];},180);};
$('pv').onclick=()=>go(-1);$('nx').onclick=()=>go(1);
let sx=0;const sl=$('slide');
sl.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
sl.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40)go(d<0?1:-1);});
function tick(){const t=S[lang];let d=new Date(C.date)-Date.now();const over=d<=0;if(over)d=0;
  const v=[86400000,3600000,60000,1000].map((m,i)=>{const n=Math.floor(d/m);d-=n*m;return '<div><b>'+String(n).padStart(2,'0')+'</b><span>'+t.units[i]+'</span></div>';});
  $('count').innerHTML=over?'<b class="done">'+t.done+'</b>':v.join('');}

