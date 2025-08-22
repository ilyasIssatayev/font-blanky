# Design Document - P5.js Sphere Editor

## Overview

The P5.js Sphere Editor is a web-based 3D sphere manipulation tool with a Figma-inspired interface. Built using p5.js and Vue.js, it provides an intuitive visual editor for creating, customizing, and managing 3D spheres in real-time. The application features a modern layout with property panels, interactive 3D controls, and export capabilities.

## Architecture

### Technology Stack
- **Frontend Framework**: Vue.js 3 with Composition API (use setup scripts only)
- **3D Graphics**: p5.js with WEBGL renderer
- **UI Components**: Custom Vue components with CSS Grid/Flexbox
- **State Management**: Vue 3 reactive state (Pinia if complex state needed)
- **Build Tool**: Vite
- **Styling**: CSS3 each vue component should have own .scss file in style folder, where main.scss will import all scss files

### Application Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── LeftSidebar.vue
│   │   ├── TopToolbar.vue
│   │   └── CanvasArea.vue
│   ├── controls/
│   │   ├── PropertyPanel.vue
│   │   ├── ColorPicker.vue
│   │   ├── SliderControl.vue
│   │   └── LayersList.vue
│   └── canvas/
│       ├── P5Canvas.vue
│       └── SphereRenderer.js
├── styles/
│   ├── main.scss
│   ├── layout/
│   │   ├── leftSidebar.scss
│   │   ├── topToolbar.scss
│   │   ├── canvasArea.scss
│   ├── controls/
│   │   ├── propertyPanel.scss
│   │   ├── colorPicker.scss
│   │   ├── sliderControl.scss
│   │   └── layersList.scss
│   └── canvas/
│       └── p5Canvas.scss
├── services/
│   ├── sphereManager.js
│   ├── exportService.js
│   └── storageService.js
├── stores/
│   └── sphereStore.js
└── utils/
    ├── p5Utils.js
    └── mathUtils.js
