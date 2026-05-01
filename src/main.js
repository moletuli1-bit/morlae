import * as THREE from 'three';
import {scene, renderer, camera} from './scene.js';
import {controls} from './controls.js';
import './objects.js';

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}
animate();