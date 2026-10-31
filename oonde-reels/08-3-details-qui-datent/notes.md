# Notes — 08 · 3 détails qui datent votre site

## Production

- **Format** : 17,7 s (tour 2 ; 17,4 s en v1), 1080×1920, 30 i/s, H.264 + AAC 48 kHz. Son : `mux.py` → −15,0 LUFS intégré, crête vraie −1,7 dBFS (mesure ebur128 sur le MP4 final).
  `ERREURS PAGE : 0` (rien affiché par render.cjs).
- **Commerce** : Café Brindille, Vevey (nom inventé, « Démo · lieu fictif » à l'écran tant que le site est visible). Aucun
  prix (la carte ne liste que des plats), aucune statistique, pas de Gland, seul contact : WhatsApp.
- **Système** : un seul curseur Klein (trait 3 px + poignée ‹ ›) relie les trois détails : repos sur le bord droit (AVANT),
  balayage vers la gauche (APRÈS, arrivée avec léger dépassement), retour à droite pendant que le site défile jusqu'au détail
  suivant. Cadres « 01 / 02 / 03 » Klein repris des posts (fiche Google). Étiquette AVANT / APRÈS qui change d'un coup quand le
  trait passe le milieu (jamais de mot hybride), petit rebond.
- **Lisibilité** : page de 360 px CSS affichée à l'échelle 2 → tout ce qui porte le sens fait ≥ 44 px (titre du site 60 px,
  phrase utile 48 px, lignes de carte 44 px, bouton WhatsApp 44 px, bulle 44 px). Contrôle à 390 px de large : lisible.
  Titres hors du téléphone 92–98 px, dans la zone de sécurité (contrôle `--q safe`).
- **Autocritique, passe 1** : bas de pages vides (ajout d'un plan d'accès côté avant, d'une deuxième partie de carte et des
  horaires côté après) ; bouton WhatsApp visible pendant le détail 2 (contact repoussé plus bas) ; cadre 01 trop haut ; titres
  1-3 trop larges (92 px) ; « Ouvert aujourd'hui » en vert remplacé par l'encre (vert réservé à WhatsApp) ; cartes de la
  question complétées par une case à cocher (on se teste).
- **Autocritique, passe 2** (images de transition extraites) : fondu enchaîné entre la question et l'écran final supprimé
  (la question sort, puis la fin monte) ; trou de 0,3 s avant la question raccourci ; étiquette « IMAGE » qui masquait une ligne
  déplacée à côté du « 03 » ; bord du PDF qui dépassait sous la barre d'état au détail 3 corrigé.
- **Limites connues** : pendant les deux retours du curseur (5,3 s et 9,0 s, 0,4 s chacun) l'écran montre brièvement l'avant
  du détail suivant à gauche et l'après du détail précédent à droite ; les deux tuiles beiges « Vitrine / Pain » du site
  refait sont des emplacements photo (style des posts) ; la dernière image ne raccorde pas avec la première (pas de boucle).
- **Kit** : aucun défaut bloquant. Remarque : l'en-tête de `make_audio.py` cite encore `loudnorm … TP=-1.5` alors que `mux.py`
  vise −2,0 dBTP ; c'est `mux.py` qui a été utilisé.

## Corrections (tour 2, d'après le stratège 6,8 et le directeur artistique 6,9)

Version précédente conservée dans `v1/` (vidéo, planche, couverture, légende). Nouvelle durée : **17,7 s** (−0,5 s au détail 2,
+0,26 s au détail 3, +0,45 s pour tenir la question 2,8 s, +0,1 s de papier vide pour la boucle).

### Stratège — à corriger
1. **« Lequel a encore le vôtre ? »** → corrigé : « Et le vôtre : / 1, 2 ou 3 ? » (100 px, espaces fines insécables avant « : » et
   « ? »), mêmes trois cartes, visible 2,82 s (12,68 → 15,50). Légende et texte alternatif mis à jour. **À valider par Alexandre**
   (la formule venait du brief) ; repli proposé dans legende.md : « Lequel est encore sur le vôtre ? ».
2. **Retours du curseur qui défont la correction** → corrigé : entre deux détails, l'après sort d'un bloc vers le haut (5,30 → 5,62 et
   8,50 → 8,82, E.in, ombre douce sous le bord), jamais recoupé ; l'avant suivant est déjà en place dessous (sauts de défilement
   faits quand la page est cachée). Contrôlé image par image à 30 i/s : aucun mot hybride, l'étiquette passe à AVANT quand l'avant
   occupe la plus grande partie de l'écran (5,54 / 8,74).
