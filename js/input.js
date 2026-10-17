(function () {
  "use strict";
  var gameKeys = {
    Space: 1, ArrowDown: 1, ArrowRight: 1, ArrowLeft: 1, ArrowUp: 1,
    KeyP: 1, Escape: 1, KeyM: 1, Enter: 1, KeyH: 1, KeyR: 1, Backquote: 1
  };
  var I = DZ.input = { held: Object.create(null), pressed: Object.create(null), released: Object.create(null) };
  I.init = function (canvas) {
    function key(e, down) {
      if (!gameKeys[e.code]) return;
      if (document.activeElement === canvas || e.code === "KeyM") e.preventDefault();
      if (down && !I.held[e.code]) I.pressed[e.code] = true;
      if (!down && I.held[e.code]) I.released[e.code] = true;
      I.held[e.code] = down;
      if (down && DZ.audio) DZ.audio.unlock();
    }
    window.addEventListener("keydown", function (e) { key(e, true); }, { passive: false });
    window.addEventListener("keyup", function (e) { key(e, false); }, { passive: false });
    canvas.addEventListener("pointerdown", function () { canvas.focus(); });
  };
  I.down = function (code) { return !!I.held[code]; };
  I.hit = function (code) { return !!I.pressed[code]; };
  I.up = function (code) { return !!I.released[code]; };
  I.endFrame = function () {
    for (var p in I.pressed) delete I.pressed[p];
    for (var r in I.released) delete I.released[r];
  };
}());
