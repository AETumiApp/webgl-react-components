# webgl-react-components — examples

A robust, reusable React component that renders a GPU aurora/gradient on a
WebGL canvas behind your content — with a graceful static fallback when WebGL
is unavailable.

| File | Description |
| --- | --- |
| [`ShaderBackground.jsx`](./ShaderBackground.jsx) | The `<ShaderBackground />` component (ESM). Fixed full-viewport, non-interactive canvas; tears down the GL context, animation frame, resize/visibility listeners and IntersectionObserver on unmount. Props: `colors`, `speed`, `intensity`, `style`, `className`. |
| [`usage.html`](./usage.html) | A runnable demo — loads React 18 + Babel standalone from cdnjs and renders `<ShaderBackground />` behind sample hero text. Open it directly in a browser. |

## Use in your own project

```jsx
import ShaderBackground from "./ShaderBackground.jsx";

export default function Hero() {
  return (
    <>
      <ShaderBackground
        colors={["#141e30", "#7b4397", "#f8b195"]}
        speed={1}
        intensity={1.05}
      />
      <h1>Your hero content sits on top</h1>
    </>
  );
}
```

## What makes it production-grade

- **Props read live through a ref** — changing `colors`, `speed`, or `intensity`
  never rebuilds the WebGL context.
- **DPR cap + adaptive resolution** — `devicePixelRatio` capped at 2, with a
  rolling FPS meter that downscales the render resolution below 50 FPS and
  recovers when there is headroom.
- **Pause when not visible** — an `IntersectionObserver` stops the loop when the
  canvas is offscreen, and `visibilitychange` stops it when the tab is hidden.
- **Reduced motion** — `prefers-reduced-motion` freezes time.
- **Never blank** — if WebGL is missing or the context is lost, the component
  renders a static CSS-gradient fallback built from the same `colors`.
- **Full cleanup on unmount** — cancels the animation frame, removes every
  listener, disconnects the observer, and deletes the GL program, shaders and
  buffer.

`usage.html` inlines a Babel-compiled copy of the component so the file is fully
self-contained; the logic is identical to `ShaderBackground.jsx` apart from the
ESM `import`/`export` lines.

Part of AETumi's React + WebGL examples hub: https://aetumi.app/react
