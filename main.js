import * as THREE from 'three';

function init() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var cube = getCube(1,1,1);
	cube.position.y = cube.geometry.parameters.height / 2;

	var plane = getPlane(4);
	plane.rotation.x = Math.PI/2;

	scene.add( cube );
	scene.add( plane );

	camera.position.x = 1;
	camera.position.y = 2;
	camera.position.z = 5;

	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	renderer.render(scene, camera);
	// function animate() {
	// 	requestAnimationFrame( animate );
	// 	renderer.render( scene, camera );
	// }
	// animate();
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

init();