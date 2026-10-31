/* L'entrée 3D : les outils des films (paquets d'images, décodage, enseignes posées en perspective, aimantation) et,
   depuis la v19, l'état de la démo (E3S) : la démo est la rue elle-même (rue.js). On tape son nom et on choisit son métier
   à l'arrêt ; le nom s'allume sur l'enseigne, puis au mur du fond de la salle ; les rubriques du site suivent sous la rue.
   Les images sont calculées d'avance (entree3d/), avec, pour chaque image, la position des enseignes (pins.json). */
const E3={
 restaurant:{t:'restaurant',lab:'Restaurant',ex:'Le Petit Port',wall:5.8,sf:'serif',wf:'gilt',k3:'03 LA SALLE',hi:'La table est mise. Entrez.',c3:'Ce soir, une table vous attend.'},
 coiffure:{t:'coiffure',lab:'Coiffure',ex:'Atelier Sauge',wall:5.86,sf:'sans',ss:'letters',wf:'neon',k3:'03 LE SALON',hi:'Votre salon, avant même le rendez-vous.',c3:'Un fauteuil vous attend.'},
 institut:{t:'beaute',lab:'Institut',ex:'Maison Calme',wall:5.8,sf:'serif',ss:'letters',wf:'neon',k3:'03 LA CABINE',hi:'Le calme commence à la porte.',c3:'Prenez le temps.'},
 onglerie:{t:'ongles',lab:'Onglerie',ex:'Nacre',wall:5.45,sf:'sans',wf:'neon',k3:'03 LES COULEURS',hi:'Toutes les couleurs vous attendent.',c3:'Choisissez votre couleur.'},
 boulangerie:{t:'boulangerie',lab:'Boulangerie',ex:'La Fournée',wall:4.8,sf:'serif',wf:'paint',k3:'03 LE COMPTOIR',hi:'Le pain chaud, dès le trottoir.',c3:'Sorti du four ce matin.'},
 logement:{lab:'Logement',ex:'Les Arcades',lodge:1,wall:5.4,sf:'serif',wf:'gilt',k3:'03 LE SALON',hi:'Posez vos valises.',c3:'Votre séjour commence ici.'}};
const E3K=Object.keys(E3);
/* L'enseigne posée sur quatre coins projetés (0–1 dans l'image) : un rectangle w × h, déformé par une homographie */
function e3quad(el,c,w,h,f){const X=c.map(q=>f.ox+q[0]*f.w),Y=c.map(q=>f.oy+q[1]*f.h);
 const dx1=X[1]-X[2],dx2=X[3]-X[2],dx3=X[0]-X[1]+X[2]-X[3],dy1=Y[1]-Y[2],dy2=Y[3]-Y[2],dy3=Y[0]-Y[1]+Y[2]-Y[3],den=dx1*dy2-dx2*dy1||1e-9;
 const g=(dx3*dy2-dx2*dy3)/den,k=(dx1*dy3-dx3*dy1)/den,a=X[1]-X[0]+g*X[1],b=X[3]-X[0]+k*X[3],d=Y[1]-Y[0]+g*Y[1],e=Y[3]-Y[0]+k*Y[3];
 el.style.transform=`matrix3d(${a/w},${d/w},0,${g/w},${b/h},${e/h},0,${k/h},0,0,1,0,${X[0]},${Y[0]},0,1)`}
/* v28 : la hauteur (px, pour 1000 de large) qui garde les proportions : 1000 × bord vertical moyen / bord horizontal moyen du rectangle projeté
   (sans elle, un bloc de hauteur fixe posé sur une enseigne plus plate écrase le texte) */
