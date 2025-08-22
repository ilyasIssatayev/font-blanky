// Scene model class for managing the 3D scene
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

  // Scene management methods
  addSphere(sphere) {
    this.spheres.push(sphere)
  }

  removeSphere(sphereId) {
    this.spheres = this.spheres.filter(sphere => sphere.id !== sphereId)
  }

  getSphere(sphereId) {
    return this.spheres.find(sphere => sphere.id === sphereId)
  }

  getVisibleSpheres() {
    return this.spheres.filter(sphere => sphere.visible)
  }

  getSelectedSphere() {
    return this.spheres.find(sphere => sphere.selected)
  }

  selectSphere(sphereId) {
    // Deselect all spheres first
    this.spheres.forEach(sphere => sphere.selected = false)
    // Select the target sphere
    const sphere = this.getSphere(sphereId)
    if (sphere) sphere.selected = true
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
  }

  // Serialize scene for export/save
  toJSON() {
    return {
      spheres: this.spheres.map(sphere => ({ ...sphere })),
      camera: { ...this.camera },
      lighting: { ...this.lighting },
      isPaused: this.isPaused
    }
  }

  // Load scene from JSON
  static fromJSON(data) {
    return new Scene(data)
  }
}