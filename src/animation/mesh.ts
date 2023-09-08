import * as THREE from 'three';

export const getMesh = (): THREE.Mesh => {
  const geom = new THREE.BoxGeometry(3, 3);
  const material = new THREE.ShaderMaterial({});
  const mesh = new THREE.Mesh(geom, material);

  return mesh;
};
