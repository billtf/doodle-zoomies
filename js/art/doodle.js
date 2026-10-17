(function () {
  "use strict";
  var P = DZ.palette;
  DZ.art.drawDoodle = function (ctx, player, time, title) {
    var x = player.x, y = player.y, duck = player.state === "duck";
    var bob = title ? Math.sin(time * 4) * 2 : (player.onGround ? Math.sin(time * 16) * 2 : 0);
    var sx = duck ? 1.08 : 1, sy = duck ? .72 : 1;
    ctx.save(); ctx.translate(x, y + bob); ctx.scale(sx, sy);
    if (player.facingBlink) ctx.globalAlpha = .35;
    ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-29, -34); ctx.quadraticCurveTo(-48, -52 + Math.sin(time * 12) * 8, -48, -27); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-5, -29, 31, 24, 0, 0, Math.PI * 2); DZ.art.shape(ctx, P.gold);
    ctx.beginPath(); ctx.ellipse(23, -48, 23, 21, -.1, 0, Math.PI * 2); DZ.art.shape(ctx, P.gold);
    ctx.beginPath(); ctx.ellipse(10, -50, 10, 20, .4, 0, Math.PI * 2); DZ.art.shape(ctx, P.shade);
    ctx.beginPath(); ctx.ellipse(34, -40, 16, 11, 0, 0, Math.PI * 2); DZ.art.shape(ctx, P.cream);
    ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(42, -43, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(27, -55, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = P.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(7, -39); ctx.lineTo(30, -35); ctx.stroke();
    ctx.fillStyle = P.yellow; ctx.beginPath(); ctx.arc(18, -34, 4, 0, Math.PI * 2); ctx.fill();
    var leg = player.onGround ? Math.sin(time * 18) * 7 : 4;
    ctx.strokeStyle = P.ink; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-22, -18); ctx.lineTo(-24 + leg, -3); ctx.moveTo(8, -17); ctx.lineTo(10 - leg, -3); ctx.stroke();
    ctx.strokeStyle = P.gold; ctx.lineWidth = 5; ctx.stroke();
    if (player.state === "hurt") {
      ctx.fillStyle = P.yellow; ctx.font = "bold 18px system-ui"; ctx.fillText("★", -32, -61); ctx.fillText("★", 7, -73);
    }
    ctx.restore();
  };
}());
