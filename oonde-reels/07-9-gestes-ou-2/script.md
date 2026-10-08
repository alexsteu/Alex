# 07 · 9 gestes ou 2 ? — Salon Mirabelle — script

## Idée en une phrase
Deux téléphones côte à côte, le même salon (Salon Mirabelle, démo) : on compte, geste par geste, ce qu’il faut faire pour prendre rendez-vous sur l’ancien site (9 touches, et seulement aux heures d’ouverture) puis sur le nouveau (2 touches : « Réserver sur WhatsApp », envoyer).

## Spectateur visé
Coiffeuse, barbier, esthéticienne ou petit commerce de Genève à Montreux dont le site n’a pas de bouton pour réserver (menu, PDF, numéro à chercher). Il regarde sans le son, au pouce. Il compte avec le Reel.

## Accroche (t = 0, lisible dès la première image)
Petite ligne « Prendre rendez-vous : » puis en très grand « 9 gestes ou **2** ? » (le 2 en Klein, seul chiffre Klein de l’image). Dessous, déjà en place : « ANCIEN SITE » et « NOUVEAU SITE », deux compteurs « 0 geste », et les deux téléphones (ancien site daté à gauche, nouveau site à droite). On comprend en une seconde qu’on va compter.

## Les gestes, réellement montrés et comptés (iPhone, Safari)
Ancien site (pas de bouton de réservation, numéro sur la page Contact, infos dans un PDF) :
1. Ouvrir le menu (toucher « ☰ Menu ») · 2. Toucher « Prestations » · 3. Ouvrir le PDF des horaires · 4. Zoomer pour lire (pincer) · 5. Revenir (‹) · 6. Rouvrir le menu · 7. Toucher « Contact » · 8. Toucher le numéro (lien tél.) · 9. Toucher « Appeler » dans la fenêtre de confirmation d’iOS. Ensuite il faut encore que le salon décroche : l’appel ne marche qu’aux heures d’ouverture.
Nouveau site : 1. Toucher « Réserver sur WhatsApp » (le lien ouvre la discussion avec le message déjà écrit) · 2. Toucher « Envoyer ». Le message apparaît, statut neutre (une coche), aucune réponse inventée.

## Plan minuté (v2 : 16,64 s, 30 i/s, 499 images ; les gestes tombent sur le temps de la musique, 0,76 s)

| t (s) | On voit | On lit | Son |
|---|---|---|---|
| 0,00 – 2,06 | Les deux téléphones (échelle de base 0,88), compteurs « 0 geste » en **gris**. À 1,46 s l’anneau de toucher se pose sur « ☰ Menu ». 1,74 – 2,06 : focus à gauche (actif ×1,04 ; droite ×0,94, désaturée, 35 %, E.inOut). Accroche : fondu 1,94 – 2,06 + montée de 30 px, **sans masque**. | DÉMO · LIEU FICTIF · SALON MIRABELLE / Prendre rendez-vous : / 9 gestes ou 2 ? (2,06 s à l’écran) | Tic à 0,05 et 1,48 |
| 2,28 – 8,36 | **9 gestes, un toutes les 0,76 s** : anneau Klein, l’écran change, le compteur roule (gris → Klein au 1er geste) et grossit de 3 % par geste (×1,24 au 9e). Poussée lente de la caméra sur le téléphone actif (×1,04 → ×1,16, origine qui suit le point touché, bas ≤ 1500). PDF : pincement centré sur « Horaires / Rendez-vous par téléphone uniquement », doigts sous le texte, filet Klein sous la ligne à 5,00 s. | Ouvrir le menu · « Prestations » · PDF des horaires · Zoomer pour lire · Revenir · Rouvrir le menu · « Contact » · Toucher le numéro · Appeler | Tic à chaque geste (note qui monte), glissé au PDF et au pincement |
| 8,44 – 10,34 | Écran d’appel : île et barre d’état (icônes blanches) au-dessus, « Salon Mirabelle » sous le numéro, « appel… » qui pulse. | Appeler / aux heures d’ouverture. (dès 8,56, 1,78 s) | Coup sourd à 8,56 |
| 10,21 – 10,53 | Focus à droite (E.inOut 0,32 s) : la gauche passe à 35 %, désaturée, ×0,94 ; compteur gauche à l’encre. | — | Whoosh (pic 10,21) |
| 10,34 – 12,54 | Geste 1 (11,02) : « Réserver sur WhatsApp » → discussion, message pré-rempli, clavier. Geste 2 (11,78) : envoyer → bulle verte, une coche. Compteur droit gris → Klein au 1er geste. | Toucher « Réserver » · Envoyer sur WhatsApp (78 px) | Pop, glissé, pop, goutte (demi-temps) |
| 12,54 – 14,44 | **Récapitulatif en coupes franches** : chiffres 290 px, téléphones ×0,82 (haut 800, bas 1387, droite 924). 12,54 : seul « 9 gestes » allumé, droite à 35 %. 12,94 : coupe, « 2 gestes » Klein s’allume (pop). Tenu jusqu’à 14,44. | Réserver en 2 gestes. | Tic + whoosh (pic 12,54), tic aigu + pop 12,94 |
| 14,44 – 16,64 | **Écran final** (juge : compteur « 0 geste » retiré, 8 mots) : « Et chez vous ? » (14,44, y 680), bouton [icône] « Maquette offerte sur WhatsApp » (14,66, y 880), logo (14,74), @oonde_studio (14,78). Tout est posé à 15,10 → tenu 1,54 s. La question renvoie à l’accroche. | Et chez vous ? / Maquette offerte sur WhatsApp / @oonde_studio | Whoosh + coup sourd, pop 14,66, accord final 15,14 |

