import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//adding Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//making items clickable
window.addEventListener('click', (event)=> {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    ray.setFromCamera(mouse, camera);
    const intersects = ray.intersectObjects(scene.children);

    if(intersects.length > 0){
        switch(intersects[0].object.name){
            case 'computer':
                AnimateComputer();
                break;
            default:
                break;
        }
    }
});

export {controls};