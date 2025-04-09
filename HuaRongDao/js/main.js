const Board = require('./board');

// 华容道主游戏类
class Main {
  constructor() {
    this.canvas = wx.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // 计算合适的方块大小
    this.blockSize = Math.min(
      Math.floor(this.width / 4), 
      Math.floor(this.height / 6)
    );
    
    // 调整画布尺寸
    this.gameWidth = this.blockSize * 4;
    this.gameHeight = this.blockSize * 5;
    
    // 居中游戏区域
    this.offsetX = (this.width - this.gameWidth) / 2;
    this.offsetY = (this.height - this.gameHeight) / 2;
    
    // 游戏状态
    this.isGameOver = false;
    this.showingMenu = true; // 开始显示菜单
    this.showingTips = false; // 是否显示提示
    this.autoSolving = false; // 是否自动解题中
    this.autoSolveSpeed = 500; // 自动解题的速度（毫秒/步），调慢一些
    this.lastAutoMoveTime = 0; // 上次自动移动的时间
    this.autoSolveSteps = 0; // 自动解题已执行步数
    this.autoSolveMaxSteps = 100; // 自动解题最大步数限制
    
    // 创建棋盘
    this.board = new Board(this.gameWidth, this.gameHeight, this.blockSize);
    
    // 初始化触摸事件
    this.initTouchEvents();
    
    // 游戏循环
    this.gameLoop();
  }
  
