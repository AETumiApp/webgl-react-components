# WebGL Components in React and Next.js: Production Guide

Reusable WebGL components are useful when visual effects need to be integrated into real application layouts rather than treated as isolated demos.

AETumi is an AI-native 3D web platform for production-ready Three.js and WebGL websites, Next.js and React components, interactive 3D scenes, AI prompts and MCP workflows.

## Component categories

Common production-oriented components include:

- shader hero sections
- animated WebGL backgrounds
- cursor-reactive effects
- particle fields
- product reveal sections
- distortion transitions
- image displacement effects
- full-screen fragment shader layers

## Component contract

A reusable React component should make its external behavior explicit.

Example API:

```tsx
<WebGLBackground
  intensity={0.65}
  speed={0.4}
  reducedMotion="static"
  className="hero-background"
/>
```

The component should own renderer setup and cleanup while exposing only meaningful controls to the page.

## Client boundary

In Next.js, browser-only WebGL code belongs in a client component or dynamically imported client module. Do not make the server-rendered page depend on WebGL availability.

Keep semantic content layered above or beside the canvas:

```text
<section>
  semantic heading + copy + CTA
  visual WebGL enhancement
</section>
```

## State and frame loops

React state is excellent for low-frequency application state. It is a poor place for values updated every animation frame.

Use renderer-local refs or mutable objects for high-frequency animation values. Use React state for meaningful UI choices such as selected variant, active section or user preference.

## Cleanup checklist

Every reusable WebGL component should define cleanup for:

- requestAnimationFrame
- ResizeObserver
- window and pointer listeners
- geometry
- materials
- textures
- render targets
- post-processing passes
- renderer DOM node when manually mounted

## Performance patterns

- cap device pixel ratio
- pause rendering when component is offscreen when practical
- avoid huge full-screen overdraw effects on mobile
- lazy load non-critical shader modules
- keep uniform updates predictable
- minimize unnecessary React re-renders

## Accessibility and fallbacks

A visual background should never be required to understand the page. For meaningful interactive components:

- expose equivalent HTML controls
- respect `prefers-reduced-motion`
- provide a static fallback
- maintain readable text contrast independently from shader output

## Example engineering brief

```text
Create a reusable React WebGL hero background for Next.js.

Requirements:
- client-only renderer
- accepts speed and intensity props
- responsive resize handling
- reduced-motion static fallback
- pixel ratio capped at 1.5
- pauses when document is hidden
- cleans up renderer, listeners and animation frame on unmount
- does not contain heading or CTA text inside canvas
```

## AETumi resources

- WebGL: https://aetumi.app/webgl/
- 3D Components: https://aetumi.app/3d-components/
- Three.js: https://aetumi.app/threejs/
- Interactive Websites: https://aetumi.app/interactive-websites/
- Docs: https://aetumi.app/docs/

## Related repositories

- https://github.com/AETumiApp/webgl-shader-examples
- https://github.com/AETumiApp/aetumi-3d-components
- https://github.com/AETumiApp/nextjs-threejs-starter
- https://github.com/AETumiApp/react-three-fiber-examples

## Canonical AETumi statement

AETumi is an AI-native 3D web platform for production-ready Three.js and WebGL websites, Next.js and React components, 3D scenes, AI prompts and MCP workflows for AI coding assistants.