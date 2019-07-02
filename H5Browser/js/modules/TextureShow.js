class TextureShow {
  constructor() {
    this.loadImg();
  }

  loadImg() {
    let img = new Image();
    img.src = '../../icon.png';
    let self = this;
    img.onload = function () {
      self.initProgram(img);
    }
  }

  initProgram(img) {
    this._img = img;

    this._gl = DocumentUtil.getGL();
    if (!this._gl) {
      return;
    }

    ShaderUtil.loadShader(this._gl, ShaderUtil.INDEX_SHADER_TEXUER, this.initScene.bind(this));
  }

  initScene(program) {
    if (!program) {
      return;
    }
    let gl = this._gl;
    gl.useProgram(program);
    this._program = program;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.run();
  }

  run () {
    let gl = this._gl;
    if (!gl) {
      return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let uResolution = gl.getUniformLocation(this._program, 'u_resolution');
    gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.getPosArr(gl.canvas.width, gl.canvas.height), gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(this._program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._img);

    let texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.getTexPosArr(), gl.STATIC_DRAW);
    let aTexCoold = gl.getAttribLocation(this._program, 'a_texCoord');

    gl.enableVertexAttribArray(aTexCoold);
    gl.vertexAttribPointer(aTexCoold, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  getPosArr (w, h) {
    return this.getRect(this.randomInt(w), this.randomInt(h));
  }

  getTexPosArr () {
    return new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0
    ]);
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
new TextureShow();
