class State {
  static boardCanvas;

  static setValue = (key, value) => (this[key] = value);
}

export default State;
