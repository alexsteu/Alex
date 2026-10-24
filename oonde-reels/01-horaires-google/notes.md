# 01 · Horaires Google en 30 secondes — notes

## Production

- **Reprise** du brouillon laissé par le premier producteur (script.md + src/index.html) : la structure, l’accroche, la boulangerie fictive « Boulangerie Pivoine, Vevey » et le parcours en 5 gestes étaient bons, gardés tels quels. Corrections faites :
  - accroche : le titre se coupait en trois lignes (« Google dit que / vous / êtes ouvert. ») et la ligne « Le client, lui, trouve porte close. » le chevauchait → titre en deux lignes, sous-titre placé dessous, apparition dès 0,8 s ;
  - accroche : porte et téléphone ne se masquent plus (l’enseigne était coupée), statut « Ouvert · Ferme à 18:30 » agrandi et entouré d’un anneau Klein (même code que le post 07 « Fiche Google ») : la contradiction se lit encore sur un écran de 390 px de large ;
  - « Enfin d’accord » : le fondu croisé éditeur / fiche donnait une image brouillée → l’éditeur se referme comme une feuille, puis le statut bascule « Ouvert » → « Fermé · Ouvre mar. à 07:00 » ;
  - bonus : les dates se superposaient à « Ajouter une date » et le bas du bouton « Enregistrer » dépassait sous les onglets → la ligne descend d’abord, la date apparaît ensuite ; défilement corrigé ;
  - pont vers le site : le téléphone fantôme (semi-transparent) sur le fond encre est remplacé par une sortie nette vers le bas ;
  - en-tête : le chrono dépassait la zone de sécurité à droite (x 998) → en-tête ramené à x 80–936 ;
  - écran final : logo réduit (il écrasait la phrase), ajout de « DE GENÈVE À MONTREUX » ;
  - rythme : l’accroche (3,3 s) et la promesse « 30 secondes pour corriger ça » (1,9 s) ont été allongées par une table de temps (`warp`) dans render(t), le reste est décalé de 0,5 s. Durée finale 21,7 s.
- **Intitulés vérifiés** (centre d’aide Fiche d’établissement Google, en français, octobre 2026) : app Google Maps → « en bas à droite, Établissement » → « Modifier le profil » → « Enregistrer » (answer 3039617) ; section « Horaires », « Horaires d’ouverture exceptionnels », « Ajouter une date » (answer 6303076) ; depuis la recherche : « Éditer la fiche » (mis dans la légende, pas à l’écran). Interface dessinée en squelette neutre, sans logo ni couleur Google.
- **Contrôles** : ERREURS PAGE 0 ; 1080×1920, 30 i/s, H.264 + AAC 48 kHz, 21,7 s, −14,6 LUFS intégrés ; zone de sécurité vérifiée (?safe) ; lecture vérifiée à 390 px de large ; 4 images extraites de la vidéo finale relues. Démo marquée en permanence quand la boulangerie est à l’écran ; aucun chiffre, aucun prix, WhatsApp seul contact.
- **Couverture** : image de l’accroche à t = 2,3 s, rendue avec `?cover` (tout descend de 40 px pour que « DÉMO · LIEU FICTIF » reste dans le recadrage de la grille y 285–1635).
- **Limites connues** : les étapes 01 à 05 restent affichées 1,6 à 1,8 s, un peu moins que la règle « mots ÷ 3 + 0,8 s » quand on compte l’étiquette mono ; choix assumé pour le rythme (le titre de chaque étape fait 1 à 3 mots). Le chrono « 00:30 » est une mise en scène de la promesse (le geste réel prend environ 30 secondes, pas 8). Chromium tente au lancement des connexions de mise à jour (google.com, gvt1.com) refusées par le proxy : sans effet sur le rendu.

## Corrections (tour 2, 8 octobre 2026)

Version précédente conservée dans `v1/` (vidéo, planche, couverture, légende). Nouvelle durée : 21,3 s (au lieu de 21,7). La table `WARP` est supprimée : `render(t)` travaille désormais en temps réel.

