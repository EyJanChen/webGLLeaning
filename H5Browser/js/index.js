class Index {
  constructor() {
    this.init();
  }

  init() {
    let childArr = document.body.children;
    for (let index = 0, len = childArr.length; index < len; index++) {
      let child = childArr[index];
      if (child.localName === 'div') {
        this.addBtnClickEvent(child);
      }
    }
  }

  addBtnClickEvent(node) {
    let childArr = node.children;
    for (let index = 0, len = childArr.length; index < len; index++) {
      let btn = childArr[index];
      let name = btn.id;
      let idName = '#' + name;
      let windowOpenPath = "js/modules/" + name + ".html";

      $(idName).click(function () {
        window.open(windowOpenPath, idName + new Date());
      })
    }
  }
}

new Index();
