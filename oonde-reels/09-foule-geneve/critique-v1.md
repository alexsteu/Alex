# 09 · La file de la Vieille Ville — critique v1

Critique à deux regards (stratège réseaux sociaux, directeur artistique) de `09-foule-geneve.mp4` v1 : plans « réels » en
images fixes animées en 2.5D, plus le motion design. Méthode : 3 images à 30 i/s autour de chacune des 8 coupes, une image
toutes les 0,5 s, des images en pleine résolution à 0 · 1,6 · 4,4 · 10,3 · 12,9 · 14,4 · 16,5 · 18,8 s, la couverture,
`src/index.html` pour les tailles et les minutages, et une mesure du son (ebur128). Points de comparaison : 02 et 05, notés 8,0.

## 1. Notes

| Regard | Note | Détail |
|---|---|---|
| Stratège réseaux sociaux | **6,8/10** | accroche 7,5 · rétention et rythme 6,5 · clarté sans le son 7 · partage 7 · appel à l’action 6 · conformité 6,5 |
| Directeur artistique | **6,0/10** | motion design 8 · plans « réels » 4,5 · continuité entre plans 4 · transitions 5 · fin 6 |
| **Global** | **6,4/10** | Même niveau que les v1 de 02 et 05 avant correction (6,5 à 7,2). Avec les corrections 1 à 4 et de bonnes vidéos, 8 est atteignable. |

## 2. Ce qui marche

1. **L’histoire et le ton.** Trois actes se lisent sans le son : la file, le rembobinage vers la rue vide, puis le site et le retour de la file.
   Deux gags donnent envie de partager : « seul passant du jour » sur un virevoltant, et « Bon. On exagère un peu. », qui rend
   l’exagération honnête. C’est le registre « utile et un peu surprenant » qu’un commerçant envoie à un autre.
2. **Le langage du « suivi ».** Le cadre sur la vitrine, les filets blancs, les points Klein et les étiquettes de 46 px accrochées à des
   personnes font la jonction entre motion et réel. Ça fait produit, pas Canva. Le site incrusté dans le vrai téléphone (13,2 s) tient en
   perspective.
3. **Les scènes papier.** La typo et les tailles sont justes : titres de 104 à 110 px, lignes du site à ≈ 45 px dans le téléphone dessiné,
   recherche schématique et neutre, un seul « ? » en Klein. Les règles de fond sont tenues : aucun prix, jamais « IA » dans le texte,
   WhatsApp seul contact, rien qu’on puisse commander, son à −15,2 LUFS et −1,8 dBTP.

## 3. Corrections, par impact

Étiquettes : **[motion]** ne dépend pas des plans · **[plans]** se règle dans les vidéos v2 · **[v1]** seulement si les images
fixes restent. Le minutage qui regroupe toutes les corrections est à la fin de cette section.

### 1. La rue vide n’est pas la même boulangerie — 3,0–5,2 s [plans + motion]
**Vu.** À 3,0 s, l’enseigne du plan B est vierge : panneau crème, sans « MAISON ARDELLE ». La porte est à gauche de la vitrine (à droite en A),
la rue tourne avec des rails et la flèche du fond est verte (grise en A). Le titre dit « Même boulangerie. », l’image dit le contraire.
Or l’avant/après est tout le ressort du Reel, et on le vérifie justement en revisionnant.
**Correction.** B reprend exactement le cadre de A : même caméra, même façade, même enseigne, même lumière. Les personnes sont effacées
et la boulangère se tient sur le pas de la porte. Posez « Même boulangerie. / Personne. » à la place exacte de « Une file jusqu’au tram. »
(carte blanche, x 80, y 1140, 88 px). Le cadre et la carte restent, seul le contenu change (leçon 24). Le virevoltant roule plus loin dans
la rue (y 950–1050), avec son étiquette au-dessus.
En v1 : peignez l’enseigne sur B (`paintSign` avec le quadrilatère du panneau B) et faites entrer la carte à 3,45 s au lieu de 3,2 s.
L’enseigne se voit alors seule pendant 0,45 s.

