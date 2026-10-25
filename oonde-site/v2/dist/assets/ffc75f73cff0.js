(()=>{const u=$('lac');if(!u)return;
 const vO=$('lacO'),vA=$('lacA'),hold=$('lacH'),stg=$('lacSt'),ld=u.querySelector('.lac-load'),skip=$('lacSkip'),go=$('lacGo');
 const blocks={c1:$('lac1'),c2:$('lac2')},COARSE=matchMedia('(pointer:coarse)').matches,WAIT_MS=2500;
 const K=()=>innerWidth<=innerHeight?'m':'d';let set=K();
 const VX=(()=>{try{const v=document.createElement('video');return v.canPlayType('video/mp4; codecs="avc1.64002A"')?'mp4':v.canPlayType('video/webm; codecs="vp09.00.40.08"')?'webm':'mp4'}catch(e){return 'mp4'}})();
 const vid=k=>'video/lac/'+set+'/'+k+'.'+VX,img=k=>'img/lac/'+set+'/'+k+'.jpg';
 const flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 let st='c1',LIVE=!RM,pinned=false,primed=false,ready=false,want=false,tW=0,lastW=0,tY0=-1,tX0=0,swp=false,lastStep=0;
 function state(s){st=s;lastStep=performance.now();const c={o:'sO',c1:'s1',a:'sA',c2:'s2'};for(const k in c)flag(u,c[k],k===s);
  for(const k in blocks){const b=blocks[k];if(!b)continue;const on=k===s||!LIVE||(s==='o'&&k==='c1');if(on)b.removeAttribute('inert');else b.setAttribute('inert','')}}
 const loading=on=>{ld.textContent=on?'Chargement de l’entrée…':''};
 const cache={};function pre(k){const s=img(k);if(!cache[s]){const i=new Image();i.decoding='async';i.src=s;cache[s]=(i.decode?i.decode():Promise.resolve()).catch(()=>{}).then(()=>s)}return cache[s]}
 function holdTo(k){return pre(k).then(s=>{if(!hold.src.endsWith(s))hold.src=s;return (hold.decode?hold.decode():Promise.resolve()).catch(()=>{})}).then(()=>flag(u,'held',true))}
 function play(v){try{const p=v.play();if(p&&p.catch)p.catch(()=>{});return p}catch(e){return null}}
 const onEnd=(v,fn,ms)=>{let done=false;const f=()=>{if(done)return;done=true;v.removeEventListener('ended',f);clearTimeout(t);fn()};v.addEventListener('ended',f);const t=setTimeout(f,ms);return f};
 const stop=v=>{try{v.pause()}catch(e){}};
 function pin(on){pinned=on;const h=document.documentElement;h.style.overflow=on&&COARSE?'hidden':'';if(on&&scrollY>0)scrollTo({top:0,behavior:'instant'})}
 addEventListener('scroll',()=>{if(pinned&&scrollY>0)scrollTo({top:0,behavior:'instant'})},{passive:true});
 function primeA(){if(primed||st!=='c1')return;primed=true;ready=true;if(want){runA();return}stop(vA);try{vA.currentTime=0}catch(e){}}
 vA.addEventListener('playing',()=>{if(st==='c1'&&!primed)primeA();else if(st!=='a')stop(vA)});
 function startA(){if(st!=='c1'||!LIVE)return;if(ready){runA();return}
  want=true;play(vA);
  clearTimeout(tW);tW=setTimeout(()=>{if(st==='c1'&&want){loading(true);tW=setTimeout(()=>{if(st==='c1'&&want){want=false;loading(false);state('a');pin(true);cut('c2')}},WAIT_MS)}},500)}
 function runA(){want=false;loading(false);clearTimeout(tW);state('a');pin(true);
  if(!vA.paused&&vA.readyState>2)flag(vA,'on',true);else vA.addEventListener('playing',()=>flag(vA,'on',true),{once:true});
  const p=play(vA);if(p&&p.then)p.then(null,()=>{if(st==='a')cut('c2')});
  onEnd(vA,endA,((vA.duration||4.6)+2.5)*1000);
  setTimeout(()=>{if(st==='a'&&vA.paused&&!vA.ended)cut('c2')},WAIT_MS);
  pre('c2')}
 let wA=0;vA.addEventListener('waiting',()=>{if(st!=='a')return;clearTimeout(wA);const t=vA.currentTime;wA=setTimeout(()=>{if(st==='a'&&vA.currentTime-t<.2)cut('c2')},1200)});vA.addEventListener('playing',()=>clearTimeout(wA));
 function endA(){if(st!=='a')return;holdTo('c2');state('c2');pin(false)}
 function cut(s){stop(vO);stop(vA);flag(vO,'on',false);u.classList.remove('pre');loading(false);holdTo(s).then(()=>flag(vA,'on',false));state(s);if(s==='c2')pin(false)}
 function toEnd(){if(st==='c2')return;clearTimeout(tW);want=false;cut('c2')}
 const next=()=>{if(!LIVE)return;if(st==='o'){stop(vO);toC1()}if(st==='c1')startA()};
 const live=()=>LIVE&&st!=='c2';
 const ctl=t=>!!(t&&t.closest&&t.closest('a,button,input,select,textarea,.tel-rev'));
 addEventListener('wheel',e=>{if(!live())return;const t=performance.now(),quiet=t-lastW>350;lastW=t;if(e.ctrlKey)return;e.preventDefault();
  if(e.deltaY>0&&quiet&&t-lastStep>450)next()},{passive:false});
 addEventListener('touchstart',e=>{const q=e.touches[0];tY0=q?q.clientY:-1;tX0=q?q.clientX:0;swp=false},{passive:true});
 addEventListener('touchmove',e=>{if(!live())return;if(e.touches.length>1)return;if(e.cancelable)e.preventDefault();const q=e.touches[0];if(!q||swp||tY0<0)return;const dy=tY0-q.clientY;
  if(dy>24&&dy>1.3*Math.abs(q.clientX-tX0))swp=true},{passive:false});
 const lift=()=>{if(swp){swp=false;if(live())next();return}if(want&&st==='c1')play(vA)};
 addEventListener('touchend',lift,{passive:true});addEventListener('touchcancel',lift,{passive:true});
 addEventListener('keydown',e=>{if(!live())return;if(![' ','ArrowDown','PageDown','End'].includes(e.key))return;if(e.key===' '&&ctl(e.target))return;e.preventDefault();next()});
 stg.addEventListener('click',e=>{if(!live()||ctl(e.target))return;next()});
 go.addEventListener('click',e=>{e.preventDefault();next()});
 skip.addEventListener('click',e=>{e.preventDefault();toEnd();const t=$('esprit');if(t)requestAnimationFrame(()=>t.scrollIntoView({behavior:RM?'instant':'smooth',block:'start'}))});
 document.addEventListener('click',e=>{if(!live())return;const a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a||a===skip)return;const h=a.getAttribute('href');if(h==='#top'||h==='#'||h==='#lac')return;toEnd()},true);
 addEventListener('hashchange',()=>{if(live()&&location.hash.length>1&&location.hash!=='#top')toEnd()});
 addEventListener('resize',()=>{const k=K();if(k===set)return;set=k;flag(u,'held',false);hold.removeAttribute('src');
  if(st==='o'){stop(vO);toC1()}
  if(st==='c1'){stop(vA);flag(vA,'on',false);primed=ready=false;vA.src=vid('a');play(vA)}
  else cut('c2')});
 function flat(){LIVE=false;u.classList.add('static');for(const v of [vO,vA]){stop(v);v.removeAttribute('src');try{v.load()}catch(e){}flag(v,'on',false)}pin(false);hold.src=img('c1');flag(u,'held',true);state('c2')}
 if(!LIVE){flat();return}
 const H=location.hash,deep=H.length>1&&H!=='#top'&&H!=='#lac'&&!!document.getElementById(H.slice(1));
 function loadA(){if(vA.getAttribute('src'))return;vA.src=vid('a');try{vA.load()}catch(e){}}
 vA.addEventListener('error',()=>{if(st==='c1'||st==='a')flat()},{once:true});
 let tO=0,oOn=false;
 function toC1(){clearTimeout(tO);if(st!=='o')return;u.classList.remove('pre');holdTo('c1').then(()=>flag(vO,'on',false));state('c1');loadA();play(vA);
  setTimeout(()=>{if(ready||st!=='c1')return;const ok=()=>{if(!ready&&st==='c1'&&(vA.readyState>=3)){ready=true;stop(vA);if(want)startA()}};ok();vA.addEventListener('canplaythrough',ok);vA.addEventListener('loadeddata',ok)},1200)}
 if(deep||scrollY>40){stop(vO);vO.removeAttribute('src');try{vO.load()}catch(e){}toEnd();return}
 state('o');pin(true);
 if(!vO.getAttribute('src'))vO.src=vid('o');
 const onO=()=>{if(oOn||st!=='o')return;oOn=true;clearTimeout(tO);flag(vO,'on',true);loadA();setTimeout(()=>{if(st==='o')u.classList.add('pre')},900);onEnd(vO,toC1,((vO.duration||2)+1.5)*1000)};
 if(vO.ended)toC1();else if(!vO.paused&&vO.currentTime>0)onO();else vO.addEventListener('playing',onO,{once:true});
 vO.addEventListener('error',()=>{if(st==='o')toC1()},{once:true});
 const oNo=()=>{clearTimeout(tO);tO=setTimeout(()=>{if(!oOn&&st==='o')toC1()},1200)};
 vO.addEventListener('canplay',oNo,{once:true});vO.addEventListener('loadeddata',oNo,{once:true});if(vO.readyState>=2)oNo();
 tO=setTimeout(()=>{if(!oOn&&st==='o')toC1()},5000);
})();
