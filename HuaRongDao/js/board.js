const Block = require('./block');

class Board {
  constructor(width, height, blockSize) {
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.blocks = [];
    this.selectedBlock = null;
    this.grid = Array(5).fill().map(() => Array(4).fill(0)); // 4x5网格标记占用情况
    this.moves = 0;
    this.currentLayout = 0; // 当前布局索引
    
    this.init();
  }

  // 初始化棋盘
  init() {
    // 清空棋盘
    this.blocks = [];
    this.moves = 0;
    
    // 重置网格占用情况
    this.grid = Array(5).fill().map(() => Array(4).fill(0));
    
    // 根据当前布局索引选择布局
    switch (this.currentLayout) {
      case 0:
        this.initEasyLayout(); // 简单布局
        break;
      case 1:
        this.initClassicLayout(); // 经典的"横刀立马"布局
        break;
      case 2:
        this.initAdvancedLayout(); // 较难布局
        break;
      default:
        this.initEasyLayout();
    }
  }
  
  // 简单布局 - 容易解决的布局
  initEasyLayout() {
    // 创建曹操（2x2）
    const mainBlock = new Block(1, this.blockSize, this.blockSize, 
                            this.blockSize * 2, this.blockSize * 2, 
                            '#ff0000', true, '曹操');
    this.blocks.push(mainBlock);
    this.updateGrid(1, 1, 2, 2, 1);
    
    // 创建关羽（1x2）- 放在曹操上方，方便让路
    this.blocks.push(new Block(2, this.blockSize, 0, 
                              this.blockSize * 2, this.blockSize, '#0000ff', false, '关羽'));
    this.updateGrid(1, 0, 2, 1, 2);
    
    // 创建张飞（1x2）
    this.blocks.push(new Block(3, 0, this.blockSize, 
                              this.blockSize, this.blockSize * 2, '#0000ff', false, '张飞'));
    this.updateGrid(0, 1, 1, 2, 3);
    
    // 创建黄忠（2x1）- 放在出口旁边，容易移开
    this.blocks.push(new Block(4, 0, this.blockSize * 4, 
                              this.blockSize * 1, this.blockSize, '#00ff00', false, '黄忠'));
    this.updateGrid(0, 4, 1, 1, 4);
    
    // 创建马超（2x1）- 放在出口旁边，容易移开
    this.blocks.push(new Block(5, this.blockSize * 3, this.blockSize * 4, 
                              this.blockSize * 1, this.blockSize, '#00ff00', false, '马超'));
    this.updateGrid(3, 4, 1, 1, 5);
    
    // 创建其他单卒（1x1）
    this.blocks.push(new Block(6, 0, 0, 
                              this.blockSize, this.blockSize, '#ffff00', false, '赵云'));
    this.updateGrid(0, 0, 1, 1, 6);
    
    this.blocks.push(new Block(7, this.blockSize * 3, 0, 
                              this.blockSize, this.blockSize, '#ffff00', false, '魏延'));
    this.updateGrid(3, 0, 1, 1, 7);
    
    this.blocks.push(new Block(8, this.blockSize * 3, this.blockSize, 
                              this.blockSize, this.blockSize, '#ffff00', false, '徐晃'));
    this.updateGrid(3, 1, 1, 1, 8);
    
    this.blocks.push(new Block(9, this.blockSize * 3, this.blockSize * 2, 
                              this.blockSize, this.blockSize, '#ffff00', false, '庞德'));
    this.updateGrid(3, 2, 1, 1, 9);
    
    this.blocks.push(new Block(10, this.blockSize * 3, this.blockSize * 3, 
                              this.blockSize, this.blockSize, '#ffff00', false, '许褚'));
    this.updateGrid(3, 3, 1, 1, 10);
  }
  
