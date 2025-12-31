export default class Node {
  constructor(id, text, x = 0, y = 0) {
    this.id = id;
    this.text = text || '';
    this.x = x;
    this.y = y;
    this.children = [];
    this.parent = null;
  }

  addChild(node) {
    node.parent = this;
    this.children.push(node);
  }
}
