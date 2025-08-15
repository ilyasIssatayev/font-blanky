<template>
  <div class="home">
    <!-- Main Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="main-title">
          Find the car<br>
          <span class="highlight">that fits you the most</span>
        </h1>
        
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button 
            :class="['tab-btn', { active: activeTab === 'features' }]"
            @click="activeTab = 'features'"
          >
            Search by features
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'brand' }]"
            @click="activeTab = 'brand'"
          >
            Search by brand
          </button>
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps">
          <div class="step active">1</div>
          <div class="step-line"></div>
          <div class="step">2</div>
          <div class="step-line"></div>
          <div class="step">3</div>
          <div class="step-line"></div>
          <div class="step">4</div>
          <div class="step-line"></div>
          <div class="step">5</div>
        </div>

        <!-- Quiz Content -->
        <div class="quiz-content" v-if="activeTab === 'features'">
          <h2 class="question-title">What is your preferred type of car?</h2>
          <p class="question-subtitle">Select maximum 3 options</p>
          
          <div class="car-types-grid">
            <div 
              v-for="carType in carTypes" 
              :key="carType.id"
              :class="['car-type-card', { selected: selectedTypes.includes(carType.id) }]"
              @click="toggleCarType(carType.id)"
            >
              <div class="car-icon">
                <img :src="carType.icon" :alt="carType.name">
              </div>
              <span class="car-type-name">{{ carType.name }}</span>
            </div>
          </div>

          <div class="navigation-buttons">
            <button class="nav-btn prev" disabled>Previous</button>
            <button class="nav-btn next">Next</button>
          </div>
        </div>

        <!-- Brand Search Content -->
        <div class="brand-content" v-else>
          <h2 class="question-title">Search by brand</h2>
          <p class="question-subtitle">Choose your preferred car brand</p>
          
          <div class="brand-search">
            <input type="text" placeholder="Search for a brand..." class="brand-input">
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">Easy accessible and quick</h2>
        
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-icon">📋</div>
            <h3>Take a quiz</h3>
            <p>Whether you know what car you want, or you're not sure where you start, we're here to help you.</p>
          </div>
          
          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-icon">🔍</div>
            <h3>Compare</h3>
            <p>Let's compare the vehicles and their features</p>
          </div>
          
          <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-icon">🚗</div>
            <h3>Make a choice</h3>
            <p>Select the car and options that suit your needs</p>
          </div>
          
          <div class="step-card">
            <div class="step-number">4</div>
            <div class="step-icon">📞</div>
            <h3>Contact</h3>
            <p>Fill in your details to request a quote for the car of your choice</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq">
      <div class="container">
        <h2 class="section-title">Frequently asked questions</h2>
        
        <div class="faq-list">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            :class="['faq-item', { active: activeFaq === index }]"
            @click="toggleFaq(index)"
          >
            <div class="faq-question">
              {{ faq.question }}
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer" v-if="activeFaq === index">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Compare Section -->
    <section class="compare-section">
      <div class="container">
        <div class="compare-content">
          <div class="compare-icon">🔄</div>
          <h2>Let's compare cars</h2>
          <div class="compare-buttons">
            <button class="compare-btn outline">Search by brand</button>
            <button class="compare-btn filled">Search by features</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive data
const activeTab = ref('features')
const selectedTypes = ref([])
const activeFaq = ref(null)

const carTypes = ref([
  { id: 1, name: 'Sedan', icon: '/icons/sedan.svg' },
  { id: 2, name: 'SUV/Crossover', icon: '/icons/suv.svg' },
  { id: 3, name: 'Coupe', icon: '/icons/coupe.svg' },
  { id: 4, name: 'City car', icon: '/icons/city-car.svg' },
  { id: 5, name: 'Minivan', icon: '/icons/minivan.svg' },
  { id: 6, name: 'Station wagon', icon: '/icons/wagon.svg' },
  { id: 7, name: 'Hatch back', icon: '/icons/hatchback.svg' },
  { id: 8, name: 'Convertible', icon: '/icons/convertible.svg' }
])

const faqs = ref([
  {
    question: 'What is Autoselectr?',
    answer: 'Autoselectr is a car recommendation platform that helps you find the perfect vehicle based on your preferences and needs.'
  },
  {
    question: 'How does Autoselectr work?',
    answer: 'Simply take our quiz, compare vehicles, make your choice, and contact dealers for quotes.'
  },
  {
    question: 'Is there a fee for using Autoselectr?',
    answer: 'No, Autoselectr is completely free to use for consumers.'
  },
  {
    question: 'Where can I find more set ride and car purchasing tips and advice?',
    answer: 'Check out our blog and resources section for comprehensive car buying guides and tips.'
  }
])