### 2. « Démo · lieu fictif » : 1,3 s sur 15 s de commerce — 0–17,3 s [motion]
**Vu.** L’étiquette entre à 0,85 s et sort à 2,16 s. Elle manque à t = 0, qui est l’image de la lecture automatique dans le fil (seule la
couverture la porte). Elle manque aussi sur la rue vide, sur la foule d’aujourd’hui, dans le vrai téléphone et sur la boulangère. Dans le
site, la ligne dit « BOULANGERIE · GENÈVE » (19 px). La règle demande la mention, lisible, chaque fois que le commerce apparaît ; 05 l’avait
sur chaque plan.
**Correction.**
- (a) L’étiquette « Maison Ardelle / DÉMO · LIEU FICTIF » est déjà posée à t = 0 (opacité 1). Pour garder du mouvement, le cadre de vitrine
  garde son entrée, avancée à 0,3 s.
- (b) Ajoutez une pastille fixe « DÉMO · LIEU FICTIF » : fond encre, mono 30 px, bord droit à x 940, haut à y 250 (≈ 440 × 56 px). Elle
  reste sur tous les plans du commerce : rue vide, foule, vrai téléphone, boulangère. Descendez les chips de contexte et les cartes-titres
  du haut de 30 px (y 300 → 330).
- (c) Dans le site (`.tg`), écrivez « Boulangerie · démo », dans les deux téléphones.

### 3. Le passage « en ligne » est le plus petit texte du Reel, suivi d’un éclair blanc — 10,0–10,7 s ; le plan C se répète — 13,2–15,0 s [motion + plans]
**Vu.** « EN LIGNE » est une pastille mono de 30 px coincée sous « clair. » (x 640–890, y 470–525). Elle reste lisible ≈ 0,4 s, puis vient
l’éclair (10,42–10,74 s, image entièrement blanche à 10,5 s). Sans le son, la cause du retournement passe inaperçue (leçon 29 : une
étiquette de 30 px classe, elle n’explique pas). L’éclair blanc est l’effet le plus « modèle de montage » qui soit.
Ensuite, « Horaires, carte, WhatsApp. » (80 px, sous le minimum de 88 px des titres) redit les trois étiquettes qu’on vient de lire. À 14,8 s,
sa carte mord sur le haut du téléphone.
**Correction.** Raccordez sur le téléphone, sans éclair :
- À la fin de la scène du site, coupe franche du téléphone dessiné (écran x 204–876, haut y 574) vers le plan C. Cadrez C pour que l’écran
  réel ait la même taille et la même place (≈ ×1,9 par rapport au cadre actuel).
- Reculez ensuite en 0,6 s (courbe out) jusqu’au cadre actuel : la main et la rue apparaissent autour du site.
- Titre « En ligne. » en 110 px pendant ce plan (1,4 s).
- Supprimez la pastille « EN LIGNE », l’éclair et la carte « Horaires, carte, WhatsApp. ».

Nouvel ordre : site dessiné → C « En ligne. » → foule + étiquettes → boulangère → fin. C’est aussi la réponse la plus directe à la
demande « motion + réel » : le site dessiné devient réel sous nos yeux.

### 4. Une fin sans question ni boucle — 17,3–19,3 s [motion]
**Vu.** « Maquette offerte. », « Écrivez-nous sur WhatsApp », le logo et le @ : c’est conforme (7 mots, tout en place à 17,9 s, tenu 1,4 s).
Mais rien ne reprend l’histoire, et il n’y a pas de question : 02 et 05 finissaient sur une question (leçon 31). La dernière image
(papier) ne raccorde pas non plus avec la première (foule).
**Correction.**
- Titre « On vous trouve ? » en 132 px, sur deux lignes (« On vous / trouve ? »), avec une espace insécable avant « ? ».
- Bouton « Maquette offerte sur WhatsApp » (48 px, icône), puis @oonde_studio. Total : 8 mots, @ compris.
- L’écran est complet en 0,5 s et tenu 1,3 s. Le papier redescend ensuite en 0,15 s (courbe out) sur l’image exacte de t = 0 : la dernière
  image est la première, ce qui ferme la boucle.