  // 经典的"横刀立马"布局 - 中等难度
  initClassicLayout() {
    // 创建曹操（2x2）
    const mainBlock = new Block(1, this.blockSize, this.blockSize, 
                            this.blockSize * 2, this.blockSize * 2, 
                            '#ff0000', true, '曹操');
    this.blocks.push(mainBlock);
    
    // 在网格中标记曹操位置为已占用
    this.updateGrid(1, 1, 2, 2, 1);
    
    // 创建横向卒（1x2）- 关羽
    this.blocks.push(new Block(2, this.blockSize, 0, 
                              this.blockSize * 2, this.blockSize, '#0000ff', false, '关羽'));
    this.updateGrid(1, 0, 2, 1, 2);
    
    // 创建横向卒（1x2）- 张飞
    this.blocks.push(new Block(3, 0, this.blockSize, 
                              this.blockSize, this.blockSize * 2, '#0000ff', false, '张飞'));
    this.updateGrid(0, 1, 1, 2, 3);
    
    // 创建竖向将（2x1）- 黄忠
    this.blocks.push(new Block(4, 0, this.blockSize * 3, 
                              this.blockSize * 2, this.blockSize, '#00ff00', false, '黄忠'));
    this.updateGrid(0, 3, 2, 1, 4);
    
    // 创建竖向将（2x1）- 马超
    this.blocks.push(new Block(5, this.blockSize * 2, this.blockSize * 3, 
                              this.blockSize * 2, this.blockSize, '#00ff00', false, '马超'));
    this.updateGrid(2, 3, 2, 1, 5);
    
    // 创建单卒（1x1）
    this.blocks.push(new Block(6, 0, 0, 
                              this.blockSize, this.blockSize, '#ffff00', false, '赵云'));
    this.updateGrid(0, 0, 1, 1, 6);
    
    this.blocks.push(new Block(7, this.blockSize * 3, 0, 
                              this.blockSize, this.blockSize, '#ffff00', false, '魏延'));
    this.updateGrid(3, 0, 1, 1, 7);
    
    this.blocks.push(new Block(8, this.blockSize * 3, this.blockSize, 
                              this.blockSize, this.blockSize, '#ffff00', false, '徐晃'));
    this.updateGrid(3, 1, 1, 1, 8);
    
    this.blocks.push(new Block(9, this.blockSize * 3, this.blockSize * 2, 
                              this.blockSize, this.blockSize, '#ffff00', false, '庞德'));
    this.updateGrid(3, 2, 1, 1, 9);
    
    this.blocks.push(new Block(10, this.blockSize, this.blockSize * 3, 
                              this.blockSize, this.blockSize, '#ffff00', false, '许褚'));
    this.updateGrid(1, 3, 1, 1, 10);
  }
  
  // 难度较高的布局 - 更具挑战性
  initAdvancedLayout() {
    // 创建曹操（2x2）
    const mainBlock = new Block(1, this.blockSize, this.blockSize, 
                            this.blockSize * 2, this.blockSize * 2, 
                            '#ff0000', true, '曹操');
    this.blocks.push(mainBlock);
    this.updateGrid(1, 1, 2, 2, 1);
    
    // 创建关羽（1x2）
    this.blocks.push(new Block(2, this.blockSize, 0, 
                              this.blockSize * 2, this.blockSize, '#0000ff', false, '关羽'));
    this.updateGrid(1, 0, 2, 1, 2);
    
    // 创建张飞（1x2）
    this.blocks.push(new Block(3, 0, this.blockSize, 
                              this.blockSize, this.blockSize * 2, '#0000ff', false, '张飞'));
    this.updateGrid(0, 1, 1, 2, 3);
    
    // 创建黄忠（2x1）
    this.blocks.push(new Block(4, 0, this.blockSize * 3, 
                              this.blockSize * 2, this.blockSize, '#00ff00', false, '黄忠'));
    this.updateGrid(0, 3, 2, 1, 4);
    
    // 创建马超（2x1）
    this.blocks.push(new Block(5, this.blockSize * 2, this.blockSize * 3, 
                              this.blockSize * 2, this.blockSize, '#00ff00', false, '马超'));
    this.updateGrid(2, 3, 2, 1, 5);
    
    // 创建单卒（1x1），形成更复杂的障碍
    this.blocks.push(new Block(6, 0, 0, 
                              this.blockSize, this.blockSize, '#ffff00', false, '赵云'));
    this.updateGrid(0, 0, 1, 1, 6);
    
    this.blocks.push(new Block(7, this.blockSize * 3, 0, 
                              this.blockSize, this.blockSize, '#ffff00', false, '魏延'));
    this.updateGrid(3, 0, 1, 1, 7);
    
    this.blocks.push(new Block(8, this.blockSize * 3, this.blockSize, 
                              this.blockSize, this.blockSize, '#ffff00', false, '徐晃'));
    this.updateGrid(3, 1, 1, 1, 8);
    
    this.blocks.push(new Block(9, this.blockSize * 3, this.blockSize * 2, 
                              this.blockSize, this.blockSize, '#ffff00', false, '庞德'));
    this.updateGrid(3, 2, 1, 1, 9);
    
    // 许褚放在更具阻碍性的位置
    this.blocks.push(new Block(10, this.blockSize * 3, this.blockSize * 3, 
                              this.blockSize, this.blockSize, '#ffff00', false, '许褚'));
    this.updateGrid(3, 3, 1, 1, 10);
    
    // 添加额外的小卒（典韦）形成更复杂的布局
    this.blocks.push(new Block(11, this.blockSize * 2, this.blockSize * 4, 
                              this.blockSize, this.blockSize, '#ffff00', false, '典韦'));
    this.updateGrid(2, 4, 1, 1, 11);
  }
  
