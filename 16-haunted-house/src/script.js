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

// Fog
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
)
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
)
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
)
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
)
grassColorTexture.repeat.set(8, 8)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.repeat.set(8, 8)
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.repeat.set(8, 8)
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture
  })
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
scene.add(floor)

// House group
const house = new THREE.Group()
scene.add(house)

// Walls
const wallHeight = 3
const wallSize = 4
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(wallSize, wallHeight, wallSize),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture
  })
)
walls.position.y = wallHeight / 2
walls.castShadow = true
walls.receiveShadow = true
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
house.add(walls)

// Roof
const roofHeight = 1
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, roofHeight, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof.position.y = wallHeight + roofHeight / 2
roof.rotation.y = Math.PI / 4
roof.castShadow = true
roof.receiveShadow = true
house.add(roof)

// Door
const doorHeight = 2.2
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(doorHeight, doorHeight, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.position.y = (doorHeight - 0.2) / 2
door.position.z = wallSize / 2
door.receiveShadow = true
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.castShadow = true
bush1.receiveShadow = true
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.castShadow = true
bush2.receiveShadow = true
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.castShadow = true
bush3.receiveShadow = true
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.castShadow = true
bush4.receiveShadow = true
house.add(bush1, bush2, bush3, bush4)

// Graves group
const graves = new THREE.Group()
scene.add(graves)

// Graves
const graveHeight = 0.8
const graveGeometry = new THREE.BoxBufferGeometry(0.6, graveHeight, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })
for (let i = 0; i < 50; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  const angle = Math.random() * Math.PI * 2
  const radius = 4 + Math.random() * 5
  const rotX = (Math.random() - 0.5) / 4
  const rotY = (Math.random() - 0.5) / 2
  const rotZ = (Math.random() - 0.5) / 4
  const posX = Math.sin(angle) * radius
  const posY = graveHeight / 2 - Math.abs(rotZ) / 2
  const posZ = Math.cos(angle) * radius
  grave.position.set(posX, posY, posZ)
  grave.rotation.set(rotX, rotY, rotZ)
  grave.castShadow = true
  grave.receiveShadow = true
  graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.5)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, doorHeight + 0.5, wallSize / 2 + 0.5)
doorLight.castShadow = true
doorLight.shadow.mapSize.set(256, 256)
doorLight.shadow.camera.far = 7
house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
const ghost2 = new THREE.PointLight(0x00ffff, 2, 3)
const ghost3 = new THREE.PointLight(0xffff00, 2, 3)
ghost1.castShadow = true
ghost1.shadow.mapSize.set(256, 256)
ghost1.shadow.camera.far = 7
ghost2.castShadow = true
ghost2.shadow.mapSize.set(256, 256)
ghost2.shadow.camera.far = 7
ghost3.castShadow = true
ghost3.shadow.mapSize.set(256, 256)
ghost3.shadow.camera.far = 7
scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor(0x262837)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Ghosts
  const ghost1Angle = elapsedTime / 2
  ghost1.position.x = Math.cos(ghost1Angle) * 5
  ghost1.position.y = Math.sin(ghost1Angle * 3)
  ghost1.position.z = Math.sin(ghost1Angle) * 5

  const ghost2Angle = -elapsedTime / 3
  ghost2.position.x = Math.cos(ghost2Angle) * 6
  ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(ghost2Angle * 2.5)
  ghost2.position.z = Math.sin(ghost2Angle) * 6

  const ghost3Angle = -elapsedTime / 6
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime / 3))
  ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(ghost3Angle * 2.5)
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime / 2))

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
