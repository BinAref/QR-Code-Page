// js/render.js — بناء واجهة كل نوع بنفس تصميم التطبيق

(function() {

const t = (k) => window.i18n.t(k);

// ── Type meta — نفس ألوان التطبيق ────────────────────────────────
const META = {
  url:      { icon: '🔗', color: '#2563eb', bg: '#eff6ff', typeKey: 'type_url'      },
  phone:    { icon: '📞', color: '#16a34a', bg: '#f0fdf4', typeKey: 'type_phone'    },
  email:    { icon: '✉️', color: '#ea580c', bg: '#fff7ed', typeKey: 'type_email'    },
  sms:      { icon: '💬', color: '#7c3aed', bg: '#f5f3ff', typeKey: 'type_sms'      },
  wifi:     { icon: '📶', color: '#0d9488', bg: '#f0fdfa', typeKey: 'type_wifi'     },
  location: { icon: '📍', color: '#dc2626', bg: '#fef2f2', typeKey: 'type_location' },
  contact:  { icon: '👤', color: '#6366f1', bg: '#eef2ff', typeKey: 'type_contact'  },
  event:    { icon: '📅', color: '#4338ca', bg: '#eef2ff', typeKey: 'type_event'    },
  text:     { icon: '📝', color: '#6366f1', bg: '#eef2ff', typeKey: 'type_text'     },
};

// ── Helpers ───────────────────────────────────────────────────────

// label كـ UI نص، value كمحتوى QR (لا يُترجم تلقائياً من المتصفح)
function row(labelKey, value) {
  if (!value) return '';
  return `<div class="data-row">
    <span class="data-label">${t(labelKey)}</span>
    <span class="data-value" translate="no">${escHtml(value)}</span>
  </div>`;
}

function btn(href, labelKey, extra) {
  const meta   = window._currentMeta || META.text;
  const isOut  = extra === 'outline';
  const cls    = isOut ? 'btn btn-outline' : 'btn btn-primary';
  const style  = isOut
    ? `style="color:${meta.color};border-color:${meta.color};"`
    : `style="background:${meta.color};"`;
  return `<a class="${cls}" href="${escHtml(href)}" ${style}>${t(labelKey)}</a>`;
}

function btnAction(href, labelKey, meta, outline) {
  const cls = outline ? 'btn btn-outline' : 'btn btn-primary';
  const style = outline
    ? `style="color:${meta.color};border-color:${meta.color};"`
    : `style="background:${meta.color};"`;
  return `<a class="${cls}" href="${escHtml(href)}" ${style}>${t(labelKey)}</a>`;
}

function copyBtn(id) {
  return `<button class="copy-chip" onclick="window.qrCopy('${id}')">${t('btn_copy')}</button>`;
}

function escHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function card(meta, label, typeName, rows, actions) {
  return `
    <div class="card">
      <div class="card-header">
        <div class="type-badge" style="background:${meta.bg};">${meta.icon}</div>
        <div>
          <div class="card-title" translate="no">${escHtml(label || typeName)}</div>
          <div class="card-subtitle">${typeName}</div>
        </div>
      </div>
      <div class="rows">${rows}</div>
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>
    <div class="toast" id="toast"></div>
  `;
}

// ── Type renderers ────────────────────────────────────────────────

const renderers = {

  url(d, label, meta) {
    const rows = row('lbl_url', d.url);
    const acts = btnAction(d.url, 'btn_open', meta);
    return card(meta, label, t('type_url'), rows, acts);
  },

  phone(d, label, meta) {
    const rows = row('lbl_phone', d.phone);
    const acts = btnAction('tel:' + d.phone, 'btn_call', meta);
    return card(meta, label, t('type_phone'), rows, acts);
  },

  email(d, label, meta) {
    const subj = d.subject ? '?subject=' + encodeURIComponent(d.subject) : '';
    const body = d.body    ? (subj ? '&' : '?') + 'body=' + encodeURIComponent(d.body) : '';
    const rows = row('lbl_email', d.email)
               + row('lbl_subject', d.subject)
               + row('lbl_body', d.body);
    const acts = btnAction('mailto:' + d.email + subj + body, 'btn_email', meta);
    return card(meta, label, t('type_email'), rows, acts);
  },

  sms(d, label, meta) {
    const rows = row('lbl_phone', d.phone)
               + row('lbl_message', d.message);
    const acts = btnAction('sms:' + d.phone, 'btn_sms', meta);
    return card(meta, label, t('type_sms'), rows, acts);
  },

  wifi(d, label, meta) {
    const passId = 'wifi_pass';
    const passRow = d.password ? `
      <div class="data-row">
        <span class="data-label">${t('lbl_password')}</span>
        <span class="data-value">
          <div class="pass-row">
            <span translate="no" id="${passId}">${escHtml(d.password)}</span>
            ${copyBtn(passId)}
          </div>
        </span>
      </div>` : row('lbl_password', t('hidden'));

    const rows = row('lbl_network', d.ssid)
               + row('lbl_security', d.security)
               + passRow;

    const acts = d.password
      ? `<button class="btn btn-primary" style="background:${meta.color};"
           onclick="window.qrCopy('${passId}')">${t('btn_copy_pass')}</button>`
      : '';

    return card(meta, label, t('type_wifi'), rows, acts);
  },

  location(d, label, meta) {
    const mapsUrl = `https://maps.google.com/?q=${d.lat},${d.lng}`;
    const coords  = `${d.lat}, ${d.lng}`;
    const rows = row('lbl_coords', coords)
               + row('lbl_location', d.label || d.name);
    const acts = btnAction(mapsUrl, 'btn_map', meta);
    return card(meta, label, t('type_location'), rows, acts);
  },

  contact(d, label, meta) {
    const name  = [d.first_name, d.last_name].filter(Boolean).join(' ') || d.name || '';
    const rows  = row('lbl_name',    name)
                + row('lbl_phone',   d.phone)
                + row('lbl_email',   d.email)
                + row('lbl_org',     d.org || d.organization)
                + row('lbl_job',     d.title || d.job)
                + row('lbl_website', d.website || d.url)
                + row('lbl_address', d.address);
    const acts  = d.phone
      ? btnAction('tel:' + d.phone, 'btn_call', meta)
      : '';
    return card(meta, label, t('type_contact'), rows, acts);
  },

  event(d, label, meta) {
    const title = d.summary || d.title || '';
    const rows  = row('lbl_event',    title)
                + row('lbl_start',    d.start)
                + row('lbl_end',      d.end)
                + row('lbl_location', d.location)
                + row('lbl_desc',     d.description);
    return card(meta, label, t('type_event'), rows, '');
  },

  text(d, label, meta) {
    const content = d.text || d.raw || JSON.stringify(d);
    const rows    = row('lbl_content', content);
    return card(meta, label, t('type_text'), rows, '');
  },

};

// ── State pages ───────────────────────────────────────────────────

function statePage(icon, titleKey, descKey, badgeKey, badgeBg, badgeColor) {
  return `
    <div class="state-page">
      <div class="state-icon">${icon}</div>
      <div class="state-title">${t(titleKey)}</div>
      <div class="state-desc">${t(descKey)}</div>
      <div class="state-badge" style="background:${badgeBg};color:${badgeColor};">${t(badgeKey)}</div>
    </div>`;
}

// ── Public API ────────────────────────────────────────────────────
window.render = {
  type(app, type, data, label) {
    const meta     = META[type] || META.text;
    window._currentMeta = meta;
    const fn       = renderers[type] || renderers.text;
    app.innerHTML  = fn(data, label, meta);
  },

  limitReached(app) {
    app.innerHTML = statePage(
      '🔒', 'limit_title', 'limit_desc', 'limit_badge',
      '#fef2f2', '#dc2626'
    );
  },

  deviceLimit(app) {
    app.innerHTML = statePage(
      '📵', 'device_title', 'device_desc', 'device_badge',
      '#fff7ed', '#ea580c'
    );
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

// ── Copy helper (global) ──────────────────────────────────────────
window.qrCopy = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard?.writeText(el.textContent || '').then(() => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = t('btn_copied');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
};

})();