<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TopToolbar from './TopToolbar.vue'
import LeftSidebar from './LeftSidebar.vue'
import CanvasArea from './CanvasArea.vue'

// Panel resizing state (placeholder for future implementation)
const sidebarWidth = ref(300)
const isResizing = ref(false)

// Mobile sidebar state
const isMobileSidebarOpen = ref(false)
const windowWidth = ref(0)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

// Window resize handler
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Panel resizing functionality (basic implementation)
const startResize = (event) => {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (event) => {
  if (!isResizing.value) return
  
  const newWidth = Math.max(200, Math.min(500, event.clientX))
  sidebarWidth.value = newWidth
  document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`)
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

onMounted(() => {
  // Set initial sidebar width
  document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth.value}px`)
  
  // Set initial window width and add resize listener
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  // Clean up resize listener
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<template>
  <div class="main-layout">
    <TopToolbar />
    
    <LeftSidebar 
      :class="{ 'mobile-open': isMobileSidebarOpen }"
    />
    
    <!-- Resize handle for desktop -->
    <div 
      class="resize-handle"
      @mousedown="startResize"
      v-show="!isMobileSidebarOpen"
    ></div>
    
    <CanvasArea />
    
    <!-- Mobile sidebar overlay -->
    <div 
      class="mobile-overlay"
      v-show="isMobileSidebarOpen"
      @click="toggleMobileSidebar"
    ></div>
    
    <!-- Mobile sidebar toggle button -->
    <button 
      class="mobile-sidebar-toggle"
      @click="toggleMobileSidebar"
      v-show="windowWidth <= 768"
    >
      ☰
    </button>
  </div>
</template>

<style scoped>
.resize-handle {
  position: absolute;
  left: var(--sidebar-width);
  top: var(--toolbar-height);
  width: var(--panel-resize-handle);
  height: calc(100vh - var(--toolbar-height));
  z-index: 10;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.mobile-sidebar-toggle {
  position: fixed;
  top: calc(var(--toolbar-height) + var(--spacing-md));
  left: var(--spacing-md);
  z-index: 1001;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-hover);
    transform: scale(1.05);
  }
}

@media (min-width: 769px) {
  .mobile-sidebar-toggle {
    display: none;
  }
}
</style>