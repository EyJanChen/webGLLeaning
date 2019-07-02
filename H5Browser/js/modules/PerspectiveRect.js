class PerspectiveRect {
  constructor() {
    this.init();
  }

  init() {
    this._gl = DocumentUtil.getGL();
    this._transla = [-150, 0, -360];
    this._rotate = [190, 40, 320];
    this._scale = [1, 1, 1];
    this._fieldOfView = 60;
    this.initKBEvent();
    this.initPosBuffer();
    this.initColorBuffer();
    this.initProgram();
  }

  static TRAN_KEY = ['a', 'd', 'w', 's', 'q', 'e'];
  static ROTA_KET = ['t', 'g', 'f', 'h', 'r', 'y'];
  static SCAL_KEY = ['i', 'k', 'j', 'l', 'u', 'o'];

  static DIR_X = 0;
  static DIR_Y = 1;
  static DIR_Z = 2;

  static DIR_ADD = 1;
  static DIR_CUT = 0;

  static getXYZ(index) {
    return Math.floor(index / 2);
  }

  static getAddOrCut(index) {
    return index % 2;
  }

  initKBEvent() {
    let self = this;
    document.onkeydown = function (ev) {
      let key = ev.key;
      if (PerspectiveRect.TRAN_KEY.indexOf(key) > -1) {
        self.changeTranslation(key);
      } else if (PerspectiveRect.ROTA_KET.indexOf(key) > -1) {
        self.changeRotation(key);
      } else if (PerspectiveRect.SCAL_KEY.indexOf(key) > -1) {
        self.changeScale(key);
      } else if (key === 'z') {
        self._fieldOfView--;
        self.run();
      } else if (key === 'x') {
        self._fieldOfView++;
        self.run();
      }
    }
  }

  changeTranslation(key) {
    let index = PerspectiveRect.TRAN_KEY.indexOf(key);
    let dirIndex = PerspectiveRect.getXYZ(index);
    let isAdd = PerspectiveRect.getAddOrCut(index) === PerspectiveRect.DIR_ADD;
    isAdd ? this._transla[dirIndex]++ : this._transla[dirIndex]--;
    this.run();
  }

  changeRotation(key) {
    let index = PerspectiveRect.ROTA_KET.indexOf(key);
    let dirIndex = PerspectiveRect.getXYZ(index);
    let isAdd = PerspectiveRect.getAddOrCut(index) === PerspectiveRect.DIR_ADD;
    this._rotate[dirIndex] += isAdd ? 0.1 : -0.1;
    this.run();
  }

  changeScale(key) {
    let index = PerspectiveRect.SCAL_KEY.indexOf(key);
    let dirIndex = PerspectiveRect.getXYZ(index);
    let isAdd = PerspectiveRect.getAddOrCut(index) === PerspectiveRect.DIR_ADD;
    this._scale[dirIndex] += isAdd ? 0.1 : -0.1;
    this.run();
  }

  initPosBuffer() {
    if (!this._gl) {
      return;
    }

    this._posBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, Tools.getRectArr(), this._gl.STATIC_DRAW);
  }

  initColorBuffer() {
    if (!this._gl) {
      return;
    }

    this._colorBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._colorBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, Tools.getColorArr(), this._gl.STATIC_DRAW);
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

    let gl = this._gl;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);

    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let aPosition = gl.getAttribLocation(this._program, 'a_position');
    let uMatrix = gl.getUniformLocation(this._program, 'u_matrix');
    let aColor = gl.getAttribLocation(this._program, 'a_color');

    gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let zNear = 1; // 正面切割位置
    let zFar = 2000; // 背面切割位置
    let matrix = Math3D.perspective(Tools.degToRad(this._fieldOfView), aspect, zNear, zFar);
    matrix = Math3D.translate(matrix, this._transla[0], this._transla[1], this._transla[2]);
    matrix = Math3D.xRotate(matrix, Tools.degToRad(this._rotate[0]));
    matrix = Math3D.yRotate(matrix, Tools.degToRad(this._rotate[1]));
    matrix = Math3D.zRotate(matrix, Tools.degToRad(this._rotate[2]));
    matrix = Math3D.scale(matrix, this._scale[0], this._scale[1], this._scale[2]);
    gl.uniformMatrix4fv(uMatrix, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3 * 2 * 6);
  }
}

new PerspectiveRect();
