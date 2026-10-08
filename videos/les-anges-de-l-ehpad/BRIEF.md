---
workflow: general-video
flow: automation
storyboard: no
message: "Parodie de télé-réalité : Les Anges de l'EHPAD, humour noir et vulgarité bipée, sans méchanceté"
aspect: "9:16"
length: "50s"
language: fr
destination: réseaux sociaux (TikTok / Reels / stories)
---

# Les Anges de l'EHPAD

## Intent

Demande : « une vidéo ludique, style téléréalité, proche du vulgaire et humour noir en restant correcte ».
Sujet laissé libre (« Surprends-moi »). Concept retenu : une fausse bande-annonce de télé-réalité
tournée dans une maison de retraite — confessionnaux, casting, clash au loto, épreuve, cérémonie
d'élimination, « dans le prochain épisode ». Les gros mots sont suggérés par des bips + barres de censure ;
l'humour noir porte sur l'âge et la mort, jamais sur une personne réelle.

Direction laissée de côté : la villa classique façon « Les Marseillais » (trop attendue).

## Customizations

- Voix off française locale (Kokoro, voix ff_siwis).
- Musique et bruitages synthétisés (`scripts/make_audio.py`) : bips, whoosh, boom, « dun dun DUN », scratch.
- Registre HyperFrames : `camcorder-hud` (confessionnaux), `grain-overlay` (adapté, seek-safe).
- Portraits SVG maison : `assets/cast/`.

## Notes

- GSAP est servi en local (`assets/vendor/gsap.min.js`) : le CDN n'est pas joignable depuis l'environnement de rendu.
