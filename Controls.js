class Controls {
  constructor() {
    this.left = false;
    this.right = false;
    window.addEventListener('keydown', e => this.handleKeyDown(e));
    window.addEventListener('keyup', e => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    if (e.key == 'd' || e.key == 'ArrowRight') return (this.right = true);
    if (e.key == 'a' || e.key == 'ArrowLeft') return (this.left = true);
  }

  handleKeyUp(e) {
    if (e.key == 'd' || e.key == 'ArrowRight') return (this.right = false);
    if (e.key == 'a' || e.key == 'ArrowLeft') return (this.left = false);
  }
}

export default Controls;
