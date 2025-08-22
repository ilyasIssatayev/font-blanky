<template>
  <div class="property-panel">
    <div v-if="!selectedSphere" class="no-selection">
      <div class="no-selection-icon">🎯</div>
      <p class="no-selection-text">Select a sphere to edit its properties</p>
    </div>

    <div v-else class="property-sections">
      <!-- Sphere Info Section -->
      <div class="property-section">
        <h3 class="section-title">Sphere Properties</h3>
        
        <div class="property-group">
          <label class="property-label">Name</label>
          <input
            type="text"
            :value="selectedSphere.name"
            @input="updateSphereName"
            @blur="handleNameBlur"
            class="name-input"
            placeholder="Sphere name"
          />
        </div>

        <!-- Radius Control -->
        <SliderControl
          :model-value="selectedSphere.radius"
          @update:model-value="updateRadius"
          @change="handleRadiusChange"
          label="Radius"
          :min="1"
          :max="200"
          :step="1"
          :precision="0"
          unit="px"
          :debounce-ms="50"
        />

        <!-- Rotation Speed Control -->
        <SliderControl
          :model-value="selectedSphere.rotationSpeed"
          @update:model-value="updateRotationSpeed"
          @change="handleRotationSpeedChange"
          label="Rotation Speed"
          :min="-5"
          :max="5"
          :step="0.1"
          :precision="1"
          unit=" RPM"
          :debounce-ms="100"
        />
      </div>

      <!-- Position Section -->
      <div class="property-section">
        <h3 class="section-title">Position</h3>
        
        <!-- X Position -->
        <SliderControl
          :model-value="selectedSphere.position.x"
          @update:model-value="(value) => updatePosition('x', value)"
          @change="(value) => handlePositionChange('x', value)"
          label="X Position"
          :min="-300"
          :max="300"
          :step="1"
          :precision="0"
          :debounce-ms="50"
        />

        <!-- Y Position -->
        <SliderControl
          :model-value="selectedSphere.position.y"
          @update:model-value="(value) => updatePosition('y', value)"
          @change="(value) => handlePositionChange('y', value)"
          label="Y Position"
          :min="-300"
          :max="300"
          :step="1"
          :precision="0"
          :debounce-ms="50"
        />

        <!-- Z Position -->
        <SliderControl
          :model-value="selectedSphere.position.z"
          @update:model-value="(value) => updatePosition('z', value)"
          @change="(value) => handlePositionChange('z', value)"
          label="Z Position"
          :min="-300"
          :max="300"
          :step="1"
          :precision="0"
          :debounce-ms="50"
        />
      </div>

      <!-- Colors Section -->
      <div class="property-section">
        <h3 class="section-title">Colors</h3>
        
        <ColorPicker
          :model-value="selectedSphere.colors"
          @update:model-value="updateColors"
          @change="handleColorsChange"
          label="Gradient Colors"
          :gradient="true"
        />
      </div>

      <!-- Material Section -->
      <div class="property-section">
        <h3 class="section-title">Material</h3>
        
        <!-- Shininess Control -->
        <SliderControl
          :model-value="selectedSphere.material.shininess"
          @update:model-value="(value) => updateMaterial('shininess', value)"
          @change="(value) => handleMaterialChange('shininess', value)"
          label="Shininess"
          :min="0"
          :max="1000"
          :step="10"
          :precision="0"
          :debounce-ms="100"
        />

        <!-- Metallic Control -->
        <SliderControl
          :model-value="selectedSphere.material.metallic"
          @update:model-value="(value) => updateMaterial('metallic', value)"
          @change="(value) => handleMaterialChange('metallic', value)"
          label="Metallic"
          :min="0"
          :max="1"
          :step="0.01"
          :precision="2"
          :debounce-ms="100"
        />
      </div>

      <!-- Visibility Section -->
      <div class="property-section">
        <h3 class="section-title">Visibility</h3>
        
        <div class="property-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="selectedSphere.visible"
              @change="handleVisibilityChange"
              class="visibility-checkbox"
            />
            <span class="checkbox-text">Visible</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSphereStore } from '../../stores/sphereStore.js'
import SliderControl from './SliderControl.vue'
import ColorPicker from './ColorPicker.vue'

const sphereStore = useSphereStore()

// Computed properties
const selectedSphere = computed(() => sphereStore.selectedSphere)

// Event handlers for sphere properties
const updateSphereName = (event) => {
  if (!selectedSphere.value) return
  
  const name = event.target.value
  sphereStore.updateSphereProperty(selectedSphere.value.id, 'name', name)
}

const handleNameBlur = (event) => {
  if (!selectedSphere.value) return
  
  const name = event.target.value.trim()
  if (!name) {
    // Reset to original name if empty
    event.target.value = selectedSphere.value.name
  }
}

// Radius handlers
const updateRadius = (value) => {
  if (!selectedSphere.value) return
  sphereStore.updateSphereProperty(selectedSphere.value.id, 'radius', value)
}

const handleRadiusChange = (value) => {
  // Additional handling for radius change completion if needed
  console.log('Radius changed to:', value)
}

// Rotation speed handlers
const updateRotationSpeed = (value) => {
  if (!selectedSphere.value) return
  sphereStore.updateSphereProperty(selectedSphere.value.id, 'rotationSpeed', value)
}

const handleRotationSpeedChange = (value) => {
  // Additional handling for rotation speed change completion if needed
  console.log('Rotation speed changed to:', value)
}

// Position handlers
const updatePosition = (axis, value) => {
  if (!selectedSphere.value) return
  
  const newPosition = { ...selectedSphere.value.position }
  newPosition[axis] = value
  
  sphereStore.updateSphereProperty(selectedSphere.value.id, 'position', newPosition)
}

const handlePositionChange = (axis, value) => {
  // Additional handling for position change completion if needed
  console.log(`Position ${axis} changed to:`, value)
}

// Color handlers
const updateColors = (colors) => {
  if (!selectedSphere.value) return
  sphereStore.updateSphereProperty(selectedSphere.value.id, 'colors', colors)
}

const handleColorsChange = (colors) => {
  // Additional handling for color change completion if needed
  console.log('Colors changed to:', colors)
}

// Material handlers
const updateMaterial = (property, value) => {
  if (!selectedSphere.value) return
  
  const newMaterial = { ...selectedSphere.value.material }
  newMaterial[property] = value
  
  sphereStore.updateSphereProperty(selectedSphere.value.id, 'material', newMaterial)
}

const handleMaterialChange = (property, value) => {
  // Additional handling for material change completion if needed
  console.log(`Material ${property} changed to:`, value)
}

// Visibility handler
const handleVisibilityChange = (event) => {
  if (!selectedSphere.value) return
  
  const visible = event.target.checked
  sphereStore.updateSphereProperty(selectedSphere.value.id, 'visible', visible)
}
</script>

<script>
export default {
  name: 'PropertyPanel'
}
</script>