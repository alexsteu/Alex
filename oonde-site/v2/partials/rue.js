/* La rue au crépuscule, en haut de page. Faire défiler fait avancer la caméra image par image (rendu d'avance,
   entree3d/scenes/rue.js) : un tour autour du réverbère bleu, la rue, les vitrines, puis l'arrêt devant une enseigne vide
   où le visiteur tape son nom. Les métiers (data-e3) ouvrent l'entrée 3D plus bas (e3d.js). La première image est une
   affiche légère ; les images du film se chargent au premier geste (sur ordinateur, un peu après l'affichage).
   Les images sont placées à pas égal pour l'œil (entree3d/tools/plist.mjs) : un pas de défilement = une image, partout.
   Mouvement réduit : l'image de l'arrêt, immobile. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),cv=$('rCv'),cx=cv.getContext('2d'),poster=$('rPoster'),pins=$('rPins'),anchor=$('choix');
 const t1=u.querySelector('.r-t1'),says=[...u.querySelectorAll('.r-say')],stop=$('rStop'),cue=u.querySelector('.r-cue'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),signT=sign.firstElementChild;
 const LIVE=!RM,SETS={d:200,m:160},STOP=.79,store={};
 let set='d',W=0,H=0,P=0,cP=-1,cF=0,last=-1,raf=0,dirty=true,vis=true,D=1,hh=64,armed=false,t0=0;
 const base=k=>'img/e3d/rue/'+k+'/';
 /* les images arrivent en 4 paquets (build.py, pack()) : une sur 8 d'abord, puis le reste entre deux */
 function load(k){if(store[k])return;const n=SETS[k],s=store[k]={img:new Array(n),ok:new Uint8Array(n),pins:null};
  fetch(base(k)+'pins.json').then(r=>r.json()).then(j=>{s.pins=j;s.k1=j.findIndex(x=>x.p>=.88);dirty=true;tick()}).catch(()=>{});
  if(!LIVE)return;
  const got=buf=>{const v=new DataView(buf),hl=v.getUint32(0,true),head=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,hl)));
   return Promise.all(head.map(([i,o,l])=>{const im=new Image();im.decoding='async';
    im.src=URL.createObjectURL(new Blob([new Uint8Array(buf,4+hl+o,l)],{type:'image/webp'}));
    return (im.decode?im.decode():new Promise(r=>im.onload=r)).catch(()=>{}).then(()=>{s.img[i]=im;s.ok[i]=1;if(k===set)dirty=true;tick()})}))};
  const get=g=>fetch(base(k)+'p'+g+'.txt').then(r=>{if(!r.ok)throw r.status;return r.text()}).then(t=>{const b=atob(t),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer});
  get(0).then(got).then(()=>Promise.all([get(1).then(got),get(2).then(got)])).then(()=>get(3)).then(got).catch(()=>{})}
 const arm=()=>{if(armed)return;armed=true;load(set)};
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight);anchor.style.top=(STOP*D)+'px'};
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*d),h=Math.round(r.height*d);
  if(w!==W||h!==H){W=cv.width=w;H=cv.height=h;dirty=true}   /* la barre d'adresse du téléphone bouge : on ne vide le canevas que si sa taille change */
  const k=r.width<r.height*.95?'m':'d';if(k!==set){set=k;if(armed)load(k)}if(!LIVE)load(k);geo()}
 /* le nom : sur l'enseigne vide, en néon ; et sur l'entrée plus bas */
 const fit=()=>e3fit(signT,signT.textContent,'400 {s}px "Cormorant Garamond"',86,860);
 function named(v,push){const t=v.trim().slice(0,40);signT.textContent=t||'Votre nom ici';sign.classList.toggle('on',!!t);fit();
  if(push){const e=$('eName');if(e&&e.value!==v){e.value=v;e.dispatchEvent(new Event('input'))}}}
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter')nameIn.blur()});
 {const e=$('eName');if(e&&e.value){nameIn.value=e.value;named(e.value,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(fit);
 /* une image : les deux voisines fondues l'une dans l'autre ; les enseignes, interpolées de même.
    Tant que tout n'est pas chargé, les deux images chargées les plus proches. */
 const pinAt=(s,i)=>s.pins&&s.pins[i]?s.pins[i].pins:null;
 function draw(f){const s=store[set];if(!W||!H||!s)return;const n=SETS[set];f=clamp(f,0,n-1);
  let i0=Math.floor(f),i1=Math.min(n-1,i0+1);while(i0>0&&!s.ok[i0])i0--;while(i1<n-1&&!s.ok[i1])i1++;
  if(!s.ok[i0]&&!s.ok[i1])return;if(!s.ok[i0])i0=i1;if(!s.ok[i1])i1=i0;
  const a=i1>i0?clamp((f-i0)/(i1-i0),0,1):0;
  const im=s.img[i0],sc=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*sc,h=im.naturalHeight*sc,ox=(W-w)/2,oy=(H-h)/2;
  cx.globalAlpha=1;cx.drawImage(im,ox,oy,w,h);if(a>.01){cx.globalAlpha=a;cx.drawImage(s.img[i1],ox,oy,w,h);cx.globalAlpha=1}
  u.classList.add('live');dirty=false;
  const A=pinAt(s,i0),B=pinAt(s,i1)||A,d=W/scene.clientWidth,p=s.pins&&s.pins[i0]?s.pins[i0].p:0;place(A&&B?A.map((q,j)=>{const r=B[j]||q;return{id:q.id,vis:q.vis+(r.vis-q.vis)*a,c:q.c.map((c,k)=>[c[0]+(r.c[k][0]-c[0])*a,c[1]+(r.c[k][1]-c[1])*a])}}):A,{ox:ox/d,oy:oy/d,w:w/d,h:h/d},p)}
 function place(pp,f,p){for(const el of pins.children){const q=pp&&pp.find(x=>x.id===el.dataset.id);
  if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,127,f);
  if(el===sign){el.style.opacity=q.vis;continue}
  const mx=(q.c[0][0]+q.c[1][0])/2,near=clamp(1-Math.abs(mx-.5)/.42,0,1);el.style.opacity=(q.vis*Math.min(1,near*1.8)*(p>.84?0:1)).toFixed(2)}}
 /* le rythme, en images : un temps sur le globe, le tour et la rue d'un seul geste, l'arrêt devant l'enseigne, la porte.
    La vitesse monte et descend en douceur (trapèze) : pas de départ ni d'arrêt sec. */
 const trap=(x,a,b,ra,rb)=>{const L=b-a,t=clamp(x-a,0,L),v=1/(L-ra/2-rb/2);return t<ra?v*t*t/(2*ra):t<=L-rb?v*(ra/2+t-ra):1-v*(L-t)**2/(2*rb)};
 function frameOf(P){const s=store[set],n=SETS[set],k1=s&&s.k1>0?s.k1:Math.round((n-1)*.935);
  return P<.74?k1*trap(P,.03,.74,.06,.1):P<.84?k1:k1+(n-1-k1)*trap(P,.84,1,.05,.001)}
 const fade=(a,b,c,d)=>Math.min(clamp((cP-a)/(b-a||1),0,1),clamp((d-cP)/(d-c||1),0,1));
 function ui(){if(!LIVE)return;
  t1.style.opacity=clamp((.1-cP)/.06,0,1);t1.style.visibility=cP>.1?'hidden':'';cue.style.opacity=clamp((.03-cP)/.03,0,1);
  const W3=[[.35,.39,.48,.52],[.53,.57,.66,.7],[.88,.92,1.1,1.2]];
  says.forEach((el,j)=>{const[a,b,c,d]=W3[j];const o=fade(a,b,c,d);el.style.opacity=o;el.style.translate=`0 ${(1-clamp((cP-a)/(b-a),0,1))*14}px`});
  const e=clamp((cP-.7)/.05,0,1);stop.style.opacity=e;stop.style.transform=`translateY(${(1-e)*18}px)`;stop.classList.toggle('on',e>.05);stop.inert=e<.5;u.classList.toggle('stop',e>.5)}
 /* mouvement réduit : l'affiche de l'arrêt, et le nom posé sur son enseigne */
 function still(){const s=store[set];if(!s||!s.pins||!poster.naturalWidth)return;const i=s.k1>0?s.k1:0,rw=scene.clientWidth,rh=scene.clientHeight,sc=Math.max(rw/poster.naturalWidth,rh/poster.naturalHeight),w=poster.naturalWidth*sc,h=poster.naturalHeight*sc;
  place(pinAt(s,i),{ox:(rw-w)/2,oy:(rh-h)/2,w,h},1)}
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 /* l'inertie : la page suit le défilement avec ~180 ms de retard, comme une caméra portée, jamais par à-coups ;
    une fois arrêtée, elle se pose en douceur sur l'image nette la plus proche (le fondu ne sert qu'en mouvement). */
 function loop(now){raf=0;const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;
  const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  if(!LIVE){still();return}
  if(cP<0){cP=P;cF=Math.round(frameOf(P))}
  cP+=(P-cP)*(1-Math.exp(-dt/.18));if(Math.abs(P-cP)<.0003)cP=P;
  const F=frameOf(cP),tF=cP===P?Math.round(F):F;cF+=(tF-cF)*(1-Math.exp(-dt/.07));if(Math.abs(tF-cF)<.004)cF=tF;
  if(dirty||cF!==last){draw(cF);last=cF}ui();if(cP!==P||cF!==tF)tick();else t0=0}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;tick()}).observe(walk);
 if(!LIVE){u.classList.add('static');poster.addEventListener('load',tick);poster.src=base(r0())+'stop.jpg';const ps=poster.parentNode.querySelector('source');if(ps)ps.srcset=base('m')+'stop.jpg'}
 function r0(){return scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d'}
 size();addEventListener('resize',()=>{size();tick()});
 if(LIVE){addEventListener('scroll',()=>{arm();if(vis)tick()},{passive:true});
  for(const ev of ['wheel','touchstart','keydown'])addEventListener(ev,arm,{passive:true,once:true});
  if(scrollY>0)arm();
  /* sur ordinateur, le film se charge juste après l'affichage : au premier tour de molette, il est déjà là */
  if(matchMedia('(pointer:fine)').matches&&!(navigator.connection&&navigator.connection.saveData))addEventListener('load',()=>setTimeout(arm,900),{once:true});
  requestAnimationFrame(()=>u.classList.add('go'))}else u.classList.add('go');
 /* « Passer l'intro » : sans saut brutal, jusqu'à l'arrêt */
 u.querySelector('.r-skip').addEventListener('click',e=>{e.preventDefault();arm();geo();scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+STOP*D,behavior:RM?'auto':'smooth'})});
 ui();tick();
})();
