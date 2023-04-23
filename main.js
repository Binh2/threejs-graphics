import * as THREE from 'three';

function init() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xffffff);
	document.body.appendChild( renderer.domElement );

	scene.fog = new THREE.FogExp2(0xffffff, 0.2);

	var cube = getCube(1,1,1);
	var plane = getPlane(20);

	plane.name = "plane-1";
	cube.name = "cube-1";
	cube.position.y = cube.geometry.parameters.height / 2;
	plane.rotation.x = Math.PI/2;

	scene.add( cube );
	scene.add( plane );

	camera.position.x = 1;
	camera.position.y = 2;
	camera.position.z = 5;

	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	update(renderer, scene, camera);
	
	return scene;
}
function update(renderer, scene, camera) {
	requestAnimationFrame( () => update(renderer, scene, camera) );

	// var plane = scene.getObjectByName("plane-1");
	var cube = scene.getObjectByName("cube-1");
	cube.rotation.x += 0.001;
	cube.scale.x += 0.001;
	cube.position.y += 0.001;
	renderer.render( scene, camera );
}

function getCube(w, h, d) {
	const geometry = new THREE.BoxGeometry( w, h, d );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	const mesh = new THREE.Mesh( geometry, material );
	return mesh
}
function getPlane(size) {
	const geometry = new THREE.PlaneGeometry(size, size);
	const material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
	const mesh = new THREE.Mesh( geometry, material );
	return mesh
}

var scene = init(); // Can't access for some reason
window.scene = scene; // Can access with window.scene in the browser's console