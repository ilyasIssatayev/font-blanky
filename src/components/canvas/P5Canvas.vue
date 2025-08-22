<template>
  <div ref="canvasContainer" class="p5-canvas">
    <!-- P5.js canvas will be mounted here -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import p5 from 'p5'
import { useSphereStore } from '../../stores/sphereStore.js'
import { SphereRenderer } from './SphereRenderer.js'

// Props
const props = defineProps({
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 600
  }
})

// Emits
const emit = defineEmits(['sphere-selected', 'camera-updated'])

// Template refs
const canvasContainer = ref(null)

// Store
const sphereStore = useSphereStore()

// P5.js instance and renderer
let p5Instance = null
let sphereRenderer = null

// Camera state for interaction
const cameraState = ref({
  distance: 200,
  angleX: 0,
  angleY: 0,
  targetDistance: 200,
  targetAngleX: 0,
  targetAngleY: 0,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0,
  lastTouchDistance: null
})

// P5.js sketch functions
const sketch = (p) => {
  p.setup = () => {
    // Create WEBGL canvas
    const canvas = p.createCanvas(props.width, props.height, p.WEBGL)
    canvas.parent(canvasContainer.value)
    
    // Initialize sphere renderer
    sphereRenderer = new SphereRenderer(p, sphereStore)
    
    // Set initial camera position
    updateCameraFromStore()
    
    console.log('P5.js WEBGL canvas initialized')
  }

  p.draw = () => {
    // Clear background with gradient-like effect
    p.background(20, 25, 35)
    
    // Update camera with smooth interpolation
    updateCameraSmooth()
    
    // Set up camera with smooth orbit controls
    const cam = sphereStore.camera
    const camX = cam.position.x + cameraState.value.distance * Math.cos(cameraState.value.angleY) * Math.cos(cameraState.value.angleX)
    const camY = cam.position.y + cameraState.value.distance * Math.sin(cameraState.value.angleX)
    const camZ = cam.position.z + cameraState.value.distance * Math.sin(cameraState.value.angleY) * Math.cos(cameraState.value.angleX)
    
    p.camera(
      camX, camY, camZ,           // Camera position
      cam.position.x,             // Look at X
      cam.position.y,             // Look at Y  
      cam.position.z,             // Look at Z
      0, 1, 0                     // Up vector
    )
    
    // Set up lighting for realistic sphere rendering
    setupLighting(p)
    
    // Render spheres if renderer is available
    if (sphereRenderer) {
      sphereRenderer.render()
    }
    
    // Draw coordinate axes for reference when no spheres
    if (sphereStore.spheres.length === 0) {
      drawCoordinateAxes(p)
    }
    
    // Update camera position in store for consistency
    updateStoreCamera()
  }

  // Mouse interaction handlers
  p.mousePressed = () => {
    if (isMouseInCanvas(p)) {
      cameraState.value.isDragging = true
      cameraState.value.lastMouseX = p.mouseX
      cameraState.value.lastMouseY = p.mouseY
      
      // Change cursor to grabbing
      p.canvas.style.cursor = 'grabbing'
      
      return false // Prevent default behavior
    }
  }

  p.mouseDragged = () => {
    if (cameraState.value.isDragging && isMouseInCanvas(p)) {
      const deltaX = p.mouseX - cameraState.value.lastMouseX
      const deltaY = p.mouseY - cameraState.value.lastMouseY
      
      // Adjust sensitivity based on distance (closer = more sensitive)
      const sensitivity = Math.max(0.005, Math.min(0.02, 200 / cameraState.value.distance))
      
      // Update target angles for smooth camera movement
      cameraState.value.targetAngleY += deltaX * sensitivity
      cameraState.value.targetAngleX -= deltaY * sensitivity
      
      // Clamp vertical rotation to prevent flipping
      const maxAngle = Math.PI / 2 - 0.1
      cameraState.value.targetAngleX = Math.max(-maxAngle, Math.min(maxAngle, cameraState.value.targetAngleX))
      
      cameraState.value.lastMouseX = p.mouseX
      cameraState.value.lastMouseY = p.mouseY
      
      return false // Prevent default behavior
    }
  }

  p.mouseReleased = () => {
    cameraState.value.isDragging = false
    
    // Reset cursor
    if (isMouseInCanvas(p)) {
      p.canvas.style.cursor = 'grab'
    }
  }

  p.mouseWheel = (event) => {
    if (isMouseInCanvas(p)) {
      // Smooth zoom with variable speed based on current distance
      const zoomSpeed = Math.max(0.05, Math.min(0.2, cameraState.value.targetDistance / 1000))
      const zoomFactor = event.delta > 0 ? (1 + zoomSpeed) : (1 - zoomSpeed)
      
      cameraState.value.targetDistance *= zoomFactor
      
      // Set zoom bounds with reasonable limits
      const minDistance = 30
      const maxDistance = 800
      cameraState.value.targetDistance = Math.max(minDistance, Math.min(maxDistance, cameraState.value.targetDistance))
      
      return false // Prevent default behavior
    }
  }

  // Touch interaction handlers for mobile support
  p.touchStarted = () => {
    if (p.touches.length === 1 && isMouseInCanvas(p)) {
      // Single touch - camera rotation
      cameraState.value.isDragging = true
      cameraState.value.lastMouseX = p.touches[0].x
      cameraState.value.lastMouseY = p.touches[0].y
      return false
    }
  }

  p.touchMoved = () => {
    if (p.touches.length === 1 && cameraState.value.isDragging) {
      // Single touch drag - rotate camera
      const deltaX = p.touches[0].x - cameraState.value.lastMouseX
      const deltaY = p.touches[0].y - cameraState.value.lastMouseY
      
      const sensitivity = 0.01
      cameraState.value.targetAngleY += deltaX * sensitivity
      cameraState.value.targetAngleX -= deltaY * sensitivity
      
      const maxAngle = Math.PI / 2 - 0.1
      cameraState.value.targetAngleX = Math.max(-maxAngle, Math.min(maxAngle, cameraState.value.targetAngleX))
      
      cameraState.value.lastMouseX = p.touches[0].x
      cameraState.value.lastMouseY = p.touches[0].y
      
      return false
    } else if (p.touches.length === 2) {
      // Two finger pinch - zoom
      const touch1 = p.touches[0]
      const touch2 = p.touches[1]
      const currentDistance = p.dist(touch1.x, touch1.y, touch2.x, touch2.y)
      
      if (cameraState.value.lastTouchDistance) {
        const zoomFactor = currentDistance / cameraState.value.lastTouchDistance
        cameraState.value.targetDistance /= zoomFactor
        
        const minDistance = 30
        const maxDistance = 800
        cameraState.value.targetDistance = Math.max(minDistance, Math.min(maxDistance, cameraState.value.targetDistance))
      }
      
      cameraState.value.lastTouchDistance = currentDistance
      return false
    }
  }

  p.touchEnded = () => {
    cameraState.value.isDragging = false
    cameraState.value.lastTouchDistance = null
  }

  // Keyboard controls for camera
  p.keyPressed = () => {
    if (!isMouseInCanvas(p)) return
    
    const moveSpeed = 10
    const rotateSpeed = 0.1
    const zoomSpeed = 20
    
    switch (p.key) {
      case 'w':
      case 'W':
        // Move forward
        cameraState.value.targetDistance = Math.max(30, cameraState.value.targetDistance - zoomSpeed)
        break
      case 's':
      case 'S':
        // Move backward
        cameraState.value.targetDistance = Math.min(800, cameraState.value.targetDistance + zoomSpeed)
        break
      case 'a':
      case 'A':
        // Rotate left
        cameraState.value.targetAngleY -= rotateSpeed
        break
      case 'd':
      case 'D':
        // Rotate right
        cameraState.value.targetAngleY += rotateSpeed
        break
      case 'q':
      case 'Q':
        // Rotate up
        cameraState.value.targetAngleX = Math.min(Math.PI/2 - 0.1, cameraState.value.targetAngleX + rotateSpeed)
        break
      case 'e':
      case 'E':
        // Rotate down
        cameraState.value.targetAngleX = Math.max(-Math.PI/2 + 0.1, cameraState.value.targetAngleX - rotateSpeed)
        break
      case 'r':
      case 'R':
        // Reset camera
        cameraState.value.targetDistance = 200
        cameraState.value.targetAngleX = 0
        cameraState.value.targetAngleY = 0
        break
    }
  }

  // Window resize handler
  p.windowResized = () => {
    p.resizeCanvas(props.width, props.height)
  }
}

