
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
(()=>{const q=new URLSearchParams(location.hash.slice(1)),key=T[q.get('m')]?q.get('m'):'coiffure',t=T[key],sv=clamp(+q.get('c')||0,0,2);
 const name=(q.get('n')||'').slice(0,40),town=TOWNS.includes(q.get('v'))?q.get('v'):'',[c,ct]=t.styles[sv];
 const s=$('s');s.style.setProperty('--c',c);s.style.setProperty('--ct',ct);
 const h=town?t.h.replace('{t}',town):t.h.replace(/ (à|de) \{t\}/,''),nm=name||'Votre commerce';
 document.title=nm+' · Exemple de site · OONDE';
 $('sName').textContent=nm;$('sName2').textContent=nm;$('sTag').textContent=t.label+(town?' · '+town:'');
 $('sH').textContent=name||h;$('sSub').textContent=(name?h+' ':'')+t.sub;$('sOpen').textContent=t.open;
 $('sCta').textContent=t.cta;$('sCta2').textContent=t.cta;$('sSec').textContent=t.sec;$('sSec2').textContent=t.sec;
 $('sRows').innerHTML=t.rows.map(([a,b])=>`<li><span>${esc(a)}</span><b>${esc(b)}</b></li>`).join('');
 $('sAbout').textContent=t.about;$('sHours').innerHTML=t.hours;$('sAddr').innerHTML='Votre adresse<br>'+esc(town||'Votre commune');
 $('sFoot').textContent=t.label+(town?' à '+town:'');
 const hero=$('sHero');if(t.photo){hero.style.backgroundImage=`url(${innerWidth*(devicePixelRatio||1)>1100?t.photo.replace(".jpg","-l.jpg"):t.photo})`;hero.style.setProperty('--bp',t.bp||'center')}else hero.classList.add('solid');
 /* les boutons du site d'exemple ne mènent nulle part : ils le disent */
 const toast=$('toast');document.addEventListener('click',e=>{if(e.target.closest('[data-demo]')){toast.hidden=false;$('tx').focus()}else if(e.target.closest('#tx'))toast.hidden=true});
 addEventListener('keydown',e=>{if(e.key==='Escape')toast.hidden=true});
 /* la vraie maquette : le message reprend le lien de cette page, pour qu'on sache ce que la personne a vu */
 const hi=SRC?HELLO+' J’ai':'Bonjour, j’ai',what=name?' préparé pour '+name:'';
 $('real').href=wa(`${hi} vu l’exemple de site${what}. J’aimerais recevoir ma vraie maquette, offerte.\n${location.href}${!name?'\nMon commerce et ma commune : ':!town?'\nMa commune : ':''}`);
 $('goLive').href=wa(`${hi} vu l’exemple de site${what}, et je le veux en ligne. On peut commencer ?\n${location.href}${!name?'\nMon commerce et ma commune : ':!town?'\nMa commune : ':''}`);
 $('change').href=wa(`${hi} vu l’exemple de site${what}.\n${location.href}\nCe que j’aimerais changer : `);
 $('why').textContent=`Quand on cherche « ${Q[key]}${town?' '+town:''} » sur Google, votre fiche mène à ce site, à votre nom, avec vos prix et un bouton pour vous écrire. Rien à préparer : on part de votre fiche Google et de votre Instagram.`;
 if(name)$('exT').textContent='Exemple préparé pour '+name+' par OONDE. Textes, prix et photos à remplacer par les vôtres.';
 const p=new URLSearchParams();if(name)p.set('n',name);p.set('m',key);if(town)p.set('v',town);if(sv)p.set('c',sv);$('edit').href='vitrine?'+p+'#vitrine';
 /* la barre du bas se range quand les boutons de la suite sont à l'écran : un seul bouton plein à la fois */
 new IntersectionObserver(es=>document.querySelector('.obar').classList.toggle('off',es[0].isIntersecting)).observe(document.querySelector('.next .go'));
 /* Transférer : le partage du téléphone, sinon WhatsApp avec le lien (pour l'associée, le mari…) */
 {const b=$('share');b.hidden=false;b.addEventListener('click',()=>{if(navigator.share)navigator.share({title:nm+' · exemple de site',url:location.href}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent('Regarde, un exemple de site pour '+nm+' : '+location.href),'_blank','noopener')})}
})();
