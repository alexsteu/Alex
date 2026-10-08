# Kit Reels OONDE — règles de production

Ce dossier sert à fabriquer les Reels (1080×1920) et les carrousels (1080×1350) d'@oonde_studio.
Chaque contenu vit dans son propre dossier `/mnt/project-files/reels/NN-slug/`. Lire aussi `../lecons.md`
(ce qui a marché et raté aux tours précédents) : ses leçons priment sur les habitudes.

## 1. Outils

| Fichier | Rôle |
|---|---|
| `template/index.html` | Gabarit de départ : jetons DA v7, polices (IS, PM, CG), aides `rise`, `typed`, `seg`, `E.*`, zone de sécurité (`?safe`). |
| `render.cjs` | Rend la page image par image → MP4 H.264 sans son. Aussi `--stills` et `--sheet` (planche contact pour la critique). |
| `make_audio.py` | Musique douce + bruitages synthétisés calés sur `cues.json` (numpy seul). |
| `fonts/`, `brand/` | Instrument Sans 400/500/600, IBM Plex Mono 500/600, Cormorant Garamond 400 (romain + italique) ; logo, signe, avatar (versions blanches pour fond encre). |

Contrat de la page : `window.DURATION` (s), `window.render(t)` **déterministe** (même t → même image, aucune
horloge, aucun `Math.random()` non semé, aucune transition CSS), `window.READY = true` quand polices et images
sont prêtes. Les fichiers du kit sont servis sous `/_kit/…` ; ceux du Reel depuis son dossier `src/`.

```bash
K=/mnt/project-files/reels/_kit; export NODE_PATH=$(npm root -g)
cp $K/template/index.html src/index.html                       # point de départ
node $K/render.cjs src --stills 0.3,1.5,4,9 --out stills         # images clés (PNG 1080×1920)
node $K/render.cjs src --sheet sheet.jpg --n 18                  # planche contact
node $K/render.cjs src video.mp4                                 # vidéo muette, 30 i/s
python3 $K/make_audio.py src/cues.json audio.wav                 # son (voir l'en-tête du script)
python3 $K/mux.py video.mp4 audio.wav NN-slug.mp4                # 2 passes, 48 kHz, −15 LUFS, crête ≤ −1,5 dBTP (affiche la mesure)
```
`render.cjs` affiche `ERREURS PAGE : n` si la page a des erreurs : il faut 0. Prévisualiser une image :
ouvrir `src/index.html?t=4.2&safe` (le serveur du kit sert `/_kit/`). Carrousel : même gabarit avec
`#stage` en 1080×1350, une diapo par valeur de `t` (t = 0, 1, 2…), puis `--stills 0,1,2,3,4,5 --out slides`
(page en `html,body,#stage{height:1350px}` et `render.cjs … --h 1350`). `--q safe` ajoute `?safe` à l’adresse (cadre de sécurité visible sur les images de contrôle).

## 2. Direction artistique (DA v7, la même que le site)

- Fond **papier #F7F7F4** ou **encre #111318** (scènes de contraste). Cartes #FFFFFF, filets 1–2 px #DCDED8.
- Texte encre #111318, secondaire #3A3F47, discret #6B7078.
- **Bleu Klein #2038EC = accent seulement** : un mot, un chiffre, un point, un curseur. Moins de 5 % de l'image.
  **Jamais en fond**, jamais deux mots bleus dans la même phrase.
- Vert WhatsApp #14803C : uniquement l'icône ou la bulle WhatsApp.
- Titres Instrument Sans 600, interlettrage −0.025em, interligne 1.0–1.05. Corps Instrument Sans 400/500.
  Étiquettes IBM Plex Mono 500 en capitales, interlettrage .14em. Cormorant Garamond seulement pour un lieu
  « Les Grèves » ou un nom de commerce élégant (démo).
- Rayons 8 / 10 / 14 px (écran de téléphone 44–56 px). Ombres très douces, jamais de dégradé criard,
  pas de néon, pas d'effet « template Canva », pas d'émoji décoratif.
- Logo : `brand/logo.svg` (fond clair) ou `logo-white.svg` (fond encre), jamais recoloré ni déformé.
- Rendu voulu par Alexandre : **« pro, ingénieux, jeune génie »**. Penser « présentation produit Apple /
  Linear / Stripe » : net, précis, des mouvements courts et justes. Jamais l'air « fait par une IA ».

## 3. Format et rythme (Instagram et TikTok, 2026)

- 1080×1920, 30 i/s, **12 à 22 s** (idéal 15–18 s). Carrousel : 1080×1350, 5 à 8 diapos.
- **Accroche lisible dès la première image** (t = 0 n'est jamais vide : la première image sert de vignette
  dans le fil et beaucoup regardent sans le son). Le message de l'accroche est compris avant 1,5 s.
- Un changement visuel toutes les **1 à 1,5 s** (texte, zoom, coupe, élément qui arrive). Pas de plan fixe de
  plus de 2,5 s, sauf l'écran final. Alexandre trouve vite « trop lent » ce qui traîne.
- **Une idée par écran.** 3 à 7 mots par ligne, 2 lignes max pour un titre. Durée d'affichage d'un texte ≥
  (nombre de mots ÷ 3) + 0,8 s.
