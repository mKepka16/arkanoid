import Assets from './Assets.js';
import Canvas from './Canvas.js';
import Block from './Block.js';
import Vector from './Vector.js';

class GridCanvas extends Canvas {
  constructor(_canvas, _rows, _cols, _rowHeight, _colWidth) {
    super(_canvas, _colWidth * _cols, _rowHeight * _rows);
    this.rows = _rows;
    this.cols = _cols;
    this.rowHeight = _rowHeight;
    this.colWidth = _colWidth;
    this.grid;
    this.initGrid(this.getDefaultBlock);
    this.mousePosition;
    this.displayGrid = false;
    this.currentBackground = 5;
    this.lineWidth = 2;
    this.selectionColor = '#F04B36';
    this.canvas.onmousedown = e => this.handleMouseDown(e);
    this.canvas.onmouseup = e => this.handleMouseUp(e);
  }

  getMousePosition = () => ({
    col: Math.floor(this.mouse.x / this.colWidth),
    row: Math.floor(this.mouse.y / this.rowHeight)
  });

  convertCoords = coords => ({
    col: Math.floor(coords.x / this.colWidth),
    row: Math.floor(coords.y / this.rowHeight)
  });

  handleMouseDown() {}
  handleMouseUp() {}

  getDefaultBlock = gridPosition => ({
    ...new Block(
      null,
      gridPosition,
      this.getBlockCoords(gridPosition),
      this.colWidth,
      this.rowHeight
    )
  });

  initGrid(getDefaultBlock) {
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      const row = [];
      for (let x = 0; x < this.cols; x++) {
        const block = getDefaultBlock(new Vector(x, y));
        row.push(block);
      }
      this.grid.push(row);
    }
  }

  loopThroughGrid(cb) {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const block = this.grid[y][x];
        cb(block);
      }
    }
  }

  handleHover() {
    if (!this.mouseOnCanvas) return;

    const { col, row } = this.getMousePosition();
    this.drawRectangle(col, row, this.selectionColor, 4);
  }

  update() {
    //Drawing background
    if (this.currentBackground != null)
      this.drawBackground(this.currentBackground);

    //Rendering blocks
    this.loopThroughGrid(block => {
      if (block.textureId == null) return;
      this.placeBlock(block);
    });
  }

  getBlockCoords = position =>
    new Vector(position.x * this.colWidth, position.y * this.rowHeight);

  placeBlock(block) {
    const scale = this.rowHeight / 4;
    Assets.renderBlock(
      this.canvas,
      block.textureId,
      block.position.x,
      block.position.y,
      scale
    );
  }

  drawShadow(position, color = 'rgba(0, 0, 0, .5)') {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 0;
    this.ctx.fillRect(
      position.x + this.colWidth / 2,
      position.y + this.rowHeight / 2,
      this.colWidth,
      this.rowHeight
    );
  }

  drawBackground(number) {
    const scale = this.rowHeight / 4;
    Assets.renderBackground(this.canvas, number, 0, 0, scale);
  }

  renderPaddle(position) {
    const scale = this.rowHeight / 4;
    Assets.renderPaddle(this.canvas, position.x, position.y, scale);
  }

  renderBall(position) {
    const scale = this.rowHeight / 4;
    Assets.renderBall(this.canvas, position.x, position.y, scale);
  }
}

export default GridCanvas;
