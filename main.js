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
