
const WA_NUM='41764882710',MAIL='oonde.contact@gmail.com';
const $=id=>document.getElementById(id);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const WAI='<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>';
/* D'où vient la personne (?s=ig, ?s=carte…) : le premier mot du message le dit, sans cookie ni outil de mesure.
   Vous lisez la source dans chaque premier message WhatsApp. */
const SRC=(()=>{let s='';try{s=new URLSearchParams(location.search).get('s')||sessionStorage.getItem('oonde-s')||'';if(s)sessionStorage.setItem('oonde-s',s)}catch(e){}return s})();
const HELLO={ig:'Bonjour, je viens d’Instagram.',tt:'Bonjour, je viens de TikTok.',carte:'Bonjour, vous êtes passés me voir.',gbp:'Bonjour, je vous ai trouvés sur Google.'}[SRC]||'Bonjour, je viens de votre site.';
const wa=t=>'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(t);
const mail=(subject,t)=>'mailto:'+MAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(t);
/* Les messages fixes : une ligne d'où l'on vient, une ligne de ce qu'on veut, et en dernier ce qui reste à remplir (WhatsApp y met le curseur) */
const MSG={
 vit:()=>HELLO+' J’aimerais recevoir ma maquette offerte.\nMon commerce et ma commune : ',
 passe:()=>HELLO+' J’aimerais que vous passiez me montrer une maquette.\nMon commerce, ma commune et le meilleur moment : ',
 imm:()=>HELLO+' J’aimerais recevoir une première image 3D de ma façade et le prix d’un site avec une entrée en 3D.\nMon commerce et ma commune : ',
 e3:()=>HELLO+' J’aimerais recevoir une première image 3D de ma façade et le prix d’un site avec une entrée en 3D.\nMon commerce et ma commune : ',
 assist:()=>HELLO+' L’assistant m’intéresse.\nMon commerce et ma commune : ',
 vids:()=>HELLO+' J’aimerais une pub pour mon commerce.\nMon commerce et ma commune : ',
 demo:()=>HELLO+' J’ai vu la démo Les Grèves. J’aimerais une entrée en 3D pour mon lieu.\nMon commerce et ma commune : ',
 q:()=>HELLO+' J’ai une question : ',
 lieu:()=>HELLO+' J’aimerais que vous veniez voir mon lieu.\nType de lieu, commune et le meilleur moment : ',
 vid:()=>HELLO+' J’aimerais un devis pour des vidéos courtes (Instagram, TikTok).\nMon commerce et ma commune : '};
if(SRC)document.querySelectorAll('a[data-wa]').forEach(a=>{const m=MSG[a.dataset.wa];if(m)a.href=wa(m())});
document.querySelectorAll('a[data-mail]').forEach(a=>{const m=MSG[a.dataset.mail];if(m)a.href=mail(a.dataset.mail==='imm'?'L’entrée 3D : mon commerce':'Ma maquette offerte',m().replace(/\n/,'\n\n'))});
/* Mesure, seulement si Umami est branché (umami.txt) : un clic sur WhatsApp, l'e-mail ou le téléphone compte comme un contact, avec le bouton et la source */
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="https://wa.me"],a[href^="mailto:"],a[href^="tel:"]');if(a&&window.umami)try{umami.track('contact',{par:a.href.startsWith('mailto')?'e-mail':a.href.startsWith('tel')?'téléphone':'whatsapp',bouton:a.dataset.wa||a.dataset.mail||a.id||'',source:SRC||'direct'})}catch(x){}});

/* Questions : ouverture et fermeture en 220 ms (le natif ne sait pas fermer en douceur) */
document.querySelectorAll('details').forEach(d=>{const s=d.querySelector('summary');d.addEventListener('toggle',()=>{if(d.open)requestAnimationFrame(()=>d.classList.add('is'));else d.classList.remove('is')});s.addEventListener('click',e=>{e.preventDefault();
 if(d.open){d.classList.remove('is');setTimeout(()=>{if(!d.classList.contains('is'))d.open=false},RM?0:230)}else{d.open=true;requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('is')))}})});

/* Un seul bouton WhatsApp à la fois : celui de la barre du haut s'efface quand un bouton de la page est à l'écran ;
   sur téléphone, la barre du bas arrive une fois l'accueil passé, et se retire tant qu'un autre bouton est visible */
/* le menu sur téléphone */
/* au doigt, WhatsApp s'ouvre directement (sans nouvel onglet : iOS passe la main à l'application) */
if(matchMedia('(pointer:coarse)').matches)document.querySelectorAll('a[href*="wa.me"][target]').forEach(a=>a.removeAttribute('target'));
(()=>{const w=document.querySelector('.nav-sub');if(!w)return;const b=w.querySelector('.nav-sb'),t=o=>{w.classList.toggle('open',o);b.setAttribute('aria-expanded',o)};   /* « Autres services » */
 b.addEventListener('click',()=>t(!w.classList.contains('open')));w.addEventListener('focusout',e=>{if(!w.contains(e.relatedTarget)&&!matchMedia('(max-width:700px)').matches)t(false)});
 document.addEventListener('click',e=>{if(!w.contains(e.target)&&!matchMedia('(max-width:700px)').matches)t(false)});w.addEventListener('keydown',e=>{if(e.key==='Escape'&&w.classList.contains('open')){e.stopPropagation();t(false);b.focus()}})})();