### 5. La preuve du problème passe en 0,4 s — 5,2–7,6 s [motion]
**Vu.** La ligne « Horaires ? », avec le « ? » en Klein, est la chute du gag. Elle entre à 7,07 s et commence à sortir à 7,46 s : environ
0,4 s pour la lire. La frappe ne commence qu’à 5,65 s et la fiche n’arrive qu’à 6,55 s.
**Correction** (temps comptés depuis le début de la scène) :
- frappe de +0,20 à +0,65 s (40 caractères/s) ;
- fiche à +0,70 s, « Site web · aucun » à +0,85 s, « Horaires · ? » à +1,05 s ;
- le « ? » pulse une fois (64 → 80 px, courbe back, 0,25 s) en même temps que le tic ;
- tout reste jusqu’à +2,15 s, donc « Horaires ? » est lisible ≈ 1,1 s (leçon 21).

### 6. La chute arrive trop vite et le plan est figé — 15,0–17,3 s [motion]
**Vu.** « Bon. On exagère un peu. » (5 mots, 88 px) reste lisible ≈ 1,9 s (15,25 → 17,16 s), alors qu’il en faut 2,5. Pendant 2,2 s, rien
ne bouge à part la poussée lente (leçon 5).
**Correction.** Affichez-la en deux temps sur la même carte : « Bon. » à +0,1 s, puis « On exagère un peu. » à +0,55 s en 2e ligne. La
carte tient jusqu’à la fin d’un plan de 2,6 s.
En v1 seulement, ajoutez un 3e temps à +1,3 s : une étiquette suivie « débordée » (46 px, point Klein sur la boulangère). En v2, c’est le
rire qui apporte le mouvement.

### 7. Le rembobinage fait « effet de montage » — 2,3–3,0 s [motion + plans]
**Vu.** Le flou radial, les franges rouge/cyan et le ◀◀ blanc relèvent du registre CapCut, pas d’Apple ni de Linear. À 2,33 s, le compteur
affiche « − 0 jour ».
**Correction.**
- Supprimez l’aberration chromatique (ligne `c.r = mix(…)` du shader) et limitez le flou à 0,12.
- Masquez le compteur tant qu’il vaut 0 : la première valeur affichée est « − 1 jour ».
- Durée : 0,6 s.
- En v2, le rembobinage est la vidéo A lue à l’envers et accélérée (×4), dans le cadre de B : la file recule et se vide, la boulangère
  réapparaît sur le pas de la porte, sans aucun filtre.

### 8. Le site dessiné démarre vide, monte lentement et garde un bloc vide — 7,6–10,5 s (et 13,2–15,0 s) [motion]
**Vu.**
- De 7,6 à 8,0 s, le téléphone monte avec un écran blanc (leçon 13).
- Les blocs arrivent toutes les 0,42 s, soit 2,5 s pour 6 blocs.
- Sous le bouton WhatsApp, une carte vide à barres grises occupe le bas de l’écran (leçon 4). Elle se voit beaucoup dans le vrai téléphone
  (14,4 s, y 1110–1440).
- « On lui fait un site clair. » (6 mots) demande 2,8 s d’affichage.

**Correction.**
- Le téléphone entre avec l’en-tête « Maison Ardelle » déjà en place.
- Les blocs arrivent toutes les 0,28 s.
- Remplacez le bloc `.more` par une rangée « NOS PAINS » de deux vignettes photo (recadrages du plan D). Pas de « pain du jour » (leçon 20).
- Raccourcissez le titre en « Un site clair. » (110 px, 3 mots) pour qu’il tienne dans une scène de 2,3 s.

### 9. Les deux relances passent trop vite — 1,25 s et 4,15 s [motion]
**Vu.** « Pourquoi ? » ne reste que 0,9 s (1,25 → 2,16 s). « seul passant du jour », le meilleur gag, reste ≈ 0,8 s (4,15 → 5,06 s) alors
qu’il faut 2,1 s pour le lire.
**Correction.** « Pourquoi ? » entre à 0,8 s. L’étiquette du virevoltant arrive 0,5 s après le début de la rue vide (le virevoltant entre
déjà à +0 s) et reste au moins 1,5 s. « Personne. » arrive à +0,7 s.

