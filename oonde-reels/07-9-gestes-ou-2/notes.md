# 07 · 9 gestes ou 2 ? — notes

## Production

**Livré** : `07-9-gestes-ou-2.mp4` (16,3 s, 1080×1920, 30 i/s, H.264 + AAC 48 kHz, −15,3 LUFS, crête vraie −2,3 dBFS), `couverture.jpg`, `couverture-grille.jpg`, `sheet.jpg`, `legende.md`, `script.md`, `src/` (index.html, cues.json, t-coiffure.jpg). Rendu : 489 images, aucune erreur de page.

**Construction**
- Écran partagé : deux téléphones de 352 px (écran 332 px, page de 280 px CSS → échelle 1,186), « Ancien site » à gauche, « Nouveau site » à droite, un grand compteur au-dessus de chacun (chiffre 166 px + « geste / gestes » 48 px, accord au singulier pour 0 et 1). Un seul chiffre Klein à la fois : le « 2 » de l’accroche, puis le compteur actif ; l’autre passe à l’encre.
- Les 9 gestes sont réellement joués et comptés à l’écran (anneau de toucher Klein, pincement à deux doigts pour le zoom) : menu, « Prestations », PDF, zoom, retour, menu, « Contact », numéro (lien tél.), « Appeler » dans la fenêtre de confirmation d’iOS. Ensuite seulement l’écran d’appel, et la 2e ligne « aux heures d’ouverture. ». À droite : « Réserver sur WhatsApp » ouvre la discussion avec le message pré-rempli (clavier QWERTZ suisse ouvert), puis « Envoyer » : bulle verte, une coche, aucune réponse.
- Le téléphone inactif est estompé (opacité 0,48) pour guider l’œil ; les deux reviennent à pleine opacité pour le récapitulatif « 9 gestes / 2 gestes ».
- Gestes calés sur le tempo de la musique (0,76 s = 79 BPM, début 1,52 s) : chaque tic tombe sur un temps, la note monte d’un geste à l’autre.
- Légendes de geste à 84 px, hors du téléphone (le téléphone montre, le texte explique) ; coupe franche entre deux légendes (pas de double exposition).
- Écran final ≤ 8 mots : « Moins de gestes, plus de clients. » puis bouton à icône WhatsApp « Maquette offerte », logo, @oonde_studio ; tout est posé à 14,5 s, tenu 1,8 s.
- Couverture : image t = 0 rendue avec `?cover`, qui place la mention « Démo · lieu fictif · Salon Mirabelle » sous les téléphones pour qu’elle reste dans le recadrage de grille 1080×1350 (y 285–1635).

**Deux passes d’autocritique (corrigées avant la vidéo)**
1. L’écran de fin ne s’affichait pas (`display:''` retombait sur le `display:none` du CSS) → bascule explicite en `block`. Toucher « Appeler » mal placé (entre les deux boutons) → recentré. La discussion WhatsApp était un grand fond vide → clavier ouvert, champ et bulle remontés au milieu de l’écran (et dans la zone de sécurité). Chiffre sortant du compteur qui touchait l’étiquette pendant le roulement → il s’efface pendant la sortie. Téléphone estompé trop délavé (0,38) → 0,48.
2. Zone de sécurité : le titre final (112 px) et « 2 gestes » agrandi au récapitulatif dépassaient x 940 → titre à 100 px, agrandissement ×1,12 au lieu de ×1,2, interlettrage de l’étiquette du haut réduit. La légende « Appeler / aux heures d’ouverture » restait affichée alors que le focus passait à droite → « Toucher « Réserver » » arrive dès la bascule. Vérifié aussi en réduction à 390 px de large : légendes, compteurs et étiquettes lisibles.

**Écarts et défauts du kit signalés**
- `_kit/mux.py` (limiteur à 0,79) a donné une crête vraie de −1,3 dBFS sur ce Reel (au-dessus de −1,5) : contourné avec une copie locale dans le brouillon, limiteur à 0,66 → −15,3 LUFS, −2,3 dBFS. Le kit n’a pas été modifié.
- Les deux téléphones font déborder le cadre du téléphone de droite de 16 px à droite de x 940 (aucun contenu) ; le bas des téléphones passe sous y 1500 pendant le récapitulatif (illustration seulement).
- Le texte dans les téléphones (15–18 px à l’écran) est décoratif ; tout ce qui porte l’argument est repris en 46–166 px hors du téléphone.
- À vérifier par Alexandre : sur iPhone, un lien wa.me ouvre en principe directement WhatsApp (lien universel) avec le texte pré-rempli ; sur certains appareils une page intermédiaire « Continuer vers la discussion » peut ajouter un toucher. Le Reel dit « 2 gestes » pour le cas courant.

