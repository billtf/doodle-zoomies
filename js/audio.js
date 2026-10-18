(function () {
  "use strict";
  var A = DZ.audio = { ctx: null, muted: false, nextBeat: 0, beat: 0, unlocked: false };
  A.init = function () { A.muted = !!DZ.storage.get("dz.v1.mute", false); };
  A.unlock = function () {
    if (A.unlocked) { if (A.ctx && A.ctx.state === "suspended") A.ctx.resume(); return; }
    try {
      A.ctx = new (window.AudioContext || window.webkitAudioContext)();
      A.unlocked = true; A.nextBeat = A.ctx.currentTime + 0.1;
    } catch (e) { A.ctx = null; }
  };
  function tone(freq, duration, type, volume, slide) {
    if (!A.ctx || A.muted) return;
    var t = A.ctx.currentTime, o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + duration);
    g.gain.setValueAtTime(volume * DZ.config.audio.master, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g); g.connect(A.ctx.destination); o.start(t); o.stop(t + duration);
  }
  A.sfx = function (name) {
    var map = {
      jump: [330, .12, "sine", .18, 560], land: [90, .08, "triangle", .12, 50],
      doubleJump: [230, .18, "sawtooth", .16, 520],
      duck: [240, .09, "sawtooth", .08, 80], bone: [660, .1, "square", .12, 880],
      tennis: [520, .17, "square", .12, 1040], power: [330, .35, "sine", .15, 1200],
      hit: [540, .28, "square", .18, 100], bark: [180, .18, "sawtooth", .16, 110],
      gameover: [260, .65, "triangle", .16, 90], streak: [700, .25, "square", .12, 1200]
    }, v = map[name]; if (v) tone(v[0], v[1], v[2], v[3], v[4]);
  };
  A.toggle = function () { A.muted = !A.muted; DZ.storage.set("dz.v1.mute", A.muted); };
  A.updateMusic = function (playing, tier) {
    if (!A.ctx || A.muted || !playing) return;
    var interval = 60 / (DZ.config.audio.bpm + tier * 4) / 2, notes = [262, 330, 392, 330, 294, 349, 440, 349];
    if (A.ctx.currentTime >= A.nextBeat) {
      tone(notes[A.beat & 7], .09, "square", .035 * DZ.config.audio.music, 0);
      A.beat++; A.nextBeat = A.ctx.currentTime + interval;
    }
  };
}());