// Helper functions
const setupLighting = (p) => {
  const lighting = sphereStore.lighting
  
  // Ambient light for overall illumination
  p.ambientLight(lighting.ambient * 255, lighting.ambient * 255, lighting.ambient * 255)
  
  // Main directional light (key light)
  p.directionalLight(
    lighting.directional * 255,
    lighting.directional * 255, 
    lighting.directional * 255,
    -0.5, 0.8, -1
  )
  
  // Secondary directional light for fill lighting
  p.directionalLight(
    lighting.directional * 100,
    lighting.directional * 100,
    lighting.directional * 120,
    0.5, -0.3, 0.5
  )
  
  // Point light for additional highlights
  p.pointLight(150, 150, 180, 100, -50, 150)
}

const drawCoordinateAxes = (p) => {
  const axisLength = 50
  
  // X axis - Red
  p.stroke(255, 0, 0)
  p.strokeWeight(2)
  p.line(0, 0, 0, axisLength, 0, 0)
  
  // Y axis - Green
  p.stroke(0, 255, 0)
  p.line(0, 0, 0, 0, axisLength, 0)
  
  // Z axis - Blue
  p.stroke(0, 0, 255)
  p.line(0, 0, 0, 0, 0, axisLength)
  
  // Reset stroke
  p.noStroke()
}

