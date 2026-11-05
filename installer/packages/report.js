// Board web page buttons (skydoy/esphome-altherma): "Report my heat pump", and "Install the right
// firmware" when the board knows the model and it is not the one installed (it presses the
// "Install the right firmware" button entity of installer/packages/identify.yaml).
// Reads the live Controller Software ID / Micon ID / Suggested Model states and opens the
// compatibility report form prefilled (field ids of .github/ISSUE_TEMPLATE/compatibility-report.yml).
// Debug log panel size: the stock web_server v3 log grows to the full page height. Cap it and
// scroll inside (newest lines stay visible at the top). Same fix as ESPHome_AC core/web-log.js.
(function () {
  var CSS = '.logs{max-height:min(45vh,420px);overflow-y:auto;overscroll-behavior:contain}';
  function fix() {
    var app = document.querySelector('esp-app'), log = app && app.shadowRoot && app.shadowRoot.querySelector('esp-log');
    var root = log && log.shadowRoot;
    if (!root) return false;
    if (!root.getElementById('altherma-log-css')) {
      var st = document.createElement('style'); st.id = 'altherma-log-css'; st.textContent = CSS; root.appendChild(st);
    }
    return true;
  }
  var n = 0, t = setInterval(function () { if (fix() || ++n > 120) clearInterval(t); }, 250);
})();
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

