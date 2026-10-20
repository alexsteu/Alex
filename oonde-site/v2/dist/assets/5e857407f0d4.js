
/* Les vidéos (v20) : les vidéos ne se chargent qu'à la lecture (preload="none", la <video> n'est créée qu'au premier geste) ;
   une seule joue à la fois ; muettes par défaut, le son au tap, sur une seule ; hors de l'écran, elle s'arrête.
   Mouvement réduit : rien ne part tout seul (ni la vidéo du haut, ni au survol) ; on lance au tap. */
(()=>{const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;let cur=null;
 const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target.querySelector('video');if(!e.isIntersecting&&v&&!v.paused)stop(e.target)}),{threshold:.25});
 function vid(box){let v=box.querySelector('video');if(!v){v=document.createElement('video');v.muted=true;v.playsInline=true;v.loop=true;v.preload='none';v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.tabIndex=-1;v.src=box.dataset.v;v.addEventListener('playing',()=>box.classList.add('live'));box.insertBefore(v,box.querySelector('.vp'))}return v}
 function play(box,sound){if(cur&&cur!==box)stop(cur);cur=box;const v=vid(box);v.muted=!sound;box.classList.toggle('sound',!!sound);box.querySelector('.snd').setAttribute('aria-pressed',!!sound);
  const p=v.play();if(p&&p.catch)p.catch(()=>{});box.classList.add('on');box.querySelector('.vp').setAttribute('aria-pressed','true')}
 function stop(box){const v=box.querySelector('video');if(v){v.pause();v.muted=true}box.classList.remove('on','sound','live');box.querySelector('.vp').setAttribute('aria-pressed','false');box.querySelector('.snd').setAttribute('aria-pressed','false');if(cur===box)cur=null}
 document.querySelectorAll('.v[data-v]').forEach(box=>{io.observe(box);
  box.querySelector('.vp').addEventListener('click',()=>{const on=box.classList.contains('on');if(!on)play(box,false);else if(FINE&&!RM&&!box.classList.contains('sound'))play(box,true);else stop(box)});   /* souris : le survol la lance muette, le clic lui donne le son, un second clic l'arrête */
  box.querySelector('.snd').addEventListener('click',e=>{e.stopPropagation();const on=box.classList.contains('sound');if(on){box.querySelector('video').muted=true;box.classList.remove('sound');e.currentTarget.setAttribute('aria-pressed','false')}else play(box,true)});
  if(FINE&&!RM){box.addEventListener('mouseenter',()=>{if(!cur||!cur.classList.contains('sound'))play(box,false)});box.addEventListener('mouseleave',()=>{if(cur===box&&!box.classList.contains('sound'))stop(box)})}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&cur)stop(cur)});   /* v25 : onglet caché, la vidéo s'arrête */
})();
/* v24 · Le Fil, v27.1 Réseaux sociaux : la matinée dans le téléphone suit le défilement (une seule animation). La vidéo de démo, muette, ne se charge
   qu'une fois le bloc à l'écran. Mouvement réduit : l'état « publié », sans animation, les trois temps lisibles. */
(()=>{const RMf=matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelectorAll('[data-fm]').forEach(fm=>{const c=fm.dataset.c.split('|'),clk=fm.querySelector('.fm-clk'),li=[...fm.querySelectorAll('.fm-t li')],v=fm.querySelector('video');let st=-1,raf=0,vis=false;
  const set=n=>{if(n===st)return;st=n;fm.dataset.st=n;clk.textContent=c[n];li.forEach((l,i)=>l.classList.toggle('on',i===n))};
  if(v)v.addEventListener('playing',()=>fm.classList.add('vlive'),{once:true});
  const play=()=>{if(!v||RMf)return;if(!v.src)v.src=v.dataset.src;const p=v.play();if(p&&p.catch)p.catch(()=>{})};
  if(RMf){set(1);return}
  fm.classList.add('js-st');
  const upd=()=>{raf=0;const r=fm.getBoundingClientRect(),p=(innerHeight*.6-r.top)/Math.max(1,r.height);set(p<.34?0:p<.68?1:2)};
  const on=()=>{if(!raf)raf=requestAnimationFrame(upd)};
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){addEventListener('scroll',on,{passive:true});upd();play()}else{removeEventListener('scroll',on);if(v&&v.src)v.pause()}},{rootMargin:'0px 0px -10% 0px'}).observe(fm);
  document.addEventListener('visibilitychange',()=>{if(!v||!v.src)return;if(document.hidden)v.pause();else if(vis)play()});   /* v25 : onglet caché, la vidéo attend */
  set(0)})})();
