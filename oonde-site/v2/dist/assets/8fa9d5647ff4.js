const T={
 coiffure:{bp:'35% 50%',label:'Coiffure',noun:'salon de coiffure',photo:'img/t-coiffure.jpg',h:'Votre salon à {t}.',sub:'Coupes, couleurs et soins, sur rendez-vous.',sec:'Prestations',rows:[['Coupe & brushing','65.–'],['Balayage','140.–'],['Coupe homme','38.–'],['Couleur racines','75.–'],['Soin profond','25.–']],cta:'Prendre rendez-vous',open:'Ouvert · jusqu’à 18:30',hours:'Ma–Ve 9:00–18:30<br>Sa 9:00–16:00',about:'Un salon de quartier, des coupes faites avec soin, et le temps de vous conseiller.',styles:[['#1F6F66','#fff','sapin'],['#8A4A78','#fff','prune'],['#B08A2E','#15171B','miel']]},
 ongles:{label:'Onglerie',noun:'onglerie',photo:'img/t-ongles.jpg',h:'Vos ongles entre de bonnes mains à {t}.',sub:'Manucure, semi-permanent, gel, nail art.',sec:'Prestations',rows:[['Manucure semi-permanent','55.–'],['Pose gel complète','90.–'],['Remplissage','65.–'],['Nail art, par ongle','5.–'],['Dépose','20.–']],cta:'Prendre rendez-vous',open:'Ouvert · jusqu’à 19:00',hours:'Ma–Ve 9:30–19:00<br>Sa 9:00–17:00',about:'Des poses qui tiennent, des produits choisis, et un rendez-vous qui commence à l’heure.',styles:[['#B85C6E','#fff','rose poudré'],['#15171B','#fff','noir'],['#7D5FA6','#fff','lilas']]},
 barbier:{label:'Barbier',noun:'salon de barbier',photo:'img/t-barbier.jpg',h:'Votre barbier à {t}.',sub:'Coupe, barbe, rasage à l’ancienne.',sec:'Prestations',rows:[['Coupe homme','35.–'],['Taille de barbe','25.–'],['Coupe + barbe','55.–'],['Rasage à l’ancienne','40.–'],['Coupe enfant','25.–']],cta:'Prendre rendez-vous',open:'Ouvert · jusqu’à 19:00',hours:'Ma–Ve 9:00–19:00<br>Sa 8:30–16:00',about:'Des coupes nettes, la barbe taillée au rasoir, et un café en attendant.',styles:[['#1F5A43','#fff','vert anglais'],['#15171B','#fff','noir'],['#9A5F2A','#fff','cognac']]},
 beaute:{bp:'40% 50%',label:'Institut',noun:'institut de beauté',photo:'img/t-beaute.jpg',h:'Prenez soin de vous à {t}.',sub:'Visage, épilation, manucure.',sec:'Soins',rows:[['Soin du visage','95.–'],['Manucure','55.–'],['Épilation jambes','60.–'],['Massage relaxant','110.–'],['Beauté des pieds','70.–']],cta:'Réserver un soin',open:'Ouvert · jusqu’à 19:00',hours:'Lu–Sa 9:00–19:00',about:'Un institut calme, des soins expliqués avant d’être faits, et des produits que vous pouvez emporter.',styles:[['#94634A','#fff','noisette'],['#A35A7E','#fff','rose'],['#3F7A66','#fff','eucalyptus']]},
 restaurant:{label:'Restaurant',noun:'restaurant',photo:'img/t-restaurant.jpg',h:'Une bonne table à {t}.',sub:'Midi et soir, une cuisine de saison.',sec:'Menu du jour',rows:[['Menu du jour','21.50'],['Filets de perche','34.–'],['Dessert maison','9.–'],['Plat végétarien','24.–'],['Menu enfant','14.–']],cta:'Réserver une table',open:'Ouvert · jusqu’à 23:00',hours:'Ma–Di 11:30–14:00<br>18:00–23:00',about:'Des produits de la région, une carte courte qui change avec les saisons, et une terrasse aux beaux jours.',styles:[['#B04E26','#fff','terre cuite'],['#2F7A52','#fff','olive'],['#8E2F3F','#fff','bordeaux']]},
 boulangerie:{label:'Boulangerie',noun:'boulangerie',photo:'img/t-boulangerie.jpg',h:'Le bon pain de {t}.',sub:'Pain au levain, tresses et viennoiseries du matin.',sec:'Nos produits',rows:[['Pain au levain','6.80'],['Tresse au beurre','7.50'],['Croissant','1.90'],['Pain de seigle','6.20'],['Tarte du jour','4.50']],cta:'Commander',open:'Ouvert · dès 6:30',hours:'Lu–Sa 6:30–18:30<br>Di 7:00–12:00',about:'Du pain qui lève lentement, des tresses le samedi, et des commandes prêtes à l’heure que vous voulez.',styles:[['#A8662A','#fff','croûte'],['#7A3B2E','#fff','chocolat'],['#2F6B57','#fff','sauge']]},
 fleuriste:{bp:'30% 50%',label:'Fleuriste',noun:'magasin de fleurs',photo:'img/t-fleuriste.jpg',h:'Des fleurs de saison à {t}.',sub:'Bouquets, mariages, deuils, livraison.',sec:'Bouquets',rows:[['Bouquet de saison','dès 45.–'],['Bouquet de mariée','sur devis'],['Livraison locale','10.–'],['Plante verte','dès 29.–'],['Composition de deuil','sur devis']],cta:'Commander un bouquet',open:'Ouvert · jusqu’à 18:30',hours:'Ma–Ve 8:30–18:30<br>Sa 8:00–16:00',about:'Des fleurs de saison, des bouquets faits devant vous, et la livraison dans la commune.',styles:[['#4F7A4A','#fff','feuillage'],['#B84F72','#fff','pivoine'],['#B88124','#15171B','mimosa']]},
 garage:{bp:'60% 45%',label:'Garage',noun:'garage',photo:'img/t-garage.jpg',h:'Votre garage de confiance à {t}.',sub:'Service, freins, pneus. Toutes marques.',sec:'Tarifs',rows:[['Service selon carnet','dès 290.–'],['Changement de pneus','80.–'],['Diagnostic','95.–'],['Contrôle avant expertise','150.–'],['Climatisation','120.–']],cta:'Demander un devis',open:'Ouvert · jusqu’à 18:00',hours:'Lu–Ve 7:30–12:00<br>13:30–18:00',about:'Un atelier toutes marques, un devis avant chaque travail, et votre voiture rendue propre.',styles:[['#2038EC','#fff','bleu'],['#C2412A','#fff','brique'],['#15171B','#fff','noir']]},
 artisan:{label:'Artisan',noun:'entreprise artisanale',photo:'img/t-artisan.jpg',h:'Des travaux bien faits à {t}.',sub:'Menuiserie, rénovation, dépannage.',sec:'Services',rows:[['Devis gratuit','sous 48 h'],['Rénovation','sur mesure'],['Dépannage','7 j / 7'],['Pose de cuisine','sur devis'],['Petits travaux','à l’heure']],cta:'Demander un devis',open:'Joignable · 7 h – 19 h',hours:'Lu–Ve 7:00–19:00<br>Dépannage 7 j / 7',about:'Un artisan de la région, un devis clair avant de commencer, et un chantier rendu propre.',styles:[['#A86C17','#15171B','ocre'],['#2D6E96','#fff','bleu acier'],['#5F7A33','#fff','mousse']]},
 autre:{label:'Commerce',noun:'commerce',photo:'',h:'Bienvenue à {t}.',sub:'Vos prix, vos horaires, un bouton pour nous écrire.',sec:'Tarifs',rows:[['Votre prestation','dès 50.–'],['Votre formule','120.–'],['Sur demande','devis'],['Votre produit phare','35.–'],['Bon cadeau','dès 30.–']],cta:'Nous écrire',open:'Ouvert · jusqu’à 18:30',hours:'Lu–Sa 9:00–18:30',about:'Ce que vous faites, dit simplement, avec vos prix et vos horaires.',styles:[['#2038EC','#fff','bleu'],['#15171B','#fff','noir'],['#2F7A52','#fff','vert']]}
};
const Q={coiffure:'coiffeur',ongles:'onglerie',barbier:'barbier',beaute:'institut beauté',restaurant:'restaurant',boulangerie:'boulangerie',fleuriste:'fleuriste',garage:'garage',artisan:'menuisier',autre:'commerce'};
const TOWNS=['Genève','Coppet','Nyon','Rolle','Morges','Lausanne','Pully','Vevey','Montreux'];
const E3={
 restaurant:{t:'restaurant',lab:'Restaurant',ex:'Le Petit Port',wall:5.8,sf:'serif',wf:'gilt',k3:'03 LA SALLE',hi:'La table est mise. Entrez.',c3:'Ce soir, une table vous attend.'},
 coiffure:{t:'coiffure',lab:'Coiffure',ex:'Atelier Sauge',wall:5.86,sf:'sans',ss:'letters',wf:'neon',k3:'03 LE SALON',hi:'Votre salon, avant même le rendez-vous.',c3:'Un fauteuil vous attend.'},
 institut:{t:'beaute',lab:'Institut',ex:'Maison Calme',wall:5.8,sf:'serif',ss:'letters',wf:'neon',k3:'03 LA CABINE',hi:'Le calme commence à la porte.',c3:'Prenez le temps.'},
 onglerie:{t:'ongles',lab:'Onglerie',ex:'Nacre',wall:5.45,sf:'sans',wf:'neon',k3:'03 LES COULEURS',hi:'Toutes les couleurs vous attendent.',c3:'Choisissez votre couleur.'},
 boulangerie:{t:'boulangerie',lab:'Boulangerie',ex:'La Fournée',wall:4.8,sf:'serif',wf:'paint',k3:'03 LE COMPTOIR',hi:'Le pain chaud, dès le trottoir.',c3:'Sorti du four ce matin.'},
 logement:{lab:'Logement',ex:'Les Arcades',lodge:1,wall:5.4,sf:'serif',wf:'gilt',k3:'03 LE SALON',hi:'Posez vos valises.',c3:'Votre séjour commence ici.'}};
