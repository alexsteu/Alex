# 02 · Le test des 5 secondes — notes

## Production

**Reprise.** Je suis reparti du brouillon du premier producteur (script et `src/index.html`). La structure était bonne et je l’ai gardée : le 5 qui devient le minuteur, le site d’« Atelier Vellaz », l’encre, le même commerce refait, l’écran final. J’ai fait deux passes d’autocritique sur les images clés, puis vérifié la zone de sécurité (`--q safe`) et la lecture à 390 px de large.

**Corrections apportées au brouillon**
1. **Accroche** : elle durait 1,35 s, trop peu pour lire 8 mots (règle « mots ÷ 3 + 0,8 s »). Elle tient maintenant 1,75 s et tout le reste est décalé de +0,4 s. J’ai ajouté l’étiquette mono « UNE MÉTHODE DE DESIGNERS », qui rend le contenu crédible et partageable. Le bloc est recentré dans la bande de la grille (y 300–1375).
2. **t = 0** : un liseré du téléphone dépassait en bas de l’image. Le téléphone reste maintenant caché jusqu’à la métamorphose du 5.
3. **Site « avant »** : le défilement allait au-delà de la fin de la page, et on voyait un grand vide blanc à 2 et à 1. J’ai rallongé la page (« Notre philosophie » et une galerie floue) pour que le visiteur cherche vraiment. Le défilement est borné au bas réel de la page, qui se termine sur le numéro minuscule du pied de page, visible juste avant 0.
4. **Chiffres du minuteur** : l’ancien et le nouveau chiffre se superposaient en transparence (« 1 » sur « 0 »). Ils roulent maintenant comme un compteur : sortant et entrant liés, sans chevauchement.
5. **Écran encre** : le bloc était collé en haut avec 800 px de vide dessous. Je l’ai descendu de 130 px pour équilibrer l’écran.
6. **Site « après »** : les contours dessinés autour des réponses doublaient les bordures des cartes, ce qui faisait brouillon. Ils sont remplacés par un effacement de la photo et du texte secondaire, et par une légère pulsation des trois blocs-réponses, en même temps que les trois coches.
7. **Police** : « Actualités » est devenu « Nouvelles » (voir le défaut du kit plus bas).

**Son.** `src/cues.json` : un coup sourd à t = 0, puis whoosh et glissé pour la métamorphose. Un tic par seconde pendant le compte à rebours, avec de petits glissés à chaque défilement. Un coup sourd à 0, un pop par question et un coup feutré par croix. Un carillon sur les trois coches, puis des pops et l’accord final. Musique en ambiance « calm », sans rythmique : les tics donnent le tempo. Mixage avec loudnorm : −14,8 LUFS intégrés, crête −1,1 dBFS, AAC 48 kHz.

**Contrôles.** `ERREURS PAGE : 0`. Vidéo de 17,8 s, 1080×1920, H.264 + AAC, 30 i/s. Les textes clés sont dans la zone de sécurité et la démo est marquée « Démo · lieu fictif » à chaque apparition du commerce. Klein n’apparaît que sur le 5, les chiffres du minuteur et le mot « avant ». Aucun chiffre inventé, aucun prix, WhatsApp comme seul contact. Le numéro du faux site est un numéro d’exemple (021 000 00 00).

**Défaut du kit (contourné, à corriger dans `_kit/`).** `fonts/cormorant-garamond-latin-400-normal.woff2` place mal l’accent aigu : dans « Actualités », l’accent tombe entre le « e » et le « s ». Il vaut mieux éviter les lettres accentuées en Cormorant tant que le fichier n’a pas été régénéré. Ici, aucun texte en Cormorant ne porte d’accent.

**Points à juger par Alexandre.** Le texte du faux site est volontairement illisible sur téléphone : c’est le test. Le téléphone déborde en bas de l’image pendant les deux passages, un cadrage voulu, et rien d’utile ne se trouve sous y 1500 hormis le numéro « caché ». Durée : 17,8 s, dans la fourchette haute.

## Corrections (tour 2, d’après les critiques du stratège 7,2/10 et du directeur artistique 7/10)

Version précédente conservée dans `v1/` (vidéo, planche, couverture, légende). Durée : 17,8 s → **17,0 s**.

