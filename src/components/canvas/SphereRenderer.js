// P5.js sphere rendering logic
export class SphereRenderer {
  constructor(p5Instance, sphereStore) {
    this.p = p5Instance
    this.store = sphereStore
    this.lastFrameTime = 0
  }

  // Main render method called from P5Canvas draw loop
  render() {
    if (!this.p || !this.store) return

    const currentTime = this.p.millis()
    const deltaTime = currentTime - this.lastFrameTime
    this.lastFrameTime = currentTime

    // Update sphere rotations if not paused
    if (!this.store.isPaused) {
      this.updateSphereRotations(deltaTime)
    }

    // Render all visible spheres
    const visibleSpheres = this.store.visibleSpheres
    visibleSpheres.forEach(sphere => {
      this.renderSphere(sphere)
    })
  }

  // Render a single sphere
  renderSphere(sphere) {
    this.p.push()

    // Apply sphere position
    this.p.translate(sphere.position.x, sphere.position.y, sphere.position.z)

    // Apply sphere rotation
    this.p.rotateX(sphere.rotation.x)
    this.p.rotateY(sphere.rotation.y)
    this.p.rotateZ(sphere.rotation.z)

    // Set material properties
    this.applySphereColors(sphere)

    // Draw selection indicator if selected (draw before sphere for proper layering)
    if (sphere.selected) {
      this.drawSelectionIndicator(sphere)
    }

    // Set sphere detail for smooth rendering
    this.p.detailX = 24 // Horizontal detail
    this.p.detailY = 16 // Vertical detail

    // Draw the sphere with smooth surface
    this.p.sphere(sphere.radius)

    this.p.pop()
  }

  // Apply sphere colors and material
  applySphereColors(sphere) {
    const startColor = this.hexToRgb(sphere.colors.start)
    const endColor = this.hexToRgb(sphere.colors.end)

    // Create gradient effect by interpolating colors based on sphere rotation
    // This creates a dynamic color shift as the sphere rotates
    const t = (Math.sin(sphere.rotation.y) + 1) / 2 // Normalize to 0-1
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * t)
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * t)
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * t)

    // Apply base material color
    this.p.fill(r, g, b)
    
    // Apply specular material for realistic lighting
    const specularIntensity = sphere.material.metallic * 255
    this.p.specularMaterial(specularIntensity, specularIntensity, specularIntensity)
    
    // Apply shininess
    this.p.shininess(sphere.material.shininess)
    
    // Add ambient material for better color representation
    this.p.ambientMaterial(r * 0.3, g * 0.3, b * 0.3)
  }

  // Draw selection indicator around sphere
  drawSelectionIndicator(sphere) {
    this.p.push()
    
    // Draw wireframe outline
    this.p.noFill()
    this.p.stroke(255, 255, 0) // Yellow selection color
    this.p.strokeWeight(2)
    
    // Draw slightly larger wireframe sphere
    const selectionRadius = sphere.radius + 5
    this.drawWireframeSphere(selectionRadius, 12, 8)
    
    this.p.pop()
  }

  // Draw wireframe sphere for selection indicator
  drawWireframeSphere(radius, segments, rings) {
    for (let i = 0; i < rings; i++) {
      const lat1 = this.p.map(i, 0, rings, -this.p.PI/2, this.p.PI/2)
      const lat2 = this.p.map(i + 1, 0, rings, -this.p.PI/2, this.p.PI/2)
      
      this.p.beginShape()
      for (let j = 0; j <= segments; j++) {
        const lng = this.p.map(j, 0, segments, 0, this.p.TWO_PI)
        
        const x1 = radius * this.p.cos(lat1) * this.p.cos(lng)
        const y1 = radius * this.p.sin(lat1)
        const z1 = radius * this.p.cos(lat1) * this.p.sin(lng)
        
        const x2 = radius * this.p.cos(lat2) * this.p.cos(lng)
        const y2 = radius * this.p.sin(lat2)
        const z2 = radius * this.p.cos(lat2) * this.p.sin(lng)
        
        this.p.vertex(x1, y1, z1)
        this.p.vertex(x2, y2, z2)
      }
      this.p.endShape()
    }
  }

  // Update sphere rotations based on rotation speed
  updateSphereRotations(deltaTime) {
    this.store.spheres.forEach(sphere => {
      if (sphere.rotationSpeed !== 0) {
        // Convert rotation speed to radians per second
        const rotationDelta = (sphere.rotationSpeed * deltaTime * this.p.TWO_PI) / 1000
        
        // Apply rotation primarily to Y axis for spinning effect
        sphere.rotation.y += rotationDelta
        
        // Add subtle rotation to X axis for more dynamic movement
        sphere.rotation.x += rotationDelta * 0.3
        
        // Keep rotation values in reasonable range to prevent overflow
        sphere.rotation.y = sphere.rotation.y % this.p.TWO_PI
        sphere.rotation.x = sphere.rotation.x % this.p.TWO_PI
        
        // Ensure negative values are handled correctly
        if (sphere.rotation.y < 0) sphere.rotation.y += this.p.TWO_PI
        if (sphere.rotation.x < 0) sphere.rotation.x += this.p.TWO_PI
      }
    })
  }

  // Convert hex color to RGB object
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 } // Default to white if invalid
  }

  // Get sphere at mouse position (for selection)
  getSphereAtPosition(mouseX, mouseY) {
    // This is a simplified version - proper 3D picking would use ray casting
    // For now, we'll implement basic distance-based selection
    const visibleSpheres = this.store.visibleSpheres
    let closestSphere = null
    let closestDistance = Infinity

    visibleSpheres.forEach(sphere => {
      // Project 3D position to 2D screen coordinates (simplified)
      const screenPos = this.worldToScreen(sphere.position)
      const distance = this.p.dist(mouseX, mouseY, screenPos.x, screenPos.y)
      
      // Check if click is within sphere bounds (approximate)
      const sphereScreenRadius = sphere.radius * 0.5 // Rough approximation
      
      if (distance < sphereScreenRadius && distance < closestDistance) {
        closestDistance = distance
        closestSphere = sphere
      }
    })

    return closestSphere
  }

  // Simple world to screen coordinate conversion (approximate)
  worldToScreen(worldPos) {
    // This is a simplified version - proper implementation would use camera matrices
    return {
      x: this.p.width / 2 + worldPos.x,
      y: this.p.height / 2 - worldPos.y
    }
  }
}