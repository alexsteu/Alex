/* v43 · scène « le téléphone comme un produit » : l'avancée dans la section choisit l'étape (sonne, répond, résumé, légendes).
   v44 : à l'étape 1, l'appel en cours (minuteur qui avance avec le défilement, sous-titres qui arrivent un à un).
   Mouvement réduit ou pas d'IntersectionObserver : l'état final reste posé, rien ne bouge. */
(()=>{const u=document.getElementById('pp');if(!u)return;
 const cs=[...u.querySelectorAll('.pp-c')];
 const box=u.querySelector('.pp-cs');const close=k=>{cs.forEach((c,i)=>c.setAttribute('aria-expanded',String(i===k&&c.getAttribute('aria-expanded')!=='true')));box.classList.toggle('has',cs.some(c=>c.getAttribute('aria-expanded')==='true'))};
 cs.forEach((c,i)=>c.addEventListener('click',e=>{e.stopPropagation();close(i)}));
 u.addEventListener('click',()=>close(-1));
 addEventListener('keydown',e=>{if(e.key==='Escape')close(-1)});
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 u.classList.add('live');
 const bs=[...u.querySelectorAll('.pp-bt[data-b]')],ms=[...u.querySelectorAll('.pp-tr p')],tm=u.querySelector('.pp-tm');let s=-1,raf=0;
 function set(n,p){if(n!==s){s=n;u.dataset.s=n;bs.forEach(b=>{const off=+b.dataset.b!==n;b.classList.toggle('off',off);if(off)b.setAttribute('inert','');else b.removeAttribute('inert')});if(n!==3)close(-1);fit()}
  const q=Math.min(1,Math.max(0,(p-.2)/.3));
  const k=n>1?ms.length:n<1?0:Math.ceil(q*ms.length);ms.forEach((m,i)=>m.classList.toggle('on',i<k));
  if(tm){const t=n<1?0:n>1?38:Math.round(4+q*34);tm.textContent=n>1?'Appel terminé · 0:38':'En appel · 0:'+String(t).padStart(2,'0')}}
 /* v44 : la zone des phrases prend la hauteur de la phrase affichée (le téléphone remonte quand la phrase est courte) */
 const fit=()=>{const b=bs.find(x=>+x.dataset.b===s);if(b)u.style.setProperty('--bh',b.offsetHeight+'px')};addEventListener('resize',fit);
 function tick(){raf=0;const r=u.getBoundingClientRect(),span=u.offsetHeight-innerHeight;const p=Math.min(1,Math.max(0,-r.top/span));
  set(p<.2?0:p<.5?1:p<.72?2:3,p)}
 const req=()=>{if(!raf)raf=requestAnimationFrame(tick)};
 let on=false;new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on)req()}).observe(u);
 addEventListener('scroll',()=>{if(on)req()},{passive:true});addEventListener('resize',req);tick()})();
