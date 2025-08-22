import { describe, it, expect, beforeEach } from 'vitest'
import { Sphere } from '../Sphere.js'

describe('Sphere Model', () => {
  let sphere

  beforeEach(() => {
    sphere = new Sphere()
  })

  describe('Constructor', () => {
    it('should create a sphere with default values', () => {
      expect(sphere.id).toBeDefined()
      expect(sphere.name).toMatch(/^Sphere \w{4}$/)
      expect(sphere.position).toEqual({ x: 0, y: 0, z: 0 })
      expect(sphere.radius).toBe(50)
      expect(sphere.rotation).toEqual({ x: 0, y: 0, z: 0 })
      expect(sphere.rotationSpeed).toBe(1)
      expect(sphere.colors).toEqual({
        start: '#ff6b6b',
        end: '#4ecdc4'
      })
      expect(sphere.material).toEqual({
        shininess: 100,
        metallic: 0.5
      })
      expect(sphere.visible).toBe(true)
      expect(sphere.selected).toBe(false)
    })

    it('should create a sphere with custom properties', () => {
      const customSphere = new Sphere({
        id: 'test-id',
        name: 'Test Sphere',
        position: { x: 10, y: 20, z: 30 },
        radius: 75,
        rotationSpeed: 2,
        colors: { start: '#ff0000', end: '#00ff00' },
        material: { shininess: 200, metallic: 0.8 },
        visible: false,
        selected: true
      })

      expect(customSphere.id).toBe('test-id')
      expect(customSphere.name).toBe('Test Sphere')
      expect(customSphere.position).toEqual({ x: 10, y: 20, z: 30 })
      expect(customSphere.radius).toBe(75)
      expect(customSphere.rotationSpeed).toBe(2)
      expect(customSphere.colors).toEqual({ start: '#ff0000', end: '#00ff00' })
      expect(customSphere.material).toEqual({ shininess: 200, metallic: 0.8 })
      expect(customSphere.visible).toBe(false)
      expect(customSphere.selected).toBe(true)
    })
  })

  describe('setRadius', () => {
    it('should set valid radius values', () => {
      sphere.setRadius(100)
      expect(sphere.radius).toBe(100)
    })

    it('should clamp radius to minimum value', () => {
      sphere.setRadius(-10)
      expect(sphere.radius).toBe(1)
    })

    it('should clamp radius to maximum value', () => {
      sphere.setRadius(300)
      expect(sphere.radius).toBe(200)
    })

    it('should throw error for non-numeric radius', () => {
      expect(() => sphere.setRadius('invalid')).toThrow('Radius must be a valid number')
      expect(() => sphere.setRadius(NaN)).toThrow('Radius must be a valid number')
    })

    it('should return sphere instance for chaining', () => {
      const result = sphere.setRadius(75)
      expect(result).toBe(sphere)
    })
  })

  describe('setRotationSpeed', () => {
    it('should set valid rotation speed values', () => {
      sphere.setRotationSpeed(3)
      expect(sphere.rotationSpeed).toBe(3)
    })

    it('should clamp rotation speed to minimum value', () => {
      sphere.setRotationSpeed(-10)
      expect(sphere.rotationSpeed).toBe(-5)
    })

    it('should clamp rotation speed to maximum value', () => {
      sphere.setRotationSpeed(10)
      expect(sphere.rotationSpeed).toBe(5)
    })

    it('should throw error for non-numeric rotation speed', () => {
      expect(() => sphere.setRotationSpeed('invalid')).toThrow('Rotation speed must be a valid number')
      expect(() => sphere.setRotationSpeed(NaN)).toThrow('Rotation speed must be a valid number')
    })

    it('should return sphere instance for chaining', () => {
      const result = sphere.setRotationSpeed(2)
      expect(result).toBe(sphere)
    })
  })

  describe('setPosition', () => {
    it('should set valid position values', () => {
      sphere.setPosition(10, 20, 30)
      expect(sphere.position).toEqual({ x: 10, y: 20, z: 30 })
    })

    it('should throw error for non-numeric coordinates', () => {
      expect(() => sphere.setPosition('x', 20, 30)).toThrow('Position coordinates must be valid numbers')
      expect(() => sphere.setPosition(10, 'y', 30)).toThrow('Position coordinates must be valid numbers')
      expect(() => sphere.setPosition(10, 20, 'z')).toThrow('Position coordinates must be valid numbers')
    })

    it('should throw error for NaN coordinates', () => {
      expect(() => sphere.setPosition(NaN, 20, 30)).toThrow('Position coordinates cannot be NaN')
      expect(() => sphere.setPosition(10, NaN, 30)).toThrow('Position coordinates cannot be NaN')
      expect(() => sphere.setPosition(10, 20, NaN)).toThrow('Position coordinates cannot be NaN')
    })

    it('should return sphere instance for chaining', () => {
      const result = sphere.setPosition(1, 2, 3)
      expect(result).toBe(sphere)
    })
  })

  describe('setColors', () => {
    it('should set valid hex colors', () => {
      sphere.setColors('#ff0000', '#00ff00')
      expect(sphere.colors.start).toBe('#ff0000')
      expect(sphere.colors.end).toBe('#00ff00')
    })

    it('should set valid short hex colors', () => {
      sphere.setColors('#f00', '#0f0')
      expect(sphere.colors.start).toBe('#f00')
      expect(sphere.colors.end).toBe('#0f0')
    })

    it('should set only start color when end color is not provided', () => {
      const originalEnd = sphere.colors.end
      sphere.setColors('#ff0000')
      expect(sphere.colors.start).toBe('#ff0000')
      expect(sphere.colors.end).toBe(originalEnd)
    })

    it('should set only end color when start color is not provided', () => {
      const originalStart = sphere.colors.start
      sphere.setColors(null, '#00ff00')
      expect(sphere.colors.start).toBe(originalStart)
      expect(sphere.colors.end).toBe('#00ff00')
    })

    it('should throw error for invalid hex colors', () => {
      expect(() => sphere.setColors('invalid', '#00ff00')).toThrow('Start color must be a valid hex color')
      expect(() => sphere.setColors('#ff0000', 'invalid')).toThrow('End color must be a valid hex color')
      expect(() => sphere.setColors('#gggggg', '#00ff00')).toThrow('Start color must be a valid hex color')
    })

    it('should return sphere instance for chaining', () => {
      const result = sphere.setColors('#ff0000', '#00ff00')
      expect(result).toBe(sphere)
    })
  })

  describe('setMaterial', () => {
    it('should set valid material properties', () => {
      sphere.setMaterial({ shininess: 500, metallic: 0.8 })
      expect(sphere.material.shininess).toBe(500)
      expect(sphere.material.metallic).toBe(0.8)
    })

    it('should set only shininess when provided', () => {
      const originalMetallic = sphere.material.metallic
      sphere.setMaterial({ shininess: 300 })
      expect(sphere.material.shininess).toBe(300)
      expect(sphere.material.metallic).toBe(originalMetallic)
    })

    it('should set only metallic when provided', () => {
      const originalShininess = sphere.material.shininess
      sphere.setMaterial({ metallic: 0.9 })
      expect(sphere.material.shininess).toBe(originalShininess)
      expect(sphere.material.metallic).toBe(0.9)
    })

    it('should clamp shininess to valid range', () => {
      sphere.setMaterial({ shininess: -100 })
      expect(sphere.material.shininess).toBe(0)
      
      sphere.setMaterial({ shininess: 2000 })
      expect(sphere.material.shininess).toBe(1000)
    })

    it('should clamp metallic to valid range', () => {
      sphere.setMaterial({ metallic: -0.5 })
      expect(sphere.material.metallic).toBe(0)
      
      sphere.setMaterial({ metallic: 1.5 })
      expect(sphere.material.metallic).toBe(1)
    })

    it('should throw error for non-numeric material properties', () => {
      expect(() => sphere.setMaterial({ shininess: 'invalid' })).toThrow('Shininess must be a valid number')
      expect(() => sphere.setMaterial({ metallic: 'invalid' })).toThrow('Metallic must be a valid number')
      expect(() => sphere.setMaterial({ shininess: NaN })).toThrow('Shininess must be a valid number')
      expect(() => sphere.setMaterial({ metallic: NaN })).toThrow('Metallic must be a valid number')
    })

    it('should return sphere instance for chaining', () => {
      const result = sphere.setMaterial({ shininess: 200 })
      expect(result).toBe(sphere)
    })
  })

  describe('setVisibility', () => {
    it('should set visibility to true', () => {
      sphere.setVisibility(true)
      expect(sphere.visible).toBe(true)
    })

    it('should set visibility to false', () => {
      sphere.setVisibility(false)
      expect(sphere.visible).toBe(false)
    })

    it('should throw error for non-boolean values', () => {
      expect(() => sphere.setVisibility('true')).toThrow('Visibility must be a boolean value')
      expect(() => sphere.setVisibility(1)).toThrow('Visibility must be a boolean value')
    })

    it('should return sphere instance for chaining', () => {
      const result = sphere.setVisibility(false)
      expect(result).toBe(sphere)
    })
  })

  describe('setSelection', () => {
    it('should set selection to true', () => {
      sphere.setSelection(true)
      expect(sphere.selected).toBe(true)
    })

    it('should set selection to false', () => {
      sphere.setSelection(false)
      expect(sphere.selected).toBe(false)
    })

    it('should throw error for non-boolean values', () => {
      expect(() => sphere.setSelection('true')).toThrow('Selection must be a boolean value')
      expect(() => sphere.setSelection(1)).toThrow('Selection must be a boolean value')
    })

    it('should return sphere instance for chaining', () => {
      const result = sphere.setSelection(true)
      expect(result).toBe(sphere)
    })
  })

  describe('isValidColor', () => {
    it('should validate correct hex colors', () => {
      expect(sphere.isValidColor('#ff0000')).toBe(true)
      expect(sphere.isValidColor('#FF0000')).toBe(true)
      expect(sphere.isValidColor('#f00')).toBe(true)
      expect(sphere.isValidColor('#F00')).toBe(true)
    })

    it('should reject invalid hex colors', () => {
      expect(sphere.isValidColor('ff0000')).toBe(false)
      expect(sphere.isValidColor('#gggggg')).toBe(false)
      expect(sphere.isValidColor('#ff00')).toBe(false)
      expect(sphere.isValidColor('#ff00000')).toBe(false)
      expect(sphere.isValidColor('red')).toBe(false)
      expect(sphere.isValidColor(123)).toBe(false)
      expect(sphere.isValidColor(null)).toBe(false)
    })
  })

  describe('validate', () => {
    it('should return valid for default sphere', () => {
      const result = sphere.validate()
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid radius', () => {
      sphere.radius = 0
      const result = sphere.validate()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Radius must be between 1 and 200')
    })

    it('should detect invalid rotation speed', () => {
      sphere.rotationSpeed = 10
      const result = sphere.validate()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Rotation speed must be between -5 and 5')
    })

    it('should detect invalid colors', () => {
      sphere.colors.start = 'invalid'
      sphere.colors.end = 'invalid'
      const result = sphere.validate()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Start color must be a valid hex color')
      expect(result.errors).toContain('End color must be a valid hex color')
    })

    it('should detect invalid position', () => {
      sphere.position.x = 'invalid'
      const result = sphere.validate()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Position coordinates must be valid numbers')
    })

    it('should detect invalid material properties', () => {
      sphere.material.shininess = -1
      sphere.material.metallic = 2
      const result = sphere.validate()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Shininess must be between 0 and 1000')
      expect(result.errors).toContain('Metallic must be between 0 and 1')
    })

    it('should detect multiple validation errors', () => {
      sphere.radius = 0
      sphere.rotationSpeed = 10
      sphere.colors.start = 'invalid'
      const result = sphere.validate()
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
    })
  })

  describe('clone', () => {
    it('should create a copy of the sphere', () => {
      sphere.setRadius(75)
      sphere.setColors('#ff0000', '#00ff00')
      sphere.setPosition(10, 20, 30)
      
      const cloned = sphere.clone()
      
      expect(cloned.id).not.toBe(sphere.id)
      expect(cloned.name).toBe(`${sphere.name} Copy`)
      expect(cloned.radius).toBe(sphere.radius)
      expect(cloned.colors).toEqual(sphere.colors)
      expect(cloned.position).toEqual(sphere.position)
      expect(cloned.selected).toBe(false)
    })

    it('should create independent copies', () => {
      const cloned = sphere.clone()
      cloned.setRadius(100)
      
      expect(sphere.radius).toBe(50)
      expect(cloned.radius).toBe(100)
    })
  })

  describe('Method chaining', () => {
    it('should allow method chaining', () => {
      const result = sphere
        .setRadius(75)
        .setRotationSpeed(2)
        .setPosition(10, 20, 30)
        .setColors('#ff0000', '#00ff00')
        .setMaterial({ shininess: 200, metallic: 0.8 })
        .setVisibility(false)
        .setSelection(true)

      expect(result).toBe(sphere)
      expect(sphere.radius).toBe(75)
      expect(sphere.rotationSpeed).toBe(2)
      expect(sphere.position).toEqual({ x: 10, y: 20, z: 30 })
      expect(sphere.colors).toEqual({ start: '#ff0000', end: '#00ff00' })
      expect(sphere.material).toEqual({ shininess: 200, metallic: 0.8 })
      expect(sphere.visible).toBe(false)
      expect(sphere.selected).toBe(true)
    })
  })
})