// Live heat-pump schematic: inject an SVG into esp-app's shadowRoot and fill chips from /events
// state messages. Matching is by normalized name/id substrings so other models degrade gracefully
// (missing chips stay hidden). Log height cap above already targets esp-log.shadowRoot.
(function () {
  var MAP = [
    // key, match substrings (normalized), unit hint, PT label used in aria/title
    ['tout',   ['outdoorairtemp','r1toutdoorair'], '°C', 'Ar exterior'],
    ['thx',    ['outdoorheatexch'], '°C', 'Permutador exterior'],
    ['tdis',   ['dischargepipe','dischargetemp','compressoroutlet'], '°C', 'Descarga'],
    ['tsuc',   ['suctionpipe','suctiontemp'], '°C', 'Sucção'],
    ['freq',   ['compressorfrequency','invfrequency'], 'Hz', 'Compressor'],
    ['tlw',    ['leavingwatertempafterbuh','leavingwatertempbeforebuh','leavingwatertemp'], '°C', 'Água de saída'],
    ['tlwb',   ['leavingwatertempbeforebuh'], '°C', 'Água antes BUH'],
    ['tin',    ['inletwatertemp'], '°C', 'Água de retorno'],
    ['tdhw',   ['dhwtanktemp'], '°C', 'Depósito AQS'],
    ['flow',   ['flowsensor'], 'L/min', 'Caudal'],
    ['buh1',   ['backupheaterstep1'], '', 'Resistência 1'],
    ['buh2',   ['backupheaterstep2'], '', 'Resistência 2'],
    ['valve',  ['3wayvalve','threewayvalve'], '', 'Válvula 3 vias'],
    ['pump',   ['waterpumpoperation'], '', 'Bomba de água'],
    ['space',  ['spaceheatingoperation'], '', 'Aquecimento'],
    ['mode',   ['operationmode'], '', 'Modo'],
    ['liquid', ['refrigtempliquidside','liquidpipetemp'], '°C', 'Líquido']
  ];
  // Prefer more specific leaving-water matches: after BUH > before BUH > generic
  var vals = {}, seen = {};

  function norm(s) {
    return String(s || '').toLowerCase().replace(/[\s\-_/().]+/g, '').replace(/[⁄]/g, '');
  }
  function matchKey(d) {
    var k = norm((d.id || '') + ' ' + (d.name || ''));
    var hit = null, score = -1;
    for (var i = 0; i < MAP.length; i++) {
      var m = MAP[i], best = -1;
      for (var j = 0; j < m[1].length; j++) {
        var p = m[1][j];
        if (k.indexOf(p) >= 0 && p.length > best) best = p.length;
      }
      if (best > score) { score = best; hit = m[0]; }
    }
    return hit;
  }
  function fmt(key, d) {
    var st = d.state == null ? '' : String(d.state);
    if (d.value != null && typeof d.value === 'number' && isFinite(d.value)) {
      var u = '';
      for (var i = 0; i < MAP.length; i++) if (MAP[i][0] === key) { u = MAP[i][2]; break; }
      var n = d.value;
      var dec = (key === 'freq' || key === 'flow') ? 0 : 1;
      return n.toFixed(dec) + (u ? '\u00a0' + u : '');
    }
    // binary / text
    if (/^(ON|OFF|True|False)$/i.test(st)) return st.toUpperCase() === 'ON' || st.toUpperCase() === 'TRUE' ? 'ON' : 'OFF';
    // strip redundant unit already in state
    return st.replace(/\s+/g, '\u00a0');
  }
  function isOn(v) {
    if (v == null) return false;
    var s = String(v).toUpperCase();
    return s === 'ON' || s === 'TRUE' || s === '1' || /^ON\b/.test(s);
  }
  function valveIsDhw(v) {
    if (v == null) return null;
    var s = String(v).toUpperCase();
    if (s.indexOf('DHW') >= 0 || s === 'ON' || s === 'TRUE') return true;
    if (s.indexOf('SPACE') >= 0 || s === 'OFF' || s === 'FALSE') return false;
    return null;
  }

  var SVG = ''
    + '<svg viewBox="0 0 760 320" role="img" aria-label="Esquema da bomba de calor">'
    + '<defs>'
    + '<marker id="ad-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
    + '<path d="M0 0 L10 5 L0 10 z" fill="currentColor" opacity=".55"/></marker>'
    + '<linearGradient id="ad-tank" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0%" stop-color="#f4a261"/><stop offset="100%" stop-color="#e76f51"/></linearGradient>'
    + '</defs>'
    // Outdoor unit
    + '<g class="ad-block" transform="translate(20,40)">'
    + '<rect width="200" height="200" rx="14" class="ad-box"/>'
    + '<text x="100" y="22" text-anchor="middle" class="ad-title">Unidade exterior</text>'
    // fan
    + '<circle cx="70" cy="95" r="36" class="ad-fan"/><circle cx="70" cy="95" r="8" class="ad-fan-hub"/>'
    + '<path d="M70 65 L78 90 L70 95 L62 90 Z M70 125 L78 100 L70 95 L62 100 Z M40 95 L65 87 L70 95 L65 103 Z M100 95 L75 87 L70 95 L75 103 Z" class="ad-fan-blade"/>'
    // compressor body
    + '<rect x="120" y="70" width="60" height="50" rx="8" class="ad-comp"/>'
    + '<text x="150" y="100" text-anchor="middle" class="ad-small">comp</text>'
    + '<g data-chip="tout" transform="translate(16,150)"><rect width="168" height="22" rx="6" class="ad-chip"/><text x="8" y="15" class="ad-chip-l">Ar ext.</text><text x="160" y="15" text-anchor="end" class="ad-chip-v" data-v="tout">—</text></g>'
    + '<g data-chip="freq" transform="translate(16,176)"><rect width="168" height="22" rx="6" class="ad-chip"/><text x="8" y="15" class="ad-chip-l">Freq.</text><text x="160" y="15" text-anchor="end" class="ad-chip-v" data-v="freq">—</text></g>'
    + '<g data-chip="tdis" transform="translate(16,30)"><rect width="80" height="20" rx="5" class="ad-chip ad-hot"/><text x="6" y="14" class="ad-chip-l">Desc.</text><text x="74" y="14" text-anchor="end" class="ad-chip-v" data-v="tdis">—</text></g>'
    + '<g data-chip="tsuc" transform="translate(104,30)"><rect width="80" height="20" rx="5" class="ad-chip ad-cold"/><text x="6" y="14" class="ad-chip-l">Sucç.</text><text x="74" y="14" text-anchor="end" class="ad-chip-v" data-v="tsuc">—</text></g>'
    + '</g>'
    // Plate HX
    + '<g class="ad-block" transform="translate(260,70)">'
    + '<rect width="120" height="140" rx="10" class="ad-box ad-hx"/>'
    + '<text x="60" y="22" text-anchor="middle" class="ad-title">Permutador</text>'
    + '<path d="M20 40 H100 M20 55 H100 M20 70 H100 M20 85 H100 M20 100 H100 M20 115 H100" class="ad-plates"/>'
    + '<g data-chip="thx" transform="translate(10,122)"><rect width="100" height="20" rx="5" class="ad-chip"/><text x="6" y="14" class="ad-chip-l">HX</text><text x="94" y="14" text-anchor="end" class="ad-chip-v" data-v="thx">—</text></g>'
    + '<g data-chip="liquid" transform="translate(10,40)"><rect width="100" height="18" rx="5" class="ad-chip"/><text x="6" y="13" class="ad-chip-l">Liq.</text><text x="94" y="13" text-anchor="end" class="ad-chip-v" data-v="liquid">—</text></g>'
    + '</g>'
    // DHW tank
    + '<g class="ad-block" transform="translate(560,20)">'
    + '<rect width="170" height="110" rx="14" class="ad-box"/>'
    + '<text x="85" y="20" text-anchor="middle" class="ad-title">Depósito AQS</text>'
    + '<rect x="55" y="32" width="60" height="70" rx="20" fill="url(#ad-tank)" opacity=".85"/>'
    + '<rect x="55" y="32" width="60" height="70" rx="20" class="ad-tank-stroke"/>'
    + '<g data-chip="tdhw" transform="translate(10,78)"><rect width="150" height="22" rx="6" class="ad-chip"/><text x="8" y="15" class="ad-chip-l">AQS</text><text x="142" y="15" text-anchor="end" class="ad-chip-v" data-v="tdhw">—</text></g>'
    + '</g>'
    // Heating / water circuit
    + '<g class="ad-block" transform="translate(420,150)">'
    + '<rect width="310" height="140" rx="14" class="ad-box"/>'
    + '<text x="155" y="20" text-anchor="middle" class="ad-title">Circuito de aquecimento</text>'
    // emitters icon
    + '<g transform="translate(220,40)" class="ad-emit">'
    + '<rect x="0" y="10" width="10" height="50" rx="2"/><rect x="16" y="10" width="10" height="50" rx="2"/><rect x="32" y="10" width="10" height="50" rx="2"/>'
    + '<rect x="-4" y="8" width="50" height="4" rx="1"/><rect x="-4" y="58" width="50" height="4" rx="1"/>'
    + '</g>'
    + '<g data-chip="tlw" transform="translate(12,36)"><rect width="190" height="22" rx="6" class="ad-chip ad-hot"/><text x="8" y="15" class="ad-chip-l">Saída</text><text x="182" y="15" text-anchor="end" class="ad-chip-v" data-v="tlw">—</text></g>'
    + '<g data-chip="tin" transform="translate(12,62)"><rect width="190" height="22" rx="6" class="ad-chip ad-cold"/><text x="8" y="15" class="ad-chip-l">Retorno</text><text x="182" y="15" text-anchor="end" class="ad-chip-v" data-v="tin">—</text></g>'
    + '<g data-chip="flow" transform="translate(12,88)"><rect width="120" height="22" rx="6" class="ad-chip"/><text x="8" y="15" class="ad-chip-l">Caudal</text><text x="112" y="15" text-anchor="end" class="ad-chip-v" data-v="flow">—</text></g>'
    + '<g data-chip="buh1" transform="translate(140,88)"><rect width="70" height="22" rx="6" class="ad-chip"/><text x="8" y="15" class="ad-chip-l">BUH1</text><text x="62" y="15" text-anchor="end" class="ad-chip-v" data-v="buh1">—</text></g>'
    + '<g data-chip="buh2" transform="translate(218,88)"><rect width="70" height="22" rx="6" class="ad-chip"/><text x="8" y="15" class="ad-chip-l">BUH2</text><text x="62" y="15" text-anchor="end" class="ad-chip-v" data-v="buh2">—</text></g>'
    + '<g data-chip="valve" transform="translate(12,114)"><rect width="160" height="20" rx="5" class="ad-chip"/><text x="8" y="14" class="ad-chip-l">3 vias</text><text x="152" y="14" text-anchor="end" class="ad-chip-v" data-v="valve">—</text></g>'
    + '<g data-chip="pump" transform="translate(180,114)"><rect width="110" height="20" rx="5" class="ad-chip"/><text x="8" y="14" class="ad-chip-l">Bomba</text><text x="102" y="14" text-anchor="end" class="ad-chip-v" data-v="pump">—</text></g>'
    + '</g>'
    // Pipes
    + '<g class="ad-pipes" fill="none" stroke="currentColor" stroke-width="3" marker-end="url(#ad-arr)">'
    + '<path d="M220 120 H260" opacity=".7"/>'
    + '<path d="M380 120 H420" opacity=".7"/>'
    + '<path d="M380 160 C420 160, 480 90, 560 90" opacity=".55"/>'
    + '<path d="M575 130 C500 180, 420 200, 420 200" opacity=".45"/>'
    + '</g>'
    // status strip
    + '<g transform="translate(20,268)">'
    + '<g data-chip="mode"><rect width="220" height="24" rx="8" class="ad-chip"/><text x="10" y="16" class="ad-chip-l">Modo</text><text x="210" y="16" text-anchor="end" class="ad-chip-v" data-v="mode">—</text></g>'
    + '<g data-chip="space" transform="translate(240,0)"><rect width="160" height="24" rx="8" class="ad-chip"/><text x="10" y="16" class="ad-chip-l">Aquecimento</text><text x="150" y="16" text-anchor="end" class="ad-chip-v" data-v="space">—</text></g>'
    + '</g>'
    + '</svg>';

  var STYLE = ''
    + '#altherma-diagram{margin:8px 12px 4px;padding:10px 12px 8px;border-radius:12px;'
    + 'background:color-mix(in srgb,Canvas 92%,CanvasText 8%);'
    + 'border:1px solid color-mix(in srgb,CanvasText 12%,transparent);color:CanvasText;'
    + 'font-family:system-ui,-apple-system,sans-serif}'
    + '#altherma-diagram h2{margin:0 0 6px;font:600 15px/1.2 system-ui,sans-serif;opacity:.85}'
    + '#altherma-diagram .ad-sub{margin:0 0 8px;font:12px/1.3 system-ui,sans-serif;opacity:.55}'
    + '#altherma-diagram svg{width:100%;height:auto;display:block;max-height:360px}'
    + '#altherma-diagram .ad-box{fill:color-mix(in srgb,Canvas 88%,CanvasText 12%);stroke:color-mix(in srgb,CanvasText 22%,transparent);stroke-width:1.5}'
    + '#altherma-diagram .ad-hx{fill:color-mix(in srgb,Canvas 80%,#4cc9f0 20%)}'
    + '#altherma-diagram .ad-title{font:600 12px system-ui,sans-serif;fill:currentColor;opacity:.8}'
    + '#altherma-diagram .ad-small{font:10px system-ui,sans-serif;fill:currentColor;opacity:.55}'
    + '#altherma-diagram .ad-fan{fill:none;stroke:currentColor;stroke-width:2;opacity:.45}'
    + '#altherma-diagram .ad-fan-hub{fill:currentColor;opacity:.4}'
    + '#altherma-diagram .ad-fan-blade{fill:currentColor;opacity:.35}'
    + '#altherma-diagram .ad-comp{fill:color-mix(in srgb,Canvas 70%,CanvasText 30%);stroke:currentColor;stroke-width:1;opacity:.7}'
    + '#altherma-diagram .ad-plates{stroke:currentColor;stroke-width:2;opacity:.35}'
    + '#altherma-diagram .ad-tank-stroke{fill:none;stroke:currentColor;stroke-width:1.5;opacity:.5}'
    + '#altherma-diagram .ad-emit rect{fill:currentColor;opacity:.35}'
    + '#altherma-diagram .ad-pipes{color:color-mix(in srgb,CanvasText 55%,#4a90d9 45%)}'
    + '#altherma-diagram .ad-chip{fill:color-mix(in srgb,Canvas 70%,CanvasText 30%);opacity:.95}'
    + '#altherma-diagram .ad-chip.ad-hot{fill:color-mix(in srgb,#e85d04 35%,Canvas 65%)}'
    + '#altherma-diagram .ad-chip.ad-cold{fill:color-mix(in srgb,#219ebc 35%,Canvas 65%)}'
    + '#altherma-diagram .ad-chip-l{font:600 10px system-ui,sans-serif;fill:currentColor;opacity:.7}'
    + '#altherma-diagram .ad-chip-v{font:700 11px ui-monospace,Menlo,monospace;fill:currentColor}'
    + '#altherma-diagram [data-chip]{display:none}'
    + '#altherma-diagram [data-chip].on{display:inline}'
    + '#altherma-diagram [data-chip].active .ad-chip{stroke:#2a9d8f;stroke-width:1.5}'
    + '@media (max-width:600px){#altherma-diagram{margin:6px 6px 2px;padding:8px}'
    + '#altherma-diagram h2{font-size:14px}#altherma-diagram svg{max-height:280px}}';

  function paint(root) {
    if (!root) return;
    Object.keys(vals).forEach(function (key) {
      var nodes = root.querySelectorAll('[data-v="' + key + '"]');
      var chip = root.querySelectorAll('[data-chip="' + key + '"]');
      var v = vals[key];
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = v || '—';
      for (var j = 0; j < chip.length; j++) {
        if (v) chip[j].classList.add('on');
        else chip[j].classList.remove('on');
        if (key === 'buh1' || key === 'buh2' || key === 'pump' || key === 'space') {
          if (isOn(v)) chip[j].classList.add('active'); else chip[j].classList.remove('active');
        }
        if (key === 'valve') {
          var dhw = valveIsDhw(v);
          if (dhw === true) chip[j].classList.add('active'); else chip[j].classList.remove('active');
        }
      }
    });
    // leaving water preference: if both before and after exist, show after as tlw
    if (vals.tlwb && !vals.tlw) {
      var n = root.querySelectorAll('[data-v="tlw"]');
      for (var i = 0; i < n.length; i++) n[i].textContent = vals.tlwb;
      var c = root.querySelectorAll('[data-chip="tlw"]');
      for (var j = 0; j < c.length; j++) c[j].classList.add('on');
    }
  }

  function applyState(d) {
    var key = matchKey(d);
    if (!key) return;
    // Prefer after-BUH over before/generic for tlw
    if (key === 'tlw' || key === 'tlwb') {
      var k = norm((d.id || '') + ' ' + (d.name || ''));
      if (k.indexOf('afterbuh') >= 0) key = 'tlw';
      else if (k.indexOf('beforebuh') >= 0) key = 'tlwb';
      else if (vals.tlw && key === 'tlw') return; // keep more specific
    }
    // Avoid matching "suction" inside unrelated, and prefer pipe over vague suctiontemp when both
    vals[key] = fmt(key, d);
    seen[key] = true;
    var el = document.getElementById('altherma-diagram');
    if (el) paint(el);
  }

  function mount() {
    var app = document.querySelector('esp-app');
    var sr = app && app.shadowRoot;
    if (!sr) return false;
    var main = sr.querySelector('main');
    if (!main) return false;
    if (!sr.getElementById('altherma-diagram-css')) {
      var st = document.createElement('style');
      st.id = 'altherma-diagram-css';
      st.textContent = STYLE;
      sr.appendChild(st);
    }
    var el = sr.getElementById('altherma-diagram');
    if (!el) {
      el = document.createElement('section');
      el.id = 'altherma-diagram';
      el.innerHTML = '<h2>Esquema da bomba de calor</h2>'
        + '<p class="ad-sub">Temperaturas e estados em direto · valores em falta ficam escondidos</p>'
        + SVG;
      // Sit between the stock header and the entity/log columns. Lit may wipe us on a
      // full re-render; the interval below remounts if the node disappears.
      main.parentNode.insertBefore(el, main);
      // Keep color-scheme in sync with stock theme toggle
      try {
        var cs = document.documentElement.style.getPropertyValue('color-scheme') || '';
        if (cs) el.style.colorScheme = cs.trim();
      } catch (e) {}
    }
    paint(el);
    return true;
  }

  // Remount if Lit wipe removes us; also refresh color-scheme
  var tries = 0;
  var timer = setInterval(function () {
    mount();
    var el = document.querySelector('esp-app');
    el = el && el.shadowRoot && el.shadowRoot.getElementById('altherma-diagram');
    if (el) {
      var cs = document.documentElement.style.getPropertyValue('color-scheme') || '';
      if (cs) el.style.colorScheme = cs.trim();
    }
    if (++tries > 240) clearInterval(timer);
  }, 250);

  function onState(e) {
    try { applyState(JSON.parse(e.data)); } catch (x) {}
  }
  function listen(es) {
    if (!es || es.__althermaDiagram) return;
    es.__althermaDiagram = true;
    es.addEventListener('state', onState);
  }
  function start() {
    // Prefer the stock EventSource created by www.js; fall back to our own.
    if (window.source) listen(window.source);
    else {
      var es = new EventSource('/events');
      listen(es);
    }
    // Late bind if www.js creates source after us
    var n = 0, t = setInterval(function () {
      if (window.source) { listen(window.source); clearInterval(t); }
      else if (++n > 40) clearInterval(t);
    }, 250);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
