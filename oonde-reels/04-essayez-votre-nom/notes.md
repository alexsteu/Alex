# Notes · 04 Essayez avec votre nom

## Production

- **Matière réelle.** 21 captures Playwright de la vraie page (copie de `oonde-site/v2/dist/index.html`, section
  `#essai`, polices locales) : viewport 390×844, échelle 3, `isMobile`, transitions et animations coupées, curseur
  natif masqué (le curseur bleu est redessiné dans le Reel à la position mesurée du texte). Une lettre par image pour
  « Salon Mirabelle », puis Coiffure, Morges, prune, miel. L’aperçu du site (le petit téléphone de la page) est capturé
  une seconde fois à l’échelle 4 et superposé exactement au même endroit, pour rester net dans les zooms (×3,6).
- **État de départ.** « Autre commerce » + couleur noire, pour que l’aperçu soit neutre au début (« Bienvenue. ») et que
  la photo du salon apparaisse au moment du choix « Coiffure ». C’est un état réel de l’outil (un clic sur le dernier
  métier, puis sur la pastille noire), la rangée des métiers est ramenée au début.
- **Retouches de capture (à valider).** La petite ligne sous le bouton (« Gratuite, en 48 heures. Le message s’ouvre
  dans WhatsApp… ») est masquée (`visibility:hidden`) : délai pas encore confirmé. L’en-tête du site est rendu opaque
  (sinon le sous-titre de la section transparaît en fantôme sous la barre). Aucun prix lisible : les tarifs du site type
  sont sous le bas de l’aperçu, jamais à l’écran. Le mot « Prix » du menu du site reste visible (lien, pas un montant).
- **Mise en scène.** `render(t)` déterministe : caméra (échelle et point focal, interpolation géométrique du zoom,
  E.inOut / sinus), pastille de doigt (appui puis relâche), cadre bleu sur « COIFFURE · MORGES », titres qui se relaient
  sans se chevaucher, bandeau du haut opaque avec fondu doux et brume papier en bas (le téléphone « sort » de la zone
  couverte par l’interface Instagram). Étiquette « DÉMO · LIEU FICTIF » visible de 0,5 s à 12,3 s.
- **Autocritique, 2 passes.** (1) Le curseur et le cadre bleu étaient cachés sous les images (ordre d’empilement) ;
  zooms flous (capture ×3 agrandie ×3,6) → second calque haute définition de l’aperçu ; fantôme sous l’en-tête du site →
  en-tête opaque ; bord dur du bandeau → fondu animé. (2) Deux titres se chevauchaient à 10,1 s → entrée retardée ;
  écran final raccourci (durée 16,8 s) ; zone de sécurité et lecture à 390 px vérifiées.
- **Couverture.** Image t = 2,6 s (nom tapé, curseur, aperçu « Salon Mirabelle ») rendue avec `?cover` : l’étiquette
  « Essai en direct » remonte hors du recadrage de la grille et la pastille « Démo · lieu fictif » descend sur l’aperçu,
  pour que la grille 1080×1350 montre aussi la mention démo.
- **Son.** `cues.json` : frappe (15 touches calées sur les lettres), pop de l’étiquette démo, whoosh à chaque étape,
  tick à chaque geste, droplet quand la photo arrive et sur Morges, carillon au site fini, accord final.
  Mux avec loudnorm (une passe) : −15,7 LUFS intégrés mesurés.
- **Vérifications.** ERREURS PAGE : 0 ; 16,8 s ; 1080×1920 ; H.264 + AAC ; 504 images à 30 i/s.
- **À valider par Alexandre.** Le Reel dit « Essai en direct » et montre l’outil du site alors que le site n’est pas
  encore en ligne : la légende ne donne aucune adresse et renvoie vers WhatsApp. Si le Reel sort avant le site, des
  commentaires « où est l’outil ? » sont possibles.
- Aucun défaut bloquant du kit ; `render.cjs --q` sert aussi à passer `?cover` pour la couverture.

## Corrections (v2, 8 octobre 2026)

v1 conservée dans `v1/` (vidéo, planche, couverture, légende). v2 : 14,6 s, 438 images, ERREURS PAGE : 0, 1080×1920
H.264 + AAC 48 kHz, −15,2 LUFS intégrés, crête vraie −3,0 dBTP (ebur128 sur le fichier final).

### Stratège (contenu, conformité)
- **M1 Outil pas en ligne** : corrigé selon l’option (B) « publier avant ». Étiquette « ESSAI EN DIRECT » → « DÉMONSTRATION » ;
  légende ligne 1 réécrite ; CTA central « Envoyez-nous le nom de votre commerce sur WhatsApp (lien dans la bio) : on vous
  fait la maquette, offerte. » ; accroche alternative 2 remplacée ; script.md (« pourquoi l’envoyer ») réécrit.
  **À trancher par Alexandre** : (A) attendre la mise en ligne et passer au CTA « Essayez avec votre nom : lien dans la bio ».
  Le titre à l’écran « Tapez le nom de votre commerce. » est gardé (point « à garder » des deux critiques).
