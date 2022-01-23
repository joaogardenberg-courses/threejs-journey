import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {
  createSphere: () =>
    createSphere(
      Math.random() * 0.5,
      new THREE.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3)
    ),
  createBox: () =>
    createBox(
      Math.random(),
      Math.random(),
      Math.random(),
      new THREE.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3)
    ),
  reset: () =>
    objectsToUpdate.forEach(({ mesh, body }) => {
      body.removeEventListener('collide', playHitSound)
      world.removeBody(body)
      scene.remove(mesh)
    })
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = ({ contact }) => {
  const impactStrength = contact.getImpactVelocityAlongNormal()

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// World
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
  allowSleep: true
})
world.broadphase = new CANNON.SAPBroadphase(world)

// Materials
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  { friction: 0.1, restitution: 0.7 }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)

// Floor
const floorShape = new CANNON.Box(new CANNON.Vec3(10 / 2, 0.1 / 2, 10 / 2))
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape
})
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereBufferGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture
//   })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.BoxBufferGeometry(10, 0.1, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
  })
)
floor.receiveShadow = true
// floor.quaternion.copy(floorBody.quaternion)
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(-3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []
const material = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture
})

// Sphere
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)

const createSphere = (radius, position) => {
  // Three.js Mesh
  const mesh = new THREE.Mesh(sphereGeometry, material)
  mesh.castShadow = true
  mesh.position.copy(position)
  mesh.scale.set(radius, radius, radius)
  scene.add(mesh)

  // Cannon.js Body
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({ mass: 1, position, shape })
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  // Save in objectsToUpdate
  objectsToUpdate.push({ mesh, body })
}

// Box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)

const createBox = (width, height, depth, position) => {
  // Three.js Mesh
  const mesh = new THREE.Mesh(boxGeometry, material)
  mesh.castShadow = true
  mesh.position.copy(position)
  mesh.scale.set(width, height, depth)
  scene.add(mesh)

  // Cannon.js Body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, depth / 2)
  )
  const body = new CANNON.Body({ mass: 1, position, shape })
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  // Save in objectsToUpdate
  objectsToUpdate.push({ mesh, body })
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update physics world
  //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
  world.step(1 / 60, deltaTime, 3)

  // Update Three.js
  //   sphere.position.copy(sphereBody.position)

  // Update objects
  objectsToUpdate.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position)
    mesh.quaternion.copy(body.quaternion)
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
