import './style.css'
import * as THREE from 'three'
import { EffectComposer, EffectPass, RenderPass, BloomEffect } from 'postprocessing'
import gsap from 'gsap'
import Lenis from 'lenis'
import { Howl } from 'howler'

// ===== CALMING BACKGROUND MUSIC with Howler.js =====
// Using local calming ambient track (Slow Motion by Bensound)
let backgroundMusic = null

// Initialize and autoplay music after page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    backgroundMusic = new Howl({
      src: ['/audio/calm-ambient.mp3'],
      loop: true,
      volume: 0.098, // 50% quieter than 0.196 (0.196 * 0.5 = 0.098)
      autoplay: true, // Start automatically
      html5: false,
      onload: () => console.log('✓ Music loaded'),
      onplay: () => console.log('♪ Music playing'),
      onplayerror: () => {
        // Browser blocked autoplay - retry on interaction
        const retry = () => backgroundMusic.play()
        window.addEventListener('click', retry, { once: true })
      }
    })
  }, 100)
})

// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Section tracking for navigation
const sections = document.querySelectorAll('.section')
let currentSectionIndex = 0
let scrollTimeout = null
let isSnapping = false
let lastScrollTime = 0

// Update nav indicator based on scroll position
lenis.on('scroll', ({ scroll }) => {
  lastScrollTime = Date.now()

  const scrollPos = scroll + window.innerHeight / 2
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      if (currentSectionIndex !== index) {
        currentSectionIndex = index
        updateNavIndicator(index)
      }
    }
  })

  // Clear previous timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }

  // Magnetic snap after scroll stops - only if not already snapping
  if (!isSnapping) {
    scrollTimeout = setTimeout(() => {
      // Double check we haven't scrolled again
      if (Date.now() - lastScrollTime >= 150 && !isSnapping) {
        const currentSection = sections[currentSectionIndex]
        if (!currentSection) return

        const sectionTop = currentSection.offsetTop
        const currentScroll = window.scrollY
        const distanceFromTop = Math.abs(currentScroll - sectionTop)

        // Only snap if not already aligned
        if (distanceFromTop > 5) {
          isSnapping = true
          lenis.scrollTo(currentSection, {
            offset: 0,
            duration: 0.6,
            lock: true,
            force: true,
            onComplete: () => {
              isSnapping = false
              scrollTimeout = null
            }
          })
        }
      }
    }, 150)
  }
})

// Navigation indicator functions
function updateNavIndicator(index) {
  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach((item, i) => {
    item.classList.toggle('active', i === index)
  })
}

// Nav item click handlers
const navItems = document.querySelectorAll('.nav-item')
navItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentSectionIndex = index
    lenis.scrollTo(sections[index], {
      offset: 0,
      duration: 1.0
    })
    updateNavIndicator(index)
  })
})

// Initialize first dot as active
updateNavIndicator(0)

// ===== SCENE =====
const canvas = document.querySelector('#webgl')
const scene = new THREE.Scene()

const sizes = { width: window.innerWidth, height: window.innerHeight }

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 8
cameraGroup.add(camera)

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance',
  precision: 'highp',
  stencil: false,
  depth: true,
  logarithmicDepthBuffer: false
})
renderer.setSize(sizes.width, sizes.height)
// Research-backed optimal: cap at 2 for 60fps while maintaining high quality
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.autoUpdate = false

// ===== NEURAL NETWORK BLOB =====
// Research-backed optimal: detail level 4 for hero objects, maintains 60fps with high quality
const blobGeometry = new THREE.IcosahedronGeometry(1.5, 4)
const originalPositions = blobGeometry.attributes.position.array.slice()

const blobMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x99bbff,
  metalness: 0.85,
  roughness: 0.08,
  transparent: true,
  opacity: 0.75,
  transmission: 0.4,
  thickness: 0.6,
  ior: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  envMapIntensity: 2.5,
  sheen: 0.5,
  sheenRoughness: 0.2,
  sheenColor: new THREE.Color(0xaaccff)
})

