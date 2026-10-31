# 03 · Avant / après — Salon Mirabelle — notes

> **v2 (corrections après deux critiques)** : voir § Corrections en bas. La section Production ci-dessous décrit la v1 (vidéo, planche, couverture et légende copiées dans `v1/`).

## Production

- **Durée** : 13,4 s, 30 i/s, 1080×1920 (402 images). Rendu par `_kit/render.cjs`, son par `_kit/make_audio.py` (`src/cues.json`, humeur « bright », 100 bpm, rythmique douce de 2,3 à 8,6 s), mux avec `loudnorm=I=-15:TP=-1.5`.
- **Accroche (t = 0)** : « DÉMO · LIEU FICTIF » + « Même salon. / Même photo. » + étiquette « AVANT » au-dessus du téléphone qui montre déjà l’ancien site. J’ai préféré « Même photo » à « Même jour » : c’est vérifiable à l’écran (la vignette de l’avant et la photo pleine largeur de l’après sont la même image, `t-coiffure.jpg`) et ça dit le vrai message : seule la présentation change.
- **Transition signature** : deux calques complets (page + étiquette) superposés ; l’après est découpé (`clip-path`) à gauche d’un trait Klein de 3 px qui part du bord gauche et traverse l’écran (E.inOut, 0,9 s). Tout ce que le trait franchit change, y compris l’étiquette AVANT → APRÈS (petit rebond au passage). Poignée ronde blanche ‹ › cerclée Klein, comme un vrai curseur de comparaison.
- **Après** : défilement doux avec parallaxe sur la photo (3,35 s), doigt qui touche le bouton « Réserver sur WhatsApp » (enfoncement puis retour en ressort, une seule fois, 4,6 s), léger retour vers le haut (5,55 s).
- **Second aller-retour** : le trait revient au milieu (vue partagée, étiquettes APRÈS ‹ › AVANT, oscillation amortie), file à gauche (tout l’avant), repart à droite (tout l’après).
- **Fin** : le téléphone tombe, le trait quitte le bord droit, se raccourcit, s’épaissit et s’incline jusqu’à devenir la barre oblique de « Votre avant / après ? » (position mesurée dans le DOM au chargement, donc toujours juste). Puis « La maquette est offerte. », pastille WhatsApp, logo, @oonde_studio. Même axe centré et même place de titre que l’accroche : la boucle raccorde.
- **Couverture** : la vue partagée (photo pleine largeur à gauche, la même en vignette à droite) avec le titre d’accroche, rendue avec `--q cover` (mode prévu dans `src/index.html` : titre « Même photo. » et bloc de titre descendu de 46 px pour que « DÉMO · LIEU FICTIF » reste dans la grille 1080×1350).
- **Autocritique (2 passes)** : 1) roulement du titre final qui se chevauchait avec « Autre site. » → sorties puis entrées décalées ; doigt qui masquait « WhatsApp » → déplacé à droite du texte ; logo trop bas (vide de 450 px) → remonté ; poignée descendue sur la photo pour que les étiquettes APRÈS / AVANT se lisent. 2) écran final trop long et phase après un peu molle → toute la seconde moitié avancée de 0,6 s, durée 14,2 → 13,4 s. Vérifié : zone de sécurité (`--q safe`), lecture réduite à 390 px de large (titre, étiquettes et nom du salon lisibles).
- **Règles** : aucun prix (ni OONDE, ni coiffure : prestations dans un PDF fermé dans l’avant, simples puces sans prix dans l’après), numéro de l’avant fictif (021 000 00 00) et légèrement flou, commune Montreux, pas de Gland, WhatsApp seul contact, Klein limité au trait, à la poignée, au point de l’étiquette APRÈS et à la barre oblique.
- **À savoir** : la page de l’avant utilise les polices système Liberation Serif / Sans (aspect « vieux site » voulu), présentes sur la machine de rendu ; ailleurs, le navigateur prendrait DejaVu.

## Corrections (v2, 12,35 s)

Contrôle v2 : 0 erreur de page, 12,35 s (371 images), 1080×1920, H.264 + AAC, −15,3 LUFS. J’ai regardé les images clés, la planche (18 images), la couverture, la grille et 3 images extraites de la vidéo finale (0,3 / 6,3 / 12,2 s). **Nouveau sens de lecture : AVANT à gauche du trait, APRÈS à droite.**

