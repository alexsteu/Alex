/* v42 · Contact : le petit formulaire écrit l'e-mail et ouvre la messagerie du visiteur (mailto:, rien ne part vers un serveur) ; « Copier » met l'adresse
   dans le presse-papiers. */
(()=>{const f=document.getElementById('cForm');if(!f)return;const A='oonde.contact@gmail.com',sent=document.getElementById('cSent'),cp=document.getElementById('cCopy'),ml=document.getElementById('cMailto');
 const lien=()=>{const n=f.commerce.value.trim(),m=f.message.value.trim();const s='Mon commerce'+(n?' : '+n:'');const b='Bonjour,\n\n'+(m||'J’aimerais en savoir plus sur vos services.')+(n?'\n\nMon commerce : '+n:'')+'\n\nJe viens du site oonde.ch.';
  return 'mailto:'+A+'?subject='+encodeURIComponent(s)+'&body='+encodeURIComponent(b)};
 const maj=()=>{if(ml)ml.href=lien()};f.addEventListener('input',maj);
 f.addEventListener('submit',e=>{e.preventDefault();location.href=lien();sent.hidden=false;if(window.umami)try{umami.track('contact',{par:'e-mail',bouton:'formulaire'})}catch(x){}});
 if(cp)cp.addEventListener('click',()=>{const ok=()=>{cp.textContent='Copié';cp.classList.add('ok');setTimeout(()=>{cp.textContent='Copier';cp.classList.remove('ok')},2200)};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(A).then(ok,()=>{if(ml)ml.focus()});else{const r=document.createRange();r.selectNodeContents(ml);const s=getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy');ok()}catch(x){}}});
})();
