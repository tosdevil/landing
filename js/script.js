//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
const clock = new THREE.Clock();

console.log('what do you want to find')

let release_date = "15.11.2024"

let release_label = document.getElementById('release_label')
let release_action_label = document.getElementById('release_action_label')
let tg_label = document.getElementById('tg_label')
let sc_label = document.getElementById('sc_label')
let yt_label = document.getElementById('yt_label')
let donate_label = document.getElementById('donate_label')
let sound_switcher = document.getElementById('sound_switcher')

// lniks

release_label.addEventListener("click", function (e) {
  console.log('release');
	window.location.href = "https://band.link/JskQo";
});

tg_label.addEventListener("click", function (e) {
  console.log('tg');
	window.location.href = "https://t.me/isotwelve";
});

sc_label.addEventListener("click", function (e) {
  console.log('tg');
	window.location.href = "https://soundcloud.com/isotwelve";
});

yt_label.addEventListener("click", function (e) {
  console.log('tg');
	window.location.href = "https://www.youtube.com/@isotwelve";
});

donate_label.addEventListener("click", function (e) {
  console.log('tg');
	window.location.href = "https://tips.yandex.ru/guest/payment/5524100";
});

// release action label

const [day, month, year] = release_date.split('.').map(Number);

const inputDate = new Date(year, month - 1, day);
inputDate.setHours(0, 0, 0, 0);
const today = new Date();
today.setHours(0, 0, 0, 0);

let status;
if (inputDate > today) {
  status = "Пресейв!";
} else {
  const monthAfter = new Date(inputDate);
  monthAfter.setMonth(monthAfter.getMonth() + 1);
  status = today < monthAfter ? "Уже в сети!" : "listen!";
}

release_action_label.textContent = status;

let audio = new Audio('audio/music.mp3')
audio.loop = true;

sound_switcher.addEventListener("click", function (e) {
  if (sound_switcher.classList.contains('visible')){
		sound_switcher.classList.remove('visible')
		audio.pause();
	}
	else{
		sound_switcher.classList.add('visible')
		audio.play();
	}
});

// DRAW 3D

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'sheryl';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
		object.traverse(child => {
			if (child.isMesh) child.frustumCulled = false;
		});
		
		object.position.y = -10;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3d").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "sheryl" ? 20 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "sheryl" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "sheryl") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (controls) controls.update();
  if (object) {
    object.rotation.y += delta * 0.5; // 0.5 — скорость в радианах в секунду
  }

  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();