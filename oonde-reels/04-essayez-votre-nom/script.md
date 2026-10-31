# 04 · Essayez avec votre nom

**Idée en une phrase.** On tape « Salon Mirabelle » dans le vrai outil du site OONDE, on choisit le métier, la commune et
la couleur, et l’aperçu du site change sous nos yeux à chaque geste : le commerçant voit que son site existe déjà en image.

**Spectateur visé.** Commerçant indépendant de Genève à Montreux (coiffure, institut, garage, artisan) qui n’a pas de site
ou en a un vieux, et qui pense qu’un site « c’est compliqué et ça prend des semaines ».

**Accroche à t = 0.** « Tapez le nom / de votre commerce. » (titre 92 px) au-dessus d’un téléphone qui montre la vraie page :
le champ « Nom de votre commerce » vide, avec le curseur bleu qui clignote. Étiquettes : « DÉMONSTRATION » et
« DÉMO · LIEU FICTIF ». La dernière image reprend exactement celle-ci (boucle).

**Matière.** Captures réelles de la page (dist/index.html, section #essai), Playwright 390×844, échelle 3, transitions
coupées : 16 états de frappe (une lettre par image), puis métier, commune, deux couleurs (21 images). La petite ligne
« Gratuite, en 48 heures… » sous le bouton et le lien « Prix » du menu sont masqués pendant la capture. Aucun prix
n’est visible (les tarifs du site type sont sous le bas de l’aperçu).

## Plan minuté (14,6 s, v2)

| t (s) | Ce qu’on voit | Ce qu’on lit | Son |
|---|---|---|---|
| 0,0 | Téléphone, champ vide, curseur bleu, aperçu neutre « Bienvenue. » | « Tapez le nom de votre commerce. » | musique douce |
| 0,5–2,3 | « Salon Mirabelle » s’écrit lettre par lettre ; à 1,4 s la caméra glisse vers l’aperçu, dont le titre grandit au centre | idem + « DÉMO · LIEU FICTIF » | 15 touches, pop |
| 2,95–4,7 | Les métiers ; doigt sur « Coiffure » (3,85), coupe nette, la photo du salon balaie l’aperçu ; zoom sur la photo | « Choisissez votre métier. » | whoosh, tick, droplet (3,88) |
| 4,75–6,5 | La commune : doigt sur le menu (5,45), la liste s’ouvre (Genève → Montreux), doigt sur Morges (5,82) ; zoom, cadre bleu sur « Votre salon à Morges. » (6,5) | « Puis votre commune. » | whoosh, 2 ticks, droplet |
| 7,05–9,0 | Aperçu et pastilles dans le même plan (k 2,8) : prune (7,85) puis miel (8,5), le bouton « Prendre rendez-vous » change | « Et votre couleur. » | whoosh, 2 ticks |
| 9,0–11,55 | Plan large sur l’aperçu (k 3) ; récapitulatif en coupes de 0,22 s : vide → nom → photo → Morges → miel, puis plan tenu 1,2 s | « Votre site s’affiche en direct. » | 4 ticks légers, carillon |
| 11,55–14,3 | Sortie ramassée du téléphone, puis écran final : logo, « Votre vrai site, la maquette est offerte. » + curseur bleu qui clignote, pastille WhatsApp, @oonde_studio | | swipe, accord final |
| 14,3–14,6 | Retour à l’image t = 0 (champ vide, curseur, titre) : la vidéo reboucle sans couture | « Tapez le nom de votre commerce. » | pop léger |

## Pourquoi un commerçant l’enverrait à un autre

Parce qu’on voit en 10 secondes un vrai site apparaître avec le nom d’un salon, sa commune et sa couleur : « regarde, ils
te font ça avec ton nom ». Le geste possible aujourd’hui n’est pas d’essayer l’outil (le site n’est pas encore en ligne) mais
d’envoyer le nom de son commerce sur WhatsApp pour recevoir la maquette offerte : c’est l’appel à l’action de la légende.
