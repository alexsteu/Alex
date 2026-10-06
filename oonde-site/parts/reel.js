/* --- Reel OONDE --- */
(()=>{const v=document.getElementById('reelVideo'),b=document.getElementById('sound');if(!v)return;
if('IntersectionObserver' in window)new IntersectionObserver(es=>{if(es[0].isIntersecting)v.play().catch(()=>{});else v.pause()},{threshold:.4}).observe(v);
b.addEventListener('click',()=>{v.muted=!v.muted;b.textContent=v.muted?'Activer le son':'Couper le son';b.setAttribute('aria-pressed',String(!v.muted));if(!v.muted){v.currentTime=0;v.play().catch(()=>{})}});})();