### Stratège — à corriger absolument
1. **Sens de lecture inversé** — corrigé. Le trait part du bord droit et balaie de droite à gauche (1,8 – 2,7 s) ; l’après est à droite (`#wrapB` découpé `inset(0 0 0 X−SX)`, étiquette APRÈS découpée depuis la gauche). Vue partagée AVANT ‹ › APRÈS. Dans l’avant, la vignette est passée à gauche (`.thumb`/`.cap` left 18, `.p1` left 134, width 223) : la vue partagée et la couverture opposent vignette, lien PDF, « Tél. » en image et « Horaires : voir la brochure » (à gauche) à la grande photo, au bouton et à la bulle (à droite). Couverture et grille re-rendues, légende et texte alternatif réécrits dans ce sens.
2. **Vue partagée trop courte** — corrigé. Le trait arrive au milieu en 0,45 s (E.out5, 4,8 – 5,25), fait une seule oscillation de 16 px (5,25 – 5,55), puis les étiquettes entrent (5,55 – 5,75), restent immobiles et pleinement visibles 1,2 s (5,75 – 6,95) et sortent à 7,1. L’aller-retour commence ensuite.
3. **Accroche** — corrigé. (a) Trait Klein et poignée ‹ › posés dès t = 0 sur le bord droit du téléphone (x = 898), impulsion « tirez-moi » à 0,6 s (−24 px puis retour, 0,35 s) avec un tic léger. (b) Pastille AVANT encre (fond #111318, texte blanc, point #B9BCC2, 34 px), même poids que APRÈS : le passage ne joue plus que sur le point (gris → Klein) et le mot. (c) Défilement de l’avant 0,5 – 1,4 s, balayage 1,8 – 2,7 s, cues avancés de 0,5 s.
4. **Fin trop longue** — corrigé. Durée 13,4 → 12,35 s. Logo et @oonde_studio posés à 10,35 s, soit 2 s avant la fin. `cues.json` : duration 12,35, rythmique 1,8 – 8,1, « end » à 10,25 (le son finit sur l’accord final et son fondu).
5. **Phase après sans enjeu** — corrigé. Retour vers le haut et son cue supprimés (`scB = 122·E.inOut(seg(t, 2.85, 3.8))`). Le trait revient dès 4,8 s (au lieu de 6,4). Option retenue : 0,17 s après l’appui (4,27 – 4,57 s, E.out), une bulle verte neutre sans logo monte en bas à droite : « Une coupe / samedi matin ? ». J’ai raccourci le texte proposé (« Bonjour, une coupe samedi matin ? ») pour que la bulle tienne entière dans la moitié APRÈS de la vue partagée. Elle reste ainsi à l’écran de 4,3 à 8,5 s, sans être coupée par le trait.
6. **Légende** — corrigé. 1re ligne « Coiffeurs de Genève à Montreux : votre site ressemble à l’avant ou à l’après ? », ligne démo juste après les lignes gauche / droite, accroche 2 « Même salon. Regardez le bouton. », hashtags en minuscules (#coiffuremontreux #commercelocal #sitewebsuisse #avantapres #rivieravaudoise), texte alternatif réécrit (« la page de gauche… la page de droite… », bulle comprise).

### Stratège — à améliorer
1. **Zoom de lecture sur l’avant** — corrigé, avec un écart. Le zoom va de 1 à 1,16 (0,5 – 1,25 s), reste au maximum jusqu’à 1,5 s, puis revient à 1 à 1,8 s, avant que le trait ne bouge. J’ai changé l’origine : (890, 652), coin haut droit du téléphone, au lieu de (540, 1250). Avec l’origine demandée, le haut du téléphone montait sur la pastille AVANT et le bord droit de l’écran passait sous le trait posé à x = 898. Le zoom s’applique au téléphone seul (`#zoom`) et le découpage de l’après est calculé en coordonnées non zoomées, donc il reste exact même pendant le zoom. Le défilement passe de 112 à 150 px de page pour que le PDF, le « Tél. » et « Horaires : voir la brochure » soient dans la zone pendant le zoom. Limite : au plein zoom, le lien PDF mesure environ 24 px dans l’image. C’est mieux, mais pas encore confortable sur téléphone.
2. **Étiquette démo effacée trop tôt** — corrigé. Le téléphone sort sans fondu de 8,15 à 8,55 s avec translateY 1400 px (à 1100 px, le haut du téléphone restait dans le cadre). « DÉMO · LIEU FICTIF » s’efface ensuite, de 8,55 à 8,7 s.
3. **script.md** — corrigé : tableau réécrit avec les temps finaux et le sens AVANT à gauche / APRÈS à droite.
4. **Trial Reels** — noté dans `legende.md` : l’accroche 1 (« Votre site a encore un PDF… ») est à tester en premier, et le zoom rend le PDF lisible de 1,25 à 1,5 s. Je n’ai pas fait de variante vidéo : ce n’était pas demandé, et rien n’est publié sans Alexandre.

### Directeur artistique — à corriger absolument
1. **Métamorphose trait → barre** — corrigé, en trois temps. 1) Le dernier passage s’arrête au centre (x = 540) à 8,12 s, et la poignée passe de l’échelle 1 à 0 entre 8,12 et 8,27 s. 2) Le téléphone sort sans opacité (8,15 – 8,55 s, E.in), en même temps que le titre (0,25 s). L’étiquette APRÈS ne réapparaît plus. Le trait reste seul de 8,55 à 8,7 s. 3) De 8,7 à 9,15 s, le trait se contracte par les deux bouts vers la barre, s’incline à 17° et passe de 3 à 9 px (E.inOut5). Le coup sourd tombe à 9,15 s. « avant » et « après ? » sortent ensuite de derrière la barre (±60 px → 0, chacun masqué de son côté, E.out5, 0,35 s) et « Votre » monte à 9,25 s. Le whoosh culmine à la fin de la contraction (gain 1,3).
   *Arbitrage :* le stratège voulait que le dernier passage aille jusqu’à « tout l’après » ; le directeur artistique voulait qu’il s’arrête au centre. J’ai suivi le DA, puisqu’il s’agit du visuel. Le second passage part bien vers la gauche, mais il s’arrête au milieu : la vue partagée (avant à gauche, après à droite) devient directement « avant / après ? ». L’après complet reste montré de 2,7 à 4,8 s.
