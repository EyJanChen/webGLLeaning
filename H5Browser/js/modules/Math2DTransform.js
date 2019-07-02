class Math2DTransform {
  constructor() {
    this.init();
  }

  init() {
    this._gl = DocumentUtil.getGL();
    this._color = [Math.random(), Math.random(), Math.random(), 1];
    this._posX = this._posY = 0;
    this._angle = 0;
    this._scaleX = this._scaleY = 0;
    this.initKBEvent();
    this.initPosBuffer();
    this.initProgram();
  }

  initKBEvent() {
    let self = this;
    document.onkeydown = function (e) {
      let isChange = true;
      switch (e.key) {
        case 'a': {
          if (self._posX > 0) {
            self._posX--;
          }
          break;
        }

        case 'd': {
          if (self._posX <= 400) {
            self._posX++;
          }
          break;
        }

        case 'w': {
          if (self._posX > 0) {
            self._posY--;
          }
          break;
        }

        case 's': {
          if (self._posY <= 400) {
            self._posY++;
          }
          break;
        }

        case 'q': {
          self._angle--;
          break;
        }

        case 'e': {
          self._angle++;
          break;
        }

        case 'z': {
          self._scaleX--;
          break;
        }

        case 'x': {
          self._scaleX++;
          break;
        }

        case 'c': {
          self._scaleY--;
          break;
        }

        case 'v': {
          self._scaleY++;
          break;
        }

        default: {
          isChange = false;
          break;
        }
      }

      if (isChange) {
        self.run();
      }
    }
  }

  initPosBuffer() {
    if (!this._gl) {
      return;
    }

    this._posBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, this.getTankBuffer(), this._gl.STATIC_DRAW);
  }

  getTankBuffer() {
    let rect_1 = Tools.getRectPosArr(0, 20, 30, 15);
    let rect_2 = Tools.getRectPosArr(7, 0, 15, 20);
    return new Float32Array(rect_1.concat(rect_2));
  }

  initProgram() {
    if (!this._gl) {
      return;
    }

    ShaderUtil.loadShader(this._gl, ShaderUtil.INDEX_SHADER_MATH, this.loadProgramSuccess.bind(this));
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

    let uColor = this._gl.getUniformLocation(this._program, 'u_color');
    this._gl.uniform4f(uColor, this._color[0], this._color[1], this._color[2], this._color[3]);

    let mp = Math2D.projection(this._gl.canvas.width, this._gl.canvas.height);
    let mt = Math2D.translation(this._posX || 0, this._posY || 0);
    let mr = Math2D.rotation(((this._angle || 0) * Math.PI / 180));
    let ms = Math2D.scaling(this._scaleX || 1, this._scaleY || 1);

    let m = Math2D.multiply(mp, mt);
    m = Math2D.multiply(m, mr);
    m = Math2D.multiply(m, ms);

    let uMatrix = this._gl.getUniformLocation(this._program, 'u_matrix');
    this._gl.uniformMatrix3fv(uMatrix, false, m);

    let aPosition = this._gl.getAttribLocation(this._program, 'a_position');
    this._gl.enableVertexAttribArray(aPosition);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
    this._gl.vertexAttribPointer(aPosition, 2, this._gl.FLOAT, false, 0, 0);

    this._gl.drawArrays(this._gl.TRIANGLES, 0, 12);
  }
}

new Math2DTransform();
