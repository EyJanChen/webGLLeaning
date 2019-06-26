let HelloWorld_4 = (function () {
  function HelloWorld_4() {
    this.run();
  }

  let __proto = HelloWorld_4.prototype;

  __proto.run = function () {
    let gl = main.getCvsGl();
    if (!gl) {
      return;
    }

    let shaderClass = main.getShaderClass();
    if (!shaderClass) {
      return;
    }

    let program = shaderClass.getShaderProgram(gl, ShaderStr.INDEX_SHADER_SINGL_RECT_COLOR);
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
    // let self = this;
    // let intervalFunc = function () {
    //   gl.uniform4f(uColor, Math.random(), Math.random(), Math.random(), 1);
    //
    //   gl.bufferData(gl.ARRAY_BUFFER, self.getRect(self.randomInt(gl.canvas.width), self.randomInt(gl.canvas.height)), gl.STATIC_DRAW);
    //
    //   gl.drawArrays(gl.TRIANGLES, 0, 6);
    // };
    // setInterval(intervalFunc, 10);

  };

  __proto.randomInt = function (num) {
    return Math.floor(Math.random() * num);
  };

  __proto.getRect = function (w, h) {
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

  return HelloWorld_4;
}());

new HelloWorld_4();

/*
* let posBuffer = gl.createBuffer(); GPU数据要在一个缓冲区里面拿
* let aPosition = gl.getAttribLocation(program, 'a_position'); 数据的目标位置
* gl.enableVertexAttribArray(aPosition); 通知作用，现在要往这个位置传数据
* gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer); 绑定，类似给这个缓冲区一个标识，相当于 ARRAY_BUFFER = posBuffer
*
* */