### Stratège — must fix
1. **Dates exceptionnelles visibles dès l'étape 05** → corrigé. Les trois lignes sont à opacité 0 et « + Ajouter une date » reste en haut de la section tant que t < T.bonus ; elles n'arrivent que pendant le bonus, puis restent.
2. **« Et votre site, il est d'accord ? » trop court** → corrigé : plan de 16,6 à 19,5 s (2,9 s), titre entièrement lisible à +0,25 s de la coupe.
3. **Ordre « Enfin d'accord » → bonus → site** → corrigé selon le minutage proposé : étapes 4,9–13,3 (1,68 s chacune, coche et 00:30 à 12,6 s), bonus 13,3–15,1 dans le même éditeur (défilement, « + Ajouter une date », dates à 13,9 / 14,2 / 14,5), « Enfin d'accord. » 15,1–16,6, site 16,6–19,5, fin 19,5–21,3. Pour rester exact, l'ajout des dates remet le bouton sur « Enregistrer » et on enregistre à nouveau (coche à 14,9 s).
4. **Accroche presque fixe** → corrigé : accroche réduite à 2,7 s ; à 1,7 s l'anneau pulse (1 → 1,08 → 1 en 0,35 s) et la pancarte donne un à-coup amorti ; cue `tick` note 81 à 1,7 s.
5. **Promesse trop courte** → corrigé : 2,7–4,9 s (2,2 s) ; « LUNDI 08:15 » devient « 00:00 » seulement à 4,5 s.
6. **Trou entre deux titres** → corrigé (voir DA 1).

### Directeur artistique — must fix
1. **Titres qui clignotent** → corrigé. Le sortant monte de 28 px (E.in, 0,16 s) pendant que l'entrant arrive à la même image (+28 px → 0, E.out5, 0,32 s, lignes décalées de 0,04 s). Plus aucune image vide. Écart choisi : l'opacité du sortant tombe en 0,12 s (E.out) plutôt qu'en E.in, sinon les deux titres restaient presque opaques l'un sur l'autre pendant 3 images. L'étiquette « 0N · » reste affichée et seul le chiffre défile en compteur (0,2 s).
2. **Fonds gris intermédiaires** → corrigé. Le téléphone et la porte sortent vers le bas (0,25 s, E.in), puis l'encre arrive en coupe franche sur le choc sourd de 16,6 s, opaque dès la première image. La carte du site monte de 60 px (0,35 s, E.out5). La sortie vers l'écran final est une coupe franche sur la cue `end`. Plus aucune opacité sur `#inkbg`.
3. **Doigt qui masque l'intitulé** → corrigé. Le doigt vise l'icône de l'onglet (dans la loupe), le crayon de « Modifier le profil » et le « + » de « Ajouter une date ». Remplissage .08, contour 4 px gardé. Le cercle disparaît en 0,2 s (opacité 0 à 13,93 s, avant la 1re date). Pour « Horaires », le doigt est descendu sous le mot. Reste : le cercle effleure encore le « A » de « Ajouter » pendant environ 0,3 s et le bout du bouton « Enregistrer ».
4. **Second bleu #8B97FF** → corrigé : titre entièrement blanc, `--kleinL` supprimé. Le Klein ne reste que sur la pastille « ? » et l'anneau de la ligne « Lundi ».
5. **Klein dilué pendant le tutoriel** → corrigé : point du chrono en encre, « Ouvert » de la fiche du propriétaire en encre 600 avec un point encre. Pendant le tutoriel, le Klein ne sert plus qu'au numéro d'étape et au doigt.
6. **Espacements serrés** → corrigé. Avec un titre sur 2 lignes, le téléphone commence à y 640 (étapes 01 et 02, bonus) ; sur 1 ligne, à 556 (étape 03) et 508 (étapes 04 et 05). Accroche : porte en scale .92 ancrée à x 60, avec environ 20 px d'écart avec le téléphone.
7. **Étape 01 trop petite** → corrigé par la loupe : un cercle de 340 px grossit 2× l'onglet « Établissement » (intitulé à environ 33 px) et entre en 0,3 s (E.out5). Le doigt est posé sur l'icône dans la loupe.
8. **« Enregistrer » au milieu du formulaire** → corrigé avec la variante proposée par le DA : un bouton pilule « Enregistrer » en haut à droite de l'éditeur, à la hauteur de la croix. Il reste visible à toutes les échelles, sans défilement. Une barre fixe en bas aurait été hors zone de sécurité à l'échelle 1,24.

