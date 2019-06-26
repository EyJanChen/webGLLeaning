class RotateTank {
  constructor() {
    this.init();
  }

  init() {
    this._gl = main.getCvsGl();
    this._color = [Math.random(), Math.random(), Math.random()];
    this._posY = this._posX = 0;
    this._angle = 0;
    this.initKBEvent();
    this.initPosBuffer();
    this.run();
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
    let r1 = main.getRectPosArr(0, 20, 20, 10);
    let r2 = main.getRectPosArr(5, 0, 10, 20);
    return new Float32Array(r1.concat(r2));
  }

  onAngleChange() {
    let slider = document.getElementById('angleSlider');
    if (slider) {
      this._angle = Number(slider.value);
      this.run();
    }
  }

  run() {
    if (!this._gl) {
      return;
    }

    let shaderClass = main.getShaderClass();
    if (!shaderClass) {
      return;
    }

    let program = shaderClass.getShaderProgram(this._gl, ShaderStr.INDEX_SHADER_TRANSLATION_ROTATION);
    if (!program) {
      return;
    }

    this._gl.useProgram(program);

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._gl.clearColor(0, 0, 0, 1);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    let uResolution = this._gl.getUniformLocation(program, 'u_resolution');
    this._gl.uniform2f(uResolution, this._gl.canvas.width, this._gl.canvas.height);

    let uColor = this._gl.getUniformLocation(program, 'u_color');
    this._gl.uniform4f(uColor, this._color[0], this._color[1], this._color[2], 1);

    let uTranslation = this._gl.getUniformLocation(program, 'u_translation');
    this._gl.uniform2f(uTranslation, this._posX || 0, this._posY || 0);

    let uRotation = this._gl.getUniformLocation(program, 'u_rotation');
    let angleInRadians = (this._angle || 0) * Math.PI / 180;
    let s = Math.sin(angleInRadians);
    let c = Math.cos(angleInRadians);
    this._gl.uniform2f(uRotation, s, c);

    let aPosition = this._gl.getAttribLocation(program, 'a_position');
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
    this._gl.enableVertexAttribArray(aPosition);
    this._gl.vertexAttribPointer(aPosition, 2, this._gl.FLOAT, false, 0, 0);

    this._gl.drawArrays(this._gl.TRIANGLES, 0, 12);
  }

}

new RotateTank();
