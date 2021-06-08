import GridCanvas from './GridCanvas.js';
import Paddle from './Paddle.js';
import Vector from './Vector.js';
import Controls from './Controls.js';
import Ball from './Ball.js';
import Block from './Block.js';
import Utils from './Utils.js';

class BoardCanvas extends GridCanvas {
  constructor(_canvas, _rows, _cols, _rowHeight, _colWidth) {
    super(_canvas, _rows, _cols, _rowHeight, _colWidth);
    this.loadMapBtn = document.querySelector('.loadMapBtn');
    this.loadMapBtn.onclick = () => this.loadFromFile();
    this.startGameBtn = document.querySelector('.startGameBtn');
    this.startGameBtn.onclick = () => this.startGame();
    this.scoreDiv = document.querySelector('.score');
    this.score = 0;

    this.currentMouseCoords;
    this.hasGameStarted = false;
    this.paddle = new Paddle(new Vector(305.8, 690));
    this.ball = new Ball(new Vector(388.6, 650));
    this.controls = new Controls();
    this.updateScore();
  }

  updateScore() {
    this.scoreDiv.textContent = this.score;
  }

  gameOver() {
    const gameOverDiv = document.querySelector('.gameOver');
    gameOverDiv.style.display = 'flex';
    this.stop();
    this.activeTryAgainButton();
  }

  playerWon() {
    const gameWonDiv = document.querySelector('.gameWon');
    gameWonDiv.style.display = 'flex';
    this.stop();
    this.activeContinueButton();
  }

  activeTryAgainButton() {
    this.startGameBtn.style.display = 'block';
    this.startGameBtn.textContent = 'Try again';
    this.startGameBtn.onclick = () => this.reset();
  }

  activeContinueButton() {
    this.startGameBtn.style.display = 'block';
    this.startGameBtn.textContent = 'Continue';
    this.startGameBtn.onclick = () => this.reset();
  }

  reset() {
    const gameWonDiv = document.querySelector('.gameWon');
    gameWonDiv.style.display = 'none';
    const gameOverDiv = document.querySelector('.gameOver');
    gameOverDiv.style.display = 'none';

    this.paddle.position = new Vector(305.8, 690);
    this.ball.position = new Vector(388.6, 650);

    this.startGameBtn.textContent = 'Start game';
    this.startGameBtn.onclick = () => this.startGame();
    this.loadMapBtn.style.display = 'block';
  }

  stop() {
    Paddle.moveVelocity = Vector.zero;
    this.ball.velocity = Vector.zero;
    this.hasGameStarted = false;
  }

  setPaddleVelocity() {
    if (this.controls.left) return this.paddle.goLeft();
    if (this.controls.right) return this.paddle.goRight();
    this.paddle.stop();
  }

  startGame() {
    Paddle.moveVelocity = new Vector(600, 0);
    this.ball.velocity = new Vector(300, -400);
    this.startGameBtn.style.display = 'none';
    this.hasGameStarted = true;
    this.loadMapBtn.style.display = 'none';
    this.score = 0;
    this.updateScore();
    // this.ball.velocity = new Vector(0, -40);
  }

  loadFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = () => {
      if (!input?.files[0]) return;
      const file = input.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => this.loadJSON(e);
      fileReader.readAsText(file);
    };
  }

  loadJSON(e) {
    const stringJSON = e.target.result;
    try {
      const boardData = JSON.parse(stringJSON);
      this.convertJsonMap(boardData);
      this.hasGameStarted = true;
    } catch {
      alert('Wrong file format');
    }
  }

  convertJsonMap(oldFormat) {
    this.currentBackground = oldFormat.background;
    this.grid = oldFormat.grid.map((row) =>
      row.map(
        (cell) =>
          new Block(
            cell.blockId,
            new Vector(cell.x, cell.y),
            this.getBlockCoords(new Vector(cell.x, cell.y)),
            this.colWidth,
            this.rowHeight
          )
      )
    );
  }

  update() {
    this.currentMouseCoords = this.getMousePosition();

    if (this.ball.position.y >= 777.2) {
      this.gameOver();
    }

    //Drawing background
    if (this.currentBackground != null)
      this.drawBackground(this.currentBackground);

    let collisionHappend = false;
    const ballGridPosition = this.convertCoords(this.ball.position);
    const xMin = ballGridPosition.col == 0 ? 0 : ballGridPosition.col - 1;
    const yMin = ballGridPosition.row == 0 ? 0 : ballGridPosition.row - 1;
    const xMax =
      ballGridPosition.col == this.cols - 1
        ? this.cols - 1
        : ballGridPosition.col + 1;
    const yMax =
      ballGridPosition.row == this.rows - 1
        ? this.rows - 1
        : ballGridPosition.row + 1;
    const x = ballGridPosition.col;
    const y = ballGridPosition.row;
    for (let row = yMin; row <= yMax; row++) {
      for (let col = xMin; col <= xMax; col++) {
        // if (col == x && row == y) continue;
        const block = this.grid[row][col];
        if (block.textureId == null) continue;
        if (!collisionHappend) {
          if (this.doCollision(block)) {
            collisionHappend = true;
          }
        }
      }
    }

    let blockExist = false;
    //Rendering blocks
    this.loopThroughGrid((block) => {
      if (block.textureId == null) return;
      // if (!collisionHappend) {
      //   if (this.doCollision(block)) {
      //     collisionHappend = true;
      //     console.log('collision');
      //   }
      // }
      this.drawShadow(block.position);
      this.placeBlock(block);
      blockExist = true;
    });

    if (!blockExist && this.hasGameStarted) this.playerWon();

    //Rendering paddle
    this.setPaddleVelocity();
    this.paddle.move(this.deltaTime);
    this.doCollision(this.paddle);
    this.renderPaddle(this.paddle.position);

    //Rendering ball
    this.ball.move(this.deltaTime);
    // console.log(this.ball.position);
    this.renderBall(this.ball.position);
  }

  checkCollision(ball, aabb) {
    //Collision detection
    const center = new Vector(
      ball.position.x + ball.radius,
      ball.position.y + ball.radius
    );

    const aabb_half_extents = new Vector(aabb.width / 2, aabb.height / 2);
    const neg_aabb_half_extents = Vector.multiply(aabb_half_extents, -1);
    const aabb_center = Vector.addVectors(aabb.position, aabb_half_extents);

    let difference = Vector.subtractVectors(center, aabb_center);

    const clamped = Vector.clamp(
      difference,
      neg_aabb_half_extents,
      aabb_half_extents
    );

    const closest = Vector.addVectors(aabb_center, clamped);
    difference = Vector.subtractVectors(closest, center);
    if (difference.magnitude() <= ball.radius) {
      return [true, this.getVectorDirection(difference), difference];
    } else {
      return [false, 'UP', new Vector(0, 0)];
    }
  }

  doCollision(block) {
    const collisionTuple = this.checkCollision(this.ball, block);

    if (!collisionTuple[0]) return false;

    const dir = collisionTuple[1];
    const diffVector = collisionTuple[2];

    if (block instanceof Block) {
      block.textureId = null;
      this.score += 10;
      this.updateScore();
    }

    if (dir == 'LEFT' || dir == 'RIGHT') {
      this.ball.bounceHorizontally();
      const penetration = this.ball.radius - Math.abs(diffVector.x);
      if (dir == 'LEFT') this.ball.position.x += penetration;
      else this.ball.position.x -= penetration;
    } else {
      this.ball.bounceVertically();
      const penetration = this.ball.radius - Math.abs(diffVector.y);
      if (dir == 'UP') this.ball.position.y += penetration;
      else this.ball.position.x -= penetration;
    }

    if (!(block instanceof Paddle)) return true;
    const t = Utils.InverseLerp(
      this.paddle.position.x,
      this.paddle.position.x + this.paddle.width,
      this.ball.position.x
    );
    const magnitude = this.ball.velocity.magnitude();
    const xVelocity = Utils.Lerp(-400, 400, t);
    let diff = magnitude * magnitude - xVelocity * xVelocity;
    if (diff < 0) diff = 1;
    const yVelocity = -Math.sqrt(diff);

    this.ball.velocity.x = xVelocity;
    this.ball.velocity.y = yVelocity;
    return true;
  }

  getVectorDirection(target) {
    // console.log(target);
    const compass = [
      new Vector(0, -1), //up
      new Vector(1, 0), //right
      new Vector(0, 1), //down
      new Vector(-1, 0), //left
    ];

    let max = 0;
    let bestMatch = -1;

    for (let i = 0; i < 4; i++) {
      const dotProduct = Vector.dotProduct(
        Vector.normalize(target),
        compass[i]
      );
      if (dotProduct >= max) {
        max = dotProduct;
        bestMatch = i;
      }
    }
    // console.log(bestMatch);
    if (bestMatch == 0) return 'UP';
    if (bestMatch == 1) return 'RIGHT';
    if (bestMatch == 2) return 'DOWN';
    if (bestMatch == 3) return 'LEFT';
  }
}

export default BoardCanvas;
