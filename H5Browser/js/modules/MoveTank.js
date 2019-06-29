class MoveTank {
  constructor() {
    this.init();
  }

  init() {
    this._gl = main.getCvsGl();
    this._color = [Math.random(), Math.random(), Math.random()];
    this._posX = this._posY = 0;
    this.initKBEvent();
    this.initPosBuffer();
    this.run();
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
        self.changeTranslation();
      }
    }
  }

  initPosBuffer() {
    if (!this._gl) {
      return;
    }

    this._posBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
    let rect_1 = main.getRectPosArr(0, 20, 30, 15);
    let rect_2 = main.getRectPosArr(7, 0, 15, 20);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(rect_1.concat(rect_2)), this._gl.STATIC_DRAW);
  }

  run() {
    if (!this._gl) {
      return;
    }

    let shaderClass = main.getShaderClass();
    if (!shaderClass) {
      return;
    }

    let program = shaderClass.getShaderProgram(this._gl, ShaderStr.INDEX_SHADER_TRANSLATION_MOVE);
    if (!program) {
      return;
    }
    this._gl.useProgram(program);
    this._program = program;

    this._gl.viewport(0,0,this._gl.canvas.width, this._gl.canvas.height);
    this._gl.clearColor(0, 0, 0, 1);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    let uResolution = this._gl.getUniformLocation(program, 'u_resolution');
    this._gl.uniform2f(uResolution, this._gl.canvas.width, this._gl.canvas.height);

    let uColor = this._gl.getUniformLocation(program, 'u_color');
    this._gl.uniform4f(uColor, this._color[0], this._color[1], this._color[2], 1);

    let uTranslation = this._gl.getUniformLocation(program, 'u_translation');
    this._gl.uniform2f(uTranslation, this._posX,  this._posY);

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
    this._gl.enableVertexAttribArray(this.getAPosition(program));
    this._gl.vertexAttribPointer(this.getAPosition(program), 2, this._gl.FLOAT, false, 0, 0);
    this._gl.drawArrays(this._gl.TRIANGLES, 0, 12);
  }

  changeTranslation() {
    if (this._program) {
      let u_Translation = this._gl.getUniformLocation(this._program, 'u_translation');
      this._gl.uniform2f(u_Translation, this._posX, this._posY);

      this._gl.clearColor(0, 0, 0, 1);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);

      this._gl.drawArrays(this._gl.TRIANGLES, 0, 12);
    }
  }

  getAPosition(program) {
    if (!this._aPosition) {
      this._aPosition = this._gl.getAttribLocation(program, 'a_position');
    }

    return this._aPosition;
  }

}

new MoveTank();
