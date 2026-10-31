#!/bin/bash
# v19 : la suite de la rue, par métier (arrêt → porte → salle) : ordinateur 56 images, téléphone 64
cd /home/user/alex/oonde-site/entree3d
one(){ m=$1; k=$2; if [ $k = d ]; then W=1280;H=800;SS=1.5;N=56;Q=78; else W=540;H=960;SS=2;N=64;Q=76; fi
  O=../v2/img/e3d/in/$m/$k; mkdir -p $O
  node render.cjs --scene rue --q int=$m --w $W --h $H --port 8795 --dump out/v19/path-$m-$k.json > /dev/null 2>&1
  node tools/plist.mjs out/v19/path-$m-$k.json x $N 0 > out/v19/pl-$m-$k.json 2>/dev/null
  node render.cjs --scene rue --q int=$m --w $W --h $H --ss $SS --plist out/v19/pl-$m-$k.json --quality $Q --port 8795 --out $O > out/v19/log-$m-$k.txt 2>&1
  echo "done $m $k $(date +%T)" >> out/v19/done.txt; }
export -f one
rm -f out/v19/done.txt; date +%T > out/v19/start.txt
printf "%s\n" "restaurant d" "restaurant m" "boulangerie d" "boulangerie m" "coiffure d" "coiffure m" "institut d" "institut m" "onglerie d" "onglerie m" "logement d" "logement m" | xargs -P 4 -L 1 bash -c 'one $0 $1'
echo ALL >> out/v19/done.txt
