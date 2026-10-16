
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
 vids:()=>HELLO+' Les vidéos m’intéressent.\nMon commerce et ma commune : ',
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
function e3film(n,R,at,onimg){const bl=new Array(n),bm=new Array(n),bz=new Uint8Array(n);let act=0,on=true,dir=1;
 const free=i=>{const m=bm[i];bm[i]=null;if(!m)return;if(m.close)m.close();else URL.revokeObjectURL(m.src)};
 const asImg=b=>{const m=new Image();m.src=URL.createObjectURL(b);return m.decode().then(()=>m,()=>{URL.revokeObjectURL(m.src);return null})};
 const dec=i=>{bz[i]=1;act++;(window.createImageBitmap?createImageBitmap(bl[i]).catch(()=>asImg(bl[i])):asImg(bl[i])).catch(()=>null).then(m=>{act--;bz[i]=0;
  if(m){bm[i]=m;if(on&&!out(i))onimg(i);else free(i)}pump()})};
 /* la fenêtre décodée regarde devant : 1,5 R dans le sens du mouvement, 0,5 R derrière (même mémoire qu'avant, ±R) */
 const out=i=>{const a=dir>0?i-at:at-i;return a>Math.round(R*1.5)+6||a<-Math.round(R*.5)-6};
 function pump(){if(!on)return;for(let i=0;i<n;i++)if(bm[i]&&out(i))free(i);const A=Math.round(R*1.5),Bk=Math.round(R*.5);
  for(let d=0;d<=A&&act<4;d++)for(const i of d?(d<=Bk?[at+d*dir,at-d*dir]:[at+d*dir]):[at])if(i>=0&&i<n&&bl[i]&&!bm[i]&&!bz[i]&&act<4)dec(i)}
 return{n,get:i=>bm[i],any:()=>bl.some(Boolean),
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
  s.get=get;get(0).then(()=>LIVE&&get(1).then(()=>{s.lv=1;more()}))   /* p2 quand la démo est à l'écran, p3 quand on y avance vraiment */
   .catch(()=>{if(s.film.any())return;if(sc===st.sc&&k===set&&!store[sc+(k==='d'?'m':'d')])load(k==='d'?'m':'d');   /* jeu absent : l'autre jeu, recadré */
    else if(sc===st.sc){busy(false);view.classList.add('nofilm')}})}   /* les deux absents : l'affiche (ou la photo de repli) reste, le site de la démo et les boutons aussi */
 function more(){const s=store[st.sc+set];if(!s||!vis||!s.lv)return;{const r=walk.getBoundingClientRect();if(r.top>innerHeight||r.bottom<0)return}   /* vraiment à l'écran, pas seulement proche */
  const g=n=>{s.lv=0;s.get(n).then(()=>{s.lv=n;more()}).catch(()=>{})};if(s.lv===1)g(2);else if(s.lv===2&&P>.12)g(3)}
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
 function loop(now){raf=0;if(!LIVE){draw(0);return}const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);more();
  flag(document.body,'walking',r.top<=hh+1&&r.bottom>=innerHeight-1&&P>.02);
  const t=camOf(P);if(jump){cur=t;cq=-1;jump=false}cur+=(t-cur)*(1-Math.exp(-dt/.09));if(Math.abs(t-cur)<.0005)cur=t;
  const n1=SETS[set]-1,fs=store[st.sc+set],tq=cur===t?(fs?fs.film.near(cur*n1):Math.round(cur*n1))/n1:cur;   /* au repos : l'image décodée la plus proche, nette */if(cq<0)cq=tq;cq+=(tq-cq)*(1-Math.exp(-dt/.07));if(Math.abs(tq-cq)<.002/n1)cq=tq;
  if(dirty||cq!==last){draw(cq);last=cq}ui(cur);if(cur!==t||cq!==tq)tick();else t0=0}
 let cq=-1;
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(!vis)open(false);if(vis)more();const s=store[st.sc+set];if(s){if(vis)s.film.wake();else s.film.sleep()}tick()},{rootMargin:'50% 0px'}).observe(walk);
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
/* La rue au crépuscule, en haut de page. Faire défiler fait avancer la caméra image par image (rendu d'avance,
   entree3d/scenes/rue.js) : un tour autour du réverbère bleu, la rue, les vitrines, puis l'arrêt devant une enseigne vide
   où le visiteur tape son nom. Les métiers (data-e3) ouvrent l'entrée 3D plus bas (e3d.js). La première image est une
   affiche légère ; les images du film se chargent au premier geste (défilement, molette, toucher, clavier).
   Les images sont placées à pas égal pour l'œil (entree3d/tools/plist.mjs) : un pas de défilement = une image, partout.
   Mouvement réduit : l'image de l'arrêt, immobile. */
