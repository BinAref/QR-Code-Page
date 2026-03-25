// js/store.js
(function(){
  const TTL=30*24*60*60*1000;
  function s(k,v){try{localStorage.setItem(k,JSON.stringify({v,t:Date.now()}))}catch(_){}}
  function g(k){try{const r=localStorage.getItem(k);if(!r)return null;const o=JSON.parse(r);if(Date.now()-o.t>TTL){localStorage.removeItem(k);return null}return o.v}catch(_){return null}}
  window.store={
    isDisabled:       c=>g('qrd_'+c)===true,
    isDeviceLimited:  c=>g('qrv_'+c)===true,
    markDisabled:     c=>s('qrd_'+c,true),
    markDeviceLimited:c=>s('qrv_'+c,true),
  };
})();