class Main {
  constructor() {
  }

  getCvsGl() {
    if (!Main.gl) {
      let cvs = document.getElementById('c');
      let gl = cvs.getContext('webgl');
      if (!gl) {
        console.error('gl err');
      }

      Main.gl = gl;
    }

    return Main.gl;
  }

  getShaderClass() {
    this._shaderClass = this._shaderClass || new ShaderClass();
    return this._shaderClass;
  }

  getRectPosArr(x, y, w, h) {
    let x1 = x;
    let x2 = w + x1;
    let y1 = y;
    let y2 = y1 + h;
    return [
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ];
  }

  getRectPosFloatArr(x, y, w, h) {
    let arr = this.getRectPosArr(x, y, w, h);
    return new Float32Array(arr);
  }
}

let main = new Main();


