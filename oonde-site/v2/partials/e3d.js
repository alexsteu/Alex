/* L'entrée 3D : l'ouverture de la page. On tape son nom, on choisit son métier et sa couleur ; le nom s'affiche sur
   l'enseigne de la boutique, puis au mur du fond. Faire défiler fait traverser la rue, ouvrir la porte et entrer,
   image par image ; puis le site du commerce monte dans le cadre. Les images sont calculées d'avance (entree3d/),
   avec, pour chaque image, la position des deux enseignes à l'écran (pins.json) : le nom y est posé en perspective.
   Mouvement réduit : la façade, immobile, avec le nom sur l'enseigne, et le site posé dessous. */
const E3={
 restaurant:{t:'restaurant',lab:'Restaurant',ex:'Le Petit Port',wall:5.8,sf:'serif',wf:'paint',k3:'03 LA SALLE',hi:'La table est mise. Entrez.',c3:'Ce soir, une table vous attend.'},
 coiffure:{t:'coiffure',lab:'Coiffure',ex:'Atelier Sauge',wall:5.86,sf:'sans',wf:'neon',k3:'03 LE SALON',hi:'Votre salon, avant même le rendez-vous.',c3:'Un fauteuil vous attend.'},
 institut:{t:'beaute',lab:'Institut',ex:'Maison Calme',wall:5.8,sf:'serif',wf:'neon',k3:'03 LA CABINE',hi:'Le calme commence à la porte.',c3:'Prenez le temps.'},
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
 box.dataset.sf=s.sf||'';box.dataset.wf=s.wf||'';
 if(sg){sg.textContent=sans?name.toUpperCase():name;e3fit(sg,sg.textContent,sans?'600 {s}px "Instrument Sans"':'400 {s}px "Cormorant Garamond"',sans?54:80,sans?760:860)}
 const wh=1000/(s.wall||5.8);box.querySelector('.e-wall').style.height=wh.toFixed(1)+'px';
 wl.textContent=name;e3fit(wl,name,s.wf==='neon'?'italic 400 {s}px "Cormorant Garamond"':'400 {s}px "Cormorant Garamond"',Math.round(wh*.66),900)}
function e3place(box,pins,f){for(const el of box.children){const q=pins&&pins.find(x=>x.id===el.dataset.id);
 if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,el.offsetHeight||111,f);el.style.opacity=q.vis}}

