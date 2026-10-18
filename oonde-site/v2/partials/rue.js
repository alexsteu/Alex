/* La rue au crépuscule, en haut de page. Faire défiler fait avancer la caméra image par image (rendu d'avance,
   entree3d/scenes/rue.js) : un tour autour du réverbère bleu, la rue, les vitrines, puis l'arrêt devant une enseigne vide
   où le visiteur tape son nom et choisit son métier. C'est la démo (v19) : derrière la vitrine, la salle de son métier ;
   un nouveau geste passe la porte (entree3d ?int=<métier>, img/e3d/in-<métier>/), le nom est au mur du fond, et la rue
   finit sur la fin de son site, avec le bouton du métier (Démo). Les rubriques du site suivent, sous la rue (e3d.js, E3S).
   La première image est une affiche légère ; les images du film se chargent une fois la page posée.
   Les images sont placées à pas égal pour l'œil (entree3d/tools/plist.mjs) : un pas de défilement = une image, partout.
   Mouvement réduit : l'image de l'arrêt, immobile. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),cv=$('rCv'),cx=cv.getContext('2d'),poster=$('rPoster'),pins=$('rPins'),anchor=$('choix');
 const ld=u.querySelector('.r-load'),t1=u.querySelector('.r-t1'),says=[...u.querySelectorAll('.r-say')],stop=$('rStop'),cue=u.querySelector('.r-cue'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),nm=sign.querySelector('.r-nm'),mets=[...sign.querySelectorAll('.r-met i')],veil=u.querySelector('.r-veil'),seg=u.querySelector('.r-seg'),rsel=$('rSel');
 let LIVE=!RM;const SETS={d:200,m:160},INS={d:56,m:64},STOP=.78,HOLD=[.66,.90],GATE=[.30,.90],END=.8,store={},ins={};   /* GATE : la zone de capture de l'arrêt, et son mur */
 const COARSE=matchMedia('(pointer:coarse)').matches;let frz=false,moved=false,kbY=-1,SW=1,set='d',W=0,H=0,P=0,Q=0,cP=-1,cQ=0,cF=0,cI=0,last=-1,lastI=-1,raf=0,dirty=true,vis=true,D=1,L=1,hh=64,armed=false,t0=0,inA=0,mode=0,xa=0,dn=1;
 const base=k=>'img/e3d/rue/'+k+'/';
 /* les images arrivent en 4 paquets (build.py, pack()) : une sur 8 d'abord, puis le reste entre deux */
 function load(k){if(store[k]){store[k].film.wake();return}const n=SETS[k],s=store[k]={film:e3film(n,24,Math.round(cF)||S0[k],()=>{if(k===set){dirty=true;tick()}}),pins:null};
  fetch(base(k)+'pins.json').then(r=>r.json()).then(j=>{s.pins=j;s.k1=j.findIndex(x=>x.p>=.88);dirty=true;tick()}).catch(()=>{});
  if(!LIVE)return;
  const get=g=>e3pack(base(k)+'p'+g+'.txt').then(l=>l.forEach(([i,b])=>s.film.add(i,b)));   /* décodage hors du fil principal (e3d.js) */
  /* tant que le premier paquet n'est pas là, l'affiche reste ; s'il tarde, un mot discret ; s'il échoue, l'affiche (ou le fond) reste et le texte continue */
  const slow=setTimeout(()=>{if(!s.film.any()&&k===set)ld.textContent='Chargement de la rue…'},1200);
  get(0).then(()=>{clearTimeout(slow);ld.textContent='';return get(1)}).then(()=>get(2)).then(()=>{s.p3=()=>{s.p3=null;get(3).catch(()=>{})};more()},   /* v20.1 : p0, p1 et p2 dès que la page est posée (une image sur deux : le premier lancer n'a plus de trou) ; p3 au premier geste */()=>{clearTimeout(slow);ld.textContent='';if(!s.film.any()){flat();return}s.loose=true;dirty=true;tick()})   /* p1 ou p2 absents : le film joue avec ce qu'il a (images plus espacées) plutôt que de rester figé */   /* p3 (les images impaires, le plus lourd) : seulement si l'on avance vraiment */
   .catch(()=>{clearTimeout(slow);ld.textContent='';if(!s.film.any())flat()})}
 function more(){const s=store[set];if(!s||!(P>.4||moved))return;if(s.p3)s.p3()}   /* p3 : dès que la personne bouge (ou si elle arrive plus bas) */
 const arm=()=>{if(armed)return;armed=true;load(set)};
 const xh=u.querySelector('.r-x'),geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;const x=xh?xh.offsetHeight:0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight-x);L=Math.max(1,x+D*(1-GATE[1]));anchor.style.top=LIVE?(STOP*D)+'px':''};   /* D : la rue ; L : la suite (de son mur à la fin de la marche) */
 /* v20.1 : redimensionner vide le canevas (rotation, barre d'adresse, autre jeu d'images) : on y remet la dernière bonne image,
    étirée en « cover », jusqu'à la prochaine ; jamais un canevas noir */
 const kc=document.createElement('canvas'),kx=kc.getContext('2d');let painted=false,shF=-1,lastS=0;
 function keep(){if(!painted||!W||!H)return;kc.width=W;kc.height=H;kx.drawImage(cv,0,0)}
 function back(){if(!painted||!kc.width)return;const sc=Math.max(W/kc.width,H/kc.height),w=kc.width*sc,h=kc.height*sc;cx.drawImage(kc,(W-w)/2,(H-h)/2,w,h)}
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*d),h=Math.round(r.height*d);
  SW=r.width||1;if(w!==W||h!==H){keep();W=cv.width=w;H=cv.height=h;back();dirty=true}   /* la barre d'adresse du téléphone bouge : on ne vide le canevas que si sa taille change */
  const k=r.width<r.height*.95?'m':'d';if(k!==set){if(store[set])store[set].film.sleep();set=k;shF=-1;if(armed)load(k)}if(!LIVE)load(k);geo()}
 /* le nom : sur l'enseigne vide, en néon. Seules les lettres nouvelles s'allument (les autres ne bougent pas) ;
    la largeur et la taille suivent en douceur (transition sur width et scale), sans à-coup. Il passe aussi sur l'entrée plus bas. */
 let shown='';
 const fit=()=>{e3meas.font='400 86px "Cormorant Garamond"';const w=e3meas.measureText(shown).width;nm.style.setProperty('--w',Math.ceil(w)+'px');nm.style.setProperty('--s',Math.min(1,860/(w||1)).toFixed(3))};
 function named(v,push){const t=v.trim().slice(0,40);let k=0;while(k<t.length&&k<shown.length&&t[k]===shown[k])k++;
  const bs=[...nm.children];for(let i=bs.length-1;i>=k;i--)bs[i].remove();
  for(let i=k;i<t.length;i++){const b=document.createElement('b');b.textContent=t[i];if(push)b.className='in';b.style.animationDelay=Math.min(i-k,6)*35+'ms';nm.appendChild(b)}
  shown=t;sign.classList.toggle('on',!!t);fit();
  if(push)E3S.set({name:v})}
 /* le métier : choisi sur place, il s'écrit sous l'enseigne (fondu enchaîné) et prépare la démo, sans quitter la rue.
    Derrière la vitrine, sa salle s'allume (fondu) ; « Entrer » y va. Le nom et le métier suivent jusque dans le message WhatsApp (e3d.js). */
 let met='',mi=0;
 function metier(k,push){if(!E3[k]||k===met)return;met=k;
  [...seg.children].forEach(b=>{const on=b.dataset.m===k;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});rsel.value=k;
  const a=mets[mi],b=mets[mi^=1];b.textContent=E3[k].lab;a.classList.remove('a');b.classList.add('a');
  if(push)E3S.set({sc:k});if(cv.width&&(mode||inA>.02))snap();wall();dirty=true;tick()}   /* need() suit, dans la boucle */
 seg.addEventListener('click',e=>{const b=e.target.closest('button');if(b)metier(b.dataset.m,true)});
 seg.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const bs=[...seg.children],i=bs.findIndex(b=>b.dataset.m===met),n=bs[(i+(/Right|Down/.test(e.key)?1:bs.length-1))%bs.length];metier(n.dataset.m,true);n.focus()});
 rsel.addEventListener('change',()=>metier(rsel.value,true));
 document.addEventListener('oonde-e3',e=>{metier(e.detail.sc,false);if(e.detail.name&&!nameIn.value){nameIn.value=e.detail.name;named(e.detail.name,false)}wall()});
 const rwall=$('rWall');function wall(){if(rwall&&E3[met])e3pins(rwall,E3[met],E3S.st.name||'Votre nom ici')}
 metier(E3S.st.sc,false);
 u.querySelector('.r-enter').addEventListener('click',e=>{e.preventDefault();enter()});
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter')nameIn.blur()});
 {const v=E3S.st.name;if(v){nameIn.value=v;named(v,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(()=>{fit();wall();dirty=true;tick()});
 /* une image : les deux voisines fondues l'une dans l'autre (si elles sont décodées et à deux images au plus) ; les enseignes, interpolées de même.
    Sinon l'image décodée la plus proche, seule : jamais deux images éloignées l'une sur l'autre (pas de « fantôme » pendant le chargement). */
 const pinAt=(s,i)=>s.pins&&s.pins[i]?s.pins[i].pins:null;
 const cover=im=>{const sc=Math.max(W/im.width,H/im.height),w=im.width*sc,h=im.height*sc;return{ox:(W-w)/2,oy:(H-h)/2,w,h}};
 const paintPair=(film,r,al)=>{const[i0,i1,a]=r,im=film.get(i0),b=cover(im);cx.globalAlpha=al;cx.drawImage(im,b.ox,b.oy,b.w,b.h);if(a>.01&&i1!==i0){cx.globalAlpha=al*a;cx.drawImage(film.get(i1),b.ox,b.oy,b.w,b.h)}cx.globalAlpha=1;return b};
 /* v19 : le passage d'une image à l'autre quand le contenu change d'un coup (autre métier, la salle qui s'allume) : l'ancienne image s'efface */
 const xc=document.createElement('canvas'),xx=xc.getContext('2d');
 function snap(){if(!W||!H)return;xc.width=W;xc.height=H;xx.drawImage(cv,0,0);xa=1}
 const fit2=(b,d)=>({ox:b.ox/d,oy:b.oy/d,w:b.w/d,h:b.h/d});
 function draw(f){const s=store[set];if(!W||!H||!s)return;const n=SETS[set];f=clamp(f,0,n-1);s.film.seek(f);const r=s.film.pair(f);if(!r)return;const[i0,i1,a]=r;const far=Math.min(Math.abs(i0-f),Math.abs(i1-f));if(!s.loose&&far>1.01&&(far>=Math.abs((shF<0?S0[set]:shF)-f)-1||performance.now()-lastS<1500))return;   /* jamais une image plus lointaine que celle qu'on voit déjà (l'affiche = S0) ; v20.1 : réseau lent, on se rapproche par étapes au lieu de rester sur l'affiche */shF=far>1.01?(Math.abs(i0-f)<Math.abs(i1-f)?i0:i1):f;if(window.__rd)__rd.push([i0,i1,+a.toFixed(2)]);
  const b=paintPair(s.film,r,1);
  /* à l'arrêt : la salle du métier choisi s'allume derrière la vitrine (la première image de la suite, même cadrage) */
  const z=inCur(),z0=z&&z.film.get(0);if(z0&&inA>.003){const c=cover(z0);cx.globalAlpha=inA;cx.drawImage(z0,c.ox,c.oy,c.w,c.h);cx.globalAlpha=1}
  if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;
  const d=W/SW,p=s.pins&&s.pins[i0]?s.pins[i0].p:0;place(e3mix(pinAt(s,i0),pinAt(s,i1),a),fit2(b,d),p);
  if(z0&&inA>.5&&z.pins)e3place(rwall,z.pins[0].pins,fit2(b,d));else e3place(rwall,null,null)}
 /* dans la salle : la suite du métier choisi ; le nom sur l'enseigne (dehors) puis au mur du fond */
 function drawIn(f){const z=inCur();if(!W||!H||!z)return false;f=clamp(f,0,z.n-1);z.film.seek(f);const r=z.film.pair(f);if(!r)return false;const[i0,i1,a]=r;if(Math.abs(i0-f)>1.01&&Math.abs(i1-f)>1.01)return false;
  if(window.__ri)__ri.push([i0,i1,+a.toFixed(2)]);
  const b=paintPair(z.film,r,1);if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;const d=W/SW,pp=z.pins?e3mix(pinAt(z,i0),pinAt(z,i1),a):null;
  place(pp,fit2(b,d),1);e3place(rwall,pp,fit2(b,d));return true}
 function place(pp,f,p){for(const el of pins.children){const q=pp&&pp.find(x=>x.id===el.dataset.id);
  if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,127,f);
  if(el===sign){el.style.opacity=q.vis;continue}
  const mx=(q.c[0][0]+q.c[1][0])/2,near=clamp(1-Math.abs(mx-.5)/.42,0,1);el.style.opacity=(q.vis*Math.min(1,near*1.8)*(p>.84?0:1)).toFixed(2)}}
 /* la suite, par métier (img/e3d/in-<métier>/<jeu>/) : p0 (la première, la dernière et une sur 8) en approchant de l'arrêt,
    p1 et p2 à l'arrêt, p3 dès qu'on passe la porte. Les autres métiers dorment ; un jeu absent : la porte de la rue, en secours. */
 const inKey=()=>met+set,inCur=()=>{const z=ins[inKey()];return z&&!z.bad?z:null};
 function inGet(k,g){const z=ins[k];return e3pack(e3in(z.m)+z.k+'/p'+g+'.txt').then(l=>l.forEach(([i,b])=>z.film.add(i,b)))}
 function need(lv){if(!LIVE||!met||!W)return;if(lv===undefined)lv=cQ>0||gate==='open'&&cP>HOLD[0]?4:gate==='rested'||cP>=HOLD[0]-.02?3:cP>.45?1:0;if(!lv)return;
  const k=inKey();let z=ins[k];
  for(const j in ins)if(j!==k&&ins[j].film)ins[j].film.sleep();
  if(!z){z=ins[k]={m:met,k:set,n:INS[set],req:0,pins:null,chain:Promise.resolve(),film:e3film(INS[set],24,0,()=>{if(k===inKey()){dirty=true;tick()}})};
   fetch(e3in(met)+set+'/pins.json').then(r=>r.json()).then(j=>{z.pins=j;dirty=true;tick()}).catch(()=>{})}
  else z.film.wake();
  while(z.req<lv){const g=z.req++;z.chain=z.chain.then(()=>inGet(k,g)).catch(()=>{if(g===0){z.bad=true;dirty=true;tick()}})}}
 /* le rythme, en images : un temps sur le globe, le tour et la rue d'un seul geste, l'arrêt devant l'enseigne, puis la suite.
    La vitesse monte et descend en douceur (trapèze) : pas de départ ni d'arrêt sec. */
 const trap=(x,a,b,ra,rb)=>{const L=b-a,t=clamp(x-a,0,L),v=1/(L-ra/2-rb/2);return t<ra?v*t*t/(2*ra):t<=L-rb?v*(ra/2+t-ra):1-v*(L-t)**2/(2*rb)};
 const S0={d:74,m:60};   /* v20.1 : on part dans la rue, le réverbère du logo déjà sorti du cadre (de 62 à 73, son globe coupé filait au bord en quelques images : « les lampadaires au début ») ; build.py ne livre que les images à partir d'ici */
 const k1Of=()=>{const s=store[set],n=SETS[set];return s&&s.k1>0?s.k1:Math.round((n-1)*.935)};
 function frameOf(P){const k1=k1Of(),a=S0[set];return P<HOLD[0]?a+(k1-a)*trap(P,.03,HOLD[0],.06,.1):k1}   /* l'arrêt : l'image ne bouge plus jusqu'au mur ; après, c'est la suite */
 const inOf=q=>(INS[set]-1)*trap(q,0,END,.08,.14);   /* la suite : la porte, la salle, et un temps sur la fin du site */
 const ss=x=>x*x*(3-2*x),fade=(a,b,c,d)=>ss(Math.min(clamp((cP-a)/(b-a||1),0,1),clamp((d-cP)/(d-c||1),0,1))),fq=(a,b,c,d)=>ss(Math.min(clamp((cQ-a)/(b-a||1),0,1),clamp((d-cQ)/(d-c||1),0,1)));
 /* les textes : opacity et transform seulement, et on n'écrit un style que s'il change (pas de recalcul inutile à chaque image) */
 const memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}};
 const flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 const sbar=$('rSbar'),end=$('rEnd');
 function ui(){if(!LIVE)return;
  const h=ss(clamp((.12-cP)/.07,0,1));put(t1,'opacity',h.toFixed(3));flag(t1,'off',cP>.12);   /* caché à l'œil seulement : le h1 reste dans l'arbre d'accessibilité ; ses boutons ne prennent plus le clic (CSS) */{const v=h.toFixed(2);if(veil.dataset.hv!==v){veil.dataset.hv=v;veil.style.setProperty('--hv',v)}}flag(document.body,'hero-cta',h>.5&&vis);put(cue,'opacity',clamp((.03-cP)/.03,0,1).toFixed(2));
  const W3=[[.12,.145,.175,.2],[.19,.215,.235,.255]];   /* les deux phrases passent avant la zone de l'arrêt ; la troisième, une fois la porte passée */
  says.forEach((el,j)=>{const w=W3[j],o=w?fade(...w):fq(.03,.07,.15,.21),a0=w?w[0]:.03,b0=w?w[1]:.07,x=w?cP:cQ;put(el,'opacity',o.toFixed(3));put(el,'transform',`translateY(${((1-ss(clamp((x-a0)/(b0-a0),0,1)))*14).toFixed(1)}px)`)});
  /* la barre de l'arrêt : là sur toute la zone de l'arrêt ; elle ne part qu'une fois le portail franchi, dès les premiers pas vers la porte */
  const e=frz?1:ss(Math.min(clamp((cP-GATE[0]+.05)/.05,0,1),clamp((.06-cQ)/.045,0,1)));put(stop,'opacity',e.toFixed(3));put(stop,'transform',`translateY(${((1-e)*14).toFixed(1)}px)`);
  flag(stop,'on',e>.02);flag(u,'stop',e>.5);flag(u,'past',cQ>.005);   /* jamais inert : on l'atteint au clavier (voir focusin plus bas) */
  /* dans la salle : la barre du site du commerce, puis sa fin (le bouton du métier) */
  put(sbar,'opacity',ss(clamp((cQ-.3)/.1,0,1)).toFixed(3));
  const g=ss(clamp((cQ-.66)/.1,0,1));put(end,'opacity',g.toFixed(3));put(end,'transform',`translateY(${((1-g)*14).toFixed(1)}px)`);flag(end,'on',g>.5);
  if(cQ>.02&&!mode)ld.textContent='Chargement de la démo…';else if(ld.textContent==='Chargement de la démo…')ld.textContent=''}   /* la salle tarde : la rue reste à l'arrêt, un mot discret */
 /* mouvement réduit : l'affiche de l'arrêt, et le nom posé sur son enseigne */
 function still(){const s=store[set];if(!s||!s.pins||!poster.naturalWidth)return;const i=s.k1>0?s.k1:0,rw=SW,rh=scene.clientHeight,sc=Math.max(rw/poster.naturalWidth,rh/poster.naturalHeight),w=poster.naturalWidth*sc,h=poster.naturalHeight*sc;
  place(pinAt(s,i),{ox:(rw-w)/2,oy:(rh-h)/2,w,h},1)}
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 /* le film suit sa cible sans jamais sauter une image : une image décodée à la fois, au plus une par image affichée */
 function follow(film,c,t,dt,rest){
  /* v20.1 : au repos, si les images manquent entre ici et la cible (réseau lent : une image sur huit), on ne reste pas figé loin d'elle :
     on se pose sur l'image prête la plus proche de la cible, par un fondu (snap) */
  if(rest&&performance.now()-lastS>1500){const nt=film.near(t);if(film.get(nt)&&Math.abs(nt-t)<Math.abs(c-t)-1&&(!film.get(Math.round(c))||!film.dl(c,nt))){if(painted)snap();return nt}}
  if(film.get(Math.round(c))){if(rest)t=film.near(t);t=film.reach(c,t)}else t=c;const st=t-c;c+=clamp(st*(1-Math.exp(-dt/.07)),-1,1);return Math.abs(t-c)<.004?t:c}
 /* l'inertie : la page suit le défilement avec ~180 ms de retard, comme une caméra portée, jamais par à-coups ;
    une fois arrêtée, elle se pose en douceur sur l'image nette la plus proche (le fondu ne sert qu'en mouvement). */
 function loop(now){raf=0;const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;
  if(cP<0)geo();   /* la première image : mesurer la rue d'abord (sinon D=1 et P vaut des dizaines : le titre resterait caché le temps de « redescendre ») */
  const r=walk.getBoundingClientRect(),y=hh-r.top;P=Math.max(0,y/D);Q=clamp((y-GATE[1]*D)/L,0,1);
  if(!LIVE){still();return}
  if(P>.4)more();
  if(cP<0){cP=P;cF=Math.round(frameOf(P));cQ=Q;cI=Math.round(inOf(Q))}
  /* le nom a le focus à l'arrêt : tout reste figé, même si le clavier du téléphone fait bouger la page */
  if(COARSE&&document.activeElement===nameIn&&cP>=HOLD[0]-.02&&cP<=HOLD[1]+.02)frz=true;
  if(!frz){cP+=(P-cP)*(1-Math.exp(-dt/.2));if(Math.abs(P-cP)<.0003)cP=P}
  cQ=clamp((cP*D-GATE[1]*D)/L,0,1);const rest=cP===P;need();
  /* la rue */
  const F=frameOf(Math.min(cP,HOLD[1])),s0=store[set];let tF=rest?Math.round(F):F;
  /* v20.1 : au repos, loin de la cible et sans images entre deux (réseau lent) : on se pose sur l'image prête la plus proche, par un fondu */
  if(rest&&s0&&!s0.loose&&performance.now()-lastS>1500){const nt=s0.film.near(Math.round(F));if(s0.film.get(nt)&&Math.abs(nt-F)<Math.abs(cF-F)-1&&(!s0.film.get(Math.round(cF))||!s0.film.dl(cF,nt))){if(painted)snap();cF=tF=nt;dirty=true}}
  if(s0&&s0.loose&&s0.film.get(s0.film.near(cF))){if(!s0.film.get(Math.round(cF)))cF=s0.film.near(cF);if(rest)tF=s0.film.near(tF)}
  else if(s0&&s0.film.get(Math.round(cF))){if(rest)tF=s0.film.near(tF);tF=s0.film.reach(cF,tF)}else tF=cF;   /* tant que l'image affichée (l'affiche) n'a pas son double décodé, le film ne part pas */   /* une image pas encore décodée : le film l'attend, il ne la saute pas */
  {const st=tF-cF,dl=st*(1-Math.exp(-dt/.07));cF+=clamp(dl,-1,1)}if(Math.abs(tF-cF)<.004)cF=tF;   /* une image au plus par image affichée : aucun trou, même lancé fort */
  /* passé le mur alors que la rue n'est pas encore à l'arrêt (réseau lent, l'arrêt atteint par « Voir une démo ») : la rue se pose
     sur l'arrêt par un fondu, et la salle prend la suite ; sinon la rue endormie attendrait des images qui ne viendraient plus */
  const k1=k1Of();if(cQ>.12&&cF<k1-.5&&inCur()&&inCur().film.get(0)){snap();cF=tF=k1;dirty=true}
  /* la salle s'allume à l'arrêt (la caméra posée, sa première image prête) ; s'éteint si l'on repart vers la rue */
  const z=inCur(),atStop=Math.abs(cF-k1)<.5&&cP>=HOLD[0]-.01,ia=atStop&&z&&z.film.get(0)?1:0;
  if(inA!==ia){inA+=(ia-inA)*(1-Math.exp(-dt/.16));if(Math.abs(ia-inA)<.004)inA=ia;dirty=true}
  /* la suite : son image suit la position, sans trou, comme la rue */
  let tI=inOf(cQ);if(z&&cF>=k1-.5&&mode===1)cI=follow(z.film,cI,rest?Math.round(tI):tI,dt,rest);else cI=0;   /* la salle part de sa première image (celle de l'arrêt), une fois qu'elle a la main */
  const want=(cQ>.0005||cI>.02)&&cF>=k1-.5?1:0;   /* la salle ne prend la main qu'une fois la rue à l'arrêt (un lancer qui bute sur le mur ne montre pas la salle au milieu de la rue) */
  if(want&&z&&z.film.get(Math.round(cI))){if(!mode&&inA<.95)snap();mode=1}else if(!want&&mode){mode=0;if(inA<.95)snap()}else if(want&&!z&&ins[inKey()]&&ins[inKey()].bad)mode=2;else if(!want)mode=0;
  if(xa>0){xa=Math.max(0,xa-dt/.35);dirty=true}
  if(mode===1){if(dirty||cI!==lastI){if(!drawIn(cI))draw(cF);lastI=cI;last=-1}}
  else if(mode===2){const n=SETS[set],f=k1+(n-1-k1)*clamp(cQ/END,0,1);if(dirty||f!==last){draw(f);last=f}}   /* secours : la porte de la rue */
  else if(dirty||cF!==last){draw(cF);last=cF;lastI=-1}
  /* une seule grande série d'images décodées à la fois : la rue dort dans la salle, la salle dort loin de l'arrêt */
  if(s0){if(cQ>.12)s0.film.sleep();else if(vis)s0.film.wake()}if(z&&cP<.4)z.film.sleep();
  ui();if(!frz&&(cP!==P||cF!==tF||Math.abs(cI-tI)>.004&&z||inA!==ia||xa>0))tick();else t0=0}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;const s=store[set];if(s){if(vis)s.film.wake();else s.film.sleep()}tick()},{rootMargin:'50% 0px'}).observe(walk);   /* loin de la rue : ses images décodées sont libérées */
 poster.addEventListener('error',()=>{poster.style.visibility='hidden'});   /* affiche absente : le fond de nuit, les textes restent lisibles */
 function toStill(){u.classList.add('static');poster.addEventListener('load',tick);poster.src=base(r0())+'stop.jpg';const ps=poster.parentNode.querySelector('source');if(ps)ps.srcset=base('m')+'stop.jpg'}
 if(!LIVE)toStill();
 /* le film ne vient pas (réseau, fichier absent) : la page passe au rendu fixe, comme en mouvement réduit ; rien ne bloque l'offre ni le contact */
 function flat(){if(!LIVE)return;const deep=walk.getBoundingClientRect().top<-innerHeight*.3;LIVE=false;t1.classList.remove('off');u.classList.add('nofilm');document.body.classList.remove('hero-cta');
  for(const el of [t1,...says,stop,cue,sbar,end]){el.style.opacity='';el.style.visibility='';el.style.transform='';el.style.translate=''}memo.clear();toStill();geo();if(deep)stop.scrollIntoView({block:'start'})}
 function r0(){return scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d'}
 addEventListener('resize',()=>{size();tick()});
 /* v20.1 : retour d'un autre onglet, de l'arrière-plan ou du cache (bouton Retour) : on redessine (iOS peut avoir vidé le canevas) */
 const redo=()=>{const s=store[set];if(s&&vis)s.film.wake();size();dirty=true;last=-1;lastI=-1;tick()};
 addEventListener('pageshow',e=>{if(e.persisted)redo()});document.addEventListener('visibilitychange',()=>{if(!document.hidden)redo()});
 if(LIVE){addEventListener('scroll',()=>{lastS=performance.now();arm();if(vis)tick()},{passive:true});
  /* le film ne se charge qu'au premier geste : qui repart tout de suite ne le télécharge pas (l'affiche est déjà la bonne image) */
  for(const ev of ['wheel','touchstart','keydown','pointerdown'])addEventListener(ev,()=>{moved=true;arm();more()},{passive:true,once:true});
  requestAnimationFrame(()=>u.classList.add('go'))}else u.classList.add('go');
 /* « Passer l'intro » : sans saut brutal, jusqu'à l'arrêt */
 const yAt=p=>walk.getBoundingClientRect().top+scrollY-hh+p*D;
 const toStop=()=>{arm();geo();if(LIVE)e3glide(yAt(STOP));else stop.scrollIntoView({block:'nearest'})};
 /* v19 : « Voir une démo », « La démo », « Passer l'intro » : tous vont à l'arrêt (le portail reste fermé : on y choisit d'abord) */
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href="#choix"]');if(!a)return;e.preventDefault();toStop()});
 /* « Entrer » : la porte s'ouvre, on traverse la salle jusqu'à la fin du site */
 const yQ=q=>walk.getBoundingClientRect().top+scrollY-hh+GATE[1]*D+q*L;
 function enter(){arm();geo();open(3000);need(4);if(LIVE)e3glide(yQ(END),1900);else end.scrollIntoView({block:'nearest'})}
 end.addEventListener('focusout',e=>{if(!end.contains(e.relatedTarget))end.classList.remove('kb')});   /* au clavier : la fin du site se montre tout de suite, sans attendre le fondu */
 const kb=e=>{try{return e.target.matches(':focus-visible')}catch(_){return false}},jump=(y,ms,e)=>{if(kb(e)){e3halt();scrollTo({top:y,behavior:'instant'})}else e3glide(y,ms)};   /* au clavier : l'élément est à l'écran tout de suite */
 end.addEventListener('focusin',e=>{end.classList.add('kb');if(LIVE&&!end.classList.contains('on')){open(3000);need(4);geo();jump(yQ(END),600,e)}});
 /* arrivé avec ?e= (un lien préparé) : droit à l'arrêt, le métier et le nom déjà posés */
 if(new URLSearchParams(location.search).get('e')&&!location.hash)addEventListener('load',()=>setTimeout(toStop,80),{once:true});
 /* au clavier : entrer dans la barre (Tab) amène la caméra à l'arrêt */
 stop.addEventListener('focusin',e=>{if(LIVE&&!u.classList.contains('stop')){if(kb(e)){arm();geo();jump(yAt(STOP),0,e)}else toStop()}});
 /* revenir au titre au clavier (Maj+Tab) : la caméra remonte au début */
 t1.addEventListener('focusin',e=>{if(LIVE&&t1.classList.contains('off'))jump(yAt(0),undefined,e)});
 /* le clavier du téléphone : on se souvient d'où l'on était, la barre reste au-dessus du clavier, et on y revient en fermant */
 nameIn.addEventListener('focus',()=>{kbY=scrollY});
 nameIn.addEventListener('blur',()=>{const was=frz;frz=false;stop.style.setProperty('--kb','0px');if(was&&LIVE&&kbY>=0&&Math.abs(scrollY-kbY)>4){const y=kbY;requestAnimationFrame(()=>e3glide(y,420))}kbY=-1;tick()});
 const vv=window.visualViewport;if(vv){const kb=()=>{const o=document.activeElement===nameIn?Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop)):0;stop.style.setProperty('--kb',o+'px')};vv.addEventListener('resize',kb);vv.addEventListener('scroll',kb)}
 /* le portail. Un lancer, même fort, s'arrête à l'arrêt ; pour continuer, il faut un nouveau geste une fois arrivé
    (doigt reposé, nouvelle molette après une pause, clavier) ou « Entrer dans la démo », un lien, « Passer l'intro ».
    Remonter n'est jamais bloqué ; arriver d'en dessous (ou par un lien) ouvre le portail. */
 let gate='closed',pP=-1,lastW=0,rt=0,wt=0,tY=-1,pass=0,w0=0,wMax=0,pt=0;const curP=()=>(hh-walk.getBoundingClientRect().top)/D;
 const rest=()=>{const p=curP();if(gate==='closed'&&p>=HOLD[0]-.03&&p<=GATE[1]+.005&&!e3touch.n&&performance.now()-lastW>350)gate='rested'};
 const open=(ms=0)=>{gate='open';if(ms)pass=performance.now()+ms};   /* ms : un saut voulu (lien, bouton) passe la rue entière sans être refermé */
 if(LIVE){
  addEventListener('scroll',()=>{const p=curP();clearTimeout(rt);rt=setTimeout(rest,320);
   if(p<GATE[0]-.03){if(performance.now()>pass)gate='closed'}
   else if(gate!=='open'&&pP<0&&p>GATE[1]+.01)gate='open';   /* arrivé en dessous (lien, rechargement) */
   else if(gate!=='open'&&pP>=0&&pP>GATE[1]+.01&&p>GATE[1]+.01)gate='open';   /* on remonte depuis la démo */
   else if(gate!=='open'&&pP>=0&&p>GATE[1]+.002&&!e3gliding()){geo();scrollTo({top:yAt(GATE[1]),behavior:'instant'});pP=GATE[1];
    if(COARSE){const h=document.documentElement;h.style.overflow='hidden';setTimeout(()=>{h.style.overflow=''},160)}return}   /* le mur ; au doigt, l'élan est coupé */
   pP=p},{passive:true});
  addEventListener('wheel',e=>{const t=performance.now(),quiet=t-lastW>350;lastW=t;if(e.deltaY<=0)return;
   if(gate==='rested'&&quiet){open();return}
   if(gate!=='open'&&curP()>=GATE[1]-.012&&curP()<GATE[1]+.05){e.preventDefault();   /* l'inertie bute sur le mur ; quand elle s'éteint, on se pose à l'arrêt */
    if(quiet||!w0){w0=t;wMax=0}wMax=Math.max(wMax,e.deltaY);u.classList.add('push');clearTimeout(pt);pt=setTimeout(()=>u.classList.remove('push'),2600);
    if(t-w0>1200&&e.deltaY>=Math.max(4,wMax*.6)){w0=0;u.classList.remove('push');open();return}   /* roulette tenue ~1,2 s (pas l'élan qui s'éteint) : on continue */
    clearTimeout(wt);wt=setTimeout(()=>{if(gate!=='open'&&Math.abs(curP()-STOP)>.012){geo();e3glide(yAt(STOP))}},300)}},{passive:false});   /* l'inertie du pavé tactile bute sur le mur */
  {const mb=u.querySelector('.r-more');if(mb)mb.addEventListener('click',()=>{u.classList.remove('push');open(1500);e3glide(scrollY+innerHeight*.7)})}
  addEventListener('touchstart',e=>{tY=e.touches[0]?e.touches[0].clientY:-1;if(gate==='rested')open()},{passive:true,capture:true});
  addEventListener('touchmove',e=>{const y=e.touches[0]?e.touches[0].clientY:-1;const up=tY>=0&&y<tY;tY=y;if(gate!=='open'&&up&&e.cancelable&&curP()>=GATE[1]-.004&&curP()<GATE[1]+.05)e.preventDefault()},{passive:false});
  addEventListener('touchend',()=>{clearTimeout(rt);rt=setTimeout(rest,320)},{passive:true});
  addEventListener('keydown',e=>{if(e.target===nameIn&&e.key!=='Tab')return;if(gate==='rested'||['Tab','End','Home'].includes(e.key))open()},true);
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('a[href*="#"]:not([href="#choix"]),.r-enter'))open(3000)},true)}
 /* à l'arrêt, au doigt : un tap qui bouge un peu (jusqu'à 14 px) reste un tap ; le navigateur, lui, l'aurait pris pour un défilement */
 {let t0=null;stop.addEventListener('touchstart',e=>{const el=e.target.closest('a,button,input');const q=e.touches[0];t0=el&&q&&e.touches.length===1?{el,x:q.clientX,y:q.clientY,t:performance.now(),m:0}:null},{passive:true});
  stop.addEventListener('touchmove',e=>{const q=e.touches[0];if(t0&&q)t0.m=Math.max(t0.m,Math.hypot(q.clientX-t0.x,q.clientY-t0.y))},{passive:true});
  stop.addEventListener('touchend',e=>{const k=t0;t0=null;if(!k)return;const q=e.changedTouches[0];if(!q)return;const m=Math.max(k.m,Math.hypot(q.clientX-k.x,q.clientY-k.y));
   if(m>14||performance.now()-k.t>800)return;const h=document.elementFromPoint(q.clientX,q.clientY);if(!h||!(k.el.contains(h)||h.contains(k.el)))return;
   if(e.cancelable)e.preventDefault();if(k.el.tagName==='INPUT')k.el.focus();else k.el.click()},{passive:false})}
 /* l'aimantation : si le défilement s'arrête juste avant ou juste après l'arrêt, la caméra s'y pose, en douceur.
    Jamais doigt posé, jamais pendant la frappe ; le moindre geste l'arrête (e3glide). */
 if(LIVE){let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!LIVE||!vis||frz||e3touch.n)return;
  geo();const t=gate==='open'&&Q>.012&&Q<END-.01?(dn>0?yQ(END):yAt(STOP)):P>=GATE[0]&&Q<=.012&&Math.abs(P-STOP)>.012?yAt(STOP):-1;if(t>=0)e3glide(t)},260)},{passive:true})}   /* dans la salle : en avant, la fin du site ; en arrière, l'arrêt */
 {let y0=scrollY;addEventListener('scroll',()=>{const d=scrollY-y0;if(Math.abs(d)>2)dn=d>0?1:-1;y0=scrollY},{passive:true})}
 /* la première mesure attend la première image : l'analyse de la page n'est pas allongée d'une mise en page forcée */
 requestAnimationFrame(()=>{size();if(LIVE&&scrollY>0)arm();ui();tick();
  /* le film se charge dès que la page est posée (sans attendre un geste) : le premier lancer trouve ses images */
  if(LIVE)(window.requestIdleCallback||setTimeout)(arm,{timeout:1200})});
 /* sans le film (mouvement réduit) : le WhatsApp de l'en-tête se retire tant que celui du titre est à l'écran */
 {const w=u.querySelector('.r-wa');if(w)new IntersectionObserver(es=>{if(!LIVE)flag(document.body,'hero-cta',es[0].isIntersecting)},{rootMargin:'-64px 0px 0px 0px'}).observe(w)}
})();