const E3K=Object.keys(E3);
function e3quad(el,c,w,h,f){const X=c.map(q=>f.ox+q[0]*f.w),Y=c.map(q=>f.oy+q[1]*f.h);
 const dx1=X[1]-X[2],dx2=X[3]-X[2],dx3=X[0]-X[1]+X[2]-X[3],dy1=Y[1]-Y[2],dy2=Y[3]-Y[2],dy3=Y[0]-Y[1]+Y[2]-Y[3],den=dx1*dy2-dx2*dy1||1e-9;
 const g=(dx3*dy2-dx2*dy3)/den,k=(dx1*dy3-dx3*dy1)/den,a=X[1]-X[0]+g*X[1],b=X[3]-X[0]+k*X[3],d=Y[1]-Y[0]+g*Y[1],e=Y[3]-Y[0]+k*Y[3];
 el.style.transform=`matrix3d(${a/w},${d/w},0,${g/w},${b/h},${e/h},0,${k/h},0,0,1,0,${X[0]},${Y[0]},0,1)`}
function e3qh(c,f){const X=c.map(q=>q[0]*f.w),Y=c.map(q=>q[1]*f.h),d=(i,j)=>Math.hypot(X[i]-X[j],Y[i]-Y[j]);return Math.round(1000*(d(0,3)+d(1,2))/((d(0,1)+d(3,2))||1)*10)/10}
const e3meas=document.createElement('canvas').getContext('2d');
function e3fit(el,txt,font,max,w){e3meas.font=font.replace('{s}',max);const tw=e3meas.measureText(txt).width||1;el.style.fontSize=Math.min(max,max*w/tw).toFixed(1)+'px'}
function e3pins(box,s,name,h){const sg=box.querySelector('.e-sign>span'),wl=box.querySelector('.e-wall>span'),sans=s.sf==='sans';
 box.dataset.sf=s.sf||'';box.dataset.wf=s.wf||'';box.dataset.ss=s.ss||'';
 if(sg){sg.textContent=sans?name.toUpperCase():name;e3fit(sg,sg.textContent,sans?'600 {s}px "Instrument Sans"':'400 {s}px "Cormorant Garamond"',sans?54:80,sans?760:860)}
 const wh=h||1000/(s.wall||5.8),we=box.querySelector('.e-wall');we.style.height=wh.toFixed(1)+'px';we._h=+wh.toFixed(1);if(sg)sg.parentNode._h=0;
 wl.textContent=name;e3fit(wl,name,s.wf==='neon'?'italic 400 {s}px "Cormorant Garamond"':'400 {s}px "Cormorant Garamond"',Math.round(wh*.66),900)}
