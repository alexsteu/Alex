# oonde.ch — site OONDE

Version actuelle : `v2/`. Site recentré sur la vente, contact unique par WhatsApp, pages légales suisses.

- `v2/home.html` : page d'accueil (source). `v2/legal/*.html` : contenu des pages légales. `v2/legal-layout.html` : leur gabarit.
- `python3 v2/build.py` génère :
  - `v2/dist/` : le site prêt à déployer (polices hébergées localement, aucun appel à un service tiers, `_headers` et `sitemap.xml` pour Netlify) ;
  - `v2/preview/` : la version d'aperçu Claude (Google Fonts).

Pour publier : glisser le dossier `v2/dist` sur https://app.netlify.com/drop, puis relier oonde.ch dans Netlify.

Ancienne version (base Enseigne + Reel) : `index.html`, `build.py`, `parts/`, `base/`.
