# oonde.ch — site one page

Site d'OONDE, repris du site « Enseigne » (`base/enseigne.html`) et passé à la direction artistique « Signal »
(porcelaine, encre, bleu Klein ; Bricolage Grotesque, Instrument Sans, IBM Plex Mono).

Ajouts par rapport à Enseigne : champ de points animé dans le hero, chiffres de l'étude (1 200 fiches Google),
mention des assistants IA, section « Qui sommes-nous » avec le Reel, coordonnées OONDE (email, téléphone, WhatsApp, Instagram).

- `index.html` : le site complet, prêt à déployer, avec `oonde-reel.mp4` à côté.
- `build.py` : régénère `index.html` et `src/page.html` depuis `base/enseigne.html` + `parts/`.
- `src/page.html` : la même page sans l'en-tête `<!doctype>`, pour l'aperçu Claude.

Le formulaire envoie vers Netlify Forms (`data-netlify`). Ailleurs, il affiche un message à copier vers WhatsApp ou l'email.