function e3qh(c,f){const X=c.map(q=>q[0]*f.w),Y=c.map(q=>q[1]*f.h),d=(i,j)=>Math.hypot(X[i]-X[j],Y[i]-Y[j]);return Math.round(1000*(d(0,3)+d(1,2))/((d(0,1)+d(3,2))||1)*10)/10}
/* Le texte tient dans sa place : la taille baisse pour les noms longs */
const e3meas=document.createElement('canvas').getContext('2d');
function e3fit(el,txt,font,max,w){e3meas.font=font.replace('{s}',max);const tw=e3meas.measureText(txt).width||1;el.style.fontSize=Math.min(max,max*w/tw).toFixed(1)+'px'}
function e3pins(box,s,name,h){const sg=box.querySelector('.e-sign>span'),wl=box.querySelector('.e-wall>span'),sans=s.sf==='sans';   /* v28 : h, la hauteur d'après le rectangle projeté du mur (e3qh), sinon 1000/wall */
 box.dataset.sf=s.sf||'';box.dataset.wf=s.wf||'';box.dataset.ss=s.ss||'';
 if(sg){sg.textContent=sans?name.toUpperCase():name;e3fit(sg,sg.textContent,sans?'600 {s}px "Instrument Sans"':'400 {s}px "Cormorant Garamond"',sans?54:80,sans?760:860)}
 const wh=h||1000/(s.wall||5.8),we=box.querySelector('.e-wall');we.style.height=wh.toFixed(1)+'px';we._h=+wh.toFixed(1);if(sg)sg.parentNode._h=0;
 wl.textContent=name;e3fit(wl,name,s.wf==='neon'?'italic 400 {s}px "Cormorant Garamond"':'400 {s}px "Cormorant Garamond"',Math.round(wh*.66),900)}
function e3place(box,pins,f){for(const el of box.children){const q=pins&&pins.find(x=>x.id===el.dataset.id);
 if(!q||q.vis<=0){if(el._o!==0){el._o=0;el.style.opacity=0}continue}e3quad(el,q.c,1000,el._h||(el._h=el.offsetHeight||111),f);if(el._o!==q.vis){el._o=q.vis;el.style.opacity=q.vis}}}   /* hauteur gardée (e3pins la remet) : aucune lecture de mise en page par image */

/* v27 : le film de l'intro est une vidéo (rue.js) ; il ne reste des paquets d'images (v22) que la détection AVIF, pour les affiches (E3F : 'a' ou 'w') */
const E3F=(()=>{try{const b=Uint8Array.from(atob('AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAACIAAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgQAMAAAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAqbWRhdBIACggYADbICGg0IDIUHEeHhd3AACwAACDsJLhGXp8ww9A='),c=>c.charCodeAt(0));
 return window.createImageBitmap?createImageBitmap(new Blob([b],{type:'image/avif'})).then(m=>{if(m.close)m.close();return 'a'},()=>'w'):Promise.resolve('w')}catch(e){return Promise.resolve('w')}})();
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

/* v19 : la démo, c'est la rue. Le nom et le métier choisis à l'arrêt suivent la caméra dans la salle (le nom au mur du fond),
   jusqu'à la fin du site (le bouton du métier, marqué Démo), puis dans les rubriques du site, plus bas (#entree) :
   horaires, prix, photos de la salle. Ce module tient l'état (métier, nom) ; rue.js le lit et le change (E3S.set). */