## Tailles à l’écran (vérifiées avant le rendu, leçon 11)
- Téléphones : écran 332 px de large pour une page de 280 px CSS → échelle 1,186. Le texte dans le téléphone (13–15 px CSS → 15–18 px) **ne porte pas le message** : il montre. Tout ce qui porte l’argument est repris hors du téléphone :
  - nom du geste : **84 px** (Instrument Sans 600) ; 2e ligne « aux heures d’ouverture. » : **54 px** ;
  - compteurs : chiffre **160 px**, mot « gestes » **46 px** ; étiquettes « ANCIEN SITE / NOUVEAU SITE » : mono **30 px** ;
  - accroche : « Prendre rendez-vous : » **58 px**, « 9 gestes ou 2 ? » **124 px** ; légendes 84 px (« Envoyer sur WhatsApp » : 862 px à 84 px → **78 px**, 800 px) ; récapitulatif : chiffres **290 px**, « gestes » 54 px ; compteur gauche jusqu’à 166 × 1,24 = 206 px ; fin : titre **100 px**, bouton **46 px** (797 px de large, x 142–939), @oonde_studio mono 32 px.
  - v2 : téléphones à l’échelle de base 0,88 (page ×1,04 à ×1,02 selon le focus et la poussée) ; le texte du téléphone reste décoratif.
- Zone de sécurité (mesurée dans la page) : légendes x 140–940 ; téléphones x 119–940, bas ≤ 1499 à tout moment ; récapitulatif : téléphones bas 1387, droite 924 ; « 2 gestes » x 598–934.

## Pourquoi un commerçant l’enverrait à un autre
Parce qu’on compte avec la vidéo et qu’on reconnaît son propre site, ou celui d’un collègue, dans les 9 gestes (le menu, le PDF, le numéro caché dans « Contact »). C’est concret, vérifiable sur son propre téléphone, sans moquerie : « Compte combien il en faut chez toi. »

## Règles vérifiées
- Commerce fictif déjà validé (Salon Mirabelle, Montreux), « Démo · lieu fictif » à l’écran en permanence, et dans l’en-tête de la discussion.
- Aucun chiffre inventé : 9 et 2 sont les gestes montrés et comptés à l’écran. Aucun prix (le PDF n’a que des points de suite, pas de tarifs). Numéro fictif 021 000 00 00.
- Pas de réponse du salon ni de faux échange : seul le message envoyé est visible, avec une coche neutre.
- Interfaces de tiers schématiques : icône WhatsApp seule (autorisée par la DA), pas d’interface WhatsApp imitée à l’identique, pas de logo Apple, barre d’adresse sans nom de domaine.
- Contact OONDE : WhatsApp seulement. Klein : un seul chiffre à la fois (le 2 de l’accroche, puis le compteur actif), l’anneau de toucher, le filet sous « Rendez-vous par téléphone uniquement », le mot « vous » de la fin.
- **« 2 gestes » à vérifier sur un vrai iPhone avant publication** (voir notes.md, Corrections, point S1).
