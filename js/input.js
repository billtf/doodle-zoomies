(function () {
  "use strict";
  var gameKeys = {
    Space: 1, ArrowDown: 1, ArrowRight: 1, ArrowLeft: 1, ArrowUp: 1,
    KeyP: 1, Escape: 1, KeyM: 1, Enter: 1, KeyH: 1, KeyR: 1, KeyC: 1, Backquote: 1
  };
  var I = DZ.input = {
    held: Object.create(null), pressed: Object.create(null), released: Object.create(null),
    text: "", backspace: false, textMode: false
  };
  I.init = function (canvas) {
    function key(e, down) {
      if (I.textMode) {
        if (document.activeElement === canvas) e.preventDefault();
        if (!down) { I.held[e.code] = false; return; }
        if (DZ.audio) DZ.audio.unlock();
        if (e.code === "Backspace") { I.backspace = true; return; }
        if (e.code === "Enter" || e.code === "Escape" || e.code.indexOf("Arrow") === 0) {
          if (!I.held[e.code]) I.pressed[e.code] = true;
          I.held[e.code] = true;
          return;
        }
        if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) I.text += e.key;
        return;
      }
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
  I.setTextMode = function (enabled) {
    I.textMode = enabled; I.text = ""; I.backspace = false;
    for (var h in I.held) delete I.held[h];
  };
  I.endFrame = function () {
    for (var p in I.pressed) delete I.pressed[p];
    for (var r in I.released) delete I.released[r];
    I.text = ""; I.backspace = false;
  };
}());
