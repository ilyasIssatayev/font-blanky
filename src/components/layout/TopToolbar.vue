<script setup>
import { ref, computed } from 'vue'
import { useSphereStore } from '../../stores/sphereStore.js'

// Store
const sphereStore = useSphereStore()

// Toolbar state - sync with store
const isPlaying = computed({
  get: () => !sphereStore.isPaused,
  set: (value) => sphereStore.setPaused(!value)
})

// Toolbar functions connected to store actions
const togglePlayPause = () => {
  sphereStore.togglePause()
}

const reRender = () => {
  // Force a re-render by briefly pausing and resuming
  const wasPaused = sphereStore.isPaused
  sphereStore.setPaused(true)
  setTimeout(() => {
    sphereStore.setPaused(wasPaused)
  }, 100)
}

const resetScene = () => {
  if (confirm('Are you sure you want to reset the scene? This will remove all spheres.')) {
    sphereStore.resetScene()
    // Add a default sphere after reset
    setTimeout(() => {
      sphereStore.addSphere()
    }, 100)
  }
}

const addSphere = () => {
  // Add a new sphere with random position offset
  const randomOffset = () => (Math.random() - 0.5) * 100
  
  sphereStore.addSphere({
    position: {
      x: randomOffset(),
      y: randomOffset(),
      z: randomOffset()
    }
  })
}
</script>

<template>
  <div class="top-toolbar">
    <div class="toolbar-section toolbar-left">
      <h1 class="app-title">P5.js Sphere Editor</h1>
    </div>
    
    <div class="toolbar-section toolbar-center">
      <div class="button-group">
        <button 
          class="toolbar-button primary"
          @click="togglePlayPause"
          :title="isPlaying ? 'Pause rotation' : 'Play rotation'"
        >
          {{ isPlaying ? '⏸️' : '▶️' }}
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        
        <button 
          class="toolbar-button"
          @click="reRender"
          title="Re-render scene"
        >
          🔄 Re-render
        </button>
        
        <button 
          class="toolbar-button"
          @click="resetScene"
          title="Reset to defaults"
        >
          ↺ Reset
        </button>
      </div>
    </div>
    
    <div class="toolbar-section toolbar-right">
      <button 
        class="toolbar-button add-button"
        @click="addSphere"
        title="Add new sphere"
      >
        ➕ Add Sphere
      </button>
    </div>
  </div>
</template>