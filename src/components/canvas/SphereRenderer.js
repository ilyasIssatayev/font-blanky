// P5.js sphere rendering logic
import { mathUtils } from '../../utils/mathUtils.js'

export class SphereRenderer {
  constructor(p5Instance, sphereStore) {
    this.p = p5Instance
    this.store = sphereStore
    this.lastFrameTime = 0
  }

  // Main render method called from P5Canvas draw loop
  render(dragState = null) {
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
      const isDragging = dragState && dragState.isDraggingSphere && 
                        dragState.draggedSphere && 
                        dragState.draggedSphere.id === sphere.id
      this.renderSphere(sphere, isDragging)
    })
  }

  // Render a single sphere
  renderSphere(sphere, isDragging = false) {
    this.p.push()

    // Apply sphere position
    this.p.translate(sphere.position.x, sphere.position.y, sphere.position.z)

    // Apply sphere rotation
    this.p.rotateX(sphere.rotation.x)
    this.p.rotateY(sphere.rotation.y)
    this.p.rotateZ(sphere.rotation.z)

    // Set material properties
    this.applySphereColors(sphere, isDragging)

    // Draw selection indicator if selected (draw before sphere for proper layering)
    if (sphere.selected) {
      this.drawSelectionIndicator(sphere, isDragging)
    }

    // Draw drag indicator if being dragged
    if (isDragging) {
      this.drawDragIndicator(sphere)
    }

    // Set sphere detail for smooth rendering
    this.p.detailX = 24 // Horizontal detail
    this.p.detailY = 16 // Vertical detail

    // Draw the sphere with smooth surface
    this.p.sphere(sphere.radius)

    this.p.pop()
  }

  // Apply sphere colors and material
  applySphereColors(sphere, isDragging = false) {
    const startColor = this.hexToRgb(sphere.colors.start)
    const endColor = this.hexToRgb(sphere.colors.end)

    // Create gradient effect by interpolating colors based on sphere rotation
    // This creates a dynamic color shift as the sphere rotates
    const t = (Math.sin(sphere.rotation.y) + 1) / 2 // Normalize to 0-1
    let r = Math.round(startColor.r + (endColor.r - startColor.r) * t)
    let g = Math.round(startColor.g + (endColor.g - startColor.g) * t)
    let b = Math.round(startColor.b + (endColor.b - startColor.b) * t)

    // Brighten colors when dragging for visual feedback
    if (isDragging) {
      const brightenFactor = 1.3
      r = Math.min(255, Math.round(r * brightenFactor))
      g = Math.min(255, Math.round(g * brightenFactor))
      b = Math.min(255, Math.round(b * brightenFactor))
    }

    // Apply base material color
    this.p.fill(r, g, b)
    
    // Apply specular material for realistic lighting
    const specularIntensity = sphere.material.metallic * 255
    this.p.specularMaterial(specularIntensity, specularIntensity, specularIntensity)
    
    // Apply shininess (increase when dragging for more shine)
    const shininess = isDragging ? sphere.material.shininess * 1.5 : sphere.material.shininess
    this.p.shininess(shininess)
    
    // Add ambient material for better color representation
    this.p.ambientMaterial(r * 0.3, g * 0.3, b * 0.3)
  }

  // Draw selection indicator around sphere
  drawSelectionIndicator(sphere, isDragging = false) {
    this.p.push()
    
    // Draw animated selection ring
    const time = this.p.millis() * 0.003;
    const pulseScale = 1 + Math.sin(time * 2) * 0.1; // Pulsing effect
    
    // Use different colors when dragging
    const selectionColor = isDragging ? [0, 255, 255] : [255, 255, 0]; // Cyan when dragging, yellow when selected
    
    // Outer glow ring
    this.p.noFill()
    this.p.stroke(selectionColor[0], selectionColor[1], selectionColor[2], 150) // Semi-transparent
    this.p.strokeWeight(isDragging ? 4 : 3)
    
    const outerRadius = (sphere.radius + 8) * pulseScale;
    this.drawWireframeSphere(outerRadius, 16, 12);
    
    // Inner selection ring
    this.p.stroke(selectionColor[0], selectionColor[1], selectionColor[2], 255) // Solid color
    this.p.strokeWeight(isDragging ? 3 : 2)
    
    const innerRadius = sphere.radius + 3;
    this.drawWireframeSphere(innerRadius, 12, 8);
    
    // Selection highlight points
    this.p.fill(selectionColor[0], selectionColor[1], selectionColor[2], 200)
    this.p.noStroke()
    
    // Draw small highlight spheres at cardinal points
    const highlightPositions = [
      { x: sphere.radius + 6, y: 0, z: 0 },
      { x: -(sphere.radius + 6), y: 0, z: 0 },
      { x: 0, y: sphere.radius + 6, z: 0 },
      { x: 0, y: -(sphere.radius + 6), z: 0 },
      { x: 0, y: 0, z: sphere.radius + 6 },
      { x: 0, y: 0, z: -(sphere.radius + 6) }
    ];
    
    highlightPositions.forEach(pos => {
      this.p.push();
      this.p.translate(pos.x, pos.y, pos.z);
      this.p.sphere((isDragging ? 3 : 2) * pulseScale);
      this.p.pop();
    });
    
    this.p.pop()
  }

  // Draw drag indicator for sphere being dragged
  drawDragIndicator(sphere) {
    this.p.push()
    
    // Draw motion trails/ghost effect
    this.p.noFill()
    this.p.stroke(0, 255, 255, 100) // Semi-transparent cyan
    this.p.strokeWeight(1)
    
    // Draw multiple ghost spheres with decreasing opacity
    for (let i = 1; i <= 3; i++) {
      const offset = i * 2
      const alpha = 100 / i
      
      this.p.stroke(0, 255, 255, alpha)
      this.p.translate(0, 0, -offset)
      this.drawWireframeSphere(sphere.radius + i, 8, 6)
    }
    
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

  // Get sphere at mouse position using ray casting
  getSphereAtPosition(mouseX, mouseY, camera, cameraDistance) {
    // Create ray from camera through mouse position
    const ray = mathUtils.rayCasting.createRayFromScreen(
      mouseX, 
      mouseY, 
      this.p.width, 
      this.p.height, 
      camera, 
      cameraDistance
    );

    // Find closest sphere intersection
    const result = mathUtils.rayCasting.findClosestSphereIntersection(ray, this.store.visibleSpheres);
    
    return result ? result.sphere : null;
  }

  // Get sphere at mouse position (synchronous version for immediate use)
  getSphereAtPositionSync(mouseX, mouseY, camera, cameraDistance) {
    // Simplified ray casting for immediate use
    const visibleSpheres = this.store.visibleSpheres;
    
    // Convert screen coordinates to normalized device coordinates
    const x = (2.0 * mouseX) / this.p.width - 1.0;
    const y = 1.0 - (2.0 * mouseY) / this.p.height;

    // Calculate camera position
    const camX = camera.position.x + cameraDistance * Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x);
    const camY = camera.position.y + cameraDistance * Math.sin(camera.rotation.x);
    const camZ = camera.position.z + cameraDistance * Math.sin(camera.rotation.y) * Math.cos(camera.rotation.x);

    const rayOrigin = { x: camX, y: camY, z: camZ };
    const rayDirection = {
      x: x * 100 + (camera.position.x - camX),
      y: y * 100 + (camera.position.y - camY),
      z: camera.position.z - camZ
    };

    // Normalize ray direction
    const rayMag = Math.sqrt(rayDirection.x * rayDirection.x + rayDirection.y * rayDirection.y + rayDirection.z * rayDirection.z);
    if (rayMag > 0) {
      rayDirection.x /= rayMag;
      rayDirection.y /= rayMag;
      rayDirection.z /= rayMag;
    }

    let closestSphere = null;
    let closestDistance = Infinity;

    visibleSpheres.forEach(sphere => {
      // Ray-sphere intersection test
      const oc = {
        x: rayOrigin.x - sphere.position.x,
        y: rayOrigin.y - sphere.position.y,
        z: rayOrigin.z - sphere.position.z
      };

      const a = rayDirection.x * rayDirection.x + rayDirection.y * rayDirection.y + rayDirection.z * rayDirection.z;
      const b = 2.0 * (oc.x * rayDirection.x + oc.y * rayDirection.y + oc.z * rayDirection.z);
      const c = (oc.x * oc.x + oc.y * oc.y + oc.z * oc.z) - sphere.radius * sphere.radius;

      const discriminant = b * b - 4 * a * c;

      if (discriminant >= 0) {
        const sqrt_discriminant = Math.sqrt(discriminant);
        const t1 = (-b - sqrt_discriminant) / (2.0 * a);
        const t2 = (-b + sqrt_discriminant) / (2.0 * a);

        const t = t1 > 0 ? t1 : (t2 > 0 ? t2 : null);

        if (t !== null && t < closestDistance) {
          closestDistance = t;
          closestSphere = sphere;
        }
      }
    });

    return closestSphere;
  }
}