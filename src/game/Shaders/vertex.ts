export const vertex = `
varying vec2 vUv;
varying float vuTime;
varying float iElevation;
uniform float iTime;


void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float elevation = sin(modelPosition.x * 10.0 - uTime) * 0.1;
  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vuTime = uTime;
  vUv = uv;
  vElevation = elevation;
}
`;
