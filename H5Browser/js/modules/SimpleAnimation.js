class SimpleAnimation {
  constructor() {
    this.init();
  }

  init() {
    this._transla = [0, 0, -350];
    this._rotate = [Tools.degToRad(0), Tools.degToRad(0), Tools.degToRad(0)];
    this._scale = [1, 1, 1];
    this._fieldOfView = 60;
    this._gl = DocumentUtil.getGL();

    this.initPosBuffer();
    this.initColorBuffer();

    this._rotationSpeed = 1.2;
    this._lastTime = 0;

    this.initProgram();
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
    gl.bufferData(gl.ARRAY_BUFFER, Tools.getColorArr(), gl.STATIC_DRAW);
  }

  initProgram() {
    if (!this._gl) {
      return;
    }

    ShaderUtil.loadShader(this._gl, ShaderUtil.INDEX_SHADER_3D, this.initScene.bind(this));
  }

  initScene(program) {
    if (!this._gl) {
      return;
    }

    this._gl.useProgram(program);
    this._program = program;

    this._aPosition = this._gl.getAttribLocation(this._program, 'a_position');
    this._uMatrix = this._gl.getUniformLocation(this._program, 'u_matrix');
    this._aColor = this._gl.getAttribLocation(this._program, 'a_color');


    let self = this;
    requestAnimationFrame(this.renderScene.bind(self));
  }

  renderScene(now) {
    // 算出每帧间隔时间
    now /= 1000;
    let diff = now - this._lastTime;
    this._lastTime = now;

    this._rotate[0] += this._rotationSpeed * diff;
    this._rotate[1] += this._rotationSpeed * diff;
    this._rotate[2] += this._rotationSpeed * diff;
    let gl = this._gl;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);

    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
    gl.enableVertexAttribArray(this._aPosition);
    gl.vertexAttribPointer(this._aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.enableVertexAttribArray(this._aColor);
    gl.vertexAttribPointer(this._aColor, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let zNear = 1; // 正面切割位置
    let zFar = 2000; // 背面切割位置
    let matrix = Math3D.perspective(Tools.degToRad(this._fieldOfView), aspect, zNear, zFar);
    matrix = Math3D.translate(matrix, this._transla[0], this._transla[1], this._transla[2]);
    matrix = Math3D.xRotate(matrix, this._rotate[0]);
    matrix = Math3D.yRotate(matrix, this._rotate[1]);
    matrix = Math3D.zRotate(matrix, this._rotate[2]);
    matrix = Math3D.scale(matrix, this._scale[0], this._scale[1], this._scale[2]);
    gl.uniformMatrix4fv(this._uMatrix, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3 * 2 * 6);

    requestAnimationFrame(this.renderScene.bind(this));
  }
}

new SimpleAnimation();
