cd ~/cine
for n in A B C; do python3 monter2.py plan$n.json r$n.mp4 > r$n.log 2>&1 && bash ~/k2/hybride/finition.sh r$n.mp4 f$n.mp4 0.35 >> r$n.log 2>&1; done
echo done > run.done
