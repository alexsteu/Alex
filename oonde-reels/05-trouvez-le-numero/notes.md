# 05 · Trouvez le numéro — notes

## Production

**Construction.** `src/index.html` part du gabarit du kit (contrat `render(t)` déterministe, aucune transition CSS ni horloge). Tout est posé et animé dans `render(t)`. Le téléphone vit dans une « fenêtre » (y 630 → 1920) sous un en-tête fixe. On peut donc zoomer très fort sur l’écran sans que le téléphone passe sur les titres. Toutes les étapes ont le même en-tête : étiquette mono à gauche, « DÉMO · LIEU FICTIF » à droite, titre de 102 px sur deux lignes et chrono mono bleu Klein à droite de la 2e ligne. Commerce inventé : **La Pinte Vermeil**, restaurant à Vevey, nom sans accent (la police Cormorant n’est pas utilisée, voir lecons.md, tour 1, point 10). Le numéro est un numéro d’exemple : 021 000 00 00.

**Leçons du tour 1 appliquées.**
1. *Lisibilité dans le téléphone* : le numéro est révélé par un zoom ×3,1 (46 px à l’écran, il passe du gris au gris foncé pendant que le cercle se trace). Le bouton « Écrire sur WhatsApp » est zoomé jusqu’à 45 px. Les messages sont repris hors du téléphone en 102 px (titres) et en 30 px mono (« PIED DE PAGE · 3E NIVEAU », « SOUS LE POUCE ↓ »).
2. *Transitions de titres* : chaque titre sort en 0,14 s avant que le suivant commence à entrer. L’ancien a donc disparu avant que le nouveau dépasse 30 % d’opacité (Trouvez → Trouvé ? à 4,32/4,44 ; Trouvé ? → Il était… à 5,50/5,66 ; → Même commerce… à 8,06/8,30 ; → fin à 11,02/11,22).
3. *Boucle* : aucun fondu enchaîné entre deux écrans de texte. L’écran final s’efface (13,38 → 13,50), 2 images de papier, puis l’accroche remonte (13,56 → 13,74). La dernière image est identique à la première (écart moyen mesuré sur la vidéo : 0,65 sur 255, bruit de compression).
4. *Pas d’écran vide* : le site « après » a des pastilles (La carte, Itinéraire, Terrasse) au-dessus du pouce. Le zoom de révélation montre les trois niveaux du pied de page (Infos pratiques › Accès et contact › Tél.).
5. *Mouvement toutes les 0,6 à 1 s* : battement du chrono (0,62), carrousel (0,78), départ (1,30), défilement (1,42), fenêtre « newsletter » (2,10), fermeture (2,84), défilement jusqu’en bas (2,98), zéro (4,30), Trouvé ? (4,44), zoom (5,02), cercle (5,76), étiquette (6,70), coupe (8,06), téléphone (8,26), pouce (9,02), zoom (9,14), étiquette (9,66), fin (11,22). Les dixièmes du chrono tournent en continu de 1,3 à 4,3 s. Une poussée lente accompagne les deux tenues.
6. *Écran final* : « Le vôtre se trouve en combien ? » (6 mots) + bouton « Maquette offerte » avec l’icône WhatsApp (2 mots), soit 8 mots. Dessous, l’étiquette mono « SUR WHATSAPP · LIEN DANS LA BIO », puis le logo et @oonde_studio. Écran complet en 0,84 s, tenu environ 1,3 s.
7. *Minutage* : durée fixée d’abord (13,8 s). Le numéro passe vraiment à l’écran, minuscule, de 3,5 à 4,3 s (vers y 1380). On peut le trouver en revisionnant : c’est le ressort de la rejouabilité.
8. *Son* : pics des whooshs placés selon la formule de make_audio.py (pic = t − 0,45 + 0,75 × d), donc t = 5,30 pour le zoom (pic ≈ 5,37), t = 8,38 pour l’arrivée du téléphone, t = 9,46 pour le zoom du bouton. Rythmique douce seulement pendant le chrono (1,3 → 4,3). Tic toutes les 0,5 s, pop sur la fenêtre « newsletter », coup sourd à 0, carillon sur le cercle, goutte et carillon sur le toucher, accord final à 11,70.

