import { gui } from './global'
import * as THREE from 'three';

export function textureMapping() {
  var loader = new THREE.TextureLoader();
  var textureValue = "Texture";
  var textureController = gui.add({ Texture: textureValue }, 'Texture', ["checkerboard", "fingerprint"]);
  textureController.onChange((value) => {
    const texture = loader.load(`./assets/textures/${value}.jpg`);

    applyTextureToObjects(texture);
  })
}
function applyTextureToObjects(texture) {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.material.map = texture;
      object.material.needsUpdate = true;
    }
  });
}