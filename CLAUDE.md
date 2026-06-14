# CLAUDE.md — Contexte projet : Journal Santé

PWA de suivi santé personnel, **mobile-first**, installable sur iPhone, hors-ligne.
Aucun framework, aucune étape de build : HTML + CSS + **JavaScript vanilla (ES modules)**.

## Architecture

```
index.html            App shell. Charge js/app.js en module.
css/styles.css        Design system (variables CSS, cartes, anneaux, animations).
js/
  app.js              Rendu des 4 onglets + délégation d'événements + photo + service worker.
  store.js            État en mémoire + logique métier (dates, sommeil, protéines, défi, export/import).
  db.js               Couche IndexedDB (stores "days" + "settings") + migration depuis localStorage.
  charts.js           Graphiques SVG purs (lineChart, barChart). Zéro dépendance.
  ai.js               Appel à /api/analyze (n'appelle JAMAIS l'API Anthropic directement).
  backup.js           Export / import JSON.
api/analyze.js        Fonction serverless Vercel. Garde ANTHROPIC_API_KEY côté serveur.
manifest.json, sw.js  PWA : installable + cache hors-ligne.
icons/                Icônes générées par scripts/generate-icons.py (PNG pur Python, sans dépendance).
legacy/               Ancienne version mono-fichier (référence historique, ne pas modifier).
```

## Modèle de données

- `day` (clé = `"YYYY-MM-DD"`) : `belly` (1-10|null), `mood` (label|null), `sport` (bool|null),
  `muscles` []`, `weedFirst`, `weedCount`, `sleepTime`, `wakeTime`, `meals` [{id,time,desc}],
  `proteins` [{id,description,amount,detail,time}], `notes`.
- `settings` : `proteinGoal` (130), `challengeName`, `challengeStart` (`YYYY-MM-DD`), `challengeDuration`.

## Conventions

- **Persistance** : tout passe par `store.js` → `db.js` (IndexedDB). Ne pas réintroduire `localStorage`
  (sauf la migration unique déjà gérée dans `db.migrateLegacyIfNeeded`).
- **Rendu** : `app.js` reconstruit `#app.innerHTML` à chaque action. Interactions via **délégation**
  d'événements (`data-act`, `data-arg`, `data-field`, `data-setting`, `data-state`) — pas de `onclick` inline
  (incompatible avec les modules).
- **Sécurité** : échapper tout texte utilisateur avec `esc()` dans `app.js`. La clé API ne doit jamais
  apparaître côté client — toujours passer par `api/analyze.js`.
- **Hors-ligne** : si on ajoute un fichier statique, l'ajouter à la liste `SHELL` dans `sw.js` et
  **incrémenter** `CACHE` (`journal-sante-vN`) pour invalider l'ancien cache.
- **IA / Anthropic** : la fonction serverless utilise le SDK `@anthropic-ai/sdk`, modèle par défaut
  `claude-opus-4-8` (surchargeable via `ANTHROPIC_MODEL`), avec sortie structurée (`output_config.format`).
  Toujours consulter le skill `claude-api` avant de modifier l'appel modèle.
- **Langue** : interface en **français**.

## Commandes utiles

```bash
python3 -m http.server 8000        # dev local sans IA
vercel dev                          # dev local avec IA (nécessite .env → ANTHROPIC_API_KEY)
python3 scripts/generate-icons.py   # régénérer les icônes
for f in js/*.js api/*.js sw.js; do node --check "$f"; done   # vérif syntaxe
```

## Git

- Branche de développement : `claude/admiring-fermi-f9283w`.
- Ne **jamais** committer `.env` ni la clé API.
