cd ~/cine
for n in $NS; do python3 monter2.py plan${n}3.json r${n}3.mp4 > r${n}3.log 2>&1 && bash ~/k2/hybride/finition.sh r${n}3.mp4 f${n}3.mp4 0.35 >> r${n}3.log 2>&1; done
echo done > run3.done
