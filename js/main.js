/* /workspaces/QR-Code-Page/js/main.js */
(function(){
const URL_  = "https://ejuprlcqnesqfedkxoxa.supabase.co";
const ANON  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdXBybGNxbmVzcWZlZGt4b3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzQwNjUsImV4cCI6MjA4OTYxMDA2NX0.0FDt5y_QroHKgm7YmkicZIJ8ci-XlS3lQvBpnWT1P_8";

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

  // ── Supabase ──────────────────────────────────────────────────────
  try{
    const res=await fetch(`${URL_}/functions/v1/scan_code`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':'Bearer '+ANON},
      body:JSON.stringify({
        full_code:fullCode,
        device_code:'web:'+btoa(navigator.userAgent).slice(0,24),
        org_code:fullCode.split('-')[0],
        method:'web',
      }),
    });
    const data=await res.json();

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