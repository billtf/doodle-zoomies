(function () {
  "use strict";
  DZ.palette = {
    ink: "#44352f", gold: "#e8b26a", shade: "#c98b45", cream: "#fff0cf",
    red: "#d85858", grass: "#78b86c", darkGrass: "#4e8e58", pavement: "#c8c7c6",
    sky: "#aee2f7", white: "#fffdf6", blue: "#548bc9", yellow: "#f6d65a"
  };
  DZ.art = DZ.art || {};
  DZ.art.shape = function (ctx, fill, stroke) {
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke || DZ.palette.ink; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.stroke();
  };
}());
