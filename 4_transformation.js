import { renderer, scene, gui, controls, camera } from "./global";
import * as THREE from 'three'

const menu = { normal: true, translate: false, rotate: false, scale: false, skew: false }
const objects = { box: null, sphere: null, cone: null, cylinder: null, donut: null }
export function transformation(box, sphere, cone, cylinder, donut) {
	objects.box = box; objects.sphere = sphere; objects.cone = cone; objects.cylinder = cylinder; objects.donut = donut;
	let folder = gui.addFolder("Affine transformation");
	folder.add(menu, 'normal').name("Normal").listen().onChange(() => menuChanged("normal"))
	folder.add(menu, 'translate').name("Translate").listen().onChange(() => menuChanged("translate"))
	folder.add(menu, 'scale').name("Scale").listen().onChange(() => menuChanged("scale"))
	folder.add(menu, 'rotate').name("Rotate").listen().onChange(() => menuChanged("rotate"))
	folder.add(menu, 'skew').name("Skew").listen().onChange(() => menuChanged("skew"))	
}

function menuChanged(value) {
	for (let i in menu) menu[i] = false;
	menu[value] = true;
	controls.enabled = false;
	window.removeEventListener("mousedown", mouseDown);
	window.removeEventListener("mousemove", mouseMoveForTranslate)
	window.removeEventListener('mousemove', mouseMoveForScale);
	window.removeEventListener("mousemove", mouseMoveForRotate);
	window.removeEventListener("mousemove", mouseMoveForSkew);
	window.removeEventListener("mouseup", mouseUp);

	window.removeEventListener('keydown', keyDownForTranslate)
	window.removeEventListener('keydown', keyDownForRotate)
	window.removeEventListener('keydown', keyDownForScale);
	window.removeEventListener('keydown', keyDownForSkew);

	if (!menu['normal']) {
		window.addEventListener("mousedown", mouseDown);
		window.addEventListener("mouseup", mouseUp);
	}
	if (menu['normal']) controls.enabled = true;
	else if (menu['translate']) { 
		window.addEventListener("mousemove", mouseMoveForTranslate);
		window.addEventListener("keydown", keyDownForTranslate)
	} 
	else if (menu['rotate']) { 
		window.addEventListener("mousemove", mouseMoveForRotate); 
		window.addEventListener('keydown', keyDownForRotate);
	}
	else if (menu['scale']) { 
		window.addEventListener("mousemove", mouseMoveForScale) 
		window.addEventListener('keydown', keyDownForScale)
	}
	else if (menu['skew']) { 
		window.addEventListener('mousemove', mouseMoveForSkew) 
		window.addEventListener('keydown', keyDownForSkew)
	}
}

function getPos(event) {
  const width = window.screen.width;
  const height = window.screen.height;
  const x = (event.clientX / width) * 2 - 1;
  const y = (event.clientY / height) * 2 - 1;
	return {x, y};
}
let pos1, pos2, isPressedDown
function mouseDown(event) {
  pos1 = getPos(event);
  isPressedDown = true;
}
function mouseMove(event, callback) {
	if (!isPressedDown) return;
  pos2 = getPos(event)
	const scale = 5;
	callback((pos2.x - pos1.x) * scale, (pos2.y - pos1.y) * scale);
	pos1 = pos2;
}
function mouseUp(event) {
  isPressedDown = false;
}
function translate(dx, dy) {
	console.log('hello')
	for (let objectName in objects) {
		const object = objects[objectName];
		object.position.x += dx;
		object.position.y -= dy;
	}
}
function rotate(dx, dy) {
	for (let objectName in objects) {
		const object = objects[objectName];
		object.rotation.y += dx;
		object.rotation.x += dy;
	}
}
function scale(dx, dy) {
	for (let objectName in objects) {
		const object = objects[objectName];
		object.scale.x += dx;
		object.scale.y -= dy;
	}
}
let prevMatrix;
function skew(dx, dy) {
	console.log(objects.box)
	const scale = 1
	const matrix = new THREE.Matrix4();
	matrix.makeShear(-dy * scale, 0, dx * scale,0,0,0)
	
	for (let objectName in objects) {
		const object = objects[objectName];
		const pos = { x: object.position.x, y: object.position.y, z: object.position.z };
		object.applyMatrix4(new THREE.Matrix4().makeTranslation(-pos.x, -pos.y, -pos.z))
		object.applyMatrix4(matrix);
		object.applyMatrix4(new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z))
	}
	prevMatrix = matrix
}

const mouseMoveForTranslate = (event) => mouseMove(event, translate);
const mouseMoveForRotate = event => mouseMove(event, rotate);
const mouseMoveForScale = event => mouseMove(event, scale);
const mouseMoveForSkew = event => mouseMove(event, skew);

let timer = null;
const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
function keyDown(event, callback) {
	const scale = 0.2;
	if (event.keyCode == LEFT) callback(-scale, 0);
	if (event.keyCode == UP) callback(0, -scale);
	if (event.keyCode == RIGHT) callback(scale, 0);
	if (event.keyCode == DOWN) callback(0, scale);
}
const keyDownForTranslate = event => keyDown(event, translate)
const keyDownForRotate = event => keyDown(event, rotate);
const keyDownForScale = event => keyDown(event, scale);
const keyDownForSkew = event => keyDown(event, skew);