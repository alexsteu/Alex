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
