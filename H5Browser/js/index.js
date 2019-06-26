class Index {
  constructor() {
    this._arr = [
      "HelloWorld_1",
      "HelloWorld_2",
      "HelloWorld_3",
      "HelloWorld_4",
      "MoveRect",
      "MoveTank",
      "RotateTank",
      "ScaleTank",
      "Math2DTransform",

      "TextureShow",

      "Rect3D",
      "PerspectiveRect",
    ];
    this.init();
  }

  init() {
    for (let index = 0, len = this._arr.length; index < len; index++) {
      let name = this._arr[index];
      let idName = '#' + name;
      let windowOpenPath = "js/modules/" + name + ".html";

      $(idName).click(function () {
        window.open(windowOpenPath, idName + new Date());
      })
    }
  }
}

new Index();
