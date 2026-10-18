
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
/* La démo : la visite Les Grèves. Le cadre se fige ; faire défiler fait avancer la caméra, image par image,
   puis le site du lieu monte dans le cadre. Les images (une sur huit, puis une sur quatre, deux, toutes) ne se
   chargent qu'à l'approche, après la page. Mouvement réduit ou sans JavaScript : l'image et le site posés. */
(()=>{const walk=$('walk'),stg=$('wStage'),view=$('wView'),cv=$('wCv'),cx=cv.getContext('2d'),site=$('wSite'),bar=$('wBar'),fill=$('wFill'),toast=$('wToast');
 const chs=[...view.querySelectorAll('.w-ch')],c3=view.querySelector('.c3'),ks=[...view.querySelectorAll('[data-k]')],poster=view.querySelector('.w-poster img');
 const LIVE=!RM;
 let hh=64,D=1,P=0,cur=0,raf=0,last=-1,vis=false,dirty=true,drawn=null,W=0,H=0;
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight)};
 /* « Réserver », le menu, le logo : le faux site réagit comme un vrai */
 const goTo=p=>{if(!LIVE){(p>=.8?site:view).scrollIntoView({block:'start'});return}geo();scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+p*D})};
 const open=o=>{toast.hidden=!o;if(o)$('wWa').focus({preventScroll:true})};
 view.addEventListener('click',e=>{const g=e.target.closest('[data-go]'),b=e.target.closest('[data-book]');
  if(g){open(false);goTo(+g.dataset.go)}else if(b)open(true);else if(e.target.closest('#wX'))open(false)});
 view.addEventListener('keydown',e=>{if(e.key==='Escape'&&!toast.hidden){open(false);view.querySelector('.w-book').focus()}});
 if(!LIVE)return;
 /* 1. Images : jeu « ordinateur » (16:10) ou « téléphone » (portrait), selon la forme du cadre */
 const SETS={d:96,m:72},store={};let set='';
 const near=(k,i)=>{const s=store[k];if(!s)return null;const n=SETS[k];for(let d=0;d<n;d++){if(i-d>=0&&s.ok[i-d])return s.img[i-d];if(i+d<n&&s.ok[i+d])return s.img[i+d]}return null};
 function load(k){if(store[k])return;const n=SETS[k],s=store[k]={img:new Array(n),ok:new Uint8Array(n)},order=[],seen=new Set([n-1]);
  order.push(0,n-1);seen.add(0);for(const st of[8,4,2,1])for(let i=0;i<n;i+=st)if(!seen.has(i)){seen.add(i);order.push(i)}
  let q=0;const next=()=>{if(q>=order.length)return;const i=order[q++],im=new Image();im.decoding='async';im.src=`img/greves/${k}/f${String(i).padStart(3,'0')}.webp`;
   im.onload=()=>{(im.decode?im.decode():Promise.resolve()).catch(()=>{}).then(()=>{s.img[i]=im;s.ok[i]=1;if(k===set)dirty=true;tick();next()})};im.onerror=next};
  for(let c=0;c<4;c++)next()}
 let armed=false;
 function size(){const r=view.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=cv.width=Math.round(r.width*d);H=cv.height=Math.round(r.height*d);
  set=r.width<r.height*.95?'m':'d';if(armed)load(set);geo();dirty=true}
 /* 2. Rythme : la part du défilement figé (P) donne la position de la caméra (p). La porte est franchie à p = 0,53. */
 const K=[[0,0],[.03,0],[.25,.53],[.55,.85],[.66,1],[1,1]];
 const camOf=P=>{for(let j=1;j<K.length;j++)if(P<=K[j][0]){const[a,pa]=K[j-1],[b,pb]=K[j],t=(P-a)/(b-a||1);return pa+(pb-pa)*(j===4?1-(1-t)*(1-t):t)}return 1};
 const ease=t=>1-Math.pow(1-t,3);
 /* 3. Dessin : l'image la plus proche déjà chargée (pas de fondu : il dédouble l'image à l'arrêt) */
 function draw(p){if(!W||!H)return;let im=near(set,Math.round(p*(SETS[set]-1)));
  if(!im){const o=set==='d'?'m':'d';im=near(o,Math.round(p*(SETS[o]-1)))}
  if(!im||(im===drawn&&!dirty))return;const s=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
  cx.drawImage(im,(W-w)/2,(H-h)/2,w,h);drawn=im;dirty=false;view.classList.add('live')}
 /* 4. Textes, barre de progression, et le site qui monte */
 function ui(p){
  for(const c of chs){const i=+c.dataset.in,o=+c.dataset.out;let a=i<0?clamp((o-P)/.06,0,1):Math.min(clamp((P-i)/.04,0,1),clamp((o-P)/.04,0,1));
   const s=c===c3?ease(clamp((P-.68)/.22,0,1)):0;c.style.opacity=Math.max(0,a*(1-s*1.4));c.style.transform=`translateY(${(1-a)*14-s*260}px)`;
   const on=a>.5&&s<.5;c.classList.toggle('on',on);if(c===c3)c.inert=!on}
  const s=ease(clamp((P-.68)/.27,0,1)),mob=W<H;site.style.transform=`translateY(${(1-s)*110}%)`;site.inert=s<.5;
  const band=parseFloat(getComputedStyle(site).top)||150,vh=view.clientHeight,y=`translateY(${-s*Math.max(0,vh*(mob?.5:.56)-band*.6)}px)`;cv.style.transform=y;poster.style.transform=y;
  bar.classList.toggle('solid',s>.82);view.querySelector('.w-prog').style.opacity=1-Math.min(1,s*2.5);
  fill.style.width=(p*100)+'%';const k=p<.53?1:p<.85?2:3;ks.forEach(x=>x.classList.toggle('on',+x.dataset.k===k))}
 /* 5. Boucle : la position affichée rattrape la cible en ~80 ms ; rien ne tourne quand la démo est loin */
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 function loop(){raf=0;const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  document.body.classList.toggle('walking',r.top<=hh+1&&r.bottom>=innerHeight-1);
  const t=camOf(P);cur+=(t-cur)*.22;if(Math.abs(t-cur)<.0005)cur=t;
  if(dirty||cur!==last){draw(cur);last=cur}ui(cur);if(cur!==t)tick()}
 const arm=()=>{armed=true;load(set)};
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(!vis)open(false);tick()}).observe(walk);
 const go=()=>new IntersectionObserver(es=>{if(es[0].isIntersecting&&!armed)arm()},{rootMargin:'100% 0px'}).observe(walk);
 document.readyState==='complete'?go():addEventListener('load',go,{once:true});
 addEventListener('scroll',()=>{if(vis)tick()},{passive:true});

 /* 6. Arrêt entre deux moments : la visite se pose doucement sur le plus proche (l'arrivée, le salon, la vue, le site) */
 const STOPS=[0,.40,.66,1];let idle=0;
 addEventListener('scroll',()=>{clearTimeout(idle);idle=setTimeout(()=>{if(!vis||P<=0||P>=1)return;const n=STOPS.reduce((a,b)=>Math.abs(b-P)<Math.abs(a-P)?b:a);
  if(Math.abs(n-P)>.015&&Math.abs(n-P)<.12)scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+n*D,behavior:'smooth'})},220)},{passive:true});
 addEventListener('resize',()=>{size();tick()});size();ui(0);tick();
})();
/* l'écran collant : l'image suit la phrase lue */
(()=>{const im=document.querySelectorAll('.sk-v img'),st=document.querySelectorAll('.sk-s');if(!im.length||!('IntersectionObserver' in window))return;
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=[...st].indexOf(e.target);im.forEach((x,j)=>x.classList.toggle('on',j===i))}}),{rootMargin:'-45% 0px -45% 0px'});st.forEach(x=>io.observe(x))})();
