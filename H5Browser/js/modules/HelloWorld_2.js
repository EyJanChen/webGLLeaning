let HelloWorld_2  = (function () {
  function HelloWorld_2 () {
    this.run();
  }

  let __proto = HelloWorld_2.prototype;

  __proto.run = function () {
    let gl = main.getCvsGl();
    if (!gl) {
      return;
    }

    let shaderClass = main.getShaderClass();
    if (!shaderClass) {
      return;
    }

    let program = shaderClass.getShaderProgram(gl, ShaderStr.INDEX_SHADER_TRIANGLES_ZERO_POINT);
    if (!program) {
      return;
    }
    gl.useProgram(program);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPosArr()), gl.STATIC_DRAW);

    let uResolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);

    let aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  __proto.getPosArr = function () {
    return [
      0, 0,
      180, 0,
      0, 180,
      270, 0,
      270, 360,
      360, 180
    ];
  };

  return HelloWorld_2;
}());

new HelloWorld_2();
