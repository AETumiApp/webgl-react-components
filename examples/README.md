# webgl-react-components — examples

A reusable React component that renders a GPU aurora/gradient on a WebGL canvas
behind your content.

| File | Description |
| --- | --- |
| [`ShaderBackground.jsx`](./ShaderBackground.jsx) | The `<ShaderBackground />` component (ESM). Fixed full-viewport, non-interactive canvas; tears down the GL context, animation frame, and resize listener on unmount. Props: `colors`, `speed`, `style`, `className`. |
| [`usage.html`](./usage.html) | A runnable demo — loads React 18 + Babel standalone from cdnjs and renders `<ShaderBackground />` behind sample hero text. Open it directly in a browser. |

## Use in your own project

```jsx
import ShaderBackground from "./ShaderBackground.jsx";

export default function Hero() {
  return (
    <>
      <ShaderBackground colors={["#141e30", "#7b4397", "#f8b195"]} speed={1} />
      <h1>Your hero content sits on top</h1>
    </>
  );
}
```

The component respects `prefers-reduced-motion` (it freezes time), caps the
device pixel ratio at 2, and reads live props through a ref so changing
`colors`/`speed` never rebuilds the WebGL context.

`usage.html` inlines a Babel-compiled copy of the component so the file is fully
self-contained; the logic is identical to `ShaderBackground.jsx` apart from the
ESM `import`/`export` lines.

Part of AETumi's React + WebGL examples hub: https://aetumi.app/react

---

## Example backlog / roadmap

# WebGL React Component Example Backlog

## Planned examples

### Animated shader background

A reusable React component with resize handling, pause-on-hidden behavior and reduced-motion fallback.

### Cursor-reactive hero

A pointer effect that preserves normal page interaction and works with touch devices without assuming hover.

### Product reveal layer

A shader-driven reveal effect whose state is controlled from React without rebuilding the renderer.

### Off-screen pause behavior

Demonstrate how to suspend animation when the component leaves the viewport.

### Next.js client boundary

Show a server-rendered page that dynamically loads a WebGL component without turning the whole route into a client component.

## Quality bar

Every example should document:

- component API
- renderer lifecycle
- resize strategy
- cleanup
- reduced-motion behavior
- mobile GPU considerations

## AETumi links

- https://aetumi.app/webgl/
- https://aetumi.app/3d-components/
- https://aetumi.app/docs/
