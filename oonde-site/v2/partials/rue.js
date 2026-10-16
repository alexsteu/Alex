/* La rue au crépuscule, en haut de page. Faire défiler fait avancer la caméra image par image (rendu d'avance,
   entree3d/scenes/rue.js) : un tour autour du réverbère bleu, la rue, les vitrines, puis l'arrêt devant une enseigne vide
   où le visiteur tape son nom. Les métiers (data-e3) ouvrent l'entrée 3D plus bas (e3d.js). La première image est une
   affiche légère ; les images du film se chargent au premier geste (défilement, molette, toucher, clavier).
   Les images sont placées à pas égal pour l'œil (entree3d/tools/plist.mjs) : un pas de défilement = une image, partout.
   Mouvement réduit : l'image de l'arrêt, immobile. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),cv=$('rCv'),cx=cv.getContext('2d'),poster=$('rPoster'),pins=$('rPins'),anchor=$('choix');
 const ld=u.querySelector('.r-load'),t1=u.querySelector('.r-t1'),says=[...u.querySelectorAll('.r-say')],stop=$('rStop'),cue=u.querySelector('.r-cue'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),nm=sign.querySelector('.r-nm'),mets=[...sign.querySelectorAll('.r-met i')],veil=u.querySelector('.r-veil'),seg=u.querySelector('.r-seg'),rsel=$('rSel');
 let LIVE=!RM;const SETS={d:200,m:160},STOP=.78,HOLD=[.66,.90],store={};
 const COARSE=matchMedia('(pointer:coarse)').matches;let frz=false,kbY=-1,SW=1,set='d',W=0,H=0,P=0,cP=-1,cF=0,last=-1,raf=0,dirty=true,vis=true,D=1,hh=64,armed=false,t0=0;
 const base=k=>'img/e3d/rue/'+k+'/';
 /* les images arrivent en 4 paquets (build.py, pack()) : une sur 8 d'abord, puis le reste entre deux */
 function load(k){if(store[k]){store[k].film.wake();return}const n=SETS[k],s=store[k]={film:e3film(n,24,Math.round(cF)||S0[k],()=>{if(k===set){dirty=true;tick()}}),pins:null};
  fetch(base(k)+'pins.json').then(r=>r.json()).then(j=>{s.pins=j;s.k1=j.findIndex(x=>x.p>=.88);dirty=true;tick()}).catch(()=>{});
  if(!LIVE)return;
  const get=g=>e3pack(base(k)+'p'+g+'.txt').then(l=>l.forEach(([i,b])=>s.film.add(i,b)));   /* décodage hors du fil principal (e3d.js) */
  /* tant que le premier paquet n'est pas là, l'affiche reste ; s'il tarde, un mot discret ; s'il échoue, l'affiche (ou le fond) reste et le texte continue */
  const slow=setTimeout(()=>{if(!s.film.any()&&k===set)ld.textContent='Chargement de la rue…'},1200);
  get(0).then(()=>{clearTimeout(slow);ld.textContent='';return Promise.all([get(1),get(2)])}).then(()=>{s.p3=()=>{s.p3=null;get(3).catch(()=>{})};more()})   /* p3 (les images impaires, le plus lourd) : seulement si l'on avance vraiment */
   .catch(()=>{clearTimeout(slow);ld.textContent='';if(!s.film.any())flat()})}
 function more(){const s=store[set];if(s&&s.p3&&P>.4)s.p3()}
 const arm=()=>{if(armed)return;armed=true;load(set)};
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight);anchor.style.top=(STOP*D)+'px'};
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*d),h=Math.round(r.height*d);
  SW=r.width||1;if(w!==W||h!==H){W=cv.width=w;H=cv.height=h;dirty=true}   /* la barre d'adresse du téléphone bouge : on ne vide le canevas que si sa taille change */
  const k=r.width<r.height*.95?'m':'d';if(k!==set){if(store[set])store[set].film.sleep();set=k;if(armed)load(k)}if(!LIVE)load(k);geo()}
 /* le nom : sur l'enseigne vide, en néon. Seules les lettres nouvelles s'allument (les autres ne bougent pas) ;
    la largeur et la taille suivent en douceur (transition sur width et scale), sans à-coup. Il passe aussi sur l'entrée plus bas. */
 let shown='';
 const fit=()=>{e3meas.font='400 86px "Cormorant Garamond"';const w=e3meas.measureText(shown).width;nm.style.setProperty('--w',Math.ceil(w)+'px');nm.style.setProperty('--s',Math.min(1,860/(w||1)).toFixed(3))};
 function named(v,push){const t=v.trim().slice(0,40);let k=0;while(k<t.length&&k<shown.length&&t[k]===shown[k])k++;
  const bs=[...nm.children];for(let i=bs.length-1;i>=k;i--)bs[i].remove();
  for(let i=k;i<t.length;i++){const b=document.createElement('b');b.textContent=t[i];if(push)b.className='in';b.style.animationDelay=Math.min(i-k,6)*35+'ms';nm.appendChild(b)}
  shown=t;sign.classList.toggle('on',!!t);fit();
  if(push){if(window.e3boot)e3boot();const e=$('eName');if(e&&e.value!==v){e.value=v;e.dispatchEvent(new Event('input'))}}}
 /* le métier : choisi sur place, il s'écrit sous l'enseigne (fondu enchaîné) et prépare la démo, sans quitter la rue.
    « Entrer dans la démo » y va ; le nom et le métier suivent jusque dans le message WhatsApp (e3d.js). */
 let met='',mi=0;
 function metier(k,push){if(!E3[k]||k===met)return;met=k;
  [...seg.children].forEach(b=>{const on=b.dataset.m===k;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});rsel.value=k;
  const a=mets[mi],b=mets[mi^=1];b.textContent=E3[k].lab;a.classList.remove('a');b.classList.add('a');
  if(push){if(window.e3boot)e3boot();if(window.e3pick)e3pick(k)}}
 seg.addEventListener('click',e=>{const b=e.target.closest('button');if(b)metier(b.dataset.m,true)});
 seg.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const bs=[...seg.children],i=bs.findIndex(b=>b.dataset.m===met),n=bs[(i+(/Right|Down/.test(e.key)?1:bs.length-1))%bs.length];metier(n.dataset.m,true);n.focus()});
 rsel.addEventListener('change',()=>metier(rsel.value,true));
 document.addEventListener('oonde-e3',e=>{metier(e.detail.sc,false);if(e.detail.name&&!nameIn.value){nameIn.value=e.detail.name;named(e.detail.name,false)}});
 metier(($('eSel')&&$('eSel').value)||'restaurant',false);
 u.querySelector('.r-enter').addEventListener('click',e=>{if(!window.e3go)return;e.preventDefault();e3go(met||'restaurant',!nameIn.value.trim())});
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter')nameIn.blur()});
 {const e=$('eName');if(e&&e.value){nameIn.value=e.value;named(e.value,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(fit);
 /* une image : les deux voisines fondues l'une dans l'autre (si elles sont décodées et à deux images au plus) ; les enseignes, interpolées de même.
    Sinon l'image décodée la plus proche, seule : jamais deux images éloignées l'une sur l'autre (pas de « fantôme » pendant le chargement). */
 const pinAt=(s,i)=>s.pins&&s.pins[i]?s.pins[i].pins:null;
 function draw(f){const s=store[set];if(!W||!H||!s)return;const n=SETS[set];f=clamp(f,0,n-1);s.film.seek(f);const r=s.film.pair(f);if(!r)return;const[i0,i1,a]=r;
  const im=s.film.get(i0),sc=Math.max(W/im.width,H/im.height),w=im.width*sc,h=im.height*sc,ox=(W-w)/2,oy=(H-h)/2;
  cx.globalAlpha=1;cx.drawImage(im,ox,oy,w,h);if(a>.01&&i1!==i0){cx.globalAlpha=a;cx.drawImage(s.film.get(i1),ox,oy,w,h);cx.globalAlpha=1}
  flag(u,'live',true);dirty=false;
  const d=W/SW,p=s.pins&&s.pins[i0]?s.pins[i0].p:0;place(e3mix(pinAt(s,i0),pinAt(s,i1),a),{ox:ox/d,oy:oy/d,w:w/d,h:h/d},p)}
 function place(pp,f,p){for(const el of pins.children){const q=pp&&pp.find(x=>x.id===el.dataset.id);
  if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,127,f);
  if(el===sign){el.style.opacity=q.vis;continue}
  const mx=(q.c[0][0]+q.c[1][0])/2,near=clamp(1-Math.abs(mx-.5)/.42,0,1);el.style.opacity=(q.vis*Math.min(1,near*1.8)*(p>.84?0:1)).toFixed(2)}}
 /* le rythme, en images : un temps sur le globe, le tour et la rue d'un seul geste, l'arrêt devant l'enseigne, la porte.
    La vitesse monte et descend en douceur (trapèze) : pas de départ ni d'arrêt sec. */
 const trap=(x,a,b,ra,rb)=>{const L=b-a,t=clamp(x-a,0,L),v=1/(L-ra/2-rb/2);return t<ra?v*t*t/(2*ra):t<=L-rb?v*(ra/2+t-ra):1-v*(L-t)**2/(2*rb)};
 const S0={d:62,m:52};   /* on part dans la rue (open.jpg : image 62 sur ordinateur, les vitrines devant le globe, 52 sur téléphone), les vitrines déjà là ; le réverbère passe sur le côté */
 function frameOf(P){const s=store[set],n=SETS[set],k1=s&&s.k1>0?s.k1:Math.round((n-1)*.935),a=S0[set];
  return P<HOLD[0]?a+(k1-a)*trap(P,.03,HOLD[0],.06,.1):P<HOLD[1]?k1:k1+(n-1-k1)*trap(P,HOLD[1],1,.04,.001)}   /* l'arrêt : un quart du défilement, l'image ne bouge pas */
 const ss=x=>x*x*(3-2*x),fade=(a,b,c,d)=>ss(Math.min(clamp((cP-a)/(b-a||1),0,1),clamp((d-cP)/(d-c||1),0,1)));
 /* les textes : opacity et transform seulement, et on n'écrit un style que s'il change (pas de recalcul inutile à chaque image) */
 const memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}};
 const flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 function ui(){if(!LIVE)return;
  const h=ss(clamp((.12-cP)/.07,0,1));put(t1,'opacity',h.toFixed(3));flag(t1,'off',cP>.12);   /* caché à l'œil seulement : le h1 reste dans l'arbre d'accessibilité ; ses boutons ne prennent plus le clic (CSS) */{const v=h.toFixed(2);if(veil.dataset.hv!==v){veil.dataset.hv=v;veil.style.setProperty('--hv',v)}}flag(document.body,'hero-cta',h>.5&&vis);put(cue,'opacity',clamp((.03-cP)/.03,0,1).toFixed(2));
  const W3=[[.31,.35,.42,.46],[.46,.5,.55,.59],[.93,.96,1.1,1.2]];
  says.forEach((el,j)=>{const[a,b,c,d]=W3[j];put(el,'opacity',fade(a,b,c,d).toFixed(3));put(el,'transform',`translateY(${((1-ss(clamp((cP-a)/(b-a),0,1)))*14).toFixed(1)}px)`)});
  /* la barre de l'arrêt : arrive pendant que la caméra se pose, repart en douceur quand on passe la porte */
  const e=frz?1:ss(Math.min(clamp((cP-.58)/.08,0,1),clamp((.97-cP)/.05,0,1)));put(stop,'opacity',e.toFixed(3));put(stop,'transform',`translateY(${((1-e)*14).toFixed(1)}px)`);
  flag(stop,'on',e>.02);flag(u,'stop',e>.5)}   /* jamais inert : on l'atteint au clavier (voir focusin plus bas) */
 /* mouvement réduit : l'affiche de l'arrêt, et le nom posé sur son enseigne */
 function still(){const s=store[set];if(!s||!s.pins||!poster.naturalWidth)return;const i=s.k1>0?s.k1:0,rw=SW,rh=scene.clientHeight,sc=Math.max(rw/poster.naturalWidth,rh/poster.naturalHeight),w=poster.naturalWidth*sc,h=poster.naturalHeight*sc;
  place(pinAt(s,i),{ox:(rw-w)/2,oy:(rh-h)/2,w,h},1)}
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 /* l'inertie : la page suit le défilement avec ~180 ms de retard, comme une caméra portée, jamais par à-coups ;
    une fois arrêtée, elle se pose en douceur sur l'image nette la plus proche (le fondu ne sert qu'en mouvement). */
 function loop(now){raf=0;const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;
  const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  if(!LIVE){still();return}
  if(P>.4)more();
  if(cP<0){cP=P;cF=Math.round(frameOf(P))}
  /* le nom a le focus à l'arrêt : tout reste figé, même si le clavier du téléphone fait bouger la page */
  if(COARSE&&document.activeElement===nameIn&&cP>=HOLD[0]-.02&&cP<=HOLD[1]+.02)frz=true;
  if(!frz){cP+=(P-cP)*(1-Math.exp(-dt/.2));if(Math.abs(P-cP)<.0003)cP=P}
  const F=frameOf(cP),tF=cP===P?Math.round(F):F;cF+=(tF-cF)*(1-Math.exp(-dt/.07));if(Math.abs(tF-cF)<.004)cF=tF;
  if(dirty||cF!==last){draw(cF);last=cF}ui();if(!frz&&(cP!==P||cF!==tF))tick();else t0=0}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;const s=store[set];if(s){if(vis)s.film.wake();else s.film.sleep()}tick()},{rootMargin:'50% 0px'}).observe(walk);   /* loin de la rue : ses images décodées sont libérées */
 poster.addEventListener('error',()=>{poster.style.visibility='hidden'});   /* affiche absente : le fond de nuit, les textes restent lisibles */
 function toStill(){u.classList.add('static');poster.addEventListener('load',tick);poster.src=base(r0())+'stop.jpg';const ps=poster.parentNode.querySelector('source');if(ps)ps.srcset=base('m')+'stop.jpg'}
 if(!LIVE)toStill();
 /* le film ne vient pas (réseau, fichier absent) : la page passe au rendu fixe, comme en mouvement réduit ; rien ne bloque l'offre ni le contact */
 function flat(){if(!LIVE)return;const deep=walk.getBoundingClientRect().top<-innerHeight*.3;LIVE=false;t1.classList.remove('off');u.classList.add('nofilm');document.body.classList.remove('hero-cta');
  for(const el of [t1,...says,stop,cue]){el.style.opacity='';el.style.visibility='';el.style.transform='';el.style.translate=''}memo.clear();toStill();geo();if(deep)stop.scrollIntoView({block:'start'})}
 function r0(){return scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d'}
 addEventListener('resize',()=>{size();tick()});
 if(LIVE){addEventListener('scroll',()=>{arm();if(vis)tick()},{passive:true});
  /* le film ne se charge qu'au premier geste : qui repart tout de suite ne le télécharge pas (l'affiche est déjà la bonne image) */
  for(const ev of ['wheel','touchstart','keydown','pointerdown'])addEventListener(ev,arm,{passive:true,once:true});
  requestAnimationFrame(()=>u.classList.add('go'))}else u.classList.add('go');
 /* « Passer l'intro » : sans saut brutal, jusqu'à l'arrêt */
 const yAt=p=>walk.getBoundingClientRect().top+scrollY-hh+p*D;
 const toStop=()=>{arm();geo();if(LIVE)e3glide(yAt(STOP));else stop.scrollIntoView({block:'nearest'})};
 u.querySelector('.r-skip').addEventListener('click',e=>{e.preventDefault();toStop()});
 /* au clavier : entrer dans la barre (Tab) amène la caméra à l'arrêt */
 stop.addEventListener('focusin',()=>{if(LIVE&&!u.classList.contains('stop'))toStop()});
 /* revenir au titre au clavier (Maj+Tab) : la caméra remonte au début */
 t1.addEventListener('focusin',()=>{if(LIVE&&t1.classList.contains('off'))e3glide(yAt(0))});
 /* le clavier du téléphone : on se souvient d'où l'on était, la barre reste au-dessus du clavier, et on y revient en fermant */
 nameIn.addEventListener('focus',()=>{kbY=scrollY});
 nameIn.addEventListener('blur',()=>{const was=frz;frz=false;stop.style.setProperty('--kb','0px');if(was&&LIVE&&kbY>=0&&Math.abs(scrollY-kbY)>4){const y=kbY;requestAnimationFrame(()=>e3glide(y,420))}kbY=-1;tick()});
 const vv=window.visualViewport;if(vv){const kb=()=>{const o=document.activeElement===nameIn?Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop)):0;stop.style.setProperty('--kb',o+'px')};vv.addEventListener('resize',kb);vv.addEventListener('scroll',kb)}
 /* l'aimantation : si le défilement s'arrête juste avant ou juste après l'arrêt, la caméra s'y pose, en douceur.
    Jamais doigt posé, jamais pendant la frappe ; le moindre geste l'arrête (e3glide). */
 if(LIVE){let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!LIVE||!vis||frz||e3touch.n)return;
  const t=P>=.56&&P<HOLD[0]?HOLD[0]+.04:P>HOLD[1]&&P<=.95?HOLD[1]-.04:-1;if(t>0){geo();e3glide(yAt(t))}},260)},{passive:true})}
 /* la première mesure attend la première image : l'analyse de la page n'est pas allongée d'une mise en page forcée */
 requestAnimationFrame(()=>{size();if(LIVE&&scrollY>0)arm();ui();tick()});
 /* sans le film (mouvement réduit) : le WhatsApp de l'en-tête se retire tant que celui du titre est à l'écran */
 {const w=u.querySelector('.r-wa');if(w)new IntersectionObserver(es=>{if(!LIVE)flag(document.body,'hero-cta',es[0].isIntersecting)},{rootMargin:'-64px 0px 0px 0px'}).observe(w)}
})();
