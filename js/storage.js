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
  DZ.profile = {
    key: "dz.v1.profile",
    sanitizeName: function (value) {
      var clean = String(value || "").replace(/[^a-zA-Z0-9 '\-]/g, "").replace(/\s+/g, " ").trim();
      return clean.slice(0, 12) || "Doodle";
    },
    load: function () {
      var saved = DZ.storage.get(this.key, null);
      if (!saved || typeof saved !== "object") return { name: "Doodle", color: "apricot", customized: false };
      return {
        name: this.sanitizeName(saved.name),
        color: typeof saved.color === "string" ? saved.color : "apricot",
        customized: saved.customized === true
      };
    },
    save: function (profile) {
      profile.name = this.sanitizeName(profile.name);
      profile.customized = true;
      return DZ.storage.set(this.key, profile);
    }
  };
}());
