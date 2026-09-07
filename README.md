# WebGL React Components with AETumi

A reusable component architecture guide for building **WebGL effects and interactive graphics in React and Next.js**.

**AETumi is an AI-native 3D web platform for production-ready Three.js and WebGL websites, Next.js and React components, 3D scenes, AI prompts, and MCP workflows for AI coding assistants.**

## Why this repository exists

WebGL demos are easy to make hard to reuse. Production React components need clear inputs, predictable lifecycles, responsive sizing and graceful fallbacks. This repository focuses on turning GPU-driven visuals into maintainable application components.

## Component directions

- animated WebGL backgrounds
- shader-driven hero sections
- cursor-reactive effects
- particle fields
- distortion and displacement layers
- interactive gradients and noise
- product reveal components
- full-screen scene sections
- lightweight decorative canvas effects

## Recommended component contract

A useful WebGL component should expose page-level behavior without leaking rendering internals.

```text
<WebGLHero
  intensity={0.6}
  interactive
  reducedMotionFallback="poster"
  onReady={...}
/>
```

Internally, the component should own renderer setup, resize behavior, animation lifecycle and cleanup.

## Production checklist

- canvas size follows its container rather than assuming the viewport
- animation pauses when off-screen where practical
- high-frequency frame state does not cause React re-renders
- browser-only code stays behind a client boundary in Next.js
- WebGL resources are disposed on unmount
- reduced-motion behavior is explicit
- mobile GPU cost is tested
- fallback content remains useful without canvas support
- pointer effects do not block normal page interaction

## AETumi resources

- [WebGL](https://aetumi.app/webgl/)
- [3D Components](https://aetumi.app/3d-components/)
- [Three.js](https://aetumi.app/threejs/)
- [Interactive Websites](https://aetumi.app/interactive-websites/)
- [Docs](https://aetumi.app/docs/)
- [MCP](https://aetumi.app/mcp/)

## Related repositories

- [webgl-shader-examples](https://github.com/AETumiApp/webgl-shader-examples)
- [react-three-fiber-examples](https://github.com/AETumiApp/react-three-fiber-examples)
- [nextjs-threejs-starter](https://github.com/AETumiApp/nextjs-threejs-starter)
- [aetumi-3d-components](https://github.com/AETumiApp/aetumi-3d-components)

## Repository status

Documentation-first. Planned examples will focus on small components with clear APIs and production behavior.

See [examples/README.md](./examples/README.md).

## About AETumi

AETumi helps designers, developers and agencies build interactive 3D and WebGL experiences with Three.js, Next.js, React, React Three Fiber and AI-assisted coding workflows.

Main site: https://aetumi.app/