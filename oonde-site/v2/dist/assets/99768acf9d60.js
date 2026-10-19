
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
