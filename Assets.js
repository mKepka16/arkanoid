class Assets {
  static canvas;
  static context;
  static async loadAssets() {
    return new Promise((resolve, reject) => {
      let loadedImages = 0;
      const toLoad = 3;

      // Ball
      this.ballImage = new Image();
      this.ballImage.src = './sprites/ball.png';
      this.ballImage.onload = () => {
        loadedImages++;
        if (loadedImages == toLoad) resolve();
      };
      // Paddle
      this.paddleImage = new Image();
      this.paddleImage.src = './sprites/paddle.png';
      this.paddleImage.onload = () => {
        loadedImages++;
        if (loadedImages == toLoad) resolve();
      };

      // Main spritesheet
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        this.canvas.height = image.height;
        this.canvas.width = image.width;
        this.context.drawImage(image, 0, 0);
        loadedImages++;
        if (loadedImages == toLoad) resolve();
      };
      image.src = './sprites/arkanoid.png';
    });
  }

  static renderSprite(destinationCanvas, x, y, width, height, dx, dy, scale) {
    const context = destinationCanvas.getContext('2d');
    context.drawImage(
      this.canvas,
      x,
      y,
      width,
      height,
      dx,
      dy,
      width * scale,
      height * scale
    );
  }

  static renderBackground(destinationCanvas, number, dx, dy, scale) {
    const x = number % 4;
    const y = Math.floor(number / 4);
    const startingX = 0;
    const startingY = 256;
    const a = 128;

    this.renderSprite(
      destinationCanvas,
      startingX + x * a,
      startingY + y * a,
      a,
      a,
      dx,
      dy,
      scale
    );
  }

  static renderBlock(destinationCanvas, number, dx, dy, scale) {
    const x = number % 5;
    const y = Math.floor(number / 5);

    const startingX = 5;
    const startingY = 216;
    const horizontalSpace = 2;
    const verticalSpace = 1;
    const a = 8;
    const b = 4;

    this.renderSprite(
      destinationCanvas,
      startingX + (a + horizontalSpace) * x,
      startingY + (b + verticalSpace) * y,
      a,
      b,
      dx,
      dy,
      scale
    );
  }

  static renderPaddle(destinationCanvas, dx, dy, scale) {
    const x = 0;
    const y = 0;
    const width = 27;
    const height = 6;

    const context = destinationCanvas.getContext('2d');
    context.drawImage(
      this.paddleImage,
      x,
      y,
      width,
      height,
      dx,
      dy,
      width * scale,
      height * scale
    );
  }

  static renderBall(destinationCanvas, dx, dy, scale) {
    const x = 0;
    const y = 0;
    const width = 4;
    const height = 4;

    const context = destinationCanvas.getContext('2d');
    context.drawImage(
      this.ballImage,
      x,
      y,
      width,
      height,
      dx,
      dy,
      width * scale,
      height * scale
    );
  }
}

export default Assets;
