import { scene, gui } from "./global";

var transformationType = 'Translation';
var transformationValue = 0;

export function transformation(box,sphere,cone,cylinder,donut) {
	document.addEventListener('keydown', handleKeyPress);

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