(()=>{const u=$('univers');if(!u)return;
 const walk=$('rWalk'),stg=$('rStage'),scene=u.querySelector('.r-scene'),cv=$('rCv'),cx=cv.getContext('2d'),poster=$('rPoster'),pins=$('rPins'),anchor=$('choix');
 const ld=u.querySelector('.r-load'),t1=u.querySelector('.r-t1'),says=[...u.querySelectorAll('.r-say')],stop=$('rStop'),cue=u.querySelector('.r-cue'),nameIn=$('rName'),sign=pins.querySelector('.r-sign'),nm=sign.querySelector('.r-nm'),mets=[...sign.querySelectorAll('.r-met i')],veil=u.querySelector('.r-veil'),seg=u.querySelector('.r-seg'),rsel=$('rSel');
 let LIVE=!RM;const SETS={d:200,m:160},STOP=.78,HOLD=[.66,.90],GATE=[.30,.90],store={};   /* GATE : la zone de capture de l'arrêt, et son mur */
 const COARSE=matchMedia('(pointer:coarse)').matches;let frz=false,moved=false,kbY=-1,SW=1,set='d',W=0,H=0,P=0,cP=-1,cF=0,last=-1,raf=0,dirty=true,vis=true,D=1,hh=64,armed=false,t0=0;
 const base=k=>'img/e3d/rue/'+k+'/';
 /* les images arrivent en 4 paquets (build.py, pack()) : une sur 8 d'abord, puis le reste entre deux */
 function load(k){if(store[k]){store[k].film.wake();return}const n=SETS[k],s=store[k]={film:e3film(n,24,Math.round(cF)||S0[k],()=>{if(k===set){dirty=true;tick()}}),pins:null};
  fetch(base(k)+'pins.json').then(r=>r.json()).then(j=>{s.pins=j;s.k1=j.findIndex(x=>x.p>=.88);dirty=true;tick()}).catch(()=>{});
  if(!LIVE)return;
  const get=g=>e3pack(base(k)+'p'+g+'.txt').then(l=>l.forEach(([i,b])=>s.film.add(i,b)));   /* décodage hors du fil principal (e3d.js) */
  /* tant que le premier paquet n'est pas là, l'affiche reste ; s'il tarde, un mot discret ; s'il échoue, l'affiche (ou le fond) reste et le texte continue */
  const slow=setTimeout(()=>{if(!s.film.any()&&k===set)ld.textContent='Chargement de la rue…'},1200);
  get(0).then(()=>{clearTimeout(slow);ld.textContent='';return Promise.all([get(1),get(2)])}).then(()=>{s.p3=()=>{s.p3=null;get(3).catch(()=>{})};more()},()=>{s.loose=true;dirty=true;tick()})   /* p1 ou p2 absents : le film joue avec ce qu'il a (images plus espacées) plutôt que de rester figé */   /* p3 (les images impaires, le plus lourd) : seulement si l'on avance vraiment */
   .catch(()=>{clearTimeout(slow);ld.textContent='';if(!s.film.any())flat()})}
 function more(){const s=store[set];if(s&&s.p3&&(P>.4||moved))s.p3()}   /* p3 : dès que la personne bouge (ou si elle arrive plus bas) */
 const arm=()=>{if(armed)return;armed=true;load(set)};
 const geo=()=>{hh=parseFloat(getComputedStyle(stg).top)||0;D=Math.max(1,walk.offsetHeight-stg.offsetHeight);anchor.style.top=(STOP*D)+'px'};
 function size(){const r=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.round(r.width*d),h=Math.round(r.height*d);
  SW=r.width||1;if(w!==W||h!==H){W=cv.width=w;H=cv.height=h;dirty=true}   /* la barre d'adresse du téléphone bouge : on ne vide le canevas que si sa taille change */
  const k=r.width<r.height*.95?'m':'d';if(k!==set){if(store[set])store[set].film.sleep();set=k;if(armed)load(k)}if(!LIVE)load(k);geo()}
 /* le nom : sur l'enseigne vide, en néon. Seules les lettres nouvelles s'allument (les autres ne bougent pas) ;
    la largeur et la taille suivent en douceur (transition sur width et scale), sans à-coup. Il passe aussi sur l'entrée plus bas. */
 let shown='';
 const fit=()=>{e3meas.font='400 86px "Cormorant Garamond"';const w=e3meas.measureText(shown).width;nm.style.setProperty('--w',Math.ceil(w)+'px');nm.style.setProperty('--s',Math.min(1,860/(w||1)).toFixed(3))};
 function named(v,push){const t=v.trim().slice(0,40);let k=0;while(k<t.length&&k<shown.length&&t[k]===shown[k])k++;
  const bs=[...nm.children];for(let i=bs.length-1;i>=k;i--)bs[i].remove();
  for(let i=k;i<t.length;i++){const b=document.createElement('b');b.textContent=t[i];if(push)b.className='in';b.style.animationDelay=Math.min(i-k,6)*35+'ms';nm.appendChild(b)}
  shown=t;sign.classList.toggle('on',!!t);fit();
  if(push){if(window.e3boot)e3boot();const e=$('eName');if(e&&e.value!==v){e.value=v;e.dispatchEvent(new Event('input'))}}}
 /* le métier : choisi sur place, il s'écrit sous l'enseigne (fondu enchaîné) et prépare la démo, sans quitter la rue.
    « Entrer dans la démo » y va ; le nom et le métier suivent jusque dans le message WhatsApp (e3d.js). */
 let met='',mi=0;
 function metier(k,push){if(!E3[k]||k===met)return;met=k;
  [...seg.children].forEach(b=>{const on=b.dataset.m===k;b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1});rsel.value=k;
  const a=mets[mi],b=mets[mi^=1];b.textContent=E3[k].lab;a.classList.remove('a');b.classList.add('a');
  if(push){if(window.e3boot)e3boot();if(window.e3pick)e3pick(k)}}
 seg.addEventListener('click',e=>{const b=e.target.closest('button');if(b)metier(b.dataset.m,true)});
 seg.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const bs=[...seg.children],i=bs.findIndex(b=>b.dataset.m===met),n=bs[(i+(/Right|Down/.test(e.key)?1:bs.length-1))%bs.length];metier(n.dataset.m,true);n.focus()});
 rsel.addEventListener('change',()=>metier(rsel.value,true));
 document.addEventListener('oonde-e3',e=>{metier(e.detail.sc,false);if(e.detail.name&&!nameIn.value){nameIn.value=e.detail.name;named(e.detail.name,false)}});
 metier(($('eSel')&&$('eSel').value)||'restaurant',false);
 u.querySelector('.r-enter').addEventListener('click',e=>{if(!window.e3go)return;e.preventDefault();e3go(met||'restaurant',!nameIn.value.trim())});
 nameIn.addEventListener('input',()=>named(nameIn.value,true));nameIn.addEventListener('keydown',e=>{if(e.key==='Enter')nameIn.blur()});
 {const e=$('eName');if(e&&e.value){nameIn.value=e.value;named(e.value,false)}else named('',false)}
 if(document.fonts)document.fonts.ready.then(fit);
 /* une image : les deux voisines fondues l'une dans l'autre (si elles sont décodées et à deux images au plus) ; les enseignes, interpolées de même.
    Sinon l'image décodée la plus proche, seule : jamais deux images éloignées l'une sur l'autre (pas de « fantôme » pendant le chargement). */
 const pinAt=(s,i)=>s.pins&&s.pins[i]?s.pins[i].pins:null;
 function draw(f){const s=store[set];if(!W||!H||!s)return;const n=SETS[set];f=clamp(f,0,n-1);s.film.seek(f);const r=s.film.pair(f);if(!r)return;const[i0,i1,a]=r;if(!s.loose&&Math.abs(i0-f)>1.01&&Math.abs(i1-f)>1.01)return;   /* jamais une image lointaine à la place de la bonne (l'affiche reste en attendant) */if(window.__rd)__rd.push([i0,i1,+a.toFixed(2)]);
  const im=s.film.get(i0),sc=Math.max(W/im.width,H/im.height),w=im.width*sc,h=im.height*sc,ox=(W-w)/2,oy=(H-h)/2;
  cx.globalAlpha=1;cx.drawImage(im,ox,oy,w,h);if(a>.01&&i1!==i0){cx.globalAlpha=a;cx.drawImage(s.film.get(i1),ox,oy,w,h);cx.globalAlpha=1}
  flag(u,'live',true);dirty=false;
  const d=W/SW,p=s.pins&&s.pins[i0]?s.pins[i0].p:0;place(e3mix(pinAt(s,i0),pinAt(s,i1),a),{ox:ox/d,oy:oy/d,w:w/d,h:h/d},p)}
 function place(pp,f,p){for(const el of pins.children){const q=pp&&pp.find(x=>x.id===el.dataset.id);
  if(!q||q.vis<=0){el.style.opacity=0;continue}e3quad(el,q.c,1000,127,f);
  if(el===sign){el.style.opacity=q.vis;continue}
  const mx=(q.c[0][0]+q.c[1][0])/2,near=clamp(1-Math.abs(mx-.5)/.42,0,1);el.style.opacity=(q.vis*Math.min(1,near*1.8)*(p>.84?0:1)).toFixed(2)}}
 /* le rythme, en images : un temps sur le globe, le tour et la rue d'un seul geste, l'arrêt devant l'enseigne, la porte.
    La vitesse monte et descend en douceur (trapèze) : pas de départ ni d'arrêt sec. */
 const trap=(x,a,b,ra,rb)=>{const L=b-a,t=clamp(x-a,0,L),v=1/(L-ra/2-rb/2);return t<ra?v*t*t/(2*ra):t<=L-rb?v*(ra/2+t-ra):1-v*(L-t)**2/(2*rb)};
 const S0={d:62,m:52};   /* on part dans la rue (open.jpg : image 62 sur ordinateur, les vitrines devant le globe, 52 sur téléphone), les vitrines déjà là ; le réverbère passe sur le côté */
 function frameOf(P){const s=store[set],n=SETS[set],k1=s&&s.k1>0?s.k1:Math.round((n-1)*.935),a=S0[set];
  return P<HOLD[0]?a+(k1-a)*trap(P,.03,HOLD[0],.06,.1):P<HOLD[1]?k1:k1+(n-1-k1)*trap(P,HOLD[1],1,.04,.001)}   /* l'arrêt : un quart du défilement, l'image ne bouge pas */
 const ss=x=>x*x*(3-2*x),fade=(a,b,c,d)=>ss(Math.min(clamp((cP-a)/(b-a||1),0,1),clamp((d-cP)/(d-c||1),0,1)));
 /* les textes : opacity et transform seulement, et on n'écrit un style que s'il change (pas de recalcul inutile à chaque image) */
 const memo=new Map(),put=(el,k,v)=>{const m=memo.get(el)||{};if(m[k]!==v){m[k]=v;memo.set(el,m);el.style[k]=v}};
 const flag=(el,c,on)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
 function ui(){if(!LIVE)return;
  const h=ss(clamp((.12-cP)/.07,0,1));put(t1,'opacity',h.toFixed(3));flag(t1,'off',cP>.12);   /* caché à l'œil seulement : le h1 reste dans l'arbre d'accessibilité ; ses boutons ne prennent plus le clic (CSS) */{const v=h.toFixed(2);if(veil.dataset.hv!==v){veil.dataset.hv=v;veil.style.setProperty('--hv',v)}}flag(document.body,'hero-cta',h>.5&&vis);put(cue,'opacity',clamp((.03-cP)/.03,0,1).toFixed(2));
  const W3=[[.12,.145,.175,.2],[.19,.215,.235,.255],[.93,.96,1.1,1.2]];   /* les deux phrases passent avant la zone de l'arrêt */
  says.forEach((el,j)=>{const[a,b,c,d]=W3[j];put(el,'opacity',fade(a,b,c,d).toFixed(3));put(el,'transform',`translateY(${((1-ss(clamp((cP-a)/(b-a),0,1)))*14).toFixed(1)}px)`)});
  /* la barre de l'arrêt : arrive pendant que la caméra se pose, repart en douceur quand on passe la porte */
  const e=frz?1:ss(Math.min(clamp((cP-GATE[0]+.05)/.05,0,1),clamp((.98-cP)/.04,0,1)));   /* la barre : là sur toute la zone de l'arrêt ; elle ne part qu'une fois le portail franchi */put(stop,'opacity',e.toFixed(3));put(stop,'transform',`translateY(${((1-e)*14).toFixed(1)}px)`);
  flag(stop,'on',e>.02);flag(u,'stop',e>.5)}   /* jamais inert : on l'atteint au clavier (voir focusin plus bas) */
 /* mouvement réduit : l'affiche de l'arrêt, et le nom posé sur son enseigne */
 function still(){const s=store[set];if(!s||!s.pins||!poster.naturalWidth)return;const i=s.k1>0?s.k1:0,rw=SW,rh=scene.clientHeight,sc=Math.max(rw/poster.naturalWidth,rh/poster.naturalHeight),w=poster.naturalWidth*sc,h=poster.naturalHeight*sc;
  place(pinAt(s,i),{ox:(rw-w)/2,oy:(rh-h)/2,w,h},1)}
 function tick(){if(!raf)raf=requestAnimationFrame(loop)}
 /* l'inertie : la page suit le défilement avec ~180 ms de retard, comme une caméra portée, jamais par à-coups ;
    une fois arrêtée, elle se pose en douceur sur l'image nette la plus proche (le fondu ne sert qu'en mouvement). */
 function loop(now){raf=0;const dt=Math.min(.1,t0?(now-t0)/1000:.016);t0=now;
  const r=walk.getBoundingClientRect();P=clamp((hh-r.top)/D,0,1);
  if(!LIVE){still();return}
  if(P>.4)more();
  if(cP<0){cP=P;cF=Math.round(frameOf(P))}
  /* le nom a le focus à l'arrêt : tout reste figé, même si le clavier du téléphone fait bouger la page */
  if(COARSE&&document.activeElement===nameIn&&cP>=HOLD[0]-.02&&cP<=HOLD[1]+.02)frz=true;
  if(!frz){cP+=(P-cP)*(1-Math.exp(-dt/.2));if(Math.abs(P-cP)<.0003)cP=P}
  const F=frameOf(cP),s0=store[set];let tF=cP===P?Math.round(F):F;
  if(s0&&s0.loose&&s0.film.get(s0.film.near(cF))){if(!s0.film.get(Math.round(cF)))cF=s0.film.near(cF);if(cP===P)tF=s0.film.near(tF)}
  else if(s0&&s0.film.get(Math.round(cF))){if(cP===P)tF=s0.film.near(tF);tF=s0.film.reach(cF,tF)}else tF=cF;   /* tant que l'image affichée (l'affiche) n'a pas son double décodé, le film ne part pas */   /* une image pas encore décodée : le film l'attend, il ne la saute pas */
  {const st=tF-cF,dl=st*(1-Math.exp(-dt/.07));cF+=clamp(dl,-1,1)}if(Math.abs(tF-cF)<.004)cF=tF;   /* une image au plus par image affichée : aucun trou, même lancé fort */
  if(dirty||cF!==last){draw(cF);last=cF}ui();if(!frz&&(cP!==P||cF!==tF))tick();else t0=0}
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;const s=store[set];if(s){if(vis)s.film.wake();else s.film.sleep()}tick()},{rootMargin:'50% 0px'}).observe(walk);   /* loin de la rue : ses images décodées sont libérées */
 poster.addEventListener('error',()=>{poster.style.visibility='hidden'});   /* affiche absente : le fond de nuit, les textes restent lisibles */
 function toStill(){u.classList.add('static');poster.addEventListener('load',tick);poster.src=base(r0())+'stop.jpg';const ps=poster.parentNode.querySelector('source');if(ps)ps.srcset=base('m')+'stop.jpg'}
 if(!LIVE)toStill();
 /* le film ne vient pas (réseau, fichier absent) : la page passe au rendu fixe, comme en mouvement réduit ; rien ne bloque l'offre ni le contact */
 function flat(){if(!LIVE)return;const deep=walk.getBoundingClientRect().top<-innerHeight*.3;LIVE=false;t1.classList.remove('off');u.classList.add('nofilm');document.body.classList.remove('hero-cta');
  for(const el of [t1,...says,stop,cue]){el.style.opacity='';el.style.visibility='';el.style.transform='';el.style.translate=''}memo.clear();toStill();geo();if(deep)stop.scrollIntoView({block:'start'})}
 function r0(){return scene.getBoundingClientRect().width<scene.getBoundingClientRect().height*.95?'m':'d'}
 addEventListener('resize',()=>{size();tick()});
 if(LIVE){addEventListener('scroll',()=>{arm();if(vis)tick()},{passive:true});
  /* le film ne se charge qu'au premier geste : qui repart tout de suite ne le télécharge pas (l'affiche est déjà la bonne image) */
  for(const ev of ['wheel','touchstart','keydown','pointerdown'])addEventListener(ev,()=>{moved=true;arm();more()},{passive:true,once:true});
  requestAnimationFrame(()=>u.classList.add('go'))}else u.classList.add('go');
 /* « Passer l'intro » : sans saut brutal, jusqu'à l'arrêt */
 const yAt=p=>walk.getBoundingClientRect().top+scrollY-hh+p*D;
 const toStop=()=>{arm();geo();if(LIVE)e3glide(yAt(STOP));else stop.scrollIntoView({block:'nearest'})};
 u.querySelector('.r-skip').addEventListener('click',e=>{e.preventDefault();toStop()});
 /* au clavier : entrer dans la barre (Tab) amène la caméra à l'arrêt */
 stop.addEventListener('focusin',()=>{if(LIVE&&!u.classList.contains('stop'))toStop()});
 /* revenir au titre au clavier (Maj+Tab) : la caméra remonte au début */
 t1.addEventListener('focusin',()=>{if(LIVE&&t1.classList.contains('off'))e3glide(yAt(0))});
 /* le clavier du téléphone : on se souvient d'où l'on était, la barre reste au-dessus du clavier, et on y revient en fermant */
 nameIn.addEventListener('focus',()=>{kbY=scrollY});
 nameIn.addEventListener('blur',()=>{const was=frz;frz=false;stop.style.setProperty('--kb','0px');if(was&&LIVE&&kbY>=0&&Math.abs(scrollY-kbY)>4){const y=kbY;requestAnimationFrame(()=>e3glide(y,420))}kbY=-1;tick()});
 const vv=window.visualViewport;if(vv){const kb=()=>{const o=document.activeElement===nameIn?Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop)):0;stop.style.setProperty('--kb',o+'px')};vv.addEventListener('resize',kb);vv.addEventListener('scroll',kb)}
 /* le portail. Un lancer, même fort, s'arrête à l'arrêt ; pour continuer, il faut un nouveau geste une fois arrivé
    (doigt reposé, nouvelle molette après une pause, clavier) ou « Entrer dans la démo », un lien, « Passer l'intro ».
    Remonter n'est jamais bloqué ; arriver d'en dessous (ou par un lien) ouvre le portail. */
 let gate='closed',pP=-1,lastW=0,rt=0,wt=0,tY=-1,pass=0;const curP=()=>(hh-walk.getBoundingClientRect().top)/D;
 const rest=()=>{const p=curP();if(gate==='closed'&&p>=HOLD[0]-.03&&p<=GATE[1]+.005&&!e3touch.n&&performance.now()-lastW>350)gate='rested'};
 const open=(ms=0)=>{gate='open';if(ms)pass=performance.now()+ms};   /* ms : un saut voulu (lien, bouton) passe la rue entière sans être refermé */
 if(LIVE){
  addEventListener('scroll',()=>{const p=curP();clearTimeout(rt);rt=setTimeout(rest,320);
   if(p<GATE[0]-.03){if(performance.now()>pass)gate='closed'}
   else if(gate!=='open'&&pP<0&&p>GATE[1]+.01)gate='open';   /* arrivé en dessous (lien, rechargement) */
   else if(gate!=='open'&&pP>=0&&pP>GATE[1]+.01&&p>GATE[1]+.01)gate='open';   /* on remonte depuis la démo */
   else if(gate!=='open'&&pP>=0&&p>GATE[1]+.002&&!e3gliding()){geo();scrollTo({top:yAt(GATE[1]),behavior:'instant'});pP=GATE[1];
    if(COARSE){const h=document.documentElement;h.style.overflow='hidden';setTimeout(()=>{h.style.overflow=''},160)}return}   /* le mur ; au doigt, l'élan est coupé */
   pP=p},{passive:true});
  addEventListener('wheel',e=>{const t=performance.now(),quiet=t-lastW>350;lastW=t;if(e.deltaY<=0)return;
   if(gate==='rested'&&quiet){open();return}
   if(gate!=='open'&&curP()>=GATE[1]-.012&&curP()<GATE[1]+.05){e.preventDefault();   /* l'inertie bute sur le mur ; quand elle s'éteint, on se pose à l'arrêt */
    clearTimeout(wt);wt=setTimeout(()=>{if(gate!=='open'&&Math.abs(curP()-STOP)>.012){geo();e3glide(yAt(STOP))}},300)}},{passive:false});   /* l'inertie du pavé tactile bute sur le mur */
  addEventListener('touchstart',e=>{tY=e.touches[0]?e.touches[0].clientY:-1;if(gate==='rested')open()},{passive:true,capture:true});
  addEventListener('touchmove',e=>{const y=e.touches[0]?e.touches[0].clientY:-1;const up=tY>=0&&y<tY;tY=y;if(gate!=='open'&&up&&e.cancelable&&curP()>=GATE[1]-.004&&curP()<GATE[1]+.05)e.preventDefault()},{passive:false});
  addEventListener('touchend',()=>{clearTimeout(rt);rt=setTimeout(rest,320)},{passive:true});
  addEventListener('keydown',e=>{if(e.target===nameIn&&e.key!=='Tab')return;if(gate==='rested'||['Tab','End','Home'].includes(e.key))open()},true);
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('a[href*="#"],[data-e3],.r-enter'))open(3000)},true)}
 /* à l'arrêt, au doigt : un tap qui bouge un peu (jusqu'à 14 px) reste un tap ; le navigateur, lui, l'aurait pris pour un défilement */
 {let t0=null;stop.addEventListener('touchstart',e=>{const el=e.target.closest('a,button,input');const q=e.touches[0];t0=el&&q&&e.touches.length===1?{el,x:q.clientX,y:q.clientY,t:performance.now(),m:0}:null},{passive:true});
  stop.addEventListener('touchmove',e=>{const q=e.touches[0];if(t0&&q)t0.m=Math.max(t0.m,Math.hypot(q.clientX-t0.x,q.clientY-t0.y))},{passive:true});
  stop.addEventListener('touchend',e=>{const k=t0;t0=null;if(!k)return;const q=e.changedTouches[0];if(!q)return;const m=Math.max(k.m,Math.hypot(q.clientX-k.x,q.clientY-k.y));
   if(m>14||performance.now()-k.t>800)return;const h=document.elementFromPoint(q.clientX,q.clientY);if(!h||!(k.el.contains(h)||h.contains(k.el)))return;
   if(e.cancelable)e.preventDefault();if(k.el.tagName==='INPUT')k.el.focus();else k.el.click()},{passive:false})}
 /* l'aimantation : si le défilement s'arrête juste avant ou juste après l'arrêt, la caméra s'y pose, en douceur.
    Jamais doigt posé, jamais pendant la frappe ; le moindre geste l'arrête (e3glide). */
 if(LIVE){let idle=0;addEventListener('scroll',()=>{if(e3gliding())return;clearTimeout(idle);idle=setTimeout(()=>{if(!LIVE||!vis||frz||e3touch.n)return;
  const t=gate==='open'&&P>HOLD[1]+.01&&P<.99?1:P>=GATE[0]&&P<=.97&&Math.abs(P-STOP)>.012?STOP:-1;if(t>0){geo();e3glide(yAt(t))}},260)},{passive:true})}
 /* la première mesure attend la première image : l'analyse de la page n'est pas allongée d'une mise en page forcée */
 requestAnimationFrame(()=>{size();if(LIVE&&scrollY>0)arm();ui();tick();
  /* le film se charge dès que la page est posée (sans attendre un geste) : le premier lancer trouve ses images */
  if(LIVE)(window.requestIdleCallback||setTimeout)(arm,{timeout:1200})});
 /* sans le film (mouvement réduit) : le WhatsApp de l'en-tête se retire tant que celui du titre est à l'écran */
 {const w=u.querySelector('.r-wa');if(w)new IntersectionObserver(es=>{if(!LIVE)flag(document.body,'hero-cta',es[0].isIntersecting)},{rootMargin:'-64px 0px 0px 0px'}).observe(w)}
})();

