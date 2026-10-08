# Leçons de production — Reels et carrousels OONDE

Fichier tenu par la session qui orchestre la production de nuit (un seul rédacteur). Les producteurs le lisent
avant de commencer ; chaque tour ajoute ce que la critique a appris. Les leçons récentes priment.

## Tour 0 — ce qu'on savait avant de commencer (7 octobre 2026)

1. **Alexandre juge vite** : sur le site, la démo Les Grèves a été trouvée « pas belle, trop lente, on dirait une
   vidéo ». Rythme vif, rien ne traîne, chaque mouvement a une raison. Une animation qui ne dit rien est coupée.
2. **« Trop d'infos »** : il l'a dit des offres du site. Une idée par écran, peu de mots, gros caractères.
3. **Style voulu : pro, ingénieux, jeune génie.** Références : présentations produit d'Apple, Linear, Stripe.
   Précision des alignements, typographie soignée, interface réaliste mais épurée. Jamais « Canva », jamais « IA ».
4. **L'ancienne DA « Signal »** (fond bleu Klein, police Bricolage) est abandonnée. Le Reel Garage Fontana l'utilise
   encore : on le garde tel quel (choix d'Alexandre), mais les nouveaux contenus suivent la DA v7 (papier/encre).
5. **Ce que l'algorithme récompense** (guide Instagram du projet) : partages en message privé, temps de visionnage
   et revisionnages, enregistrements pour les carrousels utiles, originalité. Accroche en 1,5 s.
6. **Les posts déjà prêts** (`/mnt/project-files/instagram/posts/`) : en-tête logo + étiquette mono « À GARDER · 2/4 »,
   grand chiffre Klein, titre 600 serré, corps gris, pied « GLISSEZ → » et « @OONDE_STUDIO ». Les carrousels
   doivent rester cohérents avec ce système ; les Reels peuvent être plus riches mais du même monde.
7. **Ne pas refaire** : Reel Les Grèves (déjà monté par le fil Instagram), Reel Garage Fontana (existe), posts 01 à 06.

## Tour 1 — 4 Reels, critique à deux regards puis juge (nuit du 7 au 8 octobre)

Notes finales : 01 horaires Google 7,6 · 02 test des 5 secondes 8,0 (critiques avant correction : 6,5 et 7,2).
Ce qui a fait monter les notes : le chevauchement des titres, un plan qui bouge toutes les secondes, la boucle qui revient à l'accroche.

1. **Lisibilité dans le téléphone** : tout texte qui porte le message (statut, bouton, réponse) fait au moins 44 px **à l'écran** :
   zoomer ou recadrer le téléphone, ou reprendre l'information en dehors du téléphone (étiquette, coche) en 44 px ou plus.
   Le téléphone montre, le texte autour explique.
2. **Transitions de titres** : l'ancien titre a disparu avant que le nouveau dépasse 30 % d'opacité. Contrôler les 3 images de
   chaque transition (extraire à 30 i/s), pas seulement la planche contact.
3. **Boucle** : jamais de fondu enchaîné entre deux écrans de texte (double exposition = « vidéo »). Coupe nette, ou 2-3 images
   de fond vide, puis l'accroche.
4. **Aucun écran vide ou presque vide** (formulaire squelette, pied de page beige) : chaque plan montre en gros l'élément désigné.
   Si le script parle d'un détail « caché », le montrer au moment où il compte (zoom, cercle, surlignage).
5. **Mouvement** : même un plan unique de 5 s tient si quelque chose bouge toutes les 0,6 à 1 s (défilement, tic, chiffre qui roule).
6. **Écran final** : 8 mots au plus en 1,8 s (titre, une ligne, bouton). Un tutoriel vise 16 à 19 s, étapes de 3 mots au plus.
7. **Minutage** : fixer la durée cible d'abord ; les décalages demandés par plusieurs critiques s'additionnent.
8. **Son** : make_audio.py place le pic d'un whoosh à t − 0,45 + 0,75 × d (et non à t). Mesurer la crête vraie du fichier final
   avec ebur128 ; l'AAC la remonte d'environ 0,4 dB.
9. **Exactitude** : les intitulés Google (« Modifier le profil », « Horaires », « Horaires d'ouverture exceptionnels ») ont été
   vérifiés dans l'aide Google en français ; une mise à jour peut être vérifiée par Google avant d'apparaître : le dire dans la
   légende plutôt que promettre l'immédiat.
10. Kit : un accent est mal dessiné dans `fonts/cormorant-garamond-latin-400-normal.woff2` (sous-ensemble) : éviter cette police
    pour du texte accentué en gros, ou vérifier visuellement.

## Tour 1, suite — Reels 03 (avant/après Mirabelle, 7,7) et 04 (essai du site, 7,3)

11. **Taille réelle avant de rendre** : pour chaque texte qui porte l'argument dans un téléphone dessiné, noter dans script.md
    sa taille à l'écran (taille CSS × échelle × zoom). Moins de 44 px → agrandir la page (échelle ≈ 2,7 : 16 px CSS → 44 px)
    ou le reprendre hors du téléphone. Ne pas attendre la critique.
12. **Nommer le gain** : le titre qui accompagne l'« après » dit le bénéfice concret visible (« Réserver en un geste »,
    « Horaires lisibles »), pas un constat (« Autre site »). Sans le son, on doit pouvoir répéter le bénéfice.
13. **Pas d'objet seul sur fond vide plus de 0,3 s**, surtout juste avant l'appel à l'action.
14. **Toute image peut devenir une vignette** : extraire 5 images au hasard ; aucune ne doit montrer un mot hybride ou coupé
    (effets de découpe hors des titres), aucun logo coupé à mi-hauteur par un masque.
15. **L'accroche ne demande jamais un geste impossible** (l'outil du site n'est pas encore en ligne) : « Regardez ce qui se
    passe quand on tape… ». L'impératif est réservé au vrai geste de la fin (WhatsApp).
16. **Une démo pas à pas finit par une montée** : récapitulatif avant/après en coupes franches, puis un plan tenu ≥ 1 s.
17. **Écran final** : tout est en place ≥ 1,2 s avant la coupe ; une phrase de plus de 8 mots s'affiche en deux temps lisibles seuls.
18. **Son** : utiliser `python3 _kit/mux.py video.mp4 audio.wav final.mp4` (deux passes, 48 kHz, crête ≤ −1,5 dBTP, mesure affichée).
19. Communes de l'outil du site : Coppet y figure (pas Gland) ; elle est citable.
