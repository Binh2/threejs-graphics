import { camera, gui } from './global';

export function perspectiveProjection() {
  // Add controller for scene coordination
	var controller = {
		near: camera.near,
		far: camera.far,
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z,
	};

	var cameraFolder = gui.addFolder("Perform Coordination");
	cameraFolder.add(controller, "near", 1, 1000).onChange(function (value) {
    const near = Math.min(camera.far, value);
    controller.near = near;
		camera.near = near;
		camera.updateProjectionMatrix();
	});
	cameraFolder.add(controller, "far", 1, 1000).onChange(function (value) {
    const far = Math.max(camera.near, value);
    controller.far = far;
		camera.far = far;
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
}