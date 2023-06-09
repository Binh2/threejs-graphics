import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from "three"
import { getMaterial, getSphere } from './lib';
import { scene, gui } from './global'

export function drawBasicShape() {
  var box = getBox(1, 3, 1);
	var sphere = getSphere(1);
	var cone = getCone(1, 2);
	var cylinder = getCylinder(1, 2);
	var donut = getDonut(1, 0.5);
	box.position.x = -10;
	sphere.position.x = -7.5;
	cone.position.x = -5;
	cylinder.position.x = -2.5;
	donut.position.x = 0.5;
	scene.add(box)
	scene.add(sphere)
	scene.add(cone)
	scene.add(cylinder)
	scene.add(donut)

	loadFBX(scene, "/objects/truck_wheels_front_v2.fbx", new THREE.Vector3(3, 0, 0), 2, 'wheel');
  loadFBX(scene, "/objects/teapot_s0.fbx", new THREE.Vector3(4.5, -0.5, 0), 0.1, 'teapot');
  loadFBX(scene, "/objects/Ginger_Bread_Cookies_FBX.fbx", new THREE.Vector3(9.5, -1, 0), 0.2, 'gingerBread');
  return {
    box,
    sphere,
    cone,
    cylinder,
    donut,
  }
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
function getCone(r, h, material = getMaterial('standard')) {
	const geometry = new THREE.ConeGeometry(r, h, 32);
	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	
	return mesh
}
function getCylinder(r, h, material = getMaterial('standard')) {
	const geometry = new THREE.CylinderGeometry(r, r, h);
	const mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;

	return mesh;
}
function getDonut(r1, r2, material = getMaterial('standard')) {
	const geometry = new THREE.TorusGeometry(r1, r2);
	const mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;

	return mesh;
}

function loadFBX(scene, filename, position, scale, name = '') {
  new FBXLoader().load(filename, group => {
		group.scale.x = scale;
		group.scale.y = scale;
		group.scale.z = scale;
		group.position.x = position.x;
    group.position.y = position.y;
    group.position.z = position.z;
		// console.log(group)
		group.castShadow = true
		group.traverse(obj => obj.castShadow = true)
		group.name = name
		scene.add(group);
		window.dispatchEvent(new CustomEvent("objectLoaded", { detail: {
			name,
			object: group,
	 }}))
	})
}