**Deux passes d’autocritique (images clés, planche, `--q safe`, réduction à 390 px).**
- Passe 1 : l’écran du site n’était pas mis à l’échelle (le contenu occupait 60 % de la largeur). C’est corrigé (`#scr` × 1,6718). Le cercle était trop serré et touchait les lignes voisines : il est élargi, avec plus d’air autour du numéro. Le numéro est remonté (vers y 1380) pour rester dans la zone sûre pendant le défilement. Le site « après » avait un grand blanc : j’ai ajouté des pastilles, et le zoom est recadré pour garder les horaires au-dessus du bouton. L’écran final est resserré.
- Passe 2 : « Trouvez le numéro. », « Même commerce, » et « Le vôtre se trouve » dépassaient x 940. Les titres passent de 108 à 102 px et le titre final de 112 à 108 px. Le chrono est décalé à x 936. Le zoom du bouton passe de ×1,36 à ×1,32 pour que le bouton tienne dans x 135–945. À 390 px de large, le titre, le chrono, le numéro entouré et le bouton se lisent.

**Contrôles.** Aucune erreur de page (render.cjs n’affiche rien quand il y en a 0). Vidéo de 13,8 s, 1080×1920, 30 i/s, H.264 + AAC 48 kHz. Mixage : loudnorm I = −15 puis limiteur (`alimiter=limit=0.75`), car loudnorm seul donnait une crête vraie de −1,0 dBFS après AAC. Mesure finale : −15,6 LUFS intégrés, crête vraie −1,6 dBFS. Klein seulement sur le chrono, sa mèche et le cercle de révélation. Vert seulement dans les disques de l’icône WhatsApp. « Démo · lieu fictif » est visible chaque fois que le commerce est à l’écran. Aucun prix, aucun chiffre inventé, aucune mention d’IA, WhatsApp comme seul contact d’OONDE.

**Points à juger par Alexandre.**
- Le numéro du faux site est un **téléphone** (c’est le jeu), mais l’appel à l’action d’OONDE reste WhatsApp seul.
- `couverture-grille.jpg` est le recadrage imposé (`crop=1080:1350:0:285`) : l’étiquette « À VOUS DE JOUER » arrive à 15 px du haut de la vignette. C’est lisible mais serré. Si on veut plus d’air, il faudra une variante de couverture dont l’en-tête est descendu de 40 px.
- Le bord droit du téléphone zoomé (« après ») dépasse un peu x 940, sous les icônes d’Instagram. Le texte du bouton reste dans la zone.

**Kit.** Aucun défaut nouveau. Une remarque : `render.cjs` n’affiche « ERREURS PAGE » que s’il y a des erreurs. Avec 0 erreur il n’écrit rien, contrairement à ce que laisse penser le README (« il faut 0 »).

## Corrections (v2, après la critique stratège 7/10 et DA 6,6/10)

Version précédente conservée dans `v1/` (vidéo, planche, couverture, légende). Durée : 13,8 → **13,68 s**. Contrôles v2 : 0 erreur de page, 1080×1920, 30 i/s, H.264 + AAC 48 kHz, **−15,6 LUFS, crête vraie −3,0 dBTP** (mesurés sur le MP4 final), écart moyen première/dernière image 0,75/255 (bruit de compression), transitions de titres sans chevauchement (sortie 0,14 s puis entrée).

