attribute vec2 a_position; // 需要的位置
uniform vec2 u_resolution; // 真实大小
void main() {
  vec2 zeroToOne = a_position / u_resolution;// 转成0~1
  vec2 zeroToTwo = zeroToOne * 2.0;// 0~1转成0~2
  vec2 clip = zeroToTwo - 1.0;// -1~1
  gl_Position = vec4(clip * vec2(1, -1), 0, 1); // 0点在左上角
}
