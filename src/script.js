import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Raycaster
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseDown = (event) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  /*  for (let i = 0; i < intersects.length; i++) {
    console.log(intersects);
  } */

  // gets the closest object intersecting the raycaster
  if (intersects.length > 0) {
    var objname = intersects[0].object.userData.name;
    console.log(objname);
    if (objname != null && document.getElementById(objname) != null) {
      document.getElementById(objname).style.display = "block";
    }
  }
};

// window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousedown", onMouseDown);

// Sizes
const sizes = {
  width: 0,
  height: 0,
};
setSize();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

var loadingScreen = document.getElementById("loading-screen");

gltfLoader.load(
  "/modell/haus.glb",
  (gltf) => {
    console.log(gltf);
    gltf.scene.scale.set(0.025, 0.025, 0.025);

    while (gltf.scene.children.length) {
      var object = gltf.scene.children[0];
      /*   object.traverse((node) => {
              if (!node.isMesh) return;
              node.material.wireframe = true;
            }); */
      scene.add(object);
      // scene.add(gltf.scene.children[0])
    }

    scene.rotateY(100);

    loadingScreen.style.display = "none";
    // clearInterval(myInterval);

    // Animation
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.animations[0].channels[0]).play();
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();
  },
  (progress) => {
    // console.log(progress)
    animateLoadingScreen();
  },
  (error) => {
    console.log("Error:");
    console.log(error);
  }
);

function animateLoadingScreen() {
  // loadingScreen.children[0].style.transform = "rotate(1deg)";
  requestAnimationFrame(animateLoadingScreen);

  // A loop that removes display none from previous p-element and add display block to current p-element in array

  // const loadingtexts = document.querySelectorAll(".loading-text");
  // var counter = 0;

  // for (var counter = 0; counter < loadingtexts.length; i++) {
  //   setInterval(function () {
  //     animateText(counter);
  //     //counter++;
  //   }, 5000);
  // }

  // function animateText(counter) {
  //   console.log(counter);
  //   if (counter < loadingtexts.length) {
  //     loadingtexts[counter].style.display = "none";
  //     loadingtexts[++counter].style.display = "block";
  //     //  setTimeout(() => animateText(counter++), 5000);
  //   }
  // }

  // start the initial timeout
  // let myInterval = setTimeout(() => animateText(counter++), 5000);
}
// Set keyframes to an array of elements?

animateLoadingScreen();

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(-60, 30, -60);
scene.add(camera);

// Lights

const innerLight = new THREE.PointLight(0xffffff, 0.8);
innerLight.position.set(0, 5, 0);
scene.add(innerLight);

const spotLight = new THREE.SpotLight(0xffffaa, 0.2);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

camera.add(spotLight);

const ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
ambientLight.position.set(0, 500, 0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xc0dbeb, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 7, 7);
scene.add(directionalLight);

let darkmodeButton = document.getElementById("dark-mode-toggle");
darkmodeButton.addEventListener("click", lights, false);

function lights() {
  if (document.body.classList.contains("dark-mode")) {
    ambientLight.intensity = 0;
    directionalLight.intensity = 0;

    innerLight.intensity = 0.8;
    spotLight.intensity = 0.2;
  } else {
    innerLight.intensity = 0.6;
    spotLight.intensity = 0.5;

    ambientLight.intensity = 0.6;
    directionalLight.intensity = 0.5;
  }
  renderer.render(scene, camera);
}

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.maxDistance = 175;
controls.minDistance = 35;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  // powerPreference: "high-performance",
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.render(scene, camera);

lights();

document.addEventListener("resize", () => {
  onWindowResize();
});

function setSize() {
  var aside = document.getElementById("aside");

  // Update sizes
  if (window.innerWidth >= 768 && aside.classList.contains("change")) {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  } else if (window.innerWidth >= 768) {
    sizes.width = window.innerWidth * 0.5;
    sizes.height = window.innerHeight;
  } else {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  }
}

function updateCameraAndRenderer() {
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onWindowResize() {
  setSize();

  updateCameraAndRenderer();
}

window.addEventListener("resize", onWindowResize, false);

var button = document.getElementById("toggleButton");

button.addEventListener("click", function () {
  onWindowResize();
});

/* window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}); */

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Animate
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Model animation
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  // OrbitControls.addEventListener("change", () =>
  //   renderer.render(scene, camera)
  // );
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  // console.log(camera.position);
};

// GSAP Animation
let animation = gsap.timeline({});

window.addEventListener("hashchange", () => {
  let category = location.hash.replace("#", "");

  // console.log(category + " was clicked");
  switch (category) {
    case "Home":
      animation.to(camera.position, {
        x: -60,
        y: 30,
        z: -60,
        duration: 4,
      });
      break;
    case "Mobilitaet":
      animation.to(camera.position, { x: -42, y: 5, z: 42, duration: 4 });
      break;
    case "Energie":
      animation.to(camera.position, { x: -35, y: 6.4, z: -21, duration: 4 });
      break;
    case "Elektrizitaet":
      animation.to(camera.position, { x: -16.7, y: 5.7, z: -30, duration: 4 });
      break;
    case "Heizung":
      animation.to(camera.position, { x: 12, y: 15, z: -45, duration: 4 });
      break;
    case "Klima":
      animation.to(camera.position, { x: 109, y: 12.5, z: -37, duration: 4 });
      break;

    default:
      animation.to(camera.position, {
        x: -60,
        y: 30,
        z: -60,
        duration: 4,
      });
      break;
  }
});

window.dispatchEvent(new HashChangeEvent("hashchange"));

tick();
