// js/store.js — localStorage مع TTL

(function() {
  const TTL = 30 * 24 * 60 * 60 * 1000; // 30 يوم

  function set(key, val) {
    try { localStorage.setItem(key, JSON.stringify({ v: val, t: Date.now() })); }
    catch(_) {}
  }

  function get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (Date.now() - obj.t > TTL) { localStorage.removeItem(key); return null; }
      return obj.v;
    } catch(_) { return null; }
  }

  window.store = {
    isDisabled:       (code) => get('qrd_' + code) === true,
    isDeviceLimited:  (code) => get('qrv_' + code) === true,
    markDisabled:     (code) => set('qrd_' + code, true),
    markDeviceLimited:(code) => set('qrv_' + code, true),
  };
})();