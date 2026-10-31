/* La rue au crépuscule, en haut de page. v27 : plus d'images pilotées par le défilement : des vidéos, lues en avant, jamais cherchées
   (entree3d ?n3=restaurant,coiffure,institut, rendues à 60 i/s en H.264 ; video/e3d/<jeu>/, affiches img/e3d/v/<jeu>/) :
   1. l'intro (in.mp4, 2,5 s) : la page s'ouvre sur la carte-titre OONDE posée sur sa première image, et y reste HOLD_MS (5 s, comptées depuis
      le moment où le clip est prêt : un réseau lent ne mange pas la pause) ; un geste (roulette, doigt, clic, Espace…) ou le bouton « Entrée »
      la fait partir plus tôt (v27.3, v27.4). Pendant la pause et l'intro, la page est tenue (épinglée, comme pendant l'entrée) : rien ne file vers le bas.
      Puis 0,5 s sur le globe bleu du réverbère (le point du logo) sous la carte-titre, puis la caméra
      se pose devant la façade du milieu (Coiffure) ; elle reste sur sa dernière image, la carte monte : le nom (il s'allume sur l'enseigne),
      le métier (trois tuiles : un glissement g-<a>-<b>.mp4 d'une façade à l'autre), « Entrer ».
   2. l'entrée (e-<métier>.mp4, 1,8 s) : au geste qui passe l'arrêt (ou « Entrer »), la page est épinglée, la porte s'ouvre, on traverse la salle,
      le film s'arrête sur sa dernière image ; seulement alors « Ce soir, une table vous attend. » et la suite du site, dessous.
   Trois façades (TRIO), les autres métiers restent dans les rubriques du site. Mouvement réduit, sans film : l'image de l'arrêt et la carte. */
