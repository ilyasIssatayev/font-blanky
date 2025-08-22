import { mathUtils } from '../utils/mathUtils.js'

// Sphere model class with properties and validation
export class Sphere {
  constructor(properties = {}) {
    this.id = properties.id || mathUtils.generateUniqueId()
    this.name = properties.name || `Sphere ${this.id.slice(-4)}`
    this.position = properties.position || { x: 0, y: 0, z: 0 }
    this.radius = properties.radius || 50
    this.rotation = properties.rotation || { x: 0, y: 0, z: 0 }
    this.rotationSpeed = properties.rotationSpeed || 1
    this.colors = properties.colors || {
      start: '#ff6b6b',
      end: '#4ecdc4'
    }
    this.material = properties.material || {
      shininess: 100,
      metallic: 0.5
    }
    this.visible = properties.visible !== undefined ? properties.visible : true
    this.selected = properties.selected || false
  }

  // Property validation methods
  setRadius(radius) {
    if (typeof radius !== 'number' || isNaN(radius)) {
      throw new Error('Radius must be a valid number')
    }
    this.radius = mathUtils.clamp(radius, 1, 200)
    return this
  }

  setRotationSpeed(speed) {
    if (typeof speed !== 'number' || isNaN(speed)) {
      throw new Error('Rotation speed must be a valid number')
    }
    this.rotationSpeed = mathUtils.clamp(speed, -5, 5)
    return this
  }

  setPosition(x, y, z) {
    if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
      throw new Error('Position coordinates must be valid numbers')
    }
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      throw new Error('Position coordinates cannot be NaN')
    }
    this.position = { x, y, z }
    return this
  }

  setColors(startColor, endColor) {
    if (startColor && !this.isValidColor(startColor)) {
      throw new Error('Start color must be a valid hex color')
    }
    if (endColor && !this.isValidColor(endColor)) {
      throw new Error('End color must be a valid hex color')
    }
    if (startColor) this.colors.start = startColor
    if (endColor) this.colors.end = endColor
    return this
  }

  setMaterial(properties) {
    if (properties.shininess !== undefined) {
      if (typeof properties.shininess !== 'number' || isNaN(properties.shininess)) {
        throw new Error('Shininess must be a valid number')
      }
      this.material.shininess = mathUtils.clamp(properties.shininess, 0, 1000)
    }
    if (properties.metallic !== undefined) {
      if (typeof properties.metallic !== 'number' || isNaN(properties.metallic)) {
        throw new Error('Metallic must be a valid number')
      }
      this.material.metallic = mathUtils.clamp(properties.metallic, 0, 1)
    }
    return this
  }

  setVisibility(visible) {
    if (typeof visible !== 'boolean') {
      throw new Error('Visibility must be a boolean value')
    }
    this.visible = visible
    return this
  }

  setSelection(selected) {
    if (typeof selected !== 'boolean') {
      throw new Error('Selection must be a boolean value')
    }
    this.selected = selected
    return this
  }

  isValidColor(color) {
    return typeof color === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
  }

  // Validation method to check if all properties are valid
  validate() {
    const errors = []
    
    if (typeof this.radius !== 'number' || this.radius < 1 || this.radius > 200) {
      errors.push('Radius must be between 1 and 200')
    }
    
    if (typeof this.rotationSpeed !== 'number' || this.rotationSpeed < -5 || this.rotationSpeed > 5) {
      errors.push('Rotation speed must be between -5 and 5')
    }
    
    if (!this.isValidColor(this.colors.start)) {
      errors.push('Start color must be a valid hex color')
    }
    
    if (!this.isValidColor(this.colors.end)) {
      errors.push('End color must be a valid hex color')
    }
    
    if (typeof this.position.x !== 'number' || typeof this.position.y !== 'number' || typeof this.position.z !== 'number') {
      errors.push('Position coordinates must be valid numbers')
    }
    
    if (typeof this.material.shininess !== 'number' || this.material.shininess < 0 || this.material.shininess > 1000) {
      errors.push('Shininess must be between 0 and 1000')
    }
    
    if (typeof this.material.metallic !== 'number' || this.material.metallic < 0 || this.material.metallic > 1) {
      errors.push('Metallic must be between 0 and 1')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Create a copy of this sphere
  clone() {
    return new Sphere({
      ...this,
      id: mathUtils.generateUniqueId(),
      name: `${this.name} Copy`,
      selected: false
    })
  }
}