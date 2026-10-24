# 09 · La file jusqu'au tram — notes de production

Demande d'Alexandre (8 octobre 2026, 20 h 05) : utiliser les connecteurs installés et une IA vidéo comme Higgsfield
pour un Reel qui mélange motion design et « réel », sur un scénario de vente pour le site, avec une foule abusée
devant un magasin à Genève.

## Sources des plans

| Plan | Contenu | Outil | Fichier |
|---|---|---|---|
| A | file devant la boulangerie (enseigne vierge, peinte ensuite « MAISON ARDELLE ») | Figma, génération d'image (gpt-image 2.5), 864×1536 | gen/plan-A-foule.jpg |
| B | rue vide, boulangère sur le pas de la porte, virevoltant | Figma (deuxième génération, cadre proche de A) | gen/plan-B-vide.jpg |
| C | main qui tient un téléphone à écran blanc dans la file | Figma | gen/plan-C-telephone.jpg |
| D | boulangère débordée qui rit, clients au comptoir | Figma | gen/plan-D-boulangere.jpg |

Traitement : agrandissement ×1,5 (Real-ESRGAN mêlé à 28 % d'un agrandissement lanczos), cartes de profondeur
(Depth Anything V2) pour l'effet 2.5D, enseigne peinte en perspective sur A et B, virevoltant détouré par sa teinte
puis effacé du plan B et ré-animé. Les fichiers Figma ont été récupérés par le bac à sable Higgsfield (le conteneur
n'atteint pas figma.com). Une tentative Canva a laissé un design vide (DAHXdAyL3nw) dans le compte Canva : sans
importance, à supprimer si Alexandre veut.

Canva et Higgsfield (offre gratuite, 1,1 crédit) ne permettaient pas de retoucher A pour faire B ni de faire de la
vidéo. Alexandre a choisi l'essai gratuit Higgsfield le 8 octobre à 20 h 37, mais la carte a été refusée (essai non
activé, rien de débité, 0 crédit). À 21 h 22 il a demandé d'enlever le renouvellement : rien à annuler.

## Version 1 (19,3 s) · critique 6,4/10

Critique complète : critique-v1.md (stratège 6,8, DA 6,0). Les trois corrections majeures :
1. La rue vide n'était pas « la même boulangerie » (enseigne vierge, autre cadre).
2. « Démo · lieu fictif » visible seulement 1,3 s.
3. Le passage « en ligne » tenait en une pastille de 30 px et un éclair blanc.

Vidéo, planche et page de la v1 : v1/.

## Version 2 (18,0 s) : ce qui a changé

- Enseigne « MAISON ARDELLE » peinte aussi sur B ; titres de la rue vide à la place exacte de l'accroche.
- Mention « Maison Ardelle / Démo · lieu fictif » dès t = 0, puis pastille fixe « DÉMO · LIEU FICTIF » sur chaque plan
  du commerce ; « Boulangerie · démo » dans le site.
- Recherche plus rapide (frappe à 40 caractères/s) et « Horaires ? » lisible ≈ 1,1 s avec une pulsation.
- Site dessiné : en-tête déjà en place, un bloc toutes les 0,28 s, rangée « Nos pains » à la place du bloc vide,
  titre « Un site clair. ».
- Plus d'éclair : coupe du téléphone dessiné vers le vrai téléphone à la même taille et à la même place, puis recul
  de 0,6 s, titre « En ligne. » en 110 px.
- La boulangère en deux temps (« Bon. » puis « On exagère un peu. ») et une étiquette « débordée ».
- Fin « On vous trouve ? » + « Maquette offerte sur WhatsApp » + @oonde_studio, puis le papier redescend sur
  l'image de t = 0 (boucle).
- Rembobinage sans aberration chromatique, flou limité, compteur sans « − 0 jour » ; son du rembobinage −3 dB.

## Plans vidéo prévus (dès que l'essai est actif)

Coût vérifié le 8 octobre : Kling 3.0 pro, 5 s, sans son, 9:16 = 7,5 crédits ; Hailuo 2.3 rapide 6 s = 4 crédits ;
Seedance 2.5 4 s = 28 crédits. Choix : Kling 3.0 pro.

1. B' = A retouché (même caméra, personnes effacées, boulangère seule sur le pas de la porte, virevoltant) :
   la vraie réponse à la critique n° 1.
2. Vidéos de 5 s, caméra fixe : A (la file bouge), B' (le virevoltant roule), C (main, écran blanc), D (rire).
3. Transfert : bac à sable Higgsfield → images PNG porteuses d'octets → `unpack.py` ; images JPEG dans src/vid/X/,
   `src/track.py` pour suivre l'écran du téléphone (C) et le virevoltant (B'), `src/vids.json` pour les activer.
   La page lit la vidéo image par image (A à l'envers pour le rembobinage) et garde l'enseigne peinte.

## Version 2 (18,0 s) · critique 7,1/10

Quatre regards en parallèle, puis synthèse : stratège 7,4 · directeur artistique 7,1 · boulanger de Genève 7,0 ·
règles 6,5 (moyenne pondérée 7,08). Ce qui marchait : la coupe téléphone dessiné → vrai téléphone, la mention démo
partout, « Bon. On exagère un peu. ». Ce qui manquait :
1. Creux de 4,6 s de papier après le gag (5,0–9,6 s) et écran final lisible seulement 1,3 s.
2. Accroche presque figée les 0,5 premières secondes ; le tram qui prouve « jusqu'au tram » n'était pas montré.
3. Virevoltant pâle, trop grand pour sa profondeur, étiquette qui pointait le bord de l'image.
4. Rembobinage « effet de montage » (◀◀, compteur) et « − 21 jours » lu comme un résultat promis en 3 semaines.
5. Recherche « boulangerie genève » + « On vous trouve ? » : sous-entend une place Google.
6. Points d'étiquette sur les visages, un visage pâle « cireux » dans la foule du fond.
7. Pastille démo absente pendant le rembobinage et le papier ; flèches « › » dans la carte (fait penser à une commande).
8. Zone « de Genève à Montreux » absente ; légende sans mention démo et qui dévoile la chute.
9. Mention IA des plateformes à trancher par Alexandre (images réalistes générées + Content Credentials dans les fichiers).

Vidéo, planche, page, sons et légende de la v2 : v2/.

## Version 3 (18,0 s) : ce qui a changé

- Nouveau minutage : recherche 1,9 s, site 2,1 s, écran final complet à 15,9 s et tenu 2 s ; coupes sur les temps.
- Accroche : caméra qui bouge dès 0,2 s vers le tram, pointillé de la vitrine au tram avec un point sur le tram,
  « Pourquoi ? » en 64 px, flou d'objectif sur la foule lointaine, visage cireux assombri.
- Rembobinage sans icône ni nombre : fondu par profondeur (le lointain d'abord), enseigne B posée sur l'enseigne A,
  puce « GENÈVE » → « AVANT » en lettres de tableau des départs.
- Rue vide : caméra fixe, « Même boulangerie. » puis « Personne. » en deux cartes, virevoltant à sa profondeur
  d'origine (brun, ombre, deux rebonds, poussière, frottements), étiquette à sa gauche ; tablier recoloré en crème.
- Recherche : la devanture se réduit dans la vignette du résultat ; « UN CLIENT · 7 H 40 » ; recherche par le nom.
- Site : photo et « Nos pains », horaires, carte, puis bouton WhatsApp en dernier, « touché ».
- Foule : travelling latéral, points sur l'écharpe, le manteau, le téléphone ; « a vu que c'était ouvert » ; bulle
  WhatsApp « Il vous reste des tresses ? ».
- Fin : la carte « On exagère un peu. » devient l'écran final, le point « débordée » devient le point du logo,
  « GENÈVE → MONTREUX » à la place du @ ; la dernière image est la première ; la foule revient avant la boucle.
- Pastille « Démo · lieu fictif » continue de 2,06 s à 15,3 s. Pas de flèches dans la carte.
- Variante d'essai : « Pour du pain. » à la place de « Pourquoi ? » (09-foule-geneve-essai-pain.mp4).
- Pas fait (demande des crédits ou un enregistrement) : B′ retouché depuis A (même caméra), vraie ambiance de rue
  (20 s d'iPhone dans une rue de Genève le matin suffiraient). Le sac cube du cycliste n'était pas bloqué par les
  crédits (erreur corrigée plus bas).

Vidéo, couvertures, légende et code de la v3 : v3/.

## Version 3 · critique 7,9/10

Trois regards (croissance 7,8 · directeur artistique 7,8 · règles 8,5) puis synthèse : accroche 8,4, rythme 7,3,
clarté 8, beauté 7,3, partage 7,8, conformité 8,5. Ce qui était réglé : accroche qui bouge vers le tram, rembobinage
sans chiffre, recherche par le nom, mention démo continue, cartes fixes, écran final tenu 2 s. Défauts apparus avec
la v3 : anneau de pavés dédoublés là où le virevoltant d'origine était effacé, virevoltant qui s'arrête net 0,4 s
avant la coupe, carte blanche vide à 15,4 s, trait qui traverse le visage de la dame (10,5–12,5 s), gens d'A à demi
transparents sur la rue vide (2,45–2,75 s), légende qui annonçait des espaces insécables absentes.

## Version 4 (18,0 s) : ce qui a changé

- Rue vide : le virevoltant d'origine est effacé hors ligne (src/patch_b.py, clonage « sans couture » : pavés pris
  à gauche, contraste local et lumière recalés sur le bord ; img/B-patch.png). Le tampon de la v3 recopiait aussi une
  zone voilée de la route, d'où l'anneau. Vérifié sur le plan préparé, plein cadre.
- Virevoltant : freinage doux (encore ≈ 130 px/s à la coupe), il roule jusque dans la vignette qui rétrécit ;
  cœur plus clair et plus petit, bord adouci.
- Rembobinage : seuils de profondeur et bande dure (la v4 coupait encore des gens : homme sans tête, roue seule ;
  corrigé en v5). La pastille démo arrive pendant que l'étiquette du commerce s'en va.
- Recherche → site : plus d'image vide. Le téléphone monte pendant que la fiche s'efface, « Aucun site. » devient
  « Un site clair. » au même endroit, le « ? » des horaires vole dans le téléphone et devient le point bleu de
  « Ouvert de 7 h à 19 h ». Téléphone dessiné avec encoche et cadre acier, comme le vrai (raccord à 9,0 s).
- Foule : « AUJOURD'HUI » sur la même ligne que la pastille démo ; le trait de « a vu que c'était ouvert » fait un
  coude dans le creux sombre entre la dame et l'homme ; la bulle WhatsApp est juste sous le téléphone.
- Fin : la carte qui grandit est une fenêtre sur l'écran final (« On exagère un peu. » se fond dans « On vous
  trouve ? »), le logo est là quand le point s'y pose (tic à 15,6 s) ; « GENÈVE → MONTREUX » en 36 px, encre ;
  le bouton WhatsApp est « touché » à 16,8 s. Au retour vers t = 0, la pastille démo est là avant l'enseigne.
- Variante d'essai : « Pour du pain. » au même moment (0,8 s) et avec le même son que « Pourquoi ? ».
- Légende : espaces insécables vérifiées par commande, « sans engagement », « deux amis depuis le gymnase : c'est
  nous qui vous répondons », version TikTok (« cette vidéo »), 5 mots-clés, mention du certificat « Anthropic Claude ».
- Pas fait, volontairement : le sac cube du cycliste. Il n'apparaît qu'en bord droit de l'accroche (40 à 80 px) ;
  un tampon de 70 × 175 px pris sur des manteaux sombres, au bord du cadre, se verrait plus que le sac.
- Toujours bloqué : B′ (images IA), vraie ambiance de rue (enregistrement), décision d'Alexandre sur l'étiquette IA.



Vidéo, couvertures, légende et code de la v4 : v4/.

## Version 4 · critique 8,4/10

Croissance 8,3 · directeur artistique 8,3 · règles 9,3 ; synthèse : accroche 8,5, rythme 8, clarté 8,4, beauté 8,1,
partage 8,2, conformité 9,3 (critique-v4.md). Les quatre défauts de la v3 sont réglés, rien n'enfreint les règles.
Restait : la fiche de recherche figée 0,8 s vers 6 s (principal moment où l'on décroche), des gens coupés au
rembobinage (2,50–2,57 s), l'écran final qui ne dit ni où toucher ni « sans engagement », deux textes fantômes et
deux points bleus dans le passage vers l'écran final, la question de la légende après la coupure « plus ».

## Version 5 (18,0 s) : ce qui a changé

- Fiche de recherche : « Ouvert ? Fermé ? Mystère. » arrive mot par mot à 5,9, 6,15 et 6,4 s (56 px, encre, tics),
  le « ? » pulse une 2e fois sur « Mystère. ». La fiche part en 0,1 s avant que le téléphone monte (il part de sous
  l'image) ; « Un site clair. » arrive pendant ce temps ; le « ? » grossit en vol.
- Rembobinage : le ciel et le fond lointain passent d'abord, puis toute la foule part d'un bloc à 2,58 s (plus aucun
  personnage coupé). La puce « AVANT » grossit (× 1,6) pendant que ses lettres tournent, puis reprend sa taille.
- Fin : la carte garde son texte centré pendant qu'elle grandit, puis bascule d'un coup sur « On vous trouve ? »
  quand le titre y tient entier ; le O du logo reste vide jusqu'à l'arrivée du point bleu ; la mention démo reste
  sur la photo du commerce jusqu'à ce que le papier la couvre ; 2e temps « Sans engagement · lien en bio » à 16 s.
- Légende : première ligne courte (« Beaucoup de clients vérifient si vous êtes ouvert. Ils trouvent quoi ? »),
  « peuvent tomber » au lieu de « tombent souvent », « ce sont deux amis », espaces insécables dans les guillemets.
- Toujours bloqué : B′ (images IA), vraie ambiance de rue (enregistrement), un plan des deux fondateurs (optionnel),
  et la décision d'Alexandre sur l'étiquette IA.