### Stratège — à corriger
1. **Accroche alternative n° 2** (« sur chaque page », généralisation fausse) → **corrigé** : « Un vrai test de designers : 5 secondes. Votre site le passe ? ».
2. **Commerce visible 0,6 s sans marquage** → **corrigé** : « Démo · lieu fictif » monte avec le téléphone (rise à 1,95 s, 0,3 s) ; il est lisible avant que le nom « Atelier Vellaz » entre dans l’image.
3. **Questions trop rapprochées** → **corrigé**, combiné avec le décalage de +0,28 s du directeur artistique (encre) : questions à 8,68 / 9,23 / 9,78 s (écart 0,55 s), croix à a + 0,42 et a + 0,52, pops et coups sourds recalés dans `cues.json`, fin de l’écran encre à 11,28 s : les trois questions restent ensemble 1,3 s.
4. **Fin trop longue** → **corrigé** : endOut 1,45 s après les coches (13,78 s) ; écran final eTitle / eBody / ePill / pied à +0,25 / +0,45 / +0,65 / +0,85 s, complet à 14,98 s, tenu 1,7 s, puis 0,34 s de boucle. Durée 17,0 s (au lieu des 16,3 s visés : les deux décalages de l’encre et des questions s’additionnent ; on reste dans la plage idéale 15–18 s).
5. **1re ligne de légende coupée + aucune espace insécable** → **corrigé** : « Votre site passe le test des 5 secondes ? Commerces de Lausanne à Vevey. » (la question tient dans les 41 premiers caractères) ; 36 espaces insécables U+00A0 devant ? : ! ; » et après «.

### Stratège — à améliorer
1. **Image fixe pendant 1,75 s** → **corrigé** : à 0,9 s le 5 bat une fois (1 → 0,97 → 1 en 0,16 s, E.inOut) sur un tic. L’image t = 0 est inchangée.
2. **Où trouver le WhatsApp** → **corrigé** : étiquette mono « LIEN DANS LA BIO » sous la pastille (y 1110).
3. **Inviter à faire le test** → **corrigé** : étiquette mono « FAITES-LE AVEC UN AMI » au-dessus du titre final (y 404), apparition à eTitle − 0,1 s.
4. **Texte alternatif inexact** → **corrigé** : « Écran sombre » ; « une croix sobre s’inscrit à côté de chaque question ».
5. **Boucle perdue** → **corrigé** : sur les 0,34 dernières secondes, l’écran final s’efface et l’accroche complète revient (grand 5 Klein à sa pose t = 0, étiquette, titre, question). La dernière image est identique à la première.
6. **Couverture de grille sans en-tête** → **corrigé** : `couverture-grille.jpg` a maintenant l’en-tête des posts (logo, « TEST · 5 SECONDES » à droite, filet), l’accroche descend de 175 px dessous. Rendu par `index.html?grid` (uniquement pour la couverture, la vidéo n’a pas d’en-tête).

### Directeur artistique — à corriger
1. **Le 0 illisible (empilement « 1 »/« 0 », « œil » d’encre)** → **corrigé** : le 0 est posé à 7,44 s, rebond 7,44 – 7,62 ; l’encre part à 7,78 et couvre l’écran à 8,12 (E.in conservé). L’encre passe **sous** les chiffres et le 0 vire du Klein au blanc pendant que l’encre le recouvre : il reste lisible sur l’encre et s’efface avec l’écran encre. Toutes les étapes suivantes sont décalées de +0,28 s (plus les +0,3 s du stratège).
2. **Collision accroche / téléphone** → **corrigé** : étiquette, titre et question sortent en E.out sur 0,18 s (1,75 → 1,93, −40 px) ; le téléphone monte de 1,95 à 2,60 (E.out4). Plus aucun texte de l’accroche quand le téléphone entre.
3. **Whooshs en retard** → **corrigé, avec un autre calcul que celui proposé** : j’ai mesuré l’enveloppe des whooshs isolés (son rendu avec et sans eux, différence exacte). Dans `make_audio.py`, le pic tombe à t − 0,45 + 0,75 × d (soit ≈ t pour d = 0,6 et t − 0,075 pour d = 0,5), et non à t + 0,7 × d. Avec les valeurs proposées (1,62 / 7,77 / 10,53), les pics seraient arrivés avant le mouvement. J’ai donc placé les pics au plus fort de chaque mouvement : métamorphose 2,04 s (t 2,04, d 0,6), encre ≈ 7,99 s (t 8,06), rétraction ≈ 11,46 s (t 11,54, rise false). Le glissé de la métamorphose est à 1,95 s, au départ du téléphone.
4. **Les réponses du « après » ne ressortent pas** → **corrigé** : aux coches, zoom du téléphone 1 → 1,12 (origine 340 px 560 px, 0,4 s, E.out), plus une descente de 60 px pour que le haut du téléphone ne recouvre pas « Démo · lieu fictif ». La pulsation est remplacée par une barre d’encre de 3 px à gauche de chaque bloc (x 8 du site, scaleY 0 → 1 en 0,25 s sur le carillon). `.hrs` passe à 19 px (heures en 600 encre au lieu de 500 gris), `.bt` à 18 px. La photo et la ligne du bas ne descendent plus qu’à 55 % d’opacité.
5. **Roulement des chiffres en fondu** → **corrigé** : fenêtre rectangulaire de 150 px (rayon 0) centrée sur l’anneau, translation pure de 150 px en 0,22 s (E.inOut), opacité toujours 1. Écart volontaire : le roulement démarre à tin − 0,18 (et non − 0,04) pour que le nouveau chiffre soit **posé** au tic, ce que demande la critique.
6. **Klein à 5,9 %** → **corrigé** : #big 800 → 720 px, bas du glyphe inchangé (y ≈ 965). Mesuré : 4,8 % de pixels Klein à t = 0, 4,9 % à 1,5 s.

