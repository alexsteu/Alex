/* La rue au crépuscule, en haut de page. v22 : une intro en trois temps, un seul film (img/e3d/w/<jeu>/, build.py) :
   0. l'affiche vivante : votre façade, de face, depuis le trottoir d'en face ; l'enseigne vide s'allume en pointillés (CSS seul, avant tout paquet) ;
   1. l'approche : on traverse la rue en filant vers le début de la rue (entree3d ?va=1&ap=1, images 0 … A-1) ;
   2. la marche : la caméra longe les six façades, à la hauteur de l'arrêt (le film du glissement, entree3d ?va=1, images A … A+72),
      chaque métier s'inscrit à son passage, et l'on s'arrête devant la vôtre (A+60).
   À l'arrêt, une carte en trois étapes, une à la fois : le métier (le glissement suit la tuile choisie), le nom (il s'allume sur l'enseigne), « Entrer ».
   Derrière la porte, la salle du métier (img/e3d/in-<métier>/), puis la fin de son site ; les rubriques du site suivent, sous la rue (e3d.js, E3S).
   Chaque image existe en basse définition (pour bouger tout de suite, paquets L) et nette (paquets H), en AVIF ou en WebP (e3get).
   Mouvement réduit : l'image de l'arrêt, immobile. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),cv=$('rCv'),cx=cv.getContext('2d'),poster=$('rPoster'),pins=$('rPins'),anchor=$('choix');
 const ld=u.querySelector('.r-load'),t1=u.querySelector('.r-t1'),says=[...u.querySelectorAll('.r-say')],stop=$('rStop'),cue=u.querySelector('.r-cue'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),nm=sign.querySelector('.r-nm'),mets=[...sign.querySelectorAll('.r-met i')],veil=u.querySelector('.r-veil'),seg=u.querySelector('.r-seg');
 /* la rue (D) : l'approche jusqu'à PA, la marche jusqu'à HOLD[0] (la caméra posée devant la vôtre), l'arrêt jusqu'au mur (GATE[1]), puis la porte et la salle (L) */
 const A={d:45,m:55},VAN=73,FAC={restaurant:0,boulangerie:12,coiffure:24,institut:36,onglerie:48,logement:72},HV=60,INS={d:56,m:64},STOP=.82,HOLD=[.75,.92],GATE=[.5,.92],END=.8,PA={d:.3,m:.25},store={},ins={};
 const COARSE=matchMedia('(pointer:coarse)').matches;let LIVE=!RM,frz=false,moved=false,kbY=-1,SW=1,set='d',want='',W=0,H=0,P=0,Q=0,cP=-1,cQ=0,cF=0,cI=0,last=-1,lastI=-1,raf=0,dirty=true,vis=true,D=1,L=1,hh=64,armed=false,t0=0,inA=0,mode=0,xa=0,dn=1;
 const NF=k=>A[k]+VAN,HOMEi=()=>A[set]+HV,FACi=k=>A[set]+FAC[k];
 const base=k=>'img/e3d/w/'+k+'/';
 /* le film : les paquets dans l'ordre où on les veut (build.py) : L0 (les 12 premières images, basse définition) d'abord, demandé dès le HTML (preload) ;
    L1 (le reste de l'approche), L2 (une image sur deux de la marche), H0 (l'arrêt et les six façades, nettes), puis le reste. Avant tout geste : jusqu'à H0. */
 const PK=['L0','L1','L2','H0','L3','H1','H2','H3'],AUTO=5;
 function load(k){let s=store[k];if(s){s.film.wake();return s}const n=NF(k);s=store[k]={n,got:0,req:0,pins:null,chain:Promise.resolve(),film:e3film(n,32,Math.round(cF),()=>{if(k===(want||set)){dirty=true;tick()}})};
  fetch(base(k)+'pins.json').then(r=>r.json()).then(j=>{s.pins=j;dirty=true;tick()}).catch(()=>{});
  if(!LIVE)return s;
  const slow=setTimeout(()=>{if(!s.film.any()&&k===set)ld.textContent='Chargement de la rue…'},1500);
  s.more=lv=>{while(s.req<Math.min(lv,PK.length)){const g=s.req++,nm=PK[g];s.chain=s.chain.then(()=>e3get('w/'+k+'/'+nm).then(l=>{const lo=nm[0]==='L';l.forEach(([i,b])=>lo?s.film.addLo(i,b):s.film.add(i,b));s.got=g+1;if(!g){clearTimeout(slow);if(ld.textContent==='Chargement de la rue…')ld.textContent=''}dirty=true;tick()}))
   .catch(()=>{if(!g){clearTimeout(slow);ld.textContent='';if(!s.film.any())flat();return}s.loose=true;s.got=Math.max(s.got,g+1);dirty=true;tick()})}};   /* un paquet absent : le film joue avec ce qu'il a (images plus espacées) plutôt que de rester figé */
  s.more(AUTO);if(moved)s.more(PK.length);return s}
 function more(){const s=store[set];if(s&&s.more&&(moved||P>.3))s.more(PK.length)}   /* les images nettes du reste : dès que la personne bouge (ou si elle arrive plus bas) */
 let armT=0,inOk=false;const arm=()=>{if(armed)return;armed=true;armT=performance.now();load(set)};
 /* la rue a ses premières images (ou n'en aura pas) : avant, le mur de l'arrêt reste fermé, même pour un nouveau geste */
 const rdy=()=>{const s=store[set];return !LIVE||!!(s&&(s.got>=3||s.loose))||armed&&performance.now()-armT>12000};
 const xh=u.querySelector('.r-x'),geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;const x=xh?xh.offsetHeight:0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight-x);L=Math.max(1,x+D*(1-GATE[1]));anchor.style.top=LIVE?(STOP*D)+'px':''};
 const curP=()=>(hh-walk.getBoundingClientRect().top)/D,yAt=p=>walk.getBoundingClientRect().top+scrollY-hh+p*D;
 /* redimensionner vide le canevas (rotation, barre d'adresse) : on y remet la dernière bonne image, étirée en « cover », jusqu'à la prochaine */
 const kc=document.createElement('canvas'),kx=kc.getContext('2d');let painted=false,shF=-1,lastS=0;
 function keep(){if(!painted||!W||!H)return;kc.width=W;kc.height=H;kx.drawImage(cv,0,0)}
 function back(){if(!painted||!kc.width)return;const sc=Math.max(W/kc.width,H/kc.height),w=kc.width*sc,h=kc.height*sc;cx.drawImage(kc,(W-w)/2,(H-h)/2,w,h)}
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*d),h=Math.round(r.height*d);
  SW=r.width||1;if(w!==W||h!==H){keep();W=cv.width=w;H=cv.height=h;back();dirty=true}
  /* v22 : en tournant le téléphone, la rue change de longueur : on reste au même endroit (à l'arrêt, la carte reste là) ; l'autre jeu d'images
     ne remplace l'ancien qu'une fois son image prête (plus d'image étirée en double exposition) */
  const k=r.width<r.height*.95?'m':'d',p0=D>1&&cP>=0?curP():-1;if(k!==set&&k!==want){if(!painted&&!store[set]){if(vx>=0)vx=vx-A[set]+A[k];set=k;want=''}else{want=k;if(armed||!LIVE)load(k)}}else if(k===set)want='';
  if(!LIVE)load(set);geo();if(p0>=0&&LIVE&&Math.abs(curP()-p0)>.002){e3halt();scrollTo({top:yAt(p0),behavior:'instant'})}}
 const mapF=(f,a,b)=>f<a?f:f-a+b;   /* le même endroit dans l'autre jeu (l'approche n'a pas le même nombre d'images) */
 function swap(){if(!want||want===set)return;const s=store[want];if(!painted||!store[set]){if(vx>=0)vx=vx-A[set]+A[want];set=want;want='';return}if(!s)return;
  const f=cF<A[set]?cF*A[want]/A[set]:cF-A[set]+A[want];if(!s.film.get(s.film.near(f)))return;
  if(store[set])store[set].film.sleep();snap();cF=f;vx=vx-A[set]+A[want];if(vg){vg.a=vg.a-A[set]+A[want];vg.b=vg.b-A[set]+A[want]}set=want;want='';shF=-1;dirty=true}
 /* le nom : sur l'enseigne vide, en néon. Seules les lettres nouvelles s'allument ; la largeur et la taille suivent en douceur. */
 let shown='';
 const fit=()=>{e3meas.font='400 86px "Cormorant Garamond"';const w=e3meas.measureText(shown).width;nm.style.setProperty('--w',Math.ceil(w)+'px');nm.style.setProperty('--s',Math.min(1,860/(w||1)).toFixed(3))};
 function named(v,push){const t=v.trim().slice(0,40);let k=0;while(k<t.length&&k<shown.length&&t[k]===shown[k])k++;
  const bs=[...nm.children];for(let i=bs.length-1;i>=k;i--)bs[i].remove();
  for(let i=k;i<t.length;i++){const b=document.createElement('b');b.textContent=t[i];if(push)b.className='in';b.style.animationDelay=Math.min(i-k,6)*35+'ms';nm.appendChild(b)}
  shown=t;sign.classList.toggle('on',!!t);fit();recall();
  if(push)E3S.set({name:v})}
 /* le métier : choisi à l'arrêt (une tuile), la caméra glisse jusqu'à sa façade, le nom passe sur son enseigne, et la porte est la sienne.
    Avant tout choix (première visite), la caméra reste devant la vôtre et aucune tuile n'est cochée. */
 let met='',mi=0,chosen=!!E3S.st.touched;
 const tiles=()=>[...seg.querySelectorAll('[data-m]')];
 function metier(k,push){if(!E3[k])return;const was=met;if(push)chosen=true;met=k;
  tiles().forEach(b=>{const on=chosen&&b.dataset.m===k;b.setAttribute('aria-checked',on);b.tabIndex=on||!chosen&&b===seg.firstElementChild?0:-1});
  if(k!==was){const a=mets[mi],b=mets[mi^=1];b.textContent=E3[k].lab;a.classList.remove('a');if(chosen)b.classList.add('a')}else if(chosen)mets[mi].classList.add('a');
  recall();if(k===was&&!push)return;
  if(push)E3S.set({sc:k});if(cv.width&&(mode||inA>.02&&!push))snap();wall();if(push)goMet(k);dirty=true;tick()}
 function goMet(k){rel();if(!LIVE||!(k in FAC)||!W)return;const p=curP();if(p<HOLD[0]-.02||p>GATE[1]+.01)return;
  went=true;const s=store[set];if(s&&s.more)s.more(PK.length);glideTo(FACi(k));if(s&&!s.film.get(Math.round(FACi(k))))ld.textContent='Vers la façade : '+E3[k].lab+'…'}
 const rwall=$('rWall');function wall(){if(rwall&&E3[met])e3pins(rwall,E3[met],E3S.st.name||'Votre nom ici')}
 /* le rappel, aux étapes 2 et 3 : « Coiffure · changer », « Café du Lac · Coiffure · modifier » */
 function recall(){const m=E3[met]?E3[met].lab:'';u.querySelectorAll('[data-rc-m]').forEach(e=>e.textContent=m);u.querySelectorAll('[data-rc-n]').forEach(e=>e.textContent=(shown?shown+' · ':'')+m)}
 metier(E3S.st.sc,false);
 /* ——— la carte, une étape à la fois : 1 le métier, 2 le nom, 3 « Entrer » ——— */
 let step=chosen?3:1,segT=0,segMe=0,segU=false;
 function go(n,focus){if(n!==2&&document.activeElement===nameIn){kbY=-1;nameIn.blur()}step=n;stop.dataset.step=n;const dots=stop.querySelectorAll('.r-dots i');dots.forEach((d,i)=>d.classList.toggle('on',i<n));
  stop.querySelectorAll('.r-s').forEach(el=>{const on=el.classList.contains('r-s'+n);el.hidden=!on;if(on){el.classList.remove('in');void el.offsetWidth;el.classList.add('in')}});
  if(n===1)centre(false);
  if(focus){const f=n===1?seg.querySelector('[tabindex="0"]'):n===2?nameIn:stop.querySelector('.r-enter');if(f&&(n!==2||!COARSE))f.focus({preventScroll:true});else stop.focus({preventScroll:true})}}
 go(step,false);
 stop.addEventListener('click',e=>{const b=e.target.closest('[data-to],.r-next,.r-pass');if(!b)return;e.preventDefault();
  if(b.classList.contains('r-next')){if(!chosen)metier(met,true);go(2,true)}else if(b.classList.contains('r-pass')){rel();go(3,true)}else go(+b.dataset.to,true)});
 /* les tuiles : un toucher choisit (et centre la tuile) ; toucher la tuile déjà choisie passe au nom. Au doigt, faire défiler le carrousel
    choisit la tuile qui s'arrête au centre (le glissement la suit). Au clavier : ← → (role=radiogroup). */
 seg.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;if(chosen&&b.dataset.m===met){if(went||!LIVE)go(2,true);else goMet(met);return}metier(b.dataset.m,true);centre(true)});
 seg.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const bs=tiles(),i=Math.max(0,bs.findIndex(b=>b.dataset.m===met)),n=e.key==='Home'?bs[0]:e.key==='End'?bs[bs.length-1]:bs[(i+(/Right|Down/.test(e.key)?1:bs.length-1))%bs.length];metier(n.dataset.m,true);n.focus();centre(true)});
 function centre(sm){const b=chosen&&seg.querySelector(`[data-m="${met}"]`);if(!b||seg.scrollWidth<=seg.clientWidth+2)return;const x=b.offsetLeft+b.offsetWidth/2-seg.clientWidth/2;segMe=performance.now();seg.scrollTo({left:x,behavior:sm&&!RM?'smooth':'instant'})}
 seg.addEventListener('scroll',()=>{if(!segU||performance.now()-segMe<700)return;clearTimeout(segT);segT=setTimeout(()=>{const c=seg.scrollLeft+seg.clientWidth/2;let best=null,bd=1e9;for(const b of tiles()){const d=Math.abs(b.offsetLeft+b.offsetWidth/2-c);if(d<bd){bd=d;best=b}}
  if(best&&(!chosen||best.dataset.m!==met))metier(best.dataset.m,true)},140)},{passive:true});
 for(const ev of ['pointerdown','touchstart','wheel','focusin'])seg.addEventListener(ev,()=>{if(ev!=='focusin')segU=true;more()},{passive:true});   /* le carrousel ne choisit qu'après un geste sur lui (pas l'aimantation du navigateur au chargement) */
 document.addEventListener('oonde-e3',e=>{if(e.detail.sc!==met)metier(e.detail.sc,false);if(e.detail.name&&!nameIn.value){nameIn.value=e.detail.name;named(e.detail.name,false)}wall()});
 u.querySelector('.r-enter').addEventListener('click',e=>{e.preventDefault();enter()});
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();nameIn.blur();go(3,true)}});
 {const v=E3S.st.name;if(v){nameIn.value=v;named(v,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(()=>{fit();wall();dirty=true;tick()});
 /* une image : les deux voisines fondues l'une dans l'autre (si elles sont décodées et à deux images au plus) ; les enseignes, interpolées de même */
 const pinAt=(s,i)=>s.pins&&s.pins[i]?s.pins[i].pins:null;
 const cover=im=>{const sc=Math.max(W/im.width,H/im.height),w=im.width*sc,h=im.height*sc;return{ox:(W-w)/2,oy:(H-h)/2,w,h}};
 const paintPair=(film,r,al)=>{const[i0,i1,a]=r,im=film.get(i0),b=cover(im);cx.globalAlpha=al;cx.drawImage(im,b.ox,b.oy,b.w,b.h);if(a>.01&&i1!==i0){const j=film.get(i1),c=cover(j);cx.globalAlpha=al*a;cx.drawImage(j,c.ox,c.oy,c.w,c.h)}cx.globalAlpha=1;return b};
 /* le passage d'une image à l'autre quand le contenu change d'un coup (autre métier, la salle qui s'allume) : l'ancienne image s'efface */
 const xc=document.createElement('canvas'),xx=xc.getContext('2d');
 function snap(){if(!W||!H||!painted)return;xc.width=W;xc.height=H;xx.drawImage(cv,0,0);xa=1}
 const fit2=(b,d)=>({ox:b.ox/d,oy:b.oy/d,w:b.w/d,h:b.h/d});
 /* la rue (approche, marche, arrêt, glissement) : une seule image de film, f */
 function draw(f){const s=store[set];if(!W||!H||!s)return;f=clamp(f,0,s.n-1);s.film.seek(f);const r=s.film.pair(f);if(!r)return;const[i0,i1,a]=r;
  /* l'affiche reste tant que l'image nette du début n'est pas là (pas d'affiche nette remplacée par sa version floue, au repos) */
  if(!painted&&f<.5&&!s.film.hi(0))return;
  const far=Math.min(Math.abs(i0-f),Math.abs(i1-f));if(!s.loose&&far>1.01&&(far>=Math.abs((shF<0?0:shF)-f)-1||performance.now()-lastS<1500))return;   /* jamais une image plus lointaine que celle qu'on voit déjà ; réseau lent : on se rapproche par étapes */
  shF=far>1.01?(Math.abs(i0-f)<Math.abs(i1-f)?i0:i1):f;if(window.__rd)__rd.push([Math.round(performance.now()),+f.toFixed(2),i0,i1,+a.toFixed(2),s.film.hi(i0)?1:0]);
  const b=paintPair(s.film,r,1);
  /* à l'arrêt : la salle du métier choisi s'allume derrière la vitrine (la première image de la suite, même cadrage) */
  const z=inCur(),z0=z&&z.film.get(0);if(z0&&inA>.003){const c=cover(z0);cx.globalAlpha=inA;cx.drawImage(z0,c.ox,c.oy,c.w,c.h);cx.globalAlpha=1}
  if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;
  const d=W/SW;place(remap(e3mix(pinAt(s,i0),pinAt(s,i1),a)),fit2(b,d),f);
  if(z0&&inA>.5&&z.pins)e3place(rwall,z.pins[0].pins,fit2(b,d));else e3place(rwall,null,null)}
 /* dans la salle : la suite du métier choisi ; le nom sur l'enseigne (dehors) puis au mur du fond */
 function drawIn(f){const z=inCur();if(!W||!H||!z)return false;f=clamp(f,0,z.n-1);z.film.seek(f);const r=z.film.pair(f);if(!r)return false;const[i0,i1,a]=r;if(Math.abs(i0-f)>1.01&&Math.abs(i1-f)>1.01)return false;
  if(window.__ri)__ri.push([i0,i1,+a.toFixed(2)]);
  const b=paintPair(z.film,r,1);if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;const d=W/SW,pp=z.pins?e3mix(pinAt(z,i0),pinAt(z,i1),a):null;
  place(pp&&cQ>.22?pp.filter(q=>q.id!=='sign'):pp,fit2(b,d),-1);e3place(rwall,pp,fit2(b,d));return true}   /* passé la porte, l'enseigne du dehors s'efface (plus de nom fantôme sous la barre) */
 /* les enseignes : le nom des métiers s'inscrit à leur passage, pendant la marche seulement ; à l'arrêt, seulement l'enseigne (le métier choisi s'écrit dessous) */
 let signQ=null;
 function place(pp,fb,f){const walkOn=f>=0&&f>A[set]-3&&!atStop0();for(const el of pins.children){const q=pp&&pp.find(x=>x.id===el.dataset.id);
  if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,127,fb);
  if(el===sign){el.style.opacity=q.vis;signQ={c:q.c,f:fb};continue}
  const mx=(q.c[0][0]+q.c[1][0])/2,near=clamp(1-Math.abs(mx-.5)/.42,0,1);el.style.opacity=walkOn?(q.vis*Math.min(1,near*1.8)).toFixed(2):0}}
 const atStop0=()=>cP>=HOLD[0]-.012&&cQ<.06;
 /* la suite, par métier (img/e3d/in-<métier>/<jeu>/) : p0 en approchant de l'arrêt, p1 et p2 à l'arrêt, p3 dès qu'on passe la porte.
    Les autres métiers dorment ; un jeu absent : la porte de la rue, en secours. */
 const inKey=()=>met+set+(went?'a':''),inCur=()=>{const z=ins[inKey()];return z&&!z.bad?z:null};
 function inGet(k,g){const z=ins[k];return e3get('in-'+z.m+'/'+z.k+'/p'+g,z.ac.signal).then(l=>l.forEach(([i,b])=>z.film.add(i,b)))}
 function need(lv){const s=store[set];if(!LIVE||!met||!W||!(s&&(s.got>=4||s.loose)))return;   /* l'ordre : la rue d'abord (jusqu'à ses façades nettes, H0), puis la salle du métier */
  if(lv===undefined)lv=cQ>0||gate==='open'&&cP>HOLD[0]?4:gate==='rested'||cP>=HOLD[0]-.02?3:cP>.5?1:0;if(!lv)return;
  const k=inKey();let z=ins[k];
  for(const j in ins)if(j!==k){const y=ins[j];if(y.film)y.film.sleep();if(y.req>y.got){y.gen++;y.req=y.got;y.ac.abort();y.ac=new AbortController()}}   /* le métier quitté : ses paquets en route sont annulés (on reprendra où il en était) */
  if(!z){z=ins[k]={m:met,k:set+(went?'a':''),n:INS[set],req:0,got:0,gen:0,ac:new AbortController(),pins:null,chain:Promise.resolve(),film:e3film(INS[set],24,0,()=>{if(k===inKey()){dirty=true;tick()}})};
   fetch(e3in(met)+z.k+'/pins.json').then(r=>r.json()).then(j=>{z.pins=j;dirty=true;tick()}).catch(()=>{})}
  else z.film.wake();
  while(z.req<lv){const g=z.req++,gen=z.gen;z.chain=z.chain.then(()=>{if(z.gen!==gen)return;return inGet(k,g).then(()=>{if(z.gen===gen)z.got=g+1})}).catch(()=>{if(z.gen!==gen)return;if(g===0){z.bad=true;if(went&&k===inKey())home();dirty=true;tick()}})}}   /* la porte de la façade absente : retour devant la vôtre */
 /* le rythme : l'approche (trapèze : départ doux, arrivée posée au début de la rue), puis la marche, qui ralentit sur son dernier quart (l'arrivée devant la vôtre) */
 const trap=(x,a,b,ra,rb)=>{const L=b-a,t=clamp(x-a,0,L),v=1/(L-ra/2-rb/2);return t<ra?v*t*t/(2*ra):t<=L-rb?v*(ra/2+t-ra):1-v*(L-t)**2/(2*rb)};
 function frameOf(P){const a=A[set],pa=PA[set];return P<pa?a*trap(P,0,pa,.03,.09):a+HV*trap(Math.min(P,HOLD[0]),pa,HOLD[0],.06,.2)}
 const inOf=q=>(INS[set]-1)*trap(q,0,END,.08,.14);   /* la suite : la porte, la salle, et un temps sur la fin du site */
 /* le glissement d'une façade à l'autre, à l'arrêt (0,8 à 1,4 s) ; vx : l'image du film à l'arrêt (la vôtre, HOMEi, ou celle du métier choisi) */
 let vx=-1,went=false,vg=null;
 const vdur=(a,b)=>{const d=Math.abs(b-a);return d>=36?1400:800+d/36*500};
 function glideTo(x){if(vx<0)vx=HOMEi();if(Math.abs(x-vx)<.01&&!vg)return;const s=store[set];vg={a:vx,b:x,t0:s&&s.film.dl(vx,x)?performance.now():0,q:performance.now(),dur:vdur(vx,x)};if(s){s.film.seek(vx+Math.sign(x-vx));s.film.boost(8)}dirty=true;tick()}
 function home(){went=false;glideTo(HOMEi())}
 /* le nom va sur l'enseigne de la façade choisie ; celle de l'arrêt (la vôtre) reste vide */
 const remap=pp=>pp&&went?pp.map(q=>q.id==='sign'?{...q,id:'_t'}:q.id===met?{...q,id:'sign'}:q):pp;
 const ss=x=>x*x*(3-2*x),fade=(a,b,c,d)=>ss(Math.min(clamp((cP-a)/(b-a||1),0,1),clamp((d-cP)/(d-c||1),0,1))),fq=(a,b,c,d)=>ss(Math.min(clamp((cQ-a)/(b-a||1),0,1),clamp((d-cQ)/(d-c||1),0,1)));
 /* les textes : opacity et transform seulement, et on n'écrit un style que s'il change */
 const memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}};
 const flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 const sbar=$('rSbar'),end=$('rEnd');
 /* l'arrivée à l'arrêt : l'enseigne pulse deux fois, puis la carte monte (rien n'apparaît avant d'être à l'arrêt) */
 let arrT=0;
 function ui(now){if(!LIVE)return;
  const h=ss(clamp((.1-cP)/.06,0,1));put(t1,'opacity',h.toFixed(3));flag(t1,'off',cP>.1);{const v=h.toFixed(2);if(veil.dataset.hv!==v){veil.dataset.hv=v;veil.style.setProperty('--hv',v)}}flag(document.body,'hero-cta',h>.5&&vis);put(cue,'opacity',clamp((.03-cP)/.03,0,1).toFixed(2));
  flag(u,'moving',cP>.004);   /* l'affiche vivante s'arrête dès qu'on part */
  const W3=[[.05,.08,.18,.22],[.3,.34,.47,.52]];   /* la première phrase pendant l'approche, la deuxième au début de la marche ; la troisième, une fois la porte passée */
  says.forEach((el,j)=>{const w=W3[j],o=w?fade(...w):mode===2||mode===1&&inOk?fq(.03,.07,.15,.21):0,a0=w?w[0]:.03,b0=w?w[1]:.07,x=w?cP:cQ;put(el,'opacity',o.toFixed(3));put(el,'transform',`translateY(${((1-ss(clamp((x-a0)/(b0-a0),0,1)))*14).toFixed(1)}px)`)});
  /* la carte : seulement la caméra posée à l'arrêt ; elle ne part qu'une fois le portail franchi */
  const here=frz||atStop0()&&(cF>=HOMEi()-.6||went||vg);if(here&&!arrT){arrT=now;flag(sign,'pulse',!shown&&!went);setTimeout(()=>flag(sign,'pulse',false),1300)}if(!here&&cP<HOLD[0]-.03)arrT=0;
  const e=frz?1:here&&now-arrT>=(shown||chosen?250:900)?1:0;
  if(stop._e!==e){stop._e=e;flag(stop,'on',!!e);flag(u,'stop',!!e)}
  flag(u,'past',cQ>.005);
  /* dans la salle : la barre du site du commerce, puis sa fin (le bouton du métier) */
  put(sbar,'opacity',(mode===2||mode===1&&inOk?ss(clamp((cQ-.3)/.1,0,1)):0).toFixed(3));
  const g=mode===2||mode===1&&inOk||end.classList.contains('kb')?ss(clamp((cQ-.66)/.1,0,1)):0;put(end,'opacity',g.toFixed(3));put(end,'transform',`translateY(${((1-g)*14).toFixed(1)}px)`);flag(end,'on',g>.5);
  if(cQ>.02&&!mode)ld.textContent='Chargement de la démo…';else if(ld.textContent==='Chargement de la démo…')ld.textContent=''}
 /* mouvement réduit : l'image de l'arrêt, et le nom posé sur son enseigne */
 function still(){const s=store[set];if(!s||!s.pins||!poster.naturalWidth)return;const i=HOMEi(),rw=SW,rh=scene.clientHeight,sc=Math.max(rw/poster.naturalWidth,rh/poster.naturalHeight),w=poster.naturalWidth*sc,h=poster.naturalHeight*sc;
  place(pinAt(s,i),{ox:(rw-w)/2,oy:(rh-h)/2,w,h},-1)}
 window.__e3=()=>{const z=ins[inKey()],s=store[set];return{mode,cF:+cF.toFixed(2),cI:+cI.toFixed(2),cP:+cP.toFixed(3),cQ:+cQ.toFixed(3),gate,key:inKey(),z:z&&{req:z.req,got:z.got,bad:!!z.bad,f0:!!z.film.get(0)},w:s&&{req:s.req,got:s.got,n:s.n},vx,went,vg:!!vg,home:HOMEi(),A:A[set],set,step,chosen,nudged,on:stop.classList.contains('on')}};   /* état, pour les tests */
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 /* le film suit sa cible sans jamais sauter une image : une image décodée à la fois, au plus une par image affichée */
 function follow(film,c,t,dt,rest){
  if(rest&&performance.now()-lastS>1500){const nt=film.near(t);if(film.get(nt)&&Math.abs(nt-t)<Math.abs(c-t)-1&&(!film.get(Math.round(c))||!film.dl(c,nt))){if(painted)snap();return nt}}
  if(film.get(Math.round(c))){if(rest)t=film.near(t);t=film.reach(c,t)}else t=c;const st=t-c;c+=clamp(st*(1-Math.exp(-dt/.07)),-1,1);return Math.abs(t-c)<.004?t:c}
 /* l'inertie : la page suit le défilement avec ~180 ms de retard, comme une caméra portée ; une fois arrêtée, elle se pose sur l'image nette la plus proche */
 function loop(now){raf=0;swap();const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;
  if(cP<0)geo();
  const r=walk.getBoundingClientRect(),y=hh-r.top;P=Math.max(0,y/D);Q=clamp((y-GATE[1]*D)/L,0,1);
  if(!LIVE){still();return}
  if(P>.3)more();
  if(cP<0){cP=P;cF=Math.round(frameOf(P));cQ=Q;cI=Math.round(inOf(Q));if(vx<0)vx=HOMEi()}
  /* le nom a le focus à l'arrêt : tout reste figé, même si le clavier du téléphone fait bouger la page */
  if(COARSE&&document.activeElement===nameIn&&cP>=HOLD[0]-.02&&cP<=HOLD[1]+.02)frz=true;
  if(!frz){cP+=(P-cP)*(1-Math.exp(-dt/.2));if(Math.abs(P-cP)<.0003)cP=P}
  cQ=clamp((cP*D-GATE[1]*D)/L,0,1);const rest=cP===P;need();
  const s0=store[set],F=frameOf(Math.min(cP,HOLD[1]));let tF=rest?Math.round(F):F;
  if(s0){if(rest&&!s0.loose&&performance.now()-lastS>1500){const nt=s0.film.near(Math.round(F));if(s0.film.get(nt)&&Math.abs(nt-F)<Math.abs(cF-F)-1&&(!s0.film.get(Math.round(cF))||!s0.film.dl(cF,nt))){snap();cF=tF=nt;dirty=true}}
   if(s0.loose&&s0.film.get(s0.film.near(cF))){if(!s0.film.get(Math.round(cF)))cF=s0.film.near(cF);if(rest)tF=s0.film.near(tF)}
   else if(s0.film.get(Math.round(cF))){if(rest)tF=s0.film.near(tF);tF=s0.film.reach(cF,tF)}else tF=cF}else tF=cF;   /* une image pas encore décodée : le film l'attend, il ne la saute pas */
  {const st=tF-cF,dl=st*(1-Math.exp(-dt/.07));cF+=clamp(dl,-1,1)}if(Math.abs(tF-cF)<.004)cF=tF;   /* une image au plus par image affichée : aucun trou, même lancé fort */
  /* le glissement avance avec le temps ; on repart vers la rue : retour devant la vôtre d'abord */
  if(went&&cP<HOLD[0]-.01)home();
  {const v=s0;if(vg&&v&&!vg.t0&&!v.film.dl(vg.a,vg.b)&&performance.now()-vg.q>(v.got>=6?0:900)){v.film.seek(vg.b);if(v.film.get(Math.round(vg.b))){snap();vx=vg.b;vg=null;dirty=true}}   /* réseau lent (des images manquent en route) : un fondu vers la façade d'arrivée */
   if(vg&&v&&!vg.t0&&v.film.dl(vg.a,vg.b)){vg.t0=now;v.film.seek(vx+Math.sign(vg.b-vx));v.film.boost(8)}
   if(ld.textContent.startsWith('Vers la façade')&&(!vg||vg.t0||!went))ld.textContent='';
   if(vg&&v&&vg.t0){const t=clamp((now-vg.t0)/vg.dur,0,1),e=trap(t,0,1,.06,.42);vx=vg.a+(vg.b-vg.a)*e;if(t>=1){vx=vg.b;vg=null;v.film.boost(4)}dirty=true}
   else if(vg&&!went&&!v){vx=HOMEi();vg=null}}
  const hm=HOMEi(),glid=went||vg||Math.abs(vx-hm)>.01,shownF=glid&&cF>=hm-.6?vx:cF;   /* à l'arrêt, après un choix de métier : l'image du glissement */
  if(cQ>.12&&cF<hm-.5&&inCur()&&inCur().film.get(0)){snap();cF=tF=hm;dirty=true}   /* passé le mur alors que la rue n'est pas encore à l'arrêt : un fondu, et la salle prend la suite */
  /* la salle s'allume à l'arrêt (la caméra posée, sa première image prête) ; s'éteint si l'on repart vers la rue */
  const z=inCur(),atStop=Math.abs(cF-hm)<.5&&cP>=HOLD[0]-.01&&!vg&&Math.abs(vx-(went?FACi(met):hm))<.05,ia=atStop&&z&&z.film.get(0)?1:0;
  if(inA!==ia){inA+=(ia-inA)*(1-Math.exp(-dt/.16));if(Math.abs(ia-inA)<.004)inA=ia;dirty=true}
  /* la suite : son image suit la position, sans trou, comme la rue */
  let tI=inOf(cQ);if(z&&cF>=hm-.5&&mode===1)cI=follow(z.film,cI,rest?Math.round(tI):tI,dt,rest);else cI=0;if(z&&mode!==1)z.film.seek(cI);
  const wantIn=(cQ>.0005||cI>.02)&&cF>=hm-.5&&!vg?1:0;if(mode!==1)inOk=false;
  if(wantIn&&z&&z.film.get(Math.round(cI))){if(!mode&&inA<.95)snap();mode=1}else if(!wantIn&&mode){mode=0;if(inA<.95)snap()}else if(wantIn&&!z&&ins[inKey()]&&ins[inKey()].bad)mode=2;else if(!wantIn)mode=0;
  if(xa>0){xa=Math.max(0,xa-dt/.35);dirty=true}
  if(mode===1){if(dirty||cI!==lastI){if(drawIn(cI))inOk=inOk||Math.abs(cI-inOf(cQ))<4||cI>(INS[set]-1)*.6;else if(!inOk)draw(shownF);lastI=cI;last=-1}}
  else if(mode===2){if(dirty||last!==hm){draw(hm);last=hm}}   /* secours : la rue reste à l'arrêt */
  else if(dirty||shownF!==last){draw(shownF);last=shownF;lastI=-1}
  /* une seule grande série d'images décodées à la fois : la rue dort dans la salle, la salle dort loin de l'arrêt */
  if(s0){if(cQ>.12)s0.film.sleep();else if(vis)s0.film.wake()}if(z&&cP<.5)z.film.sleep();
  ui(now);zoom();if(!frz&&(cP!==P||cF!==tF||Math.abs(cI-tI)>.004&&z||inA!==ia||xa>0||vg||now-arrT<1000))tick();else t0=0}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;const s=store[set];if(s){if(vis)s.film.wake();else s.film.sleep()}tick()},{rootMargin:'50% 0px'}).observe(walk);   /* loin de la rue : ses images décodées sont libérées */
 poster.addEventListener('error',()=>{poster.style.visibility='hidden'});
 function toStill(){u.classList.add('static');poster.addEventListener('load',tick);const k=r0();poster.src=base(k)+'stop.jpg';poster.parentNode.querySelectorAll('source').forEach(s=>s.remove())}
 if(!LIVE)toStill();
 /* le film ne vient pas (réseau, fichier absent) : la page passe au rendu fixe, comme en mouvement réduit ; rien ne bloque l'offre ni le contact */
 function flat(){if(!LIVE)return;const deep=walk.getBoundingClientRect().top<-innerHeight*.3;LIVE=false;t1.classList.remove('off');u.classList.add('nofilm');document.body.classList.remove('hero-cta');
  for(const el of [t1,...says,stop,cue,sbar,end]){el.style.opacity='';el.style.visibility='';el.style.transform='';el.style.translate=''}memo.clear();toStill();geo();if(deep)stop.scrollIntoView({block:'start'})}
 function r0(){return scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d'}
 addEventListener('resize',()=>{size();tick()});
 /* retour d'un autre onglet, de l'arrière-plan ou du cache (bouton Retour) : on redessine (iOS peut avoir vidé le canevas) */
 const redo=()=>{const s=store[set];if(s&&vis)s.film.wake();size();dirty=true;last=-1;lastI=-1;tick()};
 addEventListener('pageshow',e=>{if(e.persisted)redo()});document.addEventListener('visibilitychange',()=>{if(!document.hidden)redo()});
 if(LIVE){addEventListener('scroll',()=>{lastS=performance.now();arm();if(vis)tick()},{passive:true});
  for(const ev of ['wheel','touchstart','keydown','pointerdown'])addEventListener(ev,()=>{moved=true;arm();more()},{passive:true,once:true});
  {const pm=e=>{if(e.pointerType!=='mouse'||!(e.movementX||e.movementY))return;removeEventListener('pointermove',pm);moved=true;more()};addEventListener('pointermove',pm,{passive:true})}   /* le reste dès que la souris bouge vraiment */
  requestAnimationFrame(()=>u.classList.add('go'))}else u.classList.add('go');
 /* « Voir la démo », « La démo », « Passer l'intro » : tous vont à l'arrêt (le portail reste fermé : on y choisit d'abord) */
 const toStop=()=>{arm();geo();if(LIVE)e3glide(yAt(STOP));else stop.scrollIntoView({block:'nearest'})};
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href="#choix"]');if(!a)return;e.preventDefault();toStop()});
 /* « Entrer » : la porte s'ouvre, on traverse la salle jusqu'à la fin du site */
 const yQ=q=>walk.getBoundingClientRect().top+scrollY-hh+GATE[1]*D+q*L;
 function enter(){rel();arm();geo();open(3000);need(4);if(LIVE)e3glide(yQ(END),1900);else end.scrollIntoView({block:'nearest'})}
 end.addEventListener('focusout',e=>{if(!end.contains(e.relatedTarget))end.classList.remove('kb')});
 const kb=e=>{try{return e.target.matches(':focus-visible')}catch(_){return false}},jump=(y,ms,e)=>{if(kb(e)){e3halt();scrollTo({top:y,behavior:'instant'})}else e3glide(y,ms)};
 end.addEventListener('focusin',e=>{end.classList.add('kb');if(LIVE&&!end.classList.contains('on')){open(3000);need(4);geo();jump(yQ(END),600,e)}});
 if(new URLSearchParams(location.search).get('e')&&!location.hash)addEventListener('load',()=>setTimeout(toStop,80),{once:true});
 /* au clavier : entrer dans la carte (Tab) amène la caméra à l'arrêt */
 stop.addEventListener('focusin',e=>{if(LIVE&&!u.classList.contains('stop')){if(kb(e)){arm();geo();jump(yAt(STOP),0,e);arrT=performance.now()-2000}else toStop()}});
 t1.addEventListener('focusin',e=>{if(LIVE&&t1.classList.contains('off'))jump(yAt(0),undefined,e)});
 /* ——— le clavier du téléphone : la carte de l'étape 2 se colle au-dessus du clavier, sur une ligne ; la scène se recadre sur l'enseigne (jusqu'à ×1,6, l'enseigne entière à l'écran) ——— */
 nameIn.addEventListener('focus',()=>{kbY=scrollY;if(step!==2)go(2,false)});
 function rel(){if(document.activeElement===nameIn){kbY=-1;nameIn.blur()}}
 let kbH=0;
 nameIn.addEventListener('blur',e=>{const was=frz;frz=false;kbH=0;stop.style.setProperty('--kb','0px');flag(stop,'kbo',false);
  const to=e.relatedTarget;if(step===2&&!(to&&stop.contains(to)))setTimeout(()=>{if(step===2&&document.activeElement!==nameIn&&!stop.contains(document.activeElement))go(3,false)},0);   /* « Terminé » ou toucher hors du champ : l'étape 3 */
  if(was&&LIVE&&kbY>=0&&Math.abs(scrollY-kbY)>4){const y=kbY;requestAnimationFrame(()=>e3glide(y,420))}kbY=-1;tick()});
 const vv=window.visualViewport;if(vv){const k=()=>{const o=document.activeElement===nameIn?Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop)):0;kbH=o;stop.style.setProperty('--kb',o+'px');flag(stop,'kbo',o>40);tick()};vv.addEventListener('resize',k);vv.addEventListener('scroll',k)}
 let zm='';
 function zoom(){let t='';if(COARSE&&kbH>40&&signQ&&document.activeElement===nameIn){const sr=stg.getBoundingClientRect(),c=signQ.c,f=signQ.f,sx=f.ox+(c[0][0]+c[1][0])/2*f.w,sy=f.oy+(c[0][1]+c[3][1])/2*f.h,sw=Math.abs(c[1][0]-c[0][0])*f.w,S=clamp(.88*sr.width/(sw||1),1,1.6);
   const top=Math.max(sr.top,(vv?vv.offsetTop:0))-sr.top,bot=(vv?vv.offsetTop+vv.height:innerHeight)-72-sr.top,ty=(top+bot)/2;
   t=`translate(${(sr.width/2-sx).toFixed(1)}px,${(ty-sy).toFixed(1)}px) scale(${S})`;scene.style.transformOrigin=sx.toFixed(1)+'px '+sy.toFixed(1)+'px'}
  if(t!==zm){zm=t;scene.style.transform=t;flag(u,'zoom',!!t)}}
 /* ——— le portail. Un lancer, même fort, s'arrête à l'arrêt ; pour continuer, il faut un nouveau geste une fois arrivé.
    v22 : aux étapes 1 et 2, le premier glissé neuf ne passe pas (« Continuer sans choisir ↓ », 2 s), le second passe ; à l'étape 3, le premier passe.
    « Entrer », un lien, « Passer l'intro » passent toujours. Remonter n'est jamais bloqué ; arriver d'en dessous (ou par un lien) ouvre le portail. ——— */
 let nudged=false,nt=0,tY0=-1,swp=false;const nudge=()=>{nudged=true;u.classList.add('push');clearTimeout(nt);nt=setTimeout(()=>u.classList.remove('push'),2000)};
 const pass1=()=>{if(step===3||nudged)open();else nudge()};
 let gate='closed',pP=-1,lastW=0,rt=0,wt=0,tY=-1,pass=0,w0=0,wMax=0,pt=0;
 const rest=()=>{const p=curP();if(gate==='closed'&&p>=HOLD[0]-.03&&p<=GATE[1]+.005&&!e3touch.n&&performance.now()-lastW>350)gate='rested'};
 const open=(ms=0)=>{gate='open';u.classList.remove('push');if(ms)pass=performance.now()+ms};
 if(LIVE){
  addEventListener('scroll',()=>{const p=curP();clearTimeout(rt);rt=setTimeout(rest,320);
   if(p<GATE[0]-.03){if(performance.now()>pass)gate='closed'}if(p<HOLD[0]-.06)nudged=false;
   if(gate!=='open'&&pP<0&&p>GATE[1]+.01)gate='open';
   else if(gate!=='open'&&pP>=0&&pP>GATE[1]+.01&&p>GATE[1]+.01)gate='open';
   else if((gate!=='open'||!rdy()&&performance.now()>pass&&pP<=GATE[1]+.01)&&pP>=0&&p>GATE[1]+.002&&!e3gliding()){geo();scrollTo({top:yAt(GATE[1]),behavior:'instant'});pP=GATE[1];
    if(COARSE){const h=document.documentElement;h.style.overflow='hidden';setTimeout(()=>{h.style.overflow=''},160)}return}   /* le mur ; au doigt, l'élan est coupé */
   pP=p},{passive:true});
  addEventListener('wheel',e=>{const t=performance.now(),quiet=t-lastW>350;lastW=t;if(e.deltaY<=0)return;
   if(gate==='rested'&&quiet){pass1();if(gate==='open')return}
   if((gate!=='open'||!rdy()&&performance.now()>pass)&&curP()>=GATE[1]-.012&&curP()<GATE[1]+.05){e.preventDefault();
    if(quiet||!w0||!rdy()){w0=t;wMax=0}wMax=Math.max(wMax,e.deltaY);u.classList.add('push');clearTimeout(pt);pt=setTimeout(()=>u.classList.remove('push'),2600);
    if(t-w0>1200&&e.deltaY>=Math.max(4,wMax*.6)){w0=0;open();return}   /* roulette tenue ~1,2 s : on continue */
    clearTimeout(wt);wt=setTimeout(()=>{if(gate!=='open'&&Math.abs(curP()-STOP)>.012){geo();e3glide(yAt(STOP))}},300)}},{passive:false});
  {const mb=u.querySelector('.r-more');if(mb)mb.addEventListener('click',()=>{open(1500);e3glide(scrollY+innerHeight*.7)})}
  addEventListener('touchstart',e=>{tY=e.touches[0]?e.touches[0].clientY:-1;tY0=tY;swp=false},{passive:true,capture:true});
  addEventListener('touchmove',e=>{const y=e.touches[0]?e.touches[0].clientY:-1;const up=tY>=0&&y<tY;tY=y;
   if(!swp&&tY0>=0&&tY0-y>10&&!(e.target.closest&&e.target.closest('.r-seg'))){swp=true;if(gate==='rested')pass1()}   /* un glissé vers le bas de la page (pas un tap, pas le carrousel) */
   if((gate!=='open'||!rdy()&&performance.now()>pass)&&up&&e.cancelable&&curP()>=GATE[1]-.004&&curP()<GATE[1]+.05)e.preventDefault()},{passive:false});
  addEventListener('touchend',()=>{clearTimeout(rt);rt=setTimeout(rest,320)},{passive:true});
  addEventListener('keydown',e=>{if(e.target===nameIn&&e.key!=='Tab')return;if(e.target.closest&&e.target.closest('.r-seg')&&/Arrow|Home|End/.test(e.key))return;if(gate==='rested'||['Tab','End','Home'].includes(e.key))open()},true);
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('a[href*="#"]:not([href="#choix"]),.r-enter'))open(3000)},true)}
 /* à l'arrêt, au doigt : un tap qui bouge un peu (jusqu'à 14 px) reste un tap ; le navigateur, lui, l'aurait pris pour un défilement */
 {let t0=null;stop.addEventListener('touchstart',e=>{const el=e.target.closest('a,button,input');const q=e.touches[0];t0=el&&q&&e.touches.length===1&&!e.target.closest('.r-seg')?{el,x:q.clientX,y:q.clientY,t:performance.now(),m:0}:null},{passive:true});
  stop.addEventListener('touchmove',e=>{const q=e.touches[0];if(t0&&q)t0.m=Math.max(t0.m,Math.hypot(q.clientX-t0.x,q.clientY-t0.y))},{passive:true});
  stop.addEventListener('touchend',e=>{const k=t0;t0=null;if(!k)return;const q=e.changedTouches[0];if(!q)return;const m=Math.max(k.m,Math.hypot(q.clientX-k.x,q.clientY-k.y));
   if(m>14||performance.now()-k.t>800)return;const h=document.elementFromPoint(q.clientX,q.clientY);if(!h||!(k.el.contains(h)||h.contains(k.el)))return;
   if(e.cancelable)e.preventDefault();if(k.el.tagName==='INPUT')k.el.focus();else{if(k.el!==nameIn&&!k.el.closest('.r-s2'))rel();k.el.click()}},{passive:false})}
 /* l'aimantation : arrêté juste avant l'arrivée, on se pose à l'arrêt ; dans la salle, en avant la fin du site, en arrière l'arrêt.
    Jamais doigt posé, jamais pendant la frappe ; le moindre geste l'arrête (e3glide). */
 if(LIVE){let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!LIVE||!vis||frz||e3touch.n)return;
  geo();const t=gate==='open'&&Q>.012&&Q<END-.01?(dn>0?yQ(END):yAt(STOP)):P>=HOLD[0]-.06&&P<HOLD[0]&&Q<=.012?yAt(HOLD[0]+.01):gate!=='open'&&P>STOP+.02&&P<=GATE[1]+.005?yAt(STOP):-1;   /* v22 : un glissé retenu contre le mur revient se poser à l'arrêt (la carte, l'enseigne) */if(t>=0)e3glide(t)},260)},{passive:true})}
 {let y0=scrollY;addEventListener('scroll',()=>{const d=scrollY-y0;if(Math.abs(d)>2)dn=d>0?1:-1;y0=scrollY},{passive:true})}
 /* la première mesure attend la première image : l'analyse de la page n'est pas allongée d'une mise en page forcée.
    Le film se charge tout de suite (le premier paquet est déjà demandé par le HTML, en preload) */
 requestAnimationFrame(()=>{size();if(LIVE)arm();ui(performance.now());tick()});
 /* sans le film (mouvement réduit) : le WhatsApp de l'en-tête se retire tant que celui du titre est à l'écran */
 {const w=u.querySelector('.r-wa');if(w)new IntersectionObserver(es=>{if(!LIVE)flag(document.body,'hero-cta',es[0].isIntersecting)},{rootMargin:'-64px 0px 0px 0px'}).observe(w)}
})();
