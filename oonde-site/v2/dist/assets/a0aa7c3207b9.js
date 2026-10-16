
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

/* L'essai : un seul état ; le métier, la commune et la couleur n'entrent dans le message que si on les a choisis */
const ACTS=['coiffure','ongles','barbier','beaute','restaurant'],MORE=[['boulangerie','Boulangerie'],['fleuriste','Fleuriste'],['garage','Garage'],['artisan','Artisan'],['autre','Autre commerce']];
const QW=Q;let own=false;
const st={act:'coiffure',town:'',style:0,name:''};let prepared=false,touched=false,actSet=false,townSet=false,styleSet=false;
$('bAct').innerHTML=ACTS.map(k=>`<button type="button" role="radio" data-v="${k}" aria-checked="false">${T[k].label==='Institut'?'Institut':esc(T[k].label)}</button>`).join('')
 +`<select class="sel" id="bMore" aria-label="Autre métier"><option value="">Autre métier</option>${MORE.map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}<option value="visite">Hôtel, chambres d’hôtes, logement, salle →</option></select>`;
$('sTown').innerHTML='<option value="">Choisir</option>'+TOWNS.map(x=>`<option>${x}</option>`).join('')+'<option value="ailleurs">Ailleurs</option>';
const short=n=>n.length>22?n.slice(0,21)+'…':n,narrow=matchMedia('(max-width:600px)');
function msg(town,t){const what=[t.noun,townSet&&town?'à '+town:''].filter(Boolean).join(' '),col=styleSet?(what?', ':'')+'couleur '+t.styles[st.style][2]:'';
 if(!touched)return MSG.vit();
 const hi=(SRC?HELLO+' J’ai':'Bonjour, j’ai')+(prepared&&st.name===prepared?' vu l’exemple préparé pour mon commerce.':st.name?' vu l’exemple avec mon nom.':' essayé l’exemple sur votre site.');
 return st.name?`${hi} J’aimerais recevoir ma maquette offerte.\n${st.name}${what||col?', ':''}${what}${col}.\nMon Instagram (si j’en ai un) : @`
  :`${hi} J’aimerais recevoir ma maquette offerte${what?' : '+what:''}.\nNom de mon commerce : `}
let near=false,shown='',say=0;
function render(anim){const t=T[st.act],town=TOWNS.includes(st.town)?st.town:'';
 [...$('bAct').querySelectorAll('button')].forEach(b=>{const on=b.dataset.v===st.act;b.setAttribute('aria-checked',on);b.tabIndex=on||(!ACTS.includes(st.act)&&b===$('bAct').firstChild)?0:-1});
 const mo=$('bMore');mo.classList.toggle('on',!ACTS.includes(st.act));mo.value=ACTS.includes(st.act)?'':st.act;
 $('sTown').value=townSet?st.town:'';
 const bs=$('bStyle');if(bs.dataset.t!==st.act){const had=bs.contains(document.activeElement);bs.dataset.t=st.act;bs.innerHTML=t.styles.map(([c,,n],i)=>`<button type="button" role="radio" aria-label="${esc(n)}" aria-checked="false" style="--g:${c}" data-i="${i}"></button>`).join('');if(had)bs.children[st.style].focus()}
 [...bs.children].forEach((b,i)=>{b.setAttribute('aria-checked',i===st.style);b.tabIndex=i===st.style?0:-1});$('styleName').textContent=t.styles[st.style][2];
 const s={name:st.name,town,style:st.style},look=st.act+st.style;
 if(near){site($('liveDesk'),st.act,s,'d');site($('livePhone'),st.act,s,'m');if(anim&&look!==shown)document.querySelectorAll('#liveDesk>.tpl,#livePhone>.tpl').forEach(n=>n.classList.add('sw'));shown=look}
 $('liveUrl').textContent=slug(st.name)+'.ch';$('vDom').textContent=st.name?slug(st.name)+'.ch':'votre-commerce.ch';
 const href=wa(msg(town,t)),label=st.name?'Recevoir la maquette de '+short(st.name):'Recevoir ma maquette offerte';
 /* tous les boutons « maquette » de la page suivent l'essai ; sur téléphone, un nom long reste dans le message, pas sur le bouton */
 const lab2=st.name&&narrow.matches&&st.name.length>12?'Recevoir ma maquette offerte':label;
 $('wantL').textContent=lab2;if(touched)document.querySelectorAll('a[data-wa="vit"]').forEach(a=>a.href=href);else $('wantIt').href=href;
 document.querySelectorAll('a[data-mail="vit"]').forEach(a=>{if(touched)a.href=mail('Ma maquette offerte',msg(town,t).replace(/\n/,'\n\n'))});
 if(st.name)document.querySelectorAll('a[data-wa="vid"]').forEach(a=>a.href=wa(HELLO+' J’aimerais un devis pour des vidéos courtes (Instagram, TikTok).\n'+st.name+(town?', '+town:'')+'.')); 
 if(st.name){const pa=document.querySelector('a[data-wa="passe"]');if(pa)pa.href=wa(HELLO+' J’aimerais que vous passiez me montrer la maquette de '+st.name+(town?' à '+town:'')+'.\nLe meilleur moment : ')}
 $('bigLink').href=apercuUrl('apercu',{name:st.name,act:st.act,town:st.town==='ailleurs'?'':st.town,style:st.style});
 /* la fiche Google d'exemple suit l'essai */
 const q=QW[st.act]+' '+(town||'Morges');$('gQ').textContent=q;$('gQ2').textContent=q;$('gName').textContent=st.name||'Votre commerce';
 {const h=(t.open.match(/(\d{1,2}:\d{2})/)||[])[1];$('gOpen').textContent=/jusqu/.test(t.open)&&h?'ferme à '+h:t.open.replace(/^[^·]*·\s*/,'')}
 $('gCat').textContent=t.noun.charAt(0).toUpperCase()+t.noun.slice(1)+' · '+(town||'Morges');
 clearTimeout(say);say=setTimeout(()=>{$('prevDesc').textContent=`Aperçu : ${st.name||'votre commerce'}, ${t.label.toLowerCase()}${town?' à '+town:''}, couleur ${t.styles[st.style][2]}.`},700);
 if(touched)try{localStorage.setItem('oonde-essai',JSON.stringify({act:st.act,town:st.town,style:st.style,name:st.name,a:actSet,t:townSet,s:styleSet}))}catch(e){}}