/* Le nom tapé dans la rue va sur l'entrée choisie ; arrivé avec ?e=, on entre directement */
(()=>{const e=$('eName');
 /* sur téléphone, le réglage se replie en une ligne : il ne cache plus la façade */
 const tr=document.querySelector('.e-try'),fb=document.createElement('button');fb.type='button';fb.className='e-fold';fb.setAttribute('aria-expanded','false');tr.before(fb);
 const lab=d=>{fb.innerHTML=`<b>${esc(d.name||'Votre nom')}</b>${d.name?'':' <span>sur l’enseigne, facultatif</span>'}<i>${d.name?'Modifier':'Ajouter'}</i>`};lab({name:e.value,sc:new URLSearchParams(location.search).get('e')||(()=>{try{return JSON.parse(localStorage.getItem('oonde-e3')||'{}').sc}catch(x){}})()||'restaurant'});
 document.addEventListener('oonde-e3',ev=>lab(ev.detail));fb.addEventListener('click',()=>{const o=tr.classList.toggle('open');fb.setAttribute('aria-expanded',o);if(o)e.focus({preventScroll:true})});
 const k=new URLSearchParams(location.search).get('e');if(k&&E3[k]&&!location.hash)addEventListener('load',()=>setTimeout(()=>window.e3go&&e3go(k,!new URLSearchParams(location.search).get('n')),60))})();

