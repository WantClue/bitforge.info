import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

const container = document.getElementById('canvas-container')
if (container) {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1.2)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0x4a90e2, 0.8)
pointLight2.position.set(-5, -5, 5)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xffffff, 0.5)
pointLight3.position.set(0, -5, -5)
scene.add(pointLight3)

const loader = new GLTFLoader()
let pivot: THREE.Group | null = null

loader.load(
  '/miner.glb',
  (gltf) => {
    const model = gltf.scene
    
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3 / maxDim
    model.scale.set(scale, scale, scale)
    
    box.setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    
    model.position.set(-center.x, -center.y, -center.z)
    
    model.rotation.x = Math.PI / 2 - 0.2 
    
    pivot = new THREE.Group()
    pivot.add(model)
    scene.add(pivot)
    
    console.log('Model loaded successfully')
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error)
  }
)

camera.position.z = 5

function animate() {
  requestAnimationFrame(animate)

  if (pivot) {
    pivot.rotation.y += 0.005
  }

  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Modal functionality
const specsLink = document.getElementById('specs-link')
const specsModal = document.getElementById('specs-modal')
const modalClose = document.getElementById('modal-close')

if (specsLink && specsModal && modalClose) {
  specsLink.addEventListener('click', (e) => {
    e.preventDefault()
    specsModal.classList.add('active')
  })

  modalClose.addEventListener('click', () => {
    specsModal.classList.remove('active')
  })

  // Close modal when clicking outside
  specsModal.addEventListener('click', (e) => {
    if (e.target === specsModal) {
      specsModal.classList.remove('active')
    }
  })

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && specsModal.classList.contains('active')) {
      specsModal.classList.remove('active')
    }
  })
}
