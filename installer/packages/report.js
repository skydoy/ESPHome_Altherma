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

// Tab favicon: ESPHome Altherma logo (same as static/favicon.svg), inline data: URI for offline.
(function () {
  var HREF = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgNjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwRkUzRkEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxNzg0RjciLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgcng9IjEyOCIgZmlsbD0idXJsKCNnKSIvPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBzdHJva2Utd2lkdGg9IjI4IiBkPSJNMTEyIDMwMEwzMDAgMTI4TDQ4OCAzMDBNMTU2IDI2MlY0OTJINDQ0VjI2MiIvPjxwYXRoIHN0cm9rZS13aWR0aD0iMTAiIGQ9Ik0zNTYgMjM2SDM4Nk0zNTYgMjY4SDM3NE0zNTYgMzAwSDM4Nk0zNTYgMzMySDM3NE0zNTYgMzY0SDM4NiIvPjwvZz48ZyBmaWxsPSIjZmZmIj48cmVjdCB4PSIyNjIiIHk9IjE5NiIgd2lkdGg9Ijc2IiBoZWlnaHQ9IjIzMCIgcng9IjM4Ii8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iNDMwIiByPSI1NiIvPjwvZz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI0MzAiIHI9IjM2IiBmaWxsPSIjMTc4NEY3Ii8+PHJlY3QgeD0iMjg4IiB5PSIyODMuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjE0Ni45IiByeD0iMTIiIGZpbGw9IiMxNzg0RjciLz48L3N2Zz4=';
  function apply() {
    var head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;
    var links = head.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]');
    if (!links.length) {
      var l = document.createElement('link');
      l.rel = 'icon';
      l.type = 'image/svg+xml';
      l.href = HREF;
      head.appendChild(l);
    } else {
      for (var i = 0; i < links.length; i++) {
        links[i].type = 'image/svg+xml';
        links[i].href = HREF;
      }
    }
  }
  if (document.head) apply();
  else document.addEventListener('DOMContentLoaded', apply);
})();

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
    ['liquid', ['refrigtempliquidside','liquidpipetemp'], '°C'],
    ['cop',    ['cop'], '']
  ];
  var vals = {};
  var updateStatus = "";
  var defrostOn = false;
  var errorCode = "";
  var errorDesc = "";
  var CHART_KEY = "altherma_chart_v1";
  var chartPts = [];
  try { chartPts = JSON.parse(localStorage.getItem(CHART_KEY) || "[]") || []; } catch (e) { chartPts = []; }

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
    pump:  ['Bomba', 'Pump'],
    mode:  ['Modo', 'Mode'],
    space: ['Aquecimento', 'Heating'],
    cop:   ['COP', 'COP']
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
  // ESPAltherma binary: ON = DHW, OFF = Space.
  function valveIsDhw(v) {
    if (v == null) return null;
    var s = String(v).toUpperCase();
    if (s.indexOf('DHW') >= 0 || s.indexOf('AQS') >= 0 || s === 'ON' || s === 'TRUE' || s === '1') return true;
    if (s.indexOf('SPACE') >= 0 || s.indexOf('AQUEC') >= 0 || s.indexOf('HEATING') >= 0 || s === 'OFF' || s === 'FALSE' || s === '0') return false;
    return null;
  }
  function valveLabel(v) {
    var dhw = valveIsDhw(v);
    var L = window.althermaLang;
    if (dhw === true) return L.t('AQS', 'DHW');
    if (dhw === false) return L.t('Aquecimento', 'Heating');
    return v || '—';
  }
  // Sensors also arrive as strings / "NA" (nan via JSON) on web_server v3.
  function numberOrNaN(v) {
    if (v == null || v === 'NA' || v === 'nan' || v === '') return NaN;
    var n = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(n) ? n : NaN;
  }

  function fmt(key, d, prev) {
    var st = d.state == null ? '' : String(d.state);
    if (key === 'valve') {
      // Store canonical DHW/SPACE so paint/i18n can localise the chip value.
      var raw = st;
      if (!raw && d.value != null) raw = d.value ? 'ON' : 'OFF';
      var dhw = valveIsDhw(raw);
      if (dhw === true) return 'DHW';
      if (dhw === false) return 'SPACE';
      return raw;
    }
    // Prefer d.value (number or numeric string); keep last known on NA/nan.
    var n = numberOrNaN(d.value);
    if (!isFinite(n) && st) {
      if (/^(NA|nan)$/i.test(st.trim())) return prev != null ? prev : '';
      n = numberOrNaN(st); // parseFloat("14.1 °C") → 14.1
    }
    if (isFinite(n)) {
      var u = '';
      for (var i = 0; i < MAP.length; i++) if (MAP[i][0] === key) { u = MAP[i][2]; break; }
      var dec = (key === 'freq' || key === 'flow') ? 0 : (key === 'cop' ? 2 : 1);
      return n.toFixed(dec) + (u ? '\u00a0' + u : '');
    }
    if (/^(NA|nan)$/i.test(st.trim())) return prev != null ? prev : '';
    if (/^(ON|OFF|True|False)$/i.test(st)) return /^(ON|True)$/i.test(st) ? 'ON' : 'OFF';
    return st.replace(/\s+/g, '\u00a0');
  }

  function isOn(v) {
    if (v == null) return false;
    var s = String(v).toUpperCase();
    return s === 'ON' || s === 'TRUE' || s === '1' || /^ON\b/.test(s);
  }
  function freqHz() {
    var v = vals.freq;
    if (v == null || v === '') return NaN;
    return parseFloat(String(v).replace(/[^\d.+-eE]/g, ''));
  }
  function compressorRunning() {
    var hz = freqHz();
    return isFinite(hz) && hz > 0;
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

  function outdoorFanSvg() {
    // Axial fan centered in grille bay (right of coil fins, left of compressor).
    // Invisible bbox circle keeps CSS transform-origin on the hub (blades are asymmetric).
    var blade = 'M-3.5,-7 C-10,-28 10,-28 3.5,-7 C2,-3 1.2,1 0,5 C-1.2,1 -2,-3 -3.5,-7 Z';
    return ''
      + '<g class="ad-fan-assy" transform="translate(76,125)">'
      + '<circle r="38" class="ad-fan-shroud-outer"/>'
      + '<circle r="34" class="ad-fan-shroud"/>'
      + '<circle r="34" class="ad-fan-shroud-rim" fill="none"/>'
      + '<circle r="26" class="ad-fan-guard" fill="none"/>'
      + '<circle r="18" class="ad-fan-guard" fill="none"/>'
      + '<circle r="11" class="ad-fan-guard" fill="none"/>'
      + '<g class="ad-fan-spokes" fill="none">'
      + '<line x1="0" y1="-34" x2="0" y2="34"/><line x1="-34" y1="0" x2="34" y2="0"/>'
      + '<line x1="-24" y1="-24" x2="24" y2="24"/><line x1="24" y1="-24" x2="-24" y2="24"/>'
      + '</g>'
      + '<g class="ad-fan-rotor">'
      + '<circle r="30" class="ad-fan-bbox" fill="#000" fill-opacity="0"/>'
      + '<path d="' + blade + '" class="ad-fan-blade" transform="rotate(0)"/>'
      + '<path d="' + blade + '" class="ad-fan-blade" transform="rotate(120)"/>'
      + '<path d="' + blade + '" class="ad-fan-blade" transform="rotate(240)"/>'
      + '<circle r="6" class="ad-fan-hub"/>'
      + '<circle r="2" class="ad-fan-hub-cap"/>'
      + '</g>'
      + '</g>';
  }

  function outdoorCompSvg() {
    // Scroll / hermetic compressor: rounded vertical cylinder + pipe stubs.
    return ''
      + '<g class="ad-comp-assy" data-comp transform="translate(152,125)">'
      + '<ellipse cx="0" cy="22" rx="15" ry="5.5" class="ad-comp-base"/>'
      + '<rect x="-15" y="-20" width="30" height="42" rx="4" class="ad-comp-body"/>'
      + '<ellipse cx="0" cy="-20" rx="15" ry="5.5" class="ad-comp-top"/>'
      + '<ellipse cx="0" cy="-12" rx="10" ry="3.5" class="ad-comp-lid"/>'
      // Pipe stubs (discharge top-right, suction mid-left)
      + '<path d="M15,-6 H28 M28,-6 V2" class="ad-comp-pipe" fill="none"/>'
      + '<circle cx="28" cy="2" r="2.4" class="ad-comp-pipe-end"/>'
      + '<path d="M-15,6 H-28" class="ad-comp-pipe" fill="none"/>'
      + '<circle cx="-28" cy="6" r="2.4" class="ad-comp-pipe-end"/>'
      + '<text y="36" text-anchor="middle" class="ad-tiny ad-comp-label">comp</text>'
      + '</g>';
  }


  function translateUpdateStatus(st, lang) {
    st = st == null ? '' : String(st);
    if (!st) return '';
    var pt = lang === 'pt';
    var m;
    if ((m = /^New version (.+) available, install from Device Builder$/i.exec(st)))
      return pt
        ? ('Versão nova ' + m[1] + ' disponível, instala no Device Builder')
        : st;
    if ((m = /^Update available: (.+)$/i.exec(st)))
      return pt
        ? ('Atualização disponível: ' + m[1])
        : st;
    if ((m = /^Up to date \((.+)\)$/i.exec(st)))
      return pt ? ('Atualizado (' + m[1] + ')') : st;
    if (/^Up to date$/i.test(st)) return pt ? 'Atualizado' : 'Up to date';
    if (/^Checking for updates$/i.test(st)) return pt ? 'A procurar atualizações' : st;
    if (/^Downloading firmware \(do not unplug\)$/i.test(st))
      return pt ? 'A descarregar firmware (não desligues)' : st;
    if (/^Installed, rebooting$/i.test(st)) return pt ? 'Instalado, a reiniciar' : st;
    if (/^Install requested$/i.test(st)) return pt ? 'Instalação pedida' : st;
    if (/^Update check failed$/i.test(st)) return pt ? 'Falha ao verificar atualização' : st;
    if ((m = /^Update failed \((.+)\)$/i.exec(st)))
      return pt ? ('Atualização falhou (' + m[1] + ')') : st;
    return st;
  }

  function updateBannerKind(st) {
    st = st == null ? '' : String(st);
    if (/New version |Update available:/i.test(st)) return 'warn';
    if (/^Up to date/i.test(st)) return 'ok';
    if (/failed|Failed/i.test(st)) return 'warn';
    if (/Checking|Downloading|Install|Installed/i.test(st)) return 'info';
    return '';
  }

  function paintUpdateBanner(root) {
    if (!root) return;
    var ban = root.querySelector('.ad-update-banner');
    if (!ban) return;
    var L = window.althermaLang;
    var lang = L && L.get ? L.get() : 'en';
    var st = updateStatus;
    // Optional: show only when there is something actionable / in progress (not "up to date").
    var show = !!st && !/^Up to date/i.test(st);
    ban.classList.toggle('on', show);
    ban.classList.remove('ad-upd-ok', 'ad-upd-info');
    var kind = updateBannerKind(st);
    if (kind === 'ok') ban.classList.add('ad-upd-ok');
    if (kind === 'info') ban.classList.add('ad-upd-info');
    ban.textContent = show ? translateUpdateStatus(st, lang) : '';
    ban.hidden = !show;
  }


  function translateErrorDesc(st, lang) {
    st = st == null ? '' : String(st);
    if (!st) return '';
    var pt = lang === 'pt';
    if (/^No error$/i.test(st)) return pt ? 'Sem erro' : 'No error';
    var m = /^([A-Z0-9]{1,3}):\s*(.+)$/i.exec(st.trim());
    if (!m) return st;
    var code = m[1].toUpperCase(), en = m[2];
    var map = {
      'PCB failure': 'Falha da PCB',
      'High discharge temperature / freeze protection': 'Temp. descarga alta / proteção anti-gelo',
      'Expansion valve fault': 'Falha da válvula de expansão',
      'Heat exchanger sensor fault': 'Falha do sensor do permutador',
      'Outdoor air sensor fault': 'Falha do sensor de ar exterior',
      'High pressure': 'Alta pressão',
      'Low pressure': 'Baixa pressão',
      'Inverter compressor lock': 'Bloqueio do compressor do inversor',
      'Compressor start fault': 'Falha ao arrancar o compressor',
      'Outdoor fan motor fault': 'Falha do motor do ventilador exterior',
      'Overcurrent input': 'Sobrecorrente à entrada',
      'Electronic expansion valve fault': 'Falha da válvula de expansão eletrónica',
      '4-way valve fault': 'Falha da válvula de 4 vias',
      'Discharge pipe temperature too high': 'Temp. do tubo de descarga demasiado alta',
      'High pressure switch / heat exchanger': 'Pressóstato alta / permutador',
      'Compressor sensor system fault': 'Falha do sistema de sensores do compressor',
      'High pressure switch fault': 'Falha do pressóstato de alta',
      'Outdoor air thermistor fault': 'Falha do termístor de ar exterior',
      'Pressure sensor fault': 'Falha do sensor de pressão',
      'Discharge pipe thermistor fault': 'Falha do termístor de descarga',
      'Suction pipe thermistor fault': 'Falha do termístor de sucção',
      'Heat exchanger thermistor fault': 'Falha do termístor do permutador',
      'Liquid pipe thermistor fault': 'Falha do termístor do líquido',
      'Inverter PCB fault': 'Falha da PCB do inversor',
      'Electrical box temperature rise': 'Temp. da caixa elétrica elevada',
      'Inverter radiator temperature rise': 'Temp. do radiador do inversor elevada',
      'Inverter instantaneous overcurrent': 'Sobrecorrente instantânea do inversor',
      'Inverter overcurrent': 'Sobrecorrente do inversor',
      'Inverter stall prevention': 'Prevenção de bloqueio do inversor',
      'Transmission outdoor-inverter fault': 'Falha de comunicação exterior-inversor',
      'Open-phase / voltage imbalance': 'Fase em aberto / desequilíbrio de tensão',
      'Radiator thermistor fault': 'Falha do termístor do radiador',
      'Gas shortage / reverse piping': 'Falta de gás / tubagem invertida',
      'Supply voltage fault': 'Falha da tensão de alimentação',
      'Transmission indoor-outdoor fault': 'Falha de comunicação interior-exterior',
      'Transmission indoor PCB fault': 'Falha de comunicação da PCB interior',
      'Transmission outdoor-outdoor fault': 'Falha de comunicação exterior-exterior',
      'Indoor unit / outdoor unit combination fault': 'Combinação unidade interior/exterior inválida',
      'Piping / wiring mismatch': 'Tubagem / cablagem incorreta',
      'Improper stop / system fault': 'Paragem incorreta / falha de sistema',
      'Unknown error code': 'Código de erro desconhecido'
    };
    var tr = map[en] || (en.indexOf('Unknown error code') === 0 ? (pt ? 'Código de erro desconhecido' : en) : en);
    return code + ': ' + (pt ? tr : en);
  }

  function paintErrorBanner(root) {
    if (!root) return;
    var ban = root.querySelector('.ad-error-banner');
    if (!ban) return;
    var L = window.althermaLang;
    var lang = L && L.get ? L.get() : 'en';
    var st = errorDesc || errorCode;
    var show = !!(st && !/^No error$/i.test(st) && !/^(0|00|\s*0)$/.test(String(errorCode || '').trim()));
    // Prefer description; if only raw code, show code
    var text = errorDesc ? translateErrorDesc(errorDesc, lang) : String(errorCode || '').trim();
    if (show && text && !/^No error$/i.test(errorDesc || '')) {
      ban.classList.add('on');
      ban.hidden = false;
      ban.textContent = text;
    } else {
      ban.classList.remove('on');
      ban.hidden = true;
      ban.textContent = '';
    }
  }

  function pushChartSample() {
    var now = Date.now();
    var tlw = parseFloat(vals.tlw); if (!isFinite(tlw)) tlw = parseFloat(vals.tlwb);
    var tdhw = parseFloat(vals.tdhw);
    var tout = parseFloat(vals.tout);
    if (!isFinite(tlw) && !isFinite(tdhw) && !isFinite(tout)) return;
    var last = chartPts.length ? chartPts[chartPts.length - 1] : null;
    if (last && (now - last.t) < 55000) return; // ~1 min
    chartPts.push({
      t: now,
      tlw: isFinite(tlw) ? tlw : null,
      tdhw: isFinite(tdhw) ? tdhw : null,
      tout: isFinite(tout) ? tout : null
    });
    var cut = now - 24 * 3600 * 1000;
    chartPts = chartPts.filter(function (p) { return p.t >= cut; });
    try { localStorage.setItem(CHART_KEY, JSON.stringify(chartPts)); } catch (e) {}
  }

  function paintChart(root) {
    if (!root) return;
    var svg = root.querySelector('.ad-chart-svg');
    if (!svg) return;
    var W = 760, H = 72, pad = 4;
    function series(key, color) {
      var pts = chartPts.filter(function (p) { return p[key] != null && isFinite(p[key]); });
      if (pts.length < 2) return '';
      var t0 = chartPts[0].t, t1 = chartPts[chartPts.length - 1].t;
      if (t1 <= t0) t1 = t0 + 1;
      var vals = pts.map(function (p) { return p[key]; });
      var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
      if (mx - mn < 1) { mx += 0.5; mn -= 0.5; }
      var d = pts.map(function (p, i) {
        var x = pad + (W - 2 * pad) * (p.t - t0) / (t1 - t0);
        var y = H - pad - (H - 2 * pad) * (p[key] - mn) / (mx - mn);
        return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }).join(' ');
      return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = series('tout', '#60a5fa') + series('tlw', '#f97316') + series('tdhw', '#e11d48');
  }

  function buildSvg() {
    // Layout (viewBox 800×410):
    //  Outdoor --refrig-- Indoor --warm--> 3-way --> DHW / Heating
    //  DHW + Heating returns merge at a tee --> cool trunk --> Indoor
    return ''
      + '<svg viewBox="0 0 800 410" role="img" aria-label="Heat pump diagram">'
      + '<defs>'
      + '<linearGradient id="ad-tank" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="#f4a261"/><stop offset="100%" stop-color="#e76f51"/></linearGradient>'
      + '<linearGradient id="ad-odu" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="#cfd4da"/><stop offset="100%" stop-color="#aeb6bf"/></linearGradient>'
      + '<linearGradient id="ad-odu-dark" x1="0" y1="0" x2="1" y2="0">'
      + '<stop offset="0%" stop-color="#8b939c"/><stop offset="100%" stop-color="#b0b7bf"/></linearGradient>'
      + '</defs>'

      // --- Pipes (under blocks) ---
      + '<g class="ad-pipe ad-pipe-ref-hot" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M216 118 H250"/>'
      + '</g>'
      + '<g class="ad-pipe ad-pipe-ref-cold" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M216 158 H250"/>'
      + '</g>'

      // Water: 3-way only on hot supply; cold returns merge at a tee (no valve)
      + '<g class="ad-pipe ad-pipe-warm ad-pipe-trunk" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M500 128 H532"/>'
      + '</g>'
      + '<g class="ad-pipe ad-pipe-cool ad-pipe-trunk" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M500 198 H590"/>'
      + '</g>'

      + '<g class="ad-pipe ad-pipe-warm ad-pipe-branch" data-branch="dhw" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M550 110 V50 H600"/>'
      + '</g>'
      // Heat supply doglegs right around the valve state chip
      + '<g class="ad-pipe ad-pipe-warm ad-pipe-branch" data-branch="heat" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M550 146 H608 V255 H600"/>'
      + '</g>'

      + '<g class="ad-pipe ad-pipe-cool ad-pipe-branch" data-branch="dhw" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M600 105 H590 V198"/>'
      + '</g>'
      + '<g class="ad-pipe ad-pipe-cool ad-pipe-branch" data-branch="heat" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M600 310 H590 V198"/>'
      + '</g>'

      // Return tee (merge only — no valve on return)
      + '<g class="ad-tee" transform="translate(590,198)">'
      + '<circle r="5" class="ad-tee-node"/>'
      + '</g>'

      // Outdoor unit — casing + finned grille + axial fan + compressor
      + '<g class="ad-block" data-block="outdoor" transform="translate(16,28)">'
      + '<rect width="200" height="260" rx="12" class="ad-box ad-odu"/>'
      // Left finned condenser grille strip (looks like a real ODU side)
      + '<rect x="6" y="72" width="20" height="116" rx="3" class="ad-odu-fins-bg"/>'
      + '<g class="ad-odu-fins" stroke-linecap="round">'
      + '<line x1="9" y1="76" x2="9" y2="184"/><line x1="13" y1="76" x2="13" y2="184"/>'
      + '<line x1="17" y1="76" x2="17" y2="184"/><line x1="21" y1="76" x2="21" y2="184"/>'
      + '</g>'
      // Top vent slits
      + '<g class="ad-odu-vents">'
      + '<rect x="40" y="8" width="28" height="4" rx="1"/><rect x="74" y="8" width="28" height="4" rx="1"/>'
      + '<rect x="108" y="8" width="28" height="4" rx="1"/><rect x="142" y="8" width="28" height="4" rx="1"/>'
      + '</g>'
      + '<text x="100" y="30" text-anchor="middle" class="ad-title" data-i18n="outdoor">Unidade exterior</text>'
      // Chip grid 2×3 (balanced; HX same width as siblings, not full-bleed)
      + chip('tdis', 12, 38, 86, 32, 'ad-hot')
      + chip('tsuc', 102, 38, 86, 32, 'ad-cold')
      + outdoorFanSvg()
      + outdoorCompSvg()
      + chip('tout', 12, 178, 86, 32, '')
      + chip('freq', 102, 178, 86, 32, '')
      + chip('thx', 12, 216, 86, 32, '')
      + '</g>'

      // Indoor unit
      + '<g class="ad-block" data-block="indoor" transform="translate(250,20)">'
      + '<rect width="250" height="300" rx="14" class="ad-box ad-hx"/>'
      + '<text x="125" y="22" text-anchor="middle" class="ad-title" data-i18n="indoor">Unidade interior</text>'
      + '<path d="M18 40 H100 M18 52 H100 M18 64 H100 M18 76 H100" class="ad-plates"/>'
      + chip('tlw', 12, 90, 110, 34, 'ad-hot')
      + chip('tin', 128, 90, 110, 34, 'ad-cold')
      + chip('flow', 12, 132, 90, 34, '')
      + chip('buh1', 108, 132, 64, 34, '')
      + chip('buh2', 178, 132, 64, 34, '')
      + chip('pump', 12, 174, 110, 34, '')
      + chip('space', 128, 174, 110, 34, '')
      + chip('liquid', 12, 216, 110, 34, '')
      + '</g>'

      // v4-style circle 3-way on hot supply — full opacity; label only in chip below (no text in/on circle)
      + '<g class="ad-valve" data-valve transform="translate(550,128)">'
      + '<circle r="15" class="ad-valve-node"/>'
      // Port stubs: inlet (left), DHW (up), Heating (down→dogleg)
      + '<path d="M-15,0 H-21 M0,-15 V-21 M0,15 V21" class="ad-valve-ports" fill="none"/>'
      + '<path d="M-7,0 H7 M0,-7 V7" class="ad-valve-t" fill="none"/>'
      // Chip below only: title + AQS/Aquecimento (no duplicate '3 vias' on the symbol)
      + '<g class="ad-valve-chip" transform="translate(-46,28)">'
      + '<rect width="92" height="34" rx="7" class="ad-valve-chip-bg"/>'
      + '<text x="46" y="13" text-anchor="middle" class="ad-valve-chip-l" data-i18n="valveShort">3 vias</text>'
      + '<text x="46" y="27" text-anchor="middle" class="ad-valve-chip-v" data-v="valve">—</text>'
      + '</g>'
      + '</g>'

      // DHW tank
      + '<g class="ad-block" data-block="dhw" transform="translate(600,10)">'
      + '<rect width="180" height="120" rx="14" class="ad-box"/>'
      + '<text x="90" y="20" text-anchor="middle" class="ad-title" data-i18n="dhw">Depósito AQS</text>'
      + '<rect x="16" y="34" width="48" height="68" rx="16" fill="url(#ad-tank)" opacity=".9"/>'
      + '<rect x="16" y="34" width="48" height="68" rx="16" class="ad-tank-stroke"/>'
      + chip('tdhw', 72, 52, 96, 34, 'ad-hot')
      + '</g>'

      // Heating circuit — emitters only
      + '<g class="ad-block" data-block="heat" transform="translate(600,230)">'
      + '<rect width="180" height="110" rx="14" class="ad-box"/>'
      + '<text x="90" y="20" text-anchor="middle" class="ad-title" data-i18n="heat">Circuito de aquecimento</text>'
      + '<g transform="translate(42,42)" class="ad-emit">'
      + '<rect x="0" y="8" width="11" height="48" rx="2"/><rect x="16" y="8" width="11" height="48" rx="2"/>'
      + '<rect x="32" y="8" width="11" height="48" rx="2"/><rect x="48" y="8" width="11" height="48" rx="2"/>'
      + '<rect x="64" y="8" width="11" height="48" rx="2"/>'
      + '<rect x="-4" y="6" width="83" height="4" rx="1"/><rect x="-4" y="56" width="83" height="4" rx="1"/>'
      + '</g>'
      + '<text x="90" y="100" text-anchor="middle" class="ad-tiny ad-emit-label" data-i18n="emitters">Emissores</text>'
      + '</g>'

      + '<g transform="translate(16,370)">'
      + chip('mode', 0, 0, 160, 32, '')
      + chip('cop', 170, 0, 100, 32, '')
      + '</g>'
      + '<g transform="translate(190,378)" class="ad-legend">'
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
    + '#altherma-diagram .ad-update-banner{display:none;margin:0 0 8px;padding:8px 10px;border-radius:10px;'
    + 'font:13px/1.35 system-ui,sans-serif;border:1px solid color-mix(in srgb,#f59e0b 55%,transparent);'
    + 'background:color-mix(in srgb,#f59e0b 16%,Canvas);color:inherit}'
    + '#altherma-diagram .ad-update-banner.on{display:block}'
    + '#altherma-diagram .ad-update-banner.ad-upd-ok{border-color:color-mix(in srgb,#10b981 45%,transparent);'
    + 'background:color-mix(in srgb,#10b981 14%,Canvas)}'
    + '#altherma-diagram .ad-update-banner.ad-upd-info{border-color:color-mix(in srgb,#3b82f6 45%,transparent);'
    + 'background:color-mix(in srgb,#3b82f6 14%,Canvas)}'
    + '#altherma-diagram .ad-error-banner{display:none;margin:0 0 8px;padding:8px 10px;border-radius:10px;'
    + 'font:13px/1.35 system-ui,sans-serif;border:1px solid color-mix(in srgb,#ef4444 55%,transparent);'
    + 'background:color-mix(in srgb,#ef4444 16%,Canvas);color:inherit}'
    + '#altherma-diagram .ad-error-banner.on{display:block}'
    + '#altherma-diagram .ad-chart{margin:4px 0 2px;padding:6px 8px;border-radius:10px;'
    + 'background:color-mix(in srgb,CanvasText 4%,Canvas);border:1px solid color-mix(in srgb,CanvasText 12%,transparent)}'
    + '#altherma-diagram .ad-chart svg{width:100%;height:72px;display:block}'
    + '#altherma-diagram .ad-chart-leg{display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:4px;'
    + 'font:10px/1.2 system-ui,sans-serif;opacity:.7}'
    + '#altherma-diagram .ad-chart-leg i{display:inline-block;width:10px;height:3px;border-radius:1px;margin-right:4px;vertical-align:middle}'
    + '#altherma-diagram .ad-odu.ad-defrost{animation:ad-defrost-pulse 1.6s ease-in-out infinite}'
    + '#altherma-diagram .ad-odu.ad-defrost .ad-odu-fins{stroke:#7dd3fc;opacity:.95}'
    + '@keyframes ad-defrost-pulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18) saturate(1.2)}}'
    + '@media (prefers-reduced-motion:reduce){#altherma-diagram .ad-odu.ad-defrost{animation:none}}'
    + '#altherma-diagram .ad-lang{flex:0 0 auto;padding:4px 8px;border-radius:8px;border:1px solid color-mix(in srgb,CanvasText 25%,transparent);'
    + 'background:color-mix(in srgb,Canvas 85%,CanvasText 15%);color:inherit;font:700 11px/1 system-ui,sans-serif;cursor:pointer}'
    + '#altherma-diagram svg{width:100%;height:auto;display:block;max-height:460px}'
    + '#altherma-diagram .ad-box{fill:color-mix(in srgb,Canvas 88%,CanvasText 12%);stroke:color-mix(in srgb,CanvasText 22%,transparent);stroke-width:1.5}'
    + '#altherma-diagram .ad-odu{fill:url(#ad-odu);stroke:#6b7280;stroke-width:1.8}'
    + '#altherma-diagram .ad-hx{fill:color-mix(in srgb,Canvas 80%,#4cc9f0 20%)}'
    + '#altherma-diagram .ad-title{font:600 11px system-ui,sans-serif;fill:currentColor;opacity:.85}'
    + '#altherma-diagram .ad-small{font:9px system-ui,sans-serif;fill:currentColor;opacity:.65}'
    + '#altherma-diagram .ad-tiny{font:8px system-ui,sans-serif;fill:currentColor;opacity:.55}'
    + '#altherma-diagram .ad-odu-fins-bg{fill:color-mix(in srgb,#4b5563 55%,#9ca3af 45%);opacity:.9}'
    + '#altherma-diagram .ad-odu-fins{stroke:#d1d5db;stroke-width:1.2;opacity:.75}'
    + '#altherma-diagram .ad-odu-vents rect{fill:color-mix(in srgb,CanvasText 35%,transparent)}'
    // Fan
    + '#altherma-diagram .ad-fan-shroud-outer{fill:color-mix(in srgb,#6b7280 70%,Canvas 30%);opacity:.95}'
    + '#altherma-diagram .ad-fan-shroud{fill:color-mix(in srgb,#111827 55%,#4b5563 45%)}'
    + '#altherma-diagram .ad-fan-shroud-rim{stroke:#e5e7eb;stroke-width:2;opacity:.55}'
    + '#altherma-diagram .ad-fan-guard{stroke:#9ca3af;stroke-width:1.1;opacity:.55}'
    + '#altherma-diagram .ad-fan-spokes{stroke:#9ca3af;stroke-width:1;opacity:.4}'
    + '#altherma-diagram .ad-fan-blade{fill:#d1d5db;stroke:#6b7280;stroke-width:.6;opacity:.95}'
    + '#altherma-diagram .ad-fan-hub{fill:#9ca3af;stroke:#4b5563;stroke-width:1}'
    + '#altherma-diagram .ad-fan-hub-cap{fill:#e5e7eb}'
    + '#altherma-diagram .ad-fan-bbox{pointer-events:none}'+ '#altherma-diagram .ad-fan-rotor{transform-box:fill-box;transform-origin:50% 50%}'
    + '#altherma-diagram .ad-fan-rotor.ad-spinning{animation:ad-fan-spin 1.15s linear infinite}'
    + '@keyframes ad-fan-spin{to{transform:rotate(360deg)}}'
    + '@media (prefers-reduced-motion:reduce){#altherma-diagram .ad-fan-rotor.ad-spinning{animation:none}}'
    // Compressor
    + '#altherma-diagram .ad-comp-body{fill:#9ca3af;stroke:#4b5563;stroke-width:1.2}'
    + '#altherma-diagram .ad-comp-top,#altherma-diagram .ad-comp-base{fill:#b0b7bf;stroke:#4b5563;stroke-width:1}'
    + '#altherma-diagram .ad-comp-lid{fill:#d1d5db;stroke:#6b7280;stroke-width:.8}'
    + '#altherma-diagram .ad-comp-pipe{stroke:#6b7280;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}'
    + '#altherma-diagram .ad-comp-pipe-end{fill:#6b7280}'
    + '#altherma-diagram .ad-comp-assy.ad-running .ad-comp-body{fill:#f4a261;stroke:#c2410c}'
    + '#altherma-diagram .ad-comp-assy.ad-running .ad-comp-top,'
    + '#altherma-diagram .ad-comp-assy.ad-running .ad-comp-base{fill:#fdba74;stroke:#c2410c}'
    + '#altherma-diagram .ad-comp-assy.ad-running .ad-comp-lid{fill:#fed7aa}'
    + '#altherma-diagram .ad-plates{stroke:currentColor;stroke-width:2;opacity:.35}'
    + '#altherma-diagram .ad-tank-stroke{fill:none;stroke:currentColor;stroke-width:1.5;opacity:.5}'
    + '#altherma-diagram .ad-emit rect{fill:currentColor;opacity:.35}'
    + '#altherma-diagram .ad-emit-on .ad-emit rect{fill:#e76f51;opacity:.85}'
    + '#altherma-diagram .ad-valve{opacity:1!important;isolation:isolate}'
    + '#altherma-diagram .ad-valve-node{fill:color-mix(in srgb,Canvas 70%,#2a9d8f 30%);stroke:CanvasText;stroke-width:2.6;opacity:1}'
    + '#altherma-diagram .ad-valve-ports{stroke:CanvasText;stroke-width:3.2;stroke-linecap:round;opacity:1}'
    + '#altherma-diagram .ad-valve-t{stroke:CanvasText;stroke-width:2.6;stroke-linecap:round;opacity:1}'
    + '#altherma-diagram .ad-valve-chip-bg{fill:color-mix(in srgb,Canvas 82%,#2a9d8f 18%);stroke:CanvasText;stroke-width:1.8;opacity:1}'
    + '#altherma-diagram .ad-valve-chip-l{font:700 9px system-ui,sans-serif;fill:CanvasText;opacity:.75}'
    + '#altherma-diagram .ad-valve-chip-v{font:800 12px system-ui,sans-serif;fill:CanvasText;opacity:1}'
    + '#altherma-diagram .ad-valve.ad-dhw .ad-valve-node{fill:color-mix(in srgb,#f4a261 45%,Canvas 55%);stroke:#c2410c}'
    + '#altherma-diagram .ad-valve.ad-space .ad-valve-node{fill:color-mix(in srgb,#2a9d8f 40%,Canvas 60%);stroke:#0f766e}'
    + '#altherma-diagram .ad-valve.ad-dhw .ad-valve-chip-bg{fill:color-mix(in srgb,#f4a261 42%,Canvas 58%);stroke:#c2410c}'
    + '#altherma-diagram .ad-valve.ad-space .ad-valve-chip-bg{fill:color-mix(in srgb,#2a9d8f 38%,Canvas 62%);stroke:#0f766e}'
    + '#altherma-diagram .ad-tee-node{fill:color-mix(in srgb,Canvas 70%,#4cc9f0 30%);stroke:color-mix(in srgb,CanvasText 45%,transparent);stroke-width:1.8}'
    + '#altherma-diagram .ad-pipe{stroke-width:7}'
    + '#altherma-diagram .ad-pipe-ref-hot{stroke:#e85d04;opacity:.85}'
    + '#altherma-diagram .ad-pipe-ref-cold{stroke:#219ebc;opacity:.85}'
    + '#altherma-diagram .ad-pipe-warm{stroke:#f4a261;opacity:.9}'
    + '#altherma-diagram .ad-pipe-cool{stroke:#4cc9f0;opacity:.85}'
    + '#altherma-diagram .ad-pipe-trunk{opacity:.9}'
    + '#altherma-diagram .ad-pipe-trunk.ad-muted{opacity:.22;stroke:#9aa0a6}'
    + '#altherma-diagram .ad-pipe-branch.ad-active{opacity:1}'
    + '#altherma-diagram .ad-pipe-branch.ad-muted{opacity:.16;stroke:#9aa0a6}'
    + '#altherma-diagram [data-block="dhw"].ad-route-on .ad-box,'
    + '#altherma-diagram [data-block="heat"].ad-route-on .ad-box{stroke:#2a9d8f;stroke-width:2.2}'
    + '#altherma-diagram [data-block="dhw"].ad-route-off,'
    + '#altherma-diagram [data-block="heat"].ad-route-off{opacity:.45}'
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
    + '#altherma-diagram .ad-head h2{font-size:14px}#altherma-diagram svg{max-height:380px}}';

  function updatePipes(root) {
    if (!root) return;
    var pumpOn = isOn(vals.pump);
    var dhw = valveIsDhw(vals.valve);
    var branches = root.querySelectorAll('[data-branch]');
    for (var i = 0; i < branches.length; i++) {
      var el = branches[i];
      var b = el.getAttribute('data-branch');
      el.classList.remove('ad-active', 'ad-muted');
      if (!pumpOn || dhw === null) {
        el.classList.add('ad-muted');
      } else if ((b === 'dhw' && dhw) || (b === 'heat' && !dhw)) {
        el.classList.add('ad-active');
      } else {
        el.classList.add('ad-muted');
      }
    }
    var trunks = root.querySelectorAll('.ad-pipe-trunk');
    for (var t = 0; t < trunks.length; t++) {
      if (pumpOn) trunks[t].classList.remove('ad-muted');
      else trunks[t].classList.add('ad-muted');
    }
    var dhwBlock = root.querySelector('[data-block="dhw"]');
    var heatBlock = root.querySelector('[data-block="heat"]');
    function setRoute(block, on) {
      if (!block) return;
      block.classList.remove('ad-route-on', 'ad-route-off');
      if (!pumpOn || dhw === null) return;
      block.classList.add(on ? 'ad-route-on' : 'ad-route-off');
    }
    setRoute(dhwBlock, dhw === true);
    setRoute(heatBlock, dhw === false);
    var valveEl = root.querySelector('[data-valve]');
    if (valveEl) {
      valveEl.classList.remove('ad-dhw', 'ad-space');
      if (pumpOn && dhw === true) valveEl.classList.add('ad-dhw');
      else if (pumpOn && dhw === false) valveEl.classList.add('ad-space');
    }
    if (heatBlock) {
      if (isOn(vals.space)) heatBlock.classList.add('ad-emit-on');
      else heatBlock.classList.remove('ad-emit-on');
    }
  }

  function updateOutdoorMotion(root) {
    if (!root) return;
    var run = compressorRunning();
    var rotor = root.querySelector('.ad-fan-rotor');
    if (rotor) {
      if (run) rotor.classList.add('ad-spinning');
      else rotor.classList.remove('ad-spinning');
    }
    var comp = root.querySelector('[data-comp]');
    if (comp) {
      if (run) comp.classList.add('ad-running');
      else comp.classList.remove('ad-running');
    }
  }

  function paint(root) {
    if (!root) return;
    Object.keys(vals).forEach(function (key) {
      var nodes = root.querySelectorAll('[data-v="' + key + '"]');
      var chipEls = root.querySelectorAll('[data-chip="' + key + '"]');
      var v = vals[key];
      var show = (key === 'valve') ? valveLabel(v) : (v || '—');
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = show;
      for (var j = 0; j < chipEls.length; j++) {
        if (v) chipEls[j].classList.add('on'); else chipEls[j].classList.remove('on');
        if (key === 'buh1' || key === 'buh2' || key === 'pump' || key === 'space') {
          if (isOn(v)) chipEls[j].classList.add('active'); else chipEls[j].classList.remove('active');
        }
      }
    });
    if (vals.tlwb && !vals.tlw) {
      var n = root.querySelectorAll('[data-v="tlw"]');
      for (var i = 0; i < n.length; i++) n[i].textContent = vals.tlwb;
      var c = root.querySelectorAll('[data-chip="tlw"]');
      for (var j = 0; j < c.length; j++) c[j].classList.add('on');
    }
    updatePipes(root);
    updateOutdoorMotion(root);
    var odu = root.querySelector('.ad-odu');
    if (odu) odu.classList.toggle('ad-defrost', !!defrostOn);
    pushChartSample();
    paintChart(root);
    paintErrorBanner(root);
  }

  function applyI18n(root) {
    if (!root) return;
    var L = window.althermaLang;
    var titles = {
      outdoor: L.t('Unidade exterior', 'Outdoor unit'),
      indoor: L.t('Unidade interior', 'Indoor unit'),
      dhw: L.t('Depósito AQS', 'DHW tank'),
      heat: L.t('Circuito de aquecimento', 'Heating circuit'),
      emitters: L.t('Emissores', 'Emitters'),
      valveShort: L.t('3 vias', '3-way'),
      legRefHot: L.t('Refrig. quente', 'Hot refrigerant'),
      legRefCold: L.t('Refrig. frio', 'Cold refrigerant'),
      legWarm: L.t('Água saída', 'Leaving water'),
      legCool: L.t('Água retorno', 'Return water'),
      legLwt: L.t('Água saída', 'Leaving water'),
      legDhw: L.t('Depósito AQS', 'DHW tank'),
      legOut: L.t('Ar exterior', 'Outdoor air'),
      legChart: L.t('últimas 24 h (neste browser)', 'last 24 h (this browser)')
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
    // Refresh valve chip value for the active language
    root.querySelectorAll('[data-v="valve"]').forEach(function (el) {
      el.textContent = valveLabel(vals.valve);
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
    paintUpdateBanner(root);
    paintErrorBanner(root);
    paintChart(root);
  }

  function applyState(d) {
    var nm = norm((d.name || '') + ' ' + (d.id || ''));
    if (nm.indexOf('updatestatus') >= 0 || nm.indexOf('update_status') >= 0) {
      var st = d.state == null ? '' : String(d.state);
      if (st !== updateStatus) {
        updateStatus = st;
        var app0 = document.querySelector('esp-app');
        var el0 = app0 && app0.shadowRoot && app0.shadowRoot.getElementById('altherma-diagram');
        if (el0) paintUpdateBanner(el0);
      }
    }
    if (nm.indexOf('defrostoperation') >= 0 || nm === 'althermadefrost') {
      defrostOn = isOn(d.state) || d.value === true;
      var appD = document.querySelector('esp-app');
      var elD = appD && appD.shadowRoot && appD.shadowRoot.getElementById('altherma-diagram');
      if (elD) {
        var odu = elD.querySelector('.ad-odu');
        if (odu) odu.classList.toggle('ad-defrost', !!defrostOn);
      }
    }
    if (nm.indexOf('errordescription') >= 0) {
      errorDesc = d.state == null ? '' : String(d.state);
      var appE = document.querySelector('esp-app');
      var elE = appE && appE.shadowRoot && appE.shadowRoot.getElementById('altherma-diagram');
      if (elE) paintErrorBanner(elE);
    }
    if (nm.indexOf('outdoorerrorcode') >= 0 || nm.indexOf('indoorerrorcode') >= 0) {
      var ec = d.state == null ? '' : String(d.state).trim();
      if (ec && ec !== '0' && ec !== '00') errorCode = ec;
      else if (nm.indexOf('outdoorerrorcode') >= 0) errorCode = ec;
      var appC = document.querySelector('esp-app');
      var elC = appC && appC.shadowRoot && appC.shadowRoot.getElementById('altherma-diagram');
      if (elC) paintErrorBanner(elC);
    }
    var key = matchKey(d);
    if (!key) return;
    if (key === 'tlw' || key === 'tlwb') {
      var k = norm((d.id || '') + ' ' + (d.name || ''));
      if (k.indexOf('afterbuh') >= 0) key = 'tlw';
      else if (k.indexOf('beforebuh') >= 0) key = 'tlwb';
      else if (vals.tlw && key === 'tlw') return;
    }
    vals[key] = fmt(key, d, vals[key]);
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
        + '<div class="ad-update-banner" hidden></div>'
        + '<div class="ad-error-banner" hidden></div>'
        + '<div class="ad-chart"><svg class="ad-chart-svg" viewBox="0 0 760 72" preserveAspectRatio="none"></svg>'
        + '<div class="ad-chart-leg">'
        + '<span><i style="background:#f97316"></i><span data-i18n="legLwt">Água saída</span></span>'
        + '<span><i style="background:#e11d48"></i><span data-i18n="legDhw">Depósito AQS</span></span>'
        + '<span><i style="background:#60a5fa"></i><span data-i18n="legOut">Ar exterior</span></span>'
        + '<span data-i18n="legChart">24 h</span></div></div>'
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
    // Own EventSource so we get the full /events state dump (window.source may
    // already have finished pushing the initial states before we listen).
    listen(new EventSource('/events'));
    if (window.source) listen(window.source);
    var n = 0, t = setInterval(function () {
      if (window.source) { listen(window.source); clearInterval(t); }
      else if (++n > 40) clearInterval(t);
    }, 250);
  }
  window.althermaTranslateUpdateStatus = function (st, lang) {
    return translateUpdateStatus(st, lang || (window.althermaLang && window.althermaLang.get()) || 'en');
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();

// Entity-list i18n for web_server v3: translate display text only (never option/button values
// sent to the device). Walks shadowRoots and re-applies on MutationObserver + language toggle.
(function () {
  var ATTR = 'data-altherma-en';
  var DICT = {
'Heating':'Aquecimento',
'Cooling':'Arrefecimento',
'Auto':'Automático',
'DHW':'AQS',
'HEAT':'AQUECER',
'COOL':'ARREFECER',
'HEAT_COOL':'AUTO',
'FAN_ONLY':'SÓ VENTILAÇÃO',
'DRY':'DESUMIDIFICAR',
'OFF':'OFF',
'(Raw data)Water heat exchanger inlet temp.':'(Dados brutos) Temp. entrada permutador água',
'(Raw data)Water heat exchanger outlet temp.':'(Dados brutos) Temp. saída permutador água',
'2 phase thermistor (R4T)':'Termístor 2 fases (R4T)',
'2nd Domestic hot water temperature':'2.ª temp. água quente sanitária',
'2way valve (On:Heat Off:Cool)':'Válvula 2 vias (On:Calor Off:Frio)',
'2way valve On Heat Off Cool':'Válvula 2 vias On Calor Off Frio',
'2way valve(On:Heat_Off:Cool)':'Válvula 2 vias (On:Calor Off:Frio)',
'3 way Valve Mixing 1':'Válvula 3 vias mistura 1',
'3 way Valve Mixing 2':'Válvula 3 vias mistura 2',
'3-Way Valve (DHW/Space)':'Válvula de 3 vias (AQS/Espaço)',
'3-Way Valve (DHW–Space)':'Válvula de 3 vias (AQS/Espaço)',
'3-Way Valve (DHW⁄Space)':'Válvula de 3 vias (AQS/Espaço)',
'3way valve (On:DHW Off:Space)':'Válvula 3 vias (On:AQS Off:Espaço)',
'3way valve On DHW Off Space':'Válvula 3 vias On AQS Off Espaço',
'3way valve(On:DHW_Off:Space)':'Válvula 3 vias (On:AQS Off:Espaço)',
'4 Way Valve':'Válvula de 4 vias',
'4 Way Valve 1':'Válvula de 4 vias 1',
'4 Way Valve 2':'Válvula de 4 vias 2',
'4 Way Valve 3':'Válvula de 4 vias 3',
'4 Way Valve 4':'Válvula de 4 vias 4',
'4 Way Valve 5':'Válvula de 4 vias 5',
'4 Way Valve 6':'Válvula de 4 vias 6',
'4 Way Valve 7':'Válvula de 4 vias 7',
'4 Way Valve 8':'Válvula de 4 vias 8',
'4 Way Valve Data Qty':'Qtd. dados válvula 4 vias',
'4 way valve':'Válvula de 4 vias',
'4 way valve (Y1S)':'Válvula de 4 vias (Y1S)',
'4-Way Valve':'Válvula de 4 vias',
'52C Output':'52C Saída',
'Add pump':'Bomba adicional',
'Add pump (2)':'Bomba adicional (2)',
'Add. Ext. RT Input Cool.':'Entrada RT ext. adic. frio',
'Add. Ext. RT Input Heat.':'Entrada RT ext. adic. calor',
'Alarm output':'Saída de alarme',
'Alterma LT setting':'Definição Altherma LT',
'Altherma Update Running':'Atualização Altherma a decorrer',
'Auto Update':'Atualização automática',
'Away:':'Ausência:',
'BSH allowance Multi':'Autorização BSH Multi',
'BUH Step 1':'BUH passo 1',
'BUH Step 1 power':'BUH passo 1 power',
'BUH Step 2':'BUH passo 2',
'BUH Step 2 power':'BUH passo 2 power',
'BUH Step1':'BUH passo 1',
'BUH Step2':'BUH passo 2',
'BUH output capacity':'Capacidade saída BUH',
'BUH step 1':'BUH passo 1',
'BUH step 2':'BUH passo 2',
'Backup Heater Step 1':'Aquecedor de apoio passo 1',
'Backup Heater Step 2':'Aquecedor de apoio passo 2',
'Benefit kWh rate power supply':'Alimentação tarifa benefício kWh',
'Bivalent Operation':'Operação bivalente',
'Bivalent operation':'Operação bivalente',
'Boiler DHW Demand':'Procura AQS caldeira',
'Boiler Heating Target Temp.':'Temp. alvo aquecimento caldeira',
'Boiler Operation Demand':'Procura operação caldeira',
'Boot Count':'Contagem de arranques',
'Bottom Plate Heater':'Aquecedor placa inferior',
'Brine Flow Switch':'Interruptor caudal salmoura',
'Brine inlet temp.':'Temp. entrada salmoura',
'Brine outlet temp.':'Temp. saída salmoura',
'Brine pump feedback':'Salmoura pump feedback',
'Bypass Valve Output':'Saída válvula bypass',
'CLOSE':'FECHAR',
'CT sensor L1':'Sensor CT L1',
'CT sensor L2':'Sensor CT L2',
'CT sensor L3':'Sensor CT L3',
'Check for Update':'Procurar atualização',
'Update Status':'Estado da atualização',
'COP':'COP',
'Estimated Electrical Power':'Potência elétrica estimada',
'Heating Electrical Power':'Potência elétrica aquecimento',
'DHW Electrical Power':'Potência elétrica AQS',
'Thermal Power':'Potência térmica',
'Heating Energy Total':'Energia aquecimento total',
'DHW Energy Total':'Energia AQS total',
'Heating Energy Today':'Energia aquecimento hoje',
'DHW Energy Today':'Energia AQS hoje',
'Heating Energy This Month':'Energia aquecimento este mês',
'DHW Energy This Month':'Energia AQS este mês',
'Compressor Starts Today':'Arranques do compressor hoje',
'Compressor Starts This Hour':'Arranques do compressor nesta hora',
'Last Compressor Cycle':'Último ciclo do compressor',
'Compressor Runtime Today':'Tempo de compressor hoje',
'Defrosts Today':'Descongelações hoje',
'Error Description':'Descrição do erro',
'No error':'Sem erro',
'Latest Version':'Última versão',
'Update Available':'Atualização disponível',
'Up to date':'Atualizado',
'Checking for updates':'A procurar atualizações',
'Downloading firmware (do not unplug)':'A descarregar firmware (não desligues)',
'Installed, rebooting':'Instalado, a reiniciar',
'Install requested':'Instalação pedida',
'Update check failed':'Falha ao verificar atualização',
'Circulation pump operation':'Funcionamento bomba circulação',
'Comp. INV Current Drop':'Queda corrente INV compressor',
'Compressor Frequency':'Frequência do compressor',
'Compressor outlet temp.':'Temp. saída compressor',
'Compressor outlet temperature':'Temp. saída compressor',
'Compressor port temperature':'Temp. porta compressor',
'Configuration':'Configuração',
'Connected Indoor Unit Qty':'Qtd. unidades interiores ligadas',
'Controller Micon ID':'Micon ID do controlador',
'Controller Software ID':'Software ID do controlador',
'Crank Case Heater Qty':'Qtd. aquecedores do cárter',
'Crank case heater':'Aquecedor do cárter',
'Crank case heater (2)':'Aquecedor do cárter (2)',
'Crank case heater 1':'Aquecedor do cárter 1',
'Crank case heater 2':'Aquecedor do cárter 2',
'Crank case heater 3':'Aquecedor do cárter 3',
'Crank case heater 4':'Aquecedor do cárter 4',
'Crank case heater 5':'Aquecedor do cárter 5',
'Current measured by CT sensor of L1':'Corrente medida pelo CT de L1',
'Current measured by CT sensor of L2':'Corrente medida pelo CT de L2',
'Current measured by CT sensor of L3':'Corrente medida pelo CT de L3',
'Current:':'Atual:',
'DHW Setpoint':'Setpoint AQS',
'DHW Tank Temp (R5T)':'Temp. depósito AQS (R5T)',
'DHW in standby due to defrost in ODU':'AQS em espera por descongelação U.E.',
'DHW priority request':'Pedido prioridade AQS',
'DHW setpoint':'Setpoint AQS',
'DHW supply temperature':'Temp. fornecimento AQS',
'DHW tank temp. (R5T)':'Temp. depósito AQS (R5T)',
'DHW:SV1':'AQS:SV1',
'DHW:SV1 (2)':'AQS:SV1 (2)',
'Data Enable Disable 60':'Dados ativar desativar 60',
'Data Enable Disable 61':'Dados ativar desativar 61',
'Data Enable Disable 62':'Dados ativar desativar 62',
'Data Enable Disable 63':'Dados ativar desativar 63',
'Data Enable Disable 64':'Dados ativar desativar 64',
'Data Enable-Disable':'Dados ativar-desativar',
'Data Enable-Disable (2)':'Dados ativar-desativar (2)',
'Data Enable-Disable (3)':'Dados ativar-desativar (3)',
'Data Enable-Disable (4)':'Dados ativar-desativar (4)',
'Data Enable-Disable (5)':'Dados ativar-desativar (5)',
'Data Enable-Disable (6)':'Dados ativar-desativar (6)',
'Debug Log':'Registo de depuração',
'Defrost':'Descongelação',
'Defrost Operation':'Descongelação',
'Defrost operation':'Descongelação',
'Defrost prohibition ON-OFF':'Proibição descongelação ON-OFF',
'Demand Signal':'Sinal de procura',
'Diagnostic':'Diagnóstico',
'Discharge Pipe Temp (R2T)':'Temp. tubagem descarga (R2T)',
'Discharge Temp. Drop':'Queda temp. descarga',
'Discharge Temp. Drop (2)':'Queda temp. descarga (2)',
'Discharge pipe temp.':'Temp. tubagem descarga',
'Discharge pipe temp. (R2T)':'Temp. tubagem descarga (R2T)',
'Discharge pipe temp.(R2T)':'Temp. tubagem descarga(R2T)',
'Display Backlight':'Retroiluminação do ecrã',
'Drain pan heater':'Aquecedor tabuleiro condensados',
'Drain pan heater (2)':'Aquecedor tabuleiro condensados (2)',
'During emergency operation':'Durante operação de emergência',
'ESPHome Version':'Versão ESPHome',
'Emergency (indoor) active-not active':'Emergência (interior) ativa-inativa',
'Emergency active':'Emergência ativa',
'Emergency indoor active':'Emergência interior ativa',
'Emoncms heat pump sender':'Envio bomba de calor Emoncms',
'Emoncms node':'Nó Emoncms',
'Entering brine temp.(R5T)':'Temp. entrada salmoura(R5T)',
'Error Code':'Código de erro',
'Error Code (2)':'Código de erro (2)',
'Error Code indoor':'Código de erro indoor',
'Error Code outdoor':'Código de erro outdoor',
'Error code':'Código de erro',
'Error detailed code':'Código de erro detalhado',
'Error type':'Tipo de erro',
'Error type (2)':'Tipo de erro (2)',
'Error type outdoor':'Tipo de erro outdoor',
'Expansion Valve 1':'Válvula de expansão 1',
'Expansion Valve Data Qty':'Qtd. dados válvula expansão',
'Expansion valve 1':'Válvula de expansão 1',
'Expansion valve 1 (pls)':'Válvula de expansão 1 (pls)',
'Expansion valve 2':'Válvula de expansão 2',
'Expansion valve 3':'Válvula de expansão 3',
'Expansion valve 4':'Válvula de expansão 4',
'Ext. Thermostat ON-OFF':'Termóstato ext. ON-OFF',
'Ext. indoor ambient sensor (R6T)':'Sensor ambiente interior ext. (R6T)',
'Ext. outdoor ambient sensor (R6T)':'Sensor ambiente exterior ext. (R6T)',
'Fan 1':'Ventilador 1',
'Fan 1 (10 rpm)':'Ventilador 1 (10 rpm)',
'Fan 1 (step)':'Ventilador 1 (passo)',
'Fan 1 fin temp.':'Temp. aleta ventilador 1',
'Fan 2':'Ventilador 2',
'Fan 2 (step)':'Ventilador 2 (passo)',
'Fan 2 fin temp.':'Temp. aleta ventilador 2',
'Fan Data Qty':'Qtd. dados ventilador',
'Fan1 Fin temp.':'Temp. aleta ventilador 1',
'Fan1 fin temp.':'Temp. aleta ventilador 1',
'Fan2 Fin temp.':'Temp. aleta ventilador 2',
'Fin Temp.':'Temp. aleta',
'Fin Temp. Drop Control':'Controlo queda temp. aleta',
'Firmware Update':'Atualização de firmware',
'Floor loop shut off valve':'Válvula fecho circuito piso',
'Flow':'Caudal',
'Flow Sensor':'Sensor de caudal',
'Flow sensor':'Sensor de caudal',
'Flow sensor (L per min)':'Sensor de caudal (L/min)',
'Flow sensor (l⁄min)':'Sensor de caudal (l/min)',
'Freeze Protection':'Proteção anticongelamento',
'Freeze Protection for water piping':'Proteção anticongelamento tubagem água',
'Freeze protection':'Proteção anticongelamento',
'Freeze protection for water piping':'Proteção anticongelamento tubagem água',
'GSHP setting':'Definição GSHP',
'HP Drop Control':'Controlo queda HP',
'HP is operation forced OFF by installer':'HP forçada OFF pelo instalador',
'HPS operation':'Operação HPS',
'Heat Exchanger Mid Temp (R5T)':'Temp. média permutador (R5T)',
'Heat exchanger mid-temp.':'Temp. média permutador',
'Heat exchanger mid-temp. (R5T)':'Temp. média permutador (R5T)',
'Heat exchanger mid-temp.(R5T)':'Temp. média permutador(R5T)',
'Heat sink temp.':'Temp. dissipador',
'Heat sink temp.(R10T)':'Temp. dissipador(R10T)',
'High Pressure':'Pressão alta',
'High Pressure(T)':'Pressão alta (T)',
'High pressure':'Pressão alta',
'High pressure saturation temp.':'Pressão alta saturation temp.',
'Hot gas bypass valve (Y2S)':'Válvula bypass gás quente (Y2S)',
'Hot gas bypass valve (Y3S)':'Válvula bypass gás quente (Y3S)',
'Hybrid DHW operation mode':'Modo operação AQS híbrida',
'Hybrid Heating Target Temp.':'Temp. alvo aquecimento híbrido',
'Hybrid Op. Mode':'Modo operação híbrida',
'Hydro split setting':'Definição hydro split',
'I/U EEPROM Ver.':'Versão EEPROM U.I.',
'I/U capacity code':'Código capacidade U.I.',
'I/U operation mode':'Modo operação U.I.',
'INV Primary Current':'Corrente primária INV',
'INV compressor Qty':'Qtd. compressores INV',
'INV fin temp.':'Temp. aleta INV',
'INV frequency':'Frequência INV',
'INV frequency (rps)':'Frequência INV (rps)',
'INV frequency 2 (rps)':'Frequência INV 2 (rps)',
'INV primary current':'Corrente primária INV',
'INV primary current (A)':'Corrente primária INV (A)',
'INV secondary current':'Corrente secundária INV',
'INV secondary current (A)':'Corrente secundária INV (A)',
'IP Address':'Endereço IP',
'Indoor Ambient Temp (R1T)':'Temp. ambiente interior (R1T)',
'Indoor EEPROM (11th digit)':'EEPROM interior (11th digit)',
'Indoor EEPROM (12th digit)(rev.)':'EEPROM interior (12th digit)(rev.)',
'Indoor EEPROM (3rd digit)':'EEPROM interior (3rd digit)',
'Indoor EEPROM (4th 5th digit)':'EEPROM interior (4th 5th digit)',
'Indoor EEPROM (6th 7th digit)':'EEPROM interior (6th 7th digit)',
'Indoor EEPROM (8th 9th digit)':'EEPROM interior (8th 9th digit)',
'Indoor EEPROM Ver.':'Versão EEPROM interior',
'Indoor Error Code':'Código de erro interior',
'Indoor Error Detail Code':'Código detalhe erro interior',
'Indoor Error Type':'Tipo de erro interior',
'Indoor Option Code':'Código opção interior',
'Indoor Software ID (xx)':'Software ID interior (xx)',
'Indoor Software ID (yy)':'Software ID interior (yy)',
'Indoor Unit Address':'Endereço unidade interior',
'Indoor Unit Address (2)':'Endereço unidade interior (2)',
'Indoor Unit Address (3)':'Endereço unidade interior (3)',
'Indoor Unit Address (4)':'Endereço unidade interior (4)',
'Indoor Unit Address (5)':'Endereço unidade interior (5)',
'Indoor Unit Address (6)':'Endereço unidade interior (6)',
'Indoor Unit Code':'Interior Unit Código',
'Indoor Unit Operation Mode':'Modo operação unidade interior',
'Indoor ambient temp. (R1T)':'Temp. ambiente interior (R1T)',
'Indoor operation mode':'Modo operação interior',
'Indoor unit blowout 50 ° C flag':'Interior unit blowout 50 ° C flag',
'Injection tube temperature':'Temp. tubo de injeção',
'Inlet Water Temp (R4T)':'Temp. água entrada (R4T)',
'Inlet water temp. (DMW)':'Temp. água entrada (DMW)',
'Inlet water temp. (R4T)':'Temp. água entrada (R4T)',
'Inlet water temp.(R4T)':'Temp. água entrada(R4T)',
'Install Update':'Instalar atualização',
'Install the right firmware':'Instalar o firmware certo',
'Internal Temperature':'Temperatura interna',
'Interval in seconds':'Intervalo em segundos',
'Inverter Fin Temp':'Temp. aleta inversor',
'I⁄U operation mode':'Modo operação U.I.',
'LP Drop Control':'Controlo queda LP',
'LP bypass valve (Y2S)':'Válvula bypass BP (Y2S)',
'LP bypass valve (Y3S)':'Válvula bypass BP (Y3S)',
'LW setpoint (add)':'Setpoint água saída (adic.)',
'LW setpoint (main)':'Setpoint água saída (principal)',
'LW setpoint add':'Setpoint água saída adic.',
'LW setpoint main':'Setpoint água saída principal',
'Leaving Water Setpoint Main':'Setpoint água saída principal',
'Leaving Water Temp after BUH (R2T)':'Temp. água saída depois do BUH (R2T)',
'Leaving Water Temp before BUH (R1T)':'Temp. água saída antes do BUH (R1T)',
'Leaving brine temp.(R6T)':'Temp. saída salmoura(R6T)',
'Leaving water temp. after BUH (R2T)':'Temp. água saída depois do BUH (R2T)',
'Leaving water temp. before BUH (R1T)':'Temp. água saída antes do BUH (R1T)',
'Level':'Nível',
'Liquid INJ solenoid valve (Y4S)':'Válvula solenóide injeção líquido (Y4S)',
'Liquid pipe temp.':'Temp. tubagem líquido',
'Liquid pipe temp. (R6T)':'Temp. tubagem líquido (R6T)',
'Liquid pipe temp.(R6T)':'Temp. tubagem líquido(R6T)',
'Liquid temp. (R3T)':'Temp. líquido (R3T)',
'Liquid temperature(R3T)':'Temp. líquido(R3T)',
'Low Pressure':'Pressão baixa',
'Low Pressure(T)':'Pressão baixa (T)',
'Low noise control':'Controlo baixo ruído',
'Low pressure':'Pressão baixa',
'Low pressure saturation temp.':'Pressão baixa saturation temp.',
'M5 Button A':'Botão M5 A',
'M5 Button B':'Botão M5 B',
'M5 Button C':'Botão M5 C',
'M5 Dark Mode':'Modo escuro M5',
'MAC Address':'Endereço MAC',
'MT setting':'Definição MT',
'Main RT Cooling':'RT principal arrefecimento',
'Main RT Heating':'RT principal aquecimento',
'Main pump':'Bomba principal',
'Main pump (2)':'Bomba principal (2)',
'Manual Query Registry Result':'Resultado consulta manual registo',
'Max. connectable indoor units':'Máx. unidades interiores ligáveis',
'Message':'Mensagem',
'Minichiller setting':'Definição mini-chiller',
'Mixed water temp.':'Temp. água misturada',
'Mixed water temp. (R7T)':'Temp. água misturada (R7T)',
'Mixed water temp.(R7T)':'Temp. água misturada(R7T)',
'Mode conflict':'Conflito de modo',
'Mode conflict (DHW in standby)':'Conflito de modo (DHW in standby)',
'Mode:':'Modo:',
'Model Check':'Verificação do modelo',
'Monobloc setting':'Definição monobloco',
'Not in use':'Não usado',
'Not in use (10)':'Não usado (10)',
'Not in use (11)':'Não usado (11)',
'Not in use (12)':'Não usado (12)',
'Not in use (13)':'Não usado (13)',
'Not in use (14)':'Não usado (14)',
'Not in use (15)':'Não usado (15)',
'Not in use (16)':'Não usado (16)',
'Not in use (17)':'Não usado (17)',
'Not in use (18)':'Não usado (18)',
'Not in use (19)':'Não usado (19)',
'Not in use (2)':'Não usado (2)',
'Not in use (20)':'Não usado (20)',
'Not in use (21)':'Não usado (21)',
'Not in use (22)':'Não usado (22)',
'Not in use (23)':'Não usado (23)',
'Not in use (24)':'Não usado (24)',
'Not in use (25)':'Não usado (25)',
'Not in use (26)':'Não usado (26)',
'Not in use (27)':'Não usado (27)',
'Not in use (28)':'Não usado (28)',
'Not in use (29)':'Não usado (29)',
'Not in use (3)':'Não usado (3)',
'Not in use (4)':'Não usado (4)',
'Not in use (5)':'Não usado (5)',
'Not in use (6)':'Não usado (6)',
'Not in use (7)':'Não usado (7)',
'Not in use (8)':'Não usado (8)',
'Not in use (9)':'Não usado (9)',
'O/U Heat Exch. Temp.':'O/U Heat Exch. Temp..',
'O/U capacity':'Capacidade U.E.',
'OPEN':'ABRIR',
'OTA Update':'Atualização OTA',
'Oil Return Operation':'Operação retorno de óleo',
'Oil return operation':'Operação retorno de óleo',
'Operation Mode':'Modo de operação',
'Operation mode':'Modo de operação',
'Other Drop Control':'Outro controlo de queda',
'Outdoor Air Temp (R1T)':'Temp. ar exterior (R1T)',
'Outdoor Ambient or Ext Sensor':'Ambiente exterior ou sensor ext.',
'Outdoor EEPROM (10th digit)':'EEPROM exterior (10th digit)',
'Outdoor EEPROM (1st digit)':'EEPROM exterior (1st digit)',
'Outdoor EEPROM (3rd 4th digit)':'EEPROM exterior (3rd 4th digit)',
'Outdoor EEPROM (5th 6th digit)':'EEPROM exterior (5th 6th digit)',
'Outdoor EEPROM (7th 8th digit)':'EEPROM exterior (7th 8th digit)',
'Outdoor Error Code':'Código de erro exterior',
'Outdoor Fan Step':'Passo ventilador exterior',
'Outdoor Heat Exch. Mid-temp.':'Temp. média permutador exterior',
'Outdoor Heat Exch. Temp.':'Temp. permutador exterior',
'Outdoor Heat Exch. Temp.(R4T)':'Temp. permutador exterior(R4T)',
'Outdoor Heat Exchanger Temp (R4T)':'Temp. permutador exterior (R4T)',
'Outdoor MPU ID':'MPU ID exterior',
'Outdoor MPU ID (2)':'MPU ID exterior (2)',
'Outdoor air temp.':'Temp. ar exterior',
'Outdoor air temp. (R1T)':'Temp. ar exterior (R1T)',
'Outdoor error code':'Código de erro exterior',
'Outdoor error type':'Tipo de erro exterior',
'Outdoor heat exch. temp. (R4T)':'Exterior heat exch. temp. (R4T)',
'Outdoor heat exchanger mid temp.':'Temp. média permutador exterior',
'Outdoor heat exchanger temp.':'Temp. permutador exterior',
'Outdoor thermostat':'Termóstato exterior',
'Outlet Water BUH Temp. (R2T)':'Temp. água saída BUH (R2T)',
'Outlet Water Heat Exch. Temp. (R1T)':'Temp. saída permutador água (R1T)',
'Outlet water heat exch. temp. (DLWB2)':'Temp. saída permutador água (DLWB2)',
'Outlet water heat exchanger temp (hydro split model) DLWB2':'Temp. saída permutador água (hydro split) DLWB2',
'O⁄U Heat Exch. Temp.':'O⁄U Heat Exch. Temp..',
'PHE Heater':'PHE Aquecedor',
'PHE Heater (2)':'PHE Aquecedor (2)',
'PRESS':'PREMIR',
'Power:':'Potência:',
'Powerful DHW Operation':'AQS reforçada',
'Powerful DHW Operation ON/OFF':'AQS reforçada ON/OFF',
'Powerful DHW Operation. ON-OFF':'AQS reforçada ON-OFF',
'Powerful DHW Operation. ON⁄OFF':'AQS reforçada ON/OFF',
'Powerful DHW operation':'AQS reforçada',
'Powerful bit (MT setting bit)':'Bit reforçado (MT setting bit)',
'Powerful demand':'Procura reforçada',
'Pressure':'Pressão',
'Pressure (2)':'Pressão (2)',
'Pressure equalizing operation':'Operação equalização pressão',
'Pressure sensor':'Sensor de pressão',
'Pressure sensor(T)':'Sensor de pressão(T)',
'Pressure sensor(T) (2)':'Sensor de pressão(T) (2)',
'Pressure(T)':'Pressão(T)',
'Pump Feedback (bit5)':'Bomba Feedback (bit5)',
'Pump Feedback (bit6)':'Bomba Feedback (bit6)',
'Pump Feedback (bit7)':'Bomba Feedback (bit7)',
'Pwr consumption limit 1':'Limite consumo energia 1',
'Pwr consumption limit 2':'Limite consumo energia 2',
'Pwr consumption limit 3':'Limite consumo energia 3',
'Pwr consumption limit 4':'Limite consumo energia 4',
'R1T-Outdoor air temp.':'Temp. ar exterior (R1T)',
'RT Temp.':'Temp. ambiente',
'RT setpoint':'Setpoint ambiente',
'Refrig Temp Liquid Side (R3T)':'Temp. refrig. lado líquido (R3T)',
'Refrig. Temp. liquid side (R3T)':'Temp. refrig. lado líquido (R3T)',
'Refrig. temp. evap. In':'Temp. refrig. evap. entrada',
'Refrig. temp. evap. Out':'Temp. refrig. evap. saída',
'Refrig. temp. evap.Out':'Temp. refrig. evap. saída',
'Refrig. temp. liquid side (R3T)':'Temp. refrig. lado líquido (R3T)',
'Refrigerant pressure':'Pressão refrigerante',
'Refrigerant pressure saturation temp.':'Pressão refrigerante saturation temp.',
'Refrigerant pressure sensor':'Sensor pressão refrigerante',
'Reheat ON-OFF':'Reaquecimento ON-OFF',
'Reheat ON/OFF':'Reaquecimento ON/OFF',
'Restart':'Reiniciar',
'Restart (Safe Mode)':'Reiniciar (modo seguro)',
'Reset Reason':'Motivo do reinício',
'Firmware Version':'Versão do firmware',
'Restart standby':'Espera de reinício',
'STD Compressor 1':'Compressor STD 1',
'STD Compressor 2':'Compressor STD 2',
'STD compressor Qty':'Qtd. compressores STD',
'SV (drain pan heater)':'SV (aquecedor tabuleiro)',
'SV (drain pan heater) (2)':'SV (aquecedor tabuleiro) (2)',
'Safeguard operation':'Operação de salvaguarda',
'Sensor Data Qty':'Qtd. dados sensor',
'Sensor and Control':'Sensores e controlos',
'Show All':'Mostrar tudo',
'Silent Mode':'Modo silencioso',
'Silent mode':'Modo silencioso',
'SmartGridContact1':'Contacto Smart Grid 1',
'SmartGridContact2':'Contacto Smart Grid 2',
'Solar input':'Entrada solar',
'Solar pump operation':'Funcionamento bomba solar',
'Solenoid Valve 1':'Válvula solenóide 1',
'Solenoid Valve 2':'Válvula solenóide 2',
'Solenoid Valve 3':'Válvula solenóide 3',
'Solenoid Valve 4':'Válvula solenóide 4',
'Solenoid Valve 5':'Válvula solenóide 5',
'Solenoid valve Qty':'Qtd. válvulas solenóide',
'Space C-H Op. or BPH':'Espaço C-H Op. or BPH',
'Space H Operation output':'Saída operação aquecimento',
'Space Heating Operation':'Aquecimento de espaço',
'Space Heating Output':'Saída aquecimento de espaço',
'Space heating Operation ON-OFF':'Aquecimento de espaço ON-OFF',
'Space heating Operation ON/OFF':'Aquecimento de espaço ON/OFF',
'Space heating Operation ON⁄OFF':'Espaço heating Operação ON⁄OFF',
'Space heating operation':'Aquecimento de espaço',
'Startup Control':'Controlo de arranque',
'States':'Estados',
'Status':'Estado',
'Storage ECO ON-OFF':'Armazenamento ECO ON-OFF',
'Storage ECO ON/OFF':'Armazenamento ECO ON/OFF',
'Storage comfort ON-OFF':'Armazenamento conforto ON-OFF',
'Storage comfort ON/OFF':'Armazenamento conforto ON/OFF',
'Suction Pipe Temp (R3T)':'Temp. tubagem aspiração (R3T)',
'Suction Pipe Temperature':'Temp. tubagem aspiração',
'Suction pipe temp.':'Temp. tubagem aspiração',
'Suction pipe temp. (R3T)':'Temp. tubagem aspiração (R3T)',
'Suction pipe temp.(R3T)':'Temp. tubagem aspiração(R3T)',
'Suction temp':'Temp. aspiração',
'Suggested Model':'Modelo sugerido',
'System OFF':'Sistema OFF',
'System OFF (ON:System off)':'Sistema OFF (ON:sistema desligado)',
'System off':'Sistema desligado',
'Tag':'Etiqueta',
'Tank preheat ON-OFF':'Pré-aquecimento depósito ON-OFF',
'Tank preheat ON/OFF':'Pré-aquecimento depósito ON/OFF',
'Target Cond. Temp.':'Temp. alvo condensação',
'Target Discharge Temp.':'Temp. alvo descarga',
'Target Evap. Temp.':'Temp. alvo evaporação',
'Target High:':'Alvo alto:',
'Target Low:':'Alvo baixo:',
'Target cond. temp.':'Temp. alvo condensação',
'Target delta T cooling':'Delta T alvo arrefecimento',
'Target delta T heating':'Delta T alvo aquecimento',
'Target evap. temp.':'Temp. alvo evaporação',
'Target port temperature':'Alvo port temperature',
'Target:':'Alvo:',
'Thermal Protector BUH':'Proteção térmica BUH',
'Thermal protector (Q1L) BUH':'Proteção térmica (Q1L) BUH',
'Thermal protector BSH':'Proteção térmica BSH',
'Thermal protector BUH':'Proteção térmica BUH',
'Thermal protector BUH (Q1L)':'Proteção térmica BUH (Q1L)',
'Thermostat':'Termóstato',
'Thermostat ON-OFF':'Termóstato ON-OFF',
'Thermostat ON-OFF (2)':'Termóstato ON-OFF (2)',
'Thermostat ON/OFF indoor':'Termóstato ON/OFF interior',
'Thermostat ON/OFF outdoor':'Termóstato ON/OFF exterior',
'Thermostat ON⁄OFF':'Termóstato ON/OFF',
'Thermostat Status':'Estado do termóstato',
'Time':'Hora',
'Update':'Atualizar',
'Uptime':'Tempo ligado',
'Voltage (N-phase) (V)':'Tensão (fase N) (V)',
'Voltage (V)':'Tensão (V)',
'Voltage N-phase':'Tensão fase N',
'Water Flow Switch':'Interruptor caudal',
'Water Pressure':'Pressão da água',
'Water Pump Operation':'Funcionamento bomba de água',
'Water Pump Signal':'Sinal bomba de água',
'Water flow switch':'Interruptor caudal',
'Water pressure':'Pressão da água',
'Water pressure (bar)':'Pressão da água (bar)',
'Water pump operation':'Funcionamento bomba de água',
'Water pump signal':'Sinal bomba de água',
'Water pump signal (0:max-100:stop)':'Sinal bomba de água (0:máx-100:parar)',
'WiFi BSSID':'BSSID Wi‑Fi',
'WiFi SSID':'SSID Wi‑Fi',
'WiFi Signal':'Sinal Wi‑Fi',
'[EKMIK] Bizone kit mix valve position M1S':'[EKMIK] Posição válvula mistura kit bizone M1S',
'[EKMIK] Bizone kit mixed leaving water temperature R1T':'[EKMIK] Temp. água saída misturada kit bizone R1T',
'[Future] 3 way Valve Mixing 1':'[Futuro] Válvula 3 vias mistura 1',
'[Future] 3 way Valve Mixing 2':'[Futuro] Válvula 3 vias mistura 2',
'[HPSU] Bypass valve position (0:Bypass 100:Emitter)':'[HPSU] Posição válvula bypass (0:Bypass 100:Emissor)',
'[HPSU] Mixed leaving water temperature after the tank R7T (DLWA2)':'[HPSU] Temp. água saída misturada após depósito R7T (DLWA2)',
'[HPSU] Tank DHW bivalent output signal':'[HPSU] Sinal saída bivalente AQS depósito',
'[HPSU] Tank DHW bivalent primary heat source (OFF:HP  ON:Boiler)':'[HPSU] Fonte calor primária bivalente AQS (OFF:HP ON:Caldeira)',
'[HPSU] Tank heating bivalent output signal':'[HPSU] Sinal saída bivalente aquecimento depósito',
'[HPSU] Tank heating bivalent primary heat source (OFF:HP  ON:Boiler)':'[HPSU] Fonte calor primária bivalente aquecimento (OFF:HP ON:Caldeira)',
'[HPSU] Tank valve position (0:Bypass 100:Tank)':'[HPSU] Posição válvula depósito (0:Bypass 100:Depósito)',
'[HPSU] Tr return Temp (R4T)':'[HPSU] Temp. retorno Tr (R4T)',
'[HPSU] Tv inflow Temp  (R1T)':'[HPSU] Temp. entrada Tv (R1T)',
'[HPSU] Tvbh inflow Temp after Buffer-BUH (R2T)':'[HPSU] Temp. entrada Tvbh após buffer-BUH (R2T)',
'[RT space thermo ON-OFF] (bit0)':'[Termóstato espaço ON-OFF] (bit0)',
'[RT space thermo ON-OFF] (bit1)':'[Termóstato espaço ON-OFF] (bit1)'
  };

  function lang() {
    return (window.althermaLang && window.althermaLang.get()) || 'en';
  }

  // Diagnostic VALUES (third column of the entity list). Exact strings sent by ESPHome's debug
  // reset_reason text sensor: ESP32 (esp_reset_reason table) and ESP8266 (ResetReasonStrings).
  var VALUE_DICT = {
'unknown source':'origem desconhecida',
'power-on event':'ligação à corrente',
'external pin':'pino externo (reset)',
'software via esp_restart':'reinício por software',
'exception/panic':'exceção/pânico',
'interrupt watchdog':'watchdog de interrupções',
'task watchdog':'watchdog de tarefas',
'other watchdogs':'outros watchdogs',
'exiting deep sleep mode':'saída do sono profundo',
'brownout':'quebra de tensão (brownout)',
'SDIO':'SDIO',
'USB peripheral':'periférico USB',
'JTAG':'JTAG',
'efuse error':'erro de eFuse',
'power glitch detected':'falha de alimentação detetada',
'CPU lock up':'bloqueio do CPU',
'Power On':'Ligação à corrente',
'Hardware Watchdog':'Watchdog de hardware',
'Exception':'Exceção',
'Software Watchdog':'Watchdog de software',
'Software/System restart':'Reinício por software/sistema',
'Deep-Sleep Wake':'Despertar do sono profundo',
'External System':'Reinício externo',
'Unknown':'Desconhecido'
  };

  function trValue(en) {
    if (!en || lang() !== 'pt') return en;
    if (Object.prototype.hasOwnProperty.call(VALUE_DICT, en)) return VALUE_DICT[en];
    var m = en.match(/^Reboot request from (.+)$/);
    if (m) return 'Reinício pedido por ' + m[1];
    if (window.althermaTranslateUpdateStatus) {
      var upd = window.althermaTranslateUpdateStatus(en, 'pt');
      if (upd && upd !== en) return upd;
    }
    return en;
  }

  // Edit lit's own text node in place (never textContent: that would detach lit's markers and
  // freeze later state updates). When lit writes a new English state, node.data no longer matches
  // what we wrote, so it is taken as the new source.
  function translateValueCell(cell) {
    if (!cell) return;
    var w = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      if (!n.data || !n.data.trim()) continue;
      if (n.__altOut === undefined || n.data !== n.__altOut) n.__altEn = n.data;
      var out = trValue(n.__altEn);
      n.__altOut = out;
      if (n.data !== out) n.data = out;
    }
  }

  function tr(en) {
    if (!en) return en;
    if (lang() !== 'pt') return en;
    if (DICT[en]) return DICT[en];
    // Dynamic Update Status strings (version numbers vary)
    if (window.althermaTranslateUpdateStatus) {
      var upd = window.althermaTranslateUpdateStatus(en, 'pt');
      if (upd && upd !== en) return upd;
    }
    // Error Description (and "No error")
    if (/^No error$/i.test(en) || /^[A-Z0-9]{1,3}:\s/.test(en)) {
      // diagram helper is in another IIFE; duplicate minimal via window if exposed
      if (window.althermaTranslateErrorDesc) {
        var ed = window.althermaTranslateErrorDesc(en, 'pt');
        if (ed && ed !== en) return ed;
      }
    }
    // Prefix labels "Current: 21.5 °C"
    for (var k in DICT) {
      if (k.length >= 4 && k.charAt(k.length - 1) === ':' && en.indexOf(k) === 0)
        return DICT[k] + en.slice(k.length);
    }
    return en;
  }

  function setText(el, en) {
    if (!el) return;
    if (!el.getAttribute(ATTR)) el.setAttribute(ATTR, en);
    var src = el.getAttribute(ATTR) || en;
    var next = tr(src);
    if (el.textContent !== next) el.textContent = next;
  }

  function translateNode(el) {
    if (!el || el.nodeType !== 1) return;
    // Skip our own diagram (already has data-i18n)
    if (el.id === 'altherma-diagram' || (el.closest && el.closest('#altherma-diagram'))) return;

    var tag = (el.tagName || '').toLowerCase();

    // Group headers + chrome
    if (el.classList && el.classList.contains('tab-header')) {
      var raw = el.getAttribute(ATTR) || el.textContent.trim();
      setText(el, raw);
      return;
    }

    // Entity name cell: second child of .entity-row (may include [device] prefix)
    if (el.classList && el.classList.contains('entity-row')) {
      var kids = el.children;
      if (kids && kids.length >= 2) {
        var nameEl = kids[1];
        var full = nameEl.getAttribute(ATTR) || nameEl.textContent;
        // Remember full English including optional [device] prefix
        if (!nameEl.getAttribute(ATTR)) nameEl.setAttribute(ATTR, full);
        var src = nameEl.getAttribute(ATTR);
        var m = src.match(/^(\[[^\]]+\]\s*)([\s\S]*)$/);
        if (m) {
          var next = m[1] + tr(m[2]);
          if (nameEl.textContent !== next) nameEl.textContent = next;
        } else {
          setText(nameEl, src);
        }
        if (kids.length >= 3) translateValueCell(kids[2]);
      }
    }

    // PRESS / Show All / Update buttons — text only; click handlers keep English actions
    if (tag === 'button' || (el.classList && el.classList.contains('btn'))) {
      var bt = (el.getAttribute(ATTR) || el.textContent || '').trim();
      if (bt === 'PRESS' || bt === 'Show All' || bt === 'Update' || DICT[bt]) {
        if (!el.getAttribute(ATTR)) el.setAttribute(ATTR, bt);
        setText(el, el.getAttribute(ATTR));
      }
    }

    // <option>: translate label, keep value attribute (device receives English value)
    if (tag === 'option') {
      var ov = el.getAttribute('value');
      var ot = el.getAttribute(ATTR) || el.textContent;
      if (!el.getAttribute(ATTR)) el.setAttribute(ATTR, ot);
      var srcO = el.getAttribute(ATTR);
      var nextO = tr(srcO);
      if (el.textContent !== nextO) el.textContent = nextO;
      // never touch value
      if (ov != null) el.setAttribute('value', ov);
    }

    // Climate / water_heater labels
    if (tag === 'label') {
      var lt = el.getAttribute(ATTR) || el.textContent;
      if (!el.getAttribute(ATTR)) el.setAttribute(ATTR, lt);
      var srcL = el.getAttribute(ATTR);
      var nextL = tr(srcL);
      // Also try prefix keys inside "Current: 21 °C"
      if (nextL === srcL && lang() === 'pt') {
        var pks = ['Current:', 'Target Low:', 'Target High:', 'Target:', 'Mode:', 'Away:', 'Power:'];
        for (var pi = 0; pi < pks.length; pi++) {
          var pk = pks[pi];
          if (srcL.indexOf(pk) === 0 && DICT[pk]) {
            nextL = DICT[pk] + srcL.slice(pk.length);
            break;
          }
        }
      }
      if (el.textContent !== nextL) el.textContent = nextL;
    }

    // Debug log column headers
    if (el.classList && el.classList.contains('thead')) {
      el.querySelectorAll('div').forEach(function (d) {
        var t = (d.getAttribute(ATTR) || d.textContent || '').trim();
        if (DICT[t] || t === 'Time' || t === 'Level' || t === 'Tag' || t === 'Message') {
          if (!d.getAttribute(ATTR)) d.setAttribute(ATTR, t);
          setText(d, d.getAttribute(ATTR));
        }
      });
    }
  }

  function walk(root) {
    if (!root) return;
    var list;
    try { list = root.querySelectorAll('*'); } catch (e) { return; }
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      translateNode(el);
      if (el.shadowRoot) walk(el.shadowRoot);
    }
    // Also translate the root itself if it's an element
    if (root.nodeType === 1) translateNode(root);
  }

  function applyAll() {
    walk(document);
    var app = document.querySelector('esp-app');
    if (app && app.shadowRoot) walk(app.shadowRoot);
  }

  var scheduled = null;
  function schedule() {
    if (scheduled) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      applyAll();
    }, 50);
  }

  function observe(node) {
    if (!node || node.__althermaI18nObs) return;
    try {
      var mo = new MutationObserver(schedule);
      mo.observe(node, { childList: true, subtree: true, characterData: true });
      node.__althermaI18nObs = mo;
    } catch (e) {}
  }

  function boot() {
    applyAll();
    observe(document.documentElement);
    var app = document.querySelector('esp-app');
    if (app) {
      observe(app);
      if (app.shadowRoot) {
        observe(app.shadowRoot);
        // Nested custom elements often mount later
        app.shadowRoot.querySelectorAll('*').forEach(function (el) {
          if (el.shadowRoot) observe(el.shadowRoot);
        });
      }
    }
  }

  var n = 0;
  var t = setInterval(function () {
    boot();
    if (document.querySelector('esp-app') && document.querySelector('esp-app').shadowRoot) {
      /* keep observing a few more ticks for late entity rows */
    }
    if (++n > 240) clearInterval(t);
  }, 250);

  if (window.althermaLang && window.althermaLang.on) {
    window.althermaLang.on(function () { applyAll(); });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.althermaLang && window.althermaLang.on)
        window.althermaLang.on(function () { applyAll(); });
    });
  }
})();