2. **Roulement « Même photo. » → « Autre site. »** — corrigé avec la solution préférée. Pendant le balayage, le trait part de y = 414 et balaie aussi la ligne 2 : « Même photo. » n’est visible qu’à gauche du trait, « Autre site. » qu’à droite (clip-path calculé depuis X), sans fondu ni translation. Effet secondaire : sur une image arrêtée au milieu du balayage, on lit un mélange (« Même p|ite. »). En mouvement (0,9 s), c’est le principe même du curseur.
3. **Aller-retour stroboscopique** — corrigé. Le trait file vers la droite en 0,45 s (tout l’avant), marque une pause de 0,12 s, puis revient au centre en 0,5 s (E.inOut cubique). La vitesse de pointe tombe à environ 63 px par image, contre 95 à 135 avant. Le trait passe à 4 px pendant le déplacement (3 px à l’arrêt) et les glissés sont calés sur le début de chaque passage (7,05 et 7,62 s).
4. **Vue partagée** — corrigé (voir stratège 1 et 2). Les étiquettes de la vue partagée sont maintenant des pastilles encre de même poids, avec le point gris (AVANT) ou Klein (APRÈS), comme les pastilles du haut.
5. **Écran final trop haut et figé trop longtemps** — corrigé. Les valeurs demandées sont décalées de +20 px, comme tout le bloc de titre (voir DA, à améliorer 5) : sous-titre à 580, `#cta` à 720, logo à 1200, @oonde_studio à 1298, soit un bloc de 306 à 1340. L’écran reste figé 2 s.
6. **Lecture de l’avant + pastille AVANT** — corrigé (zoom et pastille encre, voir stratège 3 et à améliorer 1).

### Directeur artistique — à améliorer
1. **Doigt** — corrigé : disque de 60 px rgba(255,255,255,.35) sans ombre, plus un anneau blanc qui s’élargit à l’appui (échelle 1 → 1,7, opacité 0,5 → 0, 0,35 s, E.out). L’enfoncement du bouton reste à 4,5 %.
2. **Interlettrage des titres** — corrigé (−0,025em). « Même photo. » tient toujours sur une ligne (vérifié à t = 0 et sur la couverture).
3. **Whoosh inaudible** — corrigé : gain 1,3, pic à la fin de la contraction, coup sourd exactement à la pose de la barre (9,15 s).
4. **Polices de l’avant** — rien à corriger, c’est noté : rendu fait sur cette machine (Liberation Serif / Sans). Ailleurs, Chromium prendrait DejaVu et l’avant changerait d’aspect. Je n’ai ajouté aucune police.
5. **Bloc de titre descendu de 20 px** — corrigé (eyebrow 272, `#m1` 306, `#m2` 414). Le titre final utilise les mêmes masques, donc la boucle raccorde toujours. La couverture garde en plus son décalage de 46 px pour que « DÉMO · LIEU FICTIF » reste dans la grille 1080×1350.

### Gardé tel quel (demandé par les deux critiques)
Même photo des deux côtés, progression des titres, détails de l’avant (PDF 2014, « Tél. » flouté, brochure, mise à jour 12.03.2014), page après (Cormorant, bouton encre à icône verte, horaires), trait de 3 px et poignée, Klein en accent, barre oblique dessinée, parallaxe 0,38, fin « La maquette est offerte. » + WhatsApp + logo + @oonde_studio, et règles du §4 (démo visible tant que le salon est à l’écran, Montreux, aucun prix, WhatsApp seul contact).

## Verdict (juge final, regard neuf)

