import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { scene, camera, gui, clock, renderer, controls } from './global';
import { drawBasicShape } from './1_basic_shapes';
import { userDraw } from './2_user_draw';
import { perspectiveProjection } from './3_perspective_projection';
import { transformation } from './4_transformation';
import { addLight } from './5_lighting';
import { textureMapping } from './6_texture';
import { animation } from './7_animation';

let tweens;
function init() {
	// const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);
	renderer.shadowMap.enabled = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor('rgb(120, 120, 120)');
	document.body.appendChild( renderer.domElement );

	let { box, sphere, cone, cylinder, donut } = drawBasicShape(); // 1
	userDraw(); // 2
  perspectiveProjection(); // 3
	transformation(box, sphere, cone, cylinder, donut); // 4
	addLight(); // 5
  textureMapping(); // 6
	tweens = animation(box, sphere, cone, cylinder, donut) // 7
	
	camera.position.x = 3;
	camera.position.y = 6;
	camera.position.z = 15;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

  update(renderer, scene, camera, controls, clock);
	return scene;
}

function update(renderer, scene, camera, controls, clock) {
	var timeElapsed = clock.getElapsedTime();
	renderer.render(scene, camera);
	controls.update();
	TWEEN.update();
	Object.values(tweens).forEach((tween) => tween.update())

	requestAnimationFrame(() => update(renderer, scene, camera, controls, clock));
}

init(); // Can't access for some reason
window.scene = scene; // Can access with window.scene in the browser's console
