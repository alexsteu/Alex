/* La rue au crépuscule, en haut de page. Faire défiler fait avancer la caméra image par image (rendu d'avance,
   entree3d/scenes/rue.js) : le réverbère bleu, la rue, les vitrines, puis l'arrêt devant une enseigne vide où le visiteur
   tape son nom. Les métiers (data-e3) ouvrent l'entrée 3D plus bas (e3d.js). La première image est une affiche légère ;
   les images du film ne se chargent qu'au premier geste. Mouvement réduit : l'image de l'arrêt, immobile. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),cv=$('rCv'),cx=cv.getContext('2d'),poster=$('rPoster'),pins=$('rPins'),anchor=$('choix');
 const t1=u.querySelector('.r-t1'),says=[...u.querySelectorAll('.r-say')],stop=$('rStop'),cue=u.querySelector('.r-cue'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),signT=sign.firstElementChild;
 const LIVE=!RM,SETS={d:72,m:60},STOP=.79,store={},labs=[...pins.children].filter(x=>x!==sign);
 let set='d',W=0,H=0,P=0,cur=0,last=-1,raf=0,dirty=true,vis=true,D=1,hh=64,armed=false,t0=0;
 const base=k=>'img/e3d/rue/'+k+'/';
 /* les images arrivent en 4 paquets (build.py, pack()) : une sur 8 d'abord, puis le reste entre deux */
 function load(k){if(store[k])return;const n=SETS[k],s=store[k]={img:new Array(n),ok:new Uint8Array(n),pins:null};
  fetch(base(k)+'pins.json').then(r=>r.json()).then(j=>{s.pins=j;dirty=true;tick()}).catch(()=>{});
  if(!LIVE)return;
  const got=buf=>{const v=new DataView(buf),hl=v.getUint32(0,true),head=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,hl)));
   return Promise.all(head.map(([i,o,l])=>{const im=new Image();im.decoding='async';
    im.src=URL.createObjectURL(new Blob([new Uint8Array(buf,4+hl+o,l)],{type:'image/webp'}));
    return (im.decode?im.decode():new Promise(r=>im.onload=r)).catch(()=>{}).then(()=>{s.img[i]=im;s.ok[i]=1;if(k===set)dirty=true;tick()})}))};
  const get=g=>fetch(base(k)+'p'+g+'.txt').then(r=>{if(!r.ok)throw r.status;return r.text()}).then(t=>{const b=atob(t),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer});
  get(0).then(got).then(()=>Promise.all([get(1).then(got),get(2).then(got)])).then(()=>get(3)).then(got).catch(()=>{})}
 const arm=()=>{if(armed)return;armed=true;load(set)};
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight);anchor.style.top=(STOP*D)+'px'};
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=cv.width=Math.round(r.width*d);H=cv.height=Math.round(r.height*d);
  const k=r.width<r.height*.95?'m':'d';if(k!==set){set=k;if(armed)load(k)}if(!LIVE)load(k);geo();dirty=true}
 /* le nom : sur l'enseigne vide, en néon ; et sur l'entrée plus bas */
 const fit=()=>e3fit(signT,signT.textContent,'400 {s}px "Cormorant Garamond"',86,860);
 function named(v,push){const t=v.trim().slice(0,40);signT.textContent=t||'Votre nom ici';sign.classList.toggle('on',!!t);fit();
  if(push){const e=$('eName');if(e&&e.value!==v){e.value=v;e.dispatchEvent(new Event('input'))}}}
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter')nameIn.blur()});
 {const e=$('eName');if(e&&e.value){nameIn.value=e.value;named(e.value,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(fit);
 /* une image : les deux voisines fondues l'une dans l'autre ; les enseignes, interpolées de même */
 const pinAt=(s,i)=>s.pins&&s.pins[i]?s.pins[i].pins:null;
 function draw(p,still){const s=store[set];if(!W||!H||!s)return;const n=SETS[set],f=p*(n-1);let i0=Math.floor(f),i1=Math.min(n-1,i0+1),a=f-i0;
  if(still){i0=i1=Math.round(f);a=0}   /* à l'arrêt, une image nette : le fondu ne sert qu'en mouvement */
  if(!s.ok[i0]||!s.ok[i1]){let j=Math.round(f),b=-1;for(let d=0;d<n&&b<0;d++){if(j-d>=0&&s.ok[j-d])b=j-d;else if(j+d<n&&s.ok[j+d])b=j+d}if(b<0)return;i0=i1=b;a=0}
  const im=s.img[i0],sc=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*sc,h=im.naturalHeight*sc,ox=(W-w)/2,oy=(H-h)/2;
  cx.globalAlpha=1;cx.drawImage(im,ox,oy,w,h);if(a>.02&&i1!==i0){cx.globalAlpha=a;cx.drawImage(s.img[i1],ox,oy,w,h);cx.globalAlpha=1}
  u.classList.add('live');dirty=false;
  const A=pinAt(s,i0),B=pinAt(s,i1)||A,d=W/scene.clientWidth;place(A&&B?A.map((q,j)=>{const r=B[j]||q;return{id:q.id,vis:q.vis+(r.vis-q.vis)*a,c:q.c.map((c,k)=>[c[0]+(r.c[k][0]-c[0])*a,c[1]+(r.c[k][1]-c[1])*a])}}):A,{ox:ox/d,oy:oy/d,w:w/d,h:h/d},p)}
 function place(pp,f,p){for(const el of pins.children){const q=pp&&pp.find(x=>x.id===el.dataset.id);
  if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,127,f);
  if(el===sign){el.style.opacity=q.vis;continue}
  const mx=(q.c[0][0]+q.c[1][0])/2,near=clamp(1-Math.abs(mx-.5)/.42,0,1);el.style.opacity=(q.vis*Math.min(1,near*1.8)*(p>.84?0:1)).toFixed(2)}}
 /* le rythme : un temps sur le point bleu, la rue, un arrêt devant l'enseigne, puis la porte s'ouvre */
 const camOf=P=>P<.04?0:P<.74?.88*(P-.04)/.7:P<.84?.88:.88+.12*(P-.84)/.16;
 const fade=(a,b,c,d)=>Math.min(clamp((P-a)/(b-a||1),0,1),clamp((d-P)/(d-c||1),0,1));
 function ui(){if(!LIVE)return;
  t1.style.opacity=clamp((.09-P)/.05,0,1);t1.style.visibility=P>.09?'hidden':'';cue.style.opacity=clamp((.03-P)/.03,0,1);
  const W3=[[.17,.2,.32,.36],[.42,.46,.6,.64],[.88,.92,1.1,1.2]];
  says.forEach((el,j)=>{const[a,b,c,d]=W3[j];const o=fade(a,b,c,d);el.style.opacity=o;el.style.translate=`0 ${(1-clamp((P-a)/(b-a),0,1))*14}px`});
  const e=clamp((P-.7)/.05,0,1);stop.style.opacity=e;stop.style.transform=`translateY(${(1-e)*18}px)`;stop.classList.toggle('on',e>.05);stop.inert=e<.5;u.classList.toggle('stop',e>.5)}
 /* mouvement réduit : l'affiche de l'arrêt, et le nom posé sur son enseigne */
 function still(){const s=store[set];if(!s||!s.pins||!poster.naturalWidth)return;const i=Math.round(.88*(SETS[set]-1)),rw=scene.clientWidth,rh=scene.clientHeight,sc=Math.max(rw/poster.naturalWidth,rh/poster.naturalHeight),w=poster.naturalWidth*sc,h=poster.naturalHeight*sc;
  place(pinAt(s,i),{ox:(rw-w)/2,oy:(rh-h)/2,w,h},1)}
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 /* l'inertie : la caméra rattrape le défilement avec un temps de ~120 ms, comme une image filmée, pas saccadée */
 function loop(now){raf=0;const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;
  const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  if(!LIVE){still();return}
  const t=camOf(P);cur+=(t-cur)*(1-Math.exp(-dt/.12));if(Math.abs(t-cur)<.0004)cur=t;
  if(dirty||cur!==last){draw(cur,cur===t);last=cur}ui();if(cur!==t)tick();else t0=0}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;tick()}).observe(walk);
 if(!LIVE){u.classList.add('static');poster.addEventListener('load',tick);poster.src=base(r0())+'stop.jpg';const ps=poster.parentNode.querySelector('source');if(ps)ps.srcset=base('m')+'stop.jpg'}
 function r0(){return scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d'}
 size();addEventListener('resize',()=>{size();tick()});
 if(LIVE){addEventListener('scroll',()=>{arm();if(vis)tick()},{passive:true});
  for(const ev of ['wheel','touchstart','keydown'])addEventListener(ev,arm,{passive:true,once:true});
  if(scrollY>0)arm();
  requestAnimationFrame(()=>u.classList.add('go'))}else u.classList.add('go');
 /* « Passer l'intro » : sans saut brutal, jusqu'à l'arrêt */
 u.querySelector('.r-skip').addEventListener('click',e=>{e.preventDefault();arm();geo();scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+STOP*D,behavior:RM?'auto':'smooth'})});
 ui();tick();
})();
