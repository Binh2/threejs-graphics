import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import Noise from 'noisejs';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MeshPhongMaterial } from 'three';
import { Mesh } from 'three';

var noise = new Noise.Noise(Math.random());

var transformationType = 'Translation';
var transformationValue = 0;
var loader = new THREE.TextureLoader();
const gui = new dat.GUI();

function init() {
	var isFog = false;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	// const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);

	const clock = new THREE.Clock();
	if (isFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.01);
	}

	const concrete = loader.load("./assets/textures/concrete.jpg");
	scene.background = concrete;

	var box = getBox(1, 3, 1);
	var sphere = getSphere(1);
	var cone = getCone(1, 2);
	var cylinder = getCylinder(1, 2);
	var donut = getDonut(1, 0.5);

	box.position.x = -10;
	sphere.position.x = -7.5;
	cone.position.x = -5;
	cylinder.position.x = -2.5;
	donut.position.x = 4.5;
	scene.add(box)
	scene.add(sphere)
	scene.add(cone)
	scene.add(cylinder)
	scene.add(donut)

	new FBXLoader().load("assets/objects/original-wheel.fbx", group => {
		const scale = 2;
		group.scale.x = scale;
		group.scale.y = scale;
		group.scale.z = scale;
		group.position.x = -0.5
		scene.add(group);
	})
	new FBXLoader().load("assets/objects/teapot_s0.fbx", group => {
		const scale = 0.1;
		group.scale.x = scale;
		group.scale.y = scale;
		group.scale.z = scale;
		group.position.x = 1
		group.position.y = -0.5
		scene.add(group);
	})

	new FBXLoader().load("assets/objects/Ginger_Bread_Cookies_FBX.fbx", group => {
		group.position.x = 9.5;
		group.position.y = -1
		const scale = 0.2;
		group.scale.x = scale;
		group.scale.y = scale;
		group.scale.z = scale;
		group.castShadow = true;
		scene.add(group)
	})

	var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
	var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');
	lightLeft.position.x = -5;
	lightLeft.position.y = 2;
	lightLeft.position.z = -4;
	lightRight.position.x = 5;
	lightRight.position.y = 2;
	lightRight.position.z = -4;
	scene.add(lightLeft);
	scene.add(lightRight);

	camera.position.x = 3;
	camera.position.y = 6;
	camera.position.z = 15;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(120, 120, 120)');
	document.body.appendChild(renderer.domElement);

	var controls = new OrbitControls(camera, renderer.domElement);

	// Add controller for scene coordination
	var controller = {
		near: camera.near,
		far: camera.far,
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z,
	};

	var cameraFolder = gui.addFolder("Perform Coordination");
	cameraFolder.add(controller, "near", 1, 100).onChange(function (value) {
		camera.near = value;
		camera.updateProjectionMatrix();
	});
	cameraFolder.add(controller, "far", 100, 1000).onChange(function (value) {
		camera.far = value;
		camera.updateProjectionMatrix();
	});
	cameraFolder.add(controller, "x", -50, 50).onChange(function (value) {
		camera.position.x = value;
	});
	cameraFolder.add(controller, "y", -50, 50).onChange(function (value) {
		camera.position.y = value;
	});
	cameraFolder.add(controller, "z", -50, 50).onChange(function (value) {
		camera.position.z = value;
	});

	// Add controller for selecting transformation type
	var transformationController = gui.add({ Transformation: transformationType }, 'Transformation', ['Translation', 'Scale', 'Shear', 'Rotation']);
	transformationController.onChange(function (value) {
		transformationType = value;
	});

	// Add controller for transformation value
	var transformationValueController = gui.add({ Value: transformationValue }, 'Value', -1, 1, 0.1);
	transformationValueController.onChange(function (value) {
		transformationValue = value;
	});

	// Add event listener for keyboard events
	document.addEventListener('keydown', handleKeyPress);

	update(renderer, scene, camera, controls, clock);

	// Add another update to make the coordination transformation smoother
	update(renderer, scene, camera, controls, clock);

	return scene;
}

function handleKeyPress(event) {
	switch (event.key) {
		case 'ArrowUp':
			applyTransformation(transformationType, transformationValue); // Apply selected transformation
			break;
	}
}

function applyTransformation(type, value) {
	switch (type) {
		case 'Translation':
			scene.position.y += value; // Translate in the Y direction
			break;
		case 'Scale':
			scene.scale.x += value; // Scale in the X direction
			scene.scale.y += value; // Scale in the Y direction
			scene.scale.z += value; // Scale in the Z direction
			break;
		case 'Shear':
			scene.rotation.x += value; // Shear in the X direction
			scene.rotation.y += value; // Shear in the Y direction
			break;
		case 'Rotation':
			scene.rotation.z += value; // Rotate around the Z axis
			break;
	}
}

function update(renderer, scene, camera, controls, clock) {
	renderer.render(scene, camera);
	controls.update();
	TWEEN.update();


	var timeElapsed = clock.getElapsedTime();

	requestAnimationFrame(() => update(renderer, scene, camera, controls, clock));
}

// Add texture
var textureValue = "Texture";
var textureController = gui.add({ Texture: textureValue }, 'Texture', ["checkerboard", "fingerprint"]);
textureController.onChange((value) => {
	const texture = loader.load(`./assets/textures/${value}.jpg`);

	applyTextureToObjects(texture);
})

function applyTextureToObjects(texture) {
	scene.traverse((object) => {
		if (object instanceof THREE.Mesh) {
			object.material.map = texture;
			object.material.needsUpdate = true;
		}
	});
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

	light.add(getSphere(0.1, 10, getMaterial('basic', color)));

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
	const geometry = new THREE.BoxGeometry(w, h, d);
	const material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
	});
	const mesh = new THREE.Mesh(geometry);
	mesh.castShadow = true;
	return mesh;
}

function getPlane(material, size) {
	const geometry = new THREE.PlaneGeometry(size, size);
	const mesh = new THREE.Mesh(geometry);
	mesh.receiveShadow = true;
	return mesh;
}

function getSphere(size, segments = 24, material = getMaterial('standard', 'rgb(255, 255, 255)')) {
	const geometry = new THREE.SphereGeometry(size, segments, segments);
	const mesh = new THREE.Mesh(geometry);
	mesh.castShadow = true;

	return mesh;
}

function getCone(r, h, material = getMaterial('standard')) {
	const geometry = new THREE.ConeGeometry(r, h, 32);
	const mesh = new THREE.Mesh(geometry);
	mesh.castShadow = true;

	return mesh;
}
function getCylinder(r, h, material = getMaterial('standard')) {
	const geometry = new THREE.CylinderGeometry(r, r, h);
	const mesh = new THREE.Mesh(geometry);
	mesh.castShadow = true;

	return mesh;
}
function getDonut(r1, r2, material = getMaterial('standard')) {
	const geometry = new THREE.TorusGeometry(r1, r2);
	const mesh = new THREE.Mesh(geometry);
	mesh.castShadow = true;

	return mesh;
}

var scene = init();
window.scene = scene;