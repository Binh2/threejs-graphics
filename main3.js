import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import Noise from 'noisejs';
import { MeshPhongMaterial } from 'three';
import { Mesh } from 'three';
import { drawBasicShape } from './1_basic_shapes';
import { addLight } from './5_lighting';
import { getMaterial } from './lib';

var noise = new Noise.Noise(Math.random());

function init() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	// const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);
	const gui = new dat.GUI();
	const clock = new THREE.Clock();

	
	addLight(scene);
	drawBasicShape(scene);

  // // Load cube map
  // var path = '/assets/cubemap/';
  // var format = '.jpg';
  // var urls = [
  //   path + 'posx' + format, path + 'negx' + format,
  //   path + 'posy' + format, path + 'negy' + format,
  //   path + 'posz' + format, path + 'negz' + format,
  // ]
  // var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  // // reflectionCube.format = THREE.RGBFormat;

  // Add textures
  // var loader = new THREE.TextureLoader();
  // var texture = loader.load('/assets/textures/concrete.jpg');
  // planeMaterial.map = texture;
  // planeMaterial.bumpMap = texture;
  // planeMaterial.bumpScale = 0.1;
  // planeMaterial.roughnessMap = texture;
  // planeMaterial.metalness = 0.1;
  // planeMaterial.roughness = 0.7;
	// planeMaterial.envMap = reflectionCube;
  // sphereMaterial.roughnessMap = loader.load('/assets/textures/fingerprint.jpg')
  // sphereMaterial.envMap = reflectionCube;
	// sphereMaterial.roughness = 0.1;
	// sphereMaterial.metalness = 0.5;
	// scene.background = reflectionCube;

  // var maps = ['map', 'bumpMap', 'roughnessMap'];
  // maps.forEach(mapName => {
  //   texture = planeMaterial[mapName];
  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  //   texture.repeat.set(15, 15);
  // });
  

	// scene.add(sphere);
  // scene.add(plane);

	let menu = {
		select: true,
		point: false,
		line: false,
		solid: false,
	}
	let folder1 = gui.addFolder('Draw');
	folder1.add(menu, "select").name("select").listen().onChange(() => menuChanged(menu, "select"));
	folder1.add(menu, "point").name("point").listen().onChange(() => menuChanged(menu, "point"));
	folder1.add(menu, "line").name("line").listen().onChange(() => menuChanged(menu, "line"));
	folder1.add(menu, "solid").name("solid").listen().onChange(() => menuChanged(menu, "solid"));
	folder1.open()
  // var folder2  = gui.addFolder('light_2');
  // folder2.add(lightRight, 'intensity', 0, 10);
  // folder2.add(lightRight.position, 'x', -5, 15);
  // folder2.add(lightRight.position, 'y', -5, 15);
  // folder2.add(lightRight.position, 'z', -5, 15);

	camera.position.x = 3;
	camera.position.y = 6;
	camera.position.z = 15;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor('rgb(120, 120, 120)');
	document.body.appendChild( renderer.domElement );

	// var controls = new OrbitControls(camera, renderer.domElement);
	let controls = null;
	
	update(renderer, scene, camera, controls, clock);
	
	return scene;
}
// window.addEventListener("click", stopDraw);
function update(renderer, scene, camera, controls, clock) {
	renderer.render( scene, camera );
	// controls.update();	
	TWEEN.update();

	var timeElapsed = clock.getElapsedTime();

	// var cameraZRotation = scene.getObjectByName('cameraZRotation');
	// cameraZRotation.rotation.z = noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02;
	

	requestAnimationFrame( () => update(renderer, scene, camera, controls, clock) );
}

function menuChanged(menu, item) {
	for (let i in menu) {
		menu[i] = false;
	}
	menu[item] = true;
}

var scene = init(); // Can't access for some reason
window.scene = scene; // Can access with window.scene in the browser's console