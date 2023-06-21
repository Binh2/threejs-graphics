import * as THREE from 'three';
import { scene, camera, gui, controls } from './global'
import { getSphere } from './lib';

let offset = {
  x: 0,
  y: 0,
  z: 0
};
export function userDraw() {
  let menu = {
		select: true,
		point: false,
		line: false,
		solid: false,
	}
  let folder1 = gui.addFolder('Draw');
	folder1.add(menu, "select").name("select").listen().onChange(() => menuChanged(scene, menu, camera, "select", controls));
	folder1.add(menu, "point").name("point").listen().onChange(() => menuChanged(scene, menu, camera, "point", controls));
	folder1.add(menu, "line").name("line").listen().onChange(() => menuChanged(scene, menu, camera, "line", controls));
	folder1.add(menu, "solid").name("solid").listen().onChange(() => menuChanged(scene, menu, camera, "solid", controls));
	folder1.open()
  // let folder2 = gui.addFolder('Offset');
  // folder2.add(offset, 'x', -1, 1)
  // folder2.add(offset, 'y', -1, 1)
  // folder2.add(offset, 'z', -1, 1)
  // folder2.open();
}

function menuChanged(scene, menu, camera, item, controls) {
	for (let i in menu) {
		menu[i] = false;
	}
  controls.enabled = false;
  window.removeEventListener("mousedown", mouseDownForPoint)
  window.removeEventListener("mousemove", mouseMoveForPoint)
  window.removeEventListener("mouseup", mouseUpForPoint)
  window.removeEventListener("mousedown", mouseDownForLine);
  window.removeEventListener("mousemove", mouseMoveForLine)
  window.removeEventListener("mouseup", mouseUpForLine)
  window.removeEventListener("mousedown", mouseDownForCube);
  window.removeEventListener("mousemove", mouseMoveForCube)
  window.removeEventListener("mouseup", mouseUpForCube)
	menu[item] = true;
  if (menu["select"]) {
    controls.enabled = true;
  } else if (menu["point"]) {
    window.addEventListener("mousedown", mouseDownForPoint)
    window.addEventListener("mousemove", mouseMoveForPoint)
    window.addEventListener("mouseup", mouseUpForPoint)
  } else if (menu["line"]) {
    window.addEventListener("mousedown", mouseDownForLine)
    window.addEventListener("mousemove", mouseMoveForLine)
    window.addEventListener("mouseup", mouseUpForLine)
  } else if (menu["solid"]) {
    window.addEventListener("mousedown", mouseDownForCube)
    window.addEventListener("mousemove", mouseMoveForCube)
    window.addEventListener("mouseup", mouseUpForCube)
  }
}
function getPos(event) {
  const width = window.screen.width;
  const height = window.screen.height;
  const x = (event.clientX / width) * 2 - 1;
  const y = (event.clientY / height) * 2 - 1;
  console.log({x, y})
  // console.log({width, height})
  let pos = new THREE.Vector3(x + offset.x, -y + offset.y, offset.z).unproject( camera);
  return pos;
}
let pos1, pos2, isPressedDown, prevPoint, prevLine, prevCube;
function mouseDownForPoint(event) {
  isPressedDown = true;
}
function mouseMoveForPoint(event) {
  if (!isPressedDown) { scene.remove(prevPoint); }
  pos1 = getPos(event);
  prevPoint = drawPoint(pos1)
}
function mouseUpForPoint(event) {
  isPressedDown = false;
}
function mouseDownForLine(event) {
  pos1 = getPos(event);
  // isPressedDown = true;
}
function mouseMoveForLine(event) {
  if (!isPressedDown) { scene.remove(prevLine); }
  pos2 = getPos(event)
  prevLine = drawLine(pos1, pos2)
}
function mouseUpForLine(event) {
  pos2 = getPos(event);
  isPressedDown = false;
  prevLine = drawLine(pos1, pos2)
  pos1 = null;
}

function mouseDownForCube(event) {
  pos1 = getPos(event);
  // isPressedDown = true;
}
function mouseMoveForCube(event) {
  if (!isPressedDown) { scene.remove(prevCube); }
  pos2 = getPos(event)
  prevCube = drawCube(pos1, pos2)
}
function mouseUpForCube(event) {
  pos2 = getPos(event);
  isPressedDown = false;
  prevCube = drawCube(pos1, pos2)
  pos1 = null;
}
function drawPoint(pos1) {
  const sphere = getSphere(0.01);
  sphere.position.x = pos1.x;
  sphere.position.y = pos1.y;
  sphere.position.z = pos1.z;
  scene.add(sphere)
  return sphere;
}
function drawLine(pos1, pos2) {
  if (!pos1 || !pos2) return;
  const material = new THREE.LineBasicMaterial({color: 0xff0000});
  const points = [];
  points.push( pos1 );
  points.push( pos2 );
  
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const line = new THREE.Line( geometry, material );
  scene.add(line)
  return line;
}
function drawCube(pos1, pos2) {
  if (!pos1 || !pos2) return;
  const width = distanceVector(pos1, pos2)
  const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
  const geometry = new THREE.BoxGeometry(width, width, width);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = pos1.x;
  mesh.position.y = pos1.y;
  mesh.position.z = pos1.z;
  // mesh.castShadow = true;
  scene.add(mesh);
  return mesh;
}
function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}