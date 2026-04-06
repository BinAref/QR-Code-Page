/* /workspaces/QR-Code-Page/js/main.js */
(function(){
const URL_  = "https://ejuprlcqnesqfedkxoxa.supabase.co";
const ANON  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdXBybGNxbmVzcWZlZGt4b3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzQwNjUsImV4cCI6MjA4OTYxMDA2NX0.0FDt5y_QroHKgm7YmkicZIJ8ci-XlS3lQvBpnWT1P_8";

// ── Hardware Device Fingerprint ───────────────────────────────────────
// بدون Canvas (يختلف بين normal وincognito)
// يعتمد على: WebGL GPU renderer + موديل الجهاز + hardware specs
// نفس النتيجة في Chrome / Firefox / Safari / Incognito على نفس الجهاز
async function getDeviceId() {
  const parts = [];

  // 1. موديل الجهاز الفعلي — Chrome Android/Desktop فقط، لكنه أدق شيء ممكن
  try {
    const ua = await navigator.userAgentData?.getHighEntropyValues(
      ['model', 'platformVersion', 'architecture', 'bitness']
    );
    if (ua?.model)        parts.push('m:' + ua.model);           // "Pixel 8 Pro"
    if (ua?.architecture) parts.push('a:' + ua.architecture);    // "arm"
    if (ua?.bitness)      parts.push('b:' + ua.bitness);
  } catch(_) {}

  // 2. WebGL GPU renderer — ثابت 100% عبر كل المتصفحات (نفس GPU chip)
  try {
    const gl = document.createElement('canvas').getContext('webgl')
            || document.createElement('canvas').getContext('experimental-webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        parts.push('gr:' + gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)); // "Adreno (TM) 650"
        parts.push('gv:' + gl.getParameter(ext.UNMASKED_VENDOR_WEBGL));
      }
      parts.push('gver:' + gl.getParameter(gl.VERSION));
    }
  } catch(_) {}

  // 3. Hardware specs — لا علاقة لها بالمتصفح أو الـ incognito
  parts.push('s:' + screen.width + 'x' + screen.height + 'x' + screen.colorDepth);
  parts.push('c:' + String(navigator.hardwareConcurrency || 0)); // عدد CPU cores
  parts.push('r:' + String(navigator.deviceMemory || 0));        // حجم RAM بالـ GB
  parts.push('tz:' + Intl.DateTimeFormat().resolvedOptions().timeZone);
  // platform مفيد على Desktop
  const plt = navigator.userAgentData?.platform || '';
  if (plt) parts.push('p:' + plt);

  // 4. Hash SHA-256 → hwfp_XXXXXXXX
  const raw = parts.join('|');
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hex = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  return 'hwfp_' + hex;
}

async function main(){
  const app   = document.getElementById('app');
  const token = new URLSearchParams(location.search).get('t') || '';

  if(!token){ render.error(app,'err_invalid'); return; }

  let fullCode;
  try{
    const pad=token.length%4;
    const p=pad?token+'='.repeat(4-pad):token;
    fullCode=atob(p.replace(/-/g,'+').replace(/_/g,'/'));
  }catch(_){ render.error(app,'err_invalid'); return; }

  // ── فحص localStorage أولاً ───────────────────────────────────────
  if(store.isDisabled(fullCode)){    render.limitReached(app); return; }
  if(store.isDeviceLimited(fullCode)){render.deviceLimit(app);  return; }

  // ── فحص session cache (منع الازدواجية من نفس الجلسة) ────────────
  const cached = store.getCachedResult(fullCode);
  if(cached){
    render.type(app, cached.data_type, cached.data, cached.label || '');
    return;
  }

  // ── احسب hardware fingerprint للجهاز ────────────────────────────
  const deviceId = await getDeviceId();

  // ── Supabase ──────────────────────────────────────────────────────
  try{
    const res=await fetch(`${URL_}/functions/v1/scan_code`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':'Bearer '+ANON},
      body:JSON.stringify({
        full_code:  fullCode,
        device_code: deviceId,
        org_code:   fullCode.split('-')[0],
        method:     'web',
        source:     'qraise_web',
      }),
    });
    const data=await res.json();

    if(data.result==='expired'){
      render.expired(app); return;
    }
    if(data.result==='limit_reached'||data.result==='disabled'){
      store.markDisabled(fullCode); render.limitReached(app); return;
    }
    if(data.result==='device_limit_reached'){
      store.markDeviceLimited(fullCode); render.deviceLimit(app); return;
    }
    if(data.result!=='success'||!data.data){
      render.error(app,'err_notfound'); return;
    }

    // ── تخزين في session cache لمنع إعادة الاحتساب عند refresh ──────
    store.cacheResult(fullCode, {
      data_type: data.data_type,
      data:      data.data,
      label:     data.label || '',
    });

    render.type(app, data.data_type, data.data, data.label||'');
  }catch(_){
    render.error(app,'err_network');
  }
}

document.addEventListener('DOMContentLoaded',function(){
  const lt=document.querySelector('.loader-text');
  if(lt) lt.textContent=window.i18n.t('loading');
  main();
});
})();
