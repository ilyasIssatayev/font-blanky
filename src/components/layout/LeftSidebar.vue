<script setup>
import { ref } from 'vue'

// Collapsible sections state
const sectionsCollapsed = ref({
  transform: false,
  appearance: false,
  material: false,
  layers: false
})

const toggleSection = (section) => {
  sectionsCollapsed.value[section] = !sectionsCollapsed.value[section]
}
</script>

<template>
  <div class="left-sidebar">
    <div class="sidebar-header">
      <h2>Properties</h2>
    </div>
    
    <div class="sidebar-content">
      <!-- Transform Section -->
      <div class="property-section">
        <div 
          class="section-header" 
          @click="toggleSection('transform')"
          :class="{ collapsed: sectionsCollapsed.transform }"
        >
          <span class="section-title">Transform</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="section-content" v-show="!sectionsCollapsed.transform">
          <div class="property-placeholder">
            <p>Radius, Position, Rotation controls will go here</p>
          </div>
        </div>
      </div>

      <!-- Appearance Section -->
      <div class="property-section">
        <div 
          class="section-header" 
          @click="toggleSection('appearance')"
          :class="{ collapsed: sectionsCollapsed.appearance }"
        >
          <span class="section-title">Appearance</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="section-content" v-show="!sectionsCollapsed.appearance">
          <div class="property-placeholder">
            <p>Color picker and gradient controls will go here</p>
          </div>
        </div>
      </div>

      <!-- Material Section -->
      <div class="property-section">
        <div 
          class="section-header" 
          @click="toggleSection('material')"
          :class="{ collapsed: sectionsCollapsed.material }"
        >
          <span class="section-title">Material</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="section-content" v-show="!sectionsCollapsed.material">
          <div class="property-placeholder">
            <p>Shininess, metallic controls will go here</p>
          </div>
        </div>
      </div>

      <!-- Layers Section -->
      <div class="property-section">
        <div 
          class="section-header" 
          @click="toggleSection('layers')"
          :class="{ collapsed: sectionsCollapsed.layers }"
        >
          <span class="section-title">Layers</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="section-content" v-show="!sectionsCollapsed.layers">
          <div class="property-placeholder">
            <p>Layers list will go here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>