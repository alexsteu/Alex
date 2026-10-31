#!/bin/bash
# Finition « pellicule » : halation (halo rouge autour des hautes lumieres), bloom, grain, vignette,
# aberration chromatique legere. Usage: finition.sh in.mp4 out.mp4 [force 0..1, defaut 0.6]
IN=$1; OUT=$2; F=${3:-0.6}
ffmpeg -v error -y -i "$IN" -filter_complex "
[0:v]format=gbrp,split=3[base][h][b];
[h]curves=all='0/0 0.7/0 1/1',gblur=sigma=18,colorchannelmixer=rr=1:gg=0.35:bb=0.15[hal];
[b]curves=all='0/0 0.6/0 1/1',gblur=sigma=40[bloom];
[base][hal]blend=all_mode=screen:all_opacity=$(echo "$F*0.55"|bc -l)[x1];
[x1][bloom]blend=all_mode=screen:all_opacity=$(echo "$F*0.35"|bc -l)[x2];
[x2]format=yuv420p,rgbashift=rh=-2:bh=2,noise=c0s=$(echo "$F*14/1"|bc):c0f=t+u:c1s=4:c1f=t,vignette=PI/4.5,eq=contrast=1.04:saturation=0.95[v]" \
 -map "[v]" -map 0:a? -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a copy "$OUT"
