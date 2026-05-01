import * as THREE from 'three';
import gsap from 'gsap';
import { camera } from './scene.js';
import { punching_bag_state, computer_state } from './objects.js';

export function ReturnObject(obj){
    gsap.to(obj.mesh.position, {x:obj.originalPosition.x, y:obj.originalPosition.y, z:obj.originalPosition.z, duration: 1});
    gsap.to(obj.mesh.rotation, {
        x: obj.originalRotation.x,
        y: obj.originalRotation.y,
        z: obj.originalRotation.z,
        duration: 1
    });
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
    gsap.to(computer_state.mesh.position, { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, duration: 1 });
    gsap.to(computer_state.mesh.rotation, { y: targetRotation, duration: 1 });
}