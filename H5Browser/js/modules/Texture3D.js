class Texture3D {
  constructor() {
    let img = new Image();
    img.src = '../../imgs/colors.png';
    let self = this;
    img.onload = function () {
      self.init(img);
    }
  }

  init(img) {
    this._img = img;
    this._transla = [0, 0, -450];
    this._rotate = [Tools.degToRad(0), Tools.degToRad(0), Tools.degToRad(0)];
    this._scale = [1, 1, 1];
    this._fieldOfView = 60;
    this._gl= DocumentUtil.getGL();
    this._rotationSpeed = 1.2;
    this._lastTime = 0;

    this.initPosBuffer();
    this.initColorBuffer();
    this.initTexture();

    this.initProgram();
  }

  initProgram() {
    if (!this._gl) {
      return;
    }

    ShaderUtil.loadShader(this._gl, ShaderUtil.INDEX_SHADER_3D_TEXTURE, this.initScene.bind(this));
  }

  initScene(program) {
    if (!program) {
      return;
    }

    this._program = program;
    this._gl.useProgram(this._program);

    this._positionLoaction = this._gl.getAttribLocation(this._program, 'a_position');
    this._texcoordLoaction = this._gl.getAttribLocation(this._program, 'a_texcoord');
    this._matrixLoaction = this._gl.getUniformLocation(this._program, 'u_matrix');
    this._textureLoaction = this._gl.getUniformLocation(this._program, 'u_texture');

    let self = this;
    requestAnimationFrame(this.run.bind(self));
  }

  initPosBuffer() {
    if (!this._gl) {
      return;
    }

    let gl = this._gl;
    this._posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Tools.getRectArr(), gl.STATIC_DRAW);
  }

  initColorBuffer() {
    if (!this._gl) {
      return;
    }

    let gl = this._gl;
    this._colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Tools.getTextureArr(), gl.STATIC_DRAW);
  }

  initTexture() {
    if (!this._gl) {
      return;
    }

    let gl = this._gl;
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 是不是2的次幂
    if (Tools.isPowerOf2(this._img.width) && Tools.isPowerOf2(this._img.height)) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this._img);
      gl.generateMipmap(gl.TEXTURE_2D); // -> 根据原始图像创建所有的缩小级别
    } else {
      // 设置参数，让我们可以绘制任何尺寸的图像
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
  }

  run(now) {
    now /= 1000;
    let diffTime = now - this._lastTime;
    this._lastTime = now;

    this._rotate[1] += this._rotationSpeed * diffTime;
    this._rotate[2] += this._rotationSpeed * diffTime;

    let gl = this._gl;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    // this._gl.enable(gl.CULL_FACE);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
    gl.enableVertexAttribArray(this._positionLoaction);
    gl.vertexAttribPointer(this._positionLoaction, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.enableVertexAttribArray(this._texcoordLoaction);
    gl.vertexAttribPointer(this._texcoordLoaction, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(this._textureLoaction, 0);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let matrix = Math3D.perspective(Tools.degToRad(this._fieldOfView), aspect, 1, 2000);
    matrix = Math3D.translate(matrix, this._transla[0], this._transla[1], this._transla[2]);
    matrix = Math3D.xRotate(matrix, this._rotate[0]);
    matrix = Math3D.yRotate(matrix, this._rotate[1]);
    matrix = Math3D.zRotate(matrix, this._rotate[2]);
    matrix = Math3D.scale(matrix, this._scale[0], this._scale[1], this._scale[2]);
    gl.uniformMatrix4fv(this._matrixLoaction, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3 * 2 * 6);

    requestAnimationFrame(this.run.bind(this));
  }
}

new Texture3D();
