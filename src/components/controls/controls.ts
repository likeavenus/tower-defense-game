import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const getControls = (camera: THREE.Camera, domElement: HTMLElement) => {
  return new OrbitControls(camera, domElement);
};
