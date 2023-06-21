import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import Noise from 'noisejs';
import { MeshPhongMaterial } from 'three';
import { Mesh } from 'three';
import { drawBasicShape } from './1_basic_shapes';
import { addLight } from './5_lighting';
import { getMaterial } from './lib';
import { userDraw } from './2_user_draw';
import { textureMapping } from './6_texture';
import { scene, camera, gui, clock, renderer, controls } from './global';
import { perspectiveProjection } from './3_perspective_projection';

var noise = new Noise.Noise(Math.random());

var transformationType = 'Translation';
var transformationValue = 0;

function init() {
	// const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);
	renderer.shadowMap.enabled = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor('rgb(120, 120, 120)');
	document.body.appendChild( renderer.domElement );

	let {box,sphere,cone,cylinder,donut} = drawBasicShape(); // 1
	userDraw(); // 2
  perspectiveProjection();
	addLight(); // 5
  textureMapping(); // 6
	
	camera.position.x = 3;
	camera.position.y = 6;
	camera.position.z = 15;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

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



init(); // Can't access for some reason
window.scene = scene; // Can access with window.scene in the browser's console
