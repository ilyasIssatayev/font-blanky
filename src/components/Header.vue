<template>
  <header class="header">
    <div class="container">
      <router-link to="/" class="logo">
        autoselectr.
      </router-link>
      
      <nav class="nav">
        <router-link to="/" class="nav-link home-btn">Home</router-link>
        <div class="language-selector">
          <span class="flag">🇺🇸</span>
          <span>EN</span>
          <span class="dropdown-arrow">▼</span>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.home-btn {
  background: #facc15;
  color: #1f2937;
  padding: 8px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.home-btn:hover {
  background: #eab308;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.flag {
  font-size: 16px;
}

.dropdown-arrow {
  font-size: 10px;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .language-selector {
    display: none;
  }
}
</style>