const blobGroup = new THREE.Group()
const blob = new THREE.Mesh(blobGeometry, blobMaterial)
blobGroup.add(blob)

// Neural network connections - more visible, animated lines
const neuralConnections = []
const connectionGeometry = new THREE.BufferGeometry()
const connectionPositions = []
const connectionColors = []

// Create neural connections (35 lines for better network effect)
for (let i = 0; i < 35; i++) {
  const startIdx = Math.floor(Math.random() * (originalPositions.length / 3)) * 3
  const endIdx = Math.floor(Math.random() * (originalPositions.length / 3)) * 3

  // Position lines at varying depths inside blob
  const depth = 0.5 + Math.random() * 0.3
  connectionPositions.push(
    originalPositions[startIdx] * depth,
    originalPositions[startIdx + 1] * depth,
    originalPositions[startIdx + 2] * depth,
    originalPositions[endIdx] * depth,
    originalPositions[endIdx + 1] * depth,
    originalPositions[endIdx + 2] * depth
  )

  // Varying colors for depth effect
  const brightness = 0.7 + Math.random() * 0.3
  connectionColors.push(brightness, brightness, 1, brightness, brightness, 1)
}

connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
connectionGeometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3))

const connectionMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  linewidth: 1
})

const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial)
blobGroup.add(connections)

// Neural nodes - glowing spheres with emissive material
// Research-backed optimal: 16x16 segments for quality/performance balance
const nodeGeometry = new THREE.SphereGeometry(0.04, 16, 16)
const nodeMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaddff,
  emissive: 0x5599ff,
  emissiveIntensity: 2.5, // Boost emissive to trigger bloom
  transparent: true,
  opacity: 0.8,
  metalness: 0.3,
  roughness: 0.2
})

// Create 25 nodes for better neural network appearance
for (let i = 0; i < 25; i++) {
  const idx = Math.floor(Math.random() * (originalPositions.length / 3)) * 3
  const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone())
  const depth = 0.6 + Math.random() * 0.2
  node.position.set(
    originalPositions[idx] * depth,
    originalPositions[idx + 1] * depth,
    originalPositions[idx + 2] * depth
  )
  // Store initial pulse offset for varied animation
  node.userData.pulseOffset = Math.random() * Math.PI * 2
  neuralConnections.push(node)
  blobGroup.add(node)
}

blobGroup.position.set(3.8, 0, 0)
scene.add(blobGroup)

// ===== BEAUTIFUL AMBIENT PARTICLES =====
// Research-backed optimal: 500 particles for performance
const particleCount = 500
const particleGeometry = new THREE.BufferGeometry()
const positions = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particleMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

// ===== ENHANCED LIGHTING FOR HIGH QUALITY =====
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Main key light - cool blue
const pointLight1 = new THREE.PointLight(0xaaccff, 8, 25)
pointLight1.position.set(4, 4, 5)
pointLight1.castShadow = true
// Research-backed optimal: 1024 for balanced quality/performance
pointLight1.shadow.mapSize.width = 1024
pointLight1.shadow.mapSize.height = 1024
pointLight1.shadow.bias = -0.0001
pointLight1.shadow.radius = 2
pointLight1.shadow.camera.near = 0.5
pointLight1.shadow.camera.far = 30
scene.add(pointLight1)

// Fill light - warm magenta
const pointLight2 = new THREE.PointLight(0xffaacc, 5, 25)
pointLight2.position.set(-4, -3, 4)
pointLight2.castShadow = true
// Research-backed optimal: 1024 for balanced quality/performance
pointLight2.shadow.mapSize.width = 1024
pointLight2.shadow.mapSize.height = 1024
pointLight2.shadow.bias = -0.0001
pointLight2.shadow.radius = 2
pointLight2.shadow.camera.near = 0.5
pointLight2.shadow.camera.far = 30
scene.add(pointLight2)

