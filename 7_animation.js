import * as TWEEN from '@tweenjs/tween.js'
import { gui, camera } from './global'
import { Tween } from '@tweenjs/tween.js';

const toggle = { animation: false };
let objects, tweens = {};
export function animation(box, sphere, cone, cylinder, donut) {
  objects = { box, sphere, cone, cylinder, donut };
  window.addEventListener("objectLoaded", (e) => {
    objects[e.detail.name] = e.detail.object
    initCameraTween(20)
    initObjectsTween(5, 4 * Math.PI);
  })
  initCameraTween(20)
  initObjectsTween(5, 4 * Math.PI)
  gui.add(toggle, 'animation').name('Animation').onChange(toggleChanged);
  return tweens;
}
function initSlowObject(name) {
  const object = scene.getObjectByName(name)
  if (object) objects[name] = object
  return object;
}

function toggleChanged() {
  if (toggle.animation) {
    Object.values(tweens).forEach((tween) => tween.start())
  } else {
    Object.values(tweens).forEach((tween) => tween.stop())
  }
}
let cameraDuration = 1000
function getCameraQuarterTween(startPos, toPos, delay = 0) {
  const pos = { ...startPos }
  return new TWEEN.Tween(pos, false)
  .to(toPos, cameraDuration)
  .delay(delay)
  // .easing(TWEEN.Easing.Linear.None)
  .onUpdate(() => {
    camera.position.set(pos.x, pos.y, pos.z)
  })
}
function initCameraTween(r) {
  const y = camera.position.y;
  const pos1 = { x: 0, y, z: r}
  const pos2 = { x: r, y, z: 0}
  const pos3 = { x: 0, y, z: -r}
  const pos4 = { x: -r, y, z: 0}
  tweens.camera1 = getCameraQuarterTween(pos1, pos2)
  tweens.camera2 = getCameraQuarterTween(pos2, pos3, cameraDuration)
  tweens.camera3 = getCameraQuarterTween(pos3, pos4, cameraDuration * 2)
  tweens.camera4 = getCameraQuarterTween(pos4, pos1, cameraDuration * 3)
}
let objectDuration = 500;
function initObjectsTween(h, angle = 2 * Math.PI) {
  let count = 0;
  Object.keys(objects).forEach((objectName) => {
    const object = objects[objectName]
    tweens[objectName + "_jump"] = new TWEEN.Tween(object.position, false)
    .to({y: h}, objectDuration)
    .delay(count * objectDuration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .yoyo(true)
    .repeat(1)
    .repeatDelay(0)
    tweens[objectName + "_flip"] = new TWEEN.Tween(object.rotation, false)
    .to({x: angle}, objectDuration)
    .delay((count + 0.5) * objectDuration)
    count++;
  })
}