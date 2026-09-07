import React, { useRef, useEffect } from "react";

/**
 * <ShaderBackground /> — a GPU aurora/gradient rendered on a WebGL canvas
 * that sits behind your content. Zero dependencies beyond React.
 *
 * The canvas is fixed, full-viewport, and non-interactive (pointer-events:none)
 * so clicks pass straight through to your UI. The WebGL context, animation
 * frame, and resize listener are all torn down on unmount.
 *
 * Props:
 *   colors  {string[]}  three "#rrggbb" hex colors blended across the field.
 *   speed   {number}    animation speed multiplier (default 1).
 *   style   {object}    extra styles merged onto the canvas.
 *   className {string}
 *
 * https://aetumi.app/react  (AETumi — AI-native 3D web platform)
 */
export default function ShaderBackground({
  colors = ["#3a1c71", "#d76d77", "#ffaf7b"],
  speed = 1,
  style,
  className,
}) {
  const canvasRef = useRef(null);
  // Keep the latest props in a ref so we don't tear down GL on every change.
  const propsRef = useRef({ colors, speed });
  propsRef.current = { colors, speed };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) return;

    const VERT = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    const FRAG = `
      precision highp float;
      uniform float u_time;
      uniform vec2  u_resolution;
      uniform vec3  u_c0;
      uniform vec3  u_c1;
      uniform vec3  u_c2;

      // Smooth value noise for the flowing bands.
      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 p = uv * vec2(u_resolution.x / u_resolution.y, 1.0);
        float t = u_time * 0.15;

        // Two drifting noise fields make soft, aurora-like bands.
        float n = noise(p * 3.0 + vec2(t, -t * 0.6));
        n += 0.5 * noise(p * 6.0 - vec2(t * 0.8, t));
        n = n / 1.5;

        float band = uv.y + 0.25 * sin(uv.x * 3.14159 + t) + 0.35 * n;

        vec3 col = mix(u_c0, u_c1, smoothstep(0.15, 0.6, band));
        col = mix(col, u_c2, smoothstep(0.55, 1.05, band));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Two triangles covering clip space.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uC0 = gl.getUniformLocation(program, "u_c0");
    const uC1 = gl.getUniformLocation(program, "u_c1");
    const uC2 = gl.getUniformLocation(program, "u_c2");

    const hexToRgb = (hex) => {
      const h = hex.replace("#", "");
      const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
      const n = parseInt(v, 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR at 2
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resize);
    resize();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    let raf = 0;

    function frame(now) {
      const { colors, speed } = propsRef.current;
      // Freeze time for viewers who prefer reduced motion.
      const t = reduce.matches ? 0 : ((now - start) / 1000) * speed;
      const c = colors.map(hexToRgb);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3fv(uC0, c[0] || [0.2, 0.1, 0.4]);
      gl.uniform3fv(uC1, c[1] || [0.8, 0.4, 0.5]);
      gl.uniform3fv(uC2, c[2] || [1.0, 0.7, 0.5]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // Cleanup: stop the loop, drop listeners, and free GL resources.
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []); // GL is set up once; live props are read through propsRef.

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
        ...style,
      }}
    />
  );
}
