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

    magnitude(v) {
      return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
  }
}