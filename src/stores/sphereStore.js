import { defineStore } from 'pinia'

// Sphere store for managing application state
export const useSphereStore = defineStore('spheres', {
  state: () => ({
    spheres: [],
    selectedSphereId: null,
    scene: {
      camera: {
        position: { x: 0, y: 0, z: 200 },
        rotation: { x: 0, y: 0 }
      },
      lighting: {
        ambient: 0.3,
        directional: 0.7
      },
      isPaused: false
    },
    ui: {
      leftPanelWidth: 300,
      showLayers: true,
      exportDialogOpen: false
    }
  }),

  getters: {
    selectedSphere: (state) => 
      state.spheres.find(s => s.id === state.selectedSphereId),
    visibleSpheres: (state) => 
      state.spheres.filter(s => s.visible)
  },

  actions: {
    addSphere(properties = {}) {
      // Implementation will go here
    },

    updateSphereProperty(id, property, value) {
      // Implementation will go here
    },

    selectSphere(id) {
      // Implementation will go here
    },

    deleteSphere(id) {
      // Implementation will go here
    }
  }
})