class Rect3D {
  constructor() {
    this.init();
    this.initKBEvent();
    this.run();
  }

  init() {
    this._transla = [0, 0, 0];
    this._rotate = [0, 0, 0];
    this._scale = [1, 1, 1];
    this._gl = DocumentUtil.getGL();
    this.initPosBuffer();
    this.initProgram();
  }

  initKBEvent() {
    let self = this;
    document.onkeydown = function (e) {
      let isChange = true;
      switch (e.key) {
        case 'a': {
          self._transla[0]--;
          break;
        }

        case 'd': {
          self._transla[0]++;
          break;
        }

        case 'w': {
          self._transla[1]--;
          break;
        }

        case 's': {
          self._transla[1]++;
          break;
        }

        case 'q': {
          self._transla[2]--;
          break;
        }

        case 'e': {
          self._transla[2]++;
          break;
        }

        case 't': {
          self._rotate[1]+= 0.1;
          break;
        }

        case 'g': {
          self._rotate[1]-=0.1;
          break;
        }

        case 'f': {
          self._rotate[0]-=0.1;
          break;
        }

        case 'h': {
          self._rotate[0]+= 0.1;
          break;
        }

        case 'r': {
          self._rotate[2]-=0.1;
          break;
        }

        case 'y': {
          self._rotate[2]+= 0.1;
          break;
        }

        case 'i': {
          self._scale[1]++;
          break;
        }

        case 'k': {
          self._scale[1]--;
          break;
        }

        case 'j': {
          self._scale[0]--;
          break;
        }

        case 'l': {
          self._scale[0]++;
          break;
        }

        case 'u': {
          self._scale[2]--;
          break;
        }

        case 'o': {
          self._scale[2]++;
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
    this._gl.bufferData(this._gl.ARRAY_BUFFER, Tools.getRectArr(), this._gl.STATIC_DRAW);
  }

  initProgram() {
    if (!this._gl) {
      return;
    }

    ShaderUtil.loadShader(this._gl, ShaderUtil.INDEX_SHADER_3D, this.loadProgramSuccess.bind(this));
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

    this._gl.clearColor(0, 0 , 0, 1);

    // this._gl.enable(this._gl.CULL_FACE); // 背面剔除 正面三角形的顶点顺序是逆时针方向， 反面三角形是顺时针方向。
    this._gl.enable(this._gl.DEPTH_TEST); // 深度缓冲
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    // 计算矩阵
    let matrix = Math3D.projection(this._gl.canvas.width, this._gl.canvas.height, 400);
    matrix = Math3D.translate(matrix, this._transla[0], this._transla[1], this._transla[2]);
    matrix = Math3D.xRotate(matrix, Tools.degToRad(this._rotate[0]));
    matrix = Math3D.yRotate(matrix, Tools.degToRad(this._rotate[1]));
    matrix = Math3D.zRotate(matrix, Tools.degToRad(this._rotate[2]));
    matrix = Math3D.scale(matrix, this._scale[0], this._scale[1], this._scale[1]);

    let uMatrix = this._gl.getUniformLocation(this._program, 'u_matrix');
    // 设置矩阵
    this._gl.uniformMatrix4fv(uMatrix, false, matrix);

    let aColor = this._gl.getAttribLocation(this._program, 'a_color');
    let colorBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, colorBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, Tools.getColorArr(), this._gl.STATIC_DRAW);
    this._gl.enableVertexAttribArray(aColor);
    this._gl.vertexAttribPointer(aColor, 3, this._gl.UNSIGNED_BYTE, true, 0, 0);

    let aPosition = this._gl.getAttribLocation(this._program, 'a_position');
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
    this._gl.enableVertexAttribArray(aPosition);
    this._gl.vertexAttribPointer(aPosition, 3, this._gl.FLOAT, false, 0, 0);

    this._gl.drawArrays(this._gl.TRIANGLES, 0, 3 * 2 * 6);
  }
}

new Rect3D();
