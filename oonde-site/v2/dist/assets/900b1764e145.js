
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

/* Les films (rue et démo). Les paquets (build.py, pack()) : en binaire (.bin, dist) ou en base64 (.txt, l'aperçu claude.ai) ;
   fetch(data:) décode le base64 hors du fil principal (atob en secours). v22 : chaque paquet existe en AVIF et en WebP
   (E3M, posé par build.py : le nom logique d'un paquet → ses fichiers) ; AVIF si le navigateur le décode, WebP sinon.
   Chaque image reste compressée (Blob) ; seules les images proches de celle affichée sont décodées
   (createImageBitmap, lui aussi hors du fil principal), les autres sont libérées (close) : la mémoire reste petite. */
const E3F=(()=>{try{const b=Uint8Array.from(atob('AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAACIAAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgQAMAAAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAqbWRhdBIACggYADbICGg0IDIUHEeHhd3AACwAACDsJLhGXp8ww9A='),c=>c.charCodeAt(0));
 return window.createImageBitmap?createImageBitmap(new Blob([b],{type:'image/avif'})).then(m=>{if(m.close)m.close();return 'a'},()=>'w'):Promise.resolve('w')}catch(e){return Promise.resolve('w')}})();
/* le corps d'une réponse, lu au fil de l'eau : hd() quand il en reste peu (≈ un aller-retour en 4G lente), pour que le paquet suivant parte
   à temps sans partager la bande passante avec celui-ci ; sans longueur connue, hd() à la fin */
function e3body(r,hd,pr){const n=+r.headers.get('content-length')||0;if(!hd||!n||!r.body||!r.body.getReader)return r.arrayBuffer().then(b=>{if(hd)hd();return b});
 const rd=r.body.getReader(),cs=[];let got=0,fired=false;const step=()=>rd.read().then(({done,value})=>{if(done){if(!fired)hd();const a=new Uint8Array(got);let o=0;for(const c of cs){a.set(c,o);o+=c.length}return a.buffer}
  cs.push(value);got+=value.length;if(pr)pr(Math.min(got,n),n);if(!fired&&n-got<48e3){fired=true;hd()}return step()});return step()}
function e3pack(url,signal,type,pre,hd,pr){return (pre||fetch(url,signal?{signal}:undefined)).then(r=>{if(!r.ok){if(hd)hd();throw r.status}return e3body(r,hd,pr)})
 .then(b=>/\.bin$/.test(url)?b:(t=>fetch('data:application/octet-stream;base64,'+t).then(r=>r.arrayBuffer()).catch(()=>{const s=atob(t),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a.buffer}))(new TextDecoder().decode(b)))
 .then(buf=>{const v=new DataView(buf),hl=v.getUint32(0,true),head=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,hl)));
  return head.map(([i,o,l])=>[i,new Blob([new Uint8Array(buf,4+hl+o,l)],{type:type||'image/webp'})])})}
/* v22 : un paquet par son nom logique (« w/m/L0 », « in-coiffure/ma/p1 ») : AVIF d'abord si possible, WebP en secours */
function e3get(k,signal,hd,pr){const f=(window.E3M||{})[k];if(!f)return Promise.reject('?'+k);
 const E=window.E3P||{},pre=f.a&&E[f.a];if(pre)delete E[f.a];   /* le premier paquet, demandé dès la tête de la page (build.py, E3PRE) */
 return E3F.then(x=>x==='a'&&f.a?e3pack(f.a,signal,'image/avif',pre,hd,pr).catch(e=>{if(signal&&signal.aborted)throw e;return e3pack(f.w,signal,'image/webp',null,hd,pr)}):e3pack(f.w,signal,'image/webp',null,hd,pr))}   /* hd : la réponse commence (le paquet suivant peut partir) */
const e3url=k=>{const f=(window.E3M||{})[k];return f&&(f.u||f.w)};
/* v22 : deux définitions par image : l (basse, demi-taille, pour bouger tout de suite) et h (nette). La nette remplace la basse dès qu'elle est décodée. */
/* v22.2 : une troisième définition, les images clés (k, paquet K : une sur quatre, plus petites), qui arrivent avant les basses : tant que les images
   entre deux clés manquent, le film fond une clé dans la suivante (G : l'écart permis entre deux images dessinées, si celles d'entre elles manquent) */
