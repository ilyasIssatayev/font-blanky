<template>
  <div class="color-picker">
    <label class="color-picker-label">{{ label }}</label>
    
    <!-- Single color mode -->
    <div v-if="!gradient" class="single-color-picker">
      <div class="color-input-group">
        <div 
          class="color-preview" 
          :style="{ backgroundColor: modelValue }"
          @click="openColorInput"
        ></div>
        <input
          ref="colorInput"
          type="color"
          :value="modelValue"
          @input="handleColorChange"
          @change="handleColorChange"
          class="color-input-hidden"
        />
        <input
          type="text"
          :value="modelValue"
          @input="handleHexInput"
          @blur="validateHexInput"
          class="hex-input"
          placeholder="#ffffff"
          maxlength="7"
        />
      </div>
    </div>

    <!-- Gradient color mode -->
    <div v-else class="gradient-color-picker">
      <div class="gradient-preview" :style="gradientStyle"></div>
      
      <div class="gradient-controls">
        <div class="color-stop">
          <label class="color-stop-label">Start Color</label>
          <div class="color-input-group">
            <div 
              class="color-preview" 
              :style="{ backgroundColor: modelValue.start }"
              @click="() => openColorInput('start')"
            ></div>
            <input
              ref="startColorInput"
              type="color"
              :value="modelValue.start"
              @input="(e) => handleGradientColorChange('start', e)"
              @change="(e) => handleGradientColorChange('start', e)"
              class="color-input-hidden"
            />
            <input
              type="text"
              :value="modelValue.start"
              @input="(e) => handleGradientHexInput('start', e)"
              @blur="(e) => validateGradientHexInput('start', e)"
              class="hex-input"
              placeholder="#ff6b6b"
              maxlength="7"
            />
          </div>
        </div>

        <div class="color-stop">
          <label class="color-stop-label">End Color</label>
          <div class="color-input-group">
            <div 
              class="color-preview" 
              :style="{ backgroundColor: modelValue.end }"
              @click="() => openColorInput('end')"
            ></div>
            <input
              ref="endColorInput"
              type="color"
              :value="modelValue.end"
              @input="(e) => handleGradientColorChange('end', e)"
              @change="(e) => handleGradientColorChange('end', e)"
              class="color-input-hidden"
            />
            <input
              type="text"
              :value="modelValue.end"
              @input="(e) => handleGradientHexInput('end', e)"
              @blur="(e) => validateGradientHexInput('end', e)"
              class="hex-input"
              placeholder="#4ecdc4"
              maxlength="7"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  gradient: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const colorInput = ref(null)
const startColorInput = ref(null)
const endColorInput = ref(null)

// Computed properties
const gradientStyle = computed(() => {
  if (!props.gradient || !props.modelValue) return {}
  
  return {
    background: `linear-gradient(90deg, ${props.modelValue.start} 0%, ${props.modelValue.end} 100%)`
  }
})

// Utility functions
const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

const normalizeHexColor = (color) => {
  if (!color.startsWith('#')) {
    color = '#' + color
  }
  
  // Convert 3-digit hex to 6-digit
  if (color.length === 4) {
    color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
  }
  
  return color.toLowerCase()
}

// Single color handlers
const openColorInput = (type = null) => {
  if (props.disabled) return
  
  if (type === 'start' && startColorInput.value) {
    startColorInput.value.click()
  } else if (type === 'end' && endColorInput.value) {
    endColorInput.value.click()
  } else if (colorInput.value) {
    colorInput.value.click()
  }
}

const handleColorChange = (event) => {
  const color = event.target.value
  emit('update:modelValue', color)
  emit('change', color)
}

const handleHexInput = (event) => {
  let value = event.target.value
  
  // Auto-add # if missing
  if (value && !value.startsWith('#')) {
    value = '#' + value
    event.target.value = value
  }
  
  if (isValidHexColor(value)) {
    emit('update:modelValue', normalizeHexColor(value))
  }
}

const validateHexInput = (event) => {
  const value = event.target.value
  
  if (!isValidHexColor(value)) {
    // Reset to current valid value
    event.target.value = props.modelValue
  } else {
    const normalizedColor = normalizeHexColor(value)
    emit('update:modelValue', normalizedColor)
    emit('change', normalizedColor)
  }
}

// Gradient color handlers
const handleGradientColorChange = (type, event) => {
  const color = event.target.value
  const newValue = { ...props.modelValue }
  newValue[type] = color
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleGradientHexInput = (type, event) => {
  let value = event.target.value
  
  // Auto-add # if missing
  if (value && !value.startsWith('#')) {
    value = '#' + value
    event.target.value = value
  }
  
  if (isValidHexColor(value)) {
    const newValue = { ...props.modelValue }
    newValue[type] = normalizeHexColor(value)
    emit('update:modelValue', newValue)
  }
}

const validateGradientHexInput = (type, event) => {
  const value = event.target.value
  
  if (!isValidHexColor(value)) {
    // Reset to current valid value
    event.target.value = props.modelValue[type]
  } else {
    const normalizedColor = normalizeHexColor(value)
    const newValue = { ...props.modelValue }
    newValue[type] = normalizedColor
    
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}
</script>

<script>
export default {
  name: 'ColorPicker'
}
</script>