  // 切换到下一个布局
  switchLayout() {
    this.currentLayout = (this.currentLayout + 1) % 3; // 循环切换3种布局
    this.init();
  }

  // 更新网格占用情况
  updateGrid(startX, startY, width, height, value) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        if (x >= 0 && x < 4 && y >= 0 && y < 5) {
          this.grid[y][x] = value;
        }
      }
    }
  }

  // 绘制棋盘
  draw(ctx) {
    // 清空画布
    ctx.clearRect(0, 0, this.width, this.height);
    
    // 绘制背景
    ctx.fillStyle = '#f5f5dc';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // 垂直线
    for (let x = 0; x <= 4; x++) {
      ctx.beginPath();
      ctx.moveTo(x * this.blockSize, 0);
      ctx.lineTo(x * this.blockSize, 5 * this.blockSize);
      ctx.stroke();
    }
    
    // 水平线
    for (let y = 0; y <= 5; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * this.blockSize);
      ctx.lineTo(4 * this.blockSize, y * this.blockSize);
      ctx.stroke();
    }
    
    // 绘制出口
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(this.blockSize, 4 * this.blockSize, 2 * this.blockSize, this.blockSize);
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('出口', this.blockSize * 2, this.blockSize * 4.5);
    
    // 绘制所有方块
    this.blocks.forEach(block => block.draw(ctx));
    
    // 绘制移动次数
    ctx.fillStyle = '#000';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`移动次数: ${this.moves}`, 10, this.height - 10);
    
    // 绘制当前难度
    const difficultyText = ['简单', '中等', '困难'][this.currentLayout];
    ctx.textAlign = 'right';
    ctx.fillText(`难度: ${difficultyText}`, this.width - 10, this.height - 10);
  }

  // 选择方块
  selectBlockAt(x, y) {
    this.blocks.forEach(block => {
      block.isSelected = false;
    });
    
    // 从上到下检查，最上面的方块先被选中
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      if (this.blocks[i].containsPoint(x, y)) {
        this.blocks[i].isSelected = true;
        this.selectedBlock = this.blocks[i];
        
        // 将选中的方块移到数组最后，确保它绘制在最上层
        this.blocks.splice(i, 1);
        this.blocks.push(this.selectedBlock);
        return true;
      }
    }
    
    this.selectedBlock = null;
    return false;
  }

  // 尝试移动选中的方块
  tryMoveSelectedBlock(direction) {
    if (!this.selectedBlock) return false;
    
    let dx = 0, dy = 0;
    
    switch (direction) {
      case 'left': dx = -this.blockSize; break;
      case 'right': dx = this.blockSize; break;
      case 'up': dy = -this.blockSize; break;
      case 'down': dy = this.blockSize; break;
    }
    
    // 检查移动是否合法
    if (this.canMoveBlock(this.selectedBlock, dx, dy)) {
      // 从网格中移除当前方块
      this.removeBlockFromGrid(this.selectedBlock);
      
      // 移动方块
      this.selectedBlock.move(dx, dy);
      
      // 更新网格中的方块位置
      this.addBlockToGrid(this.selectedBlock);
      
      this.moves++;
      return true;
    }
    
    return false;
  }
  
  // 从网格中移除方块
  removeBlockFromGrid(block) {
    const gridX = Math.floor(block.x / this.blockSize);
    const gridY = Math.floor(block.y / this.blockSize);
    const gridWidth = Math.ceil(block.width / this.blockSize);
    const gridHeight = Math.ceil(block.height / this.blockSize);
    
    this.updateGrid(gridX, gridY, gridWidth, gridHeight, 0);
  }
  
  // 将方块添加到网格
  addBlockToGrid(block) {
    const gridX = Math.floor(block.x / this.blockSize);
    const gridY = Math.floor(block.y / this.blockSize);
    const gridWidth = Math.ceil(block.width / this.blockSize);
    const gridHeight = Math.ceil(block.height / this.blockSize);
    
    this.updateGrid(gridX, gridY, gridWidth, gridHeight, block.id);
  }
  
  // 检查方块是否可以移动
  canMoveBlock(block, dx, dy) {
    const newX = block.x + dx;
    const newY = block.y + dy;
    
    // 边界检查
    if (newX < 0 || newY < 0 || 
        newX + block.width > this.blockSize * 4 || 
        newY + block.height > this.blockSize * 5) {
      return false;
    }
    
    // 检查与其他方块的碰撞
    const gridX = Math.floor(newX / this.blockSize);
    const gridY = Math.floor(newY / this.blockSize);
    const gridWidth = Math.ceil(block.width / this.blockSize);
    const gridHeight = Math.ceil(block.height / this.blockSize);
    
    for (let y = gridY; y < gridY + gridHeight; y++) {
      for (let x = gridX; x < gridX + gridWidth; x++) {
        if (this.grid[y][x] !== 0 && this.grid[y][x] !== block.id) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // 检查游戏是否已胜利（曹操到达出口）
  checkWin() {
    const mainBlock = this.blocks.find(block => block.isMainBlock);
    if (!mainBlock) return false;
    
    // 检查曹操是否到达底部中间出口
    return mainBlock.y + mainBlock.height === this.blockSize * 5 && 
           mainBlock.x === this.blockSize;
  }
  
  // 重置游戏
  reset() {
    this.init();
  }
  
  // 获取游戏提示信息
  getGameHints() {
    const commonTips = {
      goal: "将曹操移动到底部中间的出口处",
      logic: [
        "华容道本质上是一种滑动块谜题(sliding block puzzle)",
        "从数学角度，它是一个有限状态自动机问题",
        "解题的空间复杂度很高，可以用BFS或A*算法求解最优路径"
      ],
      controls: [
        "点击方块选中后，向四个方向滑动移动它",
        "紫色闪电按钮：自动移动解题，直到曹操出口",
        "绿色问号按钮：显示游戏提示",
        "蓝色刷新按钮：切换难度"
      ]
    };
    
    // 根据当前布局提供不同的提示
    let layoutSpecificTips = [];
    
    switch (this.currentLayout) {
      case 0: // 简单布局
        layoutSpecificTips = [
          "这是一个简单布局，曹操已经靠近出口",
          "先移动黄忠和马超，为曹操让出通道",
          "注意利用空白处灵活移动各个小卒"
        ];
        break;
      case 1: // 经典布局
        layoutSpecificTips = [
          "这是经典的'横刀立马'布局",
          "需要把黄忠和马超移开，为曹操让出通道",
          "关羽是唯一一个不能竖着放的将领，合理利用这一特点",
          "许褚的位置很关键，可以灵活移动来帮助其他棋子通行"
        ];
        break;
      case 2: // 高级布局
        layoutSpecificTips = [
          "这是较困难的布局，需要更多技巧",
          "典韦的位置直接阻挡了曹操的去路",
          "需要复杂的移动序列才能让所有棋子配合移动",
          "尝试先创造空间，再有序地移动各个棋子"
        ];
        break;
    }
    
    return {
      goal: commonTips.goal,
      tips: layoutSpecificTips,
      logic: commonTips.logic,
      controls: commonTips.controls
    };
  }

  // 获取当前可移动的方块
  getMovableBlocks() {
    const movableBlocks = [];
    
    for (const block of this.blocks) {
      // 检查四个方向是否可移动
      const directions = ['left', 'right', 'up', 'down'];
      
      for (const direction of directions) {
        let dx = 0, dy = 0;
        switch (direction) {
          case 'left': dx = -this.blockSize; break;
          case 'right': dx = this.blockSize; break;
          case 'up': dy = -this.blockSize; break;
          case 'down': dy = this.blockSize; break;
        }
        
        if (this.canMoveBlock(block, dx, dy)) {
          movableBlocks.push({
            block,
            direction,
            dx,
            dy
          });
        }
      }
    }
    
    return movableBlocks;
  }
  
  // 找到下一步最佳移动
  findBestMove() {
    const mainBlock = this.blocks.find(block => block.isMainBlock);
    if (!mainBlock) return null;
    
    // 获取所有可移动的方块
    const movableBlocks = this.getMovableBlocks();
    if (movableBlocks.length === 0) return null;
    
    // 防止重复移动，记录最近20步的移动
    if (!this.moveHistory) {
      this.moveHistory = [];
    }
    
    // 评估每个移动的优劣
    movableBlocks.forEach(move => {
      // 基础分数
      move.score = 10;
      
      // 检查是否为曹操
      if (move.block.isMainBlock) {
        // 如果曹操在接近底部，优先向下移动
        if (move.direction === 'down') {
          move.score += 60;
          
          // 如果这步移动让曹操到达出口，给予最高分数
          if (mainBlock.y + mainBlock.height + move.dy === this.blockSize * 5 && 
              mainBlock.x === this.blockSize) {
            move.score += 100;
          }
        }
        // 如果曹操不在中间位置，适当引导它向中间移动
        else if (move.direction === 'left' && mainBlock.x > this.blockSize) {
          move.score += 30;
        }
        else if (move.direction === 'right' && mainBlock.x < this.blockSize) {
          move.score += 30;
        }
        // 如果曹操被卡住，可以尝试向上移动创造空间
        else if (move.direction === 'up') {
          move.score += 20;
        }
      } 
      // 非曹操方块
      else {
        const blockId = move.block.id;
        const blockGridX = Math.floor(move.block.x / this.blockSize);
        const blockGridY = Math.floor(move.block.y / this.blockSize);
        const blockGridWidth = Math.ceil(move.block.width / this.blockSize);
        const blockGridHeight = Math.ceil(move.block.height / this.blockSize);
        
        // 检查这个方块是否阻挡了曹操的前进路径
        const blockingCao = 
          mainBlock.y + mainBlock.height === move.block.y && 
          ((mainBlock.x >= move.block.x && mainBlock.x < move.block.x + move.block.width) ||
           (mainBlock.x + mainBlock.width > move.block.x && mainBlock.x + mainBlock.width <= move.block.x + move.block.width));
        
        if (blockingCao) {
          // 移动阻挡曹操的方块，向左或向右
          if (move.direction === 'left' || move.direction === 'right') {
            move.score += 50;
          }
          // 如果阻挡方块在曹操正前方，试图移动它
          if (blockGridX >= Math.floor(mainBlock.x / this.blockSize) && 
              blockGridX < Math.floor((mainBlock.x + mainBlock.width) / this.blockSize)) {
            move.score += 20;
          }
        }
        
        // 考虑方块所处位置
        // 优先移动出口附近的小方块
        if (blockGridY === 4 && (blockGridX === 1 || blockGridX === 2)) {
          move.score += 40;
        }
        
        // 优先移动到更适合的位置
        // 例如，如果方块在曹操前进道路上，尝试将其移开
        if (blockGridY >= 3 && blockGridY < 5) {
          if (move.direction === 'left' && blockGridX >= 1 && blockGridX <= 2) {
            move.score += 30;
          }
          if (move.direction === 'right' && blockGridX >= 1 && blockGridX <= 2) {
            move.score += 30;
          }
        }
      }
      
      // 防止重复移动，如果这个移动与最近的移动完全相反，降低其优先级
      if (this.moveHistory.length > 0) {
        const lastMove = this.moveHistory[this.moveHistory.length - 1];
        if (lastMove.blockId === move.block.id) {
          if ((lastMove.direction === 'left' && move.direction === 'right') ||
              (lastMove.direction === 'right' && move.direction === 'left') ||
              (lastMove.direction === 'up' && move.direction === 'down') ||
              (lastMove.direction === 'down' && move.direction === 'up')) {
            move.score -= 60; // 严重惩罚反复移动
          }
        }
      }
      
      // 如果最近5步中有相同的移动，降低分数防止循环
      const recentMoves = this.moveHistory.slice(-5);
      for (const pastMove of recentMoves) {
        if (pastMove.blockId === move.block.id && pastMove.direction === move.direction) {
          move.score -= 15;
        }
      }
    });
    
    // 按分数排序并返回最佳移动
    movableBlocks.sort((a, b) => b.score - a.score);
    return movableBlocks[0];
  }
  
  // 执行自动移动
  autoMove() {
    const bestMove = this.findBestMove();
    if (bestMove) {
      // 记录此次移动
      if (!this.moveHistory) {
        this.moveHistory = [];
      }
      this.moveHistory.push({
        blockId: bestMove.block.id,
        direction: bestMove.direction,
        time: Date.now()
      });
      
      // 限制历史记录长度
      if (this.moveHistory.length > 30) {
        this.moveHistory.shift();
      }
      
      this.selectBlockAt(bestMove.block.x, bestMove.block.y);
      return this.tryMoveSelectedBlock(bestMove.direction);
    }
    return false;
  }
}

module.exports = Board; 