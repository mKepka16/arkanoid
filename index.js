'use strict';
import Assets from './Assets.js';
import BoardCanvas from './BoardCanvas.js';
import State from './State.js';

Assets.loadAssets().then(() => {
  // Board
  const boardCanvasDom = document.querySelector('.boardCanvas');
  const boardCanvas = new BoardCanvas(boardCanvasDom, 28, 14, 28.8, 57.6);
  State.setValue('boardCanvas', boardCanvas);
});
