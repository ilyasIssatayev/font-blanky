// Mathematical utility functions for 3D calculations
export const mathUtils = {
  // Math helper functions will go here
  
  generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  },

  // 3D vector operations
  vector3: {
    add(a, b) {
      return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
    },

    subtract(a, b) {
      return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
    },

    multiply(v, scalar) {
      return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
    },

    dot(a, b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
    },

    magnitude(v) {
      return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },

    normalize(v) {
      const mag = this.magnitude(v);
      if (mag === 0) return { x: 0, y: 0, z: 0 };
      return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
    },

    distance(a, b) {
      const diff = this.subtract(a, b);
      return this.magnitude(diff);
    }
  },

  // Ray casting utilities for 3D sphere selection
  rayCasting: {
    // Create a ray from camera through screen coordinates
    createRayFromScreen(mouseX, mouseY, canvasWidth, canvasHeight, camera, distance) {
      // Convert screen coordinates to normalized device coordinates (-1 to 1)
      const x = (2.0 * mouseX) / canvasWidth - 1.0;
      const y = 1.0 - (2.0 * mouseY) / canvasHeight;

      // Calculate camera position based on orbit controls
      const camX = camera.position.x + distance * Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x);
      const camY = camera.position.y + distance * Math.sin(camera.rotation.x);
      const camZ = camera.position.z + distance * Math.sin(camera.rotation.y) * Math.cos(camera.rotation.x);

      const rayOrigin = { x: camX, y: camY, z: camZ };

      // Calculate ray direction (simplified for orthographic-like projection)
      // This is an approximation - proper implementation would use projection matrices
      const rayDirection = mathUtils.vector3.normalize({
        x: x * 100 + (camera.position.x - camX),
        y: y * 100 + (camera.position.y - camY),
        z: camera.position.z - camZ
      });

      return { origin: rayOrigin, direction: rayDirection };
    },

    // Test ray-sphere intersection
    intersectRaySphere(ray, sphereCenter, sphereRadius) {
      const oc = mathUtils.vector3.subtract(ray.origin, sphereCenter);
      const a = mathUtils.vector3.dot(ray.direction, ray.direction);
      const b = 2.0 * mathUtils.vector3.dot(oc, ray.direction);
      const c = mathUtils.vector3.dot(oc, oc) - sphereRadius * sphereRadius;
      
      const discriminant = b * b - 4 * a * c;
      
      if (discriminant < 0) {
        return null; // No intersection
      }
      
      const sqrt_discriminant = Math.sqrt(discriminant);
      const t1 = (-b - sqrt_discriminant) / (2.0 * a);
      const t2 = (-b + sqrt_discriminant) / (2.0 * a);
      
      // Return the closest positive intersection
      const t = t1 > 0 ? t1 : (t2 > 0 ? t2 : null);
      
      if (t === null) return null;
      
      const intersectionPoint = mathUtils.vector3.add(
        ray.origin,
        mathUtils.vector3.multiply(ray.direction, t)
      );
      
      return {
        point: intersectionPoint,
        distance: t,
        normal: mathUtils.vector3.normalize(
          mathUtils.vector3.subtract(intersectionPoint, sphereCenter)
        )
      };
    },

    // Find the closest sphere that intersects with the ray
    findClosestSphereIntersection(ray, spheres) {
      let closestSphere = null;
      let closestDistance = Infinity;
      let closestIntersection = null;

      spheres.forEach(sphere => {
        if (!sphere.visible) return;

        const intersection = this.intersectRaySphere(ray, sphere.position, sphere.radius);
        if (intersection && intersection.distance < closestDistance) {
          closestDistance = intersection.distance;
          closestSphere = sphere;
          closestIntersection = intersection;
        }
      });

      return closestSphere ? { sphere: closestSphere, intersection: closestIntersection } : null;
    }
  }
}