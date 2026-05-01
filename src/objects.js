import * as THREE from 'three';
import { scene } from './scene.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//#region Object stats

export const computer_state = {
    mesh: null,
    originalPosition: null,
    originalRotation: null
}

export const punching_bag_state = {
    mesh: null,
    originalPosition: null,
    originalRotation: null
}

//#endregion

//#region House Object

//plank texture
const textureLoader = new THREE.TextureLoader();
const planksTexture = textureLoader.load(
    '/planks_baked.jpg',
    function() { console.log('texture loaded!'); },
    undefined,
    function(error) { console.log('texture error:', error); }
);

const loader = new GLTFLoader();
loader.load('/Room.glb', function(gltf) {
    console.log('loaded!', gltf);
    scene.add(gltf.scene);

    // everything using gltf goes INSIDE here
    gltf.scene.traverse(function(child) {
        if (child.isMesh && child.name === 'Cube003') {
            console.log('found planks, applying texture');
            child.material = new THREE.MeshStandardMaterial({
                map: planksTexture,
                side: THREE.DoubleSide
            });
        }
    });

    gltf.scene.scale.set(2, 2, 2);
});

//#endregion

//#region About Me Items
loader.load('/punching_bag.glb', function(gltf){
    console.log('punching bag loaded!')

    gltf.scene.position.set(3, 3.8, -3.8);
    gltf.scene.scale.set(3, 3, 3);
    gltf.scene.rotation.y = -Math.PI / 2;

    punching_bag_state.mesh = gltf.scene;
    punching_bag_state.originalPosition = gltf.scene.position.clone();
    punching_bag_state.originalRotation = gltf.scene.rotation.y;

    scene.add(gltf.scene);
});

loader.load('/computer.glb', function(gltf){
    console.log('computer loaded!');

    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.position.set(-3.6, 2.6, 0);

    computer_state.mesh = gltf.scene;
    computer_state.originalPosition = gltf.scene.position.clone();
    computer_state.originalRotation = gltf.scene.rotation.clone();

    scene.add(gltf.scene);
});

//#endregion

//adding pointlight + ambientLight
const pointLight = new THREE.PointLight(0xffffff, 40);
pointLight.position.set(0, 6, 0);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//#region Helpers
const pointLightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointLightHelper, gridHelper);
//#endregion