```

## Components and Interfaces

### Core Components

#### 1. Main Layout Component
- **Purpose**: Orchestrates the Figma-like layout with sidebars and canvas
- **Responsibilities**: 
  - Manages responsive layout grid
  - Handles panel resizing
  - Coordinates component communication

#### 2. LeftSidebar Component
- **Purpose**: Houses sphere property controls
- **Controls Include**:
  - Radius slider (1-200 pixels)
  - Rotation speed control (-5 to 5 RPM)
  - Color gradient picker (start/end colors)
  - Position controls (X, Y, Z coordinates)
  - Material properties (shininess, metallic)
  - Lighting controls (ambient, directional)
  - Sphere gradient pattern selection
  - Layer visibility toggle

#### 3. TopToolbar Component
- **Purpose**: Provides global scene actions
- **Actions Include**:
  - Play/Pause rotation toggle
  - Re-render scene button
  - Reset to defaults button
  - Add new sphere button
  - Export options dropdown

#### 4. CanvasArea Component
- **Purpose**: Wraps the p5.js canvas and handles 3D interactions
- **Features**:
  - Mouse/touch interaction handling
  - Camera controls (orbit, zoom)
  - Sphere selection logic
  - Visual selection indicators

#### 5. LayersList Component
- **Purpose**: Manages multiple spheres as layers
- **Features**:
  - Hierarchical sphere list
  - Visibility toggles
  - Layer selection
  - Delete functionality

### Data Models

#### Sphere Model
```javascript
class Sphere {
  constructor() {
    this.id = generateUniqueId()
    this.name = `Sphere ${this.id}`
    this.position = { x: 0, y: 0, z: 0 }
    this.radius = 50
    this.rotation = { x: 0, y: 0, z: 0 }
    this.rotationSpeed = 1
    this.colors = {
      start: '#ff6b6b',
      end: '#4ecdc4'
    }
    this.material = {
      shininess: 100,
      metallic: 0.5
    }
    this.visible = true
    this.selected = false
  }
}
```

#### Scene Model
```javascript
class Scene {
  constructor() {
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
}
```

### Service Interfaces

#### SphereManager Service
- `createSphere(properties)`: Creates new sphere with given properties
- `updateSphere(id, properties)`: Updates existing sphere
- `deleteSphere(id)`: Removes sphere from scene
- `selectSphere(id)`: Sets sphere as selected
- `duplicateSphere(id)`: Creates copy of existing sphere

#### ExportService
- `exportAsImage(format, quality)`: Captures canvas as image
- `exportAsCode()`: Generates p5.js code for current scene
- `exportAsJSON()`: Serializes scene configuration

#### StorageService
- `saveProject(name, sceneData)`: Saves project to localStorage
- `loadProject(name)`: Loads project from localStorage
- `listProjects()`: Returns available saved projects

## Architecture

### State Management Flow
1. **User Interaction** → UI Component
2. **UI Component** → Sphere Store (via actions)
3. **Sphere Store** → Scene State Update
4. **Scene State** → P5.js Renderer (reactive update)
5. **P5.js Renderer** → Canvas Update

### 3D Rendering Pipeline
1. **Scene Setup**: Initialize p5.js with WEBGL renderer
2. **Camera Management**: Handle orbit controls and zoom
3. **Sphere Rendering**: Draw each sphere with materials and lighting
4. **Selection Rendering**: Overlay selection indicators
5. **Animation Loop**: Update rotations and re-render

## Data Models

### Reactive State Structure
```javascript
// Sphere Store (Pinia)
const useSphereStore = defineStore('spheres', {
  state: () => ({
    spheres: [],
    selectedSphereId: null,
    scene: new Scene(),
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
    addSphere(properties = {}) { /* ... */ },
    updateSphereProperty(id, property, value) { /* ... */ },
    selectSphere(id) { /* ... */ }
  }
})
```

## Error Handling

### P5.js Integration Errors
- **Canvas Creation Failure**: Fallback to 2D renderer with error message
- **WebGL Context Loss**: Automatic context restoration with scene rebuild
- **Performance Issues**: Automatic quality reduction for low-end devices

### User Input Validation
- **Property Bounds**: Clamp numeric inputs to valid ranges
- **Color Validation**: Ensure valid hex/rgb color formats
- **File Export Errors**: User-friendly error messages with retry options

### State Consistency
- **Sphere ID Conflicts**: UUID generation to prevent collisions
- **Selection State**: Automatic cleanup of invalid selections
- **Undo/Redo**: Command pattern for reversible operations

## Testing Strategy

### Unit Testing
- **Sphere Model**: Property validation and state changes
- **Math Utils**: 3D transformation calculations
- **Export Service**: Format generation and validation
- **Storage Service**: localStorage operations

### Integration Testing
- **Component Communication**: Props and events between components
- **Store Actions**: State mutations and side effects
- **P5.js Integration**: Canvas rendering and interaction handling

### E2E Testing
- **User Workflows**: Complete sphere creation and editing flows
- **Export Functionality**: End-to-end export process validation
- **Responsive Behavior**: Layout adaptation across screen sizes

### Performance Testing
- **Rendering Performance**: Frame rate with multiple spheres
- **Memory Usage**: Long-running session stability
- **Interaction Responsiveness**: Input lag measurement

## Implementation Considerations

### Performance Optimizations
- **Sphere Culling**: Skip rendering of off-screen spheres
- **Level of Detail**: Reduce sphere complexity at distance
- **Batch Updates**: Group property changes to minimize re-renders
- **Canvas Optimization**: Use p5.js performance best practices

### Accessibility
- **Keyboard Navigation**: Full keyboard control of interface
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: High contrast mode for color pickers
- **Focus Management**: Logical tab order throughout interface

### Browser Compatibility
- **WebGL Support**: Graceful degradation to 2D canvas
- **Modern JavaScript**: Transpilation for older browsers
- **Touch Support**: Mobile-friendly interaction patterns
- **File API**: Progressive enhancement for export features

### Extensibility
- **Plugin Architecture**: Modular sphere effects and materials
- **Custom Properties**: User-defined sphere attributes
- **Export Formats**: Pluggable export format system
- **Theme System**: Customizable UI appearance