import Vector from './Vector.js';

class Paddle {
  static moveVelocity = Vector.zero;

  constructor(startingPoint) {
    this.position = startingPoint;
    this.velocity = Vector.zero;
    this.width = 194.4;
    this.height = 43.2;
  }

  move(deltaTime) {
    this.position = Vector.addVectors(
      this.position,
      Vector.multiply(this.velocity, deltaTime)
    );
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x > 612) this.position.x = 612;
  }

  goRight() {
    this.velocity = Paddle.moveVelocity;
  }

  goLeft() {
    this.velocity = Vector.multiply(Paddle.moveVelocity, -1);
  }

  stop() {
    this.velocity = Vector.zero;
  }
}

export default Paddle;
