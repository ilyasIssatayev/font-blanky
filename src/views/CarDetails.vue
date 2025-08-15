<template>
  <div class="car-details" v-if="car">
    <div class="container">
      <!-- Back button -->
      <button @click="$router.go(-1)" class="back-btn">
        ← Back to Search
      </button>
      
      <!-- Car header -->
      <div class="car-header">
        <h1>{{ car.year }} {{ car.make }} {{ car.model }}</h1>
        <div class="price">${{ car.price.toLocaleString() }}</div>
      </div>
      
      <!-- Car content -->
      <div class="car-content">
        <!-- Image gallery -->
        <div class="image-section">
          <div class="main-image">
            <img :src="car.image" :alt="`${car.year} ${car.make} ${car.model}`" />
          </div>
        </div>
        
        <!-- Car info -->
        <div class="info-section">
          <div class="info-card">
            <h3>Vehicle Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Year:</span>
                <span class="value">{{ car.year }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Make:</span>
                <span class="value">{{ car.make }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Model:</span>
                <span class="value">{{ car.model }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Mileage:</span>
                <span class="value">{{ car.mileage.toLocaleString() }} miles</span>
              </div>
              <div class="detail-item">
                <span class="label">Location:</span>
                <span class="value">{{ car.location }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Condition:</span>
                <span class="value">Excellent</span>
              </div>
            </div>
          </div>
          
          <div class="contact-card">
            <h3>Contact Dealer</h3>
            <p>Interested in this vehicle? Get in touch with the dealer.</p>
            <button class="contact-btn">Call Dealer</button>
            <button class="contact-btn secondary">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading">
    <div class="container">
      Loading car details...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const car = ref(null)

const loadCarDetails = async () => {
  // Mock car data based on ID
  const carId = parseInt(route.params.id)
  
  const mockCars = {
    1: {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 25000,
      mileage: 35000,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
      location: 'Los Angeles, CA'
    },
    2: {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      price: 22000,
      mileage: 28000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      location: 'San Francisco, CA'
    },
    3: {
      id: 3,
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      price: 35000,
      mileage: 15000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      location: 'New York, NY'
    },
    4: {
      id: 4,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2020,
      price: 38000,
      mileage: 22000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      location: 'Miami, FL'
    }
  }
  
  car.value = mockCars[carId] || mockCars[1]
}

onMounted(() => {
  loadCarDetails()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 8px 0;
}

.back-btn:hover {
  text-decoration: underline;
}

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.car-header h1 {
  font-size: 32px;
  color: #1f2937;
}

.car-header .price {
  font-size: 28px;
  font-weight: bold;
  color: #059669;
}

.car-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.image-section .main-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.image-section img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.info-card,
.contact-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.info-card h3,
.contact-card h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #1f2937;
}

.details-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6b7280;
}

.value {
  font-weight: 600;
  color: #1f2937;
}

.contact-card p {
  color: #6b7280;
  margin-bottom: 20px;
}

.contact-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}

.contact-btn:not(.secondary) {
  background: #2563eb;
  color: white;
}

.contact-btn:not(.secondary):hover {
  background: #1d4ed8;
}

.contact-btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.contact-btn.secondary:hover {
  background: #e5e7eb;
}

.loading {
  padding: 60px 20px;
  text-align: center;
  font-size: 18px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .car-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .car-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .image-section img {
    height: 250px;
  }
}
</style>