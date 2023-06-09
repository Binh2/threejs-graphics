import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import Noise from 'noisejs';

var noise = new Noise.Noise(Math.random());

function init() {
	var isFog = true;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	// const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);
	const gui = new dat.GUI();
	const clock = new THREE.Clock();
	if (isFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.01);
	}
	

	var boxGrid = getBoxGrid(10, 1.5);
	var plane = getPlane(100);
	var directionalLight = getDirectionalLight(1);
	var sphere = getSphere(0.05);
	// var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
	var ambientLight = getAmbientLight(1);

	boxGrid.name = "boxGrid";
	plane.name = "plane-1";
	plane.rotation.x = Math.PI/2;
	directionalLight.position.x = 13;
	directionalLight.position.y = 10;
	directionalLight.position.z = 10;

	// gui.add(directionalLight, 'intensity', 0, 10);
	// gui.add(directionalLight.position, 'x', 0, 20);
	// gui.add(directionalLight.position, 'y', 0, 20);
	// gui.add(directionalLight.position, 'z', 0, 20);
	// gui.add(directionalLight, 'penumbra', 0, 1);

	scene.add( boxGrid );
	scene.add( plane );
	directionalLight.add(sphere);
	scene.add(directionalLight);
	// scene.add(helper);
	scene.add(ambientLight);
	

	// camera.position.x = 1;
	// camera.position.y = 2;
	// camera.position.z = 5;
	// camera.lookAt(new THREE.Vector3(0, 0, 0));

	var cameraZRotation = new THREE.Group();
	var cameraYPosition = new THREE.Group();
	var cameraZPosition = new THREE.Group();
	var cameraXRotation = new THREE.Group();
	var cameraYRotation = new THREE.Group();

	cameraZRotation.add(camera);
	cameraYPosition.add(cameraZRotation)
	cameraZPosition.add(cameraYPosition);
	cameraXRotation.add(cameraZPosition)
	cameraYRotation.add(cameraXRotation);

	cameraZRotation.name = 'cameraZRotation';
	cameraYPosition.name = 'cameraYPosition';
	cameraZPosition.name = "cameraZPosition";
	cameraXRotation.name = "cameraXRotation";
	cameraYRotation.name = "cameraYRotation";

	cameraXRotation.rotation.x = Math.PI/2;
	cameraYPosition.position.y = 1;
	cameraZPosition.position.z = 100;
	// cameraYRotation.rotation.y = 2;

	new TWEEN.Tween({val: 100})
		.to({val: -50}, 12000)
		.onUpdate(({val}) => {
			cameraZPosition.position.z = val;
		})
		.start();

	new TWEEN.Tween({val: -Math.PI/2})
		.to({val: 0}, 6000)
		.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(({val}) => {
			cameraXRotation.rotation.x = val;
		})
		.start();
	
	new TWEEN.Tween({val: 0})
		.to({val: Math.PI/2}, 6000)
		.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(({val}) => {
			cameraYRotation.rotation.y = val;
		})
		.start();
		
	scene.add(cameraYRotation);
	gui.add(cameraZPosition.position, 'z', 0, 100);
	gui.add(cameraXRotation.rotation, 'x', -Math.PI, Math.PI);
	gui.add(cameraYRotation.rotation, 'y', -Math.PI, Math.PI);
	gui.add(cameraZRotation.rotation, 'z', -Math.PI, Math.PI);

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

	var cameraZRotation = scene.getObjectByName('cameraZRotation');
	cameraZRotation.rotation.z = noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02;
	
	// var cameraZPosition = scene.getObjectByName('cameraZPosition');
	// var cameraYRotation = scene.getObjectByName('cameraZRotation');
	
	// cameraZPosition.position.z -= 0.25;
	// if (cameraYRotation > 0) {
	// 	cameraYRotation.rotation -= 0.01;
	// }
	
	var boxGrid = scene.getObjectByName("boxGrid");
	boxGrid.children.forEach((box, index) => {
		var x = timeElapsed + index;
		box.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;
		box.position.y = box.scale.y/2;
	})

	requestAnimationFrame( () => update(renderer, scene, camera, controls, clock) );
}

function getMaterial(type, color = 0xffffff) {
	var materialOptions = {color: color};
	switch (type) {
		case 'basic':
			return new THREE.MeshBasicMaterial(materialOptions);
		case 'lambert':
			return new THREE.MeshLambertMaterial(materialOptions);
		case 'phong':
			return new THREE.MeshPhongMaterial(materialOptions);
		case 'standard':
			return new THREE.MeshStandardMaterial(materialOptions);
	}
}

function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 3, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 3, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}
	group.add(obj);
	group.position.x = -(separationMultiplier * (amount-1) )/2;
	group.position.z = -(separationMultiplier * (amount-1) )/2;
	return group;
}
function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;
	return light;
}
function getSpotLight(intensity) {
	var light = new THREE.SpotLight(0xffffff, intensity);
	light.castShadow = true;
	light.shadow.bias = 0.0001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	return light;
}
function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.camera.left = -40;
	light.shadow.camera.right = 40;
	light.shadow.camera.bottom = -40;
	light.shadow.camera.top = 40;

	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;

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
function getPlane(size) {
	const geometry = new THREE.PlaneGeometry(size, size);
	const material = new THREE.MeshPhongMaterial( { 
		color: 'rgb(120, 120, 120)',
		side: THREE.DoubleSide 
	} );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.receiveShadow = true;
	return mesh
}
function getSphere(size) {
	const geometry = new THREE.SphereGeometry( size, 24, 24 );
	const material = new THREE.MeshBasicMaterial( { 
		color: 'rgb(255, 255, 255)',
	} );
	const mesh = new THREE.Mesh( geometry, material );
	
	return mesh
}

var scene = init(); // Can't access for some reason
window.scene = scene; // Can access with window.scene in the browser's console