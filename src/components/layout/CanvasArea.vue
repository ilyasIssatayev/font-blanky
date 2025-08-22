<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import P5Canvas from '../canvas/P5Canvas.vue'

// Canvas dimensions
const canvasContainer = ref(null)
const canvasWidth = ref(800)
const canvasHeight = ref(600)

// Update canvas size based on container
const updateCanvasSize = () => {
  if (canvasContainer.value) {
    const rect = canvasContainer.value.getBoundingClientRect()
    canvasWidth.value = Math.max(400, rect.width - 20) // Leave some padding
    canvasHeight.value = Math.max(300, rect.height - 20)
  }
}

// Handle sphere selection events
const handleSphereSelected = (sphere) => {
  console.log('Sphere selected:', sphere.name)
}

// Handle camera update events
const handleCameraUpdated = (cameraState) => {
  console.log('Camera updated:', cameraState)
}

onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<template>
  <div class="canvas-area" ref="canvasContainer">
    <div class="canvas-container">
      <P5Canvas 
        :width="canvasWidth"
        :height="canvasHeight"
        @sphere-selected="handleSphereSelected"
        @camera-updated="handleCameraUpdated"
      />
    </div>
  </div>
</template>

<style scoped>
@import '../../styles/layout/canvasArea.scss';
</style>