## Corrections (v2, après la critique stratège 6,8 et DA 7)

v1 conservée dans `v1/` (vidéo, planche, couverture, légende). v2 : 16,64 s, 499 images, 0 erreur de page, 1080×1920, H.264 + AAC 48 kHz, −15,0 LUFS, crête vraie −1,7 dBTP. Le son passe par `_kit/mux.py` tel quel : sur cette version il reste sous −1,5 dBTP, la copie locale à limiteur 0,66 n'a pas servi.

**Stratège, à corriger absolument**
- S1, « 2 gestes » jamais vérifié sur un vrai téléphone : **corrigé en partie**. La légende dit maintenant « Sur cette démo, on a compté chaque geste. » (« On a compté sur un iPhone » est retiré). Le test sur un vrai téléphone reste **à faire par Alexandre avant publication** : je n'ai pas d'iPhone ici. Ouvrir le lien exact des sites OONDE depuis Safari sur un iPhone où WhatsApp est installé, et filmer l'écran. Si la page « Continuer vers la discussion » apparaît, essayer `https://api.whatsapp.com/send?phone=41…&text=…` et garder le format qui ouvre directement la discussion. Si aucun ne le fait, il faut passer à « 9 gestes ou 3 ? » partout (accroche, compteur, récapitulatif, légende) et montrer le geste « Continuer » à l'écran.
- S2, motif du détour par le PDF : **corrigé**. Les légendes du Reel deviennent « PDF des horaires » et « Zoomer pour lire » (84 px, 3 mots au plus). La légende Instagram ajoute la phrase demandée sur le parcours du client.
- S3, écran final sans action : **corrigé** avec l'option A. Titre « Et chez vous ? » (100 px, « vous » en Klein), bouton [icône] « Maquette offerte sur WhatsApp » (46 px), logo, @oonde_studio. La question renvoie à l'accroche.
- S4, accroche trop courte : **corrigé**. Toute la suite est décalée d'un temps (+0,76 s). L'accroche reste à l'écran 0 – 2,06 s (fondu de 1,94 à 2,06 s) et le premier geste tombe à 2,28 s. Le téléphone de droite s'estompe de 1,74 à 2,06 s.
- S5, « aux heures d'ouverture. » trop court : **corrigé**. La ligne entre à S[8] + 0,20 = 8,56 s, avec le coup sourd au même moment. La bascule est fixée à SW = 10,21 s, ce qui laisse la ligne 1,78 s à l'écran. Pour garder une légende lisible à droite, les deux gestes de droite passent sur les demi-temps (11,02 s et 11,78 s). Ils restent calés sur la musique, mais sur le contretemps.

**Stratège, améliorations**
- S-a, « Envoyer » → « Envoyer sur WhatsApp » : **corrigé**. Le texte mesurait 862 px à 84 px, il passe donc à 78 px (800 px, x 140–940).
- S-b, 1re ligne de la légende : **corrigé** (« Salons de coiffure de Genève à Montreux : … »).
- S-c, garder « Réserver en 2 gestes. » : **gardé**. Ni « confirmé » ni « réservé » n'apparaissent ailleurs.
- S-d, creux des gestes 5 à 8 : **corrigé**. Le compteur gauche grossit de 3 % par geste (×1,24 au 9e). Pour qu'il ne touche pas le téléphone, son origine est sur la ligne de base et son masque est raccourci (154 px). L'étiquette monte de 1,2 px par geste. La note du tic monte toujours à chaque geste.

