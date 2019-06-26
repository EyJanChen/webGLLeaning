let TextureShow = (function () {
  function TextureShow() {
    this.loadImg();
  }

  let __proto = TextureShow.prototype;

  __proto.loadImg = function () {
    let img = new Image();
    img.src = '../../icon.png';
    let self = this;
    img.onload = function () {
      self.run(img);
    }
  };

  __proto.run = function (img) {
    let gl = main.getCvsGl();
    if (!gl) {
      return;
    }

    let shaderClass = main.getShaderClass();
    if (!shaderClass) {
      return;
    }

    let program = shaderClass.getShaderProgram(gl, ShaderStr.INDEX_SHADER_TEXUER);
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
    gl.bufferData(gl.ARRAY_BUFFER, this.getPosArr(gl.canvas.width, gl.canvas.height), gl.STATIC_DRAW);
    let aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    let texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.getTexPosArr(), gl.STATIC_DRAW);
    let aTexCoold = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(aTexCoold);
    gl.vertexAttribPointer(aTexCoold, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  __proto.getPosArr = function (w, h) {
    return this.getRect(this.randomInt(w), this.randomInt(h));
  };

  __proto.getTexPosArr = function () {
    return new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0
    ]);
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

  return TextureShow;
}());

new TextureShow();