(()=>{const b=document.querySelector('.nav-m'),n=document.querySelector('.nav');if(!b)return;const t=o=>{n.classList.toggle('open',o);b.setAttribute('aria-expanded',o)};
 b.addEventListener('click',()=>t(!n.classList.contains('open')));n.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>t(false)));addEventListener('keydown',e=>{if(e.key==='Escape')t(false)})})();
(()=>{const m=$('mbar'),hero=document.querySelector('[data-hero]'),seen=new Set();let past=!hero;
 const set=()=>{const p=past||document.body.classList.contains('named');document.body.classList.toggle('cta-in',seen.size>0);if(m){m.classList.toggle('on',p&&!seen.size);document.body.classList.toggle('mbar-on',p)}};
 document.addEventListener('oonde-cta',()=>set());
 if(hero)new IntersectionObserver(es=>{past=!es[0].isIntersecting;set()}).observe(hero);
 const io=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));set()},{threshold:.5,rootMargin:'-64px 0px 0px 0px'});
 document.querySelectorAll('main a.btn[href*="wa.me"]:not(.r-wa),main [data-cta]').forEach(a=>io.observe(a));set()})();

/* v20 : les entrées (.rv) : fondu + 12 px, une seule fois, à 20 % de visibilité */
(()=>{const els=document.querySelectorAll('.rv');if(!els.length)return;if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){els.forEach(e=>e.classList.add('on'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.2,rootMargin:'0px 0px -5% 0px'});els.forEach(e=>{if(e.getBoundingClientRect().top<innerHeight)e.classList.add('on');else io.observe(e)})})();
/* Les sites types : photo, cadrage, textes, prestations (les 3 premières dans l'aperçu réduit), horaires, trois couleurs nommées.
   Tout est un exemple, marqué comme tel : les vrais textes et prix viennent du commerce. */
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
const Q={coiffure:'coiffeur',ongles:'onglerie',barbier:'barbier',beaute:'institut beauté',restaurant:'restaurant',boulangerie:'boulangerie',fleuriste:'fleuriste',garage:'garage',artisan:'menuisier',autre:'commerce'};   /* ce que les clients tapent sur Google */
const TOWNS=['Genève','Coppet','Nyon','Rolle','Morges','Lausanne','Pully','Vevey','Montreux'];
const slug=n=>(n||'votre-commerce').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'votre-commerce';
/* Le site type, dessiné à taille réelle (1120 × 700 ou 390 × 832) puis réduit à l'échelle du cadre */
function site(el,key,s,layout){const t=T[key]||T.autre,[c,ct]=t.styles[s.style]||t.styles[0],name=esc(s.name||'Votre commerce'),town=esc(s.town||'');
 const h=s.town?t.h.replace('{t}',s.town):t.h.replace(/ (à|de) \{t\}/,'');
 el.innerHTML=`<div class="tpl ${layout}" style="--c:${c};--ct:${ct}">
  <header class="tn"><b>${name}</b><nav><span>${esc(t.sec)}</span><span>Horaires</span><span>Contact</span></nav><span class="tb">${WAI}WhatsApp</span></header>
  <div class="th${t.photo?'':' solid'}"${t.photo?` style="background-image:url(${t.photo});--bp:${t.bp||'50% 50%'}"`:''}><div class="th-in"><span class="tt">${esc(t.label)}${town?' · '+town:''}</span><strong>${s.name?name:esc(h)}</strong><p>${s.name?esc(h)+' ':''}${esc(t.sub)}</p><div class="th-act"><span class="tb">${WAI}${esc(t.cta)}</span><span class="to"><i></i>${esc(t.open)}</span></div></div></div>
  <div class="tg"><div class="tl"><div class="tk">${esc(t.sec)}</div>${t.rows.slice(0,3).map(([a,b])=>`<div class="tr"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('')}</div>
   <div class="ti"><div class="tk">Horaires</div><p>${t.hours}</p><div class="tgo"><i></i>Avis Google · Itinéraire${town?' · '+town:''}</div></div></div>
  <div class="tfoot"><span class="tb">${WAI}${esc(t.cta)}</span></div></div>`;fit(el)}
function fit(el){const n=el.firstElementChild;if(!n)return;const w=n.classList.contains('d')?1120:390;n.style.transform=`scale(${el.clientWidth/w})`}
/* L'adresse de l'aperçu en grand : tout ce qui a été choisi tient dans l'adresse, rien n'est envoyé nulle part */
const apercuUrl=(base,s)=>{const p=new URLSearchParams();if(s.name)p.set('n',s.name);p.set('m',s.act||'coiffure');if(s.town)p.set('v',s.town);if(s.style)p.set('c',s.style);return base+'#'+p}

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
function e3pack(url,signal){return fetch(url,signal?{signal}:undefined).then(r=>{if(!r.ok)throw r.status;return r.text()})
 .then(t=>fetch('data:application/octet-stream;base64,'+t).then(r=>r.arrayBuffer()).catch(()=>{const b=atob(t),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer}))
 .then(buf=>{const v=new DataView(buf),hl=v.getUint32(0,true),head=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,hl)));
  return head.map(([i,o,l])=>[i,new Blob([new Uint8Array(buf,4+hl+o,l)],{type:'image/webp'})])})}
function e3film(n,R,at,onimg){const bl=new Array(n),bm=new Array(n),bz=new Uint8Array(n);let act=0,on=true,dir=1,par=4;   /* par : décodages en parallèle (8 pendant un glissement) */
 const free=i=>{const m=bm[i];bm[i]=null;if(!m)return;if(m.close)m.close();else URL.revokeObjectURL(m.src)};
 const asImg=b=>{const m=new Image();m.src=URL.createObjectURL(b);return m.decode().then(()=>m,()=>{URL.revokeObjectURL(m.src);return null})};
 const dec=i=>{bz[i]=1;act++;(window.createImageBitmap?createImageBitmap(bl[i]).catch(()=>asImg(bl[i])):asImg(bl[i])).catch(()=>null).then(m=>{act--;bz[i]=0;
  if(m){bm[i]=m;if(on&&!out(i))onimg(i);else free(i)}pump()})};
 /* la fenêtre décodée regarde devant : 1,5 R dans le sens du mouvement, 0,5 R derrière (même mémoire qu'avant, ±R) */
 const out=i=>{const a=dir>0?i-at:at-i;return a>Math.round(R*1.5)+6||a<-Math.round(R*.5)-6};
 function pump(){if(!on)return;for(let i=0;i<n;i++)if(bm[i]&&out(i))free(i);const A=Math.round(R*1.5),Bk=Math.round(R*.5);
  for(let d=0;d<=A&&act<par;d++)for(const i of d?(d<=Bk?[at+d*dir,at-d*dir]:[at+d*dir]):[at])if(i>=0&&i<n&&bl[i]&&!bm[i]&&!bz[i]&&act<par)dec(i)}
 return{n,get:i=>bm[i],any:()=>bl.some(Boolean),boost(k){par=k;pump()},
  /* v20.1 : de a à b, les fichiers sont-ils là (jamais deux images manquantes de suite) ? sinon le film attendrait un paquet encore en route */
  dl(a,b){a=clamp(Math.round(a),0,n-1);b=clamp(Math.round(b),0,n-1);const s=b>a?1:-1;for(let k=a;k!==b;k+=s){const j=k+s;if(!bl[j]&&(j===b||!bl[j+s]))return false}return true},
  near(f){const r=clamp(Math.round(f),0,n-1);for(let d=0;d<n;d++){if(r-d>=0&&bm[r-d])return r-d;if(r+d<n&&bm[r+d])return r+d}return r},add(i,b){bl[i]=b;pump()},
  seek(f){const i=clamp(Math.round(f),0,n-1);if(i!==at){dir=i>at?1:-1;at=i;pump()}},
  /* jusqu'où l'on peut aller de f vers t sans trou de plus d'une image (deux images décodées au plus l'une de l'autre) */
  reach(f,t){let k=clamp(Math.round(f),0,n-1);const s=t>f?1:-1,e=clamp(t,0,n-1);if(!bm[k])return f;while(s>0?k<e:k>e){const a=k+s,b=k+2*s;if(a>=0&&a<n&&bm[a])k=a;else if(b>=0&&b<n&&bm[b]&&(s>0?b<=Math.ceil(e)+1:b>=Math.floor(e)-1))k=b;else break}return s>0?Math.min(t,k):Math.max(t,k)},
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

/* v19 : la démo, c'est la rue. Le nom et le métier choisis à l'arrêt suivent la caméra dans la salle (le nom au mur du fond),
   jusqu'à la fin du site (le bouton du métier, marqué Démo), puis dans les rubriques du site, plus bas (#entree) :
   horaires, prix, photos de la salle. Ce module tient l'état (métier, nom, couleur) ; rue.js le lit et le change (E3S.set). */
const E3IN={d:[22,38,55],m:[26,44,63]};   /* les photos du site : trois images de la salle (entree3d, ?int=) */
const e3in=k=>'img/e3d/in-'+k+'/';
const E3S=(()=>{const st={sc:'restaurant',name:'',style:0,styleSet:false,touched:false};
 const sec=$('entree'),u=$('univers');let ph='';
 const sty=()=>{const s=E3[st.sc];return s.lodge?['#3D4A52','#fff','ardoise']:T[s.t].styles[st.style]};
 /* le message WhatsApp : ce que la personne a tapé et choisi, rien d'autre */
 function msg(){const s=E3[st.sc],t=s.lodge?null:T[s.t];if(!st.touched)return MSG.imm();
  const what=s.lodge?'logement':t.noun,col=st.styleSet&&t?', couleur '+sty()[2]:'';
  return `${SRC?HELLO+' J’ai':'Bonjour, j’ai'} essayé l’entrée 3D sur votre site. J’aimerais recevoir une première image 3D et le prix pour ${st.name?'mon commerce':'mon '+what}.\n${st.name?st.name+', '+what+col+'.\n':''}Ma commune : `}
 const txt=(id,v)=>{const e=$(id);if(e&&e.textContent!==v)e.textContent=v};
 function paint(){const s=E3[st.sc],t=s.lodge?null:T[s.t],[c,ct,cn]=sty(),name=st.name||'Votre commerce',lab=s.lodge?'Logement':t.label;
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
  const l=st.name?'Aperçu 3D pour '+(st.name.length>18?st.name.slice(0,17)+'…':st.name):'Recevoir mon aperçu 3D';document.querySelectorAll('[data-e3l]').forEach(n=>n.textContent=l);
  const se=$('eSel');if(se)se.value=st.sc;
  const bs=$('eStyle');if(bs){bs.parentNode.hidden=!!s.lodge;if(!s.lodge){if(bs.dataset.t!==st.sc){bs.dataset.t=st.sc;bs.innerHTML=T[s.t].styles.map(([c,,n],i)=>`<button type="button" role="radio" aria-label="${esc(n)}" style="--g:${c}" data-i="${i}"></button>`).join('')}
   [...bs.children].forEach((b,i)=>{b.setAttribute('aria-checked',i===st.style);b.tabIndex=i===st.style?0:-1});txt('eStyleN',cn)}}
  if(st.touched)try{localStorage.setItem('oonde-e3',JSON.stringify({sc:st.sc,name:st.name,style:st.style,s:st.styleSet}))}catch(e){}
  document.dispatchEvent(new CustomEvent('oonde-e3',{detail:{name:st.name,t:s.t||'',sc:st.sc}}))}
 /* les photos de la salle : trois images de son film (deux sur téléphone) ; leur place est tenue d'avance (width/height), le navigateur ne les charge qu'à l'approche (loading=lazy) */
 function photos(){const box=$('ePh');if(!box)return;const k=innerWidth<innerHeight*.95?'m':'d',key=st.sc+k;if(ph===key)return;ph=key;
  box.innerHTML=E3IN[k].slice(0,k==='m'?2:3).map((i,j)=>`<img src="${e3in(st.sc)}${k}/f0${String(i).padStart(2,'0')}.webp" width="${k==='m'?540:1280}" height="${k==='m'?960:800}" alt="${j?'':'Démo : la salle, vue depuis l’entrée'}" loading="lazy" decoding="async">`).join('')}
 function set(o){let ch=false;if(o.sc&&E3[o.sc]&&o.sc!==st.sc){st.sc=o.sc;st.style=0;st.styleSet=false;ch=true}
  if(typeof o.name==='string'){const n=o.name.trim().slice(0,40);if(n!==st.name){st.name=n;ch=true}}
  if(Number.isInteger(o.style)){st.style=clamp(o.style,0,2);st.styleSet=true;ch=true}
  if(ch||o.force){if(!o.quiet)st.touched=true;paint()}}
 /* un lien préparé (?e=restaurant&n=Chez%20Marco&c=1) remplit l'essai ; sinon, la dernière visite */
 {const q=new URLSearchParams(location.search);let m={};
  if(q.get('e'))m={sc:q.get('e'),name:q.get('n')||'',style:+q.get('c')||0,s:q.has('c')};else try{m=JSON.parse(localStorage.getItem('oonde-e3')||'{}')}catch(e){}
  if(E3[m.sc]){st.sc=m.sc;st.touched=true}if(typeof m.name==='string'&&m.name){st.name=m.name.slice(0,40);st.touched=true}
  if(Number.isInteger(m.style))st.style=clamp(m.style,0,2),st.styleSet=!!m.s}
 if(sec){const se=$('eSel');if(se){se.innerHTML=E3K.map(k=>`<option value="${k}">${E3[k].lab}</option>`).join('');se.addEventListener('change',()=>set({sc:se.value}))}
  const bs=$('eStyle');bs.addEventListener('click',e=>{const b=e.target.closest('button');if(b)set({style:+b.dataset.i})});
  bs.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();set({style:(st.style+(e.key==='ArrowRight'?1:2))%3});bs.children[st.style].focus()});
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
  get(0).then(()=>{clearTimeout(slow);ld.textContent='';s.p0=true;dirty=true;tick();return get(1)}).then(()=>{s.p3=()=>{s.p3=null;get(3).catch(()=>{})};s.p2=()=>{s.p2=null;get(2).then(more,()=>{s.loose=true;dirty=true;tick()})};more()},   /* v21.1 : avant tout geste, p0 et p1 seulement (une image sur quatre, comme en v20) ; p2 au premier geste, puis p3. Une image pas encore là : le film l'attend (reach), il ne la saute pas */()=>{clearTimeout(slow);ld.textContent='';if(!s.film.any()){flat();return}s.loose=true;dirty=true;tick()})   /* p1 ou p2 absents : le film joue avec ce qu'il a (images plus espacées) plutôt que de rester figé */   /* p3 (les images impaires, le plus lourd) : seulement si l'on avance vraiment */
   .catch(()=>{clearTimeout(slow);ld.textContent='';if(!s.film.any())flat()})}
 function more(){const s=store[set];if(!s||!(P>.4||moved))return;if(s.p2)s.p2();else if(s.p3)s.p3()}   /* p3 : dès que la personne bouge (ou si elle arrive plus bas) */
 let armT=0;const arm=()=>{if(armed)return;armed=true;armT=performance.now();load(set)};
 /* v21.1 : la rue a ses premières images (ou n'en aura pas) : avant, le mur de l'arrêt reste fermé, même pour un nouveau geste */
 const rdy=()=>{const s=store[set];return !LIVE||!!(s&&(s.p0||s.loose))||armed&&performance.now()-armT>12000};
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
  if(push)E3S.set({sc:k});if(cv.width&&(mode||inA>.02&&!push))snap();   /* v21.1 : choisi à l'arrêt, le glissement part tout de suite (pas de fondu de 0,35 s par-dessus) */wall();if(push)goMet(k);dirty=true;tick()}   /* need() suit, dans la boucle */
 for(const el of [seg,rsel])for(const ev of ['pointerdown','touchstart','focusin'])el.addEventListener(ev,()=>{if(store[set]&&store[set].p0&&va[set])loadVa(set,4)},{passive:true});   /* v21.1 : le reste du glissement part dès le début du toucher (p2, p3) */
 seg.addEventListener('click',e=>{const b=e.target.closest('button');if(b){if(b.dataset.m===met)goMet(met);else metier(b.dataset.m,true)}});   /* v21 : le métier déjà choisi : on va devant sa façade */
 seg.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const bs=[...seg.children],i=bs.findIndex(b=>b.dataset.m===met),n=bs[(i+(/Right|Down/.test(e.key)?1:bs.length-1))%bs.length];metier(n.dataset.m,true);n.focus()});
 rsel.addEventListener('change',()=>metier(rsel.value,true));
 document.addEventListener('oonde-e3',e=>{metier(e.detail.sc,false);if(e.detail.name&&!nameIn.value){nameIn.value=e.detail.name;named(e.detail.name,false)}wall()});
 /* v21 : choisir un métier à l'arrêt : la caméra glisse jusqu'à sa façade */
 function goMet(k){rel();if(!LIVE||!(k in FAC)||!W)return;const p=(hh-walk.getBoundingClientRect().top)/D;if(p<HOLD[0]-.02||p>GATE[1]+.01)return;
  went=true;loadVa(set,4);glideTo(FAC[k])}
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
 function draw(f){const v=vaS();if(v&&Math.abs(vx-HOME)>.01&&drawVa(v))return;const s=store[set];if(!W||!H||!s)return;const n=SETS[set];f=clamp(f,0,n-1);s.film.seek(f);const r=s.film.pair(f);if(!r)return;const[i0,i1,a]=r;const far=Math.min(Math.abs(i0-f),Math.abs(i1-f));if(!s.loose&&far>1.01&&(far>=Math.abs((shF<0?S0[set]:shF)-f)-1||performance.now()-lastS<1500))return;   /* jamais une image plus lointaine que celle qu'on voit déjà (l'affiche = S0) ; v20.1 : réseau lent, on se rapproche par étapes au lieu de rester sur l'affiche */shF=far>1.01?(Math.abs(i0-f)<Math.abs(i1-f)?i0:i1):f;if(window.__rd)__rd.push([i0,i1,+a.toFixed(2)]);
  const b=paintPair(s.film,r,1);
  /* à l'arrêt : la salle du métier choisi s'allume derrière la vitrine (la première image de la suite, même cadrage) */
  const z=inCur(),z0=z&&z.film.get(0);if(z0&&inA>.003){const c=cover(z0);cx.globalAlpha=inA;cx.drawImage(z0,c.ox,c.oy,c.w,c.h);cx.globalAlpha=1}
  if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;
  const d=W/SW,p=s.pins&&s.pins[i0]?s.pins[i0].p:0;place(e3mix(pinAt(s,i0),pinAt(s,i1),a),fit2(b,d),p);
  if(z0&&inA>.5&&z.pins)e3place(rwall,z.pins[0].pins,fit2(b,d));else e3place(rwall,null,null)}
 /* v21 : à l'arrêt, ailleurs que devant la vôtre : le glissement ; la salle s'allume de même derrière la vitrine de la façade choisie */
 function drawVa(v){if(!W||!H)return false;if(!vg||vg.t0)v.film.seek(vx);const r=v.film.pair(vx);if(!r)return false;const[i0,i1,a]=r;if(window.__rv)__rv.push([Math.round(performance.now()),+vx.toFixed(2),i0,i1,+a.toFixed(2),+xa.toFixed(2)]);const b=paintPair(v.film,r,1);
  const z=inCur(),z0=z&&z.film.get(0);if(z0&&inA>.003){const c=cover(z0);cx.globalAlpha=inA;cx.drawImage(z0,c.ox,c.oy,c.w,c.h);cx.globalAlpha=1}
  if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;const d=W/SW;place(remap(e3mix(pinAt(v,i0),pinAt(v,i1),a)),fit2(b,d),0);
  if(z0&&inA>.5&&z.pins)e3place(rwall,z.pins[0].pins,fit2(b,d));else e3place(rwall,null,null);return true}
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
 const inKey=()=>met+set+(went?'a':''),inCur=()=>{const z=ins[inKey()];return z&&!z.bad?z:null};
 function inGet(k,g){const z=ins[k];return e3pack(e3in(z.m)+z.k+'/p'+g+'.txt',z.ac.signal).then(l=>l.forEach(([i,b])=>z.film.add(i,b)))}
 function need(lv){if(!LIVE||!met||!W||!(store[set]&&store[set].p0))return;   /* v21.1 : l'ordre : la rue (p0), puis la salle du métier choisi (p0), puis le glissement (p0) */if(lv===undefined)lv=cQ>0||gate==='open'&&cP>HOLD[0]?4:gate==='rested'||cP>=HOLD[0]-.02?3:cP>.45?1:0;if(!lv)return;
  const k=inKey();let z=ins[k];
  for(const j in ins)if(j!==k){const y=ins[j];if(y.film)y.film.sleep();if(y.req>y.got){y.gen++;y.req=y.got;y.ac.abort();y.ac=new AbortController()}}   /* v21.1 : le métier quitté : ses paquets en route sont annulés (on reprendra où il en était) */
  if(!z){z=ins[k]={m:met,k:set+(went?'a':''),n:INS[set],req:0,got:0,gen:0,ac:new AbortController(),pins:null,chain:Promise.resolve(),film:e3film(INS[set],24,0,()=>{if(k===inKey()){dirty=true;tick()}})};
   fetch(e3in(met)+z.k+'/pins.json').then(r=>r.json()).then(j=>{z.pins=j;dirty=true;tick()}).catch(()=>{})}
  else z.film.wake();
  while(z.req<lv){const g=z.req++,gen=z.gen;z.chain=z.chain.then(()=>{if(z.gen!==gen)return;return inGet(k,g).then(()=>{if(z.gen===gen)z.got=g+1})}).catch(()=>{if(z.gen!==gen)return;if(g===0){z.bad=true;if(went&&k===inKey())home();dirty=true;tick()}})}   /* la porte de la façade absente : retour devant la vôtre, sa porte à elle */
  if(lv>=3&&met&&cQ<.1&&cP>.4&&(z.got>0||z.bad))loadVa(set,z.got>=2||z.bad?3:2)}   /* v21.1 : p2 du glissement (une image sur deux) après p1 de la salle : le glissement part au toucher ; p3 au toucher */   /* v21 : à l'arrêt, le glissement se prépare (une image sur quatre : toutes les façades) */
 /* le rythme, en images : un temps sur le globe, le tour et la rue d'un seul geste, l'arrêt devant l'enseigne, puis la suite.
    La vitesse monte et descend en douceur (trapèze) : pas de départ ni d'arrêt sec. */
 const trap=(x,a,b,ra,rb)=>{const L=b-a,t=clamp(x-a,0,L),v=1/(L-ra/2-rb/2);return t<ra?v*t*t/(2*ra):t<=L-rb?v*(ra/2+t-ra):1-v*(L-t)**2/(2*rb)};
 const S0={d:74,m:60};
 /* v21 : le glissement d'une façade à l'autre (img/e3d/va/<jeu>/, entree3d ?va=1) : 73 images à la pose de l'arrêt, une façade toutes les 12.
    Choisir un métier à l'arrêt y conduit la caméra (0,8 à 1,2 s), le nom passe sur son enseigne, et la porte est la sienne (in-<métier>/<jeu>a/). */
 const FAC={restaurant:0,boulangerie:12,coiffure:24,institut:36,onglerie:48,logement:72},HOME=60,VAN=73,va={};let vx=HOME,went=false,vg=null,vaWas=false;
 const vaS=()=>{const v=va[set];return v&&!v.bad&&v.film.any()?v:null};
 function loadVa(k,lv){if(!LIVE)return;let v=va[k];if(!v){v=va[k]={req:0,pins:null,chain:Promise.resolve(),film:e3film(VAN,32,Math.round(vx),()=>{if(k===set){dirty=true;tick()}})};
   fetch('img/e3d/va/'+k+'/pins.json').then(r=>r.json()).then(j=>{v.pins=j;dirty=true;tick()}).catch(()=>{})}else v.film.wake();
  while(v.req<lv){const g=v.req++;v.chain=v.chain.then(()=>e3pack('img/e3d/va/'+k+'/p'+g+'.txt').then(l=>{l.forEach(([i,b])=>v.film.add(i,b));v.got=g+1;dirty=true;tick()})).catch(()=>{if(g===0){v.bad=true;if(k===set&&went)home();dirty=true;tick()}})}}
 const vdur=(a,b)=>{const d=Math.abs(b-a);return d>=36?1400:800+d/36*500};   /* v21.1 : les longs trajets (3 façades et plus) prennent 1,4 s : le décodage suit */
 function glideTo(x){if(Math.abs(x-vx)<.01&&!vg)return;const v=vaS();vg={a:vx,b:x,t0:v&&v.film.dl(vx,x)?performance.now():0,q:performance.now(),dur:vdur(vx,x)};if(v){v.film.seek(vx+Math.sign(x-vx));v.film.boost(8)}dirty=true;tick()}
 function home(){went=false;glideTo(HOME)}
 /* le nom va sur l'enseigne de la façade choisie ; celle de l'arrêt (la vôtre) reste vide */
 const remap=pp=>pp&&went?pp.map(q=>q.id==='sign'?{...q,id:'_t'}:q.id===met?{...q,id:'sign'}:q):pp;   /* v20.1 : on part dans la rue, le réverbère du logo déjà sorti du cadre (de 62 à 73, son globe coupé filait au bord en quelques images : « les lampadaires au début ») ; build.py ne livre que les images à partir d'ici */
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
  says.forEach((el,j)=>{const w=W3[j],o=w?fade(...w):mode?fq(.03,.07,.15,.21):0,a0=w?w[0]:.03,b0=w?w[1]:.07,x=w?cP:cQ;put(el,'opacity',o.toFixed(3));put(el,'transform',`translateY(${((1-ss(clamp((x-a0)/(b0-a0),0,1)))*14).toFixed(1)}px)`)});
  /* la barre de l'arrêt : là sur toute la zone de l'arrêt ; elle ne part qu'une fois le portail franchi, dès les premiers pas vers la porte */
  const e=frz?1:ss(Math.min(clamp((cP-GATE[0]+.05)/.05,0,1),clamp((.06-cQ)/.045,0,1)));put(stop,'opacity',e.toFixed(3));put(stop,'transform',`translateY(${((1-e)*14).toFixed(1)}px)`);
  flag(stop,'on',e>.02);flag(u,'stop',e>.5);flag(u,'past',cQ>.005);   /* jamais inert : on l'atteint au clavier (voir focusin plus bas) */
  /* dans la salle : la barre du site du commerce, puis sa fin (le bouton du métier) */
  put(sbar,'opacity',(mode?ss(clamp((cQ-.3)/.1,0,1)):0).toFixed(3));   /* v21.1 : le titre de la salle et sa barre attendent ses images (réseau lent : pas de « Un fauteuil vous attend » sur la façade) */
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
  /* v21 : le glissement avance avec le temps (une vraie caméra qui longe la rue) ; on repart vers la rue : retour devant la vôtre d'abord */
  if(went&&cP<HOLD[0]-.01)home();
  {const v=vaS();if(vg&&v&&!vg.t0&&!v.film.dl(vg.a,vg.b)&&performance.now()-vg.q>(v.got>=3?0:900)){v.film.seek(vg.b);if(v.film.get(Math.round(vg.b))){if(painted)snap();vx=vg.b;vg=null;dirty=true}}   /* v21.1 : réseau lent (des images manquent en route) : pas de diaporama, un fondu vers la façade d'arrivée */
   if(vg&&v&&!vg.t0&&v.film.dl(vg.a,vg.b)){vg.t0=now;v.film.seek(vx+Math.sign(vg.b-vx));v.film.boost(8)}
   if(vg&&v&&vg.t0){const t=clamp((now-vg.t0)/vg.dur,0,1),e=trap(t,0,1,.06,.42);vx=vg.a+(vg.b-vg.a)*e;if(t>=1){vx=vg.b;vg=null;v.film.boost(4)}dirty=true}
   else if(vg&&!went&&(!va[set]||va[set].bad)){vx=HOME;vg=null}
   const on=!!v&&Math.abs(vx-HOME)>.01;if(vaWas&&!on&&painted)snap();vaWas=on}
  const k1=k1Of();if(cQ>.12&&cF<k1-.5&&inCur()&&inCur().film.get(0)){snap();cF=tF=k1;dirty=true}
  /* la salle s'allume à l'arrêt (la caméra posée, sa première image prête) ; s'éteint si l'on repart vers la rue */
  const z=inCur(),atStop=Math.abs(cF-k1)<.5&&cP>=HOLD[0]-.01&&!vg&&Math.abs(vx-(went?FAC[met]:HOME))<.05,ia=atStop&&z&&z.film.get(0)?1:0;
  if(inA!==ia){inA+=(ia-inA)*(1-Math.exp(-dt/.16));if(Math.abs(ia-inA)<.004)inA=ia;dirty=true}
  /* la suite : son image suit la position, sans trou, comme la rue */
  let tI=inOf(cQ);if(z&&cF>=k1-.5&&mode===1)cI=follow(z.film,cI,rest?Math.round(tI):tI,dt,rest);else cI=0;   /* la salle part de sa première image (celle de l'arrêt), une fois qu'elle a la main */
  const want=(cQ>.0005||cI>.02)&&cF>=k1-.5&&!vg?1:0;   /* la salle ne prend la main qu'une fois la rue à l'arrêt (un lancer qui bute sur le mur ne montre pas la salle au milieu de la rue) */
  if(want&&z&&z.film.get(Math.round(cI))){if(!mode&&inA<.95)snap();mode=1}else if(!want&&mode){mode=0;if(inA<.95)snap()}else if(want&&!z&&ins[inKey()]&&ins[inKey()].bad)mode=2;else if(!want)mode=0;
  if(xa>0){xa=Math.max(0,xa-dt/.35);dirty=true}
  if(mode===1){if(dirty||cI!==lastI){if(!drawIn(cI))draw(cF);lastI=cI;last=-1}}
  else if(mode===2){const n=SETS[set],f=k1+(n-1-k1)*clamp(cQ/END,0,1);if(dirty||f!==last){draw(f);last=f}}   /* secours : la porte de la rue */
  else if(dirty||cF!==last){draw(cF);last=cF;lastI=-1}
  /* une seule grande série d'images décodées à la fois : la rue dort dans la salle, la salle dort loin de l'arrêt */
  if(s0){if(cQ>.12||went&&!vg&&Math.abs(vx-HOME)>12)s0.film.sleep();else if(vis)s0.film.wake()}   /* v21.1 : devant une autre façade, la rue dort (la mémoire va au glissement) */if(z&&cP<.4)z.film.sleep();{const v=va[set];if(v&&(cP<.4||cQ>.12))v.film.sleep()}
  ui();if(!frz&&(cP!==P||cF!==tF||Math.abs(cI-tI)>.004&&z||inA!==ia||xa>0||vg))tick();else t0=0}
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
 function enter(){rel();arm();geo();open(3000);need(4);if(LIVE)e3glide(yQ(END),1900);else end.scrollIntoView({block:'nearest'})}
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
 function rel(){if(document.activeElement===nameIn){kbY=-1;nameIn.blur()}}   /* v21.1 : une action (Entrer, un métier) rend le focus du champ, sans revenir là où l'on était avant la frappe */
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
   else if((gate!=='open'||!rdy()&&performance.now()>pass&&pP<=GATE[1]+.01)&&pP>=0&&p>GATE[1]+.002&&!e3gliding()){geo();scrollTo({top:yAt(GATE[1]),behavior:'instant'});pP=GATE[1];
    if(COARSE){const h=document.documentElement;h.style.overflow='hidden';setTimeout(()=>{h.style.overflow=''},160)}return}   /* le mur ; au doigt, l'élan est coupé */
   pP=p},{passive:true});
  addEventListener('wheel',e=>{const t=performance.now(),quiet=t-lastW>350;lastW=t;if(e.deltaY<=0)return;
   if(gate==='rested'&&quiet){open();return}
   if((gate!=='open'||!rdy()&&performance.now()>pass)&&curP()>=GATE[1]-.012&&curP()<GATE[1]+.05){e.preventDefault();   /* l'inertie bute sur le mur ; quand elle s'éteint, on se pose à l'arrêt */
    if(quiet||!w0||!rdy()){w0=t;wMax=0}wMax=Math.max(wMax,e.deltaY);u.classList.add('push');clearTimeout(pt);pt=setTimeout(()=>u.classList.remove('push'),2600);
    if(t-w0>1200&&e.deltaY>=Math.max(4,wMax*.6)){w0=0;u.classList.remove('push');open();return}   /* roulette tenue ~1,2 s (pas l'élan qui s'éteint) : on continue */
    clearTimeout(wt);wt=setTimeout(()=>{if(gate!=='open'&&Math.abs(curP()-STOP)>.012){geo();e3glide(yAt(STOP))}},300)}},{passive:false});   /* l'inertie du pavé tactile bute sur le mur */
  {const mb=u.querySelector('.r-more');if(mb)mb.addEventListener('click',()=>{u.classList.remove('push');open(1500);e3glide(scrollY+innerHeight*.7)})}
  addEventListener('touchstart',e=>{tY=e.touches[0]?e.touches[0].clientY:-1;if(gate==='rested')open()},{passive:true,capture:true});
  addEventListener('touchmove',e=>{const y=e.touches[0]?e.touches[0].clientY:-1;const up=tY>=0&&y<tY;tY=y;if((gate!=='open'||!rdy()&&performance.now()>pass)&&up&&e.cancelable&&curP()>=GATE[1]-.004&&curP()<GATE[1]+.05)e.preventDefault()},{passive:false});
  addEventListener('touchend',()=>{clearTimeout(rt);rt=setTimeout(rest,320)},{passive:true});
  addEventListener('keydown',e=>{if(e.target===nameIn&&e.key!=='Tab')return;if(gate==='rested'||['Tab','End','Home'].includes(e.key))open()},true);
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('a[href*="#"]:not([href="#choix"]),.r-enter'))open(3000)},true)}
 /* à l'arrêt, au doigt : un tap qui bouge un peu (jusqu'à 14 px) reste un tap ; le navigateur, lui, l'aurait pris pour un défilement */
 {let t0=null;stop.addEventListener('touchstart',e=>{const el=e.target.closest('a,button,input');const q=e.touches[0];t0=el&&q&&e.touches.length===1?{el,x:q.clientX,y:q.clientY,t:performance.now(),m:0}:null},{passive:true});
  stop.addEventListener('touchmove',e=>{const q=e.touches[0];if(t0&&q)t0.m=Math.max(t0.m,Math.hypot(q.clientX-t0.x,q.clientY-t0.y))},{passive:true});
  stop.addEventListener('touchend',e=>{const k=t0;t0=null;if(!k)return;const q=e.changedTouches[0];if(!q)return;const m=Math.max(k.m,Math.hypot(q.clientX-k.x,q.clientY-k.y));
   if(m>14||performance.now()-k.t>800)return;const h=document.elementFromPoint(q.clientX,q.clientY);if(!h||!(k.el.contains(h)||h.contains(k.el)))return;
   if(e.cancelable)e.preventDefault();if(k.el.tagName==='INPUT')k.el.focus();else{rel();k.el.click()}},{passive:false})}   /* v21.1 : le clavier encore ouvert : le champ rend le focus avant (sinon la scène reste figée, frz) */
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

