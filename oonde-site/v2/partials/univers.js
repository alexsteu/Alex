/* L'univers OONDE en haut de page : faire défiler fait avancer la caméra image par image (rendu d'avance dans entree3d/,
   scène « oonde »). Sur chaque enseigne de maquette, le métier est posé en perspective (pins.json) ; à la fin, toucher
   une maquette ouvre l'entrée 3D de ce métier, plus bas (data-e3, géré par e3d.js). Mouvement réduit : la dernière image. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('uWalk'),stg=$('uStage'),scene=u.querySelector('.u-scene'),cv=$('uCv'),cx=cv.getContext('2d'),poster=$('uPoster'),pins=$('uPins'),hits=$('uHits');
 const t2=u.querySelector('.u-t2'),t15=u.querySelector('.u-t15'),t3=u.querySelector('.u-t3'),t1=u.querySelector('.u-t1'),LIVE=!RM,SETS={d:96,m:72},store={};
 let set='d',W=0,H=0,P=0,cur=0,last=-1,raf=0,drawn=null,dirty=true,vis=true,D=1,hh=64;
 const base=k=>'img/e3d/oonde/'+k+'/';
 const near=(k,i)=>{const s=store[k];if(!s)return null;const n=SETS[k];for(let d=0;d<n;d++){if(i-d>=0&&s.ok[i-d])return[s.img[i-d],i-d,s];if(i+d<n&&s.ok[i+d])return[s.img[i+d],i+d,s]}return null};
 function load(k){if(store[k])return;const n=SETS[k],s=store[k]={img:new Array(n),ok:new Uint8Array(n),pins:null};
  fetch(base(k)+'pins.json').then(r=>r.json()).then(j=>{s.pins=j;dirty=true;tick()}).catch(()=>{});
  const want=i=>LIVE||i===n-1;
  const got=buf=>{const v=new DataView(buf),hl=v.getUint32(0,true),head=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,hl)));
   return Promise.all(head.filter(([i])=>want(i)).map(([i,o,l])=>{const im=new Image();im.decoding='async';
    im.src=URL.createObjectURL(new Blob([new Uint8Array(buf,4+hl+o,l)],{type:'image/webp'}));
    return (im.decode?im.decode():new Promise(r=>im.onload=r)).catch(()=>{}).then(()=>{s.img[i]=im;s.ok[i]=1;if(k===set)dirty=true;tick()})}))};
  const get=g=>fetch(base(k)+'p'+g+'.txt').then(r=>{if(!r.ok)throw r.status;return r.text()}).then(t=>{const b=atob(t),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer});
  get(0).then(got).then(()=>LIVE&&Promise.all([get(1).then(got),get(2).then(got)]).then(()=>get(3)).then(got))
   .catch(()=>{if(k==='m'&&!s.ok[0]&&!s.ok[n-1]){set='d';load('d')}})}   /* jeu absent : l'autre, recadré */
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight)};
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=cv.width=Math.round(r.width*d);H=cv.height=Math.round(r.height*d);
  const k=r.width<r.height*.95?'m':'d';if(k!==set||!store[k]){set=k;load(k);if(!LIVE||!u.classList.contains('live'))poster.src=base(k)+(LIVE?'f000':last0(k))+'.webp'}geo();dirty=true}
 const last0=k=>'f'+String(SETS[k]-1).padStart(3,'0');
 /* les maquettes : le métier sur l'enseigne, et une zone à toucher qui descend de l'enseigne jusqu'au socle (6,2 fois sa hauteur) */
 const lab=[...pins.children],hit=[...hits.children];
 function place(pp,f){lab.forEach((el,j)=>{const q=pp&&pp.find(x=>x.id===el.dataset.id),a=hit[j];
  if(!q||q.vis<=0){el.style.opacity=0;a.style.visibility='hidden';return}
  e3quad(el,q.c,400,75,f);el.style.opacity=q.vis;
  const[c0,c1,c2,c3]=q.c,ext=(t,b)=>[t[0]+(b[0]-t[0])*6.2,t[1]+(b[1]-t[1])*6.2];
  e3quad(a,[c0,c1,ext(c1,c2),ext(c0,c3)],400,465,f);a.style.visibility=q.vis>.5?'visible':'hidden'})}
 function draw(p){if(!W||!H)return;const r=near(set,Math.round(p*(SETS[set]-1)));if(!r)return;const[im,i,s]=r;if(im===drawn&&!dirty)return;
  const sc=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*sc,h=im.naturalHeight*sc;
  cx.drawImage(im,(W-w)/2,(H-h)/2,w,h);drawn=im;dirty=false;u.classList.add('live');
  const d=W/scene.clientWidth;place(s.pins&&s.pins[i]?s.pins[i].pins:null,{ox:(W-w)/2/d,oy:(H-h)/2/d,w:w/d,h:h/d})}
 /* le rythme : un temps sur le logo, la traversée, l'onde, puis un arrêt sur les maquettes pour lire et choisir */
 const camOf=P=>P<.03?0:P>.86?1:(P-.03)/.83;
 const fade=(a,b,c,d)=>Math.min(clamp((P-a)/(b-a||1),0,1),clamp((d-P)/(d-c||1),0,1));
 function ui(){if(!LIVE){u.classList.add('static','end');return}t1.style.opacity=clamp((.1-P)/.07,0,1);t1.style.visibility=P>.1?'hidden':'';
  const sl=(el,a,b,c,d)=>{el.style.opacity=fade(a,b,c,d);el.style.translate=`0 ${(1-clamp((P-a)/(b-a),0,1))*12}px`};
  sl(t15,.13,.17,.27,.31);sl(t2,.35,.4,.58,.63);
  const e=clamp((P-.86)/.06,0,1);t3.style.opacity=e;t3.style.transform=`translateY(${(1-e)*16}px)`;t3.inert=e<.5;u.classList.toggle('end',e>.5)}
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 function loop(){raf=0;if(!LIVE){draw(1);return}const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  const t=camOf(P);cur+=(t-cur)*.22;if(Math.abs(t-cur)<.0005)cur=t;
  if(dirty||cur!==last){draw(cur);last=cur}ui();if(cur!==t)tick()}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;tick()}).observe(walk);
 poster.onerror=()=>{if(poster.src.includes('/m/'))poster.src=poster.src.replace('/m/','/d/').replace(last0('m'),last0('d'))};
 size();addEventListener('resize',()=>{size();tick()});
 if(LIVE)addEventListener('scroll',()=>{if(vis)tick()},{passive:true});
 /* « Passer l'intro » et « Voir les offres » : sans saut brutal */
 u.querySelectorAll('a[href^="#"]:not([data-e3])').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}));
 ui();tick();
})();
