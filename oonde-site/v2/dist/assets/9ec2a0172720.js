const WA_NUM='41779283540',MAIL='oonde.contact@gmail.com';
const $=id=>document.getElementById(id);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SRC=(()=>{let s='';try{s=new URLSearchParams(location.search).get('s')||sessionStorage.getItem('oonde-s')||'';if(s)sessionStorage.setItem('oonde-s',s)}catch(e){}return s})();
const HELLO={ig:'Bonjour, je viens d’Instagram.',tt:'Bonjour, je viens de TikTok.',carte:'Bonjour, vous êtes passés me voir.',gbp:'Bonjour, je vous ai trouvés sur Google.'}[SRC]||'Bonjour, je viens de votre site.';
const wa=t=>'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(t);
const mail=(subject,t)=>'mailto:'+MAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(t);
const MSG={
 imm:()=>HELLO+' J’aimerais voir ma façade en 3D et recevoir le prix de mon site.\nMon commerce et ma commune : ',
 e3:()=>HELLO+' J’aimerais voir ma façade en 3D et recevoir le prix de mon site.\nMon commerce et ma commune : ',
 assist:()=>HELLO+' J’ai essayé l’assistant. J’aimerais le même sur mon site, avec la formule Pro.\nMon commerce et ma commune : ',
 site_ess:()=>HELLO+' J’aimerais la formule Essentiel du site, et recevoir mon aperçu 3D.\nMon commerce et ma commune : ',
 site_pro:()=>HELLO+' J’aimerais la formule Pro du site, avec l’assistant, et recevoir mon aperçu 3D.\nMon commerce et ma commune : ',
 tel:()=>HELLO+' J’aimerais recevoir ma démo du téléphone, à mon nom.\nMon commerce et ma commune : ',
 tel_ess:()=>HELLO+' Le téléphone m’intéresse, forfait Essentiel. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ',
 tel_pro:()=>HELLO+' Le téléphone m’intéresse, forfait Pro. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ',
 tel_pre:()=>HELLO+' Le téléphone m’intéresse, forfait Premium. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ',
 tel_rush:()=>HELLO+' Le téléphone m’intéresse, forfait Rush. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ',
 fil:()=>HELLO+' Vos vidéos m’intéressent : une pub pour mon commerce, et peut-être la publication sur mon Instagram. J’aimerais une maquette gratuite.\nMon commerce et ma commune : ',
 demo:()=>HELLO+' J’ai vu la démo Les Grèves. J’aimerais une entrée en 3D pour mon lieu.\nMon commerce et ma commune : ',
 q:()=>HELLO+' J’ai une question : ',
 lieu:()=>HELLO+' J’aimerais que vous veniez filmer chez moi, pour une visite complète de mon lieu sur mon site.\nMon commerce, ma commune et le meilleur moment : ',
 cours:()=>HELLO+' Les cours et formations m’intéressent.\nSur quel sujet : '};
if(SRC)document.querySelectorAll('a[data-wa]').forEach(a=>{const m=MSG[a.dataset.wa];if(m)a.href=wa(m())});
document.querySelectorAll('a[data-mail]').forEach(a=>{const m=MSG[a.dataset.mail];if(m)a.href=mail(a.dataset.mail==='imm'?'L’entrée 3D : mon commerce':'Ma maquette offerte',m().replace(/\n/,'\n\n'))});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="https://wa.me"],a[href^="mailto:"],a[href^="tel:"]');if(a&&window.umami)try{umami.track('contact',{par:a.href.startsWith('mailto')?'e-mail':a.href.startsWith('tel')?'téléphone':'whatsapp',bouton:a.dataset.wa||a.dataset.mail||a.id||'',source:SRC||'direct'})}catch(x){}});
document.querySelectorAll('details').forEach(d=>{const s=d.querySelector('summary');d.addEventListener('toggle',()=>{if(d.open)requestAnimationFrame(()=>d.classList.add('is'));else d.classList.remove('is')});s.addEventListener('click',e=>{e.preventDefault();
 if(d.open){d.classList.remove('is');setTimeout(()=>{if(!d.classList.contains('is'))d.open=false},RM?0:230)}else{d.open=true;requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('is')))}})});
