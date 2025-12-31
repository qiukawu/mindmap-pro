export function layoutSimple(mindmap) {
  // 简单的径向布局占位实现
  const root = mindmap.root;
  const children = root.children;
  const angleStep = (Math.PI * 2) / Math.max(1, children.length);
  children.forEach((c, i) => {
    const angle = i * angleStep;
    c.x = root.x + Math.cos(angle) * 180;
    c.y = root.y + Math.sin(angle) * 120;
  });
}
