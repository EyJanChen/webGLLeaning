class MoveRect {
  constructor() {
    this.init();
  }

  init() {
    this._gl = DocumentUtil.getGL();
    this._color = [Math.random(), Math.random(), Math.random()];
    this._posX = 0;
    this._posY = 0;
    this.initKBEvent();
    this.initProgram();
  }

  initKBEvent() {
    let self = this;
    document.onkeydown = function (e) {
      let isChange = true;
      if (e.key === 'a') {
        if (self._posX > 0) {
          self._posX--;
        }
      } else if (e.key === 'd') {
        if (self._posX <= 400) {
          self._posX++;
        }
      } else if (e.key === 'w') {
        if (self._posX > 0) {
          self._posY--;
        }
      } else if (e.key === 's') {
        if (self._posY <= 400) {
          self._posY++;
        }
      } else {
        isChange = false;
      }

      if (isChange) {
        self.run();
      }
    }
  }

  initProgram() {
    if (!this._gl) {
      return;
    }

    ShaderUtil.loadShader(this._gl, ShaderUtil.INDEX_SHADER_SINGL_RECT_COLOR, this.loadProgramSuccess.bind(this));
  }

  loadProgramSuccess(program) {
    if (!program) {
      return;
    }
    this._gl.useProgram(program);
    this._program = program;

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this.run();
  }

  run() {
    if (!this._gl) {
      return;
    }

    this._gl.clearColor(0, 0, 0, 1);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    let uResolution = this._gl.getUniformLocation(this._program, 'u_resolution');
    let aPosition = this._gl.getAttribLocation(this._program, 'a_position');
    let uColor = this._gl.getUniformLocation(this._program, 'u_color');

    this._gl.uniform2f(uResolution, this._gl.canvas.width, this._gl.canvas.height);

    this._gl.uniform4f(uColor, this._color[0], this._color[1], this._color[2], 1);

    let posBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, posBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, this.getPosArr(), this._gl.STATIC_DRAW);

    this._gl.enableVertexAttribArray(aPosition);
    this._gl.vertexAttribPointer(aPosition, 2, this._gl.FLOAT, false, 0, 0);

    this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
  }

  getPosArr() {
    let x1= this._posX || 0;
    let y1 = this._posY || 0;
    let x2 = 100 + x1;
    let y2 = 30 + y1;
    return new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]);
  }
}

new MoveRect();
