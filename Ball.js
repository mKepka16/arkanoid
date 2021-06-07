import Vector from './Vector.js';

class Ball {
  constructor(position) {
    this.position = position;
    this.velocity = Vector.zero;
    this.radius = 14.4;
  }

  move(deltaTime) {
    this.position = Vector.addVectors(
      this.position,
      Vector.multiply(this.velocity, deltaTime)
    );
    if (this.position.x <= 0) {
      this.position.x = 0;
      this.bounceHorizontally();
    } else if (this.position.x >= 777.2) {
      this.position.x = 777.2;
      this.bounceHorizontally();
    }
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.bounceVertically();
    } else if (this.position.y >= 777.2) {
      this.position.y = 777.2;
      this.bounceVertically();
    }
  }

  bounceHorizontally() {
    this.velocity.x *= -1;
  }

  bounceVertically() {
    this.velocity.y *= -1;
  }
}

export default Ball;