const E3IN={d:[22,38,55],m:[26,44,63]};   /* les photos du site : trois images de la salle (entree3d, ?int=) */
const e3in=k=>'img/e3d/in-'+k+'/';
const E3S=(()=>{const st={sc:'coiffure',name:'',touched:false};   /* v27 : la façade du milieu de la rue. v28 : plus de choix de couleur (chaque métier garde sa couleur, sites.js) */
 const sec=$('entree'),u=$('univers');let ph='';
 const sty=()=>{const s=E3[st.sc];return s.lodge?['#3D4A52','#fff','ardoise']:T[s.t].styles[0]};
 /* le message WhatsApp : ce que la personne a tapé et choisi, rien d'autre */
 function msg(){const s=E3[st.sc],t=s.lodge?null:T[s.t];if(!st.touched)return MSG.imm();
  const what=s.lodge?'logement':t.noun;
  /* v24 (brief § 3.8) : avec le nom tapé à l'arrêt, « l'aperçu 3D de [Nom] ([métier]) » */
  return st.name?`${HELLO} J’aimerais l’aperçu 3D de ${st.name} (${what}) et le prix de son site.\nMa commune : `:`${HELLO} J’aimerais voir ma façade en 3D (${what}) et recevoir le prix de mon site.\nMon commerce et ma commune : `}
 const txt=(id,v)=>{const e=$(id);if(e&&e.textContent!==v)e.textContent=v};
 function paint(){const s=E3[st.sc],t=s.lodge?null:T[s.t],[c,ct]=sty(),name=st.name||'Votre commerce',lab=s.lodge?'Logement':t.label;
  for(const el of [u,sec])if(el){el.style.setProperty('--c',c);el.style.setProperty('--ct',ct)}
  const cta=s.lodge?'Réserver un séjour':t.cta,see=s.lodge?'Voir les dates':'Voir '+({'Menu du jour':'le menu du jour','Nos produits':'nos produits'}[t.sec]||'les '+t.sec.toLowerCase());
  /* la fin de la rue : la barre du site, le titre et le bouton du métier */
  txt('rSbN',name);txt('rSbB',/rendez-vous/.test(cta)?'Rendez-vous':cta.split(' ')[0]);
  txt('rEndEb',lab);txt('rEndH',s.c3);
  /* les rubriques du site */
  if(sec){txt('eLogoN',name);txt('eBookB',/rendez-vous/.test(cta)?'Rendez-vous':cta.split(' ')[0]);
   const nav=$('eNav');if(nav&&nav.dataset.k!==st.sc){nav.dataset.k=st.sc;nav.innerHTML=s.lodge?'<a href="#eInfo">Le logement</a><a href="#eInfo">Dates</a>':`<a href="#eInfo">${esc(t.sec)}</a><a href="#eInfo">Horaires</a><a href="#eInfo">Contact</a>`}
   const body=$('eSite');if(body.dataset.k!==st.sc){body.dataset.k=st.sc;
    body.innerHTML=s.lodge?$('eLodge').innerHTML:`<div class="ds-top"><div><p class="ds-eb">${esc(t.label)} · <i class="dtag">Démo</i></p><h2 class="ds-t" id="hS"><span class="sr">Démo, la suite du site : </span><span id="eSiteT"></span></h2><p class="ds-sub">${esc(t.h.replace(/ (à|de) \{t\}/,''))} ${esc(t.sub)}</p>
     <div class="ds-more"><div><p class="ds-k">HORAIRES</p><p>${t.hours}</p></div><div><p class="ds-k">LA MAISON</p><p>${esc(t.about)}</p></div><div><p class="ds-k">SUR GOOGLE</p><p>Votre fiche, vos avis et l’itinéraire, à un clic.</p></div></div></div>
     <div class="ds-card"><p class="ds-k">${esc(t.sec.toUpperCase())}</p>${t.rows.slice(0,4).map(([a,b])=>`<p class="ds-row"><span>${esc(a)}</span><b>${esc(b)}</b></p>`).join('')}<button type="button" class="ds-go" data-book>${esc(cta)}</button><p class="ds-n">${esc(t.open)}</p></div></div>`}
   txt('eSiteT',name);photos()}
  $('eToastT').textContent=s.lodge?'Ici, vos clients réservent.':t.cta==='Commander'?'Ici, vos clients commandent.':/table/.test(t.cta)?'Ici, vos clients réservent leur table.':'Ici, vos clients prennent rendez-vous.';
  /* les boutons « Recevoir mon aperçu 3D » de la page suivent l'essai */
  const href=wa(msg());document.querySelectorAll('a[data-wa="e3"]').forEach(a=>a.href=href);
  /* v28 : « Recevoir ma maquette gratuite » ; avec le nom tapé, « Recevoir la maquette de [Nom] » ; la barre du bas (data-e3l="court") dit « Ma maquette gratuite » / « Maquette de [Nom] » */
  const nm=st.name?(st.name.length>18?st.name.slice(0,17)+'…':st.name):'';document.querySelectorAll('[data-e3l]').forEach(n=>n.textContent=n.dataset.e3l==='court'?(nm?'Maquette de '+nm:'Ma maquette gratuite'):(nm?'Recevoir la maquette de '+nm:'Recevoir ma maquette gratuite'));
  const se=$('eSel');if(se)se.value=st.sc;
  if(st.touched)try{localStorage.setItem('oonde-e3',JSON.stringify({sc:st.sc,name:st.name}))}catch(e){}
  document.dispatchEvent(new CustomEvent('oonde-e3',{detail:{name:st.name,t:s.t||'',sc:st.sc}}))}
 /* les photos de la salle : trois images de son film (deux sur téléphone) ; leur place est tenue d'avance (width/height), le navigateur ne les charge qu'à l'approche (loading=lazy) */
 function photos(){const box=$('ePh');if(!box)return;const k=innerWidth<innerHeight*.95?'m':'d',key=st.sc+k;if(ph===key)return;ph=key;
  box.innerHTML=E3IN[k].slice(0,k==='m'?2:3).map((i,j)=>`<img src="${e3in(st.sc)}${k}/f0${String(i).padStart(2,'0')}.webp" width="${k==='m'?540:1280}" height="${k==='m'?960:800}" alt="${j?'':'Démo : la salle, vue depuis l’entrée'}" loading="lazy" decoding="async">`).join('')}
 function set(o){let ch=false;if(o.sc&&E3[o.sc]&&o.sc!==st.sc){st.sc=o.sc;ch=true}
  if(typeof o.name==='string'){const n=o.name.trim().slice(0,40);if(n!==st.name){st.name=n;ch=true}}
  if(ch||o.force){if(!o.quiet)st.touched=true;paint()}}
 /* un lien préparé (?e=restaurant&n=Chez%20Marco) remplit l'essai ; sinon, la dernière visite */
 {const q=new URLSearchParams(location.search);let m={};
  if(q.get('e'))m={sc:q.get('e'),name:q.get('n')||''};else try{m=JSON.parse(localStorage.getItem('oonde-e3')||'{}')}catch(e){}
  if(E3[m.sc]){st.sc=m.sc;st.touched=true}if(typeof m.name==='string'&&m.name){st.name=m.name.slice(0,40);st.touched=true}}
 if(sec){const se=$('eSel');if(se){se.innerHTML=E3K.map(k=>`<option value="${k}">${E3[k].lab}</option>`).join('');se.addEventListener('change',()=>set({sc:se.value}))}
  addEventListener('resize',photos)}
 /* au clavier, dans le site de démo : l'élément qui prend le focus est à l'écran tout de suite (sans attendre le défilement doux) */
 if(sec)sec.addEventListener('focusin',e=>{const t=e.target,r=t.getBoundingClientRect(),top=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||84;if(r.top<top||r.bottom>innerHeight-8)t.scrollIntoView({block:'center',behavior:'instant'})});
 /* « Réserver », « Commander » : le faux site réagit comme un vrai, et dit que c'est une démo */
 const toast=$('eToast');let from=null;
 let ty=0;const open=(o,b)=>{toast.hidden=!o;if(o){from=b;ty=scrollY;$('eWa').focus({preventScroll:true})}else if(from){const f=from;from=null;f.focus({preventScroll:true})}};
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-book]');if(b){e.preventDefault();open(true,b)}else if(e.target.closest&&e.target.closest('#eX'))open(false);else if(!toast.hidden&&!toast.contains(e.target))toast.hidden=true});
 toast.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();open(false)}});
 addEventListener('scroll',()=>{if(!toast.hidden&&Math.abs(scrollY-ty)>160)toast.hidden=true},{passive:true});   /* on s'éloigne du bouton : la fiche se range */
 paint();if(document.fonts)document.fonts.ready.then(paint);
 return{st,set,sty,paint}})();

