(function () {
  "use strict";
  window.DZ = window.DZ || {};
  DZ.config = {
    width: 960, height: 540, step: 1 / 60, maxDelta: 0.1,
    groundY: 440, metersPerPixel: 1 / 50,
    player: {
      startX: 260, minX: 173, maxX: 528, drawW: 82, drawH: 66,
      accel: 900, maxMoveSpeed: 320, gravity: 2600, jumpVelocity: 900,
      jumpCut: 0.45, fastFall: 2.2, coyote: 0.09, jumpBuffer: 0.12,
      hearts: 3, invulnerable: 1.2,
      hitboxes: { run: [56, 44], jump: [50, 46], duck: [64, 22] }
    },
    speed: { bandMin: 0.7, bandMax: 1.35, finalCap: 640 },
    limits: { obstacles: 12, collectibles: 30, particles: 150 },
    reactionTime: 0.35, gameOverGuard: 0.6,
    powerups: { zoomies: 5, shieldGap: 600, zoomiesGap: 1200, heartGap: 900 },
    audio: { master: 0.6, music: 0.35, bpm: 110 },
    colors: { outline: "#44352f" },
    reduceMotion: !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  };
}());
