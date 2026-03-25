// js/main.js — التحكم الرئيسي

(function() {

const SUPABASE_URL  = "https://ejuprlcqnesqfedkxoxa.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdXBybGNxbmVzcWZlZGt4b3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzQwNjUsImV4cCI6MjA4OTYxMDA2NX0.0FDt5y_QroHKgm7YmkicZIJ8ci-XlS3lQvBpnWT1P_8";

async function main() {
  const app    = document.getElementById('app');
  const params = new URLSearchParams(location.search);
  const token  = params.get('t') || params.get('token') || '';

  // ── 1. تحقق من الـ token ─────────────────────────────────────
  if (!token) { render.error(app, 'err_invalid'); return; }

  // ── 2. فك base64 ─────────────────────────────────────────────
  let fullCode;
  try {
    const pad    = token.length % 4;
    const padded = pad ? token + '='.repeat(4 - pad) : token;
    fullCode = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  } catch(_) { render.error(app, 'err_invalid'); return; }

  // ── 3. تحقق محلي — صفر طلبات ─────────────────────────────────
  if (store.isDisabled(fullCode)) {
    render.limitReached(app); return;
  }
  if (store.isDeviceLimited(fullCode)) {
    render.deviceLimit(app); return;
  }

  // ── 4. طلب Supabase ───────────────────────────────────────────
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/scan_code`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify({
        full_code:   fullCode,
        device_code: 'web:' + btoa(navigator.userAgent).slice(0, 24),
        org_code:    fullCode.split('-')[0],
        method:      'web',
      }),
    });

    const data = await res.json();

    // ── 5. معالجة الردود ────────────────────────────────────────
    if (data.result === 'limit_reached' || data.result === 'disabled') {
      store.markDisabled(fullCode);     // لن يصل Supabase مجدداً
      render.limitReached(app);
      return;
    }

    if (data.result === 'device_limit_reached') {
      store.markDeviceLimited(fullCode); // لن يصل Supabase مجدداً
      render.deviceLimit(app);
      return;
    }

    if (data.result !== 'success' || !data.data) {
      render.error(app, 'err_notfound');
      return;
    }

    // ── 6. عرض البيانات ─────────────────────────────────────────
    render.type(app, data.data_type, data.data, data.label || '');

  } catch(_) {
    render.error(app, 'err_network');
  }
}

// تحديث نص "جاري التحميل" بلغة المتصفح
document.addEventListener('DOMContentLoaded', function() {
  const loaderText = document.querySelector('.loader-text');
  if (loaderText) loaderText.textContent = window.i18n.t('loading');
  main();
});

})();