**Stratège : à corriger**
1. Titre de l’après → **corrigé** : « Refait : WhatsApp / sous le pouce. » (102 px, chrono 0,5 s à droite de la 2e ligne, sans chevauchement). Étiquette « DÈS LE PREMIER ÉCRAN ↓ » (mono 30 px). « APRÈS » gardé.
2. Chrono figé 1,3 s → **corrigé** : départ à 0,40 s (3,0 → 0,0 entre 0,40 et 3,40), tout avancé de 0,90 s ; image t = 0 identique (3,0 s). cues.json recalé : beat 0,40 → 3,40, tics toutes les 0,5 s depuis 0,40. Le temps gagné est réinvesti dans le raccord avant/après (DA 1), la tenue de la révélation et l’écran final (tenu 1,8 s complet au lieu de 1,3 s).
3. Pied de page vide → **corrigé** : padding-bottom 24 px ; sous le numéro, « Plan d’accès » (rectangle schématique 330×120), « Horaires d’été », « Suivez-nous » (3 ronds), « Partenaires » (3 logos gris), « Recrutement », puis le ©. Le défilement s’arrête quand le bas de page touche le bas de l’écran ; le numéro finit à y 1370.
4. Rejouabilité à l’écran → **corrigé**, avec un chiffre ajusté : « IL ÉTAIT À L’ÉCRAN DÈS 1,2 S ↻ » (carte blanche, x 80, y 1376, fondu 0,25 s, pop doux). Mesure image par image : le numéro est entièrement dans l’image dès que le chrono affiche **1,2** (t = 2,27 s) ; « 1,0 s » aurait été vrai mais imprécis, j’ai mis la valeur exacte. Affichée 1,6 s (sous la règle des 2,8 s pour 6 mots : c’est une phrase de bonus, le titre principal reste « Il était tout en bas. »). La flèche ↻ tourne une fois à 6,6 s pour animer la tenue.
5. Titre final → **corrigé** : « Et sur votre site, / en combien ? » (108 px, espace insécable avant « ? »). Bouton et étiquette gardés.
6. Légende → **corrigé** : 1re ligne « Vous trouvez le numéro en 3 secondes ? Un jeu pour les restaurants et commerces de Lausanne à Vevey. », mention du numéro d’exemple ajoutée, hashtags inchangés (5). Texte alternatif mis à jour.
7. « 3E NIVEAU » → **corrigé** : « PIED DE PAGE · NIVEAU 3 », dès la fin du cercle (5,40), à l’écran 2,1 s.

**Stratège : à améliorer**
1. Numéro introuvable en pause → **corrigé** : .l3 11 px en #8f8780 (≈ 18 px pendant le jeu, ≈ 57 px une fois zoomé).
2. « Prêt ? » → **corrigé** : « 3 secondes pour trouver un numéro sur un site. À vous. »
3. « Trouvé ? » trop court → **corrigé** : zoom à 4,20 (équivalent 5,10), sortie à 4,68 : 1,14 s.
4. Couverture de grille serrée → **corrigé** : recadrage `crop=1080:1350:0:250` (l’étiquette est à 50 px du haut).
5. Pastille « Appeler » → **corrigé, à valider par Alexandre** : rangée « La carte · Itinéraire · Appeler » sous le bouton (contour, sans icône). C’est le contact du restaurant fictif, pas celui d’OONDE. Si Alexandre préfère ne pas montrer d’appel du tout, remplacer par « Terrasse » (un mot dans src/index.html).

