// 定义方块类
class Block {
  constructor(id, x, y, width, height, color, isMainBlock = false, name = '') {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.isMainBlock = isMainBlock; // 标记是否为曹操方块
    this.isSelected = false;
    this.name = name; // 方块名称
  }

  // 绘制方块
  draw(ctx) {
    ctx.fillStyle = this.isSelected ? '#ffcc00' : this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // 绘制边框
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // 绘制文字
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 根据方块大小调整字体大小
    const fontSize = Math.min(this.width, this.height) * 0.4;
    ctx.font = `${fontSize}px Arial`;
    
    // 显示名称
    ctx.fillText(this.name, this.x + this.width / 2, this.y + this.height / 2);
  }

  // 碰撞检测
  containsPoint(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  // 移动方块
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

module.exports = Block; 