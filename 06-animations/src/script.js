import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.getElementById('webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// Clock
const clock = new THREE.Clock()

gsap.to(mesh.material.color, { duration: 1, delay: 1, setHex: 0x00ff00 })
gsap.to(mesh.material.color, { duration: 1, delay: 3, setHex: 0xff0000 })

const tick = () => {
  // Adapt to FPS
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  mesh.rotation.y = (elapsedTime * Math.PI) / 2
  mesh.position.x = Math.sin(elapsedTime)
  mesh.position.y = Math.cos(elapsedTime)

  // Render
  renderer.render(scene, camera)

  // Loop it!
  window.requestAnimationFrame(tick)
}

tick()
