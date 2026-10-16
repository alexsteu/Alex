/* L'entrée 3D : l'ouverture de la page. On tape son nom, on choisit son métier et sa couleur ; le nom s'affiche sur
   l'enseigne de la boutique, puis au mur du fond. Faire défiler fait traverser la rue, ouvrir la porte et entrer,
   image par image ; puis le site du commerce monte dans le cadre. Les images sont calculées d'avance (entree3d/),
   avec, pour chaque image, la position des deux enseignes à l'écran (pins.json) : le nom y est posé en perspective.
   Mouvement réduit : la façade, immobile, avec le nom sur l'enseigne, et le site posé dessous. */
const E3={
 restaurant:{t:'restaurant',lab:'Restaurant',ex:'Le Petit Port',wall:5.8,sf:'serif',wf:'gilt',k3:'03 LA SALLE',hi:'La table est mise. Entrez.',c3:'Ce soir, une table vous attend.'},
 coiffure:{t:'coiffure',lab:'Coiffure',ex:'Atelier Sauge',wall:5.86,sf:'sans',ss:'letters',wf:'neon',k3:'03 LE SALON',hi:'Votre salon, avant même le rendez-vous.',c3:'Un fauteuil vous attend.'},
 institut:{t:'beaute',lab:'Institut',ex:'Maison Calme',wall:5.8,sf:'serif',ss:'letters',wf:'neon',k3:'03 LA CABINE',hi:'Le calme commence à la porte.',c3:'Prenez le temps.'},
 onglerie:{t:'ongles',lab:'Onglerie',ex:'Nacre',wall:5.45,sf:'sans',wf:'neon',k3:'03 LES COULEURS',hi:'Toutes les couleurs vous attendent.',c3:'Choisissez votre couleur.'},
 boulangerie:{t:'boulangerie',lab:'Boulangerie',ex:'La Fournée',wall:4.8,sf:'serif',wf:'paint',k3:'03 LE COMPTOIR',hi:'Le pain chaud, dès le trottoir.',c3:'Sorti du four ce matin.'},
 logement:{dir:'greves',lab:'Logement',ex:'Les Grèves',lodge:1,k3:'03 LA VUE',hi:'Un salon face aux Alpes.',c3:'Le lac, depuis le canapé.'}};
const E3K=Object.keys(E3),e3base=k=>'img/'+(E3[k].dir||'e3d/'+k)+'/';
/* L'enseigne posée sur quatre coins projetés (0–1 dans l'image) : un rectangle w × h, déformé par une homographie */
function e3quad(el,c,w,h,f){const X=c.map(q=>f.ox+q[0]*f.w),Y=c.map(q=>f.oy+q[1]*f.h);
 const dx1=X[1]-X[2],dx2=X[3]-X[2],dx3=X[0]-X[1]+X[2]-X[3],dy1=Y[1]-Y[2],dy2=Y[3]-Y[2],dy3=Y[0]-Y[1]+Y[2]-Y[3],den=dx1*dy2-dx2*dy1||1e-9;
 const g=(dx3*dy2-dx2*dy3)/den,k=(dx1*dy3-dx3*dy1)/den,a=X[1]-X[0]+g*X[1],b=X[3]-X[0]+k*X[3],d=Y[1]-Y[0]+g*Y[1],e=Y[3]-Y[0]+k*Y[3];
 el.style.transform=`matrix3d(${a/w},${d/w},0,${g/w},${b/h},${e/h},0,${k/h},0,0,1,0,${X[0]},${Y[0]},0,1)`}
/* Le texte tient dans sa place : la taille baisse pour les noms longs */
const e3meas=document.createElement('canvas').getContext('2d');
function e3fit(el,txt,font,max,w){e3meas.font=font.replace('{s}',max);const tw=e3meas.measureText(txt).width||1;el.style.fontSize=Math.min(max,max*w/tw).toFixed(1)+'px'}
function e3pins(box,s,name){const sg=box.querySelector('.e-sign>span'),wl=box.querySelector('.e-wall>span'),sans=s.sf==='sans';
 box.dataset.sf=s.sf||'';box.dataset.wf=s.wf||'';box.dataset.ss=s.ss||'';
 if(sg){sg.textContent=sans?name.toUpperCase():name;e3fit(sg,sg.textContent,sans?'600 {s}px "Instrument Sans"':'400 {s}px "Cormorant Garamond"',sans?54:80,sans?760:860)}
 const wh=1000/(s.wall||5.8),we=box.querySelector('.e-wall');we.style.height=wh.toFixed(1)+'px';we._h=+wh.toFixed(1);if(sg)sg.parentNode._h=0;
 wl.textContent=name;e3fit(wl,name,s.wf==='neon'?'italic 400 {s}px "Cormorant Garamond"':'400 {s}px "Cormorant Garamond"',Math.round(wh*.66),900)}
