/* v44 · Le calculateur : appels manqués par semaine × part qui aurait commandé × panier moyen × 4,33 semaines. Rien ne quitte la page. */
(()=>{const f=document.getElementById('calc');if(!f)return;
 const n=document.getElementById('cN'),pz=document.getElementById('cP'),r=document.getElementById('cR'),ro=document.getElementById('cRo'),v=document.getElementById('cV'),fx=document.getElementById('cF');
 const chf=x=>String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+'.–';
 const num=el=>{const x=parseFloat(String(el.value).replace(',','.'));return isFinite(x)&&x>0?x:0};
 function go(){const a=num(n),b=num(pz),k=+r.value;ro.textContent=k+' sur 10';
  v.textContent=chf(a*k/10*b*4.33);fx.textContent=(Math.round(a)||0)+' appels × '+k+' sur 10 × '+chf(b)+' × 4,33 semaines'}
 f.addEventListener('input',go);f.addEventListener('submit',e=>e.preventDefault());go()})();
