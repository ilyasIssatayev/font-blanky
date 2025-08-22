<script setup>
import { ref } from 'vue'

// Toolbar state
const isPlaying = ref(true)

// Placeholder functions - will be connected to store actions later
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
  console.log('Toggle play/pause:', isPlaying.value ? 'playing' : 'paused')
}

const reRender = () => {
  console.log('Re-render scene')
}

const resetScene = () => {
  console.log('Reset to defaults')
}

const addSphere = () => {
  console.log('Add new sphere')
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