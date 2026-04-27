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
camera.position.z = 4;
camera.position.x = 4;
camera.position.y = 6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//adding Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

//#endregion

//#region House Object
//adding Room object
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
});

//#endregion

//adding pointlight + ambientLight
const pointLight = new THREE.PointLight(0xffffff, 20);
pointLight.position.set(0, 3, 0);
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