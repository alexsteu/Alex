#!/bin/bash
# tools/render-all.sh restaurant [coiffure …] : les deux jeux d'images (ordinateur 96, téléphone 72) dans ../v2/img/e3d/<scène>/
cd "$(dirname "$0")/.."
for s in "$@"; do
  node render.cjs --scene $s --w 1280 --h 800 --ss 1.5 --n 96 --quality 78 --out ../v2/img/e3d/$s/d > out/log-$s-d.txt 2>&1
  node render.cjs --scene $s --w 540 --h 960 --ss 2 --n 72 --quality 76 --out ../v2/img/e3d/$s/m > out/log-$s-m.txt 2>&1
done
