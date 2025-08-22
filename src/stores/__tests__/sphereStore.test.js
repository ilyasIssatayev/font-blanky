import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSphereStore } from '../sphereStore.js'
import { Sphere } from '../../models/Sphere.js'

describe('SphereStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSphereStore()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(store.spheres).toEqual([])
      expect(store.selectedSphereId).toBeNull()
      expect(store.ui.leftPanelWidth).toBe(300)
      expect(store.ui.showLayers).toBe(true)
      expect(store.ui.exportDialogOpen).toBe(false)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      const sphere1 = new Sphere({ id: 'sphere1', name: 'Test Sphere 1' })
      const sphere2 = new Sphere({ id: 'sphere2', name: 'Test Sphere 2', visible: false })
      store.scene.addSphere(sphere1)
      store.scene.addSphere(sphere2)
    })

    it('should get all spheres', () => {
      expect(store.spheres).toHaveLength(2)
    })

    it('should get visible spheres only', () => {
      expect(store.visibleSpheres).toHaveLength(1)
      expect(store.visibleSpheres[0].id).toBe('sphere1')
    })

    it('should get sphere count', () => {
      expect(store.sphereCount).toBe(2)
    })

    it('should get selected sphere', () => {
      store.selectedSphereId = 'sphere1'
      expect(store.selectedSphere.id).toBe('sphere1')
    })

    it('should return null when no sphere is selected', () => {
      expect(store.selectedSphere).toBeNull()
    })

    it('should check if has selection', () => {
      expect(store.hasSelection).toBe(false)
      store.selectedSphereId = 'sphere1'
      expect(store.hasSelection).toBe(true)
    })

    it('should get sphere by ID', () => {
      const sphere = store.getSphereById('sphere1')
      expect(sphere.id).toBe('sphere1')
    })
  })

  describe('sphere management actions', () => {
    it('should add a new sphere', () => {
      const sphere = store.addSphere({ name: 'Test Sphere' })
      
      expect(store.spheres).toHaveLength(1)
      expect(sphere.name).toBe('Test Sphere')
      expect(store.selectedSphereId).toBe(sphere.id)
    })

    it('should add sphere with default properties', () => {
      const sphere = store.addSphere()
      
      expect(sphere.radius).toBe(50)
      expect(sphere.colors.start).toBe('#ff6b6b')
      expect(sphere.visible).toBe(true)
    })

    it('should update sphere property', () => {
      const sphere = store.addSphere()
      
      store.updateSphereProperty(sphere.id, 'radius', 100)
      expect(sphere.radius).toBe(100)
      
      store.updateSphereProperty(sphere.id, 'name', 'Updated Name')
      expect(sphere.name).toBe('Updated Name')
    })

    it('should update sphere position', () => {
      const sphere = store.addSphere()
      
      store.updateSphereProperty(sphere.id, 'position', { x: 10, y: 20, z: 30 })
      expect(sphere.position).toEqual({ x: 10, y: 20, z: 30 })
    })

    it('should update sphere colors', () => {
      const sphere = store.addSphere()
      
      store.updateSphereProperty(sphere.id, 'colors', { start: '#ff0000', end: '#00ff00' })
      expect(sphere.colors.start).toBe('#ff0000')
      expect(sphere.colors.end).toBe('#00ff00')
    })

    it('should update multiple sphere properties', () => {
      const sphere = store.addSphere()
      
      store.updateSphere(sphere.id, {
        radius: 75,
        name: 'Multi Update',
        visible: false
      })
      
      expect(sphere.radius).toBe(75)
      expect(sphere.name).toBe('Multi Update')
      expect(sphere.visible).toBe(false)
    })

    it('should throw error when updating non-existent sphere', () => {
      expect(() => store.updateSphereProperty('nonexistent', 'radius', 100))
        .toThrow('Sphere with ID nonexistent not found')
    })

    it('should delete a sphere', () => {
      const sphere = store.addSphere()
      const sphereId = sphere.id
      
      store.deleteSphere(sphereId)
      expect(store.spheres).toHaveLength(0)
      expect(store.selectedSphereId).toBeNull()
    })

    it('should duplicate a sphere', () => {
      const original = store.addSphere({ name: 'Original', radius: 75 })
      const duplicate = store.duplicateSphere(original.id)
      
      expect(store.spheres).toHaveLength(2)
      expect(duplicate.name).toBe('Original Copy')
      expect(duplicate.radius).toBe(75)
      expect(duplicate.id).not.toBe(original.id)
      expect(duplicate.position.x).toBe(20) // Offset position
      expect(store.selectedSphereId).toBe(duplicate.id)
    })

    it('should toggle sphere visibility', () => {
      const sphere = store.addSphere()
      expect(sphere.visible).toBe(true)
      
      store.toggleSphereVisibility(sphere.id)
      expect(sphere.visible).toBe(false)
      
      store.toggleSphereVisibility(sphere.id)
      expect(sphere.visible).toBe(true)
    })
  })

  describe('selection actions', () => {
    let sphere1, sphere2

    beforeEach(() => {
      sphere1 = store.addSphere({ name: 'Sphere 1' })
      sphere2 = store.addSphere({ name: 'Sphere 2' })
    })

    it('should select a sphere', () => {
      store.selectSphere(sphere1.id)
      
      expect(store.selectedSphereId).toBe(sphere1.id)
      expect(sphere1.selected).toBe(true)
      expect(sphere2.selected).toBe(false)
    })

    it('should deselect all spheres', () => {
      store.selectSphere(sphere1.id)
      store.deselectAll()
      
      expect(store.selectedSphereId).toBeNull()
      expect(sphere1.selected).toBe(false)
      expect(sphere2.selected).toBe(false)
    })

    it('should deselect when selecting null', () => {
      store.selectSphere(sphere1.id)
      store.selectSphere(null)
      
      expect(store.selectedSphereId).toBeNull()
      expect(sphere1.selected).toBe(false)
    })
  })

  describe('camera actions', () => {
    it('should update camera position', () => {
      store.updateCameraPosition(10, 20, 30)
      expect(store.camera.position).toEqual({ x: 10, y: 20, z: 30 })
    })

    it('should update camera rotation', () => {
      store.updateCameraRotation(1, 2)
      expect(store.camera.rotation).toEqual({ x: 1, y: 2 })
    })
  })

  describe('lighting actions', () => {
    it('should update lighting', () => {
      store.updateLighting(0.5, 0.8)
      expect(store.lighting.ambient).toBe(0.5)
      expect(store.lighting.directional).toBe(0.8)
    })
  })

  describe('pause actions', () => {
    it('should toggle pause', () => {
      expect(store.isPaused).toBe(false)
      store.togglePause()
      expect(store.isPaused).toBe(true)
    })

    it('should set pause state', () => {
      store.setPaused(true)
      expect(store.isPaused).toBe(true)
    })
  })

  describe('scene actions', () => {
    it('should reset scene', () => {
      store.addSphere()
      store.updateCameraPosition(10, 20, 30)
      store.setPaused(true)
      
      store.resetScene()
      
      expect(store.spheres).toHaveLength(0)
      expect(store.camera.position).toEqual({ x: 0, y: 0, z: 200 })
      expect(store.isPaused).toBe(false)
      expect(store.selectedSphereId).toBeNull()
    })

    it('should get scene data', () => {
      store.addSphere({ name: 'Test' })
      const sceneData = store.getSceneData()
      
      expect(sceneData.spheres).toHaveLength(1)
      expect(sceneData.camera).toBeDefined()
      expect(sceneData.lighting).toBeDefined()
      expect(sceneData.isPaused).toBe(false)
    })

    it('should load scene from data', () => {
      const sceneData = {
        spheres: [new Sphere({ name: 'Loaded Sphere' })],
        camera: { position: { x: 10, y: 20, z: 30 }, rotation: { x: 0, y: 0 } },
        lighting: { ambient: 0.5, directional: 0.8 },
        isPaused: true
      }
      
      store.loadScene(sceneData)
      
      expect(store.spheres).toHaveLength(1)
      expect(store.spheres[0].name).toBe('Loaded Sphere')
      expect(store.camera.position).toEqual({ x: 10, y: 20, z: 30 })
      expect(store.selectedSphereId).toBeNull()
    })
  })

  describe('UI actions', () => {
    it('should set left panel width', () => {
      store.setLeftPanelWidth(400)
      expect(store.ui.leftPanelWidth).toBe(400)
    })

    it('should ignore invalid panel width', () => {
      store.setLeftPanelWidth(-100)
      expect(store.ui.leftPanelWidth).toBe(300) // Should remain unchanged
    })

    it('should toggle layers visibility', () => {
      expect(store.ui.showLayers).toBe(true)
      store.toggleLayersVisibility()
      expect(store.ui.showLayers).toBe(false)
    })

    it('should set export dialog state', () => {
      store.setExportDialogOpen(true)
      expect(store.ui.exportDialogOpen).toBe(true)
      
      store.setExportDialogOpen(false)
      expect(store.ui.exportDialogOpen).toBe(false)
    })
  })
})