// Rim light for sculpture definition
const rimLight = new THREE.PointLight(0xffffff, 4, 15)
rimLight.position.set(0, 0, -5)
scene.add(rimLight)

// ===== POST-PROCESSING =====
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

// Research-backed optimal bloom: reduced resolution for performance, higher threshold
const bloomEffect = new BloomEffect({
  intensity: 1.2,
  luminanceThreshold: 0.21, // Only bright pixels bloom
  luminanceSmoothing: 0.95,
  mipmapBlur: true,
  kernelSize: 3,
  resolutionScale: 0.5 // 50% resolution for better performance
})

composer.addPass(new EffectPass(camera, bloomEffect))

// ===== MOUSE & RAYCASTER FOR SUBTLE HOVER =====
const mouse = { x: 0, y: 0 }
const mouseNDC = new THREE.Vector2() // Normalized Device Coordinates for raycasting
const raycaster = new THREE.Raycaster()
let isHoveringBlob = false

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width) - 0.5
  mouse.y = -(e.clientY / sizes.height) + 0.5

  // Update NDC coordinates for raycasting
  mouseNDC.x = (e.clientX / sizes.width) * 2 - 1
  mouseNDC.y = -(e.clientY / sizes.height) * 2 + 1
})

// ===== SCROLL =====
let scrollY = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

// Use the sections already declared at the top for scroll navigation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      gsap.to(entry.target.querySelector('.content'), {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      })
    }
  })
}, { threshold: 0.3 })

sections.forEach((section, index) => {
  if (index > 0) {
    gsap.set(section.querySelector('.content'), { opacity: 0, y: 50 })
  }
  observer.observe(section)
})

// ===== RESIZE =====
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  composer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Maintain performance on resize
})