### Directeur artistique — à améliorer
1. **Numéro caché sous la légende d’Instagram** → **corrigé** : pied de page du faux site avec padding-bottom 350 ; en fin de défilement, « Tél. 021 000 00 00 » remonte vers y 1400 (toujours minuscule, mais dans la zone sûre).
2. **Bloc encre trop haut, croix près des icônes** → **corrigé** : bloc descendu de 80 px (iLab 528, iTitle 578, questions 922 + i × 140), lignes réduites à 820 px (croix finissant à x 900).
3. **Espace trop large devant « ? » sur les titres** → **corrigé** sur « retenu ? » et « le test ? » avec `<span style="margin-left:-.12em">&nbsp;</span>?` (espace d’environ 12 px à 124–128 px, sans risque de repli de police pour U+202F).
4. **Écran final trop lent à se construire** → **corrigé** : écart de 0,2 s entre les entrées, rise de 0,35 s, filet + logo + @ en un seul temps. Écran complet en 0,95 s. Les éléments du « après » sortent maintenant en 0,18 s (E.out) pour ne pas croiser l’étiquette « FAITES-LE AVEC UN AMI ».
5. **Le 5 se pose avant l’anneau** → **corrigé** : l’anneau se trace de 2,00 à 2,35 s et se ferme quand le 5 se pose ; le tic est à 2,36 s.

### Gardé (demandé par les deux critiques)
Concept participatif, image t = 0 (seul le 5 est un peu plus petit), étiquette « UNE MÉTHODE DE DESIGNERS », compte à rebours réel de 5 s avec un tic par seconde, faux site crédible et bienveillant, « après » en DA v7, croix tracées trait par trait, coches sur le carillon, discipline Klein (5, chiffres, « avant »), vert seulement sur l’icône WhatsApp, grille x = 80.

### Contrôles après correction
`ERREURS PAGE : 0`. 17,0 s, 1080×1920, H.264 30 i/s + AAC 48 kHz, −14,8 LUFS intégrés, crête −1,1 dBFS. Planche (18 images) et trois images extraites de la vidéo finale (2,2 / 9,9 / 12,6 s) regardées : démo marquée dès l’entrée du téléphone, 0 blanc lisible sur l’encre, croix à x ≤ 900, réponses zoomées avec barres d’encre, « Démo · lieu fictif » dégagé du téléphone zoomé, passage propre vers l’écran final (rien ne se croise à 14,0 s), dernière image = première image.

## Verdict (juge final, regard neuf)

**Version retenue : v2** (la version actuelle). Comparée à `v1/` image par image aux mêmes instants (0 / 0,5 / 1 / 1,5 / 1,85 / 2,2 / 2,6 / 7,6 / 7,9 / 8,3 / 9 / 10,5 / 11,6 / 12,6 / 13,4 / 14,1 / 14,6 / 15,5 / 16,5 s et dernière image), v2 est meilleure partout ou égale :
- le 0 est lisible, alors que v1 avait un « œil » d’encre sur le chiffre à 7,6 s et un écran encre presque vide à 7,9 s ;
- l’encre jaillit de l’anneau (vraie idée de mise en scène) ;
- l’écran final se construit en moins d’une seconde au lieu de 2 ;
- « Faites-le avec un ami » et « Lien dans la bio » sont ajoutés ;
- la boucle revient sur l’accroche ;
- « Démo · lieu fictif » est visible dès l’entrée du téléphone.

