import { mathUtils } from '../utils/mathUtils.js'

// Scene model class with spheres array and camera properties
export class Scene {
  constructor(properties = {}) {
    this.spheres = properties.spheres || []
    this.camera = properties.camera || {
      position: { x: 0, y: 0, z: 200 },
      rotation: { x: 0, y: 0 }
    }
    this.lighting = properties.lighting || {
      ambient: 0.3,
      directional: 0.7
    }
    this.isPaused = properties.isPaused || false
  }

  // Add a sphere to the scene
  addSphere(sphere) {
    if (!sphere || typeof sphere !== 'object') {
      throw new Error('Sphere must be a valid object')
    }
    this.spheres.push(sphere)
    return this
  }

  // Remove a sphere from the scene by ID
  removeSphere(sphereId) {
    if (!sphereId) {
      throw new Error('Sphere ID is required')
    }
    const index = this.spheres.findIndex(sphere => sphere.id === sphereId)
    if (index === -1) {
      throw new Error(`Sphere with ID ${sphereId} not found`)
    }
    this.spheres.splice(index, 1)
    return this
  }

  // Find a sphere by ID
  findSphere(sphereId) {
    if (!sphereId) {
      throw new Error('Sphere ID is required')
    }
    return this.spheres.find(sphere => sphere.id === sphereId)
  }

  // Get all visible spheres
  getVisibleSpheres() {
    return this.spheres.filter(sphere => sphere.visible)
  }

  // Get the currently selected sphere
  getSelectedSphere() {
    return this.spheres.find(sphere => sphere.selected)
  }

  // Clear all sphere selections
  clearSelections() {
    this.spheres.forEach(sphere => {
      sphere.selected = false
    })
    return this
  }

  // Select a sphere by ID (deselects others)
  selectSphere(sphereId) {
    if (!sphereId) {
      throw new Error('Sphere ID is required')
    }
    
    this.clearSelections()
    const sphere = this.findSphere(sphereId)
    if (!sphere) {
      throw new Error(`Sphere with ID ${sphereId} not found`)
    }
    
    sphere.selected = true
    return this
  }

  // Set camera position
  setCameraPosition(x, y, z) {
    if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
      throw new Error('Camera position coordinates must be valid numbers')
    }
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      throw new Error('Camera position coordinates cannot be NaN')
    }
    this.camera.position = { x, y, z }
    return this
  }

  // Set camera rotation
  setCameraRotation(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Camera rotation values must be valid numbers')
    }
    if (isNaN(x) || isNaN(y)) {
      throw new Error('Camera rotation values cannot be NaN')
    }
    this.camera.rotation = { x, y }
    return this
  }

  // Set lighting properties
  setLighting(ambient, directional) {
    if (ambient !== undefined) {
      if (typeof ambient !== 'number' || isNaN(ambient)) {
        throw new Error('Ambient lighting must be a valid number')
      }
      this.lighting.ambient = mathUtils.clamp(ambient, 0, 1)
    }
    
    if (directional !== undefined) {
      if (typeof directional !== 'number' || isNaN(directional)) {
        throw new Error('Directional lighting must be a valid number')
      }
      this.lighting.directional = mathUtils.clamp(directional, 0, 1)
    }
    
    return this
  }

  // Toggle pause state
  togglePause() {
    this.isPaused = !this.isPaused
    return this
  }

  // Set pause state
  setPaused(paused) {
    if (typeof paused !== 'boolean') {
      throw new Error('Paused state must be a boolean value')
    }
    this.isPaused = paused
    return this
  }

  // Reset scene to default state
  reset() {
    this.spheres = []
    this.camera = {
      position: { x: 0, y: 0, z: 200 },
      rotation: { x: 0, y: 0 }
    }
    this.lighting = {
      ambient: 0.3,
      directional: 0.7
    }
    this.isPaused = false
    return this
  }

  // Validate the scene
  validate() {
    const errors = []
    
    if (!Array.isArray(this.spheres)) {
      errors.push('Spheres must be an array')
    }
    
    if (!this.camera || typeof this.camera !== 'object') {
      errors.push('Camera must be an object')
    } else {
      if (!this.camera.position || typeof this.camera.position !== 'object') {
        errors.push('Camera position must be an object')
      }
      if (!this.camera.rotation || typeof this.camera.rotation !== 'object') {
        errors.push('Camera rotation must be an object')
      }
    }
    
    if (!this.lighting || typeof this.lighting !== 'object') {
      errors.push('Lighting must be an object')
    }
    
    if (typeof this.isPaused !== 'boolean') {
      errors.push('isPaused must be a boolean')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Create a copy of this scene
  clone() {
    return new Scene({
      spheres: this.spheres.map(sphere => sphere.clone()),
      camera: {
        position: { ...this.camera.position },
        rotation: { ...this.camera.rotation }
      },
      lighting: { ...this.lighting },
      isPaused: this.isPaused
    })
  }

  // Serialize scene to JSON
  toJSON() {
    return {
      spheres: this.spheres,
      camera: this.camera,
      lighting: this.lighting,
      isPaused: this.isPaused
    }
  }
}