// One "Report my heat pump" button on the board's web page (skydoy/esphome-altherma).
// Reads the live Controller Software ID / Micon ID / Suggested Model states and opens the
// compatibility report form prefilled (field ids of .github/ISSUE_TEMPLATE/compatibility-report.yml).
(function () {
  var R = 'https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml';
  var s = { sw: '', mi: '', sug: '' }, all = {}, MAX = 7500;
  var pt = (navigator.language || '').toLowerCase().indexOf('pt') === 0;
  var b = document.createElement('button');
  b.textContent = pt ? '📝 Reportar a minha bomba' : '📝 Report my heat pump';
  b.title = pt ? 'Abre o formulário no GitHub com o Software ID e o Micon ID desta bomba' : 'Opens the GitHub form with this heat pump\'s Software ID and Micon ID';
  b.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 16px;border:0;border-radius:12px;background:#1f6feb;color:#fff;font:600 15px sans-serif;cursor:pointer;box-shadow:0 2px 8px #0004';
  function key(d) { return ((d.id || '') + ' ' + (d.name || '')).toLowerCase().replace(/[\s-]+/g, '_'); }
  function url() {
    var q = '&software_id=' + encodeURIComponent(s.sw || 'none') + '&micon_id=' + encodeURIComponent(s.mi || 'none') +
      '&install=' + encodeURIComponent('Web installer / Instalador web');
    var m = ['erga_eh_da_04_08', 'erga_eh_e_ej_04_08', 'erla_d_ebv_ebb_ebvz_11_16', 'erla_d_ebsh_11_16_ech2o', 'epra_d_etv_etb_etvz_14_18', 'altherma_ehvh_ehvx_cb'];
    if (m.indexOf(s.sug) >= 0) q += '&model_file=' + encodeURIComponent(s.sug);
    q += '&notes=' + encodeURIComponent('Suggested Model: ' + (s.sug || '-'));
    var lines = Object.keys(all).sort().map(function (k) { return all[k]; }), full = lines.join('\n'), cut = false, r = '';
    for (var i = 0; i < lines.length; i++) {
      var next = r + (r ? '\n' : '') + lines[i];
      if ((R + q + '&readings=' + encodeURIComponent(next)).length > MAX) { cut = true; break; }
      r = next;
    }
    if (cut) r = '[Truncated: ' + i + ' of ' + lines.length + ' readings. The full list was copied to your clipboard, paste it below. / ' +
      'Cortado: ' + i + ' de ' + lines.length + ' leituras. A lista completa foi copiada, cola-a aqui por baixo.]\n' + r;
    return { url: R + q + '&readings=' + encodeURIComponent(r), cut: cut, full: full };
  }
  b.onclick = function () {
    var u = url();
    if (u.cut && navigator.clipboard) navigator.clipboard.writeText(u.full).catch(function () {});
    window.open(u.url, '_blank', 'noopener');
  };
  window.altherma_report_url = url;
  function onState(e) {
    try {
      var d = JSON.parse(e.data), k = key(d), v = d.state == null ? '' : String(d.state);
      if (d.id) all[d.id] = (d.name || d.id) + ': ' + v;
      if (k.indexOf('software_id') >= 0) s.sw = v;
      else if (k.indexOf('micon_id') >= 0) s.mi = v;
      else if (k.indexOf('suggested_model') >= 0) s.sug = v;
    } catch (x) {}
  }
  function start() {
    document.body.appendChild(b);
    var es = new EventSource('/events');
    es.addEventListener('state', onState);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
