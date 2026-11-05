// Board web page (skydoy/esphome-altherma): report / install-firmware buttons, debug-log height
// cap (injected into esp-log shadowRoot), live heat-pump schematic, and PT/EN language toggle.
// Only one js_include is allowed on web_server v3, so everything lives here.

// Shared language: navigator.language (pt* → PT) with localStorage persistence; PT-PT uses "tu".
(function (g) {
  var KEY = 'altherma_lang';
  function detect() {
    try { var s = localStorage.getItem(KEY); if (s === 'pt' || s === 'en') return s; } catch (e) {}
    return /^pt/i.test(navigator.language || '') ? 'pt' : 'en';
  }
  var lang = detect(), listeners = [];
  function set(l) {
    lang = l === 'pt' ? 'pt' : 'en';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    for (var i = 0; i < listeners.length; i++) try { listeners[i](lang); } catch (e) {}
  }
  g.althermaLang = {
    get: function () { return lang; },
    set: set,
    toggle: function () { set(lang === 'pt' ? 'en' : 'pt'); },
    on: function (fn) { listeners.push(fn); fn(lang); },
    t: function (pt, en) { return lang === 'pt' ? pt : en; }
  };
})(window);

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
  var b = document.createElement('button');
  b.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 16px;border:0;border-radius:12px;background:#1f6feb;color:#fff;font:600 15px sans-serif;cursor:pointer;box-shadow:0 2px 8px #0004';
  var fw = document.createElement('button');
  fw.style.cssText = b.style.cssText.replace('bottom:16px', 'bottom:68px').replace('#1f6feb', '#1a7f37');
  fw.hidden = true;
  var langBtn = document.createElement('button');
  langBtn.type = 'button';
  langBtn.setAttribute('aria-label', 'Language');
  langBtn.style.cssText = 'position:fixed;right:16px;bottom:120px;z-index:9999;padding:6px 10px;border:1px solid #0003;border-radius:10px;background:#fff;color:#222;font:700 12px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 1px 4px #0003';
  langBtn.onclick = function () { window.althermaLang.toggle(); };

  function applyLang() {
    var L = window.althermaLang;
    b.textContent = L.t('📝 Reportar a minha bomba', '📝 Report my heat pump');
    b.title = L.t('Abre o formulário no GitHub com o Software ID e o Micon ID desta bomba',
                  'Opens the GitHub form with this heat pump\'s Software ID and Micon ID');
    if (!fw.disabled) fw.textContent = L.t('⬇️ Instalar o firmware certo', '⬇️ Install the right firmware');
    langBtn.textContent = L.get() === 'pt' ? 'PT · EN' : 'EN · PT';
    langBtn.title = L.t('Mudar língua (PT/EN)', 'Switch language (PT/EN)');
    // Match floating lang button to color-scheme
    try {
      var dark = (document.documentElement.style.getPropertyValue('color-scheme') || '').indexOf('dark') >= 0;
      langBtn.style.background = dark ? '#2b2b2b' : '#fff';
      langBtn.style.color = dark ? '#eee' : '#222';
    } catch (e) {}
  }
  fw.onclick = function () {
    var L = window.althermaLang;
    var msg = L.t('Instalar o firmware para ' + s.sug + '? A placa reinicia sozinha (1–2 min). Não a desligues.',
                  'Install the firmware for ' + s.sug + '? The board restarts by itself (1–2 min). Do not unplug it.');
    if (!confirm(msg)) return;
    fw.disabled = true; fw.textContent = L.t('⏳ A instalar…', '⏳ Installing…');
    fetch('/button/' + encodeURIComponent('Install the right firmware') + '/press', { method: 'POST' })
      .catch(function () { fw.disabled = false; applyLang(); });
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
    document.body.appendChild(langBtn);
    window.althermaLang.on(applyLang);
    var es = new EventSource('/events');
    es.addEventListener('state', onState);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();

// Live heat-pump schematic inside esp-app shadowRoot. Values from /events; missing chips hidden.
(function () {
  var MAP = [
    ['tout',   ['outdoorairtemp','r1toutdoorair'], '°C'],
    ['thx',    ['outdoorheatexch'], '°C'],
    ['tdis',   ['dischargepipe','dischargetemp','compressoroutlet'], '°C'],
    ['tsuc',   ['suctionpipe','suctiontemp'], '°C'],
    ['freq',   ['compressorfrequency','invfrequency'], 'Hz'],
    ['tlw',    ['leavingwatertempafterbuh','leavingwatertempbeforebuh','leavingwatertemp'], '°C'],
    ['tlwb',   ['leavingwatertempbeforebuh'], '°C'],
    ['tin',    ['inletwatertemp'], '°C'],
    ['tdhw',   ['dhwtanktemp'], '°C'],
    ['flow',   ['flowsensor'], 'L/min'],
    ['buh1',   ['backupheaterstep1'], ''],
    ['buh2',   ['backupheaterstep2'], ''],
    ['valve',  ['3wayvalve','threewayvalve'], ''],
    ['pump',   ['waterpumpoperation'], ''],
    ['space',  ['spaceheatingoperation'], ''],
    ['mode',   ['operationmode'], ''],
    ['liquid', ['refrigtempliquidside','liquidpipetemp'], '°C']
  ];
  var vals = {};

  // Chip label keys → PT / EN (short UI labels)
  var CHIP_L = {
    tout:  ['Ar ext.', 'Out. air'],
    freq:  ['Freq.', 'Freq.'],
    tdis:  ['Descarga', 'Disch.'],
    tsuc:  ['Sucção', 'Suction'],
    thx:   ['HX ext.', 'Out. HX'],
    liquid:['Líquido', 'Liquid'],
    tdhw:  ['AQS', 'DHW'],
    tlw:   ['Saída', 'Leaving'],
    tin:   ['Retorno', 'Return'],
    flow:  ['Caudal', 'Flow'],
    buh1:  ['BUH1', 'BUH1'],
    buh2:  ['BUH2', 'BUH2'],
    valve: ['3 vias', '3-way'],
    pump:  ['Bomba', 'Pump'],
    mode:  ['Modo', 'Mode'],
    space: ['Aquecimento', 'Heating']
  };

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
      var dec = (key === 'freq' || key === 'flow') ? 0 : 1;
      return d.value.toFixed(dec) + (u ? '\u00a0' + u : '');
    }
    if (/^(ON|OFF|True|False)$/i.test(st)) return /^(ON|True)$/i.test(st) ? 'ON' : 'OFF';
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

  // Two-line chip: label on top, value below — avoids Desc./value overlap.
  function chip(key, x, y, w, h, extraClass) {
    h = h || 32; w = w || 96;
    var cls = 'ad-chip' + (extraClass ? ' ' + extraClass : '');
    return '<g data-chip="' + key + '" transform="translate(' + x + ',' + y + ')">'
      + '<rect width="' + w + '" height="' + h + '" rx="7" class="' + cls + '"/>'
      + '<text x="' + (w / 2) + '" y="12" text-anchor="middle" class="ad-chip-l" data-i18n-chip="' + key + '">·</text>'
      + '<text x="' + (w / 2) + '" y="26" text-anchor="middle" class="ad-chip-v" data-v="' + key + '">—</text>'
      + '</g>';
  }

  function buildSvg() {
    // Layout (viewBox 780×340):
    //  Outdoor (left) --refrig pipes-- Indoor unit / plate HX (center-left)
    //  Indoor --warm supply--> 3-way valve --> DHW (top-right) / Heating (bottom-right)
    //  return cool pipes back to indoor
    return ''
      + '<svg viewBox="0 0 780 370" role="img" aria-label="Heat pump diagram">'
      + '<defs>'
      + '<linearGradient id="ad-tank" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="#f4a261"/><stop offset="100%" stop-color="#e76f51"/></linearGradient>'
      + '</defs>'

      // --- Pipes (under blocks) ---
      // Refrigerant pair outdoor <-> indoor (hot discharge top, cold suction bottom)
      + '<g class="ad-pipe ad-pipe-ref-hot" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M210 100 H270"/>'
      + '</g>'
      + '<g class="ad-pipe ad-pipe-ref-cold" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M210 150 H270"/>'
      + '</g>'
      // Water supply (warm) indoor -> valve -> DHW / heating
      + '<g class="ad-pipe ad-pipe-warm" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M390 120 H455"/>'                          // indoor -> valve
      + '<path d="M480 105 V55 H560"/>'                      // valve -> DHW
      + '<path d="M480 135 V175 H500"/>'                     // valve -> heating
      + '</g>'
      // Water return (cool) DHW/heating -> indoor
      + '<g class="ad-pipe ad-pipe-cool" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M560 95 H520 V145 H390"/>'                 // DHW return leg into shared return
      + '<path d="M500 210 H430 V145"/>'                     // heating return into shared return
      + '</g>'

      // Outdoor unit
      + '<g class="ad-block" transform="translate(20,40)">'
      + '<rect width="190" height="220" rx="14" class="ad-box"/>'
      + '<text x="95" y="22" text-anchor="middle" class="ad-title" data-i18n="outdoor">Unidade exterior</text>'
      + '<circle cx="65" cy="100" r="34" class="ad-fan"/><circle cx="65" cy="100" r="7" class="ad-fan-hub"/>'
      + '<path d="M65 72 L72 95 L65 100 L58 95 Z M65 128 L72 105 L65 100 L58 105 Z M38 100 L60 93 L65 100 L60 107 Z M92 100 L70 93 L65 100 L70 107 Z" class="ad-fan-blade"/>'
      + '<rect x="115" y="78" width="55" height="44" rx="8" class="ad-comp"/>'
      + '<text x="142" y="104" text-anchor="middle" class="ad-small">comp</text>'
      + chip('tdis', 12, 32, 80, 34, 'ad-hot')
      + chip('tsuc', 98, 32, 80, 34, 'ad-cold')
      + chip('tout', 12, 148, 80, 34, '')
      + chip('freq', 98, 148, 80, 34, '')
      + chip('thx', 12, 188, 166, 34, '')
      + '</g>'

      // Indoor unit (plate HX) — was "Permutador"
      + '<g class="ad-block" transform="translate(270,55)">'
      + '<rect width="120" height="160" rx="12" class="ad-box ad-hx"/>'
      + '<text x="60" y="20" text-anchor="middle" class="ad-title" data-i18n="indoor">Unidade interior</text>'
      + '<path d="M22 44 H98 M22 60 H98 M22 76 H98 M22 92 H98 M22 108 H98" class="ad-plates"/>'
      + chip('liquid', 10, 118, 100, 34, '')
      + '</g>'

      // 3-way valve node
      + '<g class="ad-block" transform="translate(455,95)">'
      + '<circle cx="25" cy="25" r="22" class="ad-valve-node"/>'
      + '<text x="25" y="22" text-anchor="middle" class="ad-small" data-i18n="valveShort">3 vias</text>'
      + '<text x="25" y="34" text-anchor="middle" class="ad-tiny" data-i18n="valveHint">AQS/AQ</text>'
      + '</g>'
      + chip('valve', 430, 148, 100, 34, '')

      // DHW tank
      + '<g class="ad-block" transform="translate(560,10)">'
      + '<rect width="190" height="120" rx="14" class="ad-box"/>'
      + '<text x="95" y="20" text-anchor="middle" class="ad-title" data-i18n="dhw">Depósito AQS</text>'
      + '<rect x="20" y="32" width="50" height="70" rx="18" fill="url(#ad-tank)" opacity=".9"/>'
      + '<rect x="20" y="32" width="50" height="70" rx="18" class="ad-tank-stroke"/>'
      + chip('tdhw', 80, 50, 100, 34, 'ad-hot')
      + '</g>'

      // Heating circuit
      + '<g class="ad-block" transform="translate(500,175)">'
      + '<rect width="250" height="145" rx="14" class="ad-box"/>'
      + '<text x="125" y="20" text-anchor="middle" class="ad-title" data-i18n="heat">Circuito de aquecimento</text>'
      + '<g transform="translate(190,40)" class="ad-emit">'
      + '<rect x="0" y="8" width="9" height="44" rx="2"/><rect x="14" y="8" width="9" height="44" rx="2"/><rect x="28" y="8" width="9" height="44" rx="2"/>'
      + '<rect x="-3" y="6" width="43" height="4" rx="1"/><rect x="-3" y="52" width="43" height="4" rx="1"/>'
      + '</g>'
      + chip('tlw', 12, 32, 110, 34, 'ad-hot')
      + chip('tin', 128, 32, 110, 34, 'ad-cold')
      + chip('flow', 12, 70, 90, 34, '')
      + chip('buh1', 108, 70, 64, 34, '')
      + chip('buh2', 178, 70, 64, 34, '')
      + chip('pump', 12, 108, 100, 34, '')
      + chip('space', 120, 108, 120, 34, '')
      + '</g>'

      // Status + pipe legend (below the blocks so chips do not collide)
      + '<g transform="translate(20,335)">'
      + chip('mode', 0, 0, 160, 32, '')
      + '</g>'
      + '<g transform="translate(200,342)" class="ad-legend">'
      + '<line x1="0" y1="6" x2="22" y2="6" class="ad-pipe ad-pipe-ref-hot"/>'
      + '<text x="28" y="10" class="ad-legend-t" data-i18n="legRefHot">Refrig. quente</text>'
      + '<line x1="130" y1="6" x2="152" y2="6" class="ad-pipe ad-pipe-ref-cold"/>'
      + '<text x="158" y="10" class="ad-legend-t" data-i18n="legRefCold">Refrig. frio</text>'
      + '<line x1="260" y1="6" x2="282" y2="6" class="ad-pipe ad-pipe-warm"/>'
      + '<text x="288" y="10" class="ad-legend-t" data-i18n="legWarm">Água saída</text>'
      + '<line x1="380" y1="6" x2="402" y2="6" class="ad-pipe ad-pipe-cool"/>'
      + '<text x="408" y="10" class="ad-legend-t" data-i18n="legCool">Água retorno</text>'
      + '</g>'

      + '</svg>';
  }

  var STYLE = ''
    + '#altherma-diagram{margin:8px 12px 4px;padding:10px 12px 8px;border-radius:12px;'
    + 'background:color-mix(in srgb,Canvas 92%,CanvasText 8%);'
    + 'border:1px solid color-mix(in srgb,CanvasText 12%,transparent);color:CanvasText;'
    + 'font-family:system-ui,-apple-system,sans-serif;position:relative}'
    + '#altherma-diagram .ad-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin:0 0 6px}'
    + '#altherma-diagram .ad-head h2{margin:0;font:600 15px/1.2 system-ui,sans-serif;opacity:.85}'
    + '#altherma-diagram .ad-sub{margin:2px 0 0;font:12px/1.3 system-ui,sans-serif;opacity:.55}'
    + '#altherma-diagram .ad-lang{flex:0 0 auto;padding:4px 8px;border-radius:8px;border:1px solid color-mix(in srgb,CanvasText 25%,transparent);'
    + 'background:color-mix(in srgb,Canvas 85%,CanvasText 15%);color:inherit;font:700 11px/1 system-ui,sans-serif;cursor:pointer}'
    + '#altherma-diagram svg{width:100%;height:auto;display:block;max-height:420px}'
    + '#altherma-diagram .ad-box{fill:color-mix(in srgb,Canvas 88%,CanvasText 12%);stroke:color-mix(in srgb,CanvasText 22%,transparent);stroke-width:1.5}'
    + '#altherma-diagram .ad-hx{fill:color-mix(in srgb,Canvas 80%,#4cc9f0 20%)}'
    + '#altherma-diagram .ad-title{font:600 11px system-ui,sans-serif;fill:currentColor;opacity:.85}'
    + '#altherma-diagram .ad-small{font:9px system-ui,sans-serif;fill:currentColor;opacity:.65}'
    + '#altherma-diagram .ad-tiny{font:8px system-ui,sans-serif;fill:currentColor;opacity:.55}'
    + '#altherma-diagram .ad-fan{fill:none;stroke:currentColor;stroke-width:2;opacity:.45}'
    + '#altherma-diagram .ad-fan-hub{fill:currentColor;opacity:.4}'
    + '#altherma-diagram .ad-fan-blade{fill:currentColor;opacity:.35}'
    + '#altherma-diagram .ad-comp{fill:color-mix(in srgb,Canvas 70%,CanvasText 30%);stroke:currentColor;stroke-width:1;opacity:.7}'
    + '#altherma-diagram .ad-plates{stroke:currentColor;stroke-width:2;opacity:.35}'
    + '#altherma-diagram .ad-tank-stroke{fill:none;stroke:currentColor;stroke-width:1.5;opacity:.5}'
    + '#altherma-diagram .ad-emit rect{fill:currentColor;opacity:.35}'
    + '#altherma-diagram .ad-valve-node{fill:color-mix(in srgb,Canvas 75%,#2a9d8f 25%);stroke:color-mix(in srgb,CanvasText 35%,transparent);stroke-width:2}'
    + '#altherma-diagram .ad-pipe{stroke-width:7}'
    + '#altherma-diagram .ad-pipe-ref-hot{stroke:#e85d04;opacity:.85}'
    + '#altherma-diagram .ad-pipe-ref-cold{stroke:#219ebc;opacity:.85}'
    + '#altherma-diagram .ad-pipe-warm{stroke:#f4a261;opacity:.9}'
    + '#altherma-diagram .ad-pipe-cool{stroke:#4cc9f0;opacity:.85}'
    + '#altherma-diagram .ad-legend-t{font:10px system-ui,sans-serif;fill:currentColor;opacity:.65}'
    + '#altherma-diagram .ad-chip{fill:color-mix(in srgb,Canvas 70%,CanvasText 30%);opacity:.97}'
    + '#altherma-diagram .ad-chip.ad-hot{fill:color-mix(in srgb,#e85d04 32%,Canvas 68%)}'
    + '#altherma-diagram .ad-chip.ad-cold{fill:color-mix(in srgb,#219ebc 32%,Canvas 68%)}'
    + '#altherma-diagram .ad-chip-l{font:600 9px system-ui,sans-serif;fill:currentColor;opacity:.72}'
    + '#altherma-diagram .ad-chip-v{font:700 11px ui-monospace,Menlo,monospace;fill:currentColor}'
    + '#altherma-diagram [data-chip]{display:none}'
    + '#altherma-diagram [data-chip].on{display:inline}'
    + '#altherma-diagram [data-chip].active .ad-chip{stroke:#2a9d8f;stroke-width:1.6}'
    + '@media (max-width:600px){#altherma-diagram{margin:6px 6px 2px;padding:8px}'
    + '#altherma-diagram .ad-head h2{font-size:14px}#altherma-diagram svg{max-height:340px}}';

  function paint(root) {
    if (!root) return;
    Object.keys(vals).forEach(function (key) {
      var nodes = root.querySelectorAll('[data-v="' + key + '"]');
      var chipEls = root.querySelectorAll('[data-chip="' + key + '"]');
      var v = vals[key];
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = v || '—';
      for (var j = 0; j < chipEls.length; j++) {
        if (v) chipEls[j].classList.add('on'); else chipEls[j].classList.remove('on');
        if (key === 'buh1' || key === 'buh2' || key === 'pump' || key === 'space') {
          if (isOn(v)) chipEls[j].classList.add('active'); else chipEls[j].classList.remove('active');
        }
        if (key === 'valve') {
          var dhw = valveIsDhw(v);
          if (dhw === true) chipEls[j].classList.add('active'); else chipEls[j].classList.remove('active');
        }
      }
    });
    if (vals.tlwb && !vals.tlw) {
      var n = root.querySelectorAll('[data-v="tlw"]');
      for (var i = 0; i < n.length; i++) n[i].textContent = vals.tlwb;
      var c = root.querySelectorAll('[data-chip="tlw"]');
      for (var j = 0; j < c.length; j++) c[j].classList.add('on');
    }
  }

  function applyI18n(root) {
    if (!root) return;
    var L = window.althermaLang;
    var titles = {
      outdoor: L.t('Unidade exterior', 'Outdoor unit'),
      indoor: L.t('Unidade interior', 'Indoor unit'),
      dhw: L.t('Depósito AQS', 'DHW tank'),
      heat: L.t('Circuito de aquecimento', 'Heating circuit'),
      valveShort: L.t('3 vias', '3-way'),
      valveHint: L.t('AQS/AQ', 'DHW/Sp'),
      legRefHot: L.t('Refrig. quente', 'Hot refrigerant'),
      legRefCold: L.t('Refrig. frio', 'Cold refrigerant'),
      legWarm: L.t('Água saída', 'Leaving water'),
      legCool: L.t('Água retorno', 'Return water')
    };
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (titles[k]) el.textContent = titles[k];
    });
    root.querySelectorAll('[data-i18n-chip]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-chip');
      var pair = CHIP_L[k];
      if (pair) el.textContent = L.get() === 'pt' ? pair[0] : pair[1];
    });
    var h2 = root.querySelector('h2');
    var sub = root.querySelector('.ad-sub');
    if (h2) h2.textContent = L.t('Esquema da bomba de calor', 'Heat pump diagram');
    if (sub) sub.textContent = L.t(
      'Temperaturas e estados em direto · valores em falta ficam escondidos',
      'Live temperatures and states · missing values stay hidden'
    );
    var svg = root.querySelector('svg');
    if (svg) svg.setAttribute('aria-label', L.t('Esquema da bomba de calor', 'Heat pump diagram'));
    var lb = root.querySelector('.ad-lang');
    if (lb) {
      lb.textContent = L.get() === 'pt' ? 'PT · EN' : 'EN · PT';
      lb.title = L.t('Mudar língua (PT/EN)', 'Switch language (PT/EN)');
    }
  }

  function applyState(d) {
    var key = matchKey(d);
    if (!key) return;
    if (key === 'tlw' || key === 'tlwb') {
      var k = norm((d.id || '') + ' ' + (d.name || ''));
      if (k.indexOf('afterbuh') >= 0) key = 'tlw';
      else if (k.indexOf('beforebuh') >= 0) key = 'tlwb';
      else if (vals.tlw && key === 'tlw') return;
    }
    vals[key] = fmt(key, d);
    var app = document.querySelector('esp-app');
    var el = app && app.shadowRoot && app.shadowRoot.getElementById('altherma-diagram');
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
      el.innerHTML = '<div class="ad-head"><div><h2></h2><p class="ad-sub"></p></div>'
        + '<button type="button" class="ad-lang">PT · EN</button></div>'
        + buildSvg();
      main.parentNode.insertBefore(el, main);
      el.querySelector('.ad-lang').onclick = function () { window.althermaLang.toggle(); };
      try {
        var cs = document.documentElement.style.getPropertyValue('color-scheme') || '';
        if (cs) el.style.colorScheme = cs.trim();
      } catch (e) {}
      applyI18n(el);
    }
    paint(el);
    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    mount();
    var app = document.querySelector('esp-app');
    var el = app && app.shadowRoot && app.shadowRoot.getElementById('altherma-diagram');
    if (el) {
      var cs = document.documentElement.style.getPropertyValue('color-scheme') || '';
      if (cs) el.style.colorScheme = cs.trim();
    }
    if (++tries > 240) clearInterval(timer);
  }, 250);

  window.althermaLang.on(function () {
    var app = document.querySelector('esp-app');
    var el = app && app.shadowRoot && app.shadowRoot.getElementById('altherma-diagram');
    if (el) applyI18n(el);
  });

  function onState(e) { try { applyState(JSON.parse(e.data)); } catch (x) {} }
  function listen(es) {
    if (!es || es.__althermaDiagram) return;
    es.__althermaDiagram = true;
    es.addEventListener('state', onState);
  }
  function start() {
    if (window.source) listen(window.source);
    else listen(new EventSource('/events'));
    var n = 0, t = setInterval(function () {
      if (window.source) { listen(window.source); clearInterval(t); }
      else if (++n > 40) clearInterval(t);
    }, 250);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
