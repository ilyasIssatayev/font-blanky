<template>
  <div class="slider-control">
    <label :for="inputId" class="slider-label">
      {{ label }}
      <span class="slider-value">{{ displayValue }}</span>
    </label>
    <div class="slider-container">
      <input
        :id="inputId"
        ref="sliderInput"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="handleInput"
        @change="handleChange"
        class="slider-input"
        :disabled="disabled"
      />
      <div class="slider-track">
        <div 
          class="slider-fill" 
          :style="{ width: fillPercentage + '%' }"
        ></div>
      </div>
    </div>
    <div class="slider-bounds">
      <span class="min-value">{{ min }}</span>
      <span class="max-value">{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  debounceMs: {
    type: Number,
    default: 100
  },
  precision: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const sliderInput = ref(null)
const debounceTimer = ref(null)
const inputId = computed(() => `slider-${Math.random().toString(36).substr(2, 9)}`)

// Computed properties
const fillPercentage = computed(() => {
  const range = props.max - props.min
  const value = props.modelValue - props.min
  return (value / range) * 100
})

const displayValue = computed(() => {
  const value = Number(props.modelValue).toFixed(props.precision)
  return props.unit ? `${value}${props.unit}` : value
})

// Event handlers
const handleInput = (event) => {
  const value = parseFloat(event.target.value)
  
  // Clear existing debounce timer
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  // Emit immediate update for UI responsiveness
  emit('update:modelValue', value)
  
  // Debounced change event for expensive operations
  debounceTimer.value = setTimeout(() => {
    emit('change', value)
  }, props.debounceMs)
}

const handleChange = (event) => {
  const value = parseFloat(event.target.value)
  
  // Clear debounce timer since change event is final
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
    debounceTimer.value = null
  }
  
  emit('change', value)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (sliderInput.value && parseFloat(sliderInput.value.value) !== newValue) {
    sliderInput.value.value = newValue
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>

<script>
export default {
  name: 'SliderControl'
}
</script>