### Contrôle §6, point par point
1. **Fichier.** ffprobe : 17,0 s, 1080×1920, H.264 30 i/s, AAC 48 kHz stéréo. ebur128 : −14,8 LUFS intégrés, LRA 2,6 LU, crête vraie −1,1 dBTP. Le son se termine par un fondu vers le silence à 17 s, et le coup sourd de t = 0 relance la boucle.
2. **Accroche.** t = 0, 0,5, 1 et 1,5 s : étiquette, grand 5 Klein, « Le test des 5 secondes. Votre site le passe ? ». La phrase est lisible dès la première image et comprise bien avant 1,5 s. Klein mesuré : 4,8 % de l’image à t = 0, 4,9 % à 1,5 s, 4,78 % sur la dernière image.
3. **Planche.** Chaque vignette change, aucune n’est vide. Le téléphone est volontairement coupé par le bas de l’image. Les textes qui comptent restent dans la zone sûre, l’@ finit vers x 870.
4. **Tailles.** Titres de 124 à 128 px, questions 62 px, liste de coches 44 px, étiquettes mono 30 px. Le texte du faux site est petit exprès (c’est le test). Les réponses du site « après » font environ 32 à 36 px une fois zoomées, mais la liste de coches à 44 px au-dessus les répète. Klein sert d’accent seulement : le 5, les chiffres du minuteur, « avant » et le point du logo. Aucune faute dans la vidéo, la légende, les accroches alternatives ni le texte alternatif. 36 espaces insécables, 5 hashtags.
5. **Règles.**
   - « Démo · lieu fictif » est visible à chaque apparition du commerce.
   - Le nom « Atelier Vellaz » est inventé : une recherche web ne trouve aucun commerce de ce nom.
   - Le numéro est un numéro d’exemple : 021 000 00 00.
   - Aucune statistique. « Depuis 1994 » appartient au texte du faux site et reste cohérent avec « plus de trente ans ».
   - Aucun prix, aucun délai promis, pas de Gland, aucune mention d’IA, pas de jargon. WhatsApp est le seul contact d’OONDE.
6. **Écran final.** On y trouve le logo, « On vous montre votre site avant que vous payiez. », « Maquette offerte sur WhatsApp », « Lien dans la bio » et @oonde_studio.
7. **Partage.** Oui. Le test se refait en 30 secondes sur le site d’un ami, et l’écran final le dit en toutes lettres.

### Notes /10
| Accroche | Rythme | Clarté | Beauté | Partage | Conformité | **Global** |
|---|---|---|---|---|---|---|
| 8 | 7,5 | 8,5 | 7,5 | 7,5 | 9,5 | **8** |

### Ce qui marche
- Le Reel est participatif : le spectateur passe lui-même le test, rate, et comprend sans qu’on le lui dise.
- Le vrai compte à rebours, avec un tic par seconde, justifie 5 s sur un seul plan.
- Le faux site est crédible et bienveillant : on ne se moque pas, on montre.
- L’encre qui sort de l’anneau, les chiffres qui roulent et les croix tracées trait par trait font précis, façon « présentation produit ».
- Le « après » donne les trois réponses d’un coup alors que le minuteur affiche encore 5.
- L’écran final est complet, et la boucle revient sur l’accroche.

### Ce qui reste (non bloquant)
- **Boucle (16,66 – 17,0 s).** C’est un fondu enchaîné : pendant une dizaine d’images, « Le vôtre passe le test ? » apparaît en double exposition derrière le 5, ce qui fait « vidéo ». Mieux vaut une coupe nette, ou un passage par le papier vide puis l’accroche.
- **Dernière seconde du compte à rebours (6,35 – 7,4 s).** La moitié basse du téléphone est un pied de page beige vide. Le numéro « caché » est si petit (≈ 16 px) qu’on ne le remarque pas : l’idée « le numéro est tout en bas » ne passe pas vraiment.
- **Transition vers le « après » (11,4 – 11,7 s).** L’anneau ne montre qu’un point, sans chiffre. L’image est un peu étrange, mais elle ne dure qu’un instant.
- **Crête vraie à −1,1 dBTP**, pour une cible de −1,5 (dépassement dû à l’encodage AAC) : négligeable.

**À publier : oui, après validation d’Alexandre.** Aucune correction bloquante n’a été nécessaire. Les points ci-dessus sont des finitions pour une éventuelle v3.
