attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
void main() {
  vec2 transformPosition = a_position * u_scale;
  vec2 rotationPosition = vec2(
    transformPosition.x * u_rotation.y + transformPosition.y * u_rotation.x,
    transformPosition.y * u_rotation.y - transformPosition.x * u_rotation.x);
  vec2 position = rotationPosition + u_translation;
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clip = zeroToTwo - 1.0;
  gl_Position = vec4(clip * vec2(1, -1), 0, 1);
}
