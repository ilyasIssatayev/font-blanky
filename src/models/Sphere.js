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
    this.radius = mathUtils.clamp(radius, 1, 200)
  }

  setRotationSpeed(speed) {
    this.rotationSpeed = mathUtils.clamp(speed, -5, 5)
  }

  setPosition(x, y, z) {
    this.position = { x, y, z }
  }

  setColors(startColor, endColor) {
    if (this.isValidColor(startColor)) this.colors.start = startColor
    if (this.isValidColor(endColor)) this.colors.end = endColor
  }

  isValidColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
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