3. **« Rien ne se passe » illisible sans le son** → corrigé : secousse de l'image du numéro (±6 px CSS, 3 oscillations amorties sur
   0,3 s, calée sur le toc sourd), étiquette « IMAGE · RIEN NE SE PASSE » en 16 px CSS (32 px à l'écran), accrochée au bas du cadre
   03 ; balayage lancé 0,7 s après le toucher (9,36 → 10,06).
4. **Plan presque fixe au détail 2** → corrigé : −0,5 s (titre 3 à 8,5 s), la liste défile de 70 px CSS (7,35 → 8,45, E.inOut)
   jusqu'à « LE MIDI ». Titre 2 visible ≈ 3,0 s.
5. **Légende** → corrigé : 1re ligne « 3 détails qui datent un site de commerce, de Genève à Montreux. » ; point 3 « un simple
   toucher ne fait rien ».
6. **Écran de la question immobile** → corrigé : les trois cases pulsent l'une après l'autre (14,1 / 14,3 / 14,5 s, bordure encre,
   échelle 1 → 1,12 → 1 en 0,2 s, un tic chacune) et restent cochables (bordure encre). La ligne « RÉPONDEZ EN COMMENTAIRE » n'a pas
   été ajoutée (option alternative ; la question dit déjà « 1, 2 ou 3 »).

### Stratège — à améliorer
1. Sortie de « Démo · lieu fictif » → corrigé autrement : la mention part **avec le téléphone** (même mouvement), elle reste donc
   lisible tant que le site est visible, sans croiser la question qui entre.
2. Mention démo avant l'accroche → corrigé : « DÉMO · LIEU FICTIF » est sur la ligne de l'étiquette AVANT (à droite, 30 px #6B7078),
   le groupe est centré ; l'accroche est la première ligne de la page.
3. Boucle → corrigé : les 3 dernières images sont du papier vide (17,6 → 17,7), coupe nette vers l'accroche. (La dernière vignette
   de la planche, à 17,6 s, est donc vide : c'est voulu.)
4. Titre 1 comme gain → non changé à l'écran (option à tester) : « 1. Qui, quoi, où : en une ligne. » est proposé dans legende.md
   comme variante Trial Reel ; « à Vevey » reste souligné en Klein dans l'après.

### Directeur artistique — à corriger
1. **Double exposition des titres** → corrigé : le nouveau titre entre à a + 0,20 s (l'ancien a disparu à a + 0,18 s) ; question
   à T_OUT + 0,22 s, pastille et étiquette sorties en 0,12 s. Contrôle à 30 i/s de 2,567–2,733 s, 5,300–5,633 s, 8,500–8,667 s et
   12,433–12,633 s : jamais deux titres sur la même image.
2. **Découpe gauche/droite au retour** → corrigé (voir stratège 2) : trait et poignée sortent à gauche en 0,1 s, réapparaissent à
   X0 avec un pop de la poignée (0,6 → 1, E.out, 0,2 s) à 5,50 et 8,70. Seul écart : la pastille passe à AVANT à +0,24 s (5,54) et
   non +0,16 s, pour ne pas dire AVANT au-dessus d'un écran encore occupé aux 7/8 par l'après (reproche du stratège).
3. **Trait qui dépasse du téléphone** → corrigé : y1 = 754 (sous la barre d'état), repos X0 = 892 / XL = 188 (8 px dans l'écran),
   poignée au repos à 930 px (dans la zone de sécurité). La découpe est calée sur le trajet du trait (0 à 720 px entre XL et X0),
   donc aucun liseré de l'autre version au repos.
4. **Tuiles beiges vides** → corrigé : bande de 4 tuiles 74×64 px CSS (VITRINE · COMPTOIR · PAIN · ÉQUIPE, PM 500 9 px CSS en
   capitales, tons du post 07) et « La carte » remontée (top 448 CSS) : la liste est visible dès l'après du détail 1.
5. **Détail 2 sans mouvement** → corrigé (voir stratège 4).
6. **Étiquette « IMAGE » trop petite, refus non animé** → corrigé (voir stratège 3).

### Directeur artistique — à améliorer
1. Coupures des titres → corrigé : « 3 détails / qui datent votre site. » (88 px, pas 90 : à 90 px la ligne dépassait x 940 de 6 px)
   et « 1. Dites / ce que vous faites. ».
2. Interlettrage → corrigé : −0,025em ; « 3. Qu’on vous écrive » passé à 90 px pour rester dans la zone (x 148–933).
3. Doigt sur « Wh » → corrigé : le toucher se fait sur l'icône verte (centre calculé à l'ouverture de la page), le mot reste lisible.
4. Écran de la question trop haut → corrigé : titre et cartes descendus de 40 px (bloc 504 → 1260, centre ≈ 882) ; cases qui pulsent.
5. Boucle → corrigé (voir stratège, à améliorer 3).

### Autres changements
- Après du détail 1 : la page dérive de 12 px (pas plus : au-delà, le mot « Brindille » de l'en-tête passerait à moitié sous la
  barre d'état).
- Couverture rendue à t = 0,7 s avec `?cover` (le cadre « 01 » est déjà dessiné ; à t = 0 il ne l'était pas).
- Son : cues.json recalé sur le nouveau minutage (whoosh du balayage 3 à 10,16, toc sourd à 9,36, tics des cases, glissé doux
  sous le défilement de la liste), mixé avec `mux.py`.
- Kit : pas de nouveau défaut ; même remarque qu'au tour 1 sur l'en-tête de `make_audio.py` (TP −1,5 cité, `mux.py` vise −2,0).

## Verdict (juge final, regard neuf)

**Version retenue : v2** (fichiers actuels). Comparée à v1 aux mêmes instants (3,2 / 5,45 / 7,8 / 9,5 / 10,4 / 13 / 15 / 16,5 s),
v2 est nettement meilleure : v1 montrait à 5,45 s deux titres superposés et une découpe gauche/droite avec des mots hybrides
(« Bienv|é Brindille ») ; v2 fait sortir l'après d'un bloc, un seul titre à la fois (contrôlé image par image à 30 i/s,
5,30–5,60 s et 8,50–8,80 s). La question « Et le vôtre : 1, 2 ou 3 ? » est plus claire que « Lequel a encore le vôtre ? ».

**Contrôle §6** : 17,7 s, 1080×1920, 30 i/s, H.264 + AAC 48 kHz ; ebur128 sur le MP4 final : −15,0 LUFS, crête vraie −1,7 dBFS.
Images à 0 / 0,5 / 1 / 1,5 s : accroche lisible dès la 1re image (« 3 » Klein, AVANT + « Démo · lieu fictif », avant déjà visible),
le cadre « 01 » et la poignée bougent. Écran final : « Maquette offerte. », bouton WhatsApp, logo, @oonde_studio (6 mots, ≈ 2,1 s,
complet 1,26 s). 3 dernières images de papier vide (vérifié). Contenu : démo marquée tant que le site est visible, aucun prix,
aucune statistique, Vevey (pas de Gland), WhatsApp seul contact, pas d'IA. Orthographe vidéo : RAS (apostrophes ’, espaces fines).

**Correction rapide faite par le juge** : legende.md, apostrophes droites ' → ’ (accroches Trial Reels et texte alternatif).

**Notes** : accroche 8 · rythme 7,5 · clarté 8 · beauté 8 · partage 7,5 · conformité 9 · **global 7,9**.

**Ce qui marche** : un seul système (curseur Klein + cadres 01/02/03) qui relie les trois détails ; l'avant est crédible
(« Dernière mise à jour : 14.02.2015 », serif brun, PDF 4,2 Mo) sans être caricatural ; chaque correction est nommée en grand
hors du téléphone ; transitions propres ; question finale facile à commenter ; légende utile, prête à envoyer.

**Ce qui reste (non bloquant)** :
- « IMAGE · RIEN NE SE PASSE » ne fait que 32 px : c'est le seul endroit où le problème du détail 3 est dit sans le son.
- Le rond gris du doigt masque une partie du numéro au toucher (9,4–9,7 s).
- Après du détail 3 (10,8–11,2 s) : grand blanc entre le bouton et les horaires avant l'arrivée de la bulle.
- Accroche à 2,4 s presque fixe (cadre + poignée seulement) ; le balayage pourrait partir 0,3 s plus tôt.
- Titre 1 dit l'action (« Dites ce que vous faites ») plus que le gain visible.
- La question remplace celle du brief : **à valider par Alexandre**.

**À publier ?** Oui, après validation d'Alexandre (question de fin). Publiable en l'état.
