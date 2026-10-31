/* --- Champ de points « Signal » (hero) --- */
(()=>{const c=document.getElementById('lake');if(!c)return;const x=c.getContext('2d');const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W,H,dpr,mx=-9999,my=-9999,t=0,vis=true;const G=26;
function size(){dpr=Math.min(devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);if(RM)draw()}
function draw(){x.clearRect(0,0,W,H);
 for(let y=G/2;y<H;y+=G)for(let px=G/2;px<W;px+=G){
  const w=Math.sin((px+y)*.011-t*1.1)*.5+.5,d=Math.hypot(px-mx,y-my),h=Math.max(0,1-d/170);
  x.globalAlpha=Math.min(1,.07+w*.16+h*.55);x.fillStyle=h>.05?'#8B9BFF':'#5D6FD9';
  x.beginPath();x.arc(px,y,.7+w*1.4+h*2,0,6.283);x.fill()}
 x.globalAlpha=1}
function loop(){if(vis){t+=.016;draw()}requestAnimationFrame(loop)}
size();addEventListener('resize',size);
const hero=c.parentElement;hero.addEventListener('pointermove',e=>{const b=c.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top});hero.addEventListener('pointerleave',()=>{mx=my=-9999});
new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(c);
if(RM)draw();else loop();})();
