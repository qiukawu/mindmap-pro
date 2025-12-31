export default class Renderer {
  constructor(canvas, mindmap) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mindmap = mindmap;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    // 简单渲染：只渲染节点文本
    Object.values(this.mindmap.nodes).forEach(node => {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#333';
      ctx.fillRect(node.x - 50, node.y - 18, 100, 36);
      ctx.strokeRect(node.x - 50, node.y - 18, 100, 36);
      ctx.fillStyle = '#111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.text, node.x, node.y);
    });
  }
}