function e3place(box,pins,f){for(const el of box.children){const q=pins&&pins.find(x=>x.id===el.dataset.id);
 if(!q||q.vis<=0){if(el._o!==0){el._o=0;el.style.opacity=0}continue}e3quad(el,q.c,1000,el._h||(el._h=el.offsetHeight||111),f);if(el._o!==q.vis){el._o=q.vis;el.style.opacity=q.vis}}}   /* hauteur gardée (e3pins la remet) : aucune lecture de mise en page par image */

/* Les films (rue et démo). Les paquets (build.py, pack()) arrivent en base64 : fetch(data:) les décode hors du fil principal
   (atob en secours). Chaque image reste compressée (Blob) ; seules les images proches de celle affichée sont décodées
   (createImageBitmap, lui aussi hors du fil principal), les autres sont libérées (close) : la mémoire reste petite. */
function e3pack(url){return fetch(url).then(r=>{if(!r.ok)throw r.status;return r.text()})
 .then(t=>fetch('data:application/octet-stream;base64,'+t).then(r=>r.arrayBuffer()).catch(()=>{const b=atob(t),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer}))
 .then(buf=>{const v=new DataView(buf),hl=v.getUint32(0,true),head=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,hl)));
  return head.map(([i,o,l])=>[i,new Blob([new Uint8Array(buf,4+hl+o,l)],{type:'image/webp'})])})}
function e3film(n,R,at,onimg){const bl=new Array(n),bm=new Array(n),bz=new Uint8Array(n);let act=0,on=true;
 const free=i=>{const m=bm[i];bm[i]=null;if(!m)return;if(m.close)m.close();else URL.revokeObjectURL(m.src)};
 const asImg=b=>{const m=new Image();m.src=URL.createObjectURL(b);return m.decode().then(()=>m,()=>{URL.revokeObjectURL(m.src);return null})};
 const dec=i=>{bz[i]=1;act++;(window.createImageBitmap?createImageBitmap(bl[i]).catch(()=>asImg(bl[i])):asImg(bl[i])).catch(()=>null).then(m=>{act--;bz[i]=0;
  if(m){bm[i]=m;if(on&&Math.abs(i-at)<=R+6)onimg(i);else free(i)}pump()})};
 function pump(){if(!on)return;for(let i=0;i<n;i++)if(bm[i]&&Math.abs(i-at)>R+6)free(i);
  for(let d=0;d<=R&&act<4;d++)for(const i of d?[at+d,at-d]:[at])if(i>=0&&i<n&&bl[i]&&!bm[i]&&!bz[i]&&act<4)dec(i)}
 return{n,get:i=>bm[i],any:()=>bl.some(Boolean),add(i,b){bl[i]=b;pump()},
  seek(f){const i=clamp(Math.round(f),0,n-1);if(i!==at){at=i;pump()}},
  sleep(){on=false;for(let i=0;i<n;i++)free(i)},wake(){if(!on){on=true;pump()}},
  /* ce qu'on dessine pour la position f : les deux voisines fondues si elles sont décodées et à deux images au plus l'une de l'autre ;
     sinon l'image décodée la plus proche, seule (jamais deux images éloignées superposées) */
  pair(f){f=clamp(f,0,n-1);const a=Math.floor(f),b=Math.ceil(f),lo=bm[a]?a:a>0&&bm[a-1]?a-1:-1,hi=bm[b]?b:b<n-1&&bm[b+1]?b+1:-1;
   if(lo>=0&&hi>=0&&hi-lo<=2)return[lo,hi,hi>lo?(f-lo)/(hi-lo):0];
   for(let d=0;d<n;d++){const x=Math.round(f)-d,y=Math.round(f)+d;if(x>=0&&bm[x])return[x,x,0];if(y<n&&bm[y])return[y,y,0]}return null}}}
/* Une aimantation douce : la page glisse jusqu'à y ; tout geste (molette, doigt, clavier, clic) l'arrête aussitôt.
   Jamais pendant qu'un doigt est posé ; jamais en mouvement réduit (les appelants vérifient RM). */