**Version retenue : v2** (fichiers à la racine du dossier ; v1 reste dans `v1/` pour comparaison). J’ai comparé les deux planches, les deux couvertures et des images extraites aux mêmes instants (0 ; 0,5 ; 1 ; 1,5 ; 2,2 ; 3 ; 4,5 ; 6 ; 7,5 ; 9,2 ; 12,3 s). La v2 est meilleure presque partout. Le sens de lecture est juste (AVANT à gauche, APRÈS à droite). Dès la 1re image, la pastille encre et la poignée ‹ › annoncent un curseur de comparaison. Le zoom rend l’avant lisible. La bulle verte donne un enjeu à l’après. Enfin, la fin est séquencée et ne se chevauche plus.

### Contrôle §6 (version finale)
1. 1080×1920, 30 i/s, 371 images, 12,37 s, H.264 + AAC. Son : −15,3 LUFS intégré. **Crête vraie corrigée** : elle était à −0,9 dBFS (au-dessus du −1,5 visé). Je l’ai ramenée à **−1,8 dBFS** par un nouveau mux de la même piste (`audio.wav` du rendu v2), avec loudnorm en deux passes et AAC à 48 kHz. La vidéo est identique, copiée sans réencodage (même empreinte md5 du flux H.264).
2. t = 0 : lisible et structuré (DÉMO · LIEU FICTIF, « Même salon. / Même photo. », pastille AVANT, trait et poignée). t = 0,5 : défilement. t = 1 et 1,5 : plein zoom, le PDF et le « Tél. » en image se lisent. Le message (« voici l’avant, l’après arrive ») est compris avant 1,5 s, mais la révélation ne vient qu’à 2,7 s.
3. Planche : chaque vignette change. Rien n’est coupé, sauf le titre mixte « Même p|site. » sur une image arrêtée au milieu du balayage (assumé). Il y a cependant un passage presque vide de 8,55 à 9,15 s : le trait seul sur fond papier, sur environ 18 images.
4. Titres 106 px, pastilles 34 px, étiquettes 32 px, écran final 52 et 46 px. Le Klein reste un accent (trait, poignée, point APRÈS, barre oblique). **Restent sous 44 px à l’écran** : le bouton « Réserver sur WhatsApp » (environ 30 px) et la bulle (37 px). Je n’ai trouvé aucune faute dans la vidéo ni dans la légende.
5. La démo est marquée tant que le salon est à l’écran. Aucun prix, ni d’OONDE ni de coiffure (prestations en puces sans prix). Montreux, pas de Gland, aucun chiffre ni témoignage inventé, aucun délai, aucune allusion à l’IA. Seul contact : WhatsApp. Légende : 5 hashtags, accroche avec mot-clé local, appel au partage.
6. Écran final : « Votre avant / après ? », « La maquette est offerte. », pastille WhatsApp, logo, @oonde_studio, tenu 2 s. Le titre est au même endroit que l’accroche, donc la boucle raccorde.
7. Partage : oui, un coiffeur reconnaît le site d’un collègue dans l’« avant ». C’est crédible sans être moqueur. L’envie est plus esthétique qu’utile.

### Notes
Accroche 7,5 · rythme 8 · clarté 7 · beauté 8 · partage 7 · conformité 9 · **global 7,7**

### Ce qui marche
- Le curseur de comparaison est une vraie trouvaille de mise en scène. Il est visible dès t = 0, et il balaie la page, la pastille et la 2e ligne du titre d’un seul geste.
- La métamorphose du trait en barre oblique de « avant / après ? » a l’effet « jeune génie » voulu.
- L’avant est crédible, sans être ridicule : PDF 2014, numéro dans une image, mise à jour 12.03.2014. L’après est propre et dans la DA v7.
- Le rythme est vif : un changement environ toutes les secondes, 12,4 s au total, et une boucle propre.

### Ce qui reste (non bloquant)
- Les deux textes qui portent le bénéfice (le bouton et la bulle) restent sous 44 px. Le gain concret, réserver d’un geste, ne s’écrit nulle part en grand : « Autre site. » constate un changement sans nommer ce qu’il apporte.
- De 8,55 à 9,15 s, le trait est seul sur le papier, juste avant l’appel à l’action. Un passage de 0,3 s suffirait.
- Écran final : il reste environ 370 px de vide entre la pastille WhatsApp et le logo. Le texte compte 11 mots, conformément au brief, contre 8 recommandés par les leçons.
- Les polices de l’avant (Liberation) ne sont garanties que sur cette machine. Ce n’est pas un problème pour la vidéo rendue.

### À publier ?
**Oui, publiable en l’état** (≥ 7), après validation d’Alexandre. Pour une v3 éventuelle : un titre d’après qui nomme le bénéfice, et le bouton et la bulle agrandis (ou repris hors du téléphone en 44 px et plus).
