class HelloWorld_1 {
  constructor() {
    this.run();
  }

  run () {
    let gl = DocumentUtil.getGL();
    if (!gl) {
      return;
    }

    ShaderUtil.loadShader(gl, ShaderUtil.INDEX_SHADER_TRIANGLES, this.getProgramSuccess.bind(this));
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
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let positionBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
    let pos = [
      0, 0,
      0, 0.5,
      0.5, 0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);

    // 需要告诉WebGL怎么从我们之前准备的缓冲中获取数据给着色器中的属性
    // index = 数据位置 size = 每次拿几个， type = 数据类型
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

new HelloWorld_1();
