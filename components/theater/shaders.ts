/** GLSL for the screen, the projector beam and the dust. Outputs are linear; the colorspace chunk encodes them. */

export const screenVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const screenFragment = /* glsl */ `
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uHasA;
uniform float uHasB;
uniform float uMix;
uniform float uBrightness;
uniform float uSweep;
uniform float uTime;
uniform float uFlicker;
uniform vec3 uLamp;
varying vec2 vUv;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
void main() {
  vec3 a = toLinear(texture2D(uA, vUv).rgb) * uHasA;
  vec3 b = toLinear(texture2D(uB, vUv).rgb) * uHasB;
  vec3 image = mix(a, b, uMix);
  float hasImage = mix(uHasA, uHasB, uMix);
  float d = distance(vUv, vec2(0.5, 0.52));
  vec3 lamp = uLamp * (0.13 - 0.09 * smoothstep(0.12, 0.75, d));
  vec3 colour = mix(lamp, image, hasImage);
  colour *= 1.0 - 0.18 * smoothstep(0.45, 0.85, d) * hasImage;
  colour *= 1.0 + uFlicker * (hash(floor(uTime * 24.0)) - 0.5) * 0.06;
  if (uSweep >= 0.0) {
    float bar = exp(-pow((vUv.x - uSweep) * 9.0, 2.0));
    colour += uLamp * bar * 0.9;
  }
  colour *= uBrightness;
  gl_FragColor = vec4(colour, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const beamVertex = /* glsl */ `
attribute float aAlong;
varying float vAlong;
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vAlong = aAlong;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

export const beamFragment = /* glsl */ `
uniform float uTime;
uniform float uHouse;
uniform float uFlicker;
uniform vec3 uLamp;
varying float vAlong;
varying vec3 vWorld;
varying vec3 vNormal;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
  float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
  float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
  float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
void main() {
  vec3 toCamera = cameraPosition - vWorld;
  float dist = length(toCamera);
  vec3 view = toCamera / max(dist, 0.001);
  float edge = pow(1.0 - abs(dot(normalize(vNormal), view)), 2.0);
  float haze = 0.45 + 0.55 * noise(vWorld.xz * 0.3 + vec2(uTime * 0.05, uTime * 0.03));
  float along = pow(1.0 - vAlong, 2.8) * 0.95 + 0.02;
  float near = smoothstep(3.0, 16.0, dist);
  float flicker = 1.0 + uFlicker * (hash(floor(uTime * 24.0)) - 0.5) * 0.08;
  float intensity = edge * haze * along * near * flicker * 0.12 * (1.0 - uHouse * 0.85);
  gl_FragColor = vec4(uLamp * intensity, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const dustVertex = /* glsl */ `
attribute float aAlong;
attribute float aSeed;
uniform float uTime;
uniform float uPixelRatio;
varying float vAlong;
varying float vSeed;
varying float vNear;
void main() {
  vAlong = aAlong;
  vSeed = aSeed;
  vec3 p = position;
  p += vec3(sin(uTime * 0.3 + aSeed * 6.283), cos(uTime * 0.2 + aSeed * 12.56) * 0.5, sin(uTime * 0.17 + aSeed * 3.1) * 0.3) * 0.12 * (0.3 + aAlong);
  vec4 view = modelViewMatrix * vec4(p, 1.0);
  vNear = smoothstep(1.0, 5.0, -view.z);
  gl_PointSize = (1.2 + aSeed * 1.6) * uPixelRatio * clamp(14.0 / -view.z, 0.3, 2.2);
  gl_Position = projectionMatrix * view;
}`;

export const dustFragment = /* glsl */ `
uniform vec3 uLamp;
uniform float uHouse;
varying float vAlong;
varying float vSeed;
varying float vNear;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float disc = smoothstep(0.5, 0.15, length(c));
  float brightness = pow(1.0 - vAlong, 2.4) * (0.2 + 0.8 * vSeed) * vNear * 0.4 * (1.0 - uHouse * 0.8);
  gl_FragColor = vec4(uLamp * disc * brightness, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
