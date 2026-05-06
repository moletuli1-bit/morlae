import * as THREE from 'three';
import gsap from 'gsap';
import { camera } from './scene.js';
import { punching_bag_state, computer_state } from './objects.js';

//document elements
const overlay = document.getElementById('monitor-overlay');
const close_button = document.getElementById('monitor-close');

//variables
const divisor_max = 24;
const divisor_min = 15;

export function ReturnObject(obj){
    gsap.to(obj.mesh.position, {x:obj.originalPosition.x, y:obj.originalPosition.y, z:obj.originalPosition.z, duration: 1});
    gsap.to(obj.mesh.rotation, {
        x: obj.originalRotation.x,
        y: obj.originalRotation.y,
        z: obj.originalRotation.z,
        duration: 1
    });
    overlay.style.display = 'none';
}

export function ExamineComputer(){
    console.log('computer clicked!');

    //retrieve direction camera is looking
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    //calculating camera's position in website based off direction and vector scalar
    const targetPosition = camera.position.clone().add(direction.multiplyScalar(2.5));

    // temporarily move mesh to target position
    computer_state.mesh.position.copy(targetPosition);
    // now lookAt is calculated from the correct spot
    computer_state.mesh.lookAt(camera.position);
    const targetRotation = computer_state.mesh.rotation.y;
    // restore original position and rotation
    computer_state.mesh.position.copy(computer_state.originalPosition);
    computer_state.mesh.rotation.y = computer_state.originalRotation.y;

    // animate both simultaneously
    gsap.to(computer_state.mesh.position, { x: targetPosition.x, y: (targetPosition.y - 0.5), z: targetPosition.z, duration: 1 });
    gsap.to(computer_state.mesh.rotation, { y: targetRotation, duration: 1 });

    overlay.style.display = 'block';
}

export function PunchBag(){
    let target_rotation = Math.floor(Math.random() * (divisor_max - divisor_min + 1) + divisor_min);

    console.log(target_rotation);
    const sound = HitSound(target_rotation);
    sound.play();

    gsap.to(punching_bag_state.mesh.rotation, {
        x: Math.PI / target_rotation,
        duration: 0.2,
        onComplete: () => {
            gsap.to(punching_bag_state.mesh.rotation, {
                x: punching_bag_state.originalRotation.x,
                duration: 0.2
            })
        }
    })
}
function HitSound(hit_weight){
    const offset = 3;

    if(hit_weight >= divisor_min && hit_weight <= divisor_min + offset){  //[15,18]
        console.log('Heavy hit detected!');
        return new Audio('/Sounds/Bag/heavy_hit.wav');
    }else if(hit_weight > divisor_min + offset && hit_weight <= divisor_min + (offset*2)){    //[19,21]
        console.log('Medium hit detected!');
        return new Audio('/Sounds/Bag/medium_hit.wav');
    }else {
        console.log('Light hit dected!');
        return new Audio('/Sounds/Bag/light_hit.wav');  //[22, 24]
    }
}

//close the monitor overlay
close_button.addEventListener('click', () => {
    overlay.style.display = 'none';
});