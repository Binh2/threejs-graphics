import { getMaterial, getSphere } from "./lib";
import * as THREE from 'three';

export function addLight(scene) {
  var spotLight = getSpotLight(1, 'rgb(255, 220, 180)');
  let pointLight = getPointLight(0.5)
  let ambientLight = getAmbientLight(0.1);
  let directionalLight = getDirectionalLight(0.3);
  let plane = getPlane(getMaterial('standard', 'white', THREE.DoubleSide), 20);
  spotLight.position.x = -5;
  spotLight.position.y = 2;
  spotLight.position.z = -4;
  pointLight.position.x = 5;
  pointLight.position.y = 2;
  pointLight.position.z = -4;
  plane.position.y = -2;
  plane.rotateX(Math.PI / 2)
	scene.add(spotLight);
  scene.add(pointLight);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(plane);
}
function getPlane(material, size) {
	const geometry = new THREE.PlaneGeometry(size, size);
	const mesh = new THREE.Mesh( geometry, material );
	mesh.receiveShadow = true;
	return mesh
}
function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;
  light.add(getSphere(0.1, 10, getMaterial('basic')))
	return light;
}
function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
	// light.castShadow = true;
	return light;
}
function getDirectionalLight(intensity, color) {
	var light = new THREE.DirectionalLight(color, intensity);
	light.castShadow = true;

	light.shadow.camera.left = -40;
	light.shadow.camera.right = 40;
	light.shadow.camera.bottom = -40;
	light.shadow.camera.top = 40;

	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;

  light.add(0.1, 10, getSphere(getMaterial('basic', color)));

	return light;
}
function getSpotLight(intensity, color) {
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;
	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;

  light.add(getSphere(0.1, 10, getMaterial('basic', color)));

	return light;
}

