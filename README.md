# AI/ML Engineer Portfolio - Surreal 3D Experience

An immersive, surreal 3D portfolio showcasing AI/ML/DL expertise through advanced WebGL effects and neural network visualizations.

## ✨ Features

### 🧠 **AI/ML Themed Visualizations**
- **3D Neural Network**: Animated 5-layer neural network with pulsing nodes and flowing connections
- **Real-time data particles**: 1000+ particles representing data streams
- **AI-focused content**: Highlighting deep learning, computer vision, NLP, and transformer models

### 🎨 **Cutting-Edge Visual Effects**

**Raymarched Metaballs:**
- Custom GLSL shader using signed distance fields (SDFs)
- 5 liquid blobs merging and separating in real-time
- Smooth minimum blending for organic fluid motion
- Dynamic lighting with Fresnel effects
- Blue/magenta/cyan color gradient

**Holographic Torus:**
- Fresnel-based edge glow
- Animated scan lines
- Color-shifting between cyan and magenta
- Vertex displacement animation

**Neural Network Visualization:**
- 52 interconnected nodes across 5 layers
- Pulsing animation simulating data flow
- Glowing connections with variable opacity
- Metallic materials with emissive properties

**Post-Processing Pipeline:**
- Bloom effect for ethereal glow
- Chromatic aberration for surreal distortion
- Vignette for depth and focus
- Sporadic glitch effect for sci-fi aesthetic

### 🎬 **Advanced Interactions**
- Mouse parallax affecting camera and scene elements
- Smooth scroll-based camera movement
- Fade-in animations with Intersection Observer
- Orbiting dynamic lights (cyan and magenta)
- Atmospheric fog for depth

## 🛠 Tech Stack

- **Three.js** - 3D rendering and WebGL
- **pmndrs/postprocessing** - Professional-grade post-processing effects
- **GSAP** - Smooth animations
- **Custom GLSL Shaders** - Raymarching, metaballs, holographic effects
- **Vite** - Lightning-fast development
- **Inter Font** - Modern, clean typography

## 🚀 Getting Started

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit: **http://localhost:5173/**

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 🎯 What Makes This Surreal

1. **Raymarched Metaballs** - Not pre-rendered geometry, calculated in real-time per pixel
2. **Multiple Visual Layers** - Neural network, metaballs, torus, and particles all coexisting
3. **Advanced Shader Effects** - Fresnel, SDFs, smooth minimum, scan lines
4. **Post-Processing** - Bloom, chromatic aberration, glitch, vignette
5. **Dynamic Lighting** - Orbiting colored point lights
6. **Organic Motion** - Everything moves and pulses continuously
7. **AI/ML Aesthetic** - Every element relates to machine learning/data visualization

## 📐 Scene Elements

| Element | Technology | Purpose |
|---------|-----------|---------|
| Metaballs | Raymarching + SDF | Main surreal centerpiece |
| Neural Net | 3D Mesh + Lines | AI/ML visualization |
| Holographic Torus | Custom Shader | Sci-fi accent |
| Data Particles | Point Cloud | Ambient atmosphere |
| Bloom | Post-processing | Ethereal glow |
| Chromatic Aberration | Post-processing | Surreal distortion |
| Glitch | Post-processing | Digital aesthetic |

## 🎨 Customization

### Colors
Edit shader uniforms in `main.js`:
```javascript
uColor1: { value: new THREE.Color(0x0066ff) }, // Blue
uColor2: { value: new THREE.Color(0xff00ff) }, // Magenta
uColor3: { value: new THREE.Color(0x00ffff) }  // Cyan
```

### Content
Update AI/ML content in `index.html`:
- Hero: Your title and specialization
- Expertise: Your tech stack and skills
- Research & Projects: Your work
- Connect: Your links (arXiv, GitHub, etc.)

### Effects Intensity
Adjust post-processing in `main.js`:
```javascript
bloomEffect.intensity = 1.2  // Glow strength
chromaticAberration.offset  // RGB separation
vignetteEffect.darkness     // Edge darkening
```

## 🔥 Performance

- 60fps on modern hardware
- Hardware-accelerated raymarching
- Optimized particle systems
- Efficient post-processing pipeline
- Adaptive pixel ratio

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL 2.0 support.

## 📚 Research-Backed Techniques

All visual effects are based on cutting-edge 2024-2025 WebGL research:
- Codrops raymarching tutorials
- pmndrs post-processing library
- TensorSpace neural network visualization
- Signed distance field rendering
- Metaball smooth minimum blending

## 📄 License

MIT

---

**Built with research from:**
- Codrops (raymarching, metaballs, holographic effects)
- pmndrs (post-processing pipeline)
- TensorSpace (neural network visualization)
- Three.js community (shader techniques)