(()=>{const u=$('univers');if(!u)return;
/* v37 (24.10, Alexandre) : le visiteur a déjà vu l'entrée du vrai site (le téléphone sur le lac) ; /sites est un exemple, il passe vite :
   pas de carte-titre tenue 5 s ni de film d'intro, la page s'ouvre directement sur l'arrêt (la façade, le nom, le métier) ; in.mp4 n'est plus chargé. */
const QUICK=true;if(QUICK)u.classList.add('quick');
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),poster=$('rPoster'),hold=$('rHold'),vIn=$('rVin'),vG=$('rVg'),vE=$('rVe'),pins=$('rPins'),anchor=$('choix');
 const ld=u.querySelector('.r-load'),t1=u.querySelector('.r-t1'),say=u.querySelector('.r-say'),stop=$('rStop'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),nm=sign.querySelector('.r-nm'),mets=[...sign.querySelectorAll('.r-met i')],veil=u.querySelector('.r-veil'),seg=u.querySelector('.r-seg'),rwall=$('rWall'),sbar=$('rSbar'),end=$('rEnd');
 const HOLD_MS=5000;   /* v27.3 : la pause sur OONDE avant la rue, une fois l'intro prête ; un geste part plus tôt. v28 : 5 s (3 s, « trop faible ») */
 const TRIO=['restaurant','coiffure','institut'],HOME='coiffure',VS={m:[1080,1920],d:[1920,1080]},HZ=140;   /* HZ : la zone de l'arrêt (px) : jusqu'au mur, avant l'entrée */
 let SLOW=false,stalls=0;try{const cn=navigator.connection;if(cn&&(cn.saveData||/2g|3g/.test(cn.effectiveType||'')||cn.downlink&&cn.downlink<3))SLOW=true}catch(e){}   /* réseau lent : on précharge moins, et un clip qui tarde est coupé (image tenue) plutôt qu'attendu */
 const COARSE=matchMedia('(pointer:coarse)').matches;let LIVE=!RM,set='d',fmt='jpg',st='title',met='',frz=false,kbY=-1,SW=1,SH=1,hh=64,D=HZ,dn=1,y0=0,ent=null,entOk=false,vis=true,fitB=null,PINS=null,sIn=false,skipT=0;
 const VX=(()=>{try{const v=document.createElement('video');return v.canPlayType('video/mp4; codecs="avc1.64002A"')?'mp4':v.canPlayType('video/webm; codecs="vp09.00.40.08"')?'webm':'mp4'}catch(e){return 'mp4'}})();   /* H.264 partout ; VP9 (WebM) pour les Chromium sans codecs propriétaires */
 const vid=k=>'video/e3d/'+set+'/'+k+'.'+VX,img=k=>'img/e3d/v/'+set+'/'+k+'.'+fmt;
 const r0=()=>scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d';
 const ss=x=>x*x*(3-2*x),memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}},flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 /* le cadrage « cover » de l'image du jeu (1080×1920 ou 1920×1080) dans la scène : les enseignes s'y posent */
 function fit(){const r=scene.getBoundingClientRect(),[w0,h0]=VS[set],sc=Math.max(r.width/w0,r.height/h0),w=w0*sc,h=h0*sc;SW=r.width;SH=r.height;fitB={ox:(r.width-w)/2,oy:(r.height-h)/2,w,h}}
 /* les enseignes (pins.json : à l'arrêt devant chaque façade, le rectangle de son enseigne ; dans sa salle, le mur du fond) */
 fetch('img/e3d/v/pins.json').then(r=>r.json()).then(j=>{PINS=j;place()}).catch(()=>{});
 let signQ=null,signH={};
 /* v27.4.1 : l'enseigne attend l'arrêt : pendant le titre, l'intro et le saut (la façade n'est pas encore là), rien ; arrive() → place() la fait fondre (.35 s)
    v28 : la hauteur du bloc suit les proportions de l'enseigne (e3qh, une fois par jeu et métier) : le nom n'est plus écrasé (le bloc fixe de 127 px l'aplatissait de 15 à 22 %) */
 function place(){if(!PINS||!fitB){return}const P=PINS[set]||{};const q=(st==='in'||st==='title'||st==='intro'||st==='skip')?null:P.stop&&P.stop[met];
  if(q&&st!=='glide'&&st!=='door'){const hk=set+met,h=signH[hk]||(signH[hk]=e3qh(q,fitB));put(sign,'height',h+'px');e3quad(sign,q,1000,h,fitB);put(sign,'opacity','1');signQ={c:q,f:fitB}}else{put(sign,'opacity','0')}
  const rq=P.room&&P.room[met];if(rq&&rwall.firstElementChild){const h=e3qh(rq,fitB);if(Math.abs((rwall.firstElementChild._h||0)-h)>.5)wall()}   /* v28 : le mur suit ses proportions ; reposé si le jeu ou le cadrage a changé depuis */
  const w=st==='in'?rq:null;if(st!=='door')e3place(rwall,w?[{id:'wall',c:w,vis:1}]:null,fitB)}
 /* le nom : sur l'enseigne, en néon. Seules les lettres nouvelles s'allument ; la largeur et la taille suivent en douceur. */
 let shown='';
 const fitN=()=>{e3meas.font='400 86px "Cormorant Garamond"';const w=e3meas.measureText(shown).width;nm.style.setProperty('--w',Math.ceil(w)+'px');nm.style.setProperty('--s',Math.min(1,860/(w||1)).toFixed(3))};
 function named(v,push){const t=v.trim().slice(0,40);let k=0;while(k<t.length&&k<shown.length&&t[k]===shown[k])k++;
  const bs=[...nm.children];for(let i=bs.length-1;i>=k;i--)bs[i].remove();
  for(let i=k;i<t.length;i++){const b=document.createElement('b');b.textContent=t[i];if(push)b.className='r-lit';b.style.animationDelay=Math.min(i-k,6)*35+'ms';nm.appendChild(b)}
  shown=t;sign.classList.toggle('on',!!t);fitN();recall();wall();if(push)E3S.set({name:v})}
 /* le métier : une tuile à l'arrêt ; la caméra glisse jusqu'à sa façade (un clip), le nom passe sur son enseigne, et la porte est la sienne */
 let mi=0,chosen=!!E3S.st.touched;
 const tiles=()=>[...seg.querySelectorAll('[data-m]')],padL=()=>parseFloat(getComputedStyle(seg).scrollPaddingLeft)||parseFloat(getComputedStyle(seg).paddingLeft)||0;
 let thumbs=false;const thumb=()=>{if(thumbs)return;thumbs=true;seg.querySelectorAll('img[data-src]').forEach(i=>{i.src=i.dataset.src})};
 function metier(k,push){if(!E3[k])return;if(!TRIO.includes(k)){if(!met)k=HOME;else return}if(push&&LIVE&&(st==='door'||st==='in'))return;const was=met;if(push)chosen=true;met=k;
  tiles().forEach(b=>{const on=b.dataset.m===k;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});
  if(k!==was){const a=mets[mi],b=mets[mi^=1];b.textContent=E3[k].lab;a.classList.remove('a');b.classList.add('a')}else mets[mi].classList.add('a');
  recall();if(push)E3S.set({sc:k});wall();if(k!==was&&was&&LIVE&&st!=='title'&&st!=='intro')glide(was,k);else if(k!==was)entryLoad();place()}
 function wall(){if(!rwall||!E3[met])return;const w=PINS&&PINS[set]&&PINS[set].room&&PINS[set].room[met];e3pins(rwall,E3[met],E3S.st.name||'Votre nom ici',w&&fitB?e3qh(w,fitB):undefined)}   /* v28 : la hauteur du mur suit ses proportions (e3qh) */
 function recall(){const m=E3[met]?E3[met].lab:'';u.querySelectorAll('[data-rc-m]').forEach(e=>e.textContent=m);u.querySelectorAll('[data-rc-n]').forEach(e=>e.textContent=(shown?shown+' · ':'')+m)}
 metier(TRIO.includes(E3S.st.sc)?E3S.st.sc:HOME,false);
 let segT=0,segMe=0,segU=false;
 seg.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;metier(b.dataset.m,true);centre(true)});
 seg.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const bs=tiles(),i=Math.max(0,bs.findIndex(b=>b.dataset.m===met)),n=e.key==='Home'?bs[0]:e.key==='End'?bs[bs.length-1]:bs[(i+(/Right|Down/.test(e.key)?1:bs.length-1))%bs.length];metier(n.dataset.m,true);n.focus();centre(true)});
 function centre(sm){const b=seg.querySelector(`[data-m="${met}"]`);if(!b||seg.scrollWidth<=seg.clientWidth+2)return;const x=Math.min(b.offsetLeft-padL(),seg.scrollWidth-seg.clientWidth);segMe=performance.now();seg.scrollTo({left:x,behavior:sm&&!RM?'smooth':'instant'})}
 seg.addEventListener('scroll',()=>{if(!segU||performance.now()-segMe<700)return;clearTimeout(segT);segT=setTimeout(()=>{const c=seg.scrollLeft+padL(),mx=seg.scrollWidth-seg.clientWidth,cur=seg.querySelector(`[data-m="${met}"]`);
   if(chosen&&cur&&seg.scrollLeft>=mx-2&&cur.offsetLeft-padL()>=mx-2)return;let best=null,bd=1e9;for(const b of tiles()){const d=Math.abs(b.offsetLeft-c);if(d<bd){bd=d;best=b}}
  if(best&&(!chosen||best.dataset.m!==met))metier(best.dataset.m,true)},140)},{passive:true});
 for(const ev of ['pointerdown','touchstart','wheel'])seg.addEventListener(ev,()=>{segU=true},{passive:true});
 document.addEventListener('oonde-e3',e=>{if(e.detail.sc!==met)metier(e.detail.sc,false);if(e.detail.name&&!nameIn.value){nameIn.value=e.detail.name;named(e.detail.name,false)}wall()});
 u.querySelector('.r-enter').addEventListener('click',e=>{e.preventDefault();enter()});
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();nameIn.blur()}});
 {const v=E3S.st.name;if(v){nameIn.value=v;named(v,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(()=>{fitN();wall()});
 /* ——— les images tenues (affiches) : l'arrêt devant chaque façade, le seuil (la salle allumée), la salle ——— */
 const cache={};function pre(k){const s=img(k);if(cache[s])return cache[s];const i=new Image();i.decoding='async';i.src=s;return cache[s]=(i.decode?i.decode().catch(()=>{}):Promise.resolve()).then(()=>s)}
 function holdTo(k){return pre(k).then(s=>{if(hold.src!==s&&!hold.src.endsWith('/'+s))hold.src=s;return (hold.decode?hold.decode():Promise.resolve()).catch(()=>{})}).then(()=>flag(u,'held',true))}   /* l'élément affiché lui-même est décodé avant d'être montré : pas une image de trou */
 /* ——— les vidéos : muettes, en ligne, jamais cherchées ; visibles seulement une fois qu'elles jouent (aucune image noire) ——— */
 function play(v){const p=v.play();if(p&&p.catch)p.catch(()=>{});return p}
 const onEnd=(v,fn,ms)=>{let done=false;const f=()=>{if(done)return;done=true;v.removeEventListener('ended',f);clearTimeout(t);fn()};v.addEventListener('ended',f);const t=setTimeout(()=>{if(v.ended||v.currentTime>=v.duration-.05||v.paused)f()},ms);return f};
 /* la carte : à l'arrêt seulement (le film posé) ; l'enseigne pulse deux fois à l'arrivée */
 let arrT=0;function card(on){if(stop._e===on)return;stop._e=on;flag(stop,'on',on);flag(u,'stop',on);if(on){thumb();if(SLOW)Promise.all(TRIO.map(x=>pre('stop-'+x))).then(()=>{if(st==='stop')entryLoad()});else entryLoad()}}   /* réseau lent : d'abord les trois images de l'arrêt (les coupes), puis l'entrée */
 function arrive(){st='stop';pin(false);flag(u,'intro',false);put(t1,'opacity','0');flag(t1,'off',true);veil.style.setProperty('--hv','0');flag(u,'moving',true);place();
  flag(sign,'pulse',!shown);setTimeout(()=>flag(sign,'pulse',false),1300);arrT=performance.now();rested=true;setTimeout(()=>{if(st==='stop')card(true)},shown||chosen?250:400)}
 /* 1. l'intro : dès qu'elle joue, la vidéo remplace l'affiche ; la carte-titre s'efface sur son premier temps (0,55 → 1 s) ; à la fin, l'arrêt.
    v27.3 : prête, elle attend HOLD_MS sur la carte-titre, ou le premier geste. v27.5 : l'autoplay est de retour (sans lui, iOS ne charge qu'un bout et n'est jamais prête) :
    le premier plan joue caché et se pose aussitôt (prime), la pause part de là ; play() en muet, en ligne, sans geste. Sans autoplay du tout : prête quand le clip est là (secours) */
 let ready=false,want=false,primed=false,userGo=false,holdT=0,goT=0,readyT=0;
 /* v27.5 : l'autoplay reste (iOS ne charge vraiment le clip qu'en jouant) : au premier « playing », pause sur le premier plan (fixe jusqu'à 0,5 s), prête ;
    la pause HOLD_MS part de là. go() reprend la lecture (muet, en ligne : permis sans geste après un départ en autoplay) ; le « playing » qui suit lance l'intro. */
 const full=()=>{try{const b=vIn.buffered,d=vIn.duration;return b.length>0&&d>0&&b.end(b.length-1)>=d-.15}catch(e){return false}};
 const fed=()=>vIn.readyState>=4||full();
 /* le départ : au bout de la pause, si le clip n'est pas encore entièrement là (buffered), on lui laisse jusqu'à 2,5 s de plus (jamais plus) ; un geste ou le bouton : tout de suite ; forcé (12 s) : tout de suite */
 function go(force){if(st!=='title'||!LIVE)return;want=true;if(!ready&&!force)return;clearTimeout(holdT);
  if(!force&&!userGo&&!full()&&performance.now()-readyT<HOLD_MS+2500){holdT=setTimeout(go,150);return}
  goT=performance.now();const pr=vIn.play();if(pr&&pr.catch)pr.catch(()=>{if(st==='title')setTimeout(()=>{if(st==='title'&&vIn.paused)toStop()},400)})}
 function armed(force){if(ready||st!=='title')return;if(!force&&!fed())return;ready=true;readyT=performance.now();clearTimeout(holdT);clearInterval(armI);if(want)go();else holdT=setTimeout(go,HOLD_MS)}
 let armI=0;
 /* l'amorce : le premier plan joue (caché : l'affiche est devant), on le pose aussitôt ; passé 0,45 s (onglet lent), retour à 0,1 s */
 function prime(){if(primed||st!=='title')return;primed=true;try{vIn.pause()}catch(e){}if(vIn.currentTime>.45){try{vIn.currentTime=.1}catch(e){}}armed(true)}
 function onPlaying(){if(st!=='title'||!LIVE)return;if(want&&ready&&goT)introStart();else if(!primed)prime();else{try{vIn.pause()}catch(e){}}}
 /* le geste qui part plus tôt : roulette, doigt, clic sur la scène, Espace / flèche bas / page suivante / Entrée ; pendant le titre et l'intro, la page est tenue :
    la roulette, le doigt et les touches de défilement sont avalés (v27.4 : sur iPhone, l'élan du doigt filait jusqu'au site) */
 function early(e){if((st!=='title'&&st!=='intro')||!LIVE)return;const tg=e.target,ctl=!!(tg&&tg.closest&&tg.closest('a,button,input,select,textarea,.r-seg'));
  if(e.type==='keydown'){if(ctl||![' ','ArrowDown','PageDown','End','Enter'].includes(e.key))return;e.preventDefault()}else if(e.type==='wheel')e.preventDefault();else if(e.type==='touchmove'){if(e.cancelable)e.preventDefault()}else if(ctl)return;
  userGo=true;go()}
 addEventListener('wheel',early,{passive:false,capture:true});addEventListener('touchstart',early,{passive:true,capture:true});addEventListener('touchmove',early,{passive:false,capture:true});addEventListener('keydown',early,true);
 stg.addEventListener('pointerdown',early);stg.addEventListener('click',early);
 {const b=u.querySelector('.r-skip');if(b)b.addEventListener('click',e=>{e.preventDefault();if(st==='title'){userGo=true;go()}})}   /* « Entrée » : comme un geste */
 let wIn=0;vIn.addEventListener('waiting',()=>{if(st!=='intro'||vIn.currentTime<.1)return;if(full()||performance.now()-goT<1500){clearTimeout(wIn);wIn=setTimeout(()=>{if(st==='intro'&&vIn.readyState<3){SLOW=true;toStop()}},700);return}SLOW=true;toStop()});   /* l'intro qui cale : réseau lent, on passe à l'arrêt (fondu) plutôt que de saccader ; le clip entier déjà là, ou la reprise après la pause (décodeur à froid, v27.5 : quoi qu'en dise buffered sur iOS), on lui laisse 0,7 s */
 vIn.addEventListener('playing',()=>clearTimeout(wIn));
 function introStart(){if(st!=='title'||!LIVE)return;st='intro';onEnd(vIn,introEnd,7000);flag(vIn,'on',true);flag(u,'moving',true);pre('stop-'+HOME);const tick=()=>{if(st!=='intro')return;const t=vIn.currentTime,h=1-ss(Math.min(1,Math.max(0,(t-.55)/.45)));put(t1,'opacity',h.toFixed(3));flag(t1,'off',h<.02);veil.style.setProperty('--hv',h.toFixed(2));flag(u,'intro',t<.6);requestAnimationFrame(tick)};tick()}
 function introEnd(){if(st!=='intro'&&st!=='title')return;holdTo('stop-'+HOME).then(()=>{flag(vIn,'on',false);try{vIn.removeAttribute('src');vIn.load()}catch(e){}arrive()})}
 /* « Passer l'intro », « Voir la démo », un lien : droit à l'arrêt, en fondu */
 function toStop(){if(!LIVE){stop.scrollIntoView({block:'nearest'});return}if(st==='title'||st==='intro'){st='skip';try{vIn.pause()}catch(e){}flag(u,'fade',true);holdTo('stop-'+HOME).then(()=>{flag(vIn,'on',false);arrive();setTimeout(()=>flag(u,'fade',false),500)})}else if(st==='stop')e3glide(y0)}
 /* 2. le glissement, à l'arrêt : d'une façade à l'autre (le clip de la paire), le nom s'efface et revient sur la nouvelle enseigne */
 let gq=null;const pre2={};
 function glide(a,b){if(st!=='stop'&&st!=='glide'){return}if(st==='glide'){gq=[a,b];return}st='glide';card(stop._e);place();entOk=false;flag(vE,'on',false);
  if(!entOk&&ent){try{vE.removeAttribute('src');vE.load()}catch(e){}ent=null}   /* l'entrée pas encore là : elle laisse le réseau au glissement, et se recharge après */
  pre('stop-'+b);
  if(SLOW){holdTo('stop-'+b).then(()=>{if(st==='glide'){st='stop';place()}const q=gq;gq=null;if(q)glide(q[0],q[1]);else entryLoad()});return}   /* réseau lent : coupe nette vers l'autre façade, sans clip */
  const src=vid('g-'+a+'-'+b);vG.src=src;vG.load();const to=b;let shownV=false;const show=()=>{if(shownV)return;shownV=true;flag(vG,'on',true)};
  vG.addEventListener('playing',show,{once:true});const fin=()=>{holdTo('stop-'+to).then(()=>{flag(vG,'on',false);if(st==='glide'){st='stop';place()}const q=gq;gq=null;if(q&&q[1]!==met)glide(q[0],met);else if(q)glide(q[0],q[1]);else entryLoad()})};
  const fin1=onEnd(vG,fin,SLOW?1200:2600);const p=play(vG);if(p&&p.then)p.then(null,()=>{fin1()});
  setTimeout(()=>{if(st==='glide'&&!shownV&&vG.src===new URL(src,location.href).href){SLOW=true;try{vG.pause();vG.removeAttribute('src');vG.load()}catch(e){}fin1()}},SLOW?900:1600);   /* le clip tarde : coupe nette vers l'image de l'arrêt */
  ld.textContent='';setTimeout(()=>{if(st==='glide'&&!shownV)ld.textContent='Vers la façade : '+E3[to].lab+'…'},900);const clr=()=>{if(ld.textContent.startsWith('Vers la façade'))ld.textContent=''};vG.addEventListener('playing',clr,{once:true});vG.addEventListener('ended',clr,{once:true})}
 /* 3. l'entrée : le clip du métier, chargé dès que la carte est là ; sa première image (la salle allumée) s'allume derrière la vitrine ; « Entrer » ou le geste qui passe le mur le lance, page épinglée */
 function entryLoad(){if(!LIVE||!met||st!=='stop'&&st!=='glide'&&st!=='door')return;const src=vid('e-'+met);if(ent===src)return;ent=src;entOk=false;flag(vE,'on',false);vE.poster=img('door-'+met);vE.src=src;vE.load();
  const ok=()=>{if(ent!==src)return;entOk=true;if(st==='stop')flag(vE,'on',true);TRIO.forEach(x=>pre('stop-'+x));if(!SLOW)TRIO.filter(x=>x!==met).forEach(x=>{const u=vid('g-'+met+'-'+x);if(!pre2[u]){pre2[u]=1;try{fetch(u,{priority:'low'}).catch(()=>{})}catch(e){}}})};vE.addEventListener('canplaythrough',ok,{once:true});vE.addEventListener('loadeddata',()=>{if(ent===src&&st==='stop')setTimeout(()=>{if(ent===src&&!entOk&&vE.readyState>=2)ok()},1500)},{once:true})}
 function enter(){rel();if(!LIVE){end.scrollIntoView({block:'nearest'});return}if(st!=='stop')return;st='door';gate='door';card(false);flag(u,'door',true);pin(true);geo();e3halt();scrollTo({top:y0+HZ,behavior:'instant'});flag(vE,'on',true);place();
  const src=ent;let t0=0;const tick=()=>{if(st!=='door')return;const t=vE.currentTime||0,d=vE.duration||1.8;put(say,'opacity',ss(Math.min(1,Math.max(0,(t-.15)/.3))*Math.min(1,Math.max(0,(1.05-t)/.3))).toFixed(3));
   const wk=PINS&&PINS[set]&&PINS[set].walk&&PINS[set].walk[met];if(wk&&fitB){const q=wk[Math.min(wk.length-1,Math.round(t*60))];e3place(rwall,[{id:'wall',c:q[1],vis:q[0]}],fitB)}
   const g=ss(Math.min(1,Math.max(0,(t-.68*d)/(.24*d))));put(end,'opacity',g.toFixed(3));put(end,'transform',`translateY(${((1-g)*14).toFixed(1)}px)`);put(sbar,'opacity',ss(Math.min(1,Math.max(0,(t-.5*d)/(.2*d)))).toFixed(3));requestAnimationFrame(tick)};
  let wt=0;const cut=()=>{if(st!=='door')return;SLOW=true;try{vE.pause();vE.removeAttribute('src');vE.load()}catch(e){}ent=null;entered()};
  vE.addEventListener('waiting',()=>{if(st!=='door'||!vE.currentTime)return;clearTimeout(wt);wt=setTimeout(()=>{if(st==='door'&&vE.readyState<3)cut()},SLOW?500:1200)});vE.addEventListener('playing',()=>clearTimeout(wt));
  const go=()=>{if(st!=='door'||ent!==src)return;tick();onEnd(vE,entered,2600);const pr=vE.play();if(pr&&pr.catch)pr.catch(()=>{if(st==='door'&&vE.paused)entered()})};
  if(entOk||vE.readyState>=3)go();else{if(!ent)entryLoad();ld.textContent='Chargement de l’entrée…';const w=()=>{if(st!=='door')return;ld.textContent='';go()};vE.addEventListener('canplaythrough',w,{once:true});setTimeout(()=>{if(st==='door'&&!vE.currentTime){vE.removeEventListener('canplaythrough',w);ld.textContent='';SLOW=true;try{vE.pause();vE.removeAttribute('src');vE.load()}catch(e){}ent=null;entered()}},SLOW?2200:3200)}}
 function entered(){if(st!=='door')return;st='in';holdTo('room-'+met).then(()=>{if(st!=='in')return;place();put(end,'opacity','1');put(end,'transform','none');flag(end,'on',true);put(sbar,'opacity','1');put(say,'opacity','0');flag(u,'past',true);gate='open';pin(false);flag(u,'door',false);setTimeout(()=>{if(st==='in')flag(vE,'on',false)},200)})}
 /* retour en haut après l'entrée : l'arrêt à nouveau (la carte) ; l'entrée rejouera */
 function backToStop(){if(st!=='in')return;st='stop';gate='closed';rested=true;flag(end,'on',false);put(end,'opacity','0');put(sbar,'opacity','0');flag(u,'past',false);ent=null;entOk=false;flag(vE,'on',false);holdTo('stop-'+met).then(()=>{place();card(true);entryLoad()})}
 /* la page épinglée pendant l'entrée : aucun défilement ne passe (le mur), le clip joue à son rythme (≤ 2 s) */
 let pinned=false;function pin(on){pinned=on;const h=document.documentElement;flag(h,'r-pin',on);if(on&&COARSE)h.style.overflow='hidden';else if(!on)h.style.overflow=''}
 /* ——— la géométrie : la scène collée (sticky) ; la zone de l'arrêt (0 → HZ), le mur à HZ ——— */
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight);y0=walk.getBoundingClientRect().top+scrollY-hh;fit();place()};
 const curY=()=>scrollY-y0;
 function size(){const k=r0();if(k!==set){set=k;hold.src='';flag(u,'held',false);if(st==='intro'||st==='title'){try{vIn.pause()}catch(e){}flag(vIn,'on',false);holdTo('stop-'+HOME).then(()=>{if(st==='intro'||st==='title')arrive()})}else if(st==='stop'||st==='glide'){holdTo('stop-'+met);ent=null;entryLoad()}else if(st==='in')holdTo('room-'+met);else if(st==='door'){ent=null}}geo()}
 /* mouvement réduit, ou le film qui ne vient pas : l'image de l'arrêt, la carte, rien ne bloque */
 function toStill(){thumb();u.classList.add('static');poster.src=img('stop-'+HOME);poster.parentNode.querySelectorAll('source').forEach(s=>s.remove());flag(u,'intro',false);st='stop';met=met||HOME;card(true);pin(false);place()}
 function flat(){if(!LIVE)return;LIVE=false;t1.classList.remove('off');u.classList.add('nofilm');for(const el of [t1,say,stop,sbar,end,sign]){el.style.opacity='';el.style.transform=''}memo.clear();for(const v of [vIn,vG,vE]){try{v.pause();v.removeAttribute('src');v.load()}catch(e){}flag(v,'on',false)}toStill();geo()}
 E3F.then(x=>{fmt=x==='a'?'avif':'jpg';set=r0();if(!LIVE){toStill();return}if(QUICK){st='title';setTimeout(toStop,60);return}if(vIn.error||vIn.networkState===3&&!vIn.readyState){flat();return}   /* le clip manque (ou le réseau) : l'image de l'arrêt, sans attendre */
  /* l'intro : prête, elle attend HOLD_MS sur la carte-titre (ou un geste), puis part ; réseau lent si elle n'est pas prête à 4 s */
  vIn.addEventListener('playing',onPlaying);vIn.addEventListener('timeupdate',()=>{if(st==='title'&&!primed&&!goT&&!vIn.paused&&vIn.currentTime>0)prime()});
  setTimeout(()=>{if(st==='title'&&!ready)SLOW=true},4000);   /* réseau lent : pas prête 4 s après le chargement (l'amorce rend prête tout de suite : la pause ne compte jamais) ; le garde-fou de fin (7 s) est posé au départ du clip, dans introStart */
  if(vIn.ended){primed=true;try{vIn.currentTime=.1}catch(e){}armed(true)}else if(!vIn.paused&&vIn.currentTime>0)prime();   /* l'autoplay a déjà fait son premier plan avant nous */
  {const fb=()=>{if(ready||primed||st!=='title')return;if(vIn.readyState>=3||full())armed(true)};setTimeout(()=>{if(ready||primed||st!=='title')return;fb();if(!ready){vIn.addEventListener('canplaythrough',fb);vIn.addEventListener('progress',fb);armI=setInterval(fb,150)}},1500)}   /* secours : l'autoplay refusé (même muet) : prête quand le clip est là, la pause sur l'affiche */
  {setTimeout(()=>{if(st==='title'&&!ready)ld.textContent='Chargement de la rue…'},2500);vIn.addEventListener('playing',()=>{if(ld.textContent==='Chargement de la rue…')ld.textContent=''});setTimeout(()=>{if(st==='title'){if(vIn.readyState>=2)go(true);else if(vIn.error||vIn.networkState===3)flat();else toStop()}},12000)}   /* 12 s sans rien : on force, ou l'arrêt */
  vIn.addEventListener('error',()=>{if(st==='title')flat()},{once:true});
  const H=location.hash,deep=!!new URLSearchParams(location.search).get('e')||H==='#choix'||(H.length>1&&H!=='#top'&&!!document.getElementById(H.slice(1)));
  if(deep)setTimeout(toStop,80);else{pin(true);if(scrollY>0)scrollTo({top:0,behavior:'instant'})}});   /* ?e=, #choix, une rubrique : droit à l'arrêt, page libre ; sinon la page est tenue en haut jusqu'à l'arrêt (v27.4) */
 poster.addEventListener('error',()=>{poster.style.visibility='hidden'});
 /* l'arrivée par un lien (« Voir la démo », « Passer l'intro ») */
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href="#choix"]');if(!a)return;e.preventDefault();toStop()});
 /* « Voir le site » (fin de l'entrée) : la suite, dessous */
 end.addEventListener('focusout',e=>{if(!end.contains(e.relatedTarget))end.classList.remove('kb')});
 end.addEventListener('focusin',()=>{end.classList.add('kb')});
 /* au clavier : entrer dans la carte (Tab) amène à l'arrêt */
 stop.addEventListener('focusin',()=>{if(LIVE&&!u.classList.contains('stop'))toStop()});
 t1.addEventListener('focusin',()=>{if(LIVE&&t1.classList.contains('off')&&st==='stop'){geo();e3glide(y0)}});
 /* ——— le clavier du téléphone : la carte se colle au-dessus du clavier, la scène se recadre sur l'enseigne ——— */
 nameIn.addEventListener('focus',()=>{kbY=scrollY});
 function rel(){if(document.activeElement===nameIn){kbY=-1;nameIn.blur()}}
 let kbH=0;
 nameIn.addEventListener('blur',()=>{const was=frz;frz=false;kbH=0;stop.style.setProperty('--kb','0px');flag(stop,'kbo',false);if(was&&LIVE&&kbY>=0&&Math.abs(scrollY-kbY)>4){const y=kbY;requestAnimationFrame(()=>e3glide(y,420))}kbY=-1;zoom()});
 const vv=window.visualViewport;if(vv){const k=()=>{const o=document.activeElement===nameIn?Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop)):0;kbH=o;stop.style.setProperty('--kb',o+'px');flag(stop,'kbo',o>40);if(COARSE&&document.activeElement===nameIn)frz=true;zoom()};vv.addEventListener('resize',k);vv.addEventListener('scroll',k)}
 let zm='';
 function zoom(){let t='';if(COARSE&&kbH>40&&signQ&&document.activeElement===nameIn){const sr=stg.getBoundingClientRect(),c=signQ.c,f=signQ.f,sx=f.ox+(c[0][0]+c[1][0])/2*f.w,sy=f.oy+(c[0][1]+c[3][1])/2*f.h,sw=Math.abs(c[1][0]-c[0][0])*f.w,S=Math.min(1.6,Math.max(1,.88*sr.width/(sw||1)));
   const top=Math.max(sr.top,(vv?vv.offsetTop:0))-sr.top,bot=(vv?vv.offsetTop+vv.height:innerHeight)-72-sr.top,ty=(top+bot)/2;t=`translate(${(sr.width/2-sx).toFixed(1)}px,${(ty-sy).toFixed(1)}px) scale(${S})`;scene.style.transformOrigin=sx.toFixed(1)+'px '+sy.toFixed(1)+'px'}
  if(t!==zm){zm=t;scene.style.transform=t;flag(u,'zoom',!!t)}}
 /* ——— le portail, à l'arrêt : un lancer s'arrête au mur (HZ) ; aux étapes sans choix, le premier glissé neuf est retenu (« Continuer vers le site ↓ »),
    le second lance l'entrée ; un nom tapé ou un métier choisi : le premier passe. Remonter n'est jamais bloqué. ——— */
 let nudged=false,nt=0,nt0=0,tY0=-1,tX0=0,swp=false;const nudge=()=>{nudged=true;u.classList.add('push');clearTimeout(nt);nt=setTimeout(()=>u.classList.remove('push'),2000)};
 const pass1=()=>{if(st!=='stop')return;if(chosen||shown||nudged)enter();else nudge()};
 let gate='closed',lastU=0,uWin=0,pP=-1,lastW=0,rt=0,wt=0,tY=-1,w0=0,wMax=0,pt=0,rested=false;
 const rest=()=>{const y=curY();if(gate==='closed'&&y>=-6&&y<=HZ+6&&!e3touch.n&&performance.now()-lastW>350)rested=true};
 if(LIVE){
  addEventListener('scroll',()=>{const y=curY();clearTimeout(rt);rt=setTimeout(rest,320);
   if(st==='in'&&y<HZ*.5)backToStop();
   if(y<HZ*.5)nudged=false;
   if(gate==='open'||st==='title'||st==='intro'){if(pinned&&(st==='title'||st==='intro')&&scrollY>0)scrollTo({top:0,behavior:'instant'});pP=y;return}
   const user=performance.now()-lastU<uWin;   /* le mur ne retient que les gestes (roulette, doigt, touches) : un lien vers une rubrique passe */
   if(gate==='door'||y>HZ+2&&user&&!e3gliding()){scrollTo({top:y0+HZ,behavior:'instant'});pP=HZ;if(gate==='closed'&&st==='stop'&&performance.now()-nt0>600&&u.classList.contains('stop')){nt0=performance.now();nudge()}
    if(COARSE){const h=document.documentElement;h.style.overflow='hidden';setTimeout(()=>{if(gate!=='door')h.style.overflow=''},160)}return}
   pP=y},{passive:true});
  addEventListener('wheel',e=>{const t=performance.now(),quiet=t-lastW>350;lastW=t;lastU=t;uWin=700;if(e.deltaY<=0)return;
   if(gate==='door'){e.preventDefault();return}
   if(rested&&quiet&&st==='stop'){rested=false;pass1();if(gate==='door')return}
   if(gate==='closed'&&curY()>=HZ-12){e.preventDefault();if(quiet||!w0){w0=t;wMax=0}wMax=Math.max(wMax,e.deltaY);u.classList.add('push');clearTimeout(pt);pt=setTimeout(()=>u.classList.remove('push'),2600);
    if(t-w0>1200&&e.deltaY>=Math.max(4,wMax*.6)){w0=0;pass1();return}}},{passive:false});
  {const mb=u.querySelector('.r-more');if(mb)mb.addEventListener('click',()=>{enter()})}
  addEventListener('touchstart',e=>{tY=e.touches[0]?e.touches[0].clientY:-1;tY0=tY;tX0=e.touches[0]?e.touches[0].clientX:0;swp=false},{passive:true,capture:true});
  addEventListener('touchmove',e=>{const y=e.touches[0]?e.touches[0].clientY:-1;const up=tY>=0&&y<tY;tY=y;lastU=performance.now();uWin=700;
   const x=e.touches[0]?e.touches[0].clientX:0;if(!swp&&tY0>=0&&tY0-y>10&&tY0-y>1.5*Math.abs(x-tX0)){swp=true;if(st==='stop'&&(rested||nudged)&&curY()>=-6){rested=false;pass1()}}
   if((gate==='door'||gate==='closed'&&up&&curY()>=HZ-4)&&e.cancelable)e.preventDefault()},{passive:false});
  addEventListener('touchend',()=>{clearTimeout(rt);rt=setTimeout(rest,320);lastU=performance.now();uWin=1600},{passive:true});   /* l'élan après le doigt levé reste un geste */
  addEventListener('keydown',e=>{if(/^(Page|Arrow|End|Home| )/.test(e.key)){lastU=performance.now();uWin=900}if(e.target===nameIn&&e.key!=='Tab')return;if(e.target.closest&&e.target.closest('.r-seg')&&/Arrow|Home|End/.test(e.key))return;if(st==='stop'&&(e.key==='PageDown'||e.key==='ArrowDown'||e.key===' '||e.key==='End')&&curY()>=-6){e.preventDefault();pass1()}},true);
  /* l'aimantation : arrêté dans la zone de l'arrêt, la page se repose en haut (la carte, l'enseigne) */
  let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!LIVE||!vis||frz||e3touch.n||gate!=='closed'||st!=='stop')return;const y=curY();if(y>2&&y<=HZ+6)e3glide(y0)},260)},{passive:true});
  {let yy=scrollY;addEventListener('scroll',()=>{const d=scrollY-yy;if(Math.abs(d)>2)dn=d>0?1:-1;yy=scrollY},{passive:true})}}
 /* à l'arrêt, au doigt : un tap qui bouge un peu (jusqu'à 14 px) reste un tap */
 {let t0=null;stop.addEventListener('touchstart',e=>{const el=e.target.closest('a,button,input');const q=e.touches[0];t0=el&&q&&e.touches.length===1&&!e.target.closest('.r-seg')?{el,x:q.clientX,y:q.clientY,t:performance.now(),m:0}:null},{passive:true});
  stop.addEventListener('touchmove',e=>{const q=e.touches[0];if(t0&&q)t0.m=Math.max(t0.m,Math.hypot(q.clientX-t0.x,q.clientY-t0.y))},{passive:true});
  stop.addEventListener('touchend',e=>{const k=t0;t0=null;if(!k)return;const q=e.changedTouches[0];if(!q)return;const m=Math.max(k.m,Math.hypot(q.clientX-k.x,q.clientY-k.y));
   if(m>14||performance.now()-k.t>800)return;const h=document.elementFromPoint(q.clientX,q.clientY);if(!h||!(k.el.contains(h)||h.contains(k.el)))return;
   if(e.cancelable)e.preventDefault();if(k.el.tagName==='INPUT')k.el.focus();else{if(k.el!==nameIn&&!k.el.closest('.r-f'))rel();k.el.click()}},{passive:false})}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(!vis&&st==='stop'&&vE&&!vE.paused)vE.pause()},{rootMargin:'50% 0px'}).observe(walk);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(st==='title'&&want)go(true)}});   /* l'onglet revient pendant le départ : on repart */
 addEventListener('resize',()=>{size()});addEventListener('pageshow',e=>{if(e.persisted)size()});
 window.__e3=()=>({st,met,set,gate,slow:SLOW,ready,want,primed,pinned,on:stop.classList.contains('on'),ent,entOk,vin:[vIn.readyState,+vIn.currentTime.toFixed(2),vIn.paused,vIn.ended],vg:[vG.readyState,+vG.currentTime.toFixed(2),vG.paused],ve:[vE.readyState,+vE.currentTime.toFixed(2),vE.paused,vE.ended],y:Math.round(curY()),held:u.classList.contains('held'),shown});   /* état, pour les tests */
 requestAnimationFrame(()=>{geo();u.classList.add('go')});
 {const w=u.querySelector('.r-wa');if(w)new IntersectionObserver(es=>{if(!LIVE)flag(document.body,'hero-cta',es[0].isIntersecting)},{rootMargin:'-64px 0px 0px 0px'}).observe(w)}
})();