- Tailles minimales (lecture sur téléphone) : titres 88–130 px, texte courant **≥ 44 px**, étiquettes mono ≥ 30 px.
- **Zones de sécurité** : tout ce qui compte entre x 60–940 et y 250–1500 (`?safe` affiche le cadre). En bas
  (caption, boutons) et à droite (j'aime, partage) l'interface d'Instagram recouvre l'image.
- Tout le sens passe par le **texte à l'écran** (vision sans son). Le son est un plus : bruitages calés sur
  les apparitions (clic de frappe, pop, whoosh doux), musique discrète.
- Fin : écran de 1,5–2 s avec le logo, une phrase d'appel (« Maquette offerte. Écrivez-nous sur WhatsApp. »)
  et `@oonde_studio`. Idéalement la dernière image **raccorde avec la première** (boucle → revisionnages).
- Partageabilité : chaque contenu doit donner envie à un commerçant de l'**envoyer à un autre commerçant**
  (utile, juste, un peu surprenant). C'est le signal le plus fort de l'algorithme.

## 4. Règles de contenu (décidées avec Alexandre, non négociables)

- **Jamais** de témoignage inventé, de chiffre client inventé, de « +300 % de réservations », de statistique
  sans source. Une affirmation générale doit être vraie et vérifiable (sinon la formuler sans chiffre).
- Tout commerce montré est **fictif et marqué « Démo · lieu fictif »** lisiblement à l'écran quand il apparaît.
  Noms déjà utilisés : Les Grèves (maison au bord du lac, Rolle), Salon Mirabelle (coiffure), Garage Fontana.
  Un nouveau nom doit sonner inventé et rester marqué démo.
- **Jamais** Spaghetti d'Oro. Zone : « de Genève à Montreux » (communes citables : Genève, Nyon, Rolle, Morges,
  Lausanne, Vevey, Montreux) ; **jamais Gland**.
- **Aucun prix** dans les contenus Instagram/TikTok. On parle de la **maquette offerte** : « vous voyez votre site
  avant de payer », « vous payez seulement s'il vous plaît ».
- Ne pas promettre de délai non décidé (pas de « en 48 h »), ni une place sur Google (« aucune place garantie »).
- Ne jamais dire ni laisser entendre que c'est fait par une IA. Pas de jargon (« boostez », « SEO », « UX »).
- Contact : **WhatsApp** seulement (pas de formulaire, pas de mail, pas de « appelez-nous »).
- Nous : Alexandre (les sites) et Serhat (le contenu, c'est lui qui répond), **amis depuis le gymnase**.
- Interfaces de tiers (Google, Instagram) : les dessiner **schématiques et neutres**, sans logo ni marque
  déposée imitée ; les étapes décrites doivent être exactes (les vérifier si possible).
- Français de Suisse romande, ton direct et chaleureux, vouvoiement dans les vidéos, guillemets « », apostrophe ’.
- Rien n'est publié : Alexandre valide chaque contenu avant toute mise en ligne.

## 5. Livrables d'un contenu (`/mnt/project-files/reels/NN-slug/`)

```
NN-slug.mp4            vidéo finale avec son (Reel)          | slides/01.png… (carrousel, 1080×1350)
couverture.jpg         1080×1920, l'image d'accroche (texte dans la zone 1080×1350 centrale pour la grille)
couverture-grille.jpg  1080×1350, recadrage centré de la couverture (aperçu de la grille du profil)
legende.md             légende prête à coller + 2 accroches alternatives (Trial Reels) + texte alternatif
script.md              idée, public, accroche, plan minuté (t → ce qu'on voit / ce qu'on lit / le son)
sheet.jpg              planche contact (18 images)
notes.md               critique, corrections, note finale, leçons
src/                   index.html, cues.json, images
v1/                    première version (vidéo + planche) si une correction a suivi
```
Légende : 1re ligne = accroche avec un **mot-clé local** (« site web à Morges », « commerce à Lausanne »…),
2–4 lignes utiles, un **appel à l'action** (« Envoyez ce Reel à un commerçant qui… », « Enregistrez pour plus
tard », « Écrivez-nous sur WhatsApp, lien dans la bio »), **5 hashtags maximum**, pas de prix, pas d'émoji en série.

## 6. Contrôle qualité avant de rendre

1. `ERREURS PAGE : 0`, durée 12–22 s, 1080×1920, H.264 + AAC, son normalisé (−15 LUFS).
2. Image t = 0 lisible et intrigante ; message de l'accroche compris avant 1,5 s.
3. Planche contact : changement visible entre chaque vignette, rien de vide, rien de coupé, textes dans la zone.
4. Textes ≥ 44 px, contrastes forts, Klein en accent seulement, aucune faute de français.
5. Démo marquée, aucun chiffre inventé, aucun prix, pas de Gland, pas d'IA, WhatsApp seul contact.
6. L'écran final : logo, maquette offerte, WhatsApp, @oonde_studio.
7. Un commerçant l'enverrait-il à un ami commerçant ? Sinon, renforcer l'utilité ou la surprise.
