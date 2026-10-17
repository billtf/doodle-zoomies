(function () {
  "use strict";
  var memory = {};
  DZ.storage = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback; }
    },
    set: function (key, value) {
      memory[key] = value;
      try { window.localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    }
  };
}());
