import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';
import { textureLoad } from 'three/src/nodes/accessors/TextureNode.js';


//#region Initialization
//setting up the scene + camera + room
const scene = new THREE.Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 8;
camera.position.x = 8;
camera.position.y = 12;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//adding Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

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
        if (child.isMesh) {
            console.log('mesh found:', child.name);
        }
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

    scene.add(gltf.scene);
});

loader.load('/computer.glb', function(gltf){
    console.log('computer loaded!');

    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.position.set(-3.6, 2.6, 0);

    scene.add(gltf.scene);
});

//#endregion

const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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

//adding pointlight + ambientLight
const pointLight = new THREE.PointLight(0xffffff, 40);
pointLight.position.set(0, 6, 0);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//#region Animations
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}
//#endregion

//#region Helpers
const pointLightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointLightHelper, gridHelper);
//#endregion

animate();