**DA, à corriger absolument**
- D1, récapitulatif sans force : **corrigé**. Le récapitulatif s'ouvre sur une coupe franche à 12,54 s. Les chiffres passent à 290 px et les téléphones à ×0,82 (haut 800, bas 1387, droite 924). De 12,54 à 12,94 s, seul « 9 gestes » est allumé et la droite est à 35 % en gris. À 12,94 s, une coupe allume « 2 gestes » en Klein (pop 0,24 s), puis le tout tient jusqu'à 14,44 s. Le translateY(+60) est supprimé.
- D2, sortie de l'accroche par un masque : **corrigé**. Le masque de #head est retiré. L'accroche sort par un fondu de 0,12 s (E.in) avec une montée de 30 px. J'ai contrôlé les images à 1,93 / 1,97 / 2,00 / 2,03 / 2,07 s : aucun mot coupé.
- D3, titre seul 0,55 s sur l'écran final : **corrigé**. Le compteur « 0 geste » arrive à END + 0,12, le bouton à + 0,22 (pop déplacé là), le logo à + 0,30 et @oonde_studio à + 0,34 (montées de 0,32 s sur 24 à 28 px). Tout est en place à + 0,66 et tient 1,54 s : écran final de 2,2 s au lieu de 3 s.
- D4, « 1 gestes » et « 0 » bleu : **corrigé**. Le pluriel suit maintenant le chiffre affiché ((p < .5 ? v − 1 : v) > 1). Chaque compteur reste gris jusqu'à son premier geste, puis passe en Klein.
- D5, l'île disparaissait sur l'écran d'appel : **corrigé**. La barre d'état passe au-dessus de l'écran d'appel, avec l'heure et les icônes en blanc. « Salon Mirabelle » est ajouté en gris sous le numéro (11 px dans la page, soit environ 13 px à l'écran).
- D6, téléphone inactif terne : **corrigé**. Inactif : opacité 0,35, saturate(0), ×0,94. Actif : ×1,04. Transitions en E.inOut sur 0,32 s.
- D7, cadre fixe pendant les gestes : **corrigé en partie**. La caméra pousse lentement sur le téléphone actif, de ×1,04 à ×1,16, et l'origine suit le point touché (E.inOut, 0,3 s par cible). La colonne est pleine en hauteur : les compteurs sont au-dessus et le bas ne doit pas dépasser 1500. Pour que ×1,16 tienne, les téléphones ont donc une échelle de base de 0,88 et l'origine est bornée (haut ≥ 758, bas ≤ 1500, mesuré 768 – 1499). Conséquence : la poussée se voit surtout comme un zoom lent et la dérive vers le point touché reste faible. À l'écran, le téléphone actif finit environ 2 % plus grand qu'en v1 (×1,02), pas 16 %.

