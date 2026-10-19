
const WA_NUM='41764882710',MAIL='oonde.contact@gmail.com';
const $=id=>document.getElementById(id);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const WAI='<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>';
/* D'où vient la personne (?s=ig, ?s=carte…) : le premier mot du message le dit, sans cookie ni outil de mesure.
   Vous lisez la source dans chaque premier message WhatsApp. */
const SRC=(()=>{let s='';try{s=new URLSearchParams(location.search).get('s')||sessionStorage.getItem('oonde-s')||'';if(s)sessionStorage.setItem('oonde-s',s)}catch(e){}return s})();
const HELLO={ig:'Bonjour, je viens d’Instagram.',tt:'Bonjour, je viens de TikTok.',carte:'Bonjour, vous êtes passés me voir.',gbp:'Bonjour, je vous ai trouvés sur Google.'}[SRC]||'Bonjour, je viens de votre site.';
const wa=t=>'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(t);
const mail=(subject,t)=>'mailto:'+MAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(t);
/* Les messages fixes : une ligne d'où l'on vient, une ligne de ce qu'on veut, et en dernier ce qui reste à remplir (WhatsApp y met le curseur) */
const MSG={
 vit:()=>HELLO+' J’aimerais recevoir ma maquette offerte.\nMon commerce et ma commune : ',
 passe:()=>HELLO+' J’aimerais que vous passiez me montrer une maquette.\nMon commerce, ma commune et le meilleur moment : ',
 imm:()=>HELLO+' J’aimerais recevoir une première image 3D de ma façade et le prix d’un site avec une entrée en 3D.\nMon commerce et ma commune : ',
 e3:()=>HELLO+' J’aimerais recevoir une première image 3D de ma façade et le prix d’un site avec une entrée en 3D.\nMon commerce et ma commune : ',
 assist:()=>HELLO+' L’assistant m’intéresse.\nMon commerce et ma commune : ',
 tel:()=>HELLO+' Le téléphone qui répond quand on ne peut pas décrocher m’intéresse.\nMon commerce et ma commune : ',
 vids:()=>HELLO+' J’aimerais une pub pour mon commerce.\nMon commerce et ma commune : ',
 demo:()=>HELLO+' J’ai vu la démo Les Grèves. J’aimerais une entrée en 3D pour mon lieu.\nMon commerce et ma commune : ',
 q:()=>HELLO+' J’ai une question : ',
 lieu:()=>HELLO+' J’aimerais que vous veniez voir mon lieu.\nType de lieu, commune et le meilleur moment : ',
 vid:()=>HELLO+' J’aimerais un devis pour des vidéos courtes (Instagram, TikTok).\nMon commerce et ma commune : '};
if(SRC)document.querySelectorAll('a[data-wa]').forEach(a=>{const m=MSG[a.dataset.wa];if(m)a.href=wa(m())});
document.querySelectorAll('a[data-mail]').forEach(a=>{const m=MSG[a.dataset.mail];if(m)a.href=mail(a.dataset.mail==='imm'?'L’entrée 3D : mon commerce':'Ma maquette offerte',m().replace(/\n/,'\n\n'))});
/* Mesure, seulement si Umami est branché (umami.txt) : un clic sur WhatsApp, l'e-mail ou le téléphone compte comme un contact, avec le bouton et la source */
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="https://wa.me"],a[href^="mailto:"],a[href^="tel:"]');if(a&&window.umami)try{umami.track('contact',{par:a.href.startsWith('mailto')?'e-mail':a.href.startsWith('tel')?'téléphone':'whatsapp',bouton:a.dataset.wa||a.dataset.mail||a.id||'',source:SRC||'direct'})}catch(x){}});

/* Questions : ouverture et fermeture en 220 ms (le natif ne sait pas fermer en douceur) */
document.querySelectorAll('details').forEach(d=>{const s=d.querySelector('summary');d.addEventListener('toggle',()=>{if(d.open)requestAnimationFrame(()=>d.classList.add('is'));else d.classList.remove('is')});s.addEventListener('click',e=>{e.preventDefault();
 if(d.open){d.classList.remove('is');setTimeout(()=>{if(!d.classList.contains('is'))d.open=false},RM?0:230)}else{d.open=true;requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('is')))}})});

/* Un seul bouton WhatsApp à la fois : celui de la barre du haut s'efface quand un bouton de la page est à l'écran ;
   sur téléphone, la barre du bas arrive une fois l'accueil passé, et se retire tant qu'un autre bouton est visible */
/* le menu sur téléphone */
/* au doigt, WhatsApp s'ouvre directement (sans nouvel onglet : iOS passe la main à l'application) */
if(matchMedia('(pointer:coarse)').matches)document.querySelectorAll('a[href*="wa.me"][target]').forEach(a=>a.removeAttribute('target'));
(()=>{const w=document.querySelector('.nav-sub');if(!w)return;const b=w.querySelector('.nav-sb'),t=o=>{w.classList.toggle('open',o);b.setAttribute('aria-expanded',o)};   /* « Autres services » */
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

/* v20 : les entrées (.rv) : fondu + 12 px, une seule fois, à 20 % de visibilité */
(()=>{const els=document.querySelectorAll('.rv');if(!els.length)return;if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){els.forEach(e=>e.classList.add('on'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.2,rootMargin:'0px 0px -5% 0px'});els.forEach(e=>{if(e.getBoundingClientRect().top<innerHeight)e.classList.add('on');else io.observe(e)})})();
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