const setAct=k=>{touched=actSet=true;if(st.act!==k){st.act=k;st.style=0;styleSet=false}render(true)};
$('bAct').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setAct(b.dataset.v)});
$('bAct').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key)||e.target.tagName!=='BUTTON')return;const bs=[...$('bAct').querySelectorAll('button')],i=bs.indexOf(e.target);e.preventDefault();const n=bs[(i+(e.key==='ArrowRight'?1:bs.length-1))%bs.length];n.focus();n.click()});
$('bMore').addEventListener('change',e=>{const v=e.target.value;if(v==='visite'){location.href='visite';return}if(v)setAct(v)});
$('sTown').addEventListener('change',e=>{touched=true;townSet=!!e.target.value;st.town=e.target.value;render()});
$('bStyle').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;touched=styleSet=true;st.style=+b.dataset.i;render(true)});
$('bStyle').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const n=(st.style+(e.key==='ArrowRight'?1:2))%3;touched=styleSet=true;st.style=n;render(true);$('bStyle').children[n].focus()});
$('bName').addEventListener('input',e=>{touched=true;st.name=e.target.value.trim();render()});
$('bName').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur()});
/* Un lien préparé pour un commerce (?n=Salon%20Mirabelle&m=coiffure&v=Morges) remplit l'essai ; sinon, on reprend la dernière visite */
(()=>{const q=new URLSearchParams(location.search);let m={};
 if(q.get('n')||q.get('m'))m={name:q.get('n')||'',act:q.get('m'),town:q.get('v')||'',style:+q.get('c')||0,a:!!q.get('m'),t:!!q.get('v'),s:q.has('c')};
 else try{const raw=localStorage.getItem('oonde-essai');if(raw){m=JSON.parse(raw);touched=true}else{const e=JSON.parse(localStorage.getItem('oonde-e3')||'{}');if(e.name)m={name:e.name}}}catch(e){}   /* le nom tapé dans l'entrée 3D, s'il y en a un */
 if(T[m.act]){st.act=m.act;actSet=!!m.a}
 if(TOWNS.includes(m.town)||m.town==='ailleurs'){st.town=m.town;townSet=!!m.t}
 if(Number.isInteger(m.style))st.style=clamp(m.style,0,2),styleSet=!!m.s;
 if(typeof m.name==='string'){st.name=m.name.slice(0,40);$('bName').value=st.name;if(st.name)touched=true}
 if(q.get('n')){prepared=st.name;const p=$('prep');p.textContent='Aperçu préparé pour '+st.name+(TOWNS.includes(st.town)?' · '+st.town:'')+'. Changez ce que vous voulez.';p.hidden=false}})();
near=true;render();
new ResizeObserver(es=>es.forEach(e=>fit(e.target))).observe($('liveDesk'));
new ResizeObserver(es=>es.forEach(e=>fit(e.target))).observe($('livePhone'));
