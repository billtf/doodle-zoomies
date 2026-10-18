(function () {
  "use strict";
  var P = DZ.palette;
  var presets = DZ.art.coatPresets = [
    { id: "apricot", label: "Apricot", base: "#e8b26a", shade: "#c98b45" },
    { id: "cream", label: "Cream", base: "#f3ddad", shade: "#cbb27f" },
    { id: "chocolate", label: "Chocolate", base: "#855235", shade: "#5c3426" },
    { id: "black", label: "Black", base: "#3c3a42", shade: "#1f1e24" },
    { id: "gray", label: "Gray", base: "#9a9aa2", shade: "#6f707a" },
    { id: "red", label: "Red", base: "#c76c45", shade: "#984a32" },
    { id: "blue", label: "Blue", base: "#68a9d8", shade: "#427da9" },
    { id: "pink", label: "Pink", base: "#e99abb", shade: "#bd688f" }
  ];
  var cache = {}, current = null;
  DZ.art.coatCacheBuilds = 0;
  DZ.art.coatIndex = function (id) {
    for (var i = 0; i < presets.length; i++) if (presets[i].id === id) return i;
    return 0;
  };
  function paint(canvas, coat, state, phase) {
    var ctx = canvas.getContext("2d"), x = 60, y = 94;
    var duck = state === "duck", idle = state === "idle";
    var bounce = (state === "run" || idle) ? Math.sin(phase / 6 * Math.PI * 2) * 2 : 0;
    var leg = state === "run" ? Math.sin(phase / 6 * Math.PI * 2) * 7 : 4;
    var tail = Math.sin(phase / 6 * Math.PI * 2) * (idle ? 10 : 7);
    ctx.save(); ctx.translate(x, y + bounce); ctx.scale(duck ? 1.08 : 1, duck ? .72 : 1);
    ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-29, -34); ctx.quadraticCurveTo(-48, -52 + tail, -48, -27); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-5, -29, 31, 24, 0, 0, Math.PI * 2); DZ.art.shape(ctx, coat.base);
    ctx.beginPath(); ctx.ellipse(23, -48, 23, 21, -.1, 0, Math.PI * 2); DZ.art.shape(ctx, coat.base);
    ctx.beginPath(); ctx.ellipse(10, -50, 10, 20, .4, 0, Math.PI * 2); DZ.art.shape(ctx, coat.shade);
    ctx.beginPath(); ctx.ellipse(34, -40, 16, 11, 0, 0, Math.PI * 2); DZ.art.shape(ctx, P.cream);
    ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(42, -43, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(27, -55, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = P.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(7, -39); ctx.lineTo(30, -35); ctx.stroke();
    ctx.fillStyle = P.yellow; ctx.beginPath(); ctx.arc(18, -34, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = P.ink; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-22, -18); ctx.lineTo(-24 + leg, -3); ctx.moveTo(8, -17); ctx.lineTo(10 - leg, -3); ctx.stroke();
    ctx.strokeStyle = coat.base; ctx.lineWidth = 5; ctx.stroke();
    if (state === "hurt") {
      ctx.fillStyle = P.yellow; ctx.font = "bold 18px system-ui"; ctx.fillText("★", -32, -61); ctx.fillText("★", 7, -73);
    }
    ctx.restore();
  }
  DZ.art.setCoat = function (id) {
    var coat = presets[DZ.art.coatIndex(id)], states = ["run", "idle", "jumpRise", "jumpFall", "duck", "hurt"];
    if (current === coat.id) return coat.id;
    current = coat.id; cache = {};
    for (var s = 0; s < states.length; s++) for (var f = 0; f < 6; f++) {
      var canvas = document.createElement("canvas"); canvas.width = 120; canvas.height = 100;
      paint(canvas, coat, states[s], f); cache[states[s] + f] = canvas;
    }
    DZ.art.coatCacheBuilds++;
    return coat.id;
  };
  DZ.art.drawDoodle = function (ctx, player, time, title, still) {
    var state = title ? "idle" : player.state;
    if (state === "knockedOut") state = "hurt";
    if (!cache[state + "0"]) state = "run";
    var phase = still ? 0 : (time * (title ? 5 : 10)) % 6 | 0;
    var px = (title || still) ? Math.round(player.x) : player.x;
    var py = (title || still) ? Math.round(player.y) : player.y;
    ctx.save();
    if (player.facingBlink) ctx.globalAlpha = .35;
    if (player.spinAngle && !still) {
      ctx.translate(px, py - 45);ctx.rotate(player.spinAngle);
      ctx.drawImage(cache[state + phase], -60, -49);
    } else ctx.drawImage(cache[state + phase], px - 60, py - 94);
    ctx.restore();
  };
  DZ.art.setCoat("apricot");
}());
