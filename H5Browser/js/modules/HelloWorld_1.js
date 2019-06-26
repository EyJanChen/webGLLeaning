let HelloWorld_1 = (function () {
  function HelloWorld_1 () {
    this.run();
  }

  let __proto = HelloWorld_1.prototype;

  __proto.run = function () {
    let gl = main.getCvsGl();
    debugger;
    if (!gl) {
      return;
    }

    let shaderClass = main.getShaderClass();
    if (!shaderClass) {
      return;
    }

    let program = shaderClass.getShaderProgram(gl, ShaderStr.INDEX_SHADER_TRIANGLES);
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
  };

  return HelloWorld_1;
} ());

new HelloWorld_1();
