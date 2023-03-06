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

const onMouseMove = (event) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    console.log(intersects);
  }

  // gets the closest object intersecting the raycaster
  if (intersects.length > 0) {
    var objname = intersects[0].object.userData.name;
    if (objname != null && document.getElementById(objname) != null) {
      console.log(objname);
      document.getElementById(objname).style.display = "block";
    }
  }
};

window.addEventListener("mousemove", onMouseMove);

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

    // Animation
    /*   mixer = new THREE.AnimationMixer(gltf.scene)
         const action = mixer.clipAction(gltf.animations[2])
         action.play() */
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
  loadingScreen.children[0].style.transform = "rotate(1deg)";
  requestAnimationFrame(animateLoadingScreen);
}

animateLoadingScreen();

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(-40, 20, -40);
scene.add(camera);

// Lights
const ambientLight = new THREE.HemisphereLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 7, 7);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.1);
camera.add(pointLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.maxDistance = 175;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

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

window.addEventListener("dblclick", () => {
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
});

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
  /*  if(mixer)
    {
        mixer.update(deltaTime)
    }
 */
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
