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
/* v23 : « Essayer l’assistant » (en-tête, menu, barre, fin) : la démo, ici, sur la page ; seul « En avoir un pour mon commerce » ouvre WhatsApp */
const chat=document.getElementById('essai');
/* v24 : sur l'accueil, la démo est repliée : « Essayer l'assistant » l'ouvre sur place */
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('[data-try]');if(!a)return;e.preventDefault();{const h=chat.closest('[hidden]');if(h){h.hidden=false;document.querySelectorAll('[data-try][aria-expanded]').forEach(b=>b.setAttribute('aria-expanded','true'))}}const m=document.querySelector('.nav-m[aria-expanded=true]');if(m)m.click();chat.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});chat.classList.remove('hey');void chat.offsetWidth;chat.classList.add('hey');if(matchMedia('(hover:hover)').matches)setTimeout(()=>q.focus({preventScroll:true}),RM?0:600);history.replaceState(null,'','#essai')});
})();
