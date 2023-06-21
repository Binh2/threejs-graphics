import * as THREE from 'three'
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, gui, clock, renderer, controls;
if (!scene) scene = new THREE.Scene();
if (!camera) camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
if (!gui) gui = new dat.GUI();
if (!clock) clock = new THREE.Clock();
if (!renderer) renderer = new THREE.WebGLRenderer();
if (!controls) controls = new OrbitControls(camera, renderer.domElement);

export { scene, camera, gui, clock, renderer, controls };