  // 初始化触摸事件
  initTouchEvents() {
    this.touchStartPos = { x: 0, y: 0 };
    this.isTouching = false;
    
    // 触摸开始
    wx.onTouchStart(e => {
      const touch = e.touches[0];
      const x = touch.clientX - this.offsetX;
      const y = touch.clientY - this.offsetY;
      
      this.touchStartPos.x = x;
      this.touchStartPos.y = y;
      this.isTouching = true;
      
      // 如果在游戏中且未显示提示，选择方块
      if (!this.showingMenu && !this.isGameOver && !this.showingTips) {
        this.board.selectBlockAt(x, y);
        
        // 检查难度切换按钮
        const switchButtonX = this.width - 50;
        const switchButtonY = 70;
        const switchButtonRadius = 20;
        
        const distanceToSwitch = Math.sqrt(
          Math.pow(touch.clientX - switchButtonX, 2) + 
          Math.pow(touch.clientY - switchButtonY, 2)
        );
        
        if (distanceToSwitch <= switchButtonRadius) {
          this.board.switchLayout();
          return;
        }
        
        // 检查自动解题按钮
        const autoSolveButtonX = this.width - 50;
        const autoSolveButtonY = 110;
        const autoSolveButtonRadius = 20;
        
        const distanceToAutoSolve = Math.sqrt(
          Math.pow(touch.clientX - autoSolveButtonX, 2) + 
          Math.pow(touch.clientY - autoSolveButtonY, 2)
        );
        
        if (distanceToAutoSolve <= autoSolveButtonRadius) {
          this.toggleAutoSolve();
          return;
        }
      }
      
      // 如果显示菜单，检查按钮点击
      if (this.showingMenu) {
        // 检查开始按钮是否被点击
        const startButtonX = this.width / 2 - 75;
        const startButtonY = this.height / 2 + 20;
        const buttonWidth = 150;
        const buttonHeight = 50;
        
        if (
          touch.clientX >= startButtonX &&
          touch.clientX <= startButtonX + buttonWidth &&
          touch.clientY >= startButtonY &&
          touch.clientY <= startButtonY + buttonHeight
        ) {
          this.resetGame();
          return;
        }
        
        // 检查提示按钮是否被点击
        const tipsButtonX = this.width / 2 - 75;
        const tipsButtonY = this.height / 2 + 80;
        
        if (
          touch.clientX >= tipsButtonX &&
          touch.clientX <= tipsButtonX + buttonWidth &&
          touch.clientY >= tipsButtonY &&
          touch.clientY <= tipsButtonY + buttonHeight
        ) {
          this.showingTips = true;
          return;
        }
        
        // 检查难度切换按钮是否被点击
        const diffButtonX = this.width / 2 - 75;
        const diffButtonY = this.height / 2 + 140;
        
        if (
          touch.clientX >= diffButtonX &&
          touch.clientX <= diffButtonX + buttonWidth &&
          touch.clientY >= diffButtonY &&
          touch.clientY <= diffButtonY + buttonHeight
        ) {
          this.board.switchLayout();
          return;
        }
        
        // 检查自动解题按钮是否被点击
        const autoSolveMenuButtonX = this.width / 2 - 75;
        const autoSolveMenuButtonY = this.height / 2 + 200;
        
        if (
          touch.clientX >= autoSolveMenuButtonX &&
          touch.clientX <= autoSolveMenuButtonX + buttonWidth &&
          touch.clientY >= autoSolveMenuButtonY &&
          touch.clientY <= autoSolveMenuButtonY + buttonHeight
        ) {
          this.resetGame();
          this.autoSolving = true;
          this.lastAutoMoveTime = Date.now();
          return;
        }
      }
      
      // 如果显示提示，点击任何地方关闭
      else if (this.showingTips) {
        this.showingTips = false;
        return;
      }
      
      // 如果游戏结束，检查重新开始按钮
      else if (this.isGameOver) {
        // 检查重新开始按钮是否被点击
        const restartButtonX = this.width / 2 - 75;
        const restartButtonY = this.height / 2 + 50;
        const buttonWidth = 150;
        const buttonHeight = 50;
        
        if (
          touch.clientX >= restartButtonX &&
          touch.clientX <= restartButtonX + buttonWidth &&
          touch.clientY >= restartButtonY &&
          touch.clientY <= restartButtonY + buttonHeight
        ) {
          this.resetGame();
          return;
        }
        
        // 检查切换难度按钮是否被点击
        const switchButtonX = this.width / 2 - 75;
        const switchButtonY = this.height / 2 + 110;
        
        if (
          touch.clientX >= switchButtonX &&
          touch.clientX <= switchButtonX + buttonWidth &&
          touch.clientY >= switchButtonY &&
          touch.clientY <= switchButtonY + buttonHeight
        ) {
          this.board.switchLayout();
          this.resetGame();
          return;
        }
      }
      
      // 如果在游戏中，检查提示按钮
      else {
        // 检查提示按钮是否被点击
        const tipsButtonX = this.width - 50;
        const tipsButtonY = 30;
        const tipsButtonRadius = 20;
        
        const distance = Math.sqrt(
          Math.pow(touch.clientX - tipsButtonX, 2) + 
          Math.pow(touch.clientY - tipsButtonY, 2)
        );
        
        if (distance <= tipsButtonRadius) {
          this.showingTips = true;
          return;
        }
      }
    });
    
    // 触摸结束
    wx.onTouchEnd(e => {
      if (!this.isTouching || this.showingMenu || this.isGameOver || this.showingTips) {
        this.isTouching = false;
        return;
      }
      
      const touch = e.changedTouches[0];
      const endX = touch.clientX - this.offsetX;
      const endY = touch.clientY - this.offsetY;
      
      const dx = endX - this.touchStartPos.x;
      const dy = endY - this.touchStartPos.y;
      
      // 检测滑动方向
      if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
        if (Math.abs(dx) > Math.abs(dy)) {
          // 水平滑动
          if (dx > 0) {
            this.moveBlock('right');
          } else {
            this.moveBlock('left');
          }
        } else {
          // 垂直滑动
          if (dy > 0) {
            this.moveBlock('down');
          } else {
            this.moveBlock('up');
          }
        }
      }
      
      this.isTouching = false;
    });
    