function e3place(box,pins,f){for(const el of box.children){const q=pins&&pins.find(x=>x.id===el.dataset.id);
 if(!q||q.vis<=0){if(el._o!==0){el._o=0;el.style.opacity=0}continue}e3quad(el,q.c,1000,el._h||(el._h=el.offsetHeight||111),f);if(el._o!==q.vis){el._o=q.vis;el.style.opacity=q.vis}}}
const E3F=(()=>{try{const b=Uint8Array.from(atob('AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAACIAAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgQAMAAAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAqbWRhdBIACggYADbICGg0IDIUHEeHhd3AACwAACDsJLhGXp8ww9A='),c=>c.charCodeAt(0));
 return window.createImageBitmap?createImageBitmap(new Blob([b],{type:'image/avif'})).then(m=>{if(m.close)m.close();return 'a'},()=>'w'):Promise.resolve('w')}catch(e){return Promise.resolve('w')}})();
const e3touch={n:0};for(const ev of ['touchstart','touchend','touchcancel'])addEventListener(ev,e=>{e3touch.n=e.touches?e.touches.length:0},{passive:true,capture:true});
let e3gl=0,e3own=-1;const e3halt=()=>{if(e3gl){cancelAnimationFrame(e3gl);e3gl=0}};
for(const ev of ['wheel','touchstart','keydown','pointerdown'])addEventListener(ev,e3halt,{passive:true,capture:true});
function e3glide(y,ms){e3halt();const y0=scrollY,d=y-y0;if(Math.abs(d)<2)return;let t0=0;ms=ms||Math.min(900,380+Math.abs(d)*.6);
 const st=now=>{if(t0&&e3own>=0&&Math.abs(scrollY-e3own)>3){e3gl=0;e3own=-1;return}
  if(!t0)t0=now;const t=Math.min(1,(now-t0)/ms),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;e3own=Math.round(y0+d*e);scrollTo({top:e3own,behavior:'instant'});e3gl=t<1?requestAnimationFrame(st):0};e3gl=requestAnimationFrame(st)}
const e3gliding=()=>{if(e3gl)return true;if(e3own>=0&&Math.abs(scrollY-e3own)<1.5)return true;e3own=-1;return false};
const E3IN={d:[22,38,55],m:[26,44,63]};
const e3in=k=>'img/e3d/in-'+k+'/';
const E3S=(()=>{const st={sc:'coiffure',name:'',touched:false};
 const sec=$('entree'),u=$('univers');let ph='';
 const sty=()=>{const s=E3[st.sc];return s.lodge?['#3D4A52','#fff','ardoise']:T[s.t].styles[0]};
 function msg(){const s=E3[st.sc],t=s.lodge?null:T[s.t];if(!st.touched)return MSG.imm();
  const what=s.lodge?'logement':t.noun;
  return st.name?`${HELLO} J’aimerais l’aperçu 3D de ${st.name} (${what}) et le prix de son site.\nMa commune : `:`${HELLO} J’aimerais voir ma façade en 3D (${what}) et recevoir le prix de mon site.\nMon commerce et ma commune : `}
 const txt=(id,v)=>{const e=$(id);if(e&&e.textContent!==v)e.textContent=v};
 function paint(){const s=E3[st.sc],t=s.lodge?null:T[s.t],[c,ct]=sty(),name=st.name||'Votre commerce',lab=s.lodge?'Logement':t.label;
  for(const el of [u,sec])if(el){el.style.setProperty('--c',c);el.style.setProperty('--ct',ct)}
  const cta=s.lodge?'Réserver un séjour':t.cta,see=s.lodge?'Voir les dates':'Voir '+({'Menu du jour':'le menu du jour','Nos produits':'nos produits'}[t.sec]||'les '+t.sec.toLowerCase());
  txt('rSbN',name);txt('rSbB',/rendez-vous/.test(cta)?'Rendez-vous':cta.split(' ')[0]);
  txt('rEndEb',lab);txt('rEndH',s.c3);
  if(sec){txt('eLogoN',name);txt('eBookB',/rendez-vous/.test(cta)?'Rendez-vous':cta.split(' ')[0]);
   const nav=$('eNav');if(nav&&nav.dataset.k!==st.sc){nav.dataset.k=st.sc;nav.innerHTML=s.lodge?'<a href="#eInfo">Le logement</a><a href="#eInfo">Dates</a>':`<a href="#eInfo">${esc(t.sec)}</a><a href="#eInfo">Horaires</a><a href="#eInfo">Contact</a>`}
   const body=$('eSite');if(body.dataset.k!==st.sc){body.dataset.k=st.sc;
    body.innerHTML=s.lodge?$('eLodge').innerHTML:`<div class="ds-top"><div><p class="ds-eb">${esc(t.label)} · <i class="dtag">Démo</i></p><h2 class="ds-t" id="hS"><span class="sr">Démo, la suite du site : </span><span id="eSiteT"></span></h2><p class="ds-sub">${esc(t.h.replace(/ (à|de) \{t\}/,''))} ${esc(t.sub)}</p>
     <div class="ds-more"><div><p class="ds-k">HORAIRES</p><p>${t.hours}</p></div><div><p class="ds-k">LA MAISON</p><p>${esc(t.about)}</p></div><div><p class="ds-k">SUR GOOGLE</p><p>Votre fiche, vos avis et l’itinéraire, à un clic.</p></div></div></div>
     <div class="ds-card"><p class="ds-k">${esc(t.sec.toUpperCase())}</p>${t.rows.slice(0,4).map(([a,b])=>`<p class="ds-row"><span>${esc(a)}</span><b>${esc(b)}</b></p>`).join('')}<button type="button" class="ds-go" data-book>${esc(cta)}</button><p class="ds-n">${esc(t.open)}</p></div></div>`}
   txt('eSiteT',name);photos()}
  $('eToastT').textContent=s.lodge?'Ici, vos clients réservent.':t.cta==='Commander'?'Ici, vos clients commandent.':/table/.test(t.cta)?'Ici, vos clients réservent leur table.':'Ici, vos clients prennent rendez-vous.';
  const href=wa(msg());document.querySelectorAll('a[data-wa="e3"]').forEach(a=>a.href=href);
  const nm=st.name?(st.name.length>18?st.name.slice(0,17)+'…':st.name):'';document.querySelectorAll('[data-e3l]').forEach(n=>n.textContent=n.dataset.e3l==='court'?(nm?'Maquette de '+nm:'Ma maquette gratuite'):(nm?'Recevoir la maquette de '+nm:'Recevoir ma maquette gratuite'));
  const se=$('eSel');if(se)se.value=st.sc;
  if(st.touched)try{localStorage.setItem('oonde-e3',JSON.stringify({sc:st.sc,name:st.name}))}catch(e){}
  document.dispatchEvent(new CustomEvent('oonde-e3',{detail:{name:st.name,t:s.t||'',sc:st.sc}}))}
 function photos(){const box=$('ePh');if(!box)return;const k=innerWidth<innerHeight*.95?'m':'d',key=st.sc+k;if(ph===key)return;ph=key;
  box.innerHTML=E3IN[k].slice(0,k==='m'?2:3).map((i,j)=>`<img src="${e3in(st.sc)}${k}/f0${String(i).padStart(2,'0')}.webp" width="${k==='m'?540:1280}" height="${k==='m'?960:800}" alt="${j?'':'Démo : la salle, vue depuis l’entrée'}" loading="lazy" decoding="async">`).join('')}
 function set(o){let ch=false;if(o.sc&&E3[o.sc]&&o.sc!==st.sc){st.sc=o.sc;ch=true}
  if(typeof o.name==='string'){const n=o.name.trim().slice(0,40);if(n!==st.name){st.name=n;ch=true}}
  if(ch||o.force){if(!o.quiet)st.touched=true;paint()}}
 {const q=new URLSearchParams(location.search);let m={};
  if(q.get('e'))m={sc:q.get('e'),name:q.get('n')||''};else try{m=JSON.parse(localStorage.getItem('oonde-e3')||'{}')}catch(e){}
  if(E3[m.sc]){st.sc=m.sc;st.touched=true}if(typeof m.name==='string'&&m.name){st.name=m.name.slice(0,40);st.touched=true}}
 if(sec){const se=$('eSel');if(se){se.innerHTML=E3K.map(k=>`<option value="${k}">${E3[k].lab}</option>`).join('');se.addEventListener('change',()=>set({sc:se.value}))}
  addEventListener('resize',photos)}
 if(sec)sec.addEventListener('focusin',e=>{const t=e.target,r=t.getBoundingClientRect(),top=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||84;if(r.top<top||r.bottom>innerHeight-8)t.scrollIntoView({block:'center',behavior:'instant'})});
 const toast=$('eToast');let from=null;
 let ty=0;const open=(o,b)=>{toast.hidden=!o;if(o){from=b;ty=scrollY;$('eWa').focus({preventScroll:true})}else if(from){const f=from;from=null;f.focus({preventScroll:true})}};
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-book]');if(b){e.preventDefault();open(true,b)}else if(e.target.closest&&e.target.closest('#eX'))open(false);else if(!toast.hidden&&!toast.contains(e.target))toast.hidden=true});
 toast.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();open(false)}});
 addEventListener('scroll',()=>{if(!toast.hidden&&Math.abs(scrollY-ty)>160)toast.hidden=true},{passive:true});
 paint();if(document.fonts)document.fonts.ready.then(paint);
 return{st,set,sty,paint}})();