const e3touch={n:0};for(const ev of ['touchstart','touchend','touchcancel'])addEventListener(ev,e=>{e3touch.n=e.touches?e.touches.length:0},{passive:true,capture:true});
let e3gl=0,e3own=-1;const e3halt=()=>{if(e3gl){cancelAnimationFrame(e3gl);e3gl=0}};
for(const ev of ['wheel','touchstart','keydown','pointerdown'])addEventListener(ev,e3halt,{passive:true,capture:true});
function e3glide(y,ms){e3halt();const y0=scrollY,d=y-y0;if(Math.abs(d)<2)return;let t0=0;ms=ms||Math.min(900,380+Math.abs(d)*.6);
 const st=now=>{if(t0&&e3own>=0&&Math.abs(scrollY-e3own)>3){e3gl=0;e3own=-1;return}   /* un autre défilement (lien, touche Début, script) a pris la main : on s'efface */
  if(!t0)t0=now;const t=Math.min(1,(now-t0)/ms),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;e3own=Math.round(y0+d*e);scrollTo({top:e3own,behavior:'instant'});e3gl=t<1?requestAnimationFrame(st):0};e3gl=requestAnimationFrame(st)}
/* vrai pendant le glissement, et pour le défilement qu'il a lui-même causé (même arrêté) : l'aimantation ne se relance jamais d'elle-même */
const e3gliding=()=>{if(e3gl)return true;if(e3own>=0&&Math.abs(scrollY-e3own)<1.5)return true;e3own=-1;return false};
/* les enseignes entre deux images fondues : leurs coins interpolés de même */
const e3mix=(A,B,a)=>A&&B&&a>0?A.map(q=>{const r=B.find(x=>x.id===q.id)||q;return{id:q.id,vis:q.vis+(r.vis-q.vis)*a,c:q.c.map((c,k)=>[c[0]+(r.c[k][0]-c[0])*a,c[1]+(r.c[k][1]-c[1])*a])}}):A;