const isMouseInCanvas = (p) => {
  return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height
}

const updateCameraSmooth = () => {
  // Smooth camera interpolation with different speeds for different properties
  const distanceLerpFactor = 0.08  // Slightly slower for zoom
  const angleLerpFactor = 0.12     // Faster for rotation
  
  cameraState.value.distance = lerp(cameraState.value.distance, cameraState.value.targetDistance, distanceLerpFactor)
  cameraState.value.angleX = lerp(cameraState.value.angleX, cameraState.value.targetAngleX, angleLerpFactor)
  cameraState.value.angleY = lerp(cameraState.value.angleY, cameraState.value.targetAngleY, angleLerpFactor)
  
  // Apply bounds checking to actual values as well
  const maxAngle = Math.PI / 2 - 0.1
  cameraState.value.angleX = Math.max(-maxAngle, Math.min(maxAngle, cameraState.value.angleX))
  
  const minDistance = 30
  const maxDistance = 800
  cameraState.value.distance = Math.max(minDistance, Math.min(maxDistance, cameraState.value.distance))
}

const lerp = (start, end, factor) => {
  return start + (end - start) * factor
}

const updateCameraFromStore = () => {
  const cam = sphereStore.camera
  cameraState.value.targetAngleX = cam.rotation.x
  cameraState.value.targetAngleY = cam.rotation.y
  cameraState.value.angleX = cam.rotation.x
  cameraState.value.angleY = cam.rotation.y
}

const updateStoreCamera = () => {
  // Update store camera rotation to match current camera state
  sphereStore.updateCameraRotation(cameraState.value.angleX, cameraState.value.angleY)
}

// Lifecycle hooks
onMounted(() => {
  if (canvasContainer.value) {
    // Create P5.js instance
    p5Instance = new p5(sketch)
    
    // Add default sphere if scene is empty
    if (sphereStore.spheres.length === 0) {
      sphereStore.addSphere()
    }
  }
})

onUnmounted(() => {
  // Clean up P5.js instance
  if (p5Instance) {
    p5Instance.remove()
    p5Instance = null
  }
  sphereRenderer = null
})

// Watch for prop changes
watch(() => [props.width, props.height], () => {
  if (p5Instance) {
    p5Instance.resizeCanvas(props.width, props.height)
  }
})

// Watch for camera updates from store
watch(() => sphereStore.camera, () => {
  updateCameraFromStore()
}, { deep: true })

// Expose methods for parent components
defineExpose({
  getP5Instance: () => p5Instance,
  getSphereRenderer: () => sphereRenderer,
  resetCamera: () => {
    cameraState.value.targetDistance = 200
    cameraState.value.targetAngleX = 0
    cameraState.value.targetAngleY = 0
    cameraState.value.distance = 200
    cameraState.value.angleX = 0
    cameraState.value.angleY = 0
  },
  focusOnSphere: (sphereId) => {
    const sphere = sphereStore.getSphereById(sphereId)
    if (sphere) {
      // Update camera to focus on the sphere
      sphereStore.updateCameraPosition(sphere.position.x, sphere.position.y, sphere.position.z)
      cameraState.value.targetDistance = Math.max(100, sphere.radius * 3)
    }
  },
  getCameraState: () => cameraState.value
})
</script>