### 10. Le son est conforme, mais la foule sonne synthétique — tout le Reel [motion + plans]
**Mesuré.** −15,2 LUFS intégrés, crête vraie −1,8 dBTP, LRA 4,6 LU : c’est conforme. Le rembobinage monte à −10,5 LUFS momentanés
(2,5 s), soit ≈ 5 LU au-dessus du reste : il ressort du mixage.
La rumeur de foule vient de `make_audio.py` (16 « voix » en dents de scie filtrées). Je n’ai pas pu l’écouter, mais une foule synthétique
se reconnaît vite. Or, sur des plans « réels », le son fait la moitié du réalisme.
**Correction.**
- Baissez le rembobinage de 3 dB.
- En v2, utilisez une vraie rumeur de rue le matin : le son natif de la vidéo s’il est propre, sinon 20 s enregistrées à l’iPhone dans une
  rue commerçante de Genève. Musique à −6 dB sous la foule.
- Calez le carillon sur « En ligne. » (le moment qui bascule) et un coup sourd sur « Bon. ».

### Minutage cible avec toutes les corrections (18,0 s, au lieu de 19,3 s)

| t (s) | Plan | Texte |
|---|---|---|
| 0,00–2,20 | A, la foule | « GENÈVE · 7 H 42 » · « Une file jusqu’au tram. » · « Maison Ardelle / Démo · lieu fictif » dès t = 0 · « Pourquoi ? » à 0,80 |
| 2,20–2,80 | rembobinage (A à l’envers, ×4) | « − 21 jours » |
| 2,80–5,00 | B, même cadre que A, rue vide | « 3 SEMAINES PLUS TÔT » · « Même boulangerie. » · « Personne. » à 3,50 · « seul passant du jour » de 3,30 à 4,86 |
| 5,00–7,30 | papier, la recherche | « Aucun site. » · « Ouvert ? Fermé ? Mystère. » · fiche à 5,70 · « Horaires ? » de 6,05 à 7,16 |
| 7,30–9,60 | papier, le site dessiné | « Un site clair. » · un bloc toutes les 0,28 s |
| 9,60–11,00 | C : raccord du téléphone dessiné au vrai, recul en 0,6 s | « En ligne. » |
| 11,00–13,40 | A2, la foule et 3 étiquettes | « AUJOURD’HUI · 7 H 42 » · étiquettes à 11,25 / 11,70 / 12,15 |
| 13,40–16,00 | D, la boulangère | « Bon. » à 13,50 · « On exagère un peu. » à 13,95 |
| 16,00–17,85 | fin, papier | « On vous trouve ? » · « Maquette offerte sur WhatsApp » · logo · @oonde_studio |
| 17,85–18,00 | le papier redescend sur l’image de t = 0 | boucle |

La pastille « DÉMO · LIEU FICTIF » reste affichée de 2,80 à 5,00 s et de 9,60 à 16,00 s.

## 4. Ce que les plans vidéo doivent apporter en priorité

1. **Un seul lieu, une seule caméra.**
   - A et B sont le même plan fixe : B est fait à partir de A, personnes effacées.
   - L’enseigne « MAISON ARDELLE » est lisible et immobile sur toutes les images. La caméra doit rester fixe, parce que l’enseigne est
     peinte en post sur un quadrilatère fixe (`SIGN_A`) : les lettres générées par la vidéo bougeraient.
   - C’est la même boulangère en B et en D (tenue, chignon, tablier), et la même devanture verte dans C.
   - Le rembobinage, c’est A lu à l’envers.
   - Un Genevois doit reconnaître sa ville : pierre grise, toits et flèche verte de Saint-Pierre au fond (B s’en approche, A non). Dans une
     ruelle pavée de la Vieille Ville, il ne passe pas de tram : soit on prend une rue basse avec tram, soit on change « jusqu’au tram ».
