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
    },
    remove: function (key) {
      delete memory[key];
      try { window.localStorage.removeItem(key); return true; }
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
  var zeroBest = { score: 0, distance: 0 };
  DZ.bests = {
    key: "dz.v1.bests",
    legacyKey: "dz.v1.best",
    nameKey: function (name) { return DZ.profile.sanitizeName(name).toLowerCase(); },
    loadAll: function (currentName, migrateLegacy) {
      var raw = DZ.storage.get(this.key, {}), clean = {}, key, record, safeName;
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) raw = {};
      for (key in raw) if (Object.prototype.hasOwnProperty.call(raw, key)) {
        record = raw[key];
        if (!record || typeof record !== "object") continue;
        safeName = DZ.profile.sanitizeName(record.name || key);
        clean[this.nameKey(safeName)] = {
          name: safeName,
          score: Number.isFinite(record.score) && record.score > 0 ? record.score : 0,
          distance: Number.isFinite(record.distance) && record.distance > 0 ? record.distance : 0
        };
      }
      if (migrateLegacy) this.migrateLegacy(clean, currentName);
      return clean;
    },
    migrateLegacy: function (all, currentName) {
      var legacy = DZ.storage.get(this.legacyKey, null);
      if (!legacy || typeof legacy !== "object") return false;
      var score = Number.isFinite(legacy.score) ? Math.max(0, legacy.score) : 0;
      var distance = Number.isFinite(legacy.distance) ? Math.max(0, legacy.distance) : 0;
      var key = this.nameKey(currentName), existing = all[key] || zeroBest;
      all[key] = {
        name: DZ.profile.sanitizeName(currentName),
        score: Math.max(existing.score, score),
        distance: Math.max(existing.distance, distance)
      };
      DZ.storage.set(this.key, all);
      DZ.storage.remove(this.legacyKey);
      return true;
    },
    get: function (all, name) { return all[this.nameKey(name)] || zeroBest; },
    update: function (all, name, score, distance) {
      var key = this.nameKey(name), existing = all[key] || zeroBest;
      all[key] = {
        name: DZ.profile.sanitizeName(name),
        score: Math.max(existing.score, score),
        distance: Math.max(existing.distance, distance)
      };
      DZ.storage.set(this.key, all);
      return all[key];
    },
    top: function (all, limit) {
      var rows = [], key;
      for (key in all) if (Object.prototype.hasOwnProperty.call(all, key)) rows.push(all[key]);
      rows.sort(function (a, b) { return b.score - a.score || b.distance - a.distance || a.name.localeCompare(b.name); });
      return rows.slice(0, limit || 5);
    }
  };
}());