    // 触摸移动
    wx.onTouchMove(e => {
      // 防止页面滚动
      e.preventDefault && e.preventDefault();
    });
  }
  
  // 移动方块
  moveBlock(direction) {
    if (this.board.tryMoveSelectedBlock(direction)) {
      // 检查是否胜利
      if (this.board.checkWin()) {
        this.isGameOver = true;
      }
    }
  }
  
  // 重置游戏
  resetGame() {
    this.board.reset();
    this.isGameOver = false;
    this.showingMenu = false;
    this.showingTips = false;
  }
  
  // 绘制菜单
  drawMenu() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 绘制标题
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('华容道', this.width / 2, this.height / 2 - 100);
    
    // 绘制副标题
    this.ctx.font = '20px Arial';
    this.ctx.fillText('三国名将版', this.width / 2, this.height / 2 - 60);
    
    // 显示当前难度
    const difficultyText = ['简单', '中等', '困难'][this.board.currentLayout];
    this.ctx.fillText(`当前难度: ${difficultyText}`, this.width / 2, this.height / 2 - 20);
    
    // 绘制开始按钮
    this.drawButton('开始游戏', this.width / 2, this.height / 2 + 20);
    
    // 绘制提示按钮
    this.drawButton('游戏提示', this.width / 2, this.height / 2 + 80);
    
    // 绘制切换难度按钮
    this.drawButton('切换难度', this.width / 2, this.height / 2 + 140);
    
    // 绘制自动解题按钮
    this.drawButton('自动解题', this.width / 2, this.height / 2 + 200);
  }
  
  // 绘制游戏结束画面
  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 绘制胜利文字
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('恭喜过关!', this.width / 2, this.height / 2 - 70);
    
    // 显示当前难度
    const difficultyText = ['简单', '中等', '困难'][this.board.currentLayout];
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`难度: ${difficultyText}`, this.width / 2, this.height / 2 - 30);
    
    this.ctx.fillText(`移动次数: ${this.board.moves}`, this.width / 2, this.height / 2 + 10);
    
    // 绘制重新开始按钮
    this.drawButton('再来一局', this.width / 2, this.height / 2 + 50);
    
    // 绘制切换难度按钮
    this.drawButton('换个难度', this.width / 2, this.height / 2 + 110);
  }
  
  // 绘制提示界面
  drawTips() {
    const hints = this.board.getGameHints();
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 绘制标题
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('游戏提示', this.width / 2, 50);
    
    // 显示当前难度
    const difficultyText = ['简单', '中等', '困难'][this.board.currentLayout];
    this.ctx.font = '18px Arial';
    this.ctx.fillText(`当前难度: ${difficultyText}`, this.width / 2, 80);
    
    // 绘制游戏目标
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('游戏目标:', 30, 120);
    this.ctx.font = '16px Arial';
    this.ctx.fillText(hints.goal, 50, 150);
    
    // 绘制游戏提示
    this.ctx.font = '20px Arial';
    this.ctx.fillText('通关技巧:', 30, 180);
    this.ctx.font = '16px Arial';
    for (let i = 0; i < hints.tips.length; i++) {
      this.ctx.fillText(hints.tips[i], 50, 210 + i * 30);
    }
    
    // 绘制操作控制
    const controlsStartY = 210 + hints.tips.length * 30 + 20;
    this.ctx.font = '20px Arial';
    this.ctx.fillText('操作说明:', 30, controlsStartY);
    this.ctx.font = '16px Arial';
    for (let i = 0; i < hints.controls.length; i++) {
      this.ctx.fillText(hints.controls[i], 50, controlsStartY + 30 + i * 25);
    }
    
    // 绘制游戏逻辑
    const logicStartY = controlsStartY + 30 + hints.controls.length * 25 + 20;
    this.ctx.font = '20px Arial';
    this.ctx.fillText('游戏本质:', 30, logicStartY);
    this.ctx.font = '16px Arial';
    for (let i = 0; i < hints.logic.length; i++) {
      this.ctx.fillText(hints.logic[i], 50, logicStartY + 30 + i * 25);
    }
    
    // 绘制关闭提示
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('点击任意位置关闭', this.width / 2, this.height - 30);
  }
  
  // 绘制按钮
  drawButton(text, x, y) {
    const buttonWidth = 150;
    const buttonHeight = 50;
    
    // 按钮背景
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    
    this.ctx.fillRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight);
    this.ctx.strokeRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight);
    
    // 按钮文字
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }
  
  // 绘制提示按钮
  drawTipsButton() {
    // 绘制圆形按钮
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.beginPath();
    this.ctx.arc(this.width - 50, 30, 20, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 绘制问号
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('?', this.width - 50, 30);
  }
  
  // 绘制难度切换按钮
  drawSwitchButton() {
    // 绘制圆形按钮
    this.ctx.fillStyle = '#2196F3';
    this.ctx.beginPath();
    this.ctx.arc(this.width - 50, 70, 20, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 绘制切换图标
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('↻', this.width - 50, 70);
  }
  
  // 切换自动解题状态
  toggleAutoSolve() {
    this.autoSolving = !this.autoSolving;
    
    if (this.autoSolving) {
      // 重置自动解题状态
      this.lastAutoMoveTime = Date.now();
      this.autoSolveSteps = 0;
      // 清空移动历史，避免影响新的自动解题
      if (this.board.moveHistory) {
        this.board.moveHistory = [];
      }
      // 取消选中的方块，让自动解题算法选择
      this.board.selectedBlock = null;
    }
  }
  
  // 绘制自动解题按钮
  drawAutoSolveButton() {
    // 绘制圆形按钮
    this.ctx.fillStyle = this.autoSolving ? '#ff9800' : '#673AB7';
    this.ctx.beginPath();
    this.ctx.arc(this.width - 50, 110, 20, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 绘制图标
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('⚡', this.width - 50, 110);
    
    // 如果自动解题中，显示状态文字
    if (this.autoSolving) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(this.width - 160, 140, 140, 30);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '14px Arial';
      this.ctx.fillText(`自动解题中: ${this.autoSolveSteps}步`, this.width - 80, 155);
    }
  }
  
  // 游戏主循环
  gameLoop() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // 绘制背景
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 如果不显示菜单和提示，绘制游戏界面
    if (!this.showingMenu && !this.showingTips) {
      // 保存画布状态
      this.ctx.save();
      
      // 移动画布原点到游戏区域左上角
      this.ctx.translate(this.offsetX, this.offsetY);
      
      // 绘制游戏棋盘
      this.board.draw(this.ctx);
      
      // 恢复画布状态
      this.ctx.restore();
      
      // 绘制提示按钮
      this.drawTipsButton();
      
      // 绘制难度切换按钮
      this.drawSwitchButton();
      
      // 绘制自动解题按钮
      this.drawAutoSolveButton();
      
      // 自动解题逻辑
      if (this.autoSolving && !this.isGameOver) {
        const now = Date.now();
        if (now - this.lastAutoMoveTime > this.autoSolveSpeed) {
          const moved = this.board.autoMove();
          this.lastAutoMoveTime = now;
          
          if (moved) {
            this.autoSolveSteps++;
          }
          
          // 检查是否胜利
          if (this.board.checkWin()) {
            this.isGameOver = true;
            this.autoSolving = false;
          }
          
          // 如果无法再移动或者步数过多，停止自动解题
          if (!moved || this.autoSolveSteps >= this.autoSolveMaxSteps) {
            this.autoSolving = false;
          }
        }
      }
    }
    
    // 如果显示菜单
    if (this.showingMenu) {
      this.drawMenu();
    }
    
    // 如果游戏结束
    if (this.isGameOver) {
      this.drawGameOver();
    }
    
    // 如果显示提示
    if (this.showingTips) {
      this.drawTips();
    }
    
    // 继续游戏循环
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

module.exports = Main; 