# sample.py <dense.json> <kind:in|glide|entry> <N> <out.json> : N positions p du parcours, espacées en mouvement égal (plist) puis cadencées en temps (ease)
import json,sys,math
d=json.load(open(sys.argv[1]));kind=sys.argv[2];N=int(sys.argv[3]);out=sys.argv[4]
sm=lambda x:0 if x<=0 else 1 if x>=1 else x*x*(3-2*x)
def trap(x,ra,rb):   # vitesse en trapèze sur [0,1] : départ sur ra, arrivée sur rb
    v=1/(1-ra/2-rb/2)
    if x<ra: return v*x*x/(2*ra)
    if x<=1-rb: return v*(ra/2+x-ra)
    return 1-v*(1-x)**2/(2*rb)
def ease(t):
    if kind=='in':   # 0,5 s sur le globe (20 % du temps, 6 % du chemin), puis l'arrivée, douce aux deux bouts
        return .06*(t/.2) if t<.2 else .06+.94*trap((t-.2)/.8,.3,.42)
    if kind=='glide': return sm(t)   # symétrique : le clip inverse est le même film à l'envers
    return trap(t,.22,.38)   # l'entrée : la porte, la salle, posé à la fin
ps=[]
for k in range(N):
    f=ease(k/(N-1));i=f*(len(d)-1);j=min(int(i),len(d)-2);a=i-j
    ps.append(round(d[j]+(d[j+1]-d[j])*a,5))
ps[0]=0.0;ps[-1]=1.0
json.dump(ps,open(out,'w'))