(()=>{const walk=$('eWalk'),stg=$('eStage'),view=$('eView'),scene=view.querySelector('.w-scene'),cv=$('eCv'),cx=cv.getContext('2d'),site=$('eSite'),bar=$('eBar'),fill=$('eFill'),toast=$('eToast'),pins=$('ePins');
 const chs=[...view.querySelectorAll('.w-ch')],c3=view.querySelector('.c3'),ks=[...view.querySelectorAll('[data-k]')],poster=$('ePoster'),LIVE=!RM;
 const st={sc:'restaurant',name:'',style:0,touched:false,styleSet:false,ex:''};
 let hh=64,D=1,P=0,cur=0,raf=0,last=-1,vis=false,dirty=true,drawn=null,W=0,H=0,armed=false,set='d';
 const sty=()=>{const s=E3[st.sc];return s.lodge?['#141826','#fff','nuit']:T[s.t].styles[st.style]};
 /* Le message WhatsApp : ce que la personne a tapé et choisi, rien d'autre */
 function msg(){const s=E3[st.sc],t=s.lodge?null:T[s.t];if(!st.touched)return MSG.imm();
  const what=s.lodge?'logement':t.noun,col=st.styleSet&&t?', couleur '+sty()[2]:'';
  return `${SRC?HELLO+' J’ai':'Bonjour, j’ai'} essayé l’entrée 3D sur votre site. J’aimerais connaître le prix pour ${st.name?'mon commerce':'mon '+what}.\n${st.name?st.name+', '+what+col+'.\n':''}Ma commune : `}
 function paint(){const s=E3[st.sc],[c,ct,cn]=sty(),name=st.name||st.ex||'Votre commerce',t=s.lodge?null:T[s.t];
  view.style.setProperty('--c',c);view.style.setProperty('--ct',ct);
  pins.hidden=!!s.lodge;if(!s.lodge)e3pins(pins,s,name);
  $('eLogo').firstChild.textContent=name+' ';$('eUrl').textContent=slug(st.name||st.ex)+'.ch · Démo';
  $('eC2h').textContent=name+'.';$('eC2p').textContent=s.hi;
  $('eC3eb').textContent=(s.lodge?'Logement':t.label)+' · Démo';$('eC3h').textContent=s.c3;$('eK3').textContent=s.k3;
  const cta=s.lodge?'Réserver un séjour':t.cta;$('eB1').textContent=cta;$('eBook').textContent=/rendez-vous/.test(cta)?'Rendez-vous':cta.split(' ')[0];
  $('eB2').textContent=s.lodge?'Voir les dates':'Voir '+({'Menu du jour':'le menu du jour','Nos produits':'nos produits'}[t.sec]||'les '+t.sec.toLowerCase());
  $('eNav').innerHTML=s.lodge?'<button type="button" data-go="1">Le logement</button><button type="button" data-go="1">Dates</button>':`<button type="button" data-go="1">${esc(t.sec)}</button><button type="button" data-go="1">Horaires</button><button type="button" data-go="1">Contact</button>`;
  /* le site qui monte : les prix, les horaires et le bouton du commerce, dans sa couleur */
  if(s.lodge)site.innerHTML=$('eLodge').innerHTML;
  else site.innerHTML=`<div class="w-top"><div><p class="w-eb">${esc(t.label)} · Démo</p><p class="w-t">${esc(name)}</p><p class="e-sub">${esc(t.h.replace(/ (à|de) \{t\}/,''))} ${esc(t.sub)}</p>
   <div class="e-more"><div><p class="w-k">HORAIRES</p><p>${t.hours}</p></div><div><p class="w-k">AVIS GOOGLE · ITINÉRAIRE</p><p>${esc(t.about)}</p></div></div></div>
   <div class="w-card"><p class="w-k">${esc(t.sec.toUpperCase())} (DÉMO)</p>${t.rows.slice(0,3).map(([a,b])=>`<p class="e-row"><span>${esc(a)}</span><b>${esc(b)}</b></p>`).join('')}<button type="button" class="w-go" data-book>${esc(cta)}</button><p class="w-n">${esc(t.open)}</p></div></div>
   <div class="e-ph">${[70,82,95].map(i=>`<img src="${e3base(st.sc)}d/f0${i}.webp" width="1280" height="800" alt="" loading="lazy" decoding="async">`).join('')}</div>`;
  $('eToastT').textContent=s.lodge?'Ici, vos clients réservent.':t.cta==='Commander'?'Ici, vos clients commandent.':/table/.test(t.cta)?'Ici, vos clients réservent leur table.':'Ici, vos clients prennent rendez-vous.';
  /* les boutons « Connaître mon prix » de la page suivent l'essai */
  const href=wa(msg());$('eWa').href=href;document.querySelectorAll('a[data-wa="e3"]').forEach(a=>a.href=href);
  const lab=st.name?'Mon prix pour '+(st.name.length>18?st.name.slice(0,17)+'…':st.name):'Connaître mon prix';document.querySelectorAll('[data-e3l]').forEach(n=>n.textContent=lab);
  [...$('eAct').children].forEach(b=>{const on=b.dataset.v===st.sc;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});
  const bs=$('eStyle');bs.parentNode.hidden=!!s.lodge;
  if(!s.lodge){if(bs.dataset.t!==st.sc){bs.dataset.t=st.sc;bs.innerHTML=T[s.t].styles.map(([c,,n],i)=>`<button type="button" role="radio" aria-label="${esc(n)}" style="--g:${c}" data-i="${i}"></button>`).join('')}
   [...bs.children].forEach((b,i)=>{b.setAttribute('aria-checked',i===st.style);b.tabIndex=i===st.style?0:-1});$('eStyleN').textContent=cn}
  if(st.touched)try{localStorage.setItem('oonde-e3',JSON.stringify({sc:st.sc,name:st.name,style:st.style,s:st.styleSet}))}catch(e){}
  document.dispatchEvent(new CustomEvent('oonde-e3',{detail:{name:st.name,t:s.t||''}}));
  dirty=true;tick()}
 /* Les choix */
 $('eAct').innerHTML=E3K.map(k=>`<button type="button" role="radio" data-v="${k}" aria-checked="false">${E3[k].lab}</button>`).join('');
 const choose=(k,ex)=>{if(!E3[k])return;st.touched=true;st.ex=ex?E3[k].ex:'';if(st.sc!==k){st.sc=k;st.style=0;st.styleSet=false;drawn=null;load(set);if(!view.classList.contains('live'))poster.src=e3base(k)+set+'/f000.webp'}paint()};
 $('eAct').addEventListener('click',e=>{const b=e.target.closest('button');if(b)choose(b.dataset.v)});
 $('eAct').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const i=E3K.indexOf(st.sc),n=E3K[(i+(e.key==='ArrowRight'?1:E3K.length-1))%E3K.length];choose(n);$('eAct').querySelector(`[data-v="${n}"]`).focus()});
 $('eStyle').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;st.touched=st.styleSet=true;st.style=+b.dataset.i;paint()});
 $('eStyle').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();st.touched=st.styleSet=true;st.style=(st.style+(e.key==='ArrowRight'?1:2))%3;paint();$('eStyle').children[st.style].focus()});
 $('eName').addEventListener('input',e=>{st.touched=true;st.name=e.target.value.trim().slice(0,40);paint()});
 $('eName').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur()});
 /* « Voir cette entrée » sur un exemple : la même entrée, avec le nom de l'exemple tant qu'on n'a pas tapé le sien */
 document.querySelectorAll('[data-e3]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();choose(a.dataset.e3,true);goTo(0)}));
 /* Un lien préparé (?e=restaurant&n=Chez%20Marco&c=1) remplit l'essai ; sinon, la dernière visite */
 {const q=new URLSearchParams(location.search);let m={};
  if(q.get('e'))m={sc:q.get('e'),name:q.get('n')||'',style:+q.get('c')||0,s:q.has('c')};else try{m=JSON.parse(localStorage.getItem('oonde-e3')||'{}')}catch(e){}
  if(E3[m.sc]){st.sc=m.sc;st.touched=true}if(typeof m.name==='string'&&m.name){st.name=m.name.slice(0,40);$('eName').value=st.name;st.touched=true}
  if(Number.isInteger(m.style))st.style=clamp(m.style,0,2),st.styleSet=!!m.s}
 /* « Réserver », le menu, le logo : le faux site réagit comme un vrai */
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight)};
 const goTo=p=>{if(!LIVE){(p>=.8?site:walk).scrollIntoView({block:'start'});return}geo();scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+p*D})};
 const open=o=>{toast.hidden=!o;if(o)$('eWa').focus({preventScroll:true})};
 view.addEventListener('click',e=>{const g=e.target.closest('[data-go]'),b=e.target.closest('[data-book]');
  if(g){open(false);goTo(+g.dataset.go)}else if(b)open(true);else if(e.target.closest('#eX'))open(false)});
 view.addEventListener('keydown',e=>{if(e.key==='Escape'&&!toast.hidden){open(false);$('eBook').focus()}});
 /* 1. Images et enseignes : jeu « ordinateur » (16:10, 96 images) ou « téléphone » (portrait, 72) ; mouvement réduit : la première seule */
 const SETS={d:96,m:72},store={};
 const near=(k,i)=>{const s=store[st.sc+k];if(!s)return null;const n=SETS[k];for(let d=0;d<n;d++){if(i-d>=0&&s.ok[i-d])return[s.img[i-d],i-d,s];if(i+d<n&&s.ok[i+d])return[s.img[i+d],i+d,s]}return null};
 function load(k){const key=st.sc+k;if(store[key]||!armed)return;const sc=st.sc,n=SETS[k],s=store[key]={img:new Array(n),ok:new Uint8Array(n),pins:null},order=[0],seen=new Set(order);
  if(LIVE){order.push(n-1);seen.add(n-1);for(const sp of[8,4,2,1])for(let i=0;i<n;i+=sp)if(!seen.has(i)){seen.add(i);order.push(i)}}
  if(!E3[sc].lodge)fetch(e3base(sc)+k+'/pins.json').then(r=>r.json()).then(j=>{s.pins=j;if(sc===st.sc)dirty=true;tick()}).catch(()=>{});
  let q=0;const next=()=>{if(q>=order.length)return;const i=order[q++],im=new Image();im.decoding='async';im.src=e3base(sc)+k+'/f'+String(i).padStart(3,'0')+'.webp';
   im.onload=()=>{(im.decode?im.decode():Promise.resolve()).catch(()=>{}).then(()=>{s.img[i]=im;s.ok[i]=1;if(sc===st.sc&&k===set)dirty=true;tick();next()})};im.onerror=()=>{if(i===0&&sc===st.sc&&k===set){const o=k==='d'?'m':'d';load(o)}next()}};   /* jeu absent : l'autre jeu, recadré */
  for(let c=0;c<4;c++)next()}
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=cv.width=Math.round(r.width*d);H=cv.height=Math.round(r.height*d);
  set=r.width<r.height*.95?'m':'d';load(set);geo();dirty=true}
 /* 2. Rythme : la part du défilement figé (P) donne la position de la caméra (p) ; la porte est passée à p = .56 */
 const KS={e:[[0,0],[.03,0],[.3,.56],[.55,.86],[.66,1],[1,1]],g:[[0,0],[.03,0],[.25,.53],[.55,.85],[.66,1],[1,1]]};
 const K=()=>E3[st.sc].lodge?KS.g:KS.e,door=()=>E3[st.sc].lodge?.53:.56;
 const camOf=P=>{const k=K();for(let j=1;j<k.length;j++)if(P<=k[j][0]){const[a,pa]=k[j-1],[b,pb]=k[j],t=(P-a)/(b-a||1);return pa+(pb-pa)*(j===4?1-(1-t)*(1-t):t)}return 1};
 const ease=t=>1-Math.pow(1-t,3);
 /* 3. Dessin : l'image la plus proche déjà chargée, puis les deux enseignes posées dessus en perspective */
 function draw(p){if(!W||!H)return;let r=near(set,Math.round(p*(SETS[set]-1)));
  if(!r){const k=set==='d'?'m':'d';r=near(k,Math.round(p*(SETS[k]-1)))}
  if(!r)return;const[im,i,s]=r;if(im===drawn&&!dirty)return;
  const sc=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*sc,h=im.naturalHeight*sc;
  cx.drawImage(im,(W-w)/2,(H-h)/2,w,h);drawn=im;dirty=false;view.classList.add('live');
  const d=W/scene.clientWidth;if(!E3[st.sc].lodge)e3place(pins,s.pins&&s.pins[i]?s.pins[i].pins:null,{ox:(W-w)/2/d,oy:(H-h)/2/d,w:w/d,h:h/d})}
 /* 4. Textes, barre de progression, et le site qui monte */
 function ui(p){const lodge=E3[st.sc].lodge,c2in=lodge?.3:.12,c2out=lodge?.5:.3,c3in=lodge?.57:.5;
  for(const c of chs){const i=c.classList.contains('c2')?c2in:c===c3?c3in:-1,o=c.classList.contains('c2')?c2out:c===c3?9:.07;
   const a=i<0?clamp((o-P)/.05,0,1):Math.min(clamp((P-i)/.04,0,1),clamp((o-P)/.04,0,1));
   const s=c===c3?ease(clamp((P-.68)/.22,0,1)):0;c.style.opacity=Math.max(0,a*(1-s*2.6));c.style.transform=`translateY(${(1-a)*14-s*260}px)`;
   const on=a>.5&&s<.5;c.classList.toggle('on',on);c.inert=!on}
  const s=ease(clamp((P-.68)/.27,0,1)),mob=W<H;site.style.transform=`translateY(${(1-s)*110}%)`;site.inert=s<.5;
  const band=parseFloat(getComputedStyle(site).top)||150,vh=view.clientHeight,y=`translateY(${-s*Math.max(0,vh*(mob?.5:.56)-band*.6)}px)`;cv.style.transform=y;poster.style.transform=y;pins.style.transform=y;
  bar.classList.toggle('solid',s>.82);view.querySelector('.w-prog').style.opacity=1-Math.min(1,s*2.5);
  fill.style.width=(p*100)+'%';const k=p<door()?1:p<.85?2:3;ks.forEach(x=>x.classList.toggle('on',+x.dataset.k===k))}
 /* 5. Boucle : la position affichée rattrape la cible en ~80 ms ; rien ne tourne quand l'entrée est loin */
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 function loop(){raf=0;if(!LIVE){draw(0);return}const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  document.body.classList.toggle('walking',r.top<=hh+1&&r.bottom>=innerHeight-1&&P>.02);
  const t=camOf(P);cur+=(t-cur)*.22;if(Math.abs(t-cur)<.0005)cur=t;
  if(dirty||cur!==last){draw(cur);last=cur}ui(cur);if(cur!==t)tick()}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(!vis)open(false);tick()}).observe(walk);
 /* l'entrée est le premier écran : on charge tout de suite le début, puis le reste */
 poster.onerror=()=>{if(poster.src.includes('/m/'))poster.src=poster.src.replace('/m/','/d/')};
 armed=true;size();poster.src=e3base(st.sc)+set+'/f000.webp';paint();
 addEventListener('resize',()=>{size();tick()});
 if(document.fonts)document.fonts.ready.then(paint);
 if(!LIVE)return;
 addEventListener('scroll',()=>{if(vis)tick()},{passive:true});
 /* 6. Arrêt entre deux moments : l'entrée se pose doucement sur le plus proche (la rue, la porte, la salle, le site) */
 let idle=0;addEventListener('scroll',()=>{clearTimeout(idle);idle=setTimeout(()=>{if(!vis||P<=0||P>=1)return;const ST=E3[st.sc].lodge?[0,.40,.66,1]:[0,.22,.6,1],n=ST.reduce((a,b)=>Math.abs(b-P)<Math.abs(a-P)?b:a);
  if(Math.abs(n-P)>.015&&Math.abs(n-P)<.12)scrollTo({top:walk.getBoundingClientRect().top+scrollY-hh+n*D,behavior:'smooth'})},220)},{passive:true});
 ui(0);tick();
})();

/* Les exemples : la dernière image de chaque entrée, avec le nom de l'exemple posé au mur du fond */
(()=>{const cache={};
 const show=(card,k)=>{const s=E3[k],box=card.querySelector('.e-pins'),img=card.querySelector('img');
  const go=()=>{const r=img.getBoundingClientRect();if(!r.width||!cache[k])return;const fr=cache[k][cache[k].length-1];
   card.style.setProperty('--c',T[s.t].styles[0][0]);card.style.setProperty('--ct',T[s.t].styles[0][1]);e3pins(box,s,s.ex);
   box.style.transform=`scale(${r.width/1000})`;e3place(box,fr.pins,{ox:0,oy:0,w:1000,h:1000*r.height/r.width})};
  if(img.complete)go();else img.addEventListener('load',go);new ResizeObserver(go).observe(img)};
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const card=e.target,k=card.dataset.k;
  (cache[k]?Promise.resolve():fetch(e3base(k)+'d/pins.json').then(r=>r.json()).then(j=>{cache[k]=j})).then(()=>show(card,k)).catch(()=>{})}),{rootMargin:'300px'});
 document.querySelectorAll('.ex[data-k]').forEach(c=>{if(c.querySelector('.e-pins'))io.observe(c)})})();