/* La démo est sous la rue : elle démarre après l'affichage (temps libre), à son approche, ou dès qu'on la demande (e3boot). */
let e3booted=false;function e3boot(){if(e3booted)return;e3booted=true;e3main()}
function e3main(){if(!$('eWalk'))return;const walk=$('eWalk'),stg=$('eStage'),view=$('eView'),scene=view.querySelector('.w-scene'),cv=$('eCv'),cx=cv.getContext('2d'),site=$('eSite'),bar=$('eBar'),fill=$('eFill'),toast=$('eToast'),pins=$('ePins');
 const chs=[...view.querySelectorAll('.w-ch')],c1=view.querySelector('.c1'),cap=document.querySelector('#entree .w-cap'),c3=view.querySelector('.c3'),ks=[...view.querySelectorAll('[data-k]')],poster=$('ePoster'),LIVE=!RM;
 const st={sc:'restaurant',name:'',style:0,touched:false,styleSet:false,ex:''};
 let hh=64,D=1,P=0,cur=0,raf=0,last=-1,vis=false,dirty=true,drawn='',W=0,H=0,armed=false,set='d',t0=0,jump=false,BAND=150,VH=1,built='';
 const memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}},flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 const sty=()=>{const s=E3[st.sc];return s.lodge?['#141826','#fff','nuit']:T[s.t].styles[st.style]};
 /* Le message WhatsApp : ce que la personne a tapé et choisi, rien d'autre */
 function msg(){const s=E3[st.sc],t=s.lodge?null:T[s.t];if(!st.touched)return MSG.imm();
  const what=s.lodge?'logement':t.noun,col=st.styleSet&&t?', couleur '+sty()[2]:'';
  return `${SRC?HELLO+' J’ai':'Bonjour, j’ai'} essayé l’entrée 3D sur votre site. J’aimerais recevoir une première image 3D et le prix pour ${st.name?'mon commerce':'mon '+what}.\n${st.name?st.name+', '+what+col+'.\n':''}Ma commune : `}
 function paint(){const s=E3[st.sc],[c,ct,cn]=sty(),name=st.name||st.ex||'Votre commerce',t=s.lodge?null:T[s.t];
  view.style.setProperty('--c',c);view.style.setProperty('--ct',ct);
  pins.hidden=!!s.lodge;if(!s.lodge)e3pins(pins,s,name);
  $('eLogo').firstChild.textContent=name+' ';$('eUrl').textContent=slug(st.name||st.ex)+'.ch · Démo';
  $('eC2h').textContent=name+'.';$('eC2p').textContent=s.hi;
  $('eC3eb').textContent=(s.lodge?'Logement':t.label)+' · Démo';$('eC3h').textContent=s.c3;$('eK3').textContent=s.k3;
  const cta=s.lodge?'Réserver un séjour':t.cta;$('eB1').textContent=cta;$('eBook').textContent=/rendez-vous/.test(cta)?'Rendez-vous':cta.split(' ')[0];
  $('eB2').textContent=s.lodge?'Voir les dates':'Voir '+({'Menu du jour':'le menu du jour','Nos produits':'nos produits'}[t.sec]||'les '+t.sec.toLowerCase());
  if($('eNav').dataset.k!==st.sc)$('eNav').dataset.k=st.sc,$('eNav').innerHTML=s.lodge?'<button type="button" data-go="1">Le logement</button><button type="button" data-go="1">Dates</button>':`<button type="button" data-go="1">${esc(t.sec)}</button><button type="button" data-go="1">Horaires</button><button type="button" data-go="1">Contact</button>`;
  /* le site qui monte : les prix, les horaires et le bouton du commerce, dans sa couleur */
  const key=st.sc+'|'+set+'|'+armed;
  if(built!==key){built=key;if(s.lodge)site.innerHTML=$('eLodge').innerHTML;
  else site.innerHTML=`<div class="w-top"><div><p class="w-eb">${esc(t.label)} · Démo</p><p class="w-t" id="eSiteT"></p><p class="e-sub">${esc(t.h.replace(/ (à|de) \{t\}/,''))} ${esc(t.sub)}</p>
   <div class="e-more"><div><p class="w-k">HORAIRES</p><p>${t.hours}</p></div><div><p class="w-k">AVIS GOOGLE · ITINÉRAIRE</p><p>${esc(t.about)}</p></div></div></div>
   <div class="w-card"><p class="w-k">${esc(t.sec.toUpperCase())} (DÉMO)</p>${t.rows.slice(0,3).map(([a,b])=>`<p class="e-row"><span>${esc(a)}</span><b>${esc(b)}</b></p>`).join('')}<button type="button" class="w-go" data-book>${esc(cta)}</button><p class="w-n">${esc(t.open)}</p></div></div>
   <div class="e-ph">${(armed?(set==='m'?[52,61,71]:[70,82,95]):[]).map(i=>`<img src="${e3base(st.sc)}${set}/f0${i}.webp" width="${set==='m'?540:1280}" height="${set==='m'?960:800}" alt="" loading="lazy" decoding="async">`).join('')}</div>`}
  const stt=$('eSiteT');if(stt)stt.textContent=name;
  $('eToastT').textContent=s.lodge?'Ici, vos clients réservent.':t.cta==='Commander'?'Ici, vos clients commandent.':/table/.test(t.cta)?'Ici, vos clients réservent leur table.':'Ici, vos clients prennent rendez-vous.';
  /* les boutons « Recevoir mon aperçu 3D » de la page suivent l'essai */
  const href=wa(msg());$('eWa').href=href;document.querySelectorAll('a[data-wa="e3"]').forEach(a=>a.href=href);
  const lab=st.name?'Aperçu 3D pour '+(st.name.length>18?st.name.slice(0,17)+'…':st.name):'Recevoir mon aperçu 3D';document.querySelectorAll('[data-e3l]').forEach(n=>n.textContent=lab);
  [...$('eAct').children].forEach(b=>{const on=b.dataset.v===st.sc;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});if($('eSel'))$('eSel').value=st.sc;
  const bs=$('eStyle');bs.parentNode.hidden=!!s.lodge;
  if(!s.lodge){if(bs.dataset.t!==st.sc){bs.dataset.t=st.sc;bs.innerHTML=T[s.t].styles.map(([c,,n],i)=>`<button type="button" role="radio" aria-label="${esc(n)}" style="--g:${c}" data-i="${i}"></button>`).join('')}
   [...bs.children].forEach((b,i)=>{b.setAttribute('aria-checked',i===st.style);b.tabIndex=i===st.style?0:-1});$('eStyleN').textContent=cn}
  if(st.touched)try{localStorage.setItem('oonde-e3',JSON.stringify({sc:st.sc,name:st.name,style:st.style,s:st.styleSet}))}catch(e){}
  document.dispatchEvent(new CustomEvent('oonde-e3',{detail:{name:st.name,t:s.t||'',sc:st.sc}}));
  dirty=true;tick()}
 /* Les choix */
 $('eAct').innerHTML=E3K.map(k=>`<button type="button" role="radio" data-v="${k}" aria-checked="false">${E3[k].lab}</button>`).join('');
 if($('eSel')){$('eSel').innerHTML=E3K.map(k=>`<option value="${k}">${E3[k].lab}</option>`).join('');$('eSel').addEventListener('change',e=>choose(e.target.value))}
 /* Changer de métier : l'affiche du nouveau métier tout de suite (ou sa photo de repli), puis son film.
    Corrigé (v17) : choisir le métier déjà affiché avant l'approche de l'entrée laissait l'affiche sans image. */
 const choose=(k,ex)=>{if(!E3[k])return;st.touched=true;st.ex=ex?E3[k].ex:'';const ch=st.sc!==k;
  if(ch){sleepAll();st.sc=k;st.style=0;st.styleSet=false;drawn='';view.classList.remove('live')}
  if(!armed||ch){armed=true;show(k)}paint();load(set)};
 $('eAct').addEventListener('click',e=>{const b=e.target.closest('button');if(b)choose(b.dataset.v)});
 $('eAct').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const i=E3K.indexOf(st.sc),n=E3K[(i+(e.key==='ArrowRight'?1:E3K.length-1))%E3K.length];choose(n);$('eAct').querySelector(`[data-v="${n}"]`).focus()});
 $('eStyle').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;st.touched=st.styleSet=true;st.style=+b.dataset.i;paint()});
 $('eStyle').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();st.touched=st.styleSet=true;st.style=(st.style+(e.key==='ArrowRight'?1:2))%3;paint();$('eStyle').children[st.style].focus()});
 $('eName').addEventListener('input',e=>{st.touched=true;st.name=e.target.value.trim().slice(0,40);paint()});
 $('eName').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur()});
 /* « Voir cette entrée » sur un exemple : la même entrée, avec le nom de l'exemple tant qu'on n'a pas tapé le sien */
 document.querySelectorAll('[data-e3]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();fromStreet=false;choose(a.dataset.e3,true);jump=true;goTo(0)}));   /* « Voir une démo » saute la rue : là, on montre la façade */
 window.e3go=(k,ex=true)=>{choose(k,ex);jump=true;goTo(E3[k].lodge?.40:.22)};
 /* choisi dans la rue : le métier est retenu (et ses images préparées si l'entrée est proche), sans quitter la rue */
 window.e3pick=k=>{if(!E3[k]||k===st.sc)return;sleepAll();st.touched=true;st.sc=k;st.style=0;st.styleSet=false;drawn='';view.classList.remove('live');if(armed){show(k);load(set)}paint()};   /* la page des exemples, arrivée avec ?e= : on entre directement */
 /* Un lien préparé (?e=restaurant&n=Chez%20Marco&c=1) remplit l'essai ; sinon, la dernière visite */
 {const q=new URLSearchParams(location.search);let m={};
  if(q.get('e'))m={sc:q.get('e'),name:q.get('n')||'',style:+q.get('c')||0,s:q.has('c')};else try{m=JSON.parse(localStorage.getItem('oonde-e3')||'{}')}catch(e){}
  if(E3[m.sc]){st.sc=m.sc;st.touched=true}if(typeof m.name==='string'&&m.name){st.name=m.name.slice(0,40);$('eName').value=st.name;st.touched=true}
  if(Number.isInteger(m.style))st.style=clamp(m.style,0,2),st.styleSet=!!m.s}
 {const v=$('eName').value.trim();if(!st.name&&v){st.name=v.slice(0,40);st.touched=true}}   /* nom tapé dans la rue avant le démarrage de la démo */
 /* « Réserver », le menu, le logo : le faux site réagit comme un vrai */
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight)};
 const goTo=p=>{if(!LIVE){(p>=.8?site:walk).scrollIntoView({block:'start'});return}geo();scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+p*D})};
 const open=o=>{toast.hidden=!o;if(o)$('eWa').focus({preventScroll:true})};
 view.addEventListener('click',e=>{const g=e.target.closest('[data-go]'),b=e.target.closest('[data-book]');
  if(g){open(false);goTo(+g.dataset.go)}else if(b)open(true);else if(e.target.closest('#eX'))open(false)});
 view.addEventListener('keydown',e=>{if(e.key==='Escape'&&!toast.hidden){open(false);$('eBook').focus()}});
 /* 1. Images et enseignes : jeu « ordinateur » (16:10, 96 images) ou « téléphone » (portrait, 72) ; mouvement réduit : la première seule */
 const SETS={d:96,m:72},store={};
 const sleepAll=()=>{for(const k in store)store[k].film.sleep()};
 /* les images arrivent en 4 paquets (build.py, pack()) : la première, la dernière et une sur 8 d'abord, puis le reste entre deux */
 /* l'affiche : la première image du film ; si elle manque, l'autre format ; sinon une photo fixe du métier, et la page continue */
 const FB={restaurant:'img/t-restaurant.jpg',coiffure:'img/t-coiffure.jpg',institut:'img/t-beaute.jpg',onglerie:'img/t-ongles.jpg',boulangerie:'img/t-boulangerie.jpg',logement:'img/greves/salon-l.jpg'};
 const ld=$('eLoad');let slow=0;
 function busy(on){clearTimeout(slow);if(on)slow=setTimeout(()=>{if(!view.classList.contains('live'))ld.textContent='Chargement de la démo…'},700);else ld.textContent=''}
 function show(k){view.classList.remove('fallback');poster.style.visibility='';poster.dataset.k=k;poster.dataset.try='0';poster.src=e3base(k)+set+'/f000.webp';busy(true)}
 poster.addEventListener('error',()=>{const k=poster.dataset.k||st.sc,t=+poster.dataset.try||0;poster.dataset.try=t+1;
  if(t===0)poster.src=e3base(k)+(set==='d'?'m':'d')+'/f000.webp';else if(t===1){poster.src=FB[k];view.classList.add('fallback')}else poster.style.visibility='hidden'});
 poster.addEventListener('load',()=>{if(view.classList.contains('live'))return;busy(false);if(view.classList.contains('fallback'))ld.textContent='Photo d’exemple : la démo animée n’a pas pu se charger.'});
 function load(k){const key=st.sc+k;if(!armed)return;if(store[key]){store[key].film.wake();return}const sc=st.sc,n=SETS[k],s=store[key]={film:e3film(n,LIVE?24:0,Math.round(cur*(n-1)),()=>{if(sc===st.sc&&k===set){dirty=true;tick()}}),pins:null};
  if(!E3[sc].lodge)fetch(e3base(sc)+k+'/pins.json').then(r=>r.json()).then(j=>{s.pins=j;if(sc===st.sc)dirty=true;tick()}).catch(()=>{});
  const get=g=>e3pack(e3base(sc)+k+'/p'+g+'.txt').then(l=>l.forEach(([i,b])=>{if(LIVE||i===0)s.film.add(i,b)}));
  get(0).then(()=>LIVE&&Promise.all([get(1),get(2)]).then(()=>get(3)))
   .catch(()=>{if(s.film.any())return;if(sc===st.sc&&k===set&&!store[sc+(k==='d'?'m':'d')])load(k==='d'?'m':'d');   /* jeu absent : l'autre jeu, recadré */
    else if(sc===st.sc){busy(false);view.classList.add('nofilm')}})}   /* les deux absents : l'affiche (ou la photo de repli) reste, le site de la démo et les boutons aussi */
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*d),h=Math.round(r.height*d);if(w!==W||h!==H){W=cv.width=w;H=cv.height=h}SWd=r.width||1;
  const k=r.width<r.height*.95?'m':'d';if(k!==set){const o=store[st.sc+set];if(o)o.film.sleep();set=k}load(set);geo();BAND=parseFloat(getComputedStyle(site).top)||150;VH=view.clientHeight;dirty=true}
 let SWd=1;
 /* 2. Rythme : la part du défilement figé (P) donne la position de la caméra (p) ; la porte est passée à p = .56 */
 const KS={e:[[0,0],[.03,0],[.3,.56],[.55,.86],[.66,1],[1,1]],g:[[0,0],[.03,0],[.25,.53],[.55,.85],[.66,1],[1,1]]};
 /* arrivé par la rue (on vient de passer sa porte) : la démo commence à sa porte, sans seconde façade vue de dehors */
 const KD={e:[[0,.41],[.03,.41],[.3,.56],[.55,.86],[.66,1],[1,1]],g:[[0,.47],[.03,.47],[.25,.53],[.55,.85],[.66,1],[1,1]]};
 let fromStreet=!!$('univers');const u0=$('univers');if(u0)new IntersectionObserver(es=>{if(es[0].isIntersecting)fromStreet=true},{threshold:.05}).observe(u0);
 const K=()=>(fromStreet?KD:KS)[E3[st.sc].lodge?'g':'e'],door=()=>E3[st.sc].lodge?.47:.38;
 const camOf=P=>{const k=K();for(let j=1;j<k.length;j++)if(P<=k[j][0]){const[a,pa]=k[j-1],[b,pb]=k[j],t=(P-a)/(b-a||1);return pa+(pb-pa)*(j===4?1-(1-t)*(1-t):t)}return 1};
 const ease=t=>1-Math.pow(1-t,3);
 /* 3. Dessin : l'image la plus proche déjà chargée, puis les deux enseignes posées dessus en perspective */
 function draw(p){if(!W||!H)return;let k=set,s=store[st.sc+k],r=null;
  if(s){s.film.seek(p*(SETS[k]-1));r=s.film.pair(p*(SETS[k]-1))}
  if(!r){k=set==='d'?'m':'d';s=store[st.sc+k];if(s)r=s.film.pair(p*(SETS[k]-1))}
  if(!r)return;const[i0,i1,a]=r,key=k+i0+','+i1+','+a.toFixed(3);if(key===drawn&&!dirty)return;
  const im=s.film.get(i0),sc=Math.max(W/im.width,H/im.height),w=im.width*sc,h=im.height*sc,ox=(W-w)/2,oy=(H-h)/2;
  cx.globalAlpha=1;cx.drawImage(im,ox,oy,w,h);if(a>.01&&i1!==i0){cx.globalAlpha=a;cx.drawImage(s.film.get(i1),ox,oy,w,h);cx.globalAlpha=1}
  drawn=key;dirty=false;flag(view,'live',true);if(view.classList.contains('nofilm')||view.classList.contains('fallback'))view.classList.remove('nofilm','fallback');busy(false);
  const d=W/SWd;if(!E3[st.sc].lodge&&s.pins){const A=s.pins[i0],B=s.pins[i1];e3place(pins,A?e3mix(A.pins,B&&B.pins,a):null,{ox:ox/d,oy:oy/d,w:w/d,h:h/d})}}
 /* 4. Textes, barre de progression, et le site qui monte */
 function ui(p){const lodge=E3[st.sc].lodge,c2in=lodge?.3:.12,c2out=lodge?.5:.3,c3in=lodge?.57:.5;
  for(const c of chs){const i=c.classList.contains('c2')?c2in:c===c3?c3in:-1,o=c.classList.contains('c2')?c2out:c===c3?9:.07;
   const a=i<0?clamp((o-P)/.05,0,1):Math.min(clamp((P-i)/.04,0,1),clamp((o-P)/.04,0,1));
   const s=c===c3?ease(clamp((P-.68)/.22,0,1)):0;put(c,'opacity',Math.max(0,a*(1-s*2.6)).toFixed(3));put(c,'transform',`translateY(${((1-a)*14-s*260).toFixed(1)}px)`);
   const on=a>.5&&s<.5,ine=!on&&!c.contains(document.activeElement);flag(c,'on',on);if(c.inert!==ine)c.inert=ine;if(c===c1&&cap)flag(cap,'chips',on)}
  const s=ease(clamp((P-.68)/.27,0,1)),mob=W<H;put(site,'transform',`translateY(${((1-s)*110).toFixed(2)}%)`);{const i=s<.5&&!site.contains(document.activeElement);if(site.inert!==i)site.inert=i}
  const y=`translateY(${(-s*Math.max(0,VH*(mob?.5:.56)-BAND*.6)).toFixed(1)}px)`;put(cv,'transform',y);put(poster,'transform',y);put(pins,'transform',y);
  flag(bar,'solid',s>.82);put(prog,'opacity',(1-Math.min(1,s*2.5)).toFixed(3));
  put(fill,'width',(p*100).toFixed(2)+'%');const k=p<door()-.005?1:p<.85?2:3;ks.forEach(x=>flag(x,'on',+x.dataset.k===k))}
 const prog=view.querySelector('.w-prog');
 /* 5. Boucle : la position affichée rattrape la cible en ~80 ms ; rien ne tourne quand l'entrée est loin */
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 function loop(now){raf=0;if(!LIVE){draw(0);return}const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  flag(document.body,'walking',r.top<=hh+1&&r.bottom>=innerHeight-1&&P>.02);
  const t=camOf(P);if(jump){cur=t;cq=-1;jump=false}cur+=(t-cur)*(1-Math.exp(-dt/.09));if(Math.abs(t-cur)<.0005)cur=t;
  const n1=SETS[set]-1,tq=cur===t?Math.round(cur*n1)/n1:cur;if(cq<0)cq=tq;cq+=(tq-cq)*(1-Math.exp(-dt/.07));if(Math.abs(tq-cq)<.002/n1)cq=tq;
  if(dirty||cq!==last){draw(cq);last=cq}ui(cur);if(cur!==t||cq!==tq)tick();else t0=0}
 let cq=-1;
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(!vis)open(false);const s=store[st.sc+set];if(s){if(vis)s.film.wake();else s.film.sleep()}tick()},{rootMargin:'50% 0px'}).observe(walk);
 /* l'entrée est sous la rue : on ne charge ses images qu'à son approche, ou au choix d'un métier */
 const arm=()=>{if(armed)return;armed=true;show(st.sc);load(set);paint()};new IntersectionObserver(es=>{if(es[0].isIntersecting)arm()},{rootMargin:'60% 0px'}).observe(walk);
 size();paint();
 addEventListener('resize',()=>{size();tick()});
 if(document.fonts)document.fonts.ready.then(paint);
 if(!LIVE){if(cap)cap.classList.add('chips');return}
 addEventListener('scroll',()=>{if(vis)tick()},{passive:true});
 /* 6. Arrêt entre deux moments : l'entrée se pose doucement sur le plus proche (la rue, la porte, la salle, le site) */
 let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!vis||P<=0||P>=1||e3touch.n)return;const ST=E3[st.sc].lodge?[0,.40,.66,1]:[0,.22,.6,1],n=ST.reduce((a,b)=>Math.abs(b-P)<Math.abs(a-P)?b:a);
  if(Math.abs(n-P)>.015&&Math.abs(n-P)<.12)e3glide(walk.getBoundingClientRect().top+scrollY-hh+n*D)},260)},{passive:true});
 /* au clavier : ce qui reçoit le focus dans la démo est montré (on va au moment qui l'affiche), jamais caché sous le focus */
 const seen=el=>{const r=el.getBoundingClientRect();return r.top>=hh-1&&r.bottom<=innerHeight+1&&r.height>0};
 stg.addEventListener('focusin',e=>{const c=e.target.closest('.w-ch,.w-site');let want,a,b;
  if(!c){want=clamp(P,0,1);a=0;b=1}   /* la barre du site, la fiche « Réserver » : visibles à tout moment, il suffit que la démo soit à l'écran */
  else{want=c===site?1:c.classList.contains('c2')?.2:c===c3?.6:0;a=c===site?.75:c.classList.contains('c2')?.12:c===c3?.5:0;b=c===site?1:c.classList.contains('c2')?.3:c===c3?.67:.06}
  if(P<a||P>b||!seen(e.target)){geo();scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+want*D,behavior:'instant'})}
  /* le navigateur fait ensuite défiler vers l'élément, mal calculé sous une scène collante : on le retient là où on l'a posé */
  const y0=scrollY,t=e.target;let k=0;const hold=()=>{if(document.activeElement!==t)return;if(Math.abs(scrollY-y0)>2)scrollTo({top:y0,behavior:'instant'});if(++k<12)requestAnimationFrame(hold)};requestAnimationFrame(hold)});
 ui(0);tick();
}
{const go=()=>e3boot();
 if(document.readyState==='complete')(window.requestIdleCallback||setTimeout)(go,{timeout:1200});else addEventListener('load',()=>(window.requestIdleCallback||setTimeout)(go,{timeout:1200}),{once:true});
 const w=$('eWalk');if(w)new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();go()}},{rootMargin:'150% 0px'}).observe(w);
 /* un bouton qui ouvre la démo avant qu'elle ait démarré : on la démarre d'abord, le clic suit son cours */
 document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-e3],#entree,.r-enter'))go()},true);
 document.addEventListener('focusin',e=>{if(e.target.closest&&e.target.closest('#entree'))go()},true)}

