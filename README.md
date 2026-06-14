# 💜 Journal Santé

Une application web personnelle de suivi santé, transformée en **vraie PWA installable sur iPhone** : elle s'ouvre en plein écran, fonctionne **hors-ligne**, et garde tes données **sur ton appareil**.

Tu y suis chaque jour : **sommeil**, **ventre** (gonflement 1–10), **humeur**, **sport + muscles**, **cannabis**, **repas** (avec photo), **protéines** (objectif 130 g/jour, avec analyse photo par IA), des **notes**, un **défi** configurable (ex. 21 jours sans lactose), un onglet **Tendances** avec des graphiques, un **historique**, et l'**export / import** de tes données.

> Ce guide est écrit pour quelqu'un qui **ne code pas**. Suis les étapes dans l'ordre, copie-colle les commandes telles quelles.

---

## 📁 Ce qu'il y a dans le dossier

| Fichier / dossier | À quoi ça sert |
|---|---|
| `index.html` | La page principale de l'app |
| `css/styles.css` | L'apparence (couleurs, animations) |
| `js/` | Le code de l'app (découpé en petits fichiers) |
| `api/analyze.js` | Le **serveur** qui parle à l'IA (garde ta clé secrète) |
| `icons/` | Les icônes affichées sur l'écran d'accueil |
| `manifest.json`, `sw.js` | Ce qui rend l'app installable et hors-ligne |
| `scripts/generate-icons.py` | Régénère les icônes si tu veux changer le design |
| `legacy/journal-sante.html` | L'ancienne version (gardée pour référence) |

---

## 🟢 Option A — Lancer en local SANS l'IA (le plus simple)

Tout fonctionne **sauf** l'analyse photo (qui a besoin du serveur). Tu peux quand même ajouter tes protéines à la main.

1. Ouvre un **Terminal** dans le dossier du projet.
2. Lance un petit serveur web :
   ```bash
   python3 -m http.server 8000
   ```
   *(ou, si tu as Node : `npx serve .`)*
3. Ouvre **http://localhost:8000** dans ton navigateur. C'est tout. 🎉

---

## 🔵 Option B — Lancer en local AVEC l'IA (photo → protéines)

Là, on a besoin de la fonction serveur. On utilise l'outil **Vercel** en local.

1. Installe Node.js si ce n'est pas déjà fait : https://nodejs.org (prends la version « LTS »).
2. Dans le Terminal, dans le dossier du projet :
   ```bash
   npm install            # installe les dépendances (une seule fois)
   npm install -g vercel  # installe l'outil Vercel (une seule fois)
   ```
3. Crée un fichier nommé **`.env`** (copie `.env.example`) et mets-y ta clé API Anthropic :
   ```
   ANTHROPIC_API_KEY=sk-ant-ta-cle-ici
   ```
   👉 Ta clé se crée gratuitement sur https://console.anthropic.com → **API Keys**.
4. Lance :
   ```bash
   vercel dev
   ```
5. Ouvre l'adresse affichée (souvent **http://localhost:3000**). L'analyse photo marche maintenant.

> 🔒 **Important** : le fichier `.env` n'est **jamais** envoyé sur internet ni sur GitHub (il est ignoré par `.gitignore`). Ta clé reste privée.

---

## 🚀 Déployer gratuitement sur Vercel (pour l'avoir en ligne, sur ton iPhone)

Vercel héberge le site **gratuitement** et garde ta clé API en sécurité côté serveur.

### Étape 1 — Mettre le code sur GitHub
1. Crée un compte sur https://github.com (gratuit).
2. Crée un nouveau dépôt (bouton **New repository**), par exemple `journal-sante`.
3. Envoie le code (depuis le Terminal, dans le dossier) :
   ```bash
   git add .
   git commit -m "Mon journal santé"
   git push
   ```

### Étape 2 — Connecter Vercel
1. Crée un compte sur https://vercel.com avec ton compte **GitHub** (gratuit).
2. Clique **Add New… → Project**.
3. Choisis ton dépôt `journal-sante` et clique **Import**.

### Étape 3 — Ajouter ta clé API (l'étape à ne pas oublier)
1. Avant de déployer, ouvre **Environment Variables**.
2. Ajoute :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : ta clé `sk-ant-…`
3. *(Optionnel)* Ajoute `ANTHROPIC_MODEL` = `claude-sonnet-4-6` si tu veux réduire le coût de l'IA (le modèle par défaut est le plus puissant, `claude-opus-4-8`).
4. Clique **Deploy**. Attends une minute. ✅

Vercel te donne une adresse du type **`https://journal-sante-xxxx.vercel.app`**. C'est ton app, en ligne.

> Chaque fois que tu feras `git push`, Vercel redéploiera tout seul la nouvelle version.

---

## 📱 Installer sur l'écran d'accueil de l'iPhone

1. Ouvre ton adresse Vercel (`https://…vercel.app`) dans **Safari** (pas Chrome — l'installation PWA passe par Safari sur iPhone).
2. Touche le bouton **Partager** (le carré avec une flèche ⬆️, en bas).
3. Fais défiler et touche **« Sur l'écran d'accueil »**.
4. Touche **Ajouter**.

L'icône cœur apparaît sur ton écran d'accueil. En l'ouvrant, l'app se lance **en plein écran**, sans barre Safari, et **fonctionne même sans connexion** (sauf l'analyse photo qui a besoin d'internet).

---

## 🎨 Changer les icônes (optionnel)

Les icônes sont générées par un petit script, sans logiciel à installer :
```bash
python3 scripts/generate-icons.py
```
Modifie les couleurs en haut de `scripts/generate-icons.py` (`C1`, `C2`) puis relance la commande.

---

## ❓ Questions fréquentes

- **Mes données sont-elles privées ?** Oui. Elles sont stockées **uniquement dans le navigateur de ton appareil** (technologie IndexedDB). Rien n'est envoyé sur un serveur, sauf la **photo** que tu choisis d'analyser (elle est envoyée à l'IA pour estimer les protéines, puis n'est pas conservée).
- **Comment je sauvegarde mes données ?** Onglet **Réglages → Exporter mes données**. Tu récupères un fichier `.json`. Pour restaurer : **Importer une sauvegarde**.
- **L'analyse photo ne marche pas en local.** C'est normal en **Option A** (sans serveur). Utilise l'**Option B** (`vercel dev`) ou la version déployée sur Vercel.
- **Combien ça coûte ?** L'hébergement Vercel est gratuit. Seule l'IA (analyse photo) consomme un peu de crédits Anthropic, à l'usage.