(()=>{const u=$('univers');if(!u)return;
const QUICK=true;if(QUICK)u.classList.add('quick');
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),poster=$('rPoster'),hold=$('rHold'),vIn=$('rVin'),vG=$('rVg'),vE=$('rVe'),pins=$('rPins'),anchor=$('choix');
 const ld=u.querySelector('.r-load'),t1=u.querySelector('.r-t1'),say=u.querySelector('.r-say'),stop=$('rStop'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),nm=sign.querySelector('.r-nm'),mets=[...sign.querySelectorAll('.r-met i')],veil=u.querySelector('.r-veil'),seg=u.querySelector('.r-seg'),rwall=$('rWall'),sbar=$('rSbar'),end=$('rEnd');
 const HOLD_MS=5000;
 const TRIO=['restaurant','coiffure','institut'],HOME='coiffure',VS={m:[1080,1920],d:[1920,1080]},HZ=140;
 let SLOW=false,stalls=0;try{const cn=navigator.connection;if(cn&&(cn.saveData||/2g|3g/.test(cn.effectiveType||'')||cn.downlink&&cn.downlink<3))SLOW=true}catch(e){}
 const COARSE=matchMedia('(pointer:coarse)').matches;let LIVE=!RM,set='d',fmt='jpg',st='title',met='',frz=false,kbY=-1,SW=1,SH=1,hh=64,D=HZ,dn=1,y0=0,ent=null,entOk=false,vis=true,fitB=null,PINS=null,sIn=false,skipT=0;
 const VX=(()=>{try{const v=document.createElement('video');return v.canPlayType('video/mp4; codecs="avc1.64002A"')?'mp4':v.canPlayType('video/webm; codecs="vp09.00.40.08"')?'webm':'mp4'}catch(e){return 'mp4'}})();
 const vid=k=>'video/e3d/'+set+'/'+k+'.'+VX,img=k=>'img/e3d/v/'+set+'/'+k+'.'+fmt;
 const r0=()=>scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d';
 const ss=x=>x*x*(3-2*x),memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}},flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 function fit(){const r=scene.getBoundingClientRect(),[w0,h0]=VS[set],sc=Math.max(r.width/w0,r.height/h0),w=w0*sc,h=h0*sc;SW=r.width;SH=r.height;fitB={ox:(r.width-w)/2,oy:(r.height-h)/2,w,h}}
 fetch('img/e3d/v/pins.json').then(r=>r.json()).then(j=>{PINS=j;place()}).catch(()=>{});
 let signQ=null,signH={};
 function place(){if(!PINS||!fitB){return}const P=PINS[set]||{};const q=(st==='in'||st==='title'||st==='intro'||st==='skip')?null:P.stop&&P.stop[met];
  if(q&&st!=='glide'&&st!=='door'){const hk=set+met,h=signH[hk]||(signH[hk]=e3qh(q,fitB));put(sign,'height',h+'px');e3quad(sign,q,1000,h,fitB);put(sign,'opacity','1');signQ={c:q,f:fitB}}else{put(sign,'opacity','0')}
  const rq=P.room&&P.room[met];if(rq&&rwall.firstElementChild){const h=e3qh(rq,fitB);if(Math.abs((rwall.firstElementChild._h||0)-h)>.5)wall()}
  const w=st==='in'?rq:null;if(st!=='door')e3place(rwall,w?[{id:'wall',c:w,vis:1}]:null,fitB)}
 let shown='';
 const fitN=()=>{e3meas.font='400 86px "Cormorant Garamond"';const w=e3meas.measureText(shown).width;nm.style.setProperty('--w',Math.ceil(w)+'px');nm.style.setProperty('--s',Math.min(1,860/(w||1)).toFixed(3))};
 function named(v,push){const t=v.trim().slice(0,40);let k=0;while(k<t.length&&k<shown.length&&t[k]===shown[k])k++;
  const bs=[...nm.children];for(let i=bs.length-1;i>=k;i--)bs[i].remove();
  for(let i=k;i<t.length;i++){const b=document.createElement('b');b.textContent=t[i];if(push)b.className='r-lit';b.style.animationDelay=Math.min(i-k,6)*35+'ms';nm.appendChild(b)}
  shown=t;sign.classList.toggle('on',!!t);fitN();recall();wall();if(push)E3S.set({name:v})}
 let mi=0,chosen=!!E3S.st.touched;
 const tiles=()=>[...seg.querySelectorAll('[data-m]')],padL=()=>parseFloat(getComputedStyle(seg).scrollPaddingLeft)||parseFloat(getComputedStyle(seg).paddingLeft)||0;
 let thumbs=false;const thumb=()=>{if(thumbs)return;thumbs=true;seg.querySelectorAll('img[data-src]').forEach(i=>{i.src=i.dataset.src})};
 function metier(k,push){if(!E3[k])return;if(!TRIO.includes(k)){if(!met)k=HOME;else return}if(push&&LIVE&&(st==='door'||st==='in'))return;const was=met;if(push)chosen=true;met=k;
  tiles().forEach(b=>{const on=b.dataset.m===k;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});
  if(k!==was){const a=mets[mi],b=mets[mi^=1];b.textContent=E3[k].lab;a.classList.remove('a');b.classList.add('a')}else mets[mi].classList.add('a');
  recall();if(push)E3S.set({sc:k});wall();if(k!==was&&was&&LIVE&&st!=='title'&&st!=='intro')glide(was,k);else if(k!==was)entryLoad();place()}
 function wall(){if(!rwall||!E3[met])return;const w=PINS&&PINS[set]&&PINS[set].room&&PINS[set].room[met];e3pins(rwall,E3[met],E3S.st.name||'Votre nom ici',w&&fitB?e3qh(w,fitB):undefined)}
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
 const cache={};function pre(k){const s=img(k);if(cache[s])return cache[s];const i=new Image();i.decoding='async';i.src=s;return cache[s]=(i.decode?i.decode().catch(()=>{}):Promise.resolve()).then(()=>s)}
 function holdTo(k){return pre(k).then(s=>{if(hold.src!==s&&!hold.src.endsWith('/'+s))hold.src=s;return (hold.decode?hold.decode():Promise.resolve()).catch(()=>{})}).then(()=>flag(u,'held',true))}
 function play(v){const p=v.play();if(p&&p.catch)p.catch(()=>{});return p}
 const onEnd=(v,fn,ms)=>{let done=false;const f=()=>{if(done)return;done=true;v.removeEventListener('ended',f);clearTimeout(t);fn()};v.addEventListener('ended',f);const t=setTimeout(()=>{if(v.ended||v.currentTime>=v.duration-.05||v.paused)f()},ms);return f};
 let arrT=0;function card(on){if(stop._e===on)return;stop._e=on;flag(stop,'on',on);flag(u,'stop',on);if(on){thumb();if(SLOW)Promise.all(TRIO.map(x=>pre('stop-'+x))).then(()=>{if(st==='stop')entryLoad()});else entryLoad()}}
 function arrive(){st='stop';pin(false);flag(u,'intro',false);put(t1,'opacity','0');flag(t1,'off',true);veil.style.setProperty('--hv','0');flag(u,'moving',true);place();
  flag(sign,'pulse',!shown);setTimeout(()=>flag(sign,'pulse',false),1300);arrT=performance.now();rested=true;setTimeout(()=>{if(st==='stop')card(true)},shown||chosen?250:400)}
 let ready=false,want=false,primed=false,userGo=false,holdT=0,goT=0,readyT=0;
 const full=()=>{try{const b=vIn.buffered,d=vIn.duration;return b.length>0&&d>0&&b.end(b.length-1)>=d-.15}catch(e){return false}};
 const fed=()=>vIn.readyState>=4||full();
 function go(force){if(st!=='title'||!LIVE)return;want=true;if(!ready&&!force)return;clearTimeout(holdT);
  if(!force&&!userGo&&!full()&&performance.now()-readyT<HOLD_MS+2500){holdT=setTimeout(go,150);return}
  goT=performance.now();const pr=vIn.play();if(pr&&pr.catch)pr.catch(()=>{if(st==='title')setTimeout(()=>{if(st==='title'&&vIn.paused)toStop()},400)})}
 function armed(force){if(ready||st!=='title')return;if(!force&&!fed())return;ready=true;readyT=performance.now();clearTimeout(holdT);clearInterval(armI);if(want)go();else holdT=setTimeout(go,HOLD_MS)}
 let armI=0;
 function prime(){if(primed||st!=='title')return;primed=true;try{vIn.pause()}catch(e){}if(vIn.currentTime>.45){try{vIn.currentTime=.1}catch(e){}}armed(true)}
 function onPlaying(){if(st!=='title'||!LIVE)return;if(want&&ready&&goT)introStart();else if(!primed)prime();else{try{vIn.pause()}catch(e){}}}
 function early(e){if((st!=='title'&&st!=='intro')||!LIVE)return;const tg=e.target,ctl=!!(tg&&tg.closest&&tg.closest('a,button,input,select,textarea,.r-seg'));
  if(e.type==='keydown'){if(ctl||![' ','ArrowDown','PageDown','End','Enter'].includes(e.key))return;e.preventDefault()}else if(e.type==='wheel')e.preventDefault();else if(e.type==='touchmove'){if(e.cancelable)e.preventDefault()}else if(ctl)return;
  userGo=true;go()}
 addEventListener('wheel',early,{passive:false,capture:true});addEventListener('touchstart',early,{passive:true,capture:true});addEventListener('touchmove',early,{passive:false,capture:true});addEventListener('keydown',early,true);
 stg.addEventListener('pointerdown',early);stg.addEventListener('click',early);
 {const b=u.querySelector('.r-skip');if(b)b.addEventListener('click',e=>{e.preventDefault();if(st==='title'){userGo=true;go()}})}
 let wIn=0;vIn.addEventListener('waiting',()=>{if(st!=='intro'||vIn.currentTime<.1)return;if(full()||performance.now()-goT<1500){clearTimeout(wIn);wIn=setTimeout(()=>{if(st==='intro'&&vIn.readyState<3){SLOW=true;toStop()}},700);return}SLOW=true;toStop()});
 vIn.addEventListener('playing',()=>clearTimeout(wIn));
 function introStart(){if(st!=='title'||!LIVE)return;st='intro';onEnd(vIn,introEnd,7000);flag(vIn,'on',true);flag(u,'moving',true);pre('stop-'+HOME);const tick=()=>{if(st!=='intro')return;const t=vIn.currentTime,h=1-ss(Math.min(1,Math.max(0,(t-.55)/.45)));put(t1,'opacity',h.toFixed(3));flag(t1,'off',h<.02);veil.style.setProperty('--hv',h.toFixed(2));flag(u,'intro',t<.6);requestAnimationFrame(tick)};tick()}
 function introEnd(){if(st!=='intro'&&st!=='title')return;holdTo('stop-'+HOME).then(()=>{flag(vIn,'on',false);try{vIn.removeAttribute('src');vIn.load()}catch(e){}arrive()})}
 function toStop(){if(!LIVE){stop.scrollIntoView({block:'nearest'});return}if(st==='title'||st==='intro'){st='skip';try{vIn.pause()}catch(e){}flag(u,'fade',true);holdTo('stop-'+HOME).then(()=>{flag(vIn,'on',false);arrive();setTimeout(()=>flag(u,'fade',false),500)})}else if(st==='stop')e3glide(y0)}
 let gq=null;const pre2={};
 function glide(a,b){if(st!=='stop'&&st!=='glide'){return}if(st==='glide'){gq=[a,b];return}st='glide';card(stop._e);place();entOk=false;flag(vE,'on',false);
  if(!entOk&&ent){try{vE.removeAttribute('src');vE.load()}catch(e){}ent=null}
  pre('stop-'+b);
  if(SLOW){holdTo('stop-'+b).then(()=>{if(st==='glide'){st='stop';place()}const q=gq;gq=null;if(q)glide(q[0],q[1]);else entryLoad()});return}
  const src=vid('g-'+a+'-'+b);vG.src=src;vG.load();const to=b;let shownV=false;const show=()=>{if(shownV)return;shownV=true;flag(vG,'on',true)};
  vG.addEventListener('playing',show,{once:true});const fin=()=>{holdTo('stop-'+to).then(()=>{flag(vG,'on',false);if(st==='glide'){st='stop';place()}const q=gq;gq=null;if(q&&q[1]!==met)glide(q[0],met);else if(q)glide(q[0],q[1]);else entryLoad()})};
  const fin1=onEnd(vG,fin,SLOW?1200:2600);const p=play(vG);if(p&&p.then)p.then(null,()=>{fin1()});
  setTimeout(()=>{if(st==='glide'&&!shownV&&vG.src===new URL(src,location.href).href){SLOW=true;try{vG.pause();vG.removeAttribute('src');vG.load()}catch(e){}fin1()}},SLOW?900:1600);
  ld.textContent='';setTimeout(()=>{if(st==='glide'&&!shownV)ld.textContent='Vers la façade : '+E3[to].lab+'…'},900);const clr=()=>{if(ld.textContent.startsWith('Vers la façade'))ld.textContent=''};vG.addEventListener('playing',clr,{once:true});vG.addEventListener('ended',clr,{once:true})}
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
 function backToStop(){if(st!=='in')return;st='stop';gate='closed';rested=true;flag(end,'on',false);put(end,'opacity','0');put(sbar,'opacity','0');flag(u,'past',false);ent=null;entOk=false;flag(vE,'on',false);holdTo('stop-'+met).then(()=>{place();card(true);entryLoad()})}
 let pinned=false;function pin(on){pinned=on;const h=document.documentElement;flag(h,'r-pin',on);if(on&&COARSE)h.style.overflow='hidden';else if(!on)h.style.overflow=''}
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight);y0=walk.getBoundingClientRect().top+scrollY-hh;fit();place()};
 const curY=()=>scrollY-y0;
 function size(){const k=r0();if(k!==set){set=k;hold.src='';flag(u,'held',false);if(st==='intro'||st==='title'){try{vIn.pause()}catch(e){}flag(vIn,'on',false);holdTo('stop-'+HOME).then(()=>{if(st==='intro'||st==='title')arrive()})}else if(st==='stop'||st==='glide'){holdTo('stop-'+met);ent=null;entryLoad()}else if(st==='in')holdTo('room-'+met);else if(st==='door'){ent=null}}geo()}
 function toStill(){thumb();u.classList.add('static');poster.src=img('stop-'+HOME);poster.parentNode.querySelectorAll('source').forEach(s=>s.remove());flag(u,'intro',false);st='stop';met=met||HOME;card(true);pin(false);place()}
 function flat(){if(!LIVE)return;LIVE=false;t1.classList.remove('off');u.classList.add('nofilm');for(const el of [t1,say,stop,sbar,end,sign]){el.style.opacity='';el.style.transform=''}memo.clear();for(const v of [vIn,vG,vE]){try{v.pause();v.removeAttribute('src');v.load()}catch(e){}flag(v,'on',false)}toStill();geo()}
 E3F.then(x=>{fmt=x==='a'?'avif':'jpg';set=r0();if(!LIVE){toStill();return}if(QUICK){st='title';setTimeout(toStop,60);return}if(vIn.error||vIn.networkState===3&&!vIn.readyState){flat();return}
  vIn.addEventListener('playing',onPlaying);vIn.addEventListener('timeupdate',()=>{if(st==='title'&&!primed&&!goT&&!vIn.paused&&vIn.currentTime>0)prime()});
  setTimeout(()=>{if(st==='title'&&!ready)SLOW=true},4000);
  if(vIn.ended){primed=true;try{vIn.currentTime=.1}catch(e){}armed(true)}else if(!vIn.paused&&vIn.currentTime>0)prime();
  {const fb=()=>{if(ready||primed||st!=='title')return;if(vIn.readyState>=3||full())armed(true)};setTimeout(()=>{if(ready||primed||st!=='title')return;fb();if(!ready){vIn.addEventListener('canplaythrough',fb);vIn.addEventListener('progress',fb);armI=setInterval(fb,150)}},1500)}
  {setTimeout(()=>{if(st==='title'&&!ready)ld.textContent='Chargement de la rue…'},2500);vIn.addEventListener('playing',()=>{if(ld.textContent==='Chargement de la rue…')ld.textContent=''});setTimeout(()=>{if(st==='title'){if(vIn.readyState>=2)go(true);else if(vIn.error||vIn.networkState===3)flat();else toStop()}},12000)}
  vIn.addEventListener('error',()=>{if(st==='title')flat()},{once:true});
  const H=location.hash,deep=!!new URLSearchParams(location.search).get('e')||H==='#choix'||(H.length>1&&H!=='#top'&&!!document.getElementById(H.slice(1)));
  if(deep)setTimeout(toStop,80);else{pin(true);if(scrollY>0)scrollTo({top:0,behavior:'instant'})}});
 poster.addEventListener('error',()=>{poster.style.visibility='hidden'});
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href="#choix"]');if(!a)return;e.preventDefault();toStop()});
 end.addEventListener('focusout',e=>{if(!end.contains(e.relatedTarget))end.classList.remove('kb')});
 end.addEventListener('focusin',()=>{end.classList.add('kb')});
 stop.addEventListener('focusin',()=>{if(LIVE&&!u.classList.contains('stop'))toStop()});
 t1.addEventListener('focusin',()=>{if(LIVE&&t1.classList.contains('off')&&st==='stop'){geo();e3glide(y0)}});
 nameIn.addEventListener('focus',()=>{kbY=scrollY});
 function rel(){if(document.activeElement===nameIn){kbY=-1;nameIn.blur()}}
 let kbH=0;
 nameIn.addEventListener('blur',()=>{const was=frz;frz=false;kbH=0;stop.style.setProperty('--kb','0px');flag(stop,'kbo',false);if(was&&LIVE&&kbY>=0&&Math.abs(scrollY-kbY)>4){const y=kbY;requestAnimationFrame(()=>e3glide(y,420))}kbY=-1;zoom()});
 const vv=window.visualViewport;if(vv){const k=()=>{const o=document.activeElement===nameIn?Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop)):0;kbH=o;stop.style.setProperty('--kb',o+'px');flag(stop,'kbo',o>40);if(COARSE&&document.activeElement===nameIn)frz=true;zoom()};vv.addEventListener('resize',k);vv.addEventListener('scroll',k)}
 let zm='';
 function zoom(){let t='';if(COARSE&&kbH>40&&signQ&&document.activeElement===nameIn){const sr=stg.getBoundingClientRect(),c=signQ.c,f=signQ.f,sx=f.ox+(c[0][0]+c[1][0])/2*f.w,sy=f.oy+(c[0][1]+c[3][1])/2*f.h,sw=Math.abs(c[1][0]-c[0][0])*f.w,S=Math.min(1.6,Math.max(1,.88*sr.width/(sw||1)));
   const top=Math.max(sr.top,(vv?vv.offsetTop:0))-sr.top,bot=(vv?vv.offsetTop+vv.height:innerHeight)-72-sr.top,ty=(top+bot)/2;t=`translate(${(sr.width/2-sx).toFixed(1)}px,${(ty-sy).toFixed(1)}px) scale(${S})`;scene.style.transformOrigin=sx.toFixed(1)+'px '+sy.toFixed(1)+'px'}
  if(t!==zm){zm=t;scene.style.transform=t;flag(u,'zoom',!!t)}}
 let nudged=false,nt=0,nt0=0,tY0=-1,tX0=0,swp=false;const nudge=()=>{nudged=true;u.classList.add('push');clearTimeout(nt);nt=setTimeout(()=>u.classList.remove('push'),2000)};
 const pass1=()=>{if(st!=='stop')return;if(chosen||shown||nudged)enter();else nudge()};
 let gate='closed',lastU=0,uWin=0,pP=-1,lastW=0,rt=0,wt=0,tY=-1,w0=0,wMax=0,pt=0,rested=false;
 const rest=()=>{const y=curY();if(gate==='closed'&&y>=-6&&y<=HZ+6&&!e3touch.n&&performance.now()-lastW>350)rested=true};
 if(LIVE){
  addEventListener('scroll',()=>{const y=curY();clearTimeout(rt);rt=setTimeout(rest,320);
   if(st==='in'&&y<HZ*.5)backToStop();
   if(y<HZ*.5)nudged=false;
   if(gate==='open'||st==='title'||st==='intro'){if(pinned&&(st==='title'||st==='intro')&&scrollY>0)scrollTo({top:0,behavior:'instant'});pP=y;return}
   const user=performance.now()-lastU<uWin;
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
  addEventListener('touchend',()=>{clearTimeout(rt);rt=setTimeout(rest,320);lastU=performance.now();uWin=1600},{passive:true});
  addEventListener('keydown',e=>{if(/^(Page|Arrow|End|Home| )/.test(e.key)){lastU=performance.now();uWin=900}if(e.target===nameIn&&e.key!=='Tab')return;if(e.target.closest&&e.target.closest('.r-seg')&&/Arrow|Home|End/.test(e.key))return;if(st==='stop'&&(e.key==='PageDown'||e.key==='ArrowDown'||e.key===' '||e.key==='End')&&curY()>=-6){e.preventDefault();pass1()}},true);
  let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!LIVE||!vis||frz||e3touch.n||gate!=='closed'||st!=='stop')return;const y=curY();if(y>2&&y<=HZ+6)e3glide(y0)},260)},{passive:true});
  {let yy=scrollY;addEventListener('scroll',()=>{const d=scrollY-yy;if(Math.abs(d)>2)dn=d>0?1:-1;yy=scrollY},{passive:true})}}
 {let t0=null;stop.addEventListener('touchstart',e=>{const el=e.target.closest('a,button,input');const q=e.touches[0];t0=el&&q&&e.touches.length===1&&!e.target.closest('.r-seg')?{el,x:q.clientX,y:q.clientY,t:performance.now(),m:0}:null},{passive:true});
  stop.addEventListener('touchmove',e=>{const q=e.touches[0];if(t0&&q)t0.m=Math.max(t0.m,Math.hypot(q.clientX-t0.x,q.clientY-t0.y))},{passive:true});
  stop.addEventListener('touchend',e=>{const k=t0;t0=null;if(!k)return;const q=e.changedTouches[0];if(!q)return;const m=Math.max(k.m,Math.hypot(q.clientX-k.x,q.clientY-k.y));
   if(m>14||performance.now()-k.t>800)return;const h=document.elementFromPoint(q.clientX,q.clientY);if(!h||!(k.el.contains(h)||h.contains(k.el)))return;
   if(e.cancelable)e.preventDefault();if(k.el.tagName==='INPUT')k.el.focus();else{if(k.el!==nameIn&&!k.el.closest('.r-f'))rel();k.el.click()}},{passive:false})}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(!vis&&st==='stop'&&vE&&!vE.paused)vE.pause()},{rootMargin:'50% 0px'}).observe(walk);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(st==='title'&&want)go(true)}});
 addEventListener('resize',()=>{size()});addEventListener('pageshow',e=>{if(e.persisted)size()});
 window.__e3=()=>({st,met,set,gate,slow:SLOW,ready,want,primed,pinned,on:stop.classList.contains('on'),ent,entOk,vin:[vIn.readyState,+vIn.currentTime.toFixed(2),vIn.paused,vIn.ended],vg:[vG.readyState,+vG.currentTime.toFixed(2),vG.paused],ve:[vE.readyState,+vE.currentTime.toFixed(2),vE.paused,vE.ended],y:Math.round(curY()),held:u.classList.contains('held'),shown});
 requestAnimationFrame(()=>{geo();u.classList.add('go')});
 {const w=u.querySelector('.r-wa');if(w)new IntersectionObserver(es=>{if(!LIVE)flag(document.body,'hero-cta',es[0].isIntersecting)},{rootMargin:'-64px 0px 0px 0px'}).observe(w)}
})();
(()=>{const log=document.getElementById('log'),chips=document.getElementById('chips'),f=document.getElementById('f'),q=document.getElementById('q');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const WAL='<a href="https://wa.me/41779283540" target="_blank" rel="noopener">WhatsApp</a>';
const R=[
 {k:/ouvert|horaire|heure|ferm|ce soir|demain|dimanche|lundi|midi/,a:'Nous sommes ouverts du mardi au samedi, de 11 h 30 à 14 h et de 18 h 30 à 22 h 30. Fermé le dimanche et le lundi.\nCe soir, la cuisine prend les commandes jusqu’à 21 h 45.'},
 {k:/r[ée]serv|table|place pour|personnes|anniversaire|groupe/,a:'Avec plaisir. Pour réserver, le plus rapide est d’écrire à l’équipe sur '+WAL+' : le jour, l’heure et le nombre de personnes.\nJe ne peux pas garantir une table moi-même, c’est l’équipe qui confirme.'},
 {k:/v[ée]g|v[ée]gan|sans viande|l[ée]gume/,a:'Oui. Il y a toujours deux pâtes végétariennes, dont les tagliatelle aux cèpes, et une pizza végétarienne.\nPour un plat vegan, demandez en commandant : la cuisine adapte souvent.'},
 {k:/gluten|allerg|lactose|noix|arachide/,a:'Pour une allergie, je préfère que l’équipe vous réponde elle-même, pour être sûr. Écrivez-lui sur '+WAL+' avec votre allergie.'},
 {k:/park|parc|garer|voiture|stationn/,a:'Le parking de la Gare est à 3 minutes à pied. Le soir, des places bleues sont souvent libres dans la rue d’à côté.'},
 {k:/prix|co[uû]t|cher|combien|menu du jour|tarif/,a:'Le plat du jour est à 21.–, les pizzas de 18.– à 26.–, les pâtes de 22.– à 29.–.\nLa carte complète est sur le site, rubrique Carte.'},
 {k:/emport|livr|take|à l.emporter/,a:'Oui, tout se prend à l’emporter. Commandez par téléphone ou sur '+WAL+', et passez le chercher 20 minutes plus tard.'},
 {k:/enfant|b[ée]b[ée]|chaise|poussette/,a:'Oui, les enfants sont les bienvenus. Il y a deux chaises hautes et une petite carte pour eux.'},
 {k:/chien|animal/,a:'Les chiens sages sont acceptés en terrasse.'},
 {k:/carte|twint|paie|payer|cash|esp[eè]ce/,a:'On accepte les cartes, TWINT et les espèces.'},
 {k:/^(bonjour|salut|hello|bonsoir|coucou|hi)\b/,a:'Bonjour ! Je réponds aux questions sur la Trattoria : horaires, carte, réservation, parking…'},
 {k:/merci/,a:'Avec plaisir. À bientôt chez Nonna Pia !'}
];
const NO='Je ne suis pas sûr de la réponse, et je préfère ne pas inventer.\nL’équipe vous répond sur '+WAL+'.';
const Q=['Vous êtes ouverts ce soir ?','Je peux réserver pour 4 ?','Vous avez des plats végétariens ?','Où se garer ?','C’est combien, une pizza ?'];
const add=(t,c,html)=>{const d=document.createElement('div');d.className='m '+c;if(html)d.innerHTML=t;else d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
let busy=false;
const ask=t=>{t=t.trim();if(!t||busy)return;busy=true;add(t,'u');const r=R.find(x=>x.k.test(t.toLowerCase())||x.k.test(norm(t)));const typing=add('•••','b t');
 setTimeout(()=>{typing.remove();add(r?r.a:NO,'b',true);busy=false},RM?0:650+Math.random()*400)};
Q.forEach(x=>{const b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=()=>ask(x);chips.appendChild(b)});
f.addEventListener('submit',e=>{e.preventDefault();ask(q.value);q.value=''});
add('Bonjour ! Je suis l’assistant de la Trattoria Nonna Pia. Une question sur les horaires, la carte ou une réservation ?','b');
const chat=document.getElementById('essai');
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('[data-try]');if(!a)return;e.preventDefault();{const h=chat.closest('[hidden]');if(h){h.hidden=false;document.querySelectorAll('[data-try][aria-expanded]').forEach(b=>b.setAttribute('aria-expanded','true'))}}const m=document.querySelector('.nav-m[aria-expanded=true]');if(m)m.click();chat.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});chat.classList.remove('hey');void chat.offsetWidth;chat.classList.add('hey');if(matchMedia('(hover:hover)').matches)setTimeout(()=>q.focus({preventScroll:true}),RM?0:600);history.replaceState(null,'','#essai')});
})();
