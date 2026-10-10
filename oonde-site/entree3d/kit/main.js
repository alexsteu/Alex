// Le moteur de rendu des entrées 3D. ?scene=restaurant&w=1280&h=800&ss=2
// window.frame(p) dessine le point p (0 → 1) du parcours et renvoie la position des enseignes (pins) à l'écran.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from './UnrealBloomPassF.js'; // copie en FloatType : SwiftShader gère mal le HalfFloat
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import * as kit from './kit.js';

const q = new URLSearchParams(location.search);
const W = +q.get('w') || 1280, H = +q.get('h') || 800, SS = +q.get('ss') || 1;
const renderer = new THREE.WebGLRenderer({ antialias: SS < 2, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1); renderer.setSize(W * SS, H * SS);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = +q.get('exp') || 1;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
kit.init(renderer);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 400);
const mod = await import(`../scenes/${q.get('scene') || 'restaurant'}.js`);
const S = await mod.default({ THREE, kit, scene, camera, portrait: H > W });
await kit.ready();
await S.after?.();
if (S.exposure && !q.get('exp')) renderer.toneMappingExposure = S.exposure;

const composer = new EffectComposer(renderer);
composer.setPixelRatio(1); composer.setSize(W * SS, H * SS);
composer.addPass(new RenderPass(scene, camera));
if (q.get('ao') !== '0') {
  const ao = new GTAOPass(scene, camera, W * SS, H * SS);
  ao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 16 });
  ao.blendIntensity = S.ao ?? 0.85; composer.addPass(ao);
}
// Un pixel NaN (normale dégénérée d'un modèle) deviendrait une tache blanche dans le halo : on les remet à zéro avant
composer.addPass(new ShaderPass({ uniforms: { tDiffuse: { value: null } },
  vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `uniform sampler2D tDiffuse;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);
  if(!(c.r==c.r)||!(c.g==c.g)||!(c.b==c.b)||c.r>1e4||c.g>1e4||c.b>1e4)c=vec4(0.,0.,0.,1.);gl_FragColor=vec4(min(c.rgb,vec3(5.)),c.a);}` }));
const bloom = new UnrealBloomPass(new THREE.Vector2(W * SS, H * SS), S.bloom?.[0] ?? 0.45, S.bloom?.[1] ?? 0.55, S.bloom?.[2] ?? 0.9);
if (q.get('bloom') !== '0') composer.addPass(bloom);
composer.addPass(new OutputPass());
// Grain léger et vignettage : l'image a l'air filmée, pas calculée
const fin = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, uT: { value: 0 }, uV: { value: S.vignette ?? 0.32 } },
  vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `uniform sampler2D tDiffuse;uniform float uT,uV;varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+uT)*43758.5453);}
  void main(){vec4 c=texture2D(tDiffuse,vUv);vec2 d=vUv-.5;c.rgb*=1.-uV*dot(d,d)*2.2;c.rgb+=(h(vUv*913.)-.5)*.018;gl_FragColor=c;}`
});
composer.addPass(fin);

const ray = new THREE.Raycaster();
const occluders = [];
scene.traverse(o => { if (o.isMesh && !o.userData.noOcclude && !(o.material && o.material.transparent)) occluders.push(o); });
function project(v) { const p = v.clone().project(camera); return [(p.x + 1) / 2, (1 - p.y) / 2, p.z]; }
function visible(pt) {
  const dir = pt.clone().sub(camera.position); const d = dir.length(); dir.normalize();
  ray.set(camera.position, dir); ray.far = d - 0.04;
  return ray.intersectObjects(occluders, false).length === 0;
}
window.frame = (p) => {
  kit.camAt(camera, S.path, p, S.fov);
  S.update?.(p, camera);
  camera.updateMatrixWorld(); fin.uniforms.uT.value = p * 37.1;
  composer.render();
  const pins = (S.pins || []).map(pin => {
    const c = pin.corners.map(project);
    const front = c.every(x => x[2] < 1 && x[2] > -1);
    let vis = 0;
    if (front) {
      const [a, b, cc, d] = pin.corners; const pts = [a, b, cc, d].map(x => x.clone().lerp(new THREE.Vector3().addVectors(a, cc).multiplyScalar(.5), .15));
      pts.push(new THREE.Vector3().addVectors(a, cc).multiplyScalar(.5));
      vis = pts.filter(visible).length / pts.length;
    }
    return { id: pin.id, c: c.map(x => [+x[0].toFixed(5), +x[1].toFixed(5)]), vis: +vis.toFixed(2) };
  });
  return { pins };
};
window.SCENE = scene; window.CAM = camera;
window.READY = true;
