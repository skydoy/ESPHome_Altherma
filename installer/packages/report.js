// Board web page buttons (skydoy/esphome-altherma): "Report my heat pump", and "Install the right
// firmware" when the board knows the model and it is not the one installed (it presses the
// "Install the right firmware" button entity of installer/packages/identify.yaml).
// Reads the live Controller Software ID / Micon ID / Suggested Model states and opens the
// compatibility report form prefilled (field ids of .github/ISSUE_TEMPLATE/compatibility-report.yml).
(function () {
  var R = 'https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml';
  // BEGIN GENERATED models (installer/models.yaml, run installer/gen_models.py)
  var MODELS = ["erga_eh_da_04_08", "erga_eh_e_ej_04_08", "erla_d_ebv_ebb_ebvz_11_16", "erla_d_ebsh_11_16_ech2o", "epra_d_etv_etb_etvz_14_18", "altherma_ehvh_ehvx_cb", "erga_d_ehv_ehb_ehvz_dj_04_08", "erla03_d_ehfh_ehfz_dj_3", "erga_d_ehsh_x_p30_50_d_04_08_ech2o", "erga_e_ehsh_x_p30_50_e_ef_04_08_ech2o", "epra_d_etv16_etb16_etvz16_d_14_16", "epra_e_etv16_etb16_etvz16_e_ej_8_12", "epra_d_etsh_x_16p30_50_d_14_16_ech2o", "epra_d_d7_etsh_x_16p30_50_e_e7_14_18_ech2o", "epra_e_etsh_x_16p30_50_e_8_12_ech2o", "ebla_edla_d_4_8_monobloc", "ebla_edla_d_9_16_monobloc", "altherma_lt_ca_cb_04_08", "altherma_lt_cb_04_08_bizone", "altherma_lt_cb_11_16_bizone", "altherma_lt_eblq_eblq_ca_5_7_monobloc", "altherma_lt_eblq_edlq_ca_11_16_monobloc", "altherma_hybrid", "altherma_lt_multi_hybrid", "epga_d_eab_eav_eavz_d_j_11_16", "altherma_lt_multi_dhwhp", "ekhwet_bav3_multi_dhw_tank", "egsah_x_ewsah_x_d_6_10_geo3", "egsqh_a_10_geo2", "mini_chiller_ewaa_ewya_d_4_8", "mini_chiller_ewaa_ewya_d_9_16", "mini_chiller_ewaq_ewyq_b_4_8"];
  var CONFIRMED = ["erga_eh_da_04_08", "erga_eh_e_ej_04_08", "erla_d_ebv_ebb_ebvz_11_16", "erla_d_ebsh_11_16_ech2o", "epra_d_etv_etb_etvz_14_18", "altherma_ehvh_ehvx_cb"];
  // END GENERATED models
  var s = { sw: '', mi: '', sug: '', chk: '' }, all = {}, MAX = 7500;
  var pt = (navigator.language || '').toLowerCase().indexOf('pt') === 0;
  var b = document.createElement('button');
  b.textContent = pt ? '📝 Reportar a minha bomba' : '📝 Report my heat pump';
  b.title = pt ? 'Abre o formulário no GitHub com o Software ID e o Micon ID desta bomba' : 'Opens the GitHub form with this heat pump\'s Software ID and Micon ID';
  b.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 16px;border:0;border-radius:12px;background:#1f6feb;color:#fff;font:600 15px sans-serif;cursor:pointer;box-shadow:0 2px 8px #0004';
  var fw = document.createElement('button');
  fw.textContent = pt ? '⬇️ Instalar o firmware certo' : '⬇️ Install the right firmware';
  fw.style.cssText = b.style.cssText.replace('bottom:16px', 'bottom:68px').replace('#1f6feb', '#1a7f37');
  fw.hidden = true;
  fw.onclick = function () {
    var msg = pt ? 'Instalar o firmware para ' + s.sug + '? A placa reinicia sozinha (1–2 min). Não a desligues.'
                 : 'Install the firmware for ' + s.sug + '? The board restarts by itself (1–2 min). Do not unplug it.';
    if (!confirm(msg)) return;
    fw.disabled = true; fw.textContent = pt ? '⏳ A instalar…' : '⏳ Installing…';
    fetch('/button/' + encodeURIComponent('Install the right firmware') + '/press', { method: 'POST' })
      .catch(function () { fw.disabled = false; });
  };
  function showFw() { fw.hidden = !(CONFIRMED.indexOf(s.sug) >= 0 && s.chk.indexOf('OK') !== 0); }
  function key(d) { return ((d.id || '') + ' ' + (d.name || '')).toLowerCase().replace(/[\s-]+/g, '_'); }
  function url() {
    var q = '&software_id=' + encodeURIComponent(s.sw || 'none') + '&micon_id=' + encodeURIComponent(s.mi || 'none') +
      '&install=' + encodeURIComponent('Web installer / Instalador web');
    if (MODELS.indexOf(s.sug) >= 0) q += '&model_file=' + encodeURIComponent(s.sug);
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
      else if (k.indexOf('model_check') >= 0) s.chk = v;
      showFw();
    } catch (x) {}
  }
  function start() {
    document.body.appendChild(b);
    document.body.appendChild(fw);
    var es = new EventSource('/events');
    es.addEventListener('state', onState);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
