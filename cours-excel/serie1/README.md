# Série 1 — Formules mathématiques (partie 1)

Fichier : [Serie1.xlsx](Serie1.xlsx) (le fichier contient les énoncés **et** les onglets `-Solution`).

Rappel : version anglaise `,` → version française `;` (ex. `=ROUND(F4,2)` → `=ARRONDI(F4;2)`).

---

## Partie 1 — Les formules du cours

### COUNT / NB
Compte **uniquement les cellules qui contiennent un nombre** (le texte et les cellules vides sont ignorés).
- `=COUNT(1;2;3)` → 3
- `=COUNT(B4:B55)` → nombre de valeurs numériques dans la liste (les noms sont ignorés) → **17**

### SUM / SOMME
- `=SUM(A4:A6)` → additionne une plage (`:` = « de … à »)
- `=SUM(A4:A6,6)` → plage + une valeur
- `=SUM(A4:A6,A10:A12)` → plusieurs plages séparées par `,` (FR : `;`)

### PRODUCT / PRODUIT
Comme SUM mais multiplie. `=PRODUCT(A4:A6)` → 1×2×3 = 6.
Équivaut à `=A4*A5*A6`.

### AVERAGE / MOYENNE
`=AVERAGE(A4:A6)` → 2. Les cellules **vides sont ignorées** (pas comptées comme 0).

### Arrondis
| Formule | Exemple | Résultat | Explication |
|---|---|---|---|
| `ROUND(x; n)` | `ROUND(1.735463;0)` | 2 | arrondi normal à *n* décimales |
| `ROUNDUP(x; n)` | `ROUNDUP(1.00001;0)` | 2 | toujours vers le haut |
| `ROUNDDOWN(x; n)` | `ROUNDDOWN(1.735463;3)` | 1.735 | coupe, toujours vers le bas |
| `MROUND(x; multiple)` | `MROUND(1.73456;0.05)` | 1.75 | au multiple de 0.05 le plus proche |

*n* = nombre de décimales : `0` = entier, `2` = centimes, `-1` = dizaine.

### Références absolues `$` (TRÈS important pour la suite)
Quand tu **tires** une formule, Excel décale les références. Le `$` bloque ce qui suit :
| Écriture | Colonne | Ligne |
|---|---|---|
| `A1` | bouge | bouge |
| `$A1` | bloquée | bouge |
| `A$1` | bouge | bloquée |
| `$A$1` | bloquée | bloquée |

Raccourci : clique dans la référence et appuie sur **F4** (sur Mac : **Cmd+T** ou **Fn+F4**) pour faire défiler les 4 modes.

Bonus de l'onglet : `=SUM(C13:C16 C14:D14)` avec un **espace** = **intersection** des 2 plages (ici seulement C14 → 2).

### RAND / RANDBETWEEN (ALEA / ALEA.ENTRE.BORNES)
- `=RAND()` → décimal entre 0 et 1, change à chaque modification de la feuille.
- `=RANDBETWEEN(1;5)` → entier entre 1 et 5.
- `=RANDBETWEEN(1;5)+RAND()` → décimal entre 1 et 6.

### Validation des données (liste déroulante)
Données → Validation des données → Autoriser : **Liste** → Source : `$C$7:$C$12`.
Pour un nombre entier entre 0 et 3 : Autoriser : **Nombre entier**, entre 0 et 3.

---

## Partie 2 — Exercices

### Exercice 1 — Ventes par ville (SUM, ROUND, AVERAGE)
| Cellule | Formule | Pourquoi |
|---|---|---|
| F4 | `=SUM(C4:E4)` | total janvier→mars, puis tirer jusqu'à F7 |
| G4 | `=ROUND(F4,2)` | arrondi au centime |
| L4 | `=SUM(I4:K4)` | total avril→juin |
| M4 | `=ROUND(L4,2)` | |
| O4 | `=G4+M4` | total du semestre = trimestre 1 + trimestre 2 |
| F8 | `=SUM(F4:F7)` | total toutes villes (idem L8, O8) |
| F9 | `=AVERAGE(F4:F7)` | moyenne par ville (idem L9) |

💡 Écris la formule en ligne 4 puis **double-clique sur la petite poignée** en bas à droite de la cellule pour la recopier vers le bas.

### Exercice 2 — Ventes en Yen + commission (références absolues `$`)
Taux de change en **A3** (131.1), commission en **B3** (5 %). Ces deux cellules doivent être **bloquées** avec `$`, sinon en tirant la formule vers le bas elles deviennent A4, A5… (vides) → résultat 0.

| Cellule | Formule | Pourquoi |
|---|---|---|
| C7 | `=B7*$A$3` (ou `=PRODUCT(B7,$A$3)`) | € → ¥ |
| D7 | `=ROUNDUP(C7,2)` | arrondi au-dessus |
| E7 | `=D7*$B$3` | commission 5 % |
| F7 | `=ROUNDDOWN(E7,2)` | arrondi en dessous |
| G7 | `TRUE` / `FALSE` via liste déroulante (I17:I18) | ou mieux : `=F7>0` qui le calcule tout seul |
| B18 | `=SUM(B7:B17)` puis tirer à droite jusqu'à F18 | |
| B19 | `=MROUND(B18,0.5)` puis tirer à droite | arrondi au 0.5 |
| J8 | `=D19-F19` | bénéfice = ventes − commissions |
| J9 | `=AVERAGE(F7:F17)` | commission moyenne |
| J10 | `=ROUND(J9,3)` | |

⚠️ Piège : Reginald a 0 € de ventes → pas de commission → `FALSE`.

### Exercice 3 — Suivi des heures (calcul avec des heures)
Tape les heures au format `8:15`, `10:00`.
| Cellule | Formule | Pourquoi |
|---|---|---|
| D4 | `=C4-B4` | durée = fin − début |
| G4 | `=F4-E4` | |
| I4 | `=D4+G4` | total de la semaine par matière |
| D10 | `=SUM(D4:D9)` (idem G10, I10) | |
| L4 | `=AVERAGE(D4:D9)` | moyenne lundi |
| L5 | `=AVERAGE(G4:G9)` | moyenne mardi |
| L6 | `=AVERAGE(I4:I9)` | moyenne semaine |

⚠️ Piège : si un total dépasse 24 h, Excel « repart à zéro ». Format de cellule → Personnalisé → `[h]:mm` pour afficher par ex. `27:30`.

### Exercice 4 — Sondage de satisfaction (RANDBETWEEN, COUNT, moyennes)
| Cellule | Formule | Pourquoi |
|---|---|---|
| B4:I26 | `=RANDBETWEEN(1,5)` | notes aléatoires (la solution met `0,5` mais l'échelle va de 1 à 5 → `1,5` est plus logique) |
| lignes Maria, Phil, Charlie | **laisser vide** | ils n'ont pas répondu (effacer les `x`) |
| P14 | `=COUNT(B4:B26)` | compte les nombres → les lignes vides ne comptent pas → **20** |
| B27 | `=AVERAGE(B4:B26)` puis tirer jusqu'à I27 | les vides sont ignorés |
| B28 | `=ROUNDUP(B27,0)` puis tirer | |
| B29 | `=AVERAGE(B28:E28)` | moyenne « Material » |
| F29 | `=AVERAGE(F28:I28)` | moyenne « Trainer Skills » |
| B30 / F30 | `=ROUND(B29,1)` / `=ROUND(F29,1)` | |

💡 Astuce : sélectionne B4:I26, tape la formule, puis **Ctrl+Entrée** → elle remplit toute la sélection d'un coup. Ensuite efface les 3 lignes des non-répondants.
