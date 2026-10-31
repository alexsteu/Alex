#!/bin/bash
# v27 : les clips vidéo (images PNG 60 i/s) : intro (in), entrées (e-<métier>, 90 images = 1,5 s), glissements (g-a-b) ;
# téléphone d'abord (m 1080×1920), puis ordinateur (d 1920×1080). Relançable : les jobs finis (done.txt) et les images déjà rendues (--resume) sont gardés.
cd /home/user/alex/oonde-site/entree3d
O=out/v27; mkdir -p $O/f
one(){ job=$1; k=$2; n=$3; kind=$4; q=$5
  grep -q "^done $job $k " $O/done.txt 2>/dev/null && return
  if [ $k = m ]; then W=1080; H=1920; else W=1920; H=1080; fi
  D=$O/f/$job-$k; mkdir -p $D
  [ -s $O/path-$job-$k.json ] || node render.cjs --scene rue --q "$q&grain=0" --w $W --h $H --port 8791 --dump $O/path-$job-$k.json > /dev/null 2>&1
  [ -s $O/dense-$job-$k.json ] || node tools/plist.mjs $O/path-$job-$k.json x 600 1 > $O/dense-$job-$k.json 2>/dev/null
  python3 tools/v27/sample.py $O/dense-$job-$k.json $kind $n $O/pl-$job-$k.json
  node render.cjs --scene rue --q "$q&grain=0" --w $W --h $H --ss 1 --plist $O/pl-$job-$k.json --fmt png --resume 1 --port 8791 --out $D >> $O/log-$job-$k.txt 2>&1
  [ -s $D/pins.json ] && echo "done $job $k $(date +%T)" >> $O/done.txt; }
export -f one; export O
date +%T >> $O/start.txt
N3="n3=restaurant,coiffure,institut"
J=""
for k in m d; do J="$J
in $k 150 in $N3&clip=in
e-coiffure $k 90 entry $N3&int=coiffure&at=1
e-restaurant $k 90 entry $N3&int=restaurant&at=1
e-institut $k 90 entry $N3&int=institut&at=1
g-rc $k 51 glide $N3&clip=restaurant-coiffure
g-ci $k 51 glide $N3&clip=coiffure-institut
g-ri $k 60 glide $N3&clip=restaurant-institut"; done
printf "%s\n" "$J" | grep -v '^$' | xargs -P 4 -L 1 bash -c 'one $0 $1 $2 $3 $4'
echo "ALL $(date +%T)" >> $O/done.txt