function e3film(n,R,at,onimg,G=2){const bl=new Array(n),ll=new Array(n),bm=new Array(n),bq=new Uint8Array(n),bz=new Uint8Array(n),kq=new Uint8Array(n);let act=0,on=true,dir=1,par=4,mv=0,mt=0;   /* par : décodages en parallèle (8 pendant un glissement) */
 const cl=m=>{if(!m)return;if(m.close)m.close();else URL.revokeObjectURL(m.src)};
 const free=i=>{const m=bm[i];bm[i]=null;bq[i]=0;cl(m)};
 const asImg=b=>{const m=new Image();m.src=URL.createObjectURL(b);return m.decode().then(()=>m,()=>{URL.revokeObjectURL(m.src);return null})};
 const rk=q=>q===1?2:q===2?0:1;   /* bq : 1 nette, 0 basse, 2 clé */
 const dec=(i,hi)=>{bz[i]=1;act++;const b=hi?bl[i]:ll[i],q=hi?1:kq[i]?2:0;(window.createImageBitmap?createImageBitmap(b).catch(()=>asImg(b)):asImg(b)).catch(()=>null).then(m=>{act--;bz[i]=0;
  if(m){if(on&&!out(i)&&(!bm[i]||rk(q)>rk(bq[i]))){const o=bm[i];bm[i]=m;bq[i]=q;if(o&&o!==m)cl(o);onimg(i)}else cl(m)}pump()})};
 /* la fenêtre décodée regarde devant : 1,5 R dans le sens du mouvement, 0,5 R derrière (même mémoire qu'avant, ±R) */
 const out=i=>{const a=dir>0?i-at:at-i;return a>Math.round(R*1.5)+6||a<-Math.round(R*.5)-6};
 const nb=(i,s,m)=>{for(let j=0;j<m;j++){const c=i+j*s;if(c<0||c>=n)return -1;if(bm[c])return c;if(bl[c]||ll[c])return -1}return -1},   /* la première image décodée à partir de i, si celles d'avant manquent */
  gap=(k,s)=>{const c=nb(k+s,s,G);return c>=0&&Math.abs(c-k)>2?c:-1};
 const near=d=>{const Bk=Math.round(R*.5);return d?(d<=Bk?[at+d*dir,at-d*dir]:[at+d*dir]):[at]};
 function pump(){if(!on)return;for(let i=0;i<n;i++)if(bm[i]&&out(i))free(i);const A=Math.round(R*1.5);
  /* d'abord une image partout (la nette dès qu'elle est là, même en mouvement ; sinon la basse), puis, une fois le film posé
     (250 ms sans changer d'image), les basses déjà décodées remplacées par les nettes, au plus près d'abord */
  const still=performance.now()-mv>250;
  for(let d=0;d<=A&&act<par;d++)for(const i of near(d))if(i>=0&&i<n&&!bz[i]&&(!bm[i]&&(bl[i]||ll[i])||bm[i]&&bq[i]===2&&(bl[i]||!kq[i]))&&act<par)dec(i,!!bl[i]);   /* une clé décodée : remplacée dès que mieux arrive, même en mouvement */
  if(!still){clearTimeout(mt);mt=setTimeout(pump,260);return}
  for(let d=0;d<=A&&act<par;d++)for(const i of near(d))if(i>=0&&i<n&&bm[i]&&!bq[i]&&bl[i]&&!bz[i]&&act<par)dec(i,1)}
 return{n,get:i=>bm[i],hi:i=>!!bm[i]&&bq[i]===1,any:()=>bl.some(Boolean)||ll.some(Boolean),has:i=>!!(bl[i]||ll[i]),blob:i=>bl[i]||ll[i],boost(k){par=k;pump()},
  /* v20.1 : de a à b, les fichiers sont-ils là (jamais deux images manquantes de suite) ? sinon le film attendrait un paquet encore en route */
  dl(a,b){a=clamp(Math.round(a),0,n-1);b=clamp(Math.round(b),0,n-1);const s=b>a?1:-1,h=j=>bl[j]||ll[j];for(let k=a;k!==b;k+=s){const j=k+s;if(!h(j)&&(j===b||!h(j+s)))return false}return true},
  near(f){const r=clamp(Math.round(f),0,n-1);for(let d=0;d<n;d++){if(r-d>=0&&bm[r-d])return r-d;if(r+d<n&&bm[r+d])return r+d}return r},add(i,b){bl[i]=b;pump()},addLo(i,b){if(!ll[i]||kq[i]){ll[i]=b;kq[i]=0;pump()}},addKey(i,b){if(!ll[i]){ll[i]=b;kq[i]=1;pump()}},
  seek(f){const i=clamp(Math.round(f),0,n-1);if(i!==at){dir=i>at?1:-1;at=i;mv=performance.now();pump()}},
  /* jusqu'où l'on peut aller de f vers t sans trou de plus d'une image (deux images décodées au plus l'une de l'autre) */
  reach(f,t){let k=clamp(Math.round(f),0,n-1);const s=t>f?1:-1,e=clamp(t,0,n-1),f0=f;if(!bm[k]){const x=G>2?nb(k,-s,G):-1;if(x<0)return f;k=x}while(s>0?k<e:k>e){const a=k+s,b=k+2*s;if(a>=0&&a<n&&bm[a])k=a;else if(b>=0&&b<n&&bm[b]&&(s>0?b<=Math.ceil(e)+1:b>=Math.floor(e)-1))k=b;else{const c=gap(k,s);if(c<0)break;k=c}}return s>0?Math.max(f0,Math.min(t,k)):Math.min(f0,Math.max(t,k))},
  /* v22.2 : f est-elle dessinable (son image décodée, ou entre deux clés fondues) ? */
  ok(f){const r=clamp(Math.round(f),0,n-1);if(bm[r])return true;if(G<=2)return false;const a=Math.floor(f),x=nb(a,-1,G),y=nb(a+1,1,G);return x>=0&&y>x&&y-x<=G},
  /* v22.2 : la prochaine image décodée à plus de deux pas (au plus G), si toutes celles d'entre elles manquent encore (pas un décodage en retard) */
  gap(k,s){return gap(k,s)},
  sleep(){on=false;for(let i=0;i<n;i++)free(i)},wake(){if(!on){on=true;pump()}},
  /* ce qu'on dessine pour la position f : les deux voisines fondues si elles sont décodées et à deux images au plus l'une de l'autre ;
     sinon l'image décodée la plus proche, seule (jamais deux images éloignées superposées) */
  pair(f){f=clamp(f,0,n-1);const a=Math.floor(f),b=Math.ceil(f),lo=bm[a]?a:a>0&&bm[a-1]?a-1:-1,hi=bm[b]?b:b<n-1&&bm[b+1]?b+1:-1;
   if(lo>=0&&hi>=0&&hi-lo<=2)return[lo,hi,hi>lo?(f-lo)/(hi-lo):0];
   if(G>2){const x=nb(a,-1,G),y=b===a?nb(a+1,1,G):nb(b,1,G);if(x>=0&&y>x&&y-x<=G)return[x,y,(f-x)/(y-x)]}   /* deux clés fondues */
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
/* La rue au crépuscule, en haut de page. v22 : une intro en trois temps, un seul film (img/e3d/w/<jeu>/, build.py) :
   0. l'affiche vivante : votre façade, de face, depuis le trottoir d'en face ; l'enseigne vide s'allume en pointillés (CSS seul, avant tout paquet) ;
   1. l'approche : on traverse la rue en filant vers le début de la rue (entree3d ?va=1&ap=1, images 0 … A-1) ;
   2. la marche : la caméra longe les six façades, à la hauteur de l'arrêt (le film du glissement, entree3d ?va=1, images A … A+72),
      chaque métier s'inscrit à son passage, et l'on s'arrête devant la vôtre (A+60).
   À l'arrêt, une carte en trois étapes, une à la fois : le métier (le glissement suit la tuile choisie), le nom (il s'allume sur l'enseigne), « Entrer ».
   Derrière la porte, la salle du métier (img/e3d/in-<métier>/), puis la fin de son site ; les rubriques du site suivent, sous la rue (e3d.js, E3S).
   Chaque image existe en basse définition (pour bouger tout de suite, paquets L) et nette (paquets H), en AVIF ou en WebP (e3get).
   Mouvement réduit : l'image de l'arrêt, immobile. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),cv=$('rCv'),cx=cv.getContext('2d'),poster=$('rPoster'),pins=$('rPins'),anchor=$('choix');
 const ld=u.querySelector('.r-load'),t1=u.querySelector('.r-t1'),says=[...u.querySelectorAll('.r-say')],stop=$('rStop'),cue=u.querySelector('.r-cue'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),nm=sign.querySelector('.r-nm'),mets=[...sign.querySelectorAll('.r-met i')],veil=u.querySelector('.r-veil'),seg=u.querySelector('.r-seg');
 /* la rue (D) : l'approche jusqu'à PA, la marche jusqu'à HOLD[0] (la caméra posée devant la vôtre), l'arrêt jusqu'au mur (GATE[1]), puis la porte et la salle (L) */
 const A={d:45,m:55},VAN=73,FAC={restaurant:0,boulangerie:12,coiffure:24,institut:36,onglerie:48,logement:72},HV=60,INS={d:56,m:64},STOP=.82,HOLD=[.75,.92],GATE=[.5,.92],END=.8,PA={d:.3,m:.25},store={},ins={};
 const COARSE=matchMedia('(pointer:coarse)').matches;let wT=0,wOn=false,pV=0,wH=0,sH=0,Pk=-1,jmp=null,held=null,xd=.35,LIVE=!RM,frz=false,moved=false,kbY=-1,SW=1,set='d',want='',W=0,H=0,P=0,Q=0,cP=-1,cQ=0,cF=0,cI=0,last=-1,lastI=-1,raf=0,dirty=true,vis=true,D=1,L=1,hh=64,armed=false,t0=0,inA=0,mode=0,xa=0,dn=1;
 const NF=k=>A[k]+VAN,HOMEi=()=>A[set]+HV,FACi=k=>A[set]+FAC[k];
 const base=k=>'img/e3d/w/'+k+'/';
 /* le film : les paquets dans l'ordre où on les veut (build.py) : L0 (les 6 premières images, basse définition) d'abord, demandé dès le HTML (preload) ;
    H0 (l'affiche et l'arrêt, nets : deux images), L1 (le reste de l'approche), L2 et L3 (la marche), puis H1 (les façades nettes) et le reste. Avant tout geste : jusqu'à H1. */
 const PK=['L0','Ka','Kb','H0','L1a','L1b','L2','L3','H1','H2','H3'],AUTO=6;   /* v22.2 : avant tout geste : L0, K (une image sur quatre : Ka l'approche, Kb la marche), H0, L1a, L1b (≈ 0,5 Mo) ; L2 et L3 au premier geste */
 /* v22.1 : les paquets nets au fil du chemin : H1 (l'approche) au premier geste, H2 (la première moitié de la marche) à l'approche de la rue,
    H3 (la seconde, l'arrêt) en route vers l'arrêt ; jamais une image qui manque : les basses (L) sont toutes là avant, les nettes les remplacent */
 function load(k){let s=store[k];if(s){s.film.wake();if(s.more&&LIVE){s.more(AUTO);if(k===set)more()}return s}const n=NF(k);s=store[k]={n,got:0,req:0,ok:{},has:{},pins:null,chain:Promise.resolve(),film:e3film(n,32,Math.round(cF),()=>{if(k===(want||set)){dirty=true;tick()}},4),pg:{},gen:0,ac:new AbortController(),prev:null};
  const pu=base(k)+'pins.json',pp=window.E3P&&E3P[pu];if(pp)delete E3P[pu];(pp||fetch(pu)).then(r=>r.json()).then(j=>{s.pins=j;dirty=true;tick()}).catch(()=>{});
  if(!LIVE)return s;
  const slow=setTimeout(()=>{if(!s.film.any()&&k===set)ld.textContent='Chargement de la rue…'},1500);
  /* le paquet suivant part dès que le précédent finit d'arriver (l'aller-retour se recouvre, la bande passante reste à un seul paquet à la fois) ; ajoutés dans l'ordre */
  s.ask=nm=>{if(s.has[nm])return;s.has[nm]=1;s.req++;const gen=s.gen,sig=s.ac.signal,prev=s.prev;let h;s.prev=new Promise(r=>h=r);
   const go=()=>{if(gen!==s.gen)return Promise.reject('x');if(window.__pk)__pk.push([nm,'go',Math.round(performance.now())]);const q=e3get('w/'+k+'/'+nm,sig,h,(a,b)=>{s.pg[nm]=a/b;if(wT)tick()});q.catch(h);return q},fp=prev?prev.then(go):go();
   if(window.__pk)fp.then(()=>__pk.push([nm,'in',Math.round(performance.now())]),()=>{});s.chain=s.chain.then(()=>fp.then(l=>{if(gen!==s.gen)return;if(window.__pk)__pk.push([nm,'add',Math.round(performance.now())]);const lo=nm[0]==='L';l.forEach(([i,b])=>nm[0]==='K'?s.film.addKey(i,b):lo?s.film.addLo(i,b):s.film.add(i,b));s.pg[nm]=1;s.got++;s.ok[nm]=1;if(nm==='L0'){clearTimeout(slow);if(ld.textContent==='Chargement de la rue…')ld.textContent=''}dirty=true;tick()}))
   .catch(()=>{if(gen!==s.gen)return;if(nm==='L0'){clearTimeout(slow);ld.textContent='';if(!s.film.any())flat();return}s.loose=true;s.got++;s.ok[nm]=1;dirty=true;tick()})};   /* un paquet absent : le film joue avec ce qu'il a (images plus espacées) plutôt que de rester figé */
  /* v22.2 : l'autre jeu (rotation aller-retour, capture d'écran) : ses paquets en route sont annulés ; ceux reçus restent */
  s.halt=()=>{if(Object.keys(s.has).every(m=>s.ok[m]))return;s.gen++;s.ac.abort();s.ac=new AbortController();s.prev=null;s.chain=Promise.resolve();for(const m in s.has)if(!s.ok[m]){delete s.has[m];s.req--}};
  s.more=lv=>{for(let g=0;g<Math.min(lv,PK.length);g++)s.ask(PK[g])};
  s.more(AUTO);more();return s}
 function more(){const s=store[set];if(!s||!s.ask)return;const a=A[set],f=Math.max(cF,jmp?HOMEi():0);
  if(moved||P>.05||jmp){s.ask('L2');s.ask('L3')}if(jmp||f>a+20)s.ask('H3');   /* arrivé par un lien : la seconde moitié (l'arrêt, ses voisines) d'abord ; H2 seulement si l'on y va (glissement, marche) */
  if(cP>.01&&!jmp&&cF<a+5)s.ask('H1');   /* v22.2 : H1 (l'approche nette) seulement en marchant : arrivé par un lien, le fondu la saute */if(f>a-15&&f<a+45&&!jmp||vg&&Math.min(vg.b,vx)<a+40)s.ask('H2');if(f>a+20||vg)s.ask('H3')}
 let armT=0,inOk=false;const arm=()=>{if(armed)return;armed=true;armT=performance.now();if(!W)size();load(set)};   /* v22.2 : le jeu de l'écran d'abord (un glissé avant le script ne charge plus l'autre) */
 /* la rue a ses premières images (ou n'en aura pas) : avant, le mur de l'arrêt reste fermé, même pour un nouveau geste */
 const rdy=()=>{const s=store[set];return !LIVE||!!(s&&(s.ok.Kb||s.ok.L1b||s.loose))||armed&&performance.now()-armT>12000};
 const xh=u.querySelector('.r-x'),geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;wH=walk.offsetHeight;sH=stg.offsetHeight;const x=xh?xh.offsetHeight:0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight-x);L=Math.max(1,x+D*(1-GATE[1]));anchor.style.top=LIVE?(STOP*D)+'px':''};
 const curP=()=>(hh-walk.getBoundingClientRect().top)/D,yAt=p=>walk.getBoundingClientRect().top+scrollY-hh+p*D;
 /* redimensionner vide le canevas (rotation, barre d'adresse) : on y remet la dernière bonne image, étirée en « cover », jusqu'à la prochaine */
 const kc=document.createElement('canvas'),kx=kc.getContext('2d');let painted=false,shF=-1,lastS=0;
 function keep(){if(!painted||!W||!H)return;kc.width=W;kc.height=H;kx.drawImage(cv,0,0)}
 function back(){if(!painted||!kc.width)return;const sc=Math.max(W/kc.width,H/kc.height),w=kc.width*sc,h=kc.height*sc;cx.drawImage(kc,(W-w)/2,(H-h)/2,w,h)}
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*d),h=Math.round(r.height*d);
  SW=r.width||1;if(w!==W||h!==H){keep();W=cv.width=w;H=cv.height=h;back();dirty=true}
  /* v22 : en tournant le téléphone, la rue change de longueur : on reste au même endroit (à l'arrêt, la carte reste là) ; l'autre jeu d'images
     ne remplace l'ancien qu'une fois son image prête (plus d'image étirée en double exposition) */
  const k=r.width<r.height*.95?'m':'d',p0=D>1&&cP>=0&&Pk>=0?Pk:-1;   /* v22.2 : la dernière position mesurée avec la géométrie d'avant (barre d'adresse, rotation : plus de page décalée de 107 px) */if(k!==set&&k!==want){if(!painted&&!store[set]){if(vx>=0)vx=vx-A[set]+A[k];set=k;want=''}else{want=k;if(armed||!LIVE)load(k)}}else if(k===set){if(want&&store[want]&&store[want].halt)store[want].halt();want=''}
  if(!LIVE)load(set);geo();if(p0>=0&&LIVE&&Math.abs(curP()-p0)>.002){e3halt();scrollTo({top:yAt(p0),behavior:'instant'})}}
 const mapF=(f,a,b)=>f<a?f:f-a+b;   /* le même endroit dans l'autre jeu (l'approche n'a pas le même nombre d'images) */
 function swap(){if(!want||want===set)return;const s=store[want];if(!painted||!store[set]){if(vx>=0)vx=vx-A[set]+A[want];set=want;want='';return}if(!s)return;
  const f=cF<A[set]?cF*A[want]/A[set]:cF-A[set]+A[want];if(!s.film.get(s.film.near(f)))return;
  if(store[set]){store[set].film.sleep();if(store[set].halt)store[set].halt()}snap();cF=f;vx=vx-A[set]+A[want];if(vg){vg.a=vg.a-A[set]+A[want];vg.b=vg.b-A[set]+A[want]}set=want;want='';shF=-1;dirty=true}
 /* le nom : sur l'enseigne vide, en néon. Seules les lettres nouvelles s'allument ; la largeur et la taille suivent en douceur. */
 let shown='';
 const fit=()=>{e3meas.font='400 86px "Cormorant Garamond"';const w=e3meas.measureText(shown).width;nm.style.setProperty('--w',Math.ceil(w)+'px');nm.style.setProperty('--s',Math.min(1,860/(w||1)).toFixed(3))};
 function named(v,push){const t=v.trim().slice(0,40);let k=0;while(k<t.length&&k<shown.length&&t[k]===shown[k])k++;
  const bs=[...nm.children];for(let i=bs.length-1;i>=k;i--)bs[i].remove();
  for(let i=k;i<t.length;i++){const b=document.createElement('b');b.textContent=t[i];if(push)b.className='r-lit';b.style.animationDelay=Math.min(i-k,6)*35+'ms';nm.appendChild(b)}
  shown=t;sign.classList.toggle('on',!!t);fit();recall();
  if(push)E3S.set({name:v})}
 /* le métier : choisi à l'arrêt (une tuile), la caméra glisse jusqu'à sa façade, le nom passe sur son enseigne, et la porte est la sienne.
    Avant tout choix (première visite), la caméra reste devant la vôtre et aucune tuile n'est cochée. */
 let met='',mi=0,chosen=!!E3S.st.touched;
 const tiles=()=>[...seg.querySelectorAll('[data-m]')],padL=()=>parseFloat(getComputedStyle(seg).scrollPaddingLeft)||parseFloat(getComputedStyle(seg).paddingLeft)||0;
 let thumbs=false;const thumb=()=>{if(thumbs)return;thumbs=true;seg.querySelectorAll('img[data-src]').forEach(i=>{i.src=i.dataset.src})};   /* les vignettes des tuiles : après le film (P > .3, l'arrêt, ou sans film) */
 function metier(k,push){if(!E3[k])return;const was=met;if(push)chosen=true;met=k;
  tiles().forEach(b=>{const on=b.dataset.m===k;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});   /* v22.1 : la tuile du métier en cours est toujours cochée (Restaurant, au départ) ; « Suivant » le dit */
  if(k!==was){const a=mets[mi],b=mets[mi^=1];b.textContent=E3[k].lab;a.classList.remove('a');b.classList.add('a')}else mets[mi].classList.add('a');
  recall();if(k===was&&!push)return;
  if(push)E3S.set({sc:k});if(cv.width&&(mode||inA>.02&&!push))snap();wall();if(push)goMet(k);dirty=true;tick()}
 function goMet(k){rel();if(!LIVE||!(k in FAC)||!W)return;const p=curP();if(p<HOLD[0]-.02||p>GATE[1]+.01)return;
  went=true;const s=store[set];if(s&&s.ask){const t=FACi(k);s.ask(t<A[set]+40?'H2':'H3')}glideTo(FACi(k));if(s&&!s.film.get(Math.round(FACi(k))))ld.textContent='Vers la façade : '+E3[k].lab+'…'}
 const rwall=$('rWall');function wall(){if(rwall&&E3[met])e3pins(rwall,E3[met],E3S.st.name||'Votre nom ici')}
 /* le rappel, aux étapes 2 et 3 : « Coiffure · changer », « Café du Lac · Coiffure · modifier » */
 function recall(){const m=E3[met]?E3[met].lab:'';const nx=stop.querySelector('.r-next');if(nx){nx.setAttribute('aria-label','Suivant : '+m);requestAnimationFrame(()=>{const w=nx.offsetWidth;if(w)stop.style.setProperty('--nx',(w+2)+'px')})}u.querySelectorAll('[data-rc-m]').forEach(e=>e.textContent=m);u.querySelectorAll('[data-rc-n]').forEach(e=>e.textContent=(shown?shown+' · ':'')+m)}
 metier(E3S.st.sc,false);
 /* ——— la carte, une étape à la fois : 1 le métier, 2 le nom, 3 « Entrer » ——— */
 let step=chosen?3:1,segT=0,segMe=0,segU=false;
 function go(n,focus){if(n!==1||LIVE&&armed)thumb();if(n!==2&&document.activeElement===nameIn){kbY=-1;nameIn.blur()}step=n;stop.dataset.step=n;const dots=stop.querySelectorAll('.r-dots i');dots.forEach((d,i)=>d.classList.toggle('on',i<n));
  stop.querySelectorAll('.r-s').forEach(el=>{const on=el.classList.contains('r-s'+n);el.hidden=LIVE&&!on;   /* sans film (mouvement réduit) : les trois étapes à la suite */if(on){el.classList.remove('r-in');void el.offsetWidth;el.classList.add('r-in')}});
  if(n===1)centre(false);
  if(focus){const f=n===1?seg.querySelector('[tabindex="0"]'):n===2?nameIn:stop.querySelector('.r-enter');if(f&&(n!==2||!COARSE))f.focus({preventScroll:true});else stop.focus({preventScroll:true})}}
 go(step,false);
 stop.addEventListener('click',e=>{const b=e.target.closest('[data-to],.r-next,.r-pass');if(!b)return;e.preventDefault();
  if(b.classList.contains('r-next')){if(!chosen)metier(met,true);go(2,true)}else if(b.classList.contains('r-pass')){rel();go(3,true)}else go(+b.dataset.to,true)});
 /* les tuiles : un toucher choisit (et centre la tuile) ; toucher la tuile déjà choisie passe au nom. Au doigt, faire défiler le carrousel
    choisit la tuile qui s'arrête au centre (le glissement la suit). Au clavier : ← → (role=radiogroup). */
 seg.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;if(chosen&&b.dataset.m===met){if(went||!LIVE)go(2,true);else goMet(met);return}metier(b.dataset.m,true);centre(true)});
 seg.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const bs=tiles(),i=Math.max(0,bs.findIndex(b=>b.dataset.m===met)),n=e.key==='Home'?bs[0]:e.key==='End'?bs[bs.length-1]:bs[(i+(/Right|Down/.test(e.key)?1:bs.length-1))%bs.length];metier(n.dataset.m,true);n.focus();centre(true)});
 function centre(sm){const b=seg.querySelector(`[data-m="${met}"]`);if(!b||seg.scrollWidth<=seg.clientWidth+2)return;const x=Math.min(b.offsetLeft-padL(),seg.scrollWidth-seg.clientWidth);   /* v22.1 : la tuile choisie à gauche du carrousel (pas de vide au départ) */segMe=performance.now();seg.scrollTo({left:x,behavior:sm&&!RM?'smooth':'instant'})}
 seg.addEventListener('scroll',()=>{if(!segU||performance.now()-segMe<700)return;clearTimeout(segT);segT=setTimeout(()=>{const c=seg.scrollLeft+padL(),mx=seg.scrollWidth-seg.clientWidth,cur=seg.querySelector(`[data-m="${met}"]`);
   if(chosen&&cur&&seg.scrollLeft>=mx-2&&cur.offsetLeft-padL()>=mx-2)return;   /* au bout : les dernières tuiles s'y calent toutes ; la choisie reste */
   let best=null,bd=1e9;for(const b of tiles()){const d=Math.abs(b.offsetLeft-c);if(d<bd){bd=d;best=b}}
  if(best&&(!chosen||best.dataset.m!==met))metier(best.dataset.m,true)},140)},{passive:true});
 for(const ev of ['pointerdown','touchstart','wheel','focusin'])seg.addEventListener(ev,()=>{if(ev!=='focusin')segU=true;more()},{passive:true});   /* le carrousel ne choisit qu'après un geste sur lui (pas l'aimantation du navigateur au chargement) */
 document.addEventListener('oonde-e3',e=>{if(e.detail.sc!==met)metier(e.detail.sc,false);if(e.detail.name&&!nameIn.value){nameIn.value=e.detail.name;named(e.detail.name,false)}wall()});
 u.querySelector('.r-enter').addEventListener('click',e=>{e.preventDefault();enter()});
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();nameIn.blur();go(3,true)}});
 {const v=E3S.st.name;if(v){nameIn.value=v;named(v,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(()=>{fit();wall();dirty=true;tick()});
 /* une image : les deux voisines fondues l'une dans l'autre (si elles sont décodées et à deux images au plus) ; les enseignes, interpolées de même */
 const pinAt=(s,i)=>s.pins&&s.pins[i]?s.pins[i].pins:null;
 const cover=im=>{const sc=Math.max(W/im.width,H/im.height),w=im.width*sc,h=im.height*sc;return{ox:(W-w)/2,oy:(H-h)/2,w,h}};
 const paintPair=(film,r,al)=>{const[i0,i1,a]=r,im=film.get(i0),b=cover(im);cx.globalAlpha=al;cx.drawImage(im,b.ox,b.oy,b.w,b.h);if(a>.01&&i1!==i0){const j=film.get(i1),c=cover(j);cx.globalAlpha=al*a;cx.drawImage(j,c.ox,c.oy,c.w,c.h)}cx.globalAlpha=1;return b};
 /* le passage d'une image à l'autre quand le contenu change d'un coup (autre métier, la salle qui s'allume) : l'ancienne image s'efface */
 const xc=document.createElement('canvas'),xx=xc.getContext('2d');
 function snap(){if(!W||!H||!painted)return;xc.width=W;xc.height=H;xx.drawImage(cv,0,0);xa=1}
 const fit2=(b,d)=>({ox:b.ox/d,oy:b.oy/d,w:b.w/d,h:b.h/d});
 /* la rue (approche, marche, arrêt, glissement) : une seule image de film, f */
 function draw(f){const s=store[set];if(!W||!H||!s)return;f=clamp(f,0,s.n-1);
  /* v22.1 : arrivé par un lien, l'image de l'arrêt (décodée à part) en attendant que le film l'ait */
  if(held&&Math.abs(f-held.i)<.5&&!s.film.get(held.i)){s.film.seek(f);const c=cover(held.m);cx.drawImage(held.m,c.ox,c.oy,c.w,c.h);if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
   flag(u,'live',true);painted=true;dirty=false;place(remap(pinAt(s,held.i)),fit2(c,W/SW),f);return}
  if(held&&s.film.get(held.i)){if(held.m.close)held.m.close();held=null}
  s.film.seek(f);let r=s.film.pair(f);if(!r)return;
  if(vg&&r[0]!==r[1])r=r[2]<.5?[r[0],r[0],0]:[r[1],r[1],0];   /* pendant le glissement, une image à la fois : deux voisines fondues dédoublaient les réverbères */
  const[i0,i1,a]=r;
  /* l'affiche reste tant que l'image nette du début n'est pas là (pas d'affiche nette remplacée par sa version floue, au repos) */
  if(!painted&&f<.5&&!s.film.hi(0)&&!moved)return;   /* au repos, l'affiche nette reste ; dès le premier geste, le film part sur ses premières images (L0) */
  const far=i1>i0+2&&i0<=f+.01&&i1>=f-.01?0:Math.min(Math.abs(i0-f),Math.abs(i1-f));if(!s.loose&&far>1.01&&(far>=Math.abs((shF<0?0:shF)-f)-1||performance.now()-lastS<1500))return;   /* jamais une image plus lointaine que celle qu'on voit déjà ; réseau lent : on se rapproche par étapes */
  shF=far>1.01?(Math.abs(i0-f)<Math.abs(i1-f)?i0:i1):f;if(window.__rd)__rd.push([Math.round(performance.now()),+f.toFixed(2),i0,i1,+a.toFixed(2),s.film.hi(i0)?1:0]);
  const b=paintPair(s.film,r,1);
  /* à l'arrêt : la salle du métier choisi s'allume derrière la vitrine (la première image de la suite, même cadrage) */
  const z=inCur(),z0=z&&z.film.get(0);if(z0&&inA>.003){const c=cover(z0);cx.globalAlpha=inA;cx.drawImage(z0,c.ox,c.oy,c.w,c.h);cx.globalAlpha=1}
  if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;
  const d=W/SW;place(remap(e3mix(pinAt(s,i0),pinAt(s,i1),a)),fit2(b,d),f);
  if(z0&&inA>.5&&z.pins)e3place(rwall,z.pins[0].pins,fit2(b,d));else e3place(rwall,null,null)}
 /* dans la salle : la suite du métier choisi ; le nom sur l'enseigne (dehors) puis au mur du fond */
 function drawIn(f){const z=inCur();if(!W||!H||!z)return false;f=clamp(f,0,z.n-1);z.film.seek(f);const r=z.film.pair(f);if(!r)return false;const[i0,i1,a]=r;if(Math.abs(i0-f)>1.01&&Math.abs(i1-f)>1.01)return false;
  if(window.__ri)__ri.push([i0,i1,+a.toFixed(2)]);
  const b=paintPair(z.film,r,1);if(xa>.003){cx.globalAlpha=xa;cx.drawImage(xc,0,0);cx.globalAlpha=1}
  flag(u,'live',true);painted=true;dirty=false;const d=W/SW,pp=z.pins?e3mix(pinAt(z,i0),pinAt(z,i1),a):null;
  place(pp&&cQ>.22?pp.filter(q=>q.id!=='sign'):pp,fit2(b,d),-1);e3place(rwall,pp,fit2(b,d));return true}   /* passé la porte, l'enseigne du dehors s'efface (plus de nom fantôme sous la barre) */
 /* les enseignes : le nom des métiers s'inscrit à leur passage, pendant la marche seulement ; à l'arrêt, seulement l'enseigne (le métier choisi s'écrit dessous) */
 let signQ=null;
 function place(pp,fb,f){const walkOn=f>=0&&f>A[set]-3&&!atStop0();for(const el of pins.children){const q=pp&&pp.find(x=>x.id===el.dataset.id);
  if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,127,fb);
  if(el===sign){el.style.opacity=vg?(q.vis*clamp((.56-Math.abs(mxOf(q)-.5))/.14,0,1)).toFixed(2):q.vis;signQ={c:q.c,f:fb};continue}   /* en glissant : elle s'efface au bord de l'image */
  const mx=(q.c[0][0]+q.c[1][0])/2,near=clamp(1-Math.abs(mx-.5)/.42,0,1);el.style.opacity=walkOn?(q.vis*Math.min(1,near*1.8)).toFixed(2):0}}
 const atStop0=()=>cP>=HOLD[0]-.012&&cQ<.06;
 /* la suite, par métier (img/e3d/in-<métier>/<jeu>/) : p0 en approchant de l'arrêt, p1 et p2 à l'arrêt, p3 dès qu'on passe la porte.
    Les autres métiers dorment ; un jeu absent : la porte de la rue, en secours. */
 const inKey=()=>met+set+(went?'a':''),inCur=()=>{const z=ins[inKey()];return z&&!z.bad?z:null};
 function inGet(k,g){const z=ins[k];return e3get('in-'+z.m+'/'+z.k+'/p'+g,z.ac.signal).then(l=>l.forEach(([i,b])=>z.film.add(i,b)))}
 function need(lv){const s=store[set];if(!LIVE||!met||!W||!(s&&(s.ok.L2||s.loose)))return;   /* l'ordre : la rue d'abord (jusqu'à ses façades nettes, H0), puis la salle du métier */
  if(lv===undefined)lv=cQ>0||gate==='open'&&cP>HOLD[0]?4:gate==='rested'||cP>=HOLD[0]-.02?2:cP>.5?1:0;   /* v22.1 : à l'arrêt p0, p1 ; p2 et p3 en passant la porte (« Entrer ») */if(!lv)return;
  const k=inKey();let z=ins[k];
  for(const j in ins)if(j!==k){const y=ins[j];if(y.film)y.film.sleep();if(y.req>y.got){y.gen++;y.req=y.got;y.ac.abort();y.ac=new AbortController()}}   /* le métier quitté : ses paquets en route sont annulés (on reprendra où il en était) */
  if(!z){z=ins[k]={m:met,k:set+(went?'a':''),n:INS[set],req:0,got:0,gen:0,ac:new AbortController(),pins:null,chain:Promise.resolve(),film:e3film(INS[set],24,0,()=>{if(k===inKey()){dirty=true;tick()}})};
   fetch(e3in(met)+z.k+'/pins.json').then(r=>r.json()).then(j=>{z.pins=j;dirty=true;tick()}).catch(()=>{})}
  else z.film.wake();
  while(z.req<lv){const g=z.req++,gen=z.gen;z.chain=z.chain.then(()=>{if(z.gen!==gen)return;return inGet(k,g).then(()=>{if(z.gen===gen)z.got=g+1})}).catch(()=>{if(z.gen!==gen)return;if(g===0){z.bad=true;if(went&&k===inKey())home();dirty=true;tick()}})}}   /* la porte de la façade absente : retour devant la vôtre */
 /* le rythme : l'approche (trapèze : départ doux, arrivée posée au début de la rue), puis la marche, qui ralentit sur son dernier quart (l'arrivée devant la vôtre) */
 const trap=(x,a,b,ra,rb)=>{const L=b-a,t=clamp(x-a,0,L),v=1/(L-ra/2-rb/2);return t<ra?v*t*t/(2*ra):t<=L-rb?v*(ra/2+t-ra):1-v*(L-t)**2/(2*rb)};
 function frameOf(P){const a=A[set],pa=PA[set];return P<pa?a*trap(P,0,pa,.03,.09):a+HV*trap(Math.min(P,HOLD[0]),pa,HOLD[0],.06,.2)}
 /* l'inverse : la position où l'on voit l'image f (les textes suivent l'image à l'écran) */
 function invF(f){let a=0,b=HOLD[0];for(let k=0;k<22;k++){const m=(a+b)/2;if(frameOf(m)<f)a=m;else b=m}return (a+b)/2}
 /* la progression : le paquet qui porte la prochaine image (une clé si K manque encore) */
 function wPg(s,d){const a=A[set],mid=(6+a)>>1,i=clamp(Math.round(cF)+d,0,s.n-1),nm=i<A[set]&&!s.ok.Ka?'Ka':i>=A[set]&&!s.ok.Kb?'Kb':i<6?'L0':i<mid?'L1a':i<a?'L1b':(i-a)%2?'L3':'L2';return s.pg[nm]||0}
 const inOf=q=>(INS[set]-1)*trap(q,0,END,.08,.14);   /* la suite : la porte, la salle, et un temps sur la fin du site */
 /* le glissement d'une façade à l'autre, à l'arrêt (0,8 à 1,4 s) ; vx : l'image du film à l'arrêt (la vôtre, HOMEi, ou celle du métier choisi) */
 let vx=-1,went=false,vg=null;
 const vdur=(a,b)=>{const d=Math.abs(b-a);return d>=36?1400:800+d/36*500};
 function glideTo(x){if(vx<0)vx=HOMEi();if(Math.abs(x-vx)<.01&&!vg)return;const s=store[set];vg={a:vx,b:x,t0:s&&s.film.dl(vx,x)?performance.now():0,q:performance.now(),dur:vdur(vx,x)};if(s){s.film.seek(vx+Math.sign(x-vx));s.film.boost(8)}dirty=true;tick()}
 function home(){went=false;glideTo(HOMEi())}
 /* le nom va sur l'enseigne de la façade choisie ; celle de l'arrêt (la vôtre) reste vide */
 const mxOf=q=>(q.c[0][0]+q.c[1][0])/2;
 const remap=pp=>{if(!pp||!went)return pp;
  /* v22.2 : pendant le glissement, l'enseigne reste sur la façade la plus au centre (la vôtre, puis celle du métier) : elle ne disparaît plus au départ */
  if(vg){const h=pp.find(q=>q.id==='sign'),m=pp.find(q=>q.id===met);if(h&&h.vis>0&&(!m||m.vis<=0||Math.abs(mxOf(h)-.5)<Math.abs(mxOf(m)-.5)))return pp}
  return pp.map(q=>q.id==='sign'?{...q,id:'_t'}:q.id===met?{...q,id:'sign'}:q)};
 const ss=x=>x*x*(3-2*x),fade=(a,b,c,d,x=cP)=>ss(Math.min(clamp((x-a)/(b-a||1),0,1),clamp((d-x)/(d-c||1),0,1))),fq=(a,b,c,d)=>ss(Math.min(clamp((cQ-a)/(b-a||1),0,1),clamp((d-cQ)/(d-c||1),0,1)));
 /* les textes : opacity et transform seulement, et on n'écrit un style que s'il change */
 const memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}};
 const flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 const sbar=$('rSbar'),end=$('rEnd');
 /* l'arrivée à l'arrêt : l'enseigne pulse deux fois, puis la carte monte (rien n'apparaît avant d'être à l'arrêt) */
 let arrT=0;
 function ui(now){if(!LIVE)return;
  const h=ss(clamp((.1-pV)/.06,0,1));put(t1,'opacity',h.toFixed(3));flag(t1,'off',pV>.1);{const v=h.toFixed(2);if(veil.dataset.hv!==v){veil.dataset.hv=v;veil.style.setProperty('--hv',v)}}flag(document.body,'hero-cta',h>.5&&vis);put(cue,'opacity',clamp((.03-cP)/.03,0,1).toFixed(2));
  flag(u,'moving',cP>.004);   /* l'affiche vivante s'arrête dès qu'on part */
  const W3=[[.05,.08,.18,.22],[.3,.34,.47,.52]];   /* la première phrase pendant l'approche, la deuxième au début de la marche ; la troisième, une fois la porte passée */
  says.forEach((el,j)=>{const w=W3[j],o=w?fade(...w,pV):mode===2||mode===1&&inOk?fq(.03,.07,.15,.21):0,a0=w?w[0]:.03,b0=w?w[1]:.07,x=w?pV:cQ;put(el,'opacity',o.toFixed(3));put(el,'transform',`translateY(${((1-ss(clamp((x-a0)/(b0-a0),0,1)))*14).toFixed(1)}px)`)});
  /* la carte : seulement la caméra posée à l'arrêt ; elle ne part qu'une fois le portail franchi */
  const here=frz||atStop0()&&(cF>=HOMEi()-.6||went||vg);if(here&&!arrT){arrT=now;flag(sign,'pulse',!shown&&!went);setTimeout(()=>flag(sign,'pulse',false),1300)}if(!here&&cP<HOLD[0]-.03)arrT=0;
  const e=frz?1:here&&now-arrT>=(shown||chosen?250:400)?1:0;
  if(stop._e!==e){stop._e=e;flag(stop,'on',!!e);flag(u,'stop',!!e)}
  flag(u,'past',cQ>.005);
  /* dans la salle : la barre du site du commerce, puis sa fin (le bouton du métier) */
  put(sbar,'opacity',(mode===2||mode===1&&inOk?ss(clamp((cQ-.3)/.1,0,1)):0).toFixed(3));
  const g=mode===2||mode===1&&inOk||end.classList.contains('kb')?ss(clamp((cQ-.66)/.1,0,1)):0;put(end,'opacity',g.toFixed(3));put(end,'transform',`translateY(${((1-g)*14).toFixed(1)}px)`);flag(end,'on',g>.5);
  if(cQ>.02&&!mode)ld.textContent='Chargement de la démo…';else if(ld.textContent==='Chargement de la démo…')ld.textContent=''}
 /* mouvement réduit : l'image de l'arrêt, et le nom posé sur son enseigne */
 function still(){const s=store[set];if(!s||!s.pins||!poster.naturalWidth)return;const i=HOMEi(),rw=SW,rh=scene.clientHeight,sc=Math.max(rw/poster.naturalWidth,rh/poster.naturalHeight),w=poster.naturalWidth*sc,h=poster.naturalHeight*sc;
  place(pinAt(s,i),{ox:(rw-w)/2,oy:(rh-h)/2,w,h},-1)}
 window.__e3=()=>{const z=ins[inKey()],s=store[set];return{mode,cF:+cF.toFixed(2),cI:+cI.toFixed(2),cP:+cP.toFixed(3),cQ:+cQ.toFixed(3),gate,key:inKey(),z:z&&{req:z.req,got:z.got,bad:!!z.bad,f0:!!z.film.get(0)},w:s&&{req:s.req,got:s.got,n:s.n},vx,went,vg:!!vg,home:HOMEi(),A:A[set],set,step,chosen,nudged,on:stop.classList.contains('on'),tg:+frameOf(Math.min(Math.max(cP,0),HOLD[1])).toFixed(2),wt:wOn,pV:+pV.toFixed(3),ok:s&&Object.keys(s.ok).join()}};   /* état, pour les tests */
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 /* le film suit sa cible sans jamais sauter une image : une image décodée à la fois, au plus une par image affichée */
 function follow(film,c,t,dt,rest){
  if(rest&&performance.now()-lastS>1500){const nt=film.near(t);if(film.get(nt)&&Math.abs(nt-t)<Math.abs(c-t)-1&&(!film.get(Math.round(c))||!film.dl(c,nt))){if(painted)snap();return nt}}
  if(film.get(Math.round(c))){if(rest)t=film.near(t);t=film.reach(c,t)}else t=c;const st=t-c;c+=clamp(st*(1-Math.exp(-dt/.07)),-1,1);return Math.abs(t-c)<.004?t:c}
 /* l'inertie : la page suit le défilement avec ~180 ms de retard, comme une caméra portée ; une fois arrêtée, elle se pose sur l'image nette la plus proche */
 function loop(now){raf=0;swap();const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;
  if(cP<0)geo();else if(walk.offsetHeight!==wH||stg.offsetHeight!==sH)size();
  const r=walk.getBoundingClientRect(),y=hh-r.top;P=Math.max(0,y/D);Pk=P;Q=clamp((y-GATE[1]*D)/L,0,1);
  if(!LIVE){still();return}
  more();if(P>.3&&store[set]&&(store[set].ok.L1b||store[set].loose))thumb()   /* v22.2 : les vignettes après l'approche (elles ne prennent pas la bande passante des clés) */
  /* v22.2 : réseau lent, le visiteur a déjà glissé avant que le script ne tourne : on part de l'affiche (l'image 0, celle qu'il voit), le film la suit */
  if(cP<0&&!painted&&P<HOLD[0]-.02&&(performance.getEntriesByType('navigation')[0]||{}).type!=='back_forward'&&(performance.getEntriesByType('navigation')[0]||{}).type!=='reload'){cP=0;cF=0;cQ=0;cI=0;if(vx<0)vx=HOMEi()}
  if(cP<0){cP=P;cF=Math.round(frameOf(P));cQ=Q;cI=Math.round(inOf(Q));if(vx<0)vx=HOMEi()}
  /* le nom a le focus à l'arrêt : tout reste figé, même si le clavier du téléphone fait bouger la page */
  if(COARSE&&document.activeElement===nameIn&&cP>=HOLD[0]-.02&&cP<=HOLD[1]+.02)frz=true;
  if(!frz){cP+=(P-cP)*(1-Math.exp(-dt/.2));if(Math.abs(P-cP)<.0003)cP=P}
  cQ=clamp((cP*D-GATE[1]*D)/L,0,1);const rest=cP===P;need();
  const s0=store[set],F=frameOf(Math.min(cP,HOLD[1]));let tF=rest?Math.round(F):F;
  /* v22.1 : arrivé par un lien (« Voir la démo », « Passer l'intro ») : si le film n'a pas les images du chemin (réseau lent), ou tarde, un fondu
     droit vers l'image de l'arrêt ; « Passer l'intro » : toujours un fondu (0,6 s) */
  if(jmp&&s0){const hm=HOMEi();if(!jmp.t&&Math.abs(P-STOP)<.012&&!e3gl)jmp.t=now;
   if(Math.abs(cF-hm)<.5&&jmp.t)jmp=null;
   else if(jmp.t&&(jmp.all||Math.abs(cF-hm)>20||!s0.film.dl(cF,hm)||now-jmp.t>600)){
    if(!jmp.p&&(s0.film.get(hm)||s0.film.has(hm))){jmp.p=1;const m0=s0.film.get(hm);(m0?Promise.resolve(null):createImageBitmap(s0.film.blob(hm))).then(m=>{if(jmp)jmp.m=m||'f';tick()},()=>{if(jmp)jmp.m='f'})}
    if(jmp.m){if(jmp.m!=='f')held={i:hm,m:jmp.m};snap();xd=jmp.all?.6:.45;cF=tF=hm;cP=P;jmp=null;dirty=true}}
   else if(!jmp.t&&!e3gl&&Math.abs(P-STOP)>.05&&performance.now()-lastS<200&&jmp.go&&performance.now()-jmp.go>400)jmp=null}   /* un geste en route : on rend la main */
  if(s0){if(rest&&!s0.loose&&performance.now()-lastS>1500){const nt=s0.film.near(Math.round(F));if(s0.film.get(nt)&&Math.abs(nt-F)<Math.abs(cF-F)-1&&(!s0.film.get(Math.round(cF))||!s0.film.dl(cF,nt))){snap();cF=tF=nt;dirty=true}}
   if(s0.loose&&!s0.film.ok(cF)&&s0.film.get(s0.film.near(cF)))cF=s0.film.near(cF);
   if(s0.film.ok(cF)){if(rest)tF=s0.film.near(tF);const r=s0.film.reach(cF,tF);if(!s0.loose||Math.abs(r-cF)>.05)tF=r}else if(!s0.loose)tF=cF}else tF=cF;   /* un paquet absent (loose) : le film va quand même vers la cible (images plus espacées) */   /* une image pas encore décodée : le film l'attend, il ne la saute pas */
  {const st=tF-cF,dl=st*(1-Math.exp(-dt/.07));cF+=clamp(dl,-1,1)}if(Math.abs(tF-cF)<.004)cF=tF;
  /* v22.2 : le film attend des images (la cible a plus de 1,5 image d'avance et il ne peut plus avancer) : après 400 ms, « Chargement de la rue… »
     et une fine ligne de progression, l'image tenue pousse doucement (1 %) ; les textes suivent l'image à l'écran, pas le doigt */
  {const blk=s0&&!jmp&&!vg&&cQ<.005&&Math.abs(F-cF)>1.5&&Math.abs(tF-cF)<.05;if(blk&&!wT){wT=now;setTimeout(tick,420)}else if(!blk)wT=0;
   const on=!!wT&&now-wT>=400;if(on!==wOn){wOn=on;flag(u,'wait',on);if(on)ld.textContent='Chargement de la rue…';else if(ld.textContent==='Chargement de la rue…')ld.textContent=''}
   if(on)ld.style.setProperty('--pg',wPg(s0,F>cF?1:-1).toFixed(3));
   const pT=wT?Math.min(cP,invF(cF)):cP;pV+=(pT-pV)*(1-Math.exp(-dt/.12));if(Math.abs(pT-pV)<.0005)pV=pT;else if(!wT)tick()}   /* une image au plus par image affichée : aucun trou, même lancé fort */
  /* le glissement avance avec le temps ; on repart vers la rue : retour devant la vôtre d'abord */
  if(went&&cP<HOLD[0]-.01)home();
  {const v=s0;if(vg&&v&&!vg.t0&&!v.film.dl(vg.a,vg.b)&&performance.now()-vg.q>(v.ok.L2&&v.ok.L3?0:900)){v.film.seek(vg.b);if(v.film.get(Math.round(vg.b))){snap();vx=vg.b;vg=null;dirty=true}}   /* réseau lent (des images manquent en route) : un fondu vers la façade d'arrivée */
   if(vg&&v&&!vg.t0&&v.film.dl(vg.a,vg.b)){vg.t0=now;v.film.seek(vx+Math.sign(vg.b-vx));v.film.boost(8)}
   if(ld.textContent.startsWith('Vers la façade')&&(!vg||vg.t0||!went))ld.textContent='';
   if(vg&&v&&vg.t0){const t=clamp((now-vg.t0)/vg.dur,0,1),e=trap(t,0,1,.06,.42);vx=vg.a+(vg.b-vg.a)*e;if(t>=1){vx=vg.b;vg=null;v.film.boost(4)}dirty=true}
   else if(vg&&!went&&!v){vx=HOMEi();vg=null}}
  const hm=HOMEi(),glid=went||vg||Math.abs(vx-hm)>.01,shownF=glid&&cF>=hm-.6?vx:cF;   /* à l'arrêt, après un choix de métier : l'image du glissement */
  if(cQ>.12&&cF<hm-.5&&inCur()&&inCur().film.get(0)){snap();cF=tF=hm;dirty=true}   /* passé le mur alors que la rue n'est pas encore à l'arrêt : un fondu, et la salle prend la suite */
  /* la salle s'allume à l'arrêt (la caméra posée, sa première image prête) ; s'éteint si l'on repart vers la rue */
  const z=inCur(),atStop=Math.abs(cF-hm)<.5&&cP>=HOLD[0]-.01&&!vg&&Math.abs(vx-(went?FACi(met):hm))<.05,ia=atStop&&z&&z.film.get(0)?1:0;
  if(inA!==ia){inA+=(ia-inA)*(1-Math.exp(-dt/.16));if(Math.abs(ia-inA)<.004)inA=ia;dirty=true}
  /* la suite : son image suit la position, sans trou, comme la rue */
  let tI=inOf(cQ);if(z&&cF>=hm-.5&&mode===1)cI=follow(z.film,cI,rest?Math.round(tI):tI,dt,rest);else cI=0;if(z&&mode!==1)z.film.seek(cI);
  const wantIn=(cQ>.0005||cI>.02)&&cF>=hm-.5&&!vg?1:0;if(mode!==1)inOk=false;
  if(wantIn&&z&&z.film.get(Math.round(cI))){if(!mode&&inA<.95)snap();mode=1}else if(!wantIn&&mode){mode=0;if(inA<.95)snap()}else if(wantIn&&!z&&ins[inKey()]&&ins[inKey()].bad)mode=2;else if(!wantIn)mode=0;
  if(xa>0){xa=Math.max(0,xa-dt/xd);if(!xa)xd=.35;dirty=true}
  if(mode===1){if(dirty||cI!==lastI){if(drawIn(cI))inOk=inOk||Math.abs(cI-inOf(cQ))<4||cI>(INS[set]-1)*.6;else if(!inOk)draw(shownF);lastI=cI;last=-1}}
  else if(mode===2){if(dirty||last!==hm){draw(hm);last=hm}}   /* secours : la rue reste à l'arrêt */
  else if(dirty||shownF!==last){draw(shownF);last=shownF;lastI=-1}
  /* une seule grande série d'images décodées à la fois : la rue dort dans la salle, la salle dort loin de l'arrêt */
  if(s0){if(cQ>.12)s0.film.sleep();else if(vis)s0.film.wake()}if(z&&cP<.5)z.film.sleep();
  ui(now);zoom();if(!frz&&(cP!==P||cF!==tF||Math.abs(cI-tI)>.004&&z||inA!==ia||xa>0||vg||now-arrT<1000))tick();else t0=0}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;const s=store[set];if(s){if(vis)s.film.wake();else s.film.sleep()}tick()},{rootMargin:'50% 0px'}).observe(walk);   /* loin de la rue : ses images décodées sont libérées */
 poster.addEventListener('error',()=>{poster.style.visibility='hidden'});
 function toStill(){thumb();u.classList.add('static');poster.addEventListener('load',tick);const k=r0();poster.src=base(k)+'stop.jpg';poster.parentNode.querySelectorAll('source').forEach(s=>s.remove())}
 if(!LIVE)toStill();
 /* le film ne vient pas (réseau, fichier absent) : la page passe au rendu fixe, comme en mouvement réduit ; rien ne bloque l'offre ni le contact */
 function flat(){if(!LIVE)return;const deep=walk.getBoundingClientRect().top<-innerHeight*.3;LIVE=false;t1.classList.remove('off');u.classList.add('nofilm');document.body.classList.remove('hero-cta');
  for(const el of [t1,...says,stop,cue,sbar,end]){el.style.opacity='';el.style.visibility='';el.style.transform='';el.style.translate=''}memo.clear();toStill();geo();go(step,false);if(deep)stop.scrollIntoView({block:'start'})}
 function r0(){return scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d'}
 addEventListener('resize',()=>{size();tick()});
 /* retour d'un autre onglet, de l'arrière-plan ou du cache (bouton Retour) : on redessine (iOS peut avoir vidé le canevas) */
 const redo=()=>{const s=store[set];if(s&&vis)s.film.wake();size();dirty=true;last=-1;lastI=-1;tick()};
 addEventListener('pageshow',e=>{if(e.persisted)redo()});document.addEventListener('visibilitychange',()=>{if(!document.hidden)redo()});
 if(LIVE){addEventListener('scroll',()=>{lastS=performance.now();arm();if(vis)tick()},{passive:true});
  for(const ev of ['wheel','touchstart','keydown','pointerdown'])addEventListener(ev,()=>{moved=true;arm();more()},{passive:true,once:true});
  {const pm=e=>{if(e.pointerType!=='mouse'||!(e.movementX||e.movementY))return;removeEventListener('pointermove',pm);moved=true;more()};addEventListener('pointermove',pm,{passive:true})}   /* le reste dès que la souris bouge vraiment */
  requestAnimationFrame(()=>u.classList.add('go'))}else u.classList.add('go');
 /* « Voir la démo », « La démo », « Passer l'intro » : tous vont à l'arrêt (le portail reste fermé : on y choisit d'abord) */
 const toStop=skip=>{arm();geo();if(LIVE){jmp={all:!!skip,t:0,go:performance.now()};if(skip){e3halt();scrollTo({top:yAt(STOP),behavior:'instant'})}else e3glide(yAt(STOP));more();tick()}else stop.scrollIntoView({block:'nearest'})};
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href="#choix"]');if(!a)return;e.preventDefault();toStop(a.classList.contains('r-skip'))});
 /* « Entrer » : la porte s'ouvre, on traverse la salle jusqu'à la fin du site */
 const yQ=q=>walk.getBoundingClientRect().top+scrollY-hh+GATE[1]*D+q*L;
 function enter(){rel();arm();geo();open(3000);need(4);if(LIVE)e3glide(yQ(END),1900);else end.scrollIntoView({block:'nearest'})}
 end.addEventListener('focusout',e=>{if(!end.contains(e.relatedTarget))end.classList.remove('kb')});
 const kb=e=>{try{return e.target.matches(':focus-visible')}catch(_){return false}},jump=(y,ms,e)=>{if(kb(e)){e3halt();scrollTo({top:y,behavior:'instant'})}else e3glide(y,ms)};
 end.addEventListener('focusin',e=>{end.classList.add('kb');if(LIVE&&!end.classList.contains('on')){open(3000);need(4);geo();jump(yQ(END),600,e)}});
 if(new URLSearchParams(location.search).get('e')&&!location.hash)addEventListener('load',()=>setTimeout(toStop,80),{once:true});
 /* au clavier : entrer dans la carte (Tab) amène la caméra à l'arrêt */
 stop.addEventListener('focusin',e=>{if(LIVE&&!u.classList.contains('stop')){if(kb(e)){arm();geo();jump(yAt(STOP),0,e);arrT=performance.now()-2000}else toStop()}});
 t1.addEventListener('focusin',e=>{if(LIVE&&t1.classList.contains('off'))jump(yAt(0),undefined,e)});
 /* ——— le clavier du téléphone : la carte de l'étape 2 se colle au-dessus du clavier, sur une ligne ; la scène se recadre sur l'enseigne (jusqu'à ×1,6, l'enseigne entière à l'écran) ——— */
 nameIn.addEventListener('focus',()=>{kbY=scrollY;if(step!==2)go(2,false)});
 function rel(){if(document.activeElement===nameIn){kbY=-1;nameIn.blur()}}
 let kbH=0;
 nameIn.addEventListener('blur',e=>{const was=frz;frz=false;kbH=0;stop.style.setProperty('--kb','0px');flag(stop,'kbo',false);
  const to=e.relatedTarget;if(step===2&&!(to&&stop.contains(to)))setTimeout(()=>{if(step===2&&document.activeElement!==nameIn&&!stop.contains(document.activeElement))go(3,false)},0);   /* « Terminé » ou toucher hors du champ : l'étape 3 */
  if(was&&LIVE&&kbY>=0&&Math.abs(scrollY-kbY)>4){const y=kbY;requestAnimationFrame(()=>e3glide(y,420))}kbY=-1;tick()});
 const vv=window.visualViewport;if(vv){const k=()=>{const o=document.activeElement===nameIn?Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop)):0;kbH=o;stop.style.setProperty('--kb',o+'px');flag(stop,'kbo',o>40);tick()};vv.addEventListener('resize',k);vv.addEventListener('scroll',k)}
 let zm='';
 function zoom(){let t='';if(COARSE&&kbH>40&&signQ&&document.activeElement===nameIn){const sr=stg.getBoundingClientRect(),c=signQ.c,f=signQ.f,sx=f.ox+(c[0][0]+c[1][0])/2*f.w,sy=f.oy+(c[0][1]+c[3][1])/2*f.h,sw=Math.abs(c[1][0]-c[0][0])*f.w,S=clamp(.88*sr.width/(sw||1),1,1.6);
   const top=Math.max(sr.top,(vv?vv.offsetTop:0))-sr.top,bot=(vv?vv.offsetTop+vv.height:innerHeight)-72-sr.top,ty=(top+bot)/2;
   t=`translate(${(sr.width/2-sx).toFixed(1)}px,${(ty-sy).toFixed(1)}px) scale(${S})`;scene.style.transformOrigin=sx.toFixed(1)+'px '+sy.toFixed(1)+'px'}
  if(t!==zm){zm=t;scene.style.transform=t;flag(u,'zoom',!!t)}}
 /* ——— le portail. Un lancer, même fort, s'arrête à l'arrêt ; pour continuer, il faut un nouveau geste une fois arrivé.
    v22 : aux étapes 1 et 2, le premier glissé neuf ne passe pas (« Continuer sans choisir ↓ », 2 s), le second passe ; à l'étape 3, le premier passe.
    « Entrer », un lien, « Passer l'intro » passent toujours. Remonter n'est jamais bloqué ; arriver d'en dessous (ou par un lien) ouvre le portail. ——— */
 let nudged=false,nt=0,nt0=0,tY0=-1,tX0=0,swp=false;const nudge=()=>{nudged=true;u.classList.add('push');clearTimeout(nt);nt=setTimeout(()=>u.classList.remove('push'),2000)};
 const pass1=()=>{if(step===3||nudged)open();else nudge()};
 let gate='closed',pP=-1,lastW=0,rt=0,wt=0,tY=-1,pass=0,w0=0,wMax=0,pt=0;
 const rest=()=>{const p=curP();if(gate==='closed'&&p>=HOLD[0]-.03&&p<=GATE[1]+.005&&!e3touch.n&&performance.now()-lastW>350)gate='rested'};
 const open=(ms=0)=>{gate='open';u.classList.remove('push');if(ms)pass=performance.now()+ms};
 if(LIVE){
  addEventListener('scroll',()=>{const p=curP();clearTimeout(rt);rt=setTimeout(rest,320);
   if(p<GATE[0]-.03){if(performance.now()>pass)gate='closed'}if(p<HOLD[0]-.06)nudged=false;
   if(gate!=='open'&&pP<0&&p>GATE[1]+.01)gate='open';
   else if(gate!=='open'&&pP>=0&&pP>GATE[1]+.01&&p>GATE[1]+.01)gate='open';
   else if((gate!=='open'||!rdy()&&performance.now()>pass&&pP<=GATE[1]+.01)&&pP>=0&&p>GATE[1]+.002&&!e3gliding()){geo();scrollTo({top:yAt(GATE[1]),behavior:'instant'});pP=GATE[1];if(gate!=='open'&&rdy()&&performance.now()-nt0>600){nt0=performance.now();nudge()}   /* v22.2 : chaque rebond contre le mur le dit (« Continuer sans choisir ↓ ») ; le geste suivant passe */
    if(COARSE){const h=document.documentElement;h.style.overflow='hidden';setTimeout(()=>{h.style.overflow=''},160)}return}   /* le mur ; au doigt, l'élan est coupé */
   pP=p},{passive:true});
  addEventListener('wheel',e=>{const t=performance.now(),quiet=t-lastW>350;lastW=t;if(e.deltaY<=0)return;
   if(gate==='rested'&&quiet){pass1();if(gate==='open')return}
   if((gate!=='open'||!rdy()&&performance.now()>pass)&&curP()>=GATE[1]-.012&&curP()<GATE[1]+.05){e.preventDefault();
    if(quiet||!w0||!rdy()){w0=t;wMax=0}wMax=Math.max(wMax,e.deltaY);u.classList.add('push');clearTimeout(pt);pt=setTimeout(()=>u.classList.remove('push'),2600);
    if(t-w0>1200&&e.deltaY>=Math.max(4,wMax*.6)){w0=0;open();return}   /* roulette tenue ~1,2 s : on continue */
    clearTimeout(wt);wt=setTimeout(()=>{if(gate!=='open'&&Math.abs(curP()-STOP)>.012){geo();e3glide(yAt(STOP))}},300)}},{passive:false});
  {const mb=u.querySelector('.r-more');if(mb)mb.addEventListener('click',()=>{open(1500);e3glide(scrollY+innerHeight*.7)})}
  addEventListener('touchstart',e=>{tY=e.touches[0]?e.touches[0].clientY:-1;tY0=tY;tX0=e.touches[0]?e.touches[0].clientX:0;swp=false},{passive:true,capture:true});
  addEventListener('touchmove',e=>{const y=e.touches[0]?e.touches[0].clientY:-1;const up=tY>=0&&y<tY;tY=y;
   const x=e.touches[0]?e.touches[0].clientX:0;if(!swp&&tY0>=0&&tY0-y>10&&tY0-y>1.5*Math.abs(x-tX0)){swp=true;if(gate==='rested'||nudged&&gate==='closed'&&rdy()&&curP()>=HOLD[0]-.03)pass1()}   /* v22.2 : après un rebond annoncé, le glissé suivant passe (même sans s'être posé) */   /* un glissé vers le bas de la page (pas un tap ; sur le carrousel aussi, s'il est surtout vertical) */
   if((gate!=='open'||!rdy()&&performance.now()>pass)&&up&&e.cancelable&&curP()>=GATE[1]-.004&&curP()<GATE[1]+.05)e.preventDefault()},{passive:false});
  addEventListener('touchend',()=>{clearTimeout(rt);rt=setTimeout(rest,320)},{passive:true});
  addEventListener('keydown',e=>{if(e.target===nameIn&&e.key!=='Tab')return;if(e.target.closest&&e.target.closest('.r-seg')&&/Arrow|Home|End/.test(e.key))return;if(gate==='rested'||['Tab','End','Home'].includes(e.key))open()},true);
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('a[href*="#"]:not([href="#choix"]),.r-enter'))open(3000)},true)}
 /* à l'arrêt, au doigt : un tap qui bouge un peu (jusqu'à 14 px) reste un tap ; le navigateur, lui, l'aurait pris pour un défilement */
 {let t0=null;stop.addEventListener('touchstart',e=>{const el=e.target.closest('a,button,input');const q=e.touches[0];t0=el&&q&&e.touches.length===1&&!e.target.closest('.r-seg')?{el,x:q.clientX,y:q.clientY,t:performance.now(),m:0}:null},{passive:true});
  stop.addEventListener('touchmove',e=>{const q=e.touches[0];if(t0&&q)t0.m=Math.max(t0.m,Math.hypot(q.clientX-t0.x,q.clientY-t0.y))},{passive:true});
  stop.addEventListener('touchend',e=>{const k=t0;t0=null;if(!k)return;const q=e.changedTouches[0];if(!q)return;const m=Math.max(k.m,Math.hypot(q.clientX-k.x,q.clientY-k.y));
   if(m>14||performance.now()-k.t>800)return;const h=document.elementFromPoint(q.clientX,q.clientY);if(!h||!(k.el.contains(h)||h.contains(k.el)))return;
   if(e.cancelable)e.preventDefault();if(k.el.tagName==='INPUT')k.el.focus();else{if(k.el!==nameIn&&!k.el.closest('.r-s2'))rel();k.el.click()}},{passive:false})}
 /* l'aimantation : arrêté juste avant l'arrivée, on se pose à l'arrêt ; dans la salle, en avant la fin du site, en arrière l'arrêt.
    Jamais doigt posé, jamais pendant la frappe ; le moindre geste l'arrête (e3glide). */
 if(LIVE){let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!LIVE||!vis||frz||e3touch.n)return;
  geo();const t=gate==='open'&&Q>.012&&Q<END-.01?(dn>0?yQ(END):yAt(STOP)):P>=HOLD[0]-.06&&P<HOLD[0]&&Q<=.012?yAt(HOLD[0]+.01):gate!=='open'&&P>STOP+.02&&P<=GATE[1]+.005?yAt(STOP):-1;   /* v22 : un glissé retenu contre le mur revient se poser à l'arrêt (la carte, l'enseigne) */if(t>=0)e3glide(t)},260)},{passive:true})}
 {let y0=scrollY;addEventListener('scroll',()=>{const d=scrollY-y0;if(Math.abs(d)>2)dn=d>0?1:-1;y0=scrollY},{passive:true})}
 /* la première mesure attend la première image : l'analyse de la page n'est pas allongée d'une mise en page forcée.
    Le film se charge tout de suite (le premier paquet est déjà demandé par le HTML, en preload) */
 requestAnimationFrame(()=>{size();if(LIVE)arm();ui(performance.now());tick()});
 /* sans le film (mouvement réduit) : le WhatsApp de l'en-tête se retire tant que celui du titre est à l'écran */
 {const w=u.querySelector('.r-wa');if(w)new IntersectionObserver(es=>{if(!LIVE)flag(document.body,'hero-cta',es[0].isIntersecting)},{rootMargin:'-64px 0px 0px 0px'}).observe(w)}
})();

