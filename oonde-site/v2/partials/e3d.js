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
  /* v24 (brief § 3.8) : avec le nom tapé à l'arrêt, « l'aperçu 3D de [Nom] ([métier]) » */
  return st.name?`${HELLO} J’aimerais l’aperçu 3D de ${st.name} (${what}${col}) et le prix de son site.\nMa commune : `:`${HELLO} J’aimerais voir ma façade en 3D (${what}${col}) et recevoir le prix de mon site.\nMon commerce et ma commune : `}
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

