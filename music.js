/* Music: plays assets/audio/music.mp3, or a synthesised flute if no file is set */
/* Original bansuri-style flute (Raag Bhoopali), synthesised live: no audio file needed */
const Flute={ctx:null,on:false,pi:0,
 P:[[[0,2],[2,1],[4,2],[2,1],[0,3],[null,1.5]],
    [[4,1.5],[7,1],[4,1],[2,1],[4,2],[0,2],[null,1]],
    [[7,1.5],[9,1],[7,1],[4,1.5],[7,1],[9,2],[12,3],[null,1.5]],
    [[12,1.5],[9,1],[7,1.5],[9,1],[7,1],[4,1.5],[2,1],[0,3],[null,2]],
    [[4,1],[7,1],[9,1],[12,1],[14,2],[12,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,1.5]],
    [[9,1],[12,1.5],[14,1],[16,2],[14,1],[12,1],[9,1.5],[7,1],[4,1],[2,1],[0,4],[null,2.5]]],
 init(){const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;const c=this.ctx=new A();
  const master=c.createGain();master.gain.value=.9;master.connect(c.destination);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4200;
  const n=c.sampleRate*2.8,ir=c.createBuffer(2,n,c.sampleRate);
  for(let h=0;h<2;h++){const d=ir.getChannelData(h);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6);}
  const cv=c.createConvolver();cv.buffer=ir;const wet=c.createGain();wet.gain.value=.5;const dry=c.createGain();dry.gain.value=.8;
  lp.connect(dry);lp.connect(cv);cv.connect(wet);dry.connect(master);wet.connect(master);
  const g=this.g=c.createGain();g.gain.value=0;g.connect(lp);
  this.o=[1,2,3].map(k=>{const o=c.createOscillator();o.type=k===3?'triangle':'sine';const kg=c.createGain();kg.gain.value=[1,.22,.07][k-1];o.connect(kg);kg.connect(g);o.start();return o;});
  const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5.1;lg.gain.value=9;lfo.connect(lg);this.o.forEach(o=>lg.connect(o.detune));lfo.start();
  const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  const ns=c.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=this.bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=3;
  const ng=this.ng=c.createGain();ng.gain.value=0;ns.connect(bp);bp.connect(ng);ng.connect(lp);ns.start();
  const dg=c.createGain();dg.gain.value=.03;dg.connect(master);
  [73.42,146.83,220].forEach(f=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;const lf=c.createBiquadFilter();lf.type='lowpass';lf.frequency.value=520;o.connect(lf);lf.connect(dg);o.start();});
  const tl=c.createOscillator(),tg=c.createGain();tl.frequency.value=.28;tg.gain.value=.012;tl.connect(tg);tg.connect(dg.gain);tl.start();
  return true;},
 start(){if(!this.ctx&&!this.init())return;this.ctx.resume();if(!this.t){this.nt=this.ctx.currentTime+1;this.t=setInterval(()=>{while(this.nt<this.ctx.currentTime+3)this.nt=this.play(this.P[this.pi++%this.P.length],this.nt);},500);}this.on=true;},
 stop(){if(this.ctx)this.ctx.suspend();this.on=false;},
 play(ph,t){const B=.8,S0=293.66,lv=.2;let rest=true;
  ph.forEach(([s,b])=>{const d=b*B;
   if(s===null){this.g.gain.setTargetAtTime(.0001,t,.12);this.ng.gain.setTargetAtTime(0,t,.12);rest=true;}
   else{const f=S0*Math.pow(2,s/12);
    this.o.forEach((o,i)=>{if(rest)o.frequency.setValueAtTime(f*(i+1),t);else o.frequency.setTargetAtTime(f*(i+1),t,.05);});
    this.bp.frequency.setValueAtTime(f*2.5,t);
    if(rest){this.g.gain.setTargetAtTime(lv,t,.08);}else{this.g.gain.setTargetAtTime(lv*.72,t,.012);this.g.gain.setTargetAtTime(lv,t+.06,.07);}
    this.ng.gain.setTargetAtTime(.05,t,.06);rest=false;}
   t+=d;});return t;}};
const Song={a:null,on:false,start(){if(!this.a){this.a=new Audio(ART.mu);this.a.loop=true;this.a.volume=.75;}this.a.play().catch(()=>{});this.on=true;},stop(){if(this.a)this.a.pause();this.on=false;}};
const Player=ART.mu?Song:Flute;
const setIcon=()=>{$('music').textContent=Player.on?'🔊':'🎵';};
$('music').onclick=()=>{Player.on?Player.stop():Player.start();setIcon();};
$('open').onclick=()=>{
  const cv=$('cover');
  if(cv.classList.contains('unfold'))return;
  Player.start();setIcon(); /* inside the tap so the browser allows audio */
  cv.classList.add('unfold'); /* flap opens, card rises out */
  const wait=matchMedia('(prefers-reduced-motion: reduce)').matches?0:1650;
  setTimeout(()=>{cv.classList.add('open');document.body.classList.remove('lock');setTimeout(()=>{cv.style.display='none';},1200);},wait);
};
