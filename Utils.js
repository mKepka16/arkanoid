class Utils {
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  static clamp01(value) {
    return this.clamp(value, 0, 1);
  }

  static Lerp(a, b, t) {
    return a + (b - a) * this.clamp01(t);
  }

  static InverseLerp = (a, b, value) =>
    a != b ? this.clamp01((value - a) / (b - a)) : 0;
}

export default Utils;