/* Les exemples : la dernière image de chaque entrée, avec le nom de l'exemple au mur du fond, ou celui que le visiteur a tapé */
(()=>{const cache={},done=new Map();let nm=($('eName')||{}).value||'';
 const show=(card,k)=>{const s=E3[k],box=card.querySelector('.e-pins'),img=card.querySelector('img');
  const go=()=>{const r=img.getBoundingClientRect();if(!r.width||!cache[k])return;const fr=cache[k][cache[k].length-1];
   card.style.setProperty('--c',T[s.t].styles[0][0]);card.style.setProperty('--ct',T[s.t].styles[0][1]);e3pins(box,s,nm||s.ex);
   box.style.transform=`scale(${r.width/1000})`;e3place(box,fr.pins,{ox:0,oy:0,w:1000,h:1000*r.height/r.width})};
  done.set(card,go);if(img.complete)go();else img.addEventListener('load',go);new ResizeObserver(go).observe(img)};
 document.addEventListener('oonde-e3',e=>{if(e.detail.name===nm)return;nm=e.detail.name;done.forEach(go=>go())});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const card=e.target,k=card.dataset.k;
  (cache[k]?Promise.resolve():fetch(e3base(k)+'d/pins.json').then(r=>r.json()).then(j=>{cache[k]=j})).then(()=>show(card,k)).catch(()=>{})}),{rootMargin:'300px'});
 document.querySelectorAll('.ex[data-k]').forEach(c=>{if(c.querySelector('.e-pins'))io.observe(c)})})();
