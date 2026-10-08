# 05 · Trouvez le numéro — script (v2, après critique)

**Idée en une phrase.** Un jeu de 3 secondes : trouver le numéro d’un restaurant sur son site. Presque personne n’y arrive, parce qu’il est caché tout en bas, en petit, au 3e niveau du pied de page. Le même commerce refait se contacte en 0,5 s : le bouton WhatsApp est sous le pouce, dès le premier écran.

**Spectateur visé.** Patrons et patronnes de commerces de Genève à Montreux (restaurant, salon, boutique, artisan) qui ont un site « qui existe » mais n’y pensent plus. Le spectateur joue d’abord en tant que client, puis se demande où en est son propre site.

**Accroche à t = 0 (lisible sans le son).**
- Étiquette mono : « À VOUS DE JOUER » · à droite « DÉMO · LIEU FICTIF »
- Titre : « Trouvez le numéro. / 3 secondes. »
- Chrono mono bleu Klein « 3,0 s » (virgule resserrée) et sa mèche pleine. Il part à 0,40 s.
- Dessous, un téléphone avec le site de « La Pinte Vermeil » (restaurant inventé, marqué démo) : bandeau promo, carrousel, longs textes, long pied de page.

**Durée : 13,68 s** (30 i/s, 1080×1920).

## Plan minuté

| t (s) | On voit | On lit | Son |
|---|---|---|---|
| 0,00 – 0,40 | Accroche complète dès la 1re image. Le carrousel du site glisse (0,12). | Trouvez le numéro. 3 secondes. · 3,0 s | Coup sourd, glissé |
| 0,40 – 3,40 | Le chrono descend au dixième (0,40 → 3,40), la mèche se vide. Trois lancers de doigt (0,52 · 2,08 · 2,68, 0,45 s chacun, courbe out), fenêtre « newsletter » (1,20) puis fermée (1,94). Le numéro entre dans l’image à 1,2 s au chrono et finit vers y 1370 ; rebond iOS de 12 px en bas de page (3,13 → 3,38). Le pied de page est plein (plan d’accès, horaires d’été, réseaux, partenaires, recrutement). | 3,0 → 0,0 s | Rythmique douce, tic toutes les 0,5 s, glissés sur chaque lancer, pop de la fenêtre |
| 3,40 | Le chrono touche 0 et sort avec le titre. | | Coup sourd |
| 3,54 – 4,68 | Même page. | Trouvé ? (1,14 s) | Pop |
| 4,20 – 4,90 | Zoom net (×3,1) sur le pied de page : « Infos pratiques › Accès et contact › Tél. 021 000 00 00 ». Le numéro tombe vers y 1000, le site remplit tout le bas de l’image ; dégradé papier + filet sous l’en-tête (aucune ligne coupée). | | Whoosh (pic ≈ 4,55) |
| 4,84 – 7,70 | Cercle bleu tracé à la main (4,94 → 5,36) ; le numéro (57 px à l’écran) fonce. « PIED DE PAGE · NIVEAU 3 » (5,40, 28 px sous le cercle, aligné sur son bord gauche). « IL ÉTAIT À L’ÉCRAN DÈS 1,2 S ↻ » sur carte blanche à x 80 (5,90), la flèche tourne une fois (6,62). Poussée lente. | Il était tout en bas. | Carillon (4,98), pop, pop doux (5,92) |
| 7,50 – 7,84 | Dézoom inverse (×3,1 → ×1, ease-in-out) jusqu’au téléphone entier, même taille et même place que l’avant (x 200–880, haut 680). | | Whoosh descendant |
| 7,84 – 8,14 | Balayage vertical : la page « après » remplace la page « avant » de haut en bas. Le nom reste en italique bordeaux. | Après · Refait : WhatsApp / sous le pouce. · 0,0 s | Glissé |
| 7,96 – 8,46 | Le bouton « Écrire sur WhatsApp » (icône verte) est à y ≈ 1500 dès la 1re image de la page. Le pouce (disque 64 px CSS, opacité .35) se pose sur la flèche ; le bouton s’enfonce (scale .97, −8 %), onde blanche, le chrono s’arrête à 0,5 s avec un petit battement. | 0,5 s | Tic, goutte + carillon au toucher (8,46 / 8,50) |
| 8,58 – 10,60 | Zoom sur le bouton (×1,32) : lisible en 45 px. « DÈS LE PREMIER ÉCRAN ↓ » aligné sur le bord gauche du bouton, 16 px au-dessus (8,72). | | Whoosh, pop |
| 10,60 – 10,74 | Le téléphone sort par le bas (+240 px, 0,14 s, courbe out) en même temps que le titre ; il a disparu quand le titre final entre (10,74), le bouton 0,12 s après. Une seule image de papier entre les deux. | | Glissé, pops |
| 10,74 – 13,26 | Écran final (6 mots + bouton), complet à 11,44 et tenu 1,8 s. | Et sur votre site, en combien ? · [WhatsApp] Maquette offerte · Sur WhatsApp · lien dans la bio · OONDE · @oonde_studio | Pops, accord final (11,22) |
| 13,26 – 13,68 | L’écran final s’efface, 2 images de papier, puis l’accroche revient à l’identique : la dernière image est la première. | Trouvez le numéro. 3 secondes. | Coup sourd léger |

## Tailles réelles à l’écran (leçon 11)

- Numéro révélé : 11 px CSS × 1,672 × 3,1 ≈ 57 px (≈ 18 px pendant le jeu, trouvable en pause).
- Bouton « Écrire sur WhatsApp » zoomé : 20 px CSS × 1,672 × 1,32 ≈ 44–45 px ; repris par le titre 102 px.
- Étiquettes mono : 30 px. Titres : 102 px (108 px pour la fin).

## Pourquoi un commerçant l’enverrait à un autre

C’est un jeu qu’on rate : on a envie de le refaire (le numéro passe vraiment à l’écran pendant le chrono, et l’écran le dit : « Il était à l’écran dès 1,2 s ») et de le faire faire à quelqu’un. La question finale « Et sur votre site, en combien ? » se pose naturellement à un ami commerçant : on lui envoie le Reel en disant « essaie avec ton site ». Le ton reste bienveillant : le vieux site est crédible et soigné à sa façon, on ne s’en moque pas, on montre seulement où le client se perd.