if(matchMedia('(pointer:coarse)').matches)document.querySelectorAll('a[href*="wa.me"][target]').forEach(a=>a.removeAttribute('target'));
(()=>{const w=document.querySelector('.nav-sub');if(!w)return;const b=w.querySelector('.nav-sb'),t=o=>{w.classList.toggle('open',o);b.setAttribute('aria-expanded',o)};
 b.addEventListener('click',()=>t(!w.classList.contains('open')));w.addEventListener('focusout',e=>{if(!w.contains(e.relatedTarget)&&!matchMedia('(max-width:700px)').matches)t(false)});
 document.addEventListener('click',e=>{if(!w.contains(e.target)&&!matchMedia('(max-width:700px)').matches)t(false)});w.addEventListener('keydown',e=>{if(e.key==='Escape'&&w.classList.contains('open')){e.stopPropagation();t(false);b.focus()}})})();
(()=>{const b=document.querySelector('.nav-m'),n=document.querySelector('.nav');if(!b)return;const t=o=>{n.classList.toggle('open',o);b.setAttribute('aria-expanded',o)};
 b.addEventListener('click',()=>t(!n.classList.contains('open')));n.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>t(false)));addEventListener('keydown',e=>{if(e.key==='Escape')t(false)})})();
(()=>{const m=$('mbar'),hero=document.querySelector('[data-hero]'),seen=new Set();let past=!hero;
 const set=()=>{const p=past||document.body.classList.contains('named');document.body.classList.toggle('cta-in',seen.size>0);if(m){m.classList.toggle('on',p&&!seen.size);document.body.classList.toggle('mbar-on',p)}};
 document.addEventListener('oonde-cta',()=>set());
 if(hero)new IntersectionObserver(es=>{past=!es[0].isIntersecting;set()}).observe(hero);
 const io=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));set()},{threshold:.5,rootMargin:'-64px 0px 0px 0px'});
 document.querySelectorAll('main a.btn[href*="wa.me"]:not(.r-wa),main [data-cta]').forEach(a=>io.observe(a));set()})();
(()=>{const secs=[...document.querySelectorAll('[data-sw]')],bs=[...document.querySelectorAll('[data-swb]')];if(!secs.length||!bs.length)return;bs.forEach(a=>{const l=a.querySelector('[data-swl]');if(l)l._e3=l.getAttribute('data-e3l')||''});
 const on=new Set();let cur='';
 const ref=()=>document.querySelector('main a[data-wa="e3"]:not([data-swb]) [data-e3l]');
 const apply=k=>{if(k===cur)return;cur=k;const s=secs.find(x=>x.dataset.sw===k);
  bs.forEach(a=>{const l=a.querySelector('[data-swl]');if(!l)return;
   if(s){a.dataset.wa=k;a.href=wa(MSG[k]());l.removeAttribute('data-e3l');l.textContent=s.dataset.swl}
   else{a.dataset.wa=a.dataset.swb;l.setAttribute('data-e3l',l._e3||'');if(typeof E3S!=='undefined')E3S.paint();else{const r=ref();a.href=r?r.closest('a').href:wa(MSG[a.dataset.swb]());l.textContent=l.dataset.swl}}})};
 const io=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?on.add(e.target):on.delete(e.target));const s=secs.find(x=>on.has(x));apply(s?s.dataset.sw:'')},{rootMargin:'-45% 0px -45% 0px'});
 secs.forEach(s=>io.observe(s))})();
if(!matchMedia('(pointer:coarse)').matches)document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[data-tel]');if(!a)return;const r=document.getElementById(a.dataset.tel);if(!r)return;e.preventDefault();r.hidden=false;r.tabIndex=-1;r.focus({preventScroll:true});
 const b=r.getBoundingClientRect();if(b.top<0||b.bottom>innerHeight)r.scrollIntoView({block:'nearest',behavior:RM?'instant':'smooth'})});
(()=>{const bs=document.querySelectorAll('.btn:not(.light)');if(!bs.length||!('IntersectionObserver' in window)||RM)return;const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('sh',e.isIntersecting)));bs.forEach(b=>io.observe(b))})();
(()=>{const els=document.querySelectorAll('.rv');if(!els.length)return;if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){els.forEach(e=>e.classList.add('on'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.2,rootMargin:'0px 0px -5% 0px'});els.forEach(e=>{if(e.getBoundingClientRect().top<innerHeight)e.classList.add('on');else io.observe(e)})})();
