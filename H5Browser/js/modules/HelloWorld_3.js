class HelloWorld_3 {
  constructor() {
    this.run();
  }

  run() {
    let gl = DocumentUtil.getGL();
    if (!gl) {
      return;
    }

    ShaderUtil.loadShader(gl, ShaderUtil.INDEX_SHADER_SINGL_RECT_COLOR, this.getProgramSuccess.bind(this));
  }


  getProgramSuccess(program) {
    let gl = DocumentUtil.getGL();
    if (!gl) {
      return;
    }

    if (!program) {
      return;
    }
    gl.useProgram(program);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let uResolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);

    let uColor = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(uColor, Math.random(), Math.random(), Math.random(), 1);

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPosArr()), gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  getPosArr () {
    return [
      0, 0,
      200, 0,
      200, 200,
      200, 200,
      0, 200,
      0, 0
    ];
  }
}

new HelloWorld_3();
