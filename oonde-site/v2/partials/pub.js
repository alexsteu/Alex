/* La Pub (v20) : les vidéos ne se chargent qu'à la lecture (preload="none", la <video> n'est créée qu'au premier geste) ;
   une seule joue à la fois ; muettes par défaut, le son au tap, sur une seule ; hors de l'écran, elle s'arrête.
   Mouvement réduit : rien ne part tout seul (ni la pub du haut, ni au survol) ; on lance au tap. */
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
 /* les flèches de la rangée (souris) ; au clavier et au doigt, la rangée défile d'elle-même */
 const rail=document.getElementById('rail');if(rail){const bs=document.querySelectorAll('[data-g]'),upd=()=>{bs[0].disabled=rail.scrollLeft<8;bs[1].disabled=rail.scrollLeft>rail.scrollWidth-rail.clientWidth-8};
  bs.forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:+b.dataset.g*rail.clientWidth*.75,behavior:RM?'auto':'smooth'})));rail.addEventListener('scroll',upd,{passive:true});upd()}
 /* la pub du haut : muette, en boucle, seulement à l'écran */
 const h=document.querySelector('.ph1 video');if(h&&!RM){new IntersectionObserver(es=>{const e=es[0];if(e.isIntersecting){if(!h.src)h.src=h.dataset.src;const p=h.play();if(p&&p.catch)p.catch(()=>{})}else h.pause()},{threshold:.3}).observe(h.parentNode);
  h.addEventListener('playing',()=>{h.style.opacity=1},{once:true});h.style.opacity=0;h.style.transition='opacity .4s'}
})();
