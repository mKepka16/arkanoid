import Utils from './Utils.js';

class Vector {
  static zero = new Vector(0, 0);

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static addVectors(vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }

  static multiply(vector, n) {
    return new Vector(n * vector.x, n * vector.y);
  }

  static subtractVectors(vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  static clamp(vector, min, max) {
    return new Vector(
      Utils.clamp(vector.x, min.x, max.x),
      Utils.clamp(vector.y, min.y, max.y)
    );
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  static normalize(vector1) {
    const magnitude = vector1.magnitude();
    if (magnitude != 0) return Vector.multiply(vector1, 1 / magnitude);
    else return vector1;
  }

  static dotProduct(v1, v2) {
    // console.log(v1, v2);
    const product = v1.x * v2.x + v1.y * v2.y;
    // console.log(product);
    return product;
  }
}

export default Vector;