// Methods
const toggleCarType = (typeId) => {
  const index = selectedTypes.value.indexOf(typeId)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else if (selectedTypes.value.length < 3) {
    selectedTypes.value.push(typeId)
  }
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  background: white;
  padding: 60px 20px;
  text-align: center;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 40px;
  line-height: 1.2;
}

.highlight {
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: #facc15;
  z-index: -1;
}

.tab-navigation {
  display: flex;
  gap: 0;
  margin: 40px auto;
  max-width: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tab-btn {
  flex: 1;
  padding: 15px 30px;
  border: none;
  background: #f8f9fa;
  color: #374151;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #2563eb;
  color: white;
}

.tab-btn:not(.active) {
  background: white;
  border: 1px solid #e5e7eb;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  gap: 20px;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  background: #d1d5db;
}

.step.active {
  background: #2563eb;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #d1d5db;
}

.quiz-content {
  max-width: 800px;
  margin: 0 auto;
}

.question-title {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
}

.question-subtitle {
  color: #6b7280;
  margin-bottom: 40px;
}

.car-types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.car-type-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.car-type-card:hover {
  border-color: #2563eb;
  transform: translateY(-2px);
}

.car-type-card.selected {
  border-color: #2563eb;
  background: #dbeafe;
}

.car-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.car-icon::before {
  content: '';
  display: block;
  width: 50px;
  height: 30px;
  background: #374151;
  border-radius: 8px;
  position: relative;
}

/* Different car type styles */
.car-type-card:nth-child(1) .car-icon::before { border-radius: 4px; } /* Sedan */
.car-type-card:nth-child(2) .car-icon::before { height: 35px; border-radius: 8px; } /* SUV */
.car-type-card:nth-child(3) .car-icon::before { height: 25px; border-radius: 12px; } /* Coupe */
.car-type-card:nth-child(4) .car-icon::before { width: 40px; height: 25px; border-radius: 6px; } /* City car */
.car-type-card:nth-child(5) .car-icon::before { height: 40px; border-radius: 4px; } /* Minivan */
.car-type-card:nth-child(6) .car-icon::before { border-radius: 2px; } /* Station wagon */
.car-type-card:nth-child(7) .car-icon::before { height: 28px; border-radius: 6px; } /* Hatchback */
.car-type-card:nth-child(8) .car-icon::before { height: 22px; border-radius: 15px; } /* Convertible */

.car-type-name {
  font-weight: 500;
  color: #374151;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.nav-btn {
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn.prev {
  background: #f3f4f6;
  color: #9ca3af;
  border: 1px solid #d1d5db;
}

.nav-btn.next {
  background: #2563eb;
  color: white;
  border: none;
}

.nav-btn.next:hover {
  background: #1d4ed8;
}

.brand-content {
  max-width: 600px;
  margin: 0 auto;
}

.brand-input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 20px;
}

.how-it-works {
  background: #f8f9fa;
  padding: 80px 20px;
}

.section-title {
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  color: #1f2937;
  margin-bottom: 60px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.step-card {
  text-align: center;
  position: relative;
}

.step-number {
  position: absolute;
  top: -10px;
  left: 20px;
  width: 30px;
  height: 30px;
  background: #facc15;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.step-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.step-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1f2937;
}

.step-card p {
  color: #6b7280;
  line-height: 1.6;
}

.faq {
  padding: 80px 20px;
  background: white;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 0;
  font-size: 18px;
  font-weight: 500;
  color: #1f2937;
}

.faq-toggle {
  font-size: 24px;
  color: #6b7280;
  transition: transform 0.2s;
}

.faq-item.active .faq-toggle {
  transform: rotate(45deg);
}

.faq-answer {
  padding-bottom: 25px;
  color: #6b7280;
  line-height: 1.6;
}

.compare-section {
  background: #f8f9fa;
  padding: 60px 20px;
}

.compare-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.compare-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.compare-content h2 {
  font-size: 32px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 30px;
}

.compare-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.compare-btn {
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.compare-btn.outline {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
}

.compare-btn.filled {
  background: #facc15;
  color: #1f2937;
  border: 2px solid #facc15;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  
  .car-types-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .compare-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .compare-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>