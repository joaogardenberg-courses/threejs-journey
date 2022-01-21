import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/1.png')

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 10000
const itemSize = 3
const positions = new Float32Array(count * itemSize)
const colors = new Float32Array(count * itemSize)

for (let i = 0; i < count * itemSize; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, itemSize)
)

particlesGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, itemSize)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particleTexture,
  vertexColors: true,

  // Makes the GPU not care about the black parts of the
  // image, but each particle's non-black pixels still
  // hide the particles behind.
  //   alphaTest: 0.001

  // Makes the GPU not care if a particle is in front or
  // not, it just renders everything. However, if there's
  // an object in the scene, the particles behind it also
  // get rendered.
  //   depthTest: false

  // Tells the WebGL not to draw the particles in the
  // depth buffer
  depthWrite: false,

  // Glowing effect due to combining the colors from each
  // particle that's behind each other
  blending: THREE.AdditiveBlending
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
camera.position.z = 3
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

  // Update particles
  //   particles.rotation.x = elapsedTime / 16
  //   particles.rotation.y = elapsedTime / 8
  for (let i = 0; i < count; i++) {
    const iSize = i * itemSize
    const x = iSize
    const y = iSize + 1
    const z = iSize + 2
    const xValue = particlesGeometry.attributes.position.array[x]
    const zValue = particlesGeometry.attributes.position.array[z]
    particlesGeometry.attributes.position.array[y] =
      Math.sin(elapsedTime + xValue + zValue) / 4
  }
  particlesGeometry.attributes.position.needsUpdate = true

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
