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

