import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Vector3 } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  function onLoad(font) {
    const textGeometry = new THREE.TextBufferGeometry('Johnny', {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 3,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3
    })
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x + textGeometry.boundingBox.min.x - 0.04) / 2,
    //   -(textGeometry.boundingBox.max.y - 0.02) / 2,
    //   -(textGeometry.boundingBox.max.z - 0.03) / 2
    // )
    textGeometry.center()
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)
  }
)

/**
 * Objects
 */
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
for (let i = 0; i < 300; i++) {
  const donut = new THREE.Mesh(donutGeometry, material)
  donut.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  )
  donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
  const randomScale = Math.random()
  donut.scale.set(randomScale, randomScale, randomScale)
  scene.add(donut)
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
