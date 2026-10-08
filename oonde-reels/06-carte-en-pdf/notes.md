# 06 · Votre carte en PDF ? — notes

## Production

**Durée** 14,7 s · 1080×1920 · 30 i/s · H.264 + AAC 48 kHz · −15,7 LUFS intégré, crête vraie −2,1 dBFS (mesurées avec ebur128 sur le fichier final) · `ERREURS PAGE` : 0.

**Plan** : accroche PDF (0–4,8 s, un geste toutes les 0,6–0,7 s : téléchargement, pincement, tirage de travers, second pincement sur les vins, lancer jusqu’au bord gris, double tapotement) → coupe nette sur la même carte en page web, trois règles numérotées 01/02/03 (4,8–11,7 s) → écran final 8 mots (11,7–14,6 s) → 3 images de papier vide, puis la boucle repart sur l’accroche.

**Leçons du Tour 1 appliquées**
- Lisibilité : téléphone de la page web recadré à l’échelle ×2 : noms de plats à 44 px à l’écran, titres de section 56 px ; vérifié sur une image réduite à 390 px de large. Le nom du fichier est repris hors du téléphone en 44 px (carte de téléchargement).
- Transitions : l’ancien titre sort en 0,12 s avant que le nouveau monte (aucune double exposition) ; coupe nette au changement de scène.
- Mouvement : quelque chose bouge toutes les 0,6–1 s dans chaque plan (défilement, onglet actif qui glisse, frappe, pastille, tape, horaires).
- Écran final : 8 mots (titre 6 + bouton 2), logo, @oonde_studio.
- Son : rythmique douce seulement après la coupe (contraste frustration → solution) ; bruitages calés sur gestes et apparitions.

**Autocritique (2 passes)**
1. Passe 1 : la page PDF portrait restait trop lisible et la carte de téléchargement coupait la barre d’état → carte PDF passée en dépliant paysage (vraiment minuscule, plus crédible), carte de téléchargement descendue sur la 2e page ; la règle 1 passait de pleine opacité à 28 % à l’image suivante (bug) → affichée d’emblée, c’est le téléphone qui s’installe ; « Démo · lieu fictif » collé au titre → téléphone descendu de 16 px.
2. Passe 2 : la pastille « Mis à jour aujourd’hui » chevauchait le nom du plat → intégrée à la ligne « Plat du jour » ; le doigt masquait « 19:30 » trop longtemps → tape raccourcie ; étiquette démo et pied de l’écran final ramenés dans la zone de sécurité (x ≤ 940).

**Contenu** : Maison Vauclaire (Vevey) est inventé et marqué « Démo · lieu fictif » à chaque apparition ; aucun prix (tirets et points de conduite) ; aucun chiffre affirmé ; WhatsApp seul contact ; pas de Gland. Photo de salle reprise de `oonde-site/v2/img/t-restaurant.jpg`.

**Kit** : la normalisation du README (`loudnorm=I=-15:TP=-1.5`) donnait une crête vraie de −0,3 dBFS après AAC (−0,5 → +0,5 dBFS en baissant seulement TP) ; contourné dans cette pièce avec `loudnorm=I=-15:TP=-1.5:LRA=11,alimiter=limit=0.7:attack=1:release=60:level=false,aresample=48000`. La couverture est rendue avec `?cover` (étiquette « Restaurants · cafés » masquée, sinon coupée par le recadrage de la grille).

**À surveiller par Alexandre** : la pastille « Mis à jour aujourd’hui » et le nom de fichier dans la barre du téléphone sont sous 44 px (repris en clair ailleurs) ; la phrase « À jour en une minute. » vient du brief : c’est une promesse d’usage, pas un délai de livraison.

## Corrections (v2, après critique stratège 6,5 et DA 6,8)

Version précédente conservée dans `v1/` (vidéo, planche, couverture, légende). Nouveau minutage fixé d’abord (leçon 7) :
coupe 4,0 · règle 02 6,4 · règle 03 9,3 · fin 12,0 · papier vide 14,6 · durée 14,7 s. Rendu : `ERREURS PAGE` 0, 1080×1920,
H.264 + AAC 48 kHz, −15,2 LUFS, crête vraie −1,5 dBFS (mux.py du kit).

