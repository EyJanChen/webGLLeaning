attribute vec2 a_position;
uniform vec2 u_resolution;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clip = zeroToTwo - 1.0;
  v_texCoord = a_texCoord; // 纹理坐标
  gl_Position = vec4(clip * vec2(1, -1), 0, 1);
}