### Should fix
- Stratège 1 (mise à jour pas immédiate) → corrigé dans la légende : « La mise à jour peut prendre un moment avant d'apparaître sur Google. » Je n'ai pas mis d'étiquette à l'écran : 1,5 s ne suffit pas pour lire un mot de plus.
- Stratège 2 (« Modifier la fiche », parfois « Éditer la fiche ») → corrigé dans la légende.
- Stratège 3 (1re ligne locale, ligne d'actualité Noël) → corrigé.
- Stratège 4 (« Ouvre mar. à 07:00 ») → corrigé avec la formule générique « Fermé · Ouvre demain à 07:00 », faute de téléphone réglé en français pour vérifier l'ordre exact. Police réduite à 32 px pour que le texte tienne dans l'anneau.
- Stratège 5 (« 01 · APPLI GOOGLE MAPS », « 05 · TOUCHEZ ») → corrigé. « Et voilà » n'est pas ajouté sur « Enfin d'accord. » : 4 mots en 1,5 s dépasseraient la règle de lecture.
- Stratège 6 (« 1ᵉʳ janv. ») → corrigé (<sup>er</sup> à 0,6 em).
- Stratège 7 (crête vraie) → corrigé : loudnorm en deux passes (I −15, TP −2, linear) puis alimiter (0,6) avant l'AAC. Contrôle ebur128 sur le fichier final : −15,4 LUFS, crête vraie −3,4 dBFS (avec seulement alimiter 0,79, l'AAC remontait à −0,4).
- Stratège 8 (boucle) → corrigé : « LUNDI 08:15 » revient en haut à droite dans les 0,4 dernières secondes.
- DA 1 (style de la porte) → corrigé : trait unique de 4 px, reflets et barre de sol décalée supprimés (remplacés par une ombre douce et une ligne de sol), poignée fixée au cadre. La pancarte qui oscille est gardée.
- DA 2 (bonus vide) → corrigé : cadrage de l'étape 04 (scale 1,24) ; la section exceptionnelle monte en haut de l'écran et les 3 dates occupent la moitié haute.
- DA 3 (écran final) → corrigé : titre à 104 px, bloc descendu de 80 px (logo à y 640), @oonde_studio arrive en dernier (+0,3 s, pop).
- DA 4 (porte qui entre pendant que l'éditeur sort) → corrigé : l'éditeur sort entièrement (0,3 s, E.in), puis la porte entre (0,35 s, E.out5) avec 0,05 s d'écart. Le téléphone dézoome en même temps que l'éditeur sort, il n'y a donc pas de mouvement contraire.
- DA 5 (couverture-grille) → corrigé : `?cover` descend de 70 px (« DÉMO · LIEU FICTIF » à environ 56 px du bord haut du recadrage).

### Contrôles (tour 2)
Aucune erreur de page (`render.cjs` n'affiche la ligne ERREURS PAGE qu'en cas d'erreur, et elle n'est pas apparue). 1080×1920, 30 i/s, H.264 + AAC 48 kHz, 21,3 s. Relu : images clés, images de transition (2,78 / 4,98 / 13,38 / 15,2 / 16,62 / 19,52 s), planche de 18 images, et trois images extraites de la vidéo finale (1,75 / 11,2 / 17,4 s). Couverture prise à t = 2,3 s.

## Verdict (juge final, 8 octobre 2026)

**Version retenue : v2** (fichiers à la racine du dossier). Comparée à v1 sur les planches, les couvertures et 25 images extraites aux mêmes instants des deux vidéos, v2 est meilleure partout : plus d'écran de titre vide (v1 à 10,5 s), plus de fondus gris sur le fond encre ni de « Maquette offerte » délavé, loupe lisible sur « Établissement », « Enregistrer » à sa place réelle, dates exceptionnelles qui n'apparaissent qu'au bonus, boucle « LUNDI 08:15 » sur la dernière image.

**Notes** : accroche 8 · rythme 7 · clarté 8 · beauté 7,5 · partage 7,5 · conformité 9 · **global 7,6**. Publiable.

**Contrôles (README §6)**
1. 1080×1920, 30 i/s, H.264 + AAC 48 kHz stéréo, 21,3 s (dans 12–22 s). ebur128 sur le fichier final : −15,4 LUFS intégrés, LRA 4,9 LU, crête vraie −3,4 dBFS. Son présent dès la première demi-seconde.
2. t = 0 / 0,5 / 1 / 1,5 s : titre complet dès la première image, porte « FERMÉ » contre fiche « Ouvert », « DÉMO · LIEU FICTIF » visible ; sous-titre à 0,75 s. Message compris avant 1,5 s.
3. Planche : changement visible entre chaque vignette, rien de vide ; seule la vignette 10,0 s tombe sur la transition (voir plus bas).
4. Titres 88 px et plus, Klein limité (« ouvert », numéro d'étape, doigt, « ? », « offerte »). Orthographe de la vidéo relue : aucune faute, guillemets « » et apostrophes ’ corrects.
5. Démo marquée tant que la boulangerie est à l'écran, aucun chiffre ni prix, pas de Gland, pas d'IA, WhatsApp seul contact. Intitulés recontrôlés sur l'aide Google en français (answer 3039617) : « En bas à droite, appuyez sur Établissement » → « Modifier le profil » → « Enregistrer » : exacts.
6. Écran final : logo, « DE GENÈVE À MONTREUX », « Maquette offerte. », « Vous voyez votre site avant de payer. », bouton WhatsApp, @oonde_studio.
7. Partage : oui, surtout grâce au bonus des fêtes (« pense à mettre tes horaires de Noël »).

**Retouche faite par le juge** : légende, 1re ligne « Google vous dit ouvert, votre porte dit fermé ? » → « Google vous affiche ouvert, mais votre porte dit fermé ? » (tournure plus naturelle) ; virgule superflue retirée avant « et envoyez-le ». Vidéo inchangée.

**Ce qui marche** : l'accroche se comprend sans le son en une image ; le tutoriel est exact et se suit sur son propre téléphone ; la loupe de l'étape 01 ; le chrono discret ; la chute « Et votre site, il est d'accord ? » amène la maquette offerte sans vendre ; la boucle.

**Ce qui reste (non bloquant)**
- À chaque changement de titre, 2 images où l'ancien et le nouveau titre (et les étiquettes mono) se superposent en gris (visible à 9,97–10,03 s : « « Horaires » » sous « Lundi : fermé. ») : se lit comme un léger flou, pas comme une erreur, mais un œil de DA le voit.
- 21,3 s, c'est le haut de la fourchette ; les étapes (1,68 s, étiquette mono + titre ≈ 5 mots) sont un peu courtes selon la règle de lecture, l'écran final (1,8 s pour 12 mots) aussi. La boucle rattrape en partie.
- Le statut « Fermé · Ouvre demain à 07:00 », clé du « Enfin d'accord », ne fait qu'environ 30 px : il se lit grâce à l'anneau mais gagnerait à être zoomé.
- Écran 03 « Horaires » : le téléphone montre un formulaire squelette presque vide pendant le geste.
- Formule « Ouvre demain à 07:00 » non vérifiée sur un téléphone en français (reste plausible et générique).

**À publier ?** Oui, après le regard d'Alexandre. Rien de bloquant.
