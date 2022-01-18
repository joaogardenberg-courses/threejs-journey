import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.getElementById('webgl')

// Scene
const scene = new THREE.Scene()

// Red polygon
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Position
mesh.position.set(0.7, -0.6, 1)

// Scale
mesh.scale.set(2, 0.5, 0.5)

// Rotation order
mesh.rotation.reorder('YXZ')

// Rotation
mesh.rotation.x = Math.PI / 4
mesh.rotation.y = Math.PI / 4

// Group
const group = new THREE.Group()
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube2.position.set(-2, 0, 0)
cube3.position.set(2, 0, 0)
group.position.set(0, 1, 0)
group.scale.set(1, 1.5, 1)
group.rotation.set(0, 1, 0)
group.add(cube1)
group.add(cube2)
group.add(cube3)
scene.add(group)

// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Make Camera look at the polygon
// camera.lookAt(mesh.position)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
