import Node from './Node.js';

export default class MindMap {
  constructor() {
    this.root = new Node('root', '中心主题', 400, 300);
    this.nodes = { [this.root.id]: this.root };
  }

  addNode(id, text, parentId) {
    const node = new Node(id, text);
    const parent = this.nodes[parentId] || this.root;
    parent.addChild(node);
    this.nodes[id] = node;
    return node;
  }
}
