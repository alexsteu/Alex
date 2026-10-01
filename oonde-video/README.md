# oonde — vidéo motion design (9:16, 15 s)

Vidéo verticale (Reels / TikTok / Stories) qui explique oonde à travers l'exemple d'un restaurant italien,
« Da Marco » :

| Temps | Scène |
|---|---|
| 0 – 3,3 s | Un client cherche « restaurant italien près de moi » : Da Marco est 9e, avec une fiche incomplète. « Votre resto est invisible ? » |
| 3,3 – 6,5 s | L'onde oonde passe : photos, horaires, mots-clés et avis cochés, note 3,9 → 4,8, score de la fiche 38 → 96. |
| 6,5 – 9,5 s | Retour sur Google : Da Marco remonte de la 9e à la 1re place. |
| 9,5 – 12,4 s | ChatGPT recommande Da Marco (et aussi Gemini, Perplexity, Copilot). |
| 12,4 – 15 s | Écran de fin : logo **oonde** + « Faites-vous trouver. Sur Google et dans les IA. » |

## Fichiers

- `oonde-reel.mp4` : la vidéo finale (1080×1920, 60 i/s, H.264 + AAC).
- `index.html` : toute l'animation (HTML/CSS + `render(t)` déterministe). Ouvrir dans un navigateur et
  appeler `render(4.2)` dans la console pour voir n'importe quel instant.
- `render.cjs` : capture image par image avec Playwright puis encodage avec ffmpeg.
- `audio.py` : musique et sound design synthétisés (numpy), calés sur la timeline.
- `fonts/` : Poppins et Inter (licence OFL).

## Régénérer

```bash
pip install numpy
NODE_PATH=$(npm root -g) node render.cjs video.mp4     # nécessite playwright + chromium
python3 audio.py                                        # → audio.wav
ffmpeg -i video.mp4 -i audio.wav -c:v copy -af loudnorm=I=-15:TP=-1.5 -c:a aac -b:a 192k -shortest oonde-reel.mp4
```

Les textes se modifient dans `index.html` (constantes `HEADS`, `ROWS`, `CHECKS`, `AI`, slogan).
Les couleurs sont dans les variables CSS de `:root`.