**DA, améliorations**
- D-a, compteurs gris à t = 0 : **corrigé**. Ils sont en #B9BCC2 et l'accroche domine. Cette image sert aussi de couverture.
- D-b, zoom du PDF sur du remplissage : **corrigé**. Le pincement est centré sur « Horaires / Rendez-vous par téléphone uniquement » (×2,2, pour que la ligne tienne en entier). Un filet Klein de 2 px souligne la ligne à 5,00 s et les doigts sont sous le texte.
- D-c, écran final qui fait gabarit : **corrigé** (option « Et chez vous ? »). Un compteur vide « 0 geste » gris est posé sous le titre (166 px), ce qui rappelle la 1re image. L'écran compte 9 mots si l'on compte le « 0 » et « geste », 7 sans le compteur. Je l'ai gardé parce qu'il se lit comme une image (le compteur de l'accroche). Alexandre peut le retirer s'il veut s'en tenir strictement à 8 mots.
- D-d, note fausse sur le logo WhatsApp : **corrigé** dans script.md (« icône WhatsApp seule (autorisée par la DA), pas d'interface WhatsApp imitée à l'identique »).

**Ce qui est gardé** : le concept du chiffre qui roule, l'image t = 0, la mention démo permanente (aussi dans la discussion et sur la couverture), aucune réponse du salon, « Appeler / aux heures d'ouverture. », un geste toutes les 0,76 s, les interfaces dessinées, les coupes franches entre légendes, la synchronisation du son, les 5 hashtags et les accroches alternatives.

**Contrôles** : 11 images clés en plein format, la planche à 18 images, 5 images de la transition de l'accroche, 4 images autour du récapitulatif et 3 images tirées du MP4 final (3,4 / 9,4 / 13,3 s). Positions mesurées dans la page : légendes x ≤ 940, bouton final x 142–939, « 2 gestes » x 598–934, téléphones bas ≤ 1499. Le « 2 » qui roule apparaît coupé dans son masque sur une vignette de la planche (3,9 s). Cet effet, que la DA demande de garder, existait déjà en v1.

**Signalé** : le défaut du kit noté en v1 (`mux.py` à −1,3 dBTP) ne s'est pas reproduit sur cette version (−1,7 dBTP). Le kit n'a pas été modifié.

## Verdict (juge final, regard neuf)

**Version retenue : v2**, avec une correction du juge. La v2 est meilleure que la v1 sur presque tout : accroche plus longue (2,06 s), compteurs gris à t = 0, plus de « Moins de gestes » coupé par un masque (vignette hybride à 13,4 s dans la v1), récapitulatif en coupes franches avec chiffres de 290 px, légendes « PDF des horaires » / « Zoomer pour lire » qui donnent la raison du détour, écran d’appel complet, « WhatsApp » écrit en toutes lettres sur l’écran final (absent en v1). Seul recul : les téléphones sont plus petits (échelle 0,88) pour une poussée de caméra qui ne se voit presque pas.

**Correction faite par le juge** : l’écran final comptait **10 mots** (« Et chez vous ? » 3 + « 0 geste » 2 + « Maquette offerte sur WhatsApp » 4 + « @oonde_studio » 1), et non 9, contre 8 au plus (leçons 6 et 22). Le compteur gris « 0 geste » était en plus ambigu (« chez vous : 0 geste » peut se lire comme une réponse). Retiré ; titre (y 680), bouton (y 880), logo (y 1120) et @oonde_studio (y 1218) recentrés. Vidéo re-rendue (499 images, 0 erreur de page), son repris tel quel de la v2 (copie du flux AAC) : −15,0 LUFS, crête vraie −1,7 dBTP. Images identiques à la v2 avant 14,44 s (contrôlé par empreinte à 3,4 / 9,4 / 13,3 s). Planche, script.md et texte alternatif de legende.md mis à jour.

**Contrôle README §6** : 1080×1920, 30 i/s, H.264 + AAC 48 kHz, 16,63 s, −15,0 LUFS, −1,7 dBTP, 0 erreur de page ✔ · t = 0 / 0,5 / 1 / 1,5 s : accroche lisible et comprise tout de suite, mais image **figée** jusqu’à 1,46 s (premier anneau de toucher) · planche : un changement par vignette, rien de vide ✔ · textes porteurs 54–290 px hors du téléphone ✔, un seul chiffre Klein à la fois ✔ · « Démo · lieu fictif · Salon Mirabelle » en permanence et sur la couverture ✔, aucun prix, pas de Gland, pas d’IA, pas de délai, WhatsApp seul contact ✔ · écran final : logo, maquette offerte, WhatsApp, @oonde_studio, 8 mots, en place 1,54 s avant la coupe ✔ · orthographe vidéo et légende : aucune faute trouvée ; 5 hashtags ✔.

**Notes /10** : accroche 8 · rythme 7,5 · clarté 8 · beauté 7,5 · partage 7,5 · conformité 8 · **global 7,7**.

**Ce qui marche** : le compteur qui roule est un vrai ressort (on compte avec la vidéo) ; un geste toutes les 0,76 s calé sur la musique ; les légendes de 84 px font comprendre sans le son ; le contraste « aux heures d’ouverture. » contre le message envoyé ; la question finale renvoie le commerçant à son propre site.

**Ce qui reste** :
- **Bloquant avant publication** : « 2 gestes » n’est pas vérifié sur un vrai iPhone. Alexandre teste le lien WhatsApp exact des sites OONDE depuis Safari (WhatsApp installé). Page intermédiaire « Continuer vers la discussion » → essayer api.whatsapp.com ; si rien n’ouvre directement la discussion, passer à « 9 gestes ou 3 ? » partout.
- Les 1,46 premières secondes sont immobiles (texte seulement) : un premier toucher ou un léger zoom vers 0,6 s retiendrait mieux.
- Téléphones petits (bas de l’image vide sous y 1400) et texte des sites illisible au téléphone : c’est assumé (le texte autour explique), mais le Reel paraît plus « schéma » que « produit ».
- Dans le PDF zoomé, le badge « 1 sur 3 » recouvre le mot « Couleur » : détail réaliste mais brouillon.
- L’écran final, sans le compteur, est propre mais classique.

**À publier ?** Oui, **après** le test du lien WhatsApp sur iPhone (et passage à « 3 » si nécessaire). Accroche alternative 1 (« Combien de gestes pour réserver chez vous ? ») à tester en Trial Reel.