2. **Une vraie file qui bouge, sans défaut d’IA.**
   - Aujourd’hui, A montre une foule tournée vers la caméra, pas une file. Il faut une file d’une ou deux personnes de front, le long de la
     façade, tournée vers la porte, qui avance d’un pas toutes les secondes environ : téléphones, buée, porte qui s’ouvre.
   - Le virevoltant roule au sol, avec son ombre et des rebonds. Aujourd’hui, c’est un détourage en résille qui flotte.
   - La boulangère éclate de rire puis tend un sachet.
   - Caméra quasi fixe (dérive ≤ 2 %) pour que les étiquettes suivies restent collées.
   - Zéro morphing : ni visages, ni mains, ni doigts sur l’écran, ni lettres. Des plans de 2 à 2,5 s, en gardant les meilleures secondes.
   - Rien hors de la promesse : pas de livreur avec un sac isotherme comme le cycliste à droite de A, pas d’écran « commander ».
3. **Des plans faits pour recevoir le motion design.**
   - En C, le téléphone est face caméra, avec un écran plat, sans reflet ni doigt dessus. Au début du plan, l’écran occupe ≈ 60 % de la
     largeur, pour le raccord avec le téléphone dessiné.
   - Des zones calmes (façade, ciel, pavés) là où se posent les cartes : y 330–620 et y 1140–1370.
   - La même lumière du matin sur A, B, C et D (7 h 42).
   - Les découpes 2.5D actuelles disparaissent : lanterne déchirée à 4,0 s, halo autour du chignon à 14,6 s, pavés étirés au bas de
     l’image à 11,5 s.

## 5. Leçons à ajouter à lecons.md

36. **Avant/après en plans « réels » : même caméra, même cadre, même enseigne.** Fabriquer l’« avant » en retouchant l’« après » (personnes
    effacées), jamais à partir de deux images générées séparément. Contrôler en superposant les deux premières images : les arêtes de
    façade doivent s’aligner à ±10 px. Un titre « Même… » doit être vrai à l’image.
37. **Le raccord entre motion design et réel passe par un objet commun, à la même taille et à la même place** (téléphone dessiné → vrai
    téléphone, fiche → enseigne). Pas par un effet (éclair blanc, flou radial, aberration chromatique), qui fait « modèle de montage ».
    Le moment où le récit bascule (« en ligne ») est un titre de 88 px ou plus, jamais une étiquette mono de 30 px.

## Annexe : contrôle des règles non négociables (v1)

| Règle | v1 | Remarque |
|---|---|---|
| Commerce fictif marqué « Démo · lieu fictif » lisiblement | ✗ partiel | lisible (mono 30 px), mais seulement de 0,85 à 2,16 s (correction 2) |
| Aucun chiffre inventé | ✓ | « − 21 jours / 3 semaines » est compatible avec les conditions (mise en ligne sous 5 jours ouvrables) ; « 7 h 42 » et « 7 h à 19 h » sont des données de démo |
| Aucun prix · pas de Gland · WhatsApp seul contact | ✓ | |
| Jamais « IA » | ✓ texte · ⚠ image | foule souriante face caméra, découpes 2.5D : à régler par la vidéo |
| Ne montrer que ce qu’on garantit | ✓ | horaires, carte, WhatsApp, aucune commande ; ⚠ cycliste-livreur dans A (bord droit, 0–2,3 s) |
| Textes ≥ 44 px dans x 60–940, y 250–1500 | ✓ | étiquettes 46 px, site ≈ 45 px dans le téléphone dessiné, texte du vrai téléphone (≈ 30 px) repris hors du téléphone ; « Horaires, carte, WhatsApp. » en 80 px (titres : 88 au minimum) ; « EN LIGNE » porte le récit en 30 px |
| Klein en accent seulement | ✓ | points de suivi, « ? », curseur, point du logo |
| Écran final ≤ 8 mots | ✓ | 7 mots |
| Transitions sans image hybride | ✓ | les 8 coupes sont nettes (titres sortis 0,12 s avant, volets papier propres) ; seul défaut : « − 0 jour » à 2,33 s |
| Français (Suisse romande, vouvoiement) | ✓ | aucune faute ; espaces insécables, ’ et « » justes |
| Technique | ✓ | 19,3 s · 1080×1920 · 30 i/s · H.264 + AAC 48 kHz · −15,2 LUFS · −1,8 dBTP |
