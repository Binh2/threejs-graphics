import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import Noise from 'noisejs';

var noise = new Noise.Noise(Math.random());

function init() {
	var isFog = false;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	// const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);
	const gui = new dat.GUI();
	const clock = new THREE.Clock();
	if (isFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.01);
	}

  var sphereMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
	var sphere = getSphere(sphereMaterial, 1, 24);

  var planeMaterial = getMaterial('standard', 'rgb(255, 255, 255)', THREE.DoubleSide);
  var plane = getPlane(planeMaterial, 300);

  var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
  var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');

  sphere.position.y = sphere.geometry.parameters.radius;
  plane.rotation.x = Math.PI/2;

  lightLeft.position.x = -5;
  lightLeft.position.y = 2;
  lightLeft.position.z = -4;

  lightRight.position.x = 5;
  lightRight.position.y = 2;
  lightRight.position.z = -4;

  // Load cube map
  var path = '/assets/cubemap/';
  var format = '.jpg';
  var urls = [
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format,
  ]
  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  // reflectionCube.format = THREE.RGBFormat;

  // Add textures
  var loader = new THREE.TextureLoader();
  var texture = loader.load('/assets/textures/concrete.jpg');
  planeMaterial.map = texture;
  planeMaterial.bumpMap = texture;
  planeMaterial.bumpScale = 0.1;
  planeMaterial.roughnessMap = texture;
  planeMaterial.metalness = 0.1;
  planeMaterial.roughness = 0.7;
	planeMaterial.envMap = reflectionCube;
  sphereMaterial.roughnessMap = loader.load('/assets/textures/fingerprint.jpg')
  sphereMaterial.envMap = reflectionCube;
	sphereMaterial.roughness = 0.1;
	sphereMaterial.metalness = 0.5;
	scene.background = reflectionCube;

  var maps = ['map', 'bumpMap', 'roughnessMap'];
  maps.forEach(mapName => {
    texture = planeMaterial[mapName];
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15, 15);
  });
  

	scene.add(sphere);
  scene.add(plane);
  scene.add(lightLeft);
  scene.add(lightRight);

  var folder1  = gui.addFolder('light_1');
  folder1.add(lightLeft, 'intensity', 0, 10);
  folder1.add(lightLeft.position, 'x', -5, 15);
  folder1.add(lightLeft.position, 'y', -5, 15);
  folder1.add(lightLeft.position, 'z', -5, 15);

  var folder2  = gui.addFolder('light_2');
  folder2.add(lightRight, 'intensity', 0, 10);
  folder2.add(lightRight.position, 'x', -5, 15);
  folder2.add(lightRight.position, 'y', -5, 15);
  folder2.add(lightRight.position, 'z', -5, 15);

  // console.log(sphereMaterial.shininess);
  // console.log(sphereMaterial);
  var folder3 = gui.addFolder('materials');
  folder3.add(sphereMaterial, 'roughness', 0, 1);
  folder3.add(planeMaterial, 'roughness', 0, 1);
  folder3.add(sphereMaterial, 'metalness', 0, 1);
  folder3.add(planeMaterial, 'metalness', 0, 1);
  // folder3.open();

	camera.position.x = 3;
	camera.position.y = 6;
	camera.position.z = 15;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor('rgb(120, 120, 120)');
	document.body.appendChild( renderer.domElement );

	var controls = new OrbitControls(camera, renderer.domElement);
	
	update(renderer, scene, camera, controls, clock);
	
	return scene;
}
function update(renderer, scene, camera, controls, clock) {
	renderer.render( scene, camera );
	controls.update();
	TWEEN.update();

	var timeElapsed = clock.getElapsedTime();

	// var cameraZRotation = scene.getObjectByName('cameraZRotation');
	// cameraZRotation.rotation.z = noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02;
	

	requestAnimationFrame( () => update(renderer, scene, camera, controls, clock) );
}

function getMaterial(type, color = 'rgb(255, 255, 255)', side = THREE.FrontSide) {
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
function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;
	return light;
}
function getSpotLight(intensity, color) {
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;
	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;

  light.add(getSphere(getMaterial('basic', color), 0.1));

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

  light.add(getSphere(getMaterial('basic', color), 0.1));

	return light;
}
function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
	// light.castShadow = true;
	return light;
}
function getBox(w, h, d) {
	const geometry = new THREE.BoxGeometry( w, h, d );
	const material = new THREE.MeshPhongMaterial( { 
		color: 'rgb(120, 120, 120)',
	} );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	return mesh
}
function getPlane(material, size) {
	const geometry = new THREE.PlaneGeometry(size, size);
	const mesh = new THREE.Mesh( geometry, material );
	mesh.receiveShadow = true;
	return mesh
}
function getSphere(material, size, segments) {
	const geometry = new THREE.SphereGeometry( size, segments, segments );
	const mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;
	
	return mesh
}

var scene = init(); // Can't access for some reason
window.scene = scene; // Can access with window.scene in the browser's console