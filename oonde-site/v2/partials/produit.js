/* v43 · scène « le téléphone comme un produit » : l'avancée dans la section choisit l'étape (sonne, répond, résumé, légendes).
   Mouvement réduit ou pas d'IntersectionObserver : l'état final reste posé, rien ne bouge. */
(()=>{const u=document.getElementById('pp');if(!u)return;
 const cs=[...u.querySelectorAll('.pp-c')];
 const box=u.querySelector('.pp-cs');const close=k=>{cs.forEach((c,i)=>c.setAttribute('aria-expanded',String(i===k&&c.getAttribute('aria-expanded')!=='true')));box.classList.toggle('has',cs.some(c=>c.getAttribute('aria-expanded')==='true'))};
 cs.forEach((c,i)=>c.addEventListener('click',e=>{e.stopPropagation();close(i)}));
 u.addEventListener('click',()=>close(-1));
 addEventListener('keydown',e=>{if(e.key==='Escape')close(-1)});
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 u.classList.add('live');
 const bs=[...u.querySelectorAll('.pp-bt[data-b]')],ms=[...u.querySelectorAll('.pp-chat p')];let s=-1,raf=0;
 function set(n,p){if(n!==s){s=n;u.dataset.s=n;bs.forEach(b=>b.classList.toggle('off',+b.dataset.b!==n));if(n!==3)close(-1)}
  /* étape 1 : les bulles arrivent une à une pendant qu'on descend */
  const k=n>1?ms.length:n<1?0:Math.ceil(Math.min(1,Math.max(0,(p-.25)/.25))*ms.length);ms.forEach((m,i)=>m.classList.toggle('on',i<k))}
 function tick(){raf=0;const r=u.getBoundingClientRect(),span=u.offsetHeight-innerHeight;const p=Math.min(1,Math.max(0,-r.top/span));
  set(p<.22?0:p<.52?1:p<.74?2:3,p)}
 const req=()=>{if(!raf)raf=requestAnimationFrame(tick)};
 let on=false;new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on)req()}).observe(u);
 addEventListener('scroll',()=>{if(on)req()},{passive:true});addEventListener('resize',req);tick()})();
