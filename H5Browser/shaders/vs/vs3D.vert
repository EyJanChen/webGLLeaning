attribute vec4 a_position;
uniform mat4 u_matrix;
attribute vec4 a_color;
varying vec4 v_color;
void main() {
  gl_Position = u_matrix * a_position;// 这里不能反过来
  v_color = a_color;
}