- **M2 Fin trop longue** : corrigé. Écran final 11,85 → 14,3 s (tout en place à ~13,2 s, curseur qui clignote ensuite),
  puis boucle 14,3–14,6 s vers l’image t = 0 (écart moyen dernière image / première image : 0,004 niveau de gris).
  Durée 14,6 s au lieu des 14,8 demandés : le milieu a aussi perdu ~0,9 s (M3), même structure que la proposition.
  Plus de silence numérique en fin (musique jusqu’au bout, pop léger au retour du champ).
- **M3 Dénouement sans montée** : corrigé. Plans fixes 4,95–5,40 et 7,10–7,60 supprimés ; récapitulatif en coupes franches
  de 0,22 s sur l’aperçu (n00 → n15 → act → town → c2, à 9,48 s) puis plan tenu 1,2 s.
- **M4 Preuve Morges illisible** : corrigé. Cadre bleu sur « Votre salon à Morges. » (#hl 89/491,5/87×19), caméra k 3,0
  centrée sur la ligne. **À signaler à Alexandre (site)** : l’étiquette « COIFFURE · MORGES » reste illisible dans l’aperçu
  (mono blanc sur fenêtre claire) ; renforcer le dégradé sombre du bas de la section d’accroche.
- **M5 Son** : corrigé. Deux passes loudnorm (linear=true), suréchantillonnage ×4 + alimiter, retour 48 kHz, AAC 192k.
  Mesuré : −15,2 LUFS, −3,0 dBTP. Avec la chaîne exacte proposée, la crête restait à −1,4 / −0,7 dBTP après AAC (les clics
  dépassent à l’encodage) : ajout d’un passe-bas doux à 15 kHz avant le limiteur et `-cutoff 16000`.
  **Défaut du kit à signaler** : la commande du README (`loudnorm=I=-15:TP=-1.5`, une passe, sans `-ar 48000`) donne
  du 96 kHz et une crête à 0 dBTP sur des bruitages percussifs.
- **M6 Couleur imperceptible** : corrigé. Caméra { k 2,8, fx 235, fy 595 } : bouton « Prendre rendez-vous » et pastilles
  dans le même plan ; coupe nette une image après le toucher.
- **S1 « Prix » du menu** : corrigé. 21 états recapturés (×3 et ×4) avec `header.nav a[href="#prix"]{visibility:hidden}`.
- **S2 Couverture** : corrigé. État c2 (photo, champ rempli, bouton miel), titre à y ≈ 113 dans le recadrage 1080×1350,
  pastille « DÉMO · LIEU FICTIF » au-dessus du titre, plus de libellé fantôme.
- **S3 Phrase de légende** : corrigé (texte proposé repris).
- **S4 Titre t5** : corrigé. « Votre site s’affiche / en direct. » (sans virgule), affiché 9,05–11,55 s (2,5 s).
- **S5 Pastille démo** : corrigé. Opacité = 1 − exit, la même que le téléphone.
- **S6 Frappe** : corrigé. 1,4–2,3 s : k 2,2 → 2,45, l’aperçu passe au centre et son titre grandit ; le champ glisse sous
  le bandeau (le bord du bandeau tombe dans le vide entre les métiers et l’aperçu).

### Directeur artistique (visuel)
- **M1 Fondus d’état** : corrigé. Coupes franches partout ; seul le calque HP de l’aperçu se balaie de bas en haut
  (clip-path inset, 0,22 s) pour act, town, c1, c2. Plus de doubles « Salon Mirabelle » ni de « Sapire ».
- **M2 Plan final hors zone** : corrigé. { k 3,0, fx 195, fy 454, cy 1035 } : aperçu entre y 584 et 1484. Tous les zooms
  plafonnés à k ≤ 3,0.
- **M3 Cadre bleu** : corrigé (voir stratège M4) ; ressort départ 1,12. Caméra { k 3,0, fx 160, fy 498, cy 1000 }.
- **M4 Bord du bandeau** : corrigé. Bord net (opaque jusqu’à 568 px puis 16 px de fondu) + filet 1 px #DCDED8 ; les fy/cy
  ont été choisis pour que le filet tombe dans un vide (sous le champ pour les métiers, entre métiers et aperçu pour la
  commune et la fin de frappe). Pendant l’intro, le bandeau reste au-dessus du téléphone (filet en fondu jusqu’à 1,4 s).
- **M5 Passage vers la fin** : corrigé. Sortie 11,55–11,82 s (recul 60 px + échelle 0,96) ; logo à 11,85 s, téléphone
  déjà parti. Variante « l’aperçu file vers la pastille WhatsApp » non faite (temps).
- **M6 Coupure du titre** : corrigé. « Tapez le nom / de votre commerce. » (vidéo et couverture).
- **S1 Étiquettes** : corrigé (#live 272, #demo 262 / right 150, titres 336, bandeau +18).
- **S2 Fin figée** : corrigé. Curseur Klein 6×110 px qui clignote après « offerte. » ; bloc remonté de 40 px.
- **S3 Couleur** : corrigé (même plan que stratège M6).
- **S4 Liste des communes** : corrigé. Feuille dessinée 0,4 s avec la vraie liste du site (Genève, Coppet, Nyon, Rolle,
  Morges, Lausanne, Vevey, Montreux ; pas de Gland), IS 500 16 px, rayon 14, filet #DCDED8, Morges surligné au toucher.
  Coppet ajouté par rapport à la liste de la critique, parce que c’est la liste réelle de l’outil.
- **S5 Bruitages** : corrigé. Ticks au toucher, états une image après ; droplet à 3,88 s ; whoosh de 4,25 s retiré.

### Vérifications v2
Images clés, planche (18), 4 images extraites de la vidéo finale, couverture et grille regardées. Aucun prix ni « Prix »,
aucune mention de délai, aucune adresse web, pas de Gland, démo marquée de 0,5 s à la sortie du téléphone.

## Verdict (juge final, 8 octobre 2026)

**Version retenue : v2** (fichiers à la racine du dossier). v1 reste dans `v1/` pour mémoire.
v2 est meilleure que v1 sur presque tout : 14,6 s au lieu de 16,8 s, fin ramassée et boucle propre (écart moyen
première / dernière image 0,005 niveau de gris, recontrôlé), lien « Prix » masqué (encore visible dans v1), étiquette
honnête « DÉMONSTRATION » au lieu d’« ESSAI EN DIRECT », couverture plus riche (photo, couleur, nom tapé), son conforme
(v1 : AAC 96 kHz et crête vraie 0,0 dBTP ; v2 : 48 kHz, −15,2 LUFS, −3,0 dBTP).

**Contrôle §6, refait sur le fichier final**
1. Rendu de contrôle : 0 erreur de page. 14,6 s, 1080×1920, 30 i/s, H.264 + AAC 48 kHz. ebur128 : −15,2 LUFS, −3,0 dBTP. OK.
2. t = 0 : titre « Tapez le nom de votre commerce. » (92 px), champ vide et curseur bleu visibles ; à 0,5 / 1 / 1,5 s
   le nom s’écrit, l’étiquette démo apparaît vers 0,6 s. Accroche comprise avant 1,5 s. OK.
3. Planche et images extraites : un changement chaque seconde environ, transitions de titres sans chevauchement
   (vérifié image par image à 2,6–3,0 s et 4,55–5,0 s), textes dans la zone (démo à droite x 930). OK.
4. Titres 92 px, étiquettes mono 30 px, fin 50 à 124 px ; un seul mot Klein (« offerte. ») ; pas de faute relevée
   dans la vidéo ni dans la légende. OK.
5. Démo marquée jusqu’à la sortie du téléphone, aucun montant, aucun délai, aucune adresse web, pas de Gland, pas d’IA,
   WhatsApp seul contact, 5 hashtags. OK. (Coppet figure dans la liste réelle des communes de l’outil.)
6. Écran final : logo, « la maquette est offerte », WhatsApp, @oonde_studio. OK.
7. Partage : moyen tant que l’outil n’est pas en ligne (voir plus bas).

**Notes** : accroche 7 · rythme 7,5 · clarté 7 · beauté 7,5 · partage 6,5 · conformité 9 · **global 7,3**.

**Ce qui marche** : la vraie interface, nette, qui réagit à chaque geste ; les coupes franches ; le récapitulatif
vide → nom → photo → Morges → miel en coupes de 0,22 s, qui donne enfin une montée ; la boucle sans couture.

**Ce qui reste (non bloquant)**
- Vers 1,0–1,3 s, le bord du bandeau coupe le logo « OONDE » du site à mi-hauteur (bas des lettres visible) : petit
  défaut de finition.
- La preuve « Votre salon à Morges. » reste petite (≈ 30 px, blanc sur photo) et le cadre bleu est un peu décalé à
  gauche ; l’étiquette « COIFFURE · MORGES » du site est illisible (défaut du site, déjà signalé).
- Écran final : 10 mots apparus en cascade entre 11,85 et 13,2 s, composition complète visible ~1,1 s avant la boucle :
  juste, mais lisible car la phrase se lit en deux temps.
- Fond du problème : l’accroche dit « Tapez le nom de votre commerce » alors que le spectateur ne peut pas encore le
  faire. Avec l’option (B), le geste réel est WhatsApp ; l’envie de partager sera bien plus forte quand l’outil sera
  en ligne (option A, CTA « lien dans la bio »).

**À publier ?** Oui, publiable en l’état (≥ 7) si Alexandre choisit l’option (B). Recommandation du juge : le garder
pour la semaine de mise en ligne du site et ne changer alors que la légende et l’étiquette (« ESSAYEZ AVEC VOTRE NOM »),
c’est là qu’il rapportera le plus de partages.
