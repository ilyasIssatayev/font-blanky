import { defineStore } from 'pinia'
import { Sphere } from '../models/Sphere.js'
import { Scene } from '../models/Scene.js'

export const useSphereStore = defineStore('spheres', {
  state: () => ({
    scene: new Scene(),
    selectedSphereId: null,
    ui: {
      leftPanelWidth: 300,
      showLayers: true,
      exportDialogOpen: false
    }
  }),

  getters: {
    // Get all spheres from the scene
    spheres: (state) => state.scene.spheres,

    // Get the currently selected sphere
    selectedSphere: (state) => {
      if (!state.selectedSphereId) return null
      return state.scene.findSphere(state.selectedSphereId)
    },

    // Get all visible spheres
    visibleSpheres: (state) => state.scene.getVisibleSpheres(),

    // Get sphere count
    sphereCount: (state) => state.scene.spheres.length,

    // Check if scene is paused
    isPaused: (state) => state.scene.isPaused,

    // Get camera properties
    camera: (state) => state.scene.camera,

    // Get lighting properties
    lighting: (state) => state.scene.lighting,

    // Check if any sphere is selected
    hasSelection: (state) => state.selectedSphereId !== null,

    // Get sphere by ID
    getSphereById: (state) => (id) => state.scene.findSphere(id)
  },

  actions: {
    // Add a new sphere to the scene
    addSphere(properties = {}) {
      try {
        const sphere = new Sphere(properties)
        this.scene.addSphere(sphere)
        
        // Auto-select the newly created sphere
        this.selectSphere(sphere.id)
        
        return sphere
      } catch (error) {
        console.error('Failed to add sphere:', error)
        throw error
      }
    },

    // Update a sphere property
    updateSphereProperty(sphereId, property, value) {
      try {
        const sphere = this.scene.findSphere(sphereId)
        if (!sphere) {
          throw new Error(`Sphere with ID ${sphereId} not found`)
        }

        // Use the sphere's setter methods for validation
        switch (property) {
          case 'radius':
            sphere.setRadius(value)
            break
          case 'rotationSpeed':
            sphere.setRotationSpeed(value)
            break
          case 'position':
            if (value && typeof value === 'object') {
              sphere.setPosition(value.x, value.y, value.z)
            }
            break
          case 'colors':
            if (value && typeof value === 'object') {
              sphere.setColors(value.start, value.end)
            }
            break
          case 'material':
            if (value && typeof value === 'object') {
              sphere.setMaterial(value)
            }
            break
          case 'visible':
            sphere.setVisibility(value)
            break
          case 'selected':
            sphere.setSelection(value)
            break
          case 'name':
            if (typeof value === 'string') {
              sphere.name = value
            }
            break
          default:
            // Direct property assignment for other properties
            sphere[property] = value
        }

        return sphere
      } catch (error) {
        console.error('Failed to update sphere property:', error)
        throw error
      }
    },

    // Update multiple sphere properties at once
    updateSphere(sphereId, properties) {
      try {
        const sphere = this.scene.findSphere(sphereId)
        if (!sphere) {
          throw new Error(`Sphere with ID ${sphereId} not found`)
        }

        // Update each property
        Object.entries(properties).forEach(([property, value]) => {
          this.updateSphereProperty(sphereId, property, value)
        })

        return sphere
      } catch (error) {
        console.error('Failed to update sphere:', error)
        throw error
      }
    },

    // Select a sphere
    selectSphere(sphereId) {
      try {
        if (sphereId === null || sphereId === undefined) {
          // Deselect all spheres
          this.scene.clearSelections()
          this.selectedSphereId = null
          return
        }

        this.scene.selectSphere(sphereId)
        this.selectedSphereId = sphereId
      } catch (error) {
        console.error('Failed to select sphere:', error)
        throw error
      }
    },

    // Deselect all spheres
    deselectAll() {
      this.scene.clearSelections()
      this.selectedSphereId = null
    },

    // Delete a sphere
    deleteSphere(sphereId) {
      try {
        // If deleting the selected sphere, clear selection
        if (this.selectedSphereId === sphereId) {
          this.selectedSphereId = null
        }

        this.scene.removeSphere(sphereId)
      } catch (error) {
        console.error('Failed to delete sphere:', error)
        throw error
      }
    },

    // Duplicate a sphere
    duplicateSphere(sphereId) {
      try {
        const originalSphere = this.scene.findSphere(sphereId)
        if (!originalSphere) {
          throw new Error(`Sphere with ID ${sphereId} not found`)
        }

        const duplicatedSphere = originalSphere.clone()
        // Offset the position slightly
        duplicatedSphere.position.x += 20
        duplicatedSphere.position.y += 20

        this.scene.addSphere(duplicatedSphere)
        this.selectSphere(duplicatedSphere.id)

        return duplicatedSphere
      } catch (error) {
        console.error('Failed to duplicate sphere:', error)
        throw error
      }
    },

    // Toggle sphere visibility
    toggleSphereVisibility(sphereId) {
      try {
        const sphere = this.scene.findSphere(sphereId)
        if (!sphere) {
          throw new Error(`Sphere with ID ${sphereId} not found`)
        }

        sphere.setVisibility(!sphere.visible)
        return sphere
      } catch (error) {
        console.error('Failed to toggle sphere visibility:', error)
        throw error
      }
    },

    // Update camera position
    updateCameraPosition(x, y, z) {
      try {
        this.scene.setCameraPosition(x, y, z)
      } catch (error) {
        console.error('Failed to update camera position:', error)
        throw error
      }
    },

    // Update camera rotation
    updateCameraRotation(x, y) {
      try {
        this.scene.setCameraRotation(x, y)
      } catch (error) {
        console.error('Failed to update camera rotation:', error)
        throw error
      }
    },

    // Update lighting
    updateLighting(ambient, directional) {
      try {
        this.scene.setLighting(ambient, directional)
      } catch (error) {
        console.error('Failed to update lighting:', error)
        throw error
      }
    },

    // Toggle pause state
    togglePause() {
      this.scene.togglePause()
    },

    // Set pause state
    setPaused(paused) {
      try {
        this.scene.setPaused(paused)
      } catch (error) {
        console.error('Failed to set pause state:', error)
        throw error
      }
    },

    // Reset scene to default state
    resetScene() {
      this.scene.reset()
      this.selectedSphereId = null
    },

    // Load scene from data
    loadScene(sceneData) {
      try {
        this.scene = new Scene(sceneData)
        this.selectedSphereId = null
      } catch (error) {
        console.error('Failed to load scene:', error)
        throw error
      }
    },

    // Get scene data for export/save
    getSceneData() {
      return this.scene.toJSON()
    },

    // UI state management
    setLeftPanelWidth(width) {
      if (typeof width === 'number' && width > 0) {
        this.ui.leftPanelWidth = width
      }
    },

    toggleLayersVisibility() {
      this.ui.showLayers = !this.ui.showLayers
    },

    setExportDialogOpen(open) {
      this.ui.exportDialogOpen = Boolean(open)
    }
  }
})