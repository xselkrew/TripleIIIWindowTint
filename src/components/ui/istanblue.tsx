import { useEffect, useRef } from 'react';

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float value) {
  vec3 navy = vec3(0.094, 0.271, 0.341);
  vec3 blue = vec3(0.0, 0.498, 0.678);
  vec3 ice = vec3(0.341, 0.698, 0.796);
  vec3 white = vec3(0.918, 0.976, 1.0);
  if (value < 0.34) return mix(navy, blue, value / 0.34);
  if (value < 0.68) return mix(blue, ice, (value - 0.34) / 0.34);
  return mix(ice, white, (value - 0.68) / 0.32);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  p *= 1.88;
  float angle = 3.4034;
  p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
  p += vec2(0.1, -0.25);
  p += 0.156 * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  p += 0.33 * (vec2(fbm(p * 1.728), fbm(p * 1.728 + vec2(5.2, 1.3))) - 0.5);

  vec2 pointer = u_pointer * 0.22;
  float field = uv.y
    + sin(uv.x * 6.87 + u_time * 1.25) * 0.11
    + (fbm((p + pointer) * 2.0 + u_time * 0.16) - 0.5) * 0.31;
  vec3 color = palette(clamp(field, 0.0, 1.0));
  color = (color - 0.5) * 0.915 + 0.5;
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luma), color, 1.28) - 0.03;

  float mobile = step(u_resolution.x, u_resolution.y);
  vec2 darkCenter = mix(vec2(0.27, 0.52), vec2(0.5, 0.72), mobile);
  darkCenter += vec2(
    sin(u_time * 0.22) * 0.024,
    cos(u_time * 0.18) * 0.018
  );
  vec2 darkDelta = uv - darkCenter;
  darkDelta.x *= mix(1.15, 0.92, mobile);
  darkDelta.y *= mix(1.35, 1.7, mobile);
  float darkCloud = 1.0 - smoothstep(0.08, 0.48, length(darkDelta));
  vec3 deepNavy = vec3(0.018, 0.055, 0.078);
  color = mix(color, deepNavy, darkCloud * 0.7);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

export function ShaderBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const time = gl.getUniformLocation(program, 'u_time');
    const pointer = gl.getUniformLocation(program, 'u_pointer');
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    let inView = true;
    const started = performance.now();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointerY = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    };

    const render = (now: number) => {
      frame = 0;
      if (!inView || document.hidden) return;
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, ((now - started) / 1000) * 1.08);
      gl.uniform2f(pointer, pointerX, pointerY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduceMotion) frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (frame === 0 && inView && !document.hidden) {
        frame = requestAnimationFrame(render);
      }
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) start();
      else stop();
    });

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    observer.observe(canvas);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
