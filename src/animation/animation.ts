import * as THREE from 'three';

import { getControls } from '../components/controls/controls';

import { getMesh } from './mesh';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const rootElem = document.querySelector('#bg') as HTMLCanvasElement;
const mesh = getMesh();

camera.position.set(0, 1, 5);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({
  canvas: rootElem,
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

function animate() {
  // mesh.rotation.y += 0.001;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
const controls = getControls(camera, rootElem);

window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  controls.update();
  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
