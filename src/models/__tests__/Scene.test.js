import { describe, it, expect, beforeEach } from 'vitest'
import { Scene } from '../Scene.js'
import { Sphere } from '../Sphere.js'

describe('Scene', () => {
  let scene
  let sphere1
  let sphere2

  beforeEach(() => {
    scene = new Scene()
    sphere1 = new Sphere({ id: 'sphere1', name: 'Test Sphere 1' })
    sphere2 = new Sphere({ id: 'sphere2', name: 'Test Sphere 2' })
  })

  describe('constructor', () => {
    it('should create a scene with default properties', () => {
      expect(scene.spheres).toEqual([])
      expect(scene.camera.position).toEqual({ x: 0, y: 0, z: 200 })
      expect(scene.camera.rotation).toEqual({ x: 0, y: 0 })
      expect(scene.lighting.ambient).toBe(0.3)
      expect(scene.lighting.directional).toBe(0.7)
      expect(scene.isPaused).toBe(false)
    })

    it('should create a scene with custom properties', () => {
      const customScene = new Scene({
        spheres: [sphere1],
        camera: { position: { x: 10, y: 20, z: 30 }, rotation: { x: 1, y: 2 } },
        lighting: { ambient: 0.5, directional: 0.8 },
        isPaused: true
      })

      expect(customScene.spheres).toHaveLength(1)
      expect(customScene.camera.position).toEqual({ x: 10, y: 20, z: 30 })
      expect(customScene.lighting.ambient).toBe(0.5)
      expect(customScene.isPaused).toBe(true)
    })
  })

  describe('sphere management', () => {
    it('should add a sphere to the scene', () => {
      scene.addSphere(sphere1)
      expect(scene.spheres).toHaveLength(1)
      expect(scene.spheres[0]).toBe(sphere1)
    })

    it('should throw error when adding invalid sphere', () => {
      expect(() => scene.addSphere(null)).toThrow('Sphere must be a valid object')
      expect(() => scene.addSphere('invalid')).toThrow('Sphere must be a valid object')
    })

    it('should remove a sphere by ID', () => {
      scene.addSphere(sphere1)
      scene.addSphere(sphere2)
      
      scene.removeSphere('sphere1')
      expect(scene.spheres).toHaveLength(1)
      expect(scene.spheres[0].id).toBe('sphere2')
    })

    it('should throw error when removing non-existent sphere', () => {
      expect(() => scene.removeSphere('nonexistent')).toThrow('Sphere with ID nonexistent not found')
    })

    it('should find a sphere by ID', () => {
      scene.addSphere(sphere1)
      scene.addSphere(sphere2)
      
      const found = scene.findSphere('sphere1')
      expect(found).toBe(sphere1)
    })

    it('should return undefined for non-existent sphere', () => {
      const found = scene.findSphere('nonexistent')
      expect(found).toBeUndefined()
    })
  })

  describe('sphere selection', () => {
    beforeEach(() => {
      scene.addSphere(sphere1)
      scene.addSphere(sphere2)
    })

    it('should select a sphere by ID', () => {
      scene.selectSphere('sphere1')
      expect(sphere1.selected).toBe(true)
      expect(sphere2.selected).toBe(false)
    })

    it('should deselect other spheres when selecting one', () => {
      sphere1.selected = true
      sphere2.selected = true
      
      scene.selectSphere('sphere1')
      expect(sphere1.selected).toBe(true)
      expect(sphere2.selected).toBe(false)
    })

    it('should clear all selections', () => {
      sphere1.selected = true
      sphere2.selected = true
      
      scene.clearSelections()
      expect(sphere1.selected).toBe(false)
      expect(sphere2.selected).toBe(false)
    })

    it('should get the selected sphere', () => {
      scene.selectSphere('sphere1')
      const selected = scene.getSelectedSphere()
      expect(selected).toBe(sphere1)
    })

    it('should return undefined when no sphere is selected', () => {
      const selected = scene.getSelectedSphere()
      expect(selected).toBeUndefined()
    })
  })

  describe('visibility management', () => {
    beforeEach(() => {
      scene.addSphere(sphere1)
      scene.addSphere(sphere2)
      sphere2.visible = false
    })

    it('should get visible spheres only', () => {
      const visible = scene.getVisibleSpheres()
      expect(visible).toHaveLength(1)
      expect(visible[0]).toBe(sphere1)
    })
  })

  describe('camera management', () => {
    it('should set camera position', () => {
      scene.setCameraPosition(10, 20, 30)
      expect(scene.camera.position).toEqual({ x: 10, y: 20, z: 30 })
    })

    it('should throw error for invalid camera position', () => {
      expect(() => scene.setCameraPosition('invalid', 20, 30)).toThrow('Camera position coordinates must be valid numbers')
      expect(() => scene.setCameraPosition(NaN, 20, 30)).toThrow('Camera position coordinates cannot be NaN')
    })

    it('should set camera rotation', () => {
      scene.setCameraRotation(1, 2)
      expect(scene.camera.rotation).toEqual({ x: 1, y: 2 })
    })

    it('should throw error for invalid camera rotation', () => {
      expect(() => scene.setCameraRotation('invalid', 2)).toThrow('Camera rotation values must be valid numbers')
      expect(() => scene.setCameraRotation(NaN, 2)).toThrow('Camera rotation values cannot be NaN')
    })
  })

  describe('lighting management', () => {
    it('should set lighting properties', () => {
      scene.setLighting(0.5, 0.8)
      expect(scene.lighting.ambient).toBe(0.5)
      expect(scene.lighting.directional).toBe(0.8)
    })

    it('should clamp lighting values', () => {
      scene.setLighting(-0.5, 1.5)
      expect(scene.lighting.ambient).toBe(0)
      expect(scene.lighting.directional).toBe(1)
    })

    it('should throw error for invalid lighting values', () => {
      expect(() => scene.setLighting('invalid', 0.5)).toThrow('Ambient lighting must be a valid number')
      expect(() => scene.setLighting(0.5, 'invalid')).toThrow('Directional lighting must be a valid number')
    })
  })

  describe('pause management', () => {
    it('should toggle pause state', () => {
      expect(scene.isPaused).toBe(false)
      scene.togglePause()
      expect(scene.isPaused).toBe(true)
      scene.togglePause()
      expect(scene.isPaused).toBe(false)
    })

    it('should set pause state', () => {
      scene.setPaused(true)
      expect(scene.isPaused).toBe(true)
      scene.setPaused(false)
      expect(scene.isPaused).toBe(false)
    })

    it('should throw error for invalid pause state', () => {
      expect(() => scene.setPaused('invalid')).toThrow('Paused state must be a boolean value')
    })
  })

  describe('reset', () => {
    it('should reset scene to default state', () => {
      scene.addSphere(sphere1)
      scene.setCameraPosition(10, 20, 30)
      scene.setLighting(0.5, 0.8)
      scene.setPaused(true)
      
      scene.reset()
      
      expect(scene.spheres).toEqual([])
      expect(scene.camera.position).toEqual({ x: 0, y: 0, z: 200 })
      expect(scene.lighting.ambient).toBe(0.3)
      expect(scene.isPaused).toBe(false)
    })
  })

  describe('validation', () => {
    it('should validate a valid scene', () => {
      const result = scene.validate()
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should detect invalid scene properties', () => {
      scene.spheres = 'invalid'
      scene.camera = null
      scene.lighting = 'invalid'
      scene.isPaused = 'invalid'
      
      const result = scene.validate()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Spheres must be an array')
      expect(result.errors).toContain('Camera must be an object')
      expect(result.errors).toContain('Lighting must be an object')
      expect(result.errors).toContain('isPaused must be a boolean')
    })
  })

  describe('serialization', () => {
    it('should serialize scene to JSON', () => {
      scene.addSphere(sphere1)
      scene.setCameraPosition(10, 20, 30)
      
      const json = scene.toJSON()
      expect(json.spheres).toHaveLength(1)
      expect(json.camera.position).toEqual({ x: 10, y: 20, z: 30 })
      expect(json.lighting).toEqual({ ambient: 0.3, directional: 0.7 })
      expect(json.isPaused).toBe(false)
    })
  })

  describe('cloning', () => {
    it('should create a deep copy of the scene', () => {
      scene.addSphere(sphere1)
      scene.setCameraPosition(10, 20, 30)
      
      const cloned = scene.clone()
      
      expect(cloned).not.toBe(scene)
      expect(cloned.spheres).toHaveLength(1)
      expect(cloned.spheres[0]).not.toBe(sphere1)
      expect(cloned.spheres[0].id).not.toBe(sphere1.id)
      expect(cloned.camera.position).toEqual({ x: 10, y: 20, z: 30 })
      expect(cloned.camera.position).not.toBe(scene.camera.position)
    })
  })
})