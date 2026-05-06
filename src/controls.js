import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { computer_state } from './objects.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as ANIMATIONS from './animations.js';

//adding Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

//variable for ensuring no items are visibly being examined right now
let examining = false;

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
            case 'SM_Monitor_M_Monitor_0':
                //Use corresponding animation to which state we are in
                if(examining){
                    ANIMATIONS.ReturnObject(computer_state);
                    controls.enabled = true;
                }else{
                    ANIMATIONS.ExamineComputer();
                    controls.enabled = false;
                }
                examining = !examining;
                break;
            case 'defaultMaterial':
                ANIMATIONS.PunchBag();
                break;
            default:
                console.log('Item clicked:' + intersects[0].object.name);
                break;
        }
    }
});

export {controls};