**DA : à corriger**
1. Raccord avant/après → **corrigé** : dézoom inverse ×3,1 → ×1 (7,50 → 7,84, ease-in-out) jusqu’au téléphone à la même taille et à la même place que l’avant (x 200–880, haut 680), puis balayage vertical de la page avant vers la page après (7,84 → 8,14, out). Le téléphone ne bouge plus, et aucune image n’est vide. « Il était tout en bas. » reste pendant le dézoom, puis « Refait… » entre avec le balayage. **Écart volontaire** : remonter le dock de 30 px CSS ne suffisait pas. À cette échelle, le bas de l’écran du téléphone est hors de l’image (y ≈ 2100), et le bouton serait tombé vers y 1970. J’ai donc placé le bouton dans le premier écran de la page refaite, sous les horaires (centre à y ≈ 1497) : il est sous le pouce, dans la zone sûre. Le pied de page « sticky » est supprimé.
2. Lignes coupées par le masque → **corrigé** : dégradé papier → transparent de 56 px (y 630–686) et filet de 1 px #DCDED8 à y 630, visibles seulement pendant les plans zoomés (l’image t = 0 ne change pas). Vérifié sur les images 5,05 / 6,95 / 7,66 / 9,3 / 10,7 de la vidéo : aucune demi-ligne en haut.
3. Composition de la révélation → **corrigé** : numéro entouré à y 1000, site sur toute la hauteur (plan d’accès jusqu’en bas), étiquette 28 px sous le cercle et alignée sur son bord gauche, 2e étiquette à x 80 sur carte blanche (rayon 10, filet #DCDED8), cadrage poussé à gauche (centre x 500) : le bord du téléphone est à x < 20.
4. Défilement dans le vide → **corrigé** (voir stratège 3) et ajout d’un rebond iOS de 12 px CSS (3,13 → 3,38).
5. Pouce et appui → **corrigé** : disque de 64 px CSS, opacité .35, posé sur la flèche à 70 px du bord droit (le libellé reste lisible). Le bouton est maintenant aligné à gauche, avec une flèche à droite. Au toucher, scale .97 et −8 % de luminosité pendant 0,12 s, onde blanche à 40 % en 0,3 s, battement du chrono (×1,06 en 0,15 s). Goutte et carillon gardés (8,46 / 8,50). Le disque est blanc translucide avec un filet sombre, parce qu’un disque gris foncé à .35 disparaissait sur le bouton noir.
6. Étiquette « 3E » → **corrigé** (voir stratège 7).
7. Entrée de l’écran final → **corrigé** : le téléphone sort par le bas (+240 px, opacité 0, 0,28 s, courbe in) pendant la sortie du titre. Le titre final entre à 10,74, le bouton 0,12 s après. Aucune image de papier vide. « DÉMO · LIEU FICTIF » reste aussi affiché sans interruption entre l’avant et l’après.

**DA : à améliorer**
1. Virgule du chrono → **corrigé** : `<span class="cm">` avec `margin:0 -.18em`, chiffres tabulaires gardés. Vérifié sur 3,0 / 1,0 / 0,5.
2. Identité du commerce dans l’après → **corrigé** : nom en italique serif bordeaux #6B2128 (23 px CSS, Liberation Serif comme l’avant, pas de Cormorant), point « Ouvert ce soir » et pastille active « La carte » en bordeaux.
3. Étiquette du pouce → **corrigé** : alignée sur le bord gauche du bouton (x ≈ 148), 16 px au-dessus. Elle apparaît à 8,72, pendant le zoom, et reste 1,9 s.
4. Défilement trop doux → **corrigé** : 3 lancers de 0,45 s (courbe out cubique), calés sur les glissés de cues.json (0,54 · 2,10 · 2,70). Entre le 1er et le 2e, la fenêtre « newsletter » apparaît et se ferme, au lieu d’un simple arrêt de 0,15 s. Il y a donc un mouvement toutes les 0,6 à 0,7 s.

**Gardé, comme demandé** : accroche t = 0, vrai chrono de 3 s au dixième, fenêtre « Ne manquez rien ! », numéro qui passe vraiment à l’écran, cercle bleu tracé à la main, « Démo · lieu fictif » sur chaque plan du commerce, numéro d’exemple invalide, boucle exacte, Klein en accent seulement, vert seulement dans l’icône WhatsApp.

**Kit.** `mux.py` tel quel donnait une crête vraie de **−0,1 dBFS** sur ce son, au-dessus de la limite de −1,5. Je l’ai contourné avec une copie dans mon brouillon (`alimiter limit=0.64, attack=0.5`), ce qui donne −15,6 LUFS et −3,0 dBTP. Le kit n’est pas modifié. Il faudrait sans doute un limiteur à suréchantillonnage, ou une mesure de crête vraie suivie d’une 2e passe, dans `mux.py`.

## Verdict (juge final, regard neuf)

**Version retenue : v2** (fichiers à la racine du dossier). Comparée à `v1/` aux mêmes instants (planches, images extraites à 0 · 0,5 · 1 · 1,5 · 2,3 · 3,5 · 4,3 · 5,5 · 6,5 · 7,7 · 8 · 8,5 · 9,5 · 11 · 11,6 · 13 · 13,6 s, légendes), la v2 est meilleure presque partout. Le chrono part tout de suite. Le pied de page n’est plus vide. La révélation est plus grande et mieux composée. Le titre de l’après dit le gain (« Refait : WhatsApp sous le pouce. »). L’avant et l’après se raccordent dans le même cadre, et la question finale est plus directe.

**Correction rapide faite par le juge.** Entre 10,74 et 10,87 s, environ 4 images montraient « Et sur votre site, en combien ? » imprimé par-dessus le téléphone sortant, encore opaque à 70-80 % (sortie en courbe *in* sur 0,28 s). C’est une image hybride, contraire aux leçons 2 et 14. J’ai remplacé la sortie par une courbe *out* sur 0,14 s (`src/index.html`, ligne 485) : le téléphone a disparu quand le titre final entre, avec une seule image de papier entre les deux. Vidéo re-rendue, son remixé avec le même `audio2.wav` et la même copie réglée de `mux.py` (`mux_lim.py`, brouillon). Planche régénérée et ligne 10,60 du script mise à jour. La couverture n’a pas changé (t = 0 identique).

**Contrôle §6 sur la version finale.**
1. 0 erreur de page. 13,67 s, 1080×1920, 30 i/s, H.264 + AAC 48 kHz, −15,6 LUFS, crête vraie −3,0 dBTP (ebur128 sur le MP4).
2. t = 0 : défi, chrono 3,0 s et téléphone, lisibles et intrigants. À 0,5 s le chrono tourne, à 1 s le carrousel change, à 1,5 s la fenêtre « Ne manquez rien ! » surgit. On comprend l’accroche avant 1,5 s.
3. Planche : il y a un changement entre chaque vignette, rien de vide, et les titres sont dans la zone sûre.
4. Titres de 102 et 108 px, numéro révélé à environ 57 px, bouton zoomé à 45 px. Le bleu Klein ne sert qu’au chrono, à la mèche et au cercle ; le vert qu’à l’icône WhatsApp. Aucune faute trouvée dans la vidéo ni dans la légende.
5. « Démo · lieu fictif » est visible sur chaque plan du commerce. Le numéro d’exemple est invalide. Aucun prix, aucun chiffre inventé, pas de Gland, pas d’IA, pas de délai. 5 hashtags.
6. Écran final : logo, « Maquette offerte » avec l’icône WhatsApp, « Sur WhatsApp · lien dans la bio », @oonde_studio. Il est complet 1,8 s. La boucle est exacte : écart moyen de 0,53/255 entre la première et la dernière image.
7. Un commerçant l’enverrait-il ? Oui : « essaie avec ton site » se dit naturellement.

**Notes.** Accroche 8,5 · Rythme 8 · Clarté 7,5 · Beauté 8 · Partage 7,5 · Conformité 9 · **Global 8,0**.

**Ce qui marche.** C’est un vrai jeu, avec un vrai chrono et un numéro qui passe vraiment à l’écran : on a envie de revoir. L’image t = 0 est nette. La révélation au cercle tracé à la main fonctionne. L’après nomme le gain, et la boucle est parfaite.

**Ce qui reste (non bloquant).**
- « IL ÉTAIT À L’ÉCRAN DÈS 1,2 S ↻ » reste 1,6 s pour 7 mots (règle : 3,1 s). La phrase est aussi ambiguë avec un compte à rebours : 1,2 s écoulée, ou le chrono qui affiche 1,2 ? Enfin, à ce moment-là, le numéro est vers y 1760, sous la légende d’Instagram ; il n’entre dans la zone sûre que vers 0,6 au chrono. Mieux : « LE CHRONO AFFICHAIT 1,2 ↻ », tenu 3 s, ou rien.
- La pastille « Appeler » de l’après est le contact du restaurant fictif, pas celui d’OONDE. Je la juge conforme : c’est même la réponse au jeu, le numéro devient un geste. Elle reste à valider par Alexandre ; sinon, la remplacer par « Terrasse ».
- Révélation : les lignes « Parking pub… » et le plan sont coupés par le bord droit, ce qui fait un plan un peu beige et gris.
- L’écran final compte 13 mots avec l’étiquette mono (8 sans elle).

**À publier : oui**, après validation d’Alexandre (pastille « Appeler »). Rien n’a été publié.
