(function () {
  "use strict";
  window.DZ = window.DZ || {};
  var U = DZ.util = {};
  U.clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.aabb = function (a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
      a.y < b.y + b.h && a.y + a.h > b.y;
  };
  U.RNG = function (seed) { this.s = seed >>> 0; };
  U.RNG.prototype.next = function () {
    var t = this.s += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  U.RNG.prototype.pick = function (array) {
    return array[(this.next() * array.length) | 0];
  };
  U.Pool = function (create, reset, max) {
    this.items = []; this.free = []; this.create = create; this.reset = reset; this.max = max;
  };
  U.Pool.prototype.acquire = function () {
    var value = this.free.length ? this.free.pop() :
      (this.items.length < this.max ? this.create() : null);
    if (value && this.items.indexOf(value) < 0) this.items.push(value);
    if (value) value.active = true;
    return value;
  };
  U.Pool.prototype.release = function (value) {
    if (!value || !value.active) return;
    value.active = false; this.reset(value); this.free.push(value);
  };
  U.roundRect = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };
}());
