
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Color } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
/* const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh) */

// Sizes

const sizes = {
    width : 0,
    height : 0
}
setSize()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    '/modell/haus.glb',
    (gltf) =>
    {
        console.log('success')
        console.log(gltf)
        gltf.scene.scale.set(0.025, 0.025, 0.025)

        while(gltf.scene.children.length){
            var object = gltf.scene.children[0];
          /*   object.traverse((node) => {
              if (!node.isMesh) return;
              node.material.wireframe = true;
            }); */
            scene.add(object);
       // scene.add(gltf.scene.children[0])
        }

        scene.rotateY(100)

         // Animation
       /*   mixer = new THREE.AnimationMixer(gltf.scene)
         const action = mixer.clipAction(gltf.animations[2])
         action.play() */
    },
    (progress) =>
    {
        console.log('progress')
        console.log(progress)
    },
    (error) =>
    {
        console.log('error')
        console.log(error)
    }
)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(-7, 2, -5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)


document.addEventListener('resize', () =>
{
    setSize()

     // Update camera
     camera.aspect = sizes.width / sizes.height
     camera.updateProjectionMatrix()
 
     // Update renderer
     renderer.setSize(sizes.width, sizes.height)
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function setSize(){
    var aside = document.getElementById("aside");

    // Update sizes
    if(window.innerWidth >= 768 && aside.classList.contains("change")){
        sizes.width = window.innerWidth*0.95
        sizes.height = window.innerHeight
    }

    else if(window.innerWidth >= 768){
        sizes.width = window.innerWidth*0.5
        sizes.height = window.innerHeight

    }
    else{
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        aside.classList.add("change");
    }
}



window.addEventListener('dblclick', () =>
{
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if(!fullscreenElement)
  {
      if(canvas.requestFullscreen)
      {
          canvas.requestFullscreen()
      }
      else if(canvas.webkitRequestFullscreen)
      {
          canvas.webkitRequestFullscreen()
      }
  }
  else
  {
      if(document.exitFullscreen)
      {
          document.exitFullscreen()
      }
      else if(document.webkitExitFullscreen)
      {
          document.webkitExitFullscreen()
      }
  }
})

// Cursor
const cursor = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})


// Animate
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
   /*  if(mixer)
    {
        mixer.update(deltaTime)
    }
 */
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