// ===== ANIMATION LOOP =====
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Raycast to detect hover on blob
  raycaster.setFromCamera(mouseNDC, camera)
  const intersects = raycaster.intersectObject(blob)
  isHoveringBlob = intersects.length > 0

  // Blob morphing animation
  const scrollProgress = scrollY / (sizes.height * 4)
  const blobPositions = blobGeometry.attributes.position.array

  // Hover intensity smoothly transitions
  const targetHoverIntensity = isHoveringBlob ? 1 : 0
  const hoverIntensity = THREE.MathUtils.lerp(
    blobMaterial.userData.hoverIntensity || 0,
    targetHoverIntensity,
    0.05
  )
  blobMaterial.userData.hoverIntensity = hoverIntensity

  for (let i = 0; i < blobPositions.length; i += 3) {
    const x = originalPositions[i]
    const y = originalPositions[i + 1]
    const z = originalPositions[i + 2]

    // Subtle organic breathing
    const breathe = 1 + Math.sin(elapsedTime * 0.4) * 0.06

    // Layered noise for organic movement
    const noise1 = Math.sin(elapsedTime * 0.3 + x * 1.5) * Math.cos(elapsedTime * 0.25 + y * 1.5)
    const noise2 = Math.sin(elapsedTime * 0.28 + z * 1.2) * Math.cos(elapsedTime * 0.35 + x * 1.3)

    // Add subtle hover displacement
    const hoverDisplacement = hoverIntensity * 0.04
    const displacement = (noise1 * 0.08 + noise2 * 0.06) * breathe + hoverDisplacement

    blobPositions[i] = x * (1 + displacement)
    blobPositions[i + 1] = y * (1 + displacement)
    blobPositions[i + 2] = z * (1 + displacement)
  }

  blobGeometry.attributes.position.needsUpdate = true
  blobGeometry.computeVertexNormals()

  // Rotation with scroll for different angles
  blob.rotation.x = elapsedTime * 0.08 + scrollProgress * Math.PI * 0.4
  blob.rotation.y = elapsedTime * 0.12 + scrollProgress * Math.PI * 0.6
  blob.rotation.z = Math.sin(elapsedTime * 0.06) * 0.15 + scrollProgress * Math.PI * 0.2

  // Subtle color shift with hover brightening
  const hue = 0.57 + Math.sin(elapsedTime * 0.2 + scrollProgress * Math.PI) * 0.06
  const saturation = 0.6 + hoverIntensity * 0.1
  const lightness = 0.7 + hoverIntensity * 0.08
  blobMaterial.color.setHSL(hue, saturation, lightness)

  // Subtle scale with scroll and hover
  const scale = 1 + scrollProgress * 0.15 + Math.sin(elapsedTime * 0.5) * 0.03 + hoverIntensity * 0.05
  blobGroup.scale.set(scale, scale, scale)

  // Subtle metalness shift on hover
  blobMaterial.metalness = 0.85 + hoverIntensity * 0.1

  // Neural node pulsing - enhanced thinking brain effect
  neuralConnections.forEach((node, i) => {
    const pulseSpeed = 1.5 + (i % 4) * 0.3
    const pulse = Math.sin(elapsedTime * pulseSpeed + node.userData.pulseOffset) * 0.5 + 0.5

    // Varied pulsing for more organic neural activity
    node.material.opacity = 0.4 + pulse * 0.5
    node.material.emissiveIntensity = 1.0 + pulse * 1.5
    node.scale.setScalar(0.9 + pulse * 0.3)
  })

  // Connection lines with flowing opacity for data transmission effect
  const flowSpeed = Math.sin(elapsedTime * 0.8) * 0.5 + 0.5
  connectionMaterial.opacity = 0.2 + flowSpeed * 0.15

  // Gentle particle rotation
  particles.rotation.y = elapsedTime * 0.02
  particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.1

  // Dynamic lighting orbit with elevation changes
  pointLight1.position.x = Math.sin(elapsedTime * 0.3) * 5
  pointLight1.position.y = 4 + Math.sin(elapsedTime * 0.4) * 2
  pointLight1.position.z = Math.cos(elapsedTime * 0.3) * 5

  pointLight2.position.x = Math.cos(elapsedTime * 0.35) * 5
  pointLight2.position.y = -3 + Math.cos(elapsedTime * 0.45) * 2
  pointLight2.position.z = Math.sin(elapsedTime * 0.35) * 5

  rimLight.position.x = Math.sin(elapsedTime * 0.2) * 3
  rimLight.position.y = Math.cos(elapsedTime * 0.25) * 2

  // Parallax
  const parallaxX = mouse.x * 0.4
  const parallaxY = mouse.y * 0.4

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime

  // Scroll - keep blob visible longer (through 3.5 sections instead of 4)
  const scrollProgressCam = scrollY / (sizes.height * 5)
  camera.position.y = -scrollProgressCam * 3.5
  camera.position.z = 8 - scrollProgressCam * 0.8
  cameraGroup.rotation.y = scrollProgressCam * Math.PI * 0.15

  // Keep blob fixed to the side - counter camera movement and slow fade
  blobGroup.position.y = scrollProgressCam * 1.2

  // Gradual fade out starting after section 3
  const fadeStart = 3.0
  const fadeProgress = Math.max(0, (scrollY / sizes.height - fadeStart) / 1.5)
  const blobOpacity = Math.max(0, 1 - fadeProgress)
  blob.material.opacity = (0.72 + Math.sin(elapsedTime * 0.5) * 0.06 + hoverIntensity * 0.08) * blobOpacity
  connectionMaterial.opacity = (0.2 + flowSpeed * 0.15) * blobOpacity
  neuralConnections.forEach(node => {
    const baseOpacity = 0.4 + (Math.sin(elapsedTime * (1.5 + neuralConnections.indexOf(node) % 4 * 0.3) + node.userData.pulseOffset) * 0.5 + 0.5) * 0.5
    node.material.opacity = baseOpacity * blobOpacity
  })

  composer.render()
  window.requestAnimationFrame(tick)
}

tick()
