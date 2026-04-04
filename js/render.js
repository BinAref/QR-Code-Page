/* /workspaces/QR-Code-Page/js/render.js */

(function () {

const t = (k) => window.i18n.t(k);

/* ── SVG icons (inline — no icon font needed) ─────────────────── */
const SVG = {
  copy:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  link:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  phone:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.09 6.09l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  sms:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  wifi:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  map:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
  pin:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  user:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  cal:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  text:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
  ext:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

/* ── Type config — matches app colors exactly ─────────────────── */
const TYPE = {
  url:      { emoji:'🔗', color:'#2563eb', shadow:'rgba(37,99,235,.35)',  icon: SVG.ext,   btnKey:'btn_open',   actionKey:'btn_open'  },
  phone:    { emoji:'📞', color:'#16a34a', shadow:'rgba(22,163,74,.35)',  icon: SVG.phone, btnKey:'btn_call',   actionKey:'btn_call'  },
  email:    { emoji:'✉️', color:'#ea580c', shadow:'rgba(234,88,12,.35)',  icon: SVG.email, btnKey:'btn_email',  actionKey:'btn_email' },
  sms:      { emoji:'💬', color:'#7c3aed', shadow:'rgba(124,58,237,.35)', icon: SVG.sms,   btnKey:'btn_sms',    actionKey:'btn_sms'   },
  wifi:     { emoji:'📶', color:'#0d9488', shadow:'rgba(13,148,136,.35)', icon: SVG.wifi,  btnKey:'btn_copy_pass', actionKey:null     },
  location: { emoji:'📍', color:'#dc2626', shadow:'rgba(220,38,38,.35)',  icon: SVG.map,   btnKey:'btn_map',    actionKey:'btn_map'   },
  contact:  { emoji:'👤', color:'#6366f1', shadow:'rgba(99,102,241,.35)', icon: SVG.user,  btnKey:'btn_call',   actionKey:'btn_call'  },
  event:    { emoji:'📅', color:'#4338ca', shadow:'rgba(67,56,202,.35)',  icon: SVG.cal,   btnKey:null,         actionKey:null        },
  text:     { emoji:'📝', color:'#6366f1', shadow:'rgba(99,102,241,.35)', icon: SVG.text,  btnKey:null,         actionKey:null        },
};

/* ── Helpers ─────────────────────────────────────────────────── */
let _copyAllText = '';

function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Each field = app-style card with label, value and inline copy button
function field(labelKey, value, copyValue) {
  if (!value && value !== 0) return '';
  const val  = esc(String(value));
  const copy = copyValue ?? String(value);
  const id   = 'f_' + Math.random().toString(36).slice(2);
  _copyAllText += t(labelKey) + ': ' + copy + '\n';
  return `
    <div class="field-card">
      <div class="field-inner">
        <div class="field-body">
          <div class="field-label">${t(labelKey)}</div>
          <div class="field-value" translate="no" id="${id}">${val}</div>
        </div>
        <button class="field-copy" onclick="qrCopy('${id}')" title="${t('btn_copy')}">
          ${SVG.copy}
        </button>
      </div>
    </div>`;
}

// Primary action button with gradient + drop shadow
function actionBtn(href, labelKey, cfg, isBtn) {
  const label  = t(labelKey);
  const style  = `background:linear-gradient(135deg,${cfg.color},${cfg.color}cc);`
               + `box-shadow:0 4px 14px ${cfg.shadow};`;
  const icon   = cfg.icon;
  if (isBtn) {
    return `<button class="btn-action" style="${style}" onclick="location.href='${esc(href)}'">${icon}${label}</button>`;
  }
  return `<a class="btn-action" href="${esc(href)}" style="${style}">${icon}${label}</a>`;
}

// Copy-all button (square icon, matches app's copy icon button)
function copyAllBtn(cfg) {
  return `
    <button class="btn-copy-all" onclick="qrCopyAll()" title="${t('btn_copy')}"
      style="color:${cfg.color}">
      ${SVG.copy}
    </button>`;
}

/* ── App scaffold: appbar + scrollable body ──────────────────── */
function scaffold(cfg, typeKey, label, fieldsHtml, actionsHtml) {
  const typeName = t(typeKey);
  const bg = cfg.color + '1a'; // 10% opacity

  return `
    <div class="app-bar">
      <div class="app-bar-icon" style="background:${bg};">${cfg.emoji}</div>
      <div class="app-bar-text">
        <div class="app-bar-title" translate="no">${esc(label || typeName)}</div>
        <div class="app-bar-sub">${typeName}</div>
      </div>
    </div>
    <div class="app-body">
      ${fieldsHtml}
      ${actionsHtml ? `<div class="actions">${actionsHtml}</div>` : ''}
    </div>`;
}

/* ── Type renderers ──────────────────────────────────────────── */
const renderers = {

  url(d, label) {
    const cfg = TYPE.url;
    _copyAllText = '';
    const fields = field('lbl_url', d.url);
    const acts   = actionBtn(d.url, 'btn_open', cfg) + copyAllBtn(cfg);
    return scaffold(cfg, 'type_url', label, fields, acts);
  },

  phone(d, label) {
    const cfg = TYPE.phone;
    _copyAllText = '';
    const fields = field('lbl_phone', d.phone);
    const acts   = actionBtn('tel:' + d.phone, 'btn_call', cfg) + copyAllBtn(cfg);
    return scaffold(cfg, 'type_phone', label, fields, acts);
  },

  email(d, label) {
    const cfg  = TYPE.email;
    _copyAllText = '';
    const subj = d.subject ? '?subject=' + encodeURIComponent(d.subject) : '';
    const body = d.body ? (subj?'&':'?') + 'body=' + encodeURIComponent(d.body) : '';
    const fields = field('lbl_email', d.email)
                 + field('lbl_subject', d.subject)
                 + field('lbl_body', d.body);
    const acts   = actionBtn('mailto:' + d.email + subj + body, 'btn_email', cfg)
                 + copyAllBtn(cfg);
    return scaffold(cfg, 'type_email', label, fields, acts);
  },

  sms(d, label) {
    const cfg = TYPE.sms;
    _copyAllText = '';
    const fields = field('lbl_phone', d.phone)
                 + field('lbl_message', d.message);
    const acts   = actionBtn('sms:' + d.phone, 'btn_sms', cfg) + copyAllBtn(cfg);
    return scaffold(cfg, 'type_sms', label, fields, acts);
  },

  wifi(d, label) {
    const cfg = TYPE.wifi;
    _copyAllText = '';
    const passId = 'wifi_p';
    const passHtml = d.password
      ? `<div class="field-card"><div class="field-inner">
           <div class="field-body">
             <div class="field-label">${t('lbl_password')}</div>
             <div class="field-value" translate="no" id="${passId}">${esc(d.password)}</div>
           </div>
           <button class="field-copy" onclick="qrCopy('${passId}')">${SVG.copy}</button>
         </div></div>`
      : field('lbl_password', t('hidden'));
    const fields = field('lbl_network', d.ssid)
                 + field('lbl_security', d.security)
                 + passHtml;
    _copyAllText += t('lbl_password') + ': ' + (d.password || '') + '\n';
    const acts = d.password
      ? `<button class="btn-action" style="background:linear-gradient(135deg,${cfg.color},${cfg.color}cc);box-shadow:0 4px 14px ${cfg.shadow};"
           onclick="qrCopy('${passId}')">${SVG.wifi} ${t('btn_copy_pass')}</button>`
        + copyAllBtn(cfg)
      : '';
    return scaffold(cfg, 'type_wifi', label, fields, acts);
  },

  location(d, label) {
    const cfg     = TYPE.location;
    _copyAllText  = '';
    const mapsUrl = `https://maps.google.com/?q=${d.lat},${d.lng}`;
    const fields  = field('lbl_coords', `${d.lat}, ${d.lng}`)
                  + field('lbl_location', d.label || d.name);
    const acts    = actionBtn(mapsUrl, 'btn_map', cfg) + copyAllBtn(cfg);
    return scaffold(cfg, 'type_location', label, fields, acts);
  },

  contact(d, label) {
    const cfg  = TYPE.contact;
    _copyAllText = '';
    const name = [d.first_name, d.last_name].filter(Boolean).join(' ') || d.name || '';
    const fields = field('lbl_name',    name)
                 + field('lbl_phone',   d.phone)
                 + field('lbl_email',   d.email)
                 + field('lbl_org',     d.org || d.organization)
                 + field('lbl_job',     d.title || d.job)
                 + field('lbl_website', d.website || d.url)
                 + field('lbl_address', d.address);
    const acts = d.phone
      ? actionBtn('tel:' + d.phone, 'btn_call', cfg) + copyAllBtn(cfg)
      : copyAllBtn(cfg);
    return scaffold(cfg, 'type_contact', label, fields, acts);
  },

  event(d, label) {
    const cfg = TYPE.event;
    _copyAllText = '';
    const title = d.summary || d.title || '';
    const fields = field('lbl_event',    title)
                 + field('lbl_start',    d.start)
                 + field('lbl_end',      d.end)
                 + field('lbl_location', d.location)
                 + field('lbl_desc',     d.description);
    const acts = copyAllBtn(cfg);
    return scaffold(cfg, 'type_event', label, fields, acts);
  },

  text(d, label) {
    const cfg    = TYPE.text;
    _copyAllText = '';
    const content = d.text || d.raw || JSON.stringify(d);
    const fields  = field('lbl_content', content);
    const acts    = copyAllBtn(cfg);
    return scaffold(cfg, 'type_text', label, fields, acts);
  },
};

/* ── State pages ─────────────────────────────────────────────── */
function statePage(icon, titleKey, descKey, badgeBg, badgeColor, badgeKey) {
  return `
    <div class="state-page">
      <div class="state-icon">${icon}</div>
      <div class="state-title">${t(titleKey)}</div>
      <div class="state-desc">${t(descKey)}</div>
      <div class="state-badge" style="background:${badgeBg};color:${badgeColor};">${t(badgeKey)}</div>
    </div>`;
}

/* ── Public API ──────────────────────────────────────────────── */
window.render = {
  type(app, type, data, label) {
    const fn = renderers[type] || renderers.text;
    app.innerHTML = fn(data, label || '');
  },
  limitReached(app) {
    app.innerHTML = statePage('🔒','limit_title','limit_desc','#fef2f2','#dc2626','limit_badge');
  },
  deviceLimit(app) {
    app.innerHTML = statePage('📵','device_title','device_desc','#fff7ed','#ea580c','device_badge');
  },
  error(app, msgKey) {
    app.innerHTML = `
      <div class="state-page">
        <div class="state-icon">⚠️</div>
        <div class="state-title">${t('err_title')}</div>
        <div class="state-desc">${t(msgKey || 'err_network')}</div>
      </div>`;
  },
};

/* ── Global helpers ──────────────────────────────────────────── */
window.qrCopy = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard?.writeText(el.textContent || '').then(showToast);
};

window.qrCopyAll = function() {
  navigator.clipboard?.writeText(_copyAllText.trim()).then(showToast);
};

function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = t('btn_copied');
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

})();