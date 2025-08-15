<template>
  <div class="car-card" @click="$emit('click')">
    <div class="car-image">
      <img :src="car.image" :alt="`${car.year} ${car.make} ${car.model}`" />
    </div>
    
    <div class="car-info">
      <h3 class="car-title">{{ car.year }} {{ car.make }} {{ car.model }}</h3>
      
      <div class="car-details">
        <div class="price">${{ car.price.toLocaleString() }}</div>
        <div class="mileage">{{ car.mileage.toLocaleString() }} miles</div>
      </div>
      
      <div class="location">
        📍 {{ car.location }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  car: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.car-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.car-image {
  height: 200px;
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-info {
  padding: 20px;
}

.car-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.car-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #059669;
}

.mileage {
  color: #6b7280;
  font-size: 14px;
}

.location {
  color: #6b7280;
  font-size: 14px;
}
</style>