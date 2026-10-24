/* Start-up and small behaviours */
render();
setInterval(tick,1000);

/* scroll progress line + highlight the section you are reading */
(function(){
  const bar=$('progress'),links=[...document.querySelectorAll('nav a[href^="#"]')];
  const secs=links.map(a=>document.querySelector(a.getAttribute('href')));
  let busy=false;
  function update(){
    const h=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')';
    let cur=0;
    secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i;});
    links.forEach((a,i)=>{
      a.classList.toggle('on',i===cur);
      if(i===cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
    });
    busy=false;
  }
  addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update);
  update();
})();

/* left / right arrow keys change the gallery photo while it is on screen */
document.addEventListener('keydown',e=>{
  if(document.body.classList.contains('lock'))return;
  const r=$('gallery').getBoundingClientRect();
  if(r.top<innerHeight&&r.bottom>0){
    if(e.key==='ArrowLeft')go(-1);
    if(e.key==='ArrowRight')go(1);
  }
});

/* ===== Royal pages: dark sections, menu, sparkles, scroll reveal ===== */
['story','events','blessings'].forEach(id=>{const s=$(id);if(s)s.classList.add('dark');});

/* monogram + menu button (phones) */
(function(){
  const bar=document.querySelector('.topbar'),nav=bar.querySelector('nav');
  const brand=document.createElement('a');brand.className='brand';brand.href='#hero';brand.textContent='N & D';brand.setAttribute('aria-label','Home');
  const btn=document.createElement('button');btn.className='burger';btn.type='button';btn.setAttribute('aria-label','Menu');btn.setAttribute('aria-expanded','false');btn.innerHTML='<i></i><i></i><i></i>';
  bar.insertBefore(brand,nav);bar.insertBefore(btn,nav.nextSibling);
  const set=o=>{bar.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);};
  btn.addEventListener('click',()=>set(!bar.classList.contains('open')));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
  document.addEventListener('click',e=>{if(!bar.contains(e.target))set(false);});
})();

/* drifting gold sparkles */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const cv=document.createElement('canvas');cv.className='sparkle';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
  const x=cv.getContext('2d');let W,H,raf,P=[];
  function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);}
  function mk(init){return{x:Math.random()*W,y:init?Math.random()*H:-10,r:Math.random()*2+.6,v:Math.random()*.25+.1,d:Math.random()*.6-.3,a:Math.random()*6.28,s:Math.random()*.02+.008};}
  size();const N=W<600?24:44;for(let i=0;i<N;i++)P.push(mk(true));
  function frame(){
    x.clearRect(0,0,W,H);
    for(const p of P){
      p.y+=p.v;p.a+=p.s;p.x+=p.d*.3+Math.sin(p.a)*.15;
      if(p.y>H+10||p.x<-10||p.x>W+10)Object.assign(p,mk(false));
      x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);
      x.fillStyle='rgba(240,205,120,'+(.2+.35*Math.abs(Math.sin(p.a*3)))+')';
      x.shadowColor='rgba(240,205,120,.8)';x.shadowBlur=6;x.fill();
    }
    raf=requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);if(!document.hidden)raf=requestAnimationFrame(frame);});
  addEventListener('resize',size);raf=requestAnimationFrame(frame);
})();

/* gentle reveal as sections scroll into view */
(function(){
  if(!('IntersectionObserver' in window))return;
  const els=document.querySelectorAll('section.s h2,section.s .dv,section.s .sub,section.s .names>*,section.s .stl>*,section.s .ei,section.s .trl>*,section.s .host,section.s .car,section.s #f');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(el=>{
    const i=[...el.parentNode.children].indexOf(el);
    el.style.transitionDelay=Math.min(i%4,3)*70+'ms';
    el.classList.add('rv');io.observe(el);
  });
})();