**Stratège — must fix**
1. « À jour en une minute. » + frappe sur place → **corrigé**. Titre « À jour sans refaire le PDF. » (aucune durée). Bulle WhatsApp
   verte (#14803C, seul vert du plan) « Plat du jour : filets de perche » qui monte en haut de l’écran du téléphone à 6,75 s ; la ligne
   change à 7,3 s (ancien texte vers le haut, nouveau qui entre, 0,25 s E.out), puis pastille « Mis à jour ». Plus de curseur ni de
   frappe. Légende, texte alternatif et script mis à jour (« un message suffit à changer le plat du jour »).
2. Sélecteur de créneaux (moteur de réservation non proposé) → **corrigé**. Bouton « Réserver sur WhatsApp » (icône 28 px), tape à
   10,55 s, message pré-rempli « Bonjour, une table pour 2 ce soir à 19 h 30 ? » qui monte à 10,8 s, à y ≈ 1290–1450, lisible 1,2 s
   avant la coupe.
3. Temps mort 3,3–4,8 s (lancer vers le bord gris, « SSEUX ») → **corrigé**. Image clé du lancer supprimée ; double tapotement
   3,37 / 3,55 s, retour en petit 3,58–3,92, coupe à 4,0 s. Les 0,8 s sont rendues aux preuves (règle 01 : 2,4 s ; 02 : 2,9 s ; 03 : 2,7 s).
   Seul écart avec la proposition : règle 03 à 9,3 et fin à 12,0 (au lieu de 9,0 et 11,7) pour concilier avec le should fix 2 (tenue finale 1,5 s).
4. La blague n’était pas visible sans le son → **corrigé**. « On cherchait les desserts… » (Instrument Sans 500, 44 px, #3A3F47) de
   2,30 à 4,0 s sous le titre ; cadre Klein 2 px (rayon 8 px à l’écran) autour de « VINS AU VERRE » de 2,86 à 3,38 s ; tic (note 80) à 2,88 s.
   Cadre calé sur l’arrivée réelle du pincement (2,62–3,1) plutôt qu’à 2,7 s, où le titre n’est pas encore à l’écran. La cible du
   pincement a été recadrée (cam 640, 432, z 4,2) pour que « VINS AU VERRE » soit entier, avec « Sorbet poire » juste au-dessus.

**Stratège — should fix**
1. Appel à l’action sans verbe → **corrigé** (variante 2) : titre conservé, étiquette mono 30 px « ÉCRIVEZ-NOUS · LIEN EN BIO » 0,3 s après
   le bouton. Le titre du brief et la composition saluée par le DA restent ; titre + bouton = 8 mots, l’étiquette arrive à part (leçon 17).
2. Tenue finale trop longue → **corrigé** : tout est en place vers 13,05 s, papier vide à 14,6 s (1,55 s de tenue) ; durée gardée à 14,7 s.
3. Légende → **corrigé** : 1re ligne « Site de restaurant à Vevey, Lausanne ou Montreux… », corps « se change sur un simple message… réservation
   sur WhatsApp », accroche alternative 2 « carte_2019_final(2).pdf : c’est encore la vôtre ? » ; appel « final(2) » gardé.
4. Son de l’accroche / accord final → **corrigé** : choc à 0,02 s en gain 1,0, tic (note 88, gain 0,6) à 0,78 s avec la goutte. Accord final :
   −4 dB (0,63) ne changeait presque rien après le limiteur du mux (−10,0 → −10,4 dBFS RMS) ; passé à 0,4 (−8 dB nominal) : 12–13 s à −12,6 dBFS RMS,
   environ 4 dB au-dessus du corps (−16,5) au lieu de 7,5.
5. Titre d’accroche trop court → **corrigé** : sortie à 2,10 s, « Pincer, zoomer, se perdre. » monte à 2,22 s (2,1 s d’affichage).
   Transition vérifiée image par image dans la vidéo : aucune double exposition.

**DA — must fix**
1. Règle 03 hors zone de sécurité → **corrigé** : défilement final 151 px CSS plus bas, bouton à y 1120–1235, bulle à y ≈ 1290–1450 ;
   rien d’utile sous 1500 (contrôlé avec `--q safe` à 10,55 et 11,2 / 11,3 s).
2. Flou de « re-rendu » → **corrigé** : flou plafonné à 0,5 px, seulement si v > 0,4 (3–4 images de vitesse maximale). Les doigts sont sortis
   de `#viewer` (calque `.ov` au même niveau) et restent nets.
3. Plan presque vide à 3,7 s (« SSEUX ») → **corrigé** par la suppression du lancer (voir stratège 3).
4. Pastille « Mis à jour aujourd’hui » illisible → **corrigé** : « Mis à jour », 22 px CSS × 2 = 44 px, sur sa propre ligne sous « PLAT DU JOUR »
   (la carte grandit de 46 px CSS en 0,25 s) ; point encre (ce n’est pas une bulle WhatsApp).

**DA — should fix**
1. Étiquette « DÉMO · LIEU FICTIF » collée au téléphone A → **corrigé** : téléphone A descendu à y 696 (≈ 30 px sous la ligne de base),
   bord droit de l’étiquette aligné sur le bord droit de l’écran moins le rayon dans les deux scènes (x 798 en A, 860 en B).
   La carte de téléchargement descend de 34 px (y 1330–1480, toujours dans la zone).
2. Deux dessins de doigt → **corrigé** : un seul `.touch` (disque 56 px CSS, rgba(17,19,24,.28), filet blanc 2 px, ombre douce, appui à ×0,88
   sur 0,13 s), y compris la tape à 10,55 s, calée sur le pop. Le doigt tape à droite du bouton pour ne pas masquer le texte.
3. Couverture-grille serrée en haut → **corrigé** : en mode `?cover`, le titre descend de 43 px (≈ 88 px de marge dans le recadrage 1080×1350).
4. Écran final fixe → **corrigé** : tenue ramenée à ≈ 1,5 s, et le bouton « respire » une fois (1 → 1,03 → 1 en 0,4 s, à 13,5 s) avec un tic doux.
5. Son (choc / accord final) → **corrigé** (voir stratège should fix 4).
6. Carte de téléchargement et doigts superposés → **corrigé** : la carte part de 0,95 à 1,12 s, les doigts arrivent à 1,14 s.

**Gardé** comme demandé : image à t = 0, même carte dans les deux formats, règles 01/02/03, un geste toutes les 0,6–0,7 s dans la partie PDF,
musique seulement après la coupe, coupe nette, écran final et boucle (3 images de papier vide), conformité (démo marquée, aucun prix, Vevey,
WhatsApp seul contact, aucun chiffre).

**À surveiller par Alexandre** : la bulle de la règle 02 couvre brièvement (6,75–8,75 s) la droite de la barre d’adresse et des onglets ;
de 10,4 à 10,8 s, le bas de l’écran du téléphone sous le bouton est blanc (sous y 1240), avant l’arrivée de la bulle ; le vert WhatsApp
apparaît désormais dans deux règles (02 et 03), toujours sur une bulle ou une icône.

## Verdict (juge final, regard neuf)

**Version retenue : v2** (la version corrigée). Elle est nettement meilleure que v1 : le plan presque vide à 3,7–4,3 s
(« SSEUX » sur le bord gris) a disparu ; « À jour en une minute. » (promesse de durée) est remplacé par
« À jour sans refaire le PDF. » ; le faux moteur de réservation (créneaux 19:00/19:30) devient « Réserver sur WhatsApp »,
ce que nos sites font vraiment ; la blague est lisible sans le son (« On cherchait les desserts… » et cadre sur « VINS AU VERRE »).
v1 reste dans `v1/`.

**Contrôle README §6 (sur le fichier final)** : 14,7 s, 1080×1920, 30 i/s, H.264 + AAC 48 kHz ; −15,2 LUFS intégré, crête vraie
−1,5 dBFS (ebur128) ; aucune erreur de page. t = 0 : titre « Votre carte en PDF ? » en grand, PDF minuscule, nom de fichier à 44 px :
compris avant 1,5 s (la barre se remplit à 0,5 et 1 s, les doigts arrivent à 1,14 s). Transitions de titres à 6,4 et 9,3 s vérifiées
image par image : une image vide entre deux titres, aucune double exposition. Démo marquée dans chaque scène, aucun prix, aucun chiffre
affirmé, Vevey (pas de Gland), WhatsApp seul contact, aucune mention d’IA. Orthographe de la vidéo et de la légende : aucune faute
trouvée (espaces fines avant « : » et « ? », apostrophes ’). Légende : 5 hashtags, mot-clé local en 1re ligne, appel à l’action.

**Correction faite par le juge** : la règle 02 montrait « Plat du jour : filets de perche » envoyé par WhatsApp et mis en ligne
dans la seconde. Or nos conditions prévoient les petites modifications « dans un délai de 3 jours ouvrables » : un plat du jour,
qui change chaque jour, laissait entendre un service le jour même. Remplacé par « Plat de saison » (étiquette de la carte et bulle) :
même animation, aucune durée sous-entendue intenable. Vidéo re-rendue (même son, recopié tel quel), planche, source, script et texte
alternatif mis à jour.

**Notes** : accroche 8 · rythme 8 · clarté 8 · beauté 7,5 · partage 7,5 · conformité 9 · **global 7,9**.

**Ce qui marche** : une vignette qu’un restaurateur reconnaît d’un coup d’œil (« carte_2019_final(2).pdf ») ; le geste qui agace est
montré en vrai, puis la coupe nette vers la même carte en page web : le contraste se comprend sans le son ; trois règles courtes,
chacune prouvée par un geste ; finition propre, DA v7 tenue, Klein bien dosé.

**Ce qui reste (non bloquant)** :
- Écran final : « WhatsApp » n’est dit que par l’icône ; l’étiquette « ÉCRIVEZ-NOUS · LIEN EN BIO » (mono 30 px) est petite. Une
  prochaine version pourrait écrire « Écrivez-nous sur WhatsApp ».
- La bulle de la règle 02 cache la droite des onglets pendant 2 s ; le bas de l’écran du téléphone est blanc sous le bouton (10,4–10,8 s).
- Les doigts (disques gris) restent abstraits ; c’est propre mais moins « vrai » qu’une main.
- À vérifier avant publication : que « maison-vauclaire.ch » et « Maison Vauclaire » ne correspondent à aucun établissement réel.

**À publier ?** Oui, après relecture d’Alexandre. Publiable en l’état.
