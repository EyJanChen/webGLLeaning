let ShaderClass = (function () {
  function ShaderClass () {

  }

  let __proto = ShaderClass.prototype;

  __proto.getShaderStrClass = function () {
    this._shaderStr = this._shaderStr || new ShaderStr();
    return this._shaderStr;
  };

  // 创建，赋值，编译
  __proto.createShader = function (gl, type, source) {
      let shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        console.error('create shader err');
        gl.deleteShader(shader);
        return;
      }

      return shader;
  };

  // 创建，赋值，链接
  __proto.createProgram = function (gl, vsShader, fsShader) {
      let program = gl.createProgram();
      gl.attachShader(program, vsShader);
      gl.attachShader(program, fsShader);
      gl.linkProgram(program);

      let success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!success) {
        console.error('create program err');
        gl.deleteProgram(program);
        return;
      }

      return program;
  };

  __proto.getShaderProgram = function (gl, index) {
    let shaderArr = this.getShaderStrClass().getShaderSource(index);
    if (shaderArr && shaderArr.length > 0 && shaderArr.length === 2) {
      let vs = this.createShader(gl, gl.VERTEX_SHADER, shaderArr[0]);
      let fs = this.createShader(gl, gl.FRAGMENT_SHADER, shaderArr[1]);
      if (vs && fs) {
        return this.createProgram(gl, vs, fs);
      } else {
        console.error('vs or fs err');
        return null;
      }
    } else {
      console.error('getShaderProgram index err');
      return null;
    }
  };

  return ShaderClass;
} ());
