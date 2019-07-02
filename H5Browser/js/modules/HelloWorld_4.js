class HelloWorld_4 {
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

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    let aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    let uColor = gl.getUniformLocation(program, 'u_color');

    for (let index = 0; index < 50; index++) {
      gl.uniform4f(uColor, Math.random(), Math.random(), Math.random(), 1);
      gl.bufferData(gl.ARRAY_BUFFER, this.getRect(this.randomInt(gl.canvas.width), this.randomInt(gl.canvas.height)), gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

  }

  randomInt (num) {
    return Math.floor(Math.random() * num);
  };

  getRect (w, h) {
    let x = this.randomInt(w);
    let y = this.randomInt(h);
    let x1 = x;
    let x2 = x + w;
    let y1 = y;
    let y2 = y + h;
    return new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]);
  };
}
new HelloWorld_4();

/*
* let posBuffer = gl.createBuffer(); GPU数据要在一个缓冲区里面拿
* let aPosition = gl.getAttribLocation(program, 'a_position'); 数据的目标位置
* gl.enableVertexAttribArray(aPosition); 通知作用，现在要往这个位置传数据
* gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer); 绑定，类似给这个缓冲区一个标识，相当于 ARRAY_BUFFER = posBuffer
*
* */
