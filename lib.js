import * as THREE from 'three';

export function getSphere(size, segments = 24, material = getMaterial('standard', 'rgb(255, 255, 255)')) {
	const geometry = new THREE.SphereGeometry( size, segments, segments );
	const mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;
	
	return mesh
}
export function getMaterial(type, color = 'rgb(255, 255, 255)', side = THREE.FrontSide) {
	var materialOptions = {
    color: color,
    side: side,
  };
	switch (type) {
		case 'basic':
			return new THREE.MeshBasicMaterial(materialOptions);
		case 'phong':
			return new THREE.MeshLambertMaterial(materialOptions);
		case 'phong':
			return new THREE.MeshPhongMaterial(materialOptions);
		case 'standard':
			return new THREE.MeshStandardMaterial(materialOptions);
	}
  return new THREE.MeshBasicMaterial(materialOptions);
}