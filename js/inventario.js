/* ==========================================================================
   Graphic Center Plus — Inventario
   Guarda todo en localStorage (funciona sin servidor). Estructura:
     catalogo   { categoria: [subcategorias] }
     bodegas    [ "BUNKER", "TALLER", ... ]
     areas      [ departamentos que retiran material ]
     materiales [ { cod, desc, cat, sub, um, bodega, ubicacion,
                    inicial, precision, min, costo, obs } ]
     movs       [ { id, fecha, cod, tipo: ENTRADA|SALIDA|AJUSTE|MERMA,
                    cant, area, responsable, motivo, obs } ]
   Existencia = inicial + entradas - salidas - mermas + ajustes (con signo)
   ========================================================================== */
(function () {
"use strict";

var LS = "gc_inventario_v1";
var DEFAULTS = {
"catalogo": {
"VINILES": [
"Vinil de impresion",
"Vinil especial",
"Vinil de corte",
"Microperforado y vidrio",
"Otros viniles"
],
"BANNER Y LONAS": [
"Banner",
"Lona",
"Mesh",
"Textil",
"Otros"
],
"LAMINAS": [
"PVC espumoso",
"Foam Board",
"Acrilico",
"ACM",
"Coroplast",
"Policarbonato",
"Lamina galvanizada",
"Lamina fosfatada",
"Lamina de aluminio",
"MDF y madera",
"Otras laminas"
],
"PAPELERIA": [
"Papel bond",
"Papel fotografico",
"Papel adhesivo",
"Cartulina",
"Papel sintetico",
"Papel transfer",
"Sobres",
"Etiquetas",
"Otros papeles"
],
"MATERIAL POP": [
"Roll Up",
"X-Banner / Aranas",
"Counters",
"Displays",
"Porta brochure",
"Muppis",
"Bases",
"Estructuras promocionales"
],
"IMPRESION": [
"Tintas",
"Cabezales y repuestos",
"Consumibles de impresora",
"Limpieza de impresora"
],
"LAMINADOS": [
"Laminado brillante",
"Laminado mate",
"Laminado UV",
"Laminado alto trafico",
"Otros laminados"
],
"BORDADO": [
"Hilos",
"Entretelas",
"Agujas y bobinas",
"Repuestos de bordadora",
"Insumos de bordado"
],
"DTF": [
"Film DTF",
"Tintas DTF",
"Polvo DTF",
"Quimicos DTF",
"Repuestos DTF"
],
"ELECTRICIDAD / LED": [
"Modulos LED",
"Tiras LED",
"Neon Flex",
"Fuentes y controladores",
"Cableado",
"Accesorios electricos",
"Proteccion"
],
"ESTRUCTURAS": [
"Perfileria",
"Tubo y angulo",
"Lamina metalica",
"Soportes y bases",
"Soldadura"
],
"INSTALACION": [
"Adhesivos y siliconas",
"Cintas",
"Fijaciones",
"Herramental de rotulacion",
"Consumibles de instalacion"
],
"INSUMOS": [
"Cuchillas",
"Tape",
"Siliconas",
"Pegamentos",
"Alcohol y limpieza",
"Tornillos",
"Remaches",
"Bridas",
"Guantes",
"Brocas",
"Discos",
"Lijas",
"Consumibles de impresora",
"Consumibles de instalacion",
"Otros consumibles"
],
"HERRAMIENTAS": [
"Herramienta electrica",
"Herramienta manual",
"Medicion",
"Escaleras y andamios"
],
"EQUIPOS": [
"Impresoras",
"Bordadoras",
"Corte y router",
"Prensas",
"Otros equipos"
],
"EMPAQUE": [
"Film y burbuja",
"Cajas y carton",
"Cintas de empaque",
"Etiquetas",
"Otros"
],
"OTROS": [
"Sin clasificar"
]
},
"bodegas": [
"BUNKER",
"TALLER"
],
"areas": [
"TALLER GRAFICO",
"TALLER DE BORDADOS",
"DTF",
"SERIGRAFIA",
"ESTRUCTURAS",
"INSTALACION",
"DISENO",
"ADMINISTRACION",
"VENTAS"
],
"materiales": [
{
"cod": "VIN-BRI-001",
"desc": "Vinil blanco brillante para impresion",
"cat": "VINILES",
"sub": "Vinil de impresion",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "VIN-B54-031",
"desc": "Vinil brillante 54 pulg (medida por confirmar)",
"cat": "VINILES",
"sub": "Vinil de impresion",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "VIN-TRA-003",
"desc": "Vinil transparente para impresion",
"cat": "VINILES",
"sub": "Vinil de impresion",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "VIN-REF-018",
"desc": "Vinil reflectivo",
"cat": "VINILES",
"sub": "Vinil especial",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "VIN-ALT-019",
"desc": "Vinil alto trafico (piso)",
"cat": "VINILES",
"sub": "Vinil especial",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "VIN-MAG-020",
"desc": "Vinil magnetico",
"cat": "VINILES",
"sub": "Vinil especial",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "MIC-EST-001",
"desc": "Microperforado estandar",
"cat": "VINILES",
"sub": "Microperforado y vidrio",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "BAN-BRI-001",
"desc": "Banner brillante",
"cat": "BANNER Y LONAS",
"sub": "Banner",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "BAN-MAT-002",
"desc": "Banner mate",
"cat": "BANNER Y LONAS",
"sub": "Banner",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "BAN-PET-003",
"desc": "PET Banner",
"cat": "BANNER Y LONAS",
"sub": "Banner",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "BAN-SRF-016",
"desc": "Banner S/R (nombre exacto por confirmar)",
"cat": "BANNER Y LONAS",
"sub": "Banner",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "BAN-MES-009",
"desc": "Banner Mesh",
"cat": "BANNER Y LONAS",
"sub": "Mesh",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "BAN-CAN-011",
"desc": "Canvas para impresion",
"cat": "BANNER Y LONAS",
"sub": "Textil",
"um": "PIE LINEAL",
"bodega": "",
"ubicacion": "",
"inicial": null,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "FOA-03M-001",
"desc": "Foam Board 3 mm",
"cat": "LAMINAS",
"sub": "Foam Board",
"um": "LAMINA",
"bodega": "",
"ubicacion": "",
"inicial": 8,
"precision": "EXACTO",
"min": null,
"costo": null,
"obs": "Medida de lamina por confirmar"
},
{
"cod": "FOA-10M-003",
"desc": "Foam Board 10 mm",
"cat": "LAMINAS",
"sub": "Foam Board",
"um": "LAMINA",
"bodega": "",
"ubicacion": "",
"inicial": 11,
"precision": "EXACTO",
"min": null,
"costo": null,
"obs": "Medida de lamina por confirmar"
},
{
"cod": "PVC-XXX-011",
"desc": "PVC espumoso - espesor por confirmar",
"cat": "LAMINAS",
"sub": "PVC espumoso",
"um": "LAMINA",
"bodega": "",
"ubicacion": "",
"inicial": 12,
"precision": "POR CONFIRMAR",
"min": null,
"costo": null,
"obs": "Reclasificar al espesor correcto"
},
{
"cod": "EQU-XBA-001",
"desc": "Arana / X-Banner",
"cat": "MATERIAL POP",
"sub": "X-Banner / Aranas",
"um": "UNIDAD",
"bodega": "",
"ubicacion": "",
"inicial": 15,
"precision": "EXACTO",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "EQU-RXB-002",
"desc": "Repuestos de arana / X-Banner (incompletos)",
"cat": "MATERIAL POP",
"sub": "X-Banner / Aranas",
"um": "UNIDAD",
"bodega": "",
"ubicacion": "",
"inicial": 2,
"precision": "ESTIMADO",
"min": null,
"costo": null,
"obs": "Verificar piezas faltantes"
},
{
"cod": "EQU-ROL-003",
"desc": "Roll Up",
"cat": "MATERIAL POP",
"sub": "Roll Up",
"um": "UNIDAD",
"bodega": "",
"ubicacion": "",
"inicial": 0,
"precision": "EXACTO",
"min": null,
"costo": null,
"obs": ""
},
{
"cod": "EQU-COU-004",
"desc": "Counter",
"cat": "MATERIAL POP",
"sub": "Counters",
"um": "UNIDAD",
"bodega": "",
"ubicacion": "",
"inicial": 3,
"precision": "EXACTO",
"min": null,
"costo": null,
"obs": ""
}
],
"movs": []
};

/* ---------------- datos ---------------- */
function cargar() {
  try {
    var raw = localStorage.getItem(LS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULTS));
}
var E = cargar();
if (!E.movs) E.movs = [];
if (!E.materiales) E.materiales = [];
if (!E.catalogo) E.catalogo = {};
if (!E.bodegas) E.bodegas = [];
if (!E.areas) E.areas = [];

function guardar() {
  try { localStorage.setItem(LS, JSON.stringify(E)); } catch (e) {
    toast("No se pudo guardar en este navegador (memoria llena o privada).");
  }
}

/* ---------------- estado de la vista ---------------- */
var tab = "existencias";
var filtro = "", fCat = "", fBodega = "", fEstado = "", fTipoMov = "";

/* ---------------- utilidades ---------------- */
function $(s, r) { return (r || document).querySelector(s); }
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function hoy() { var d = new Date(); return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
function p2(n) { return (n < 10 ? "0" : "") + n; }
function fdate(s) { if (!s) return ""; var p = String(s).split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : s; }
function num(n, d) {
  if (n == null || n === "") return "\u2014";
  var x = Number(n); if (!isFinite(x)) return "\u2014";
  return x.toLocaleString("es-PA", { minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: 2 });
}
function money(n) {
  if (n == null || !isFinite(Number(n))) return "\u2014";
  return "$" + Number(n).toLocaleString("es-PA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function mat(cod) { for (var i = 0; i < E.materiales.length; i++) if (E.materiales[i].cod === cod) return E.materiales[i]; return null; }
function cats() { return Object.keys(E.catalogo); }
function subs(c) { return (E.catalogo[c] || []).slice(); }
function ubiTxt(m) {
  if (!m) return "sin bodega";
  var b = m.bodega || "", u = m.ubicacion || "";
  if (!b && !u) return "sin bodega asignada";
  return (b || "sin bodega") + (u ? " \u00b7 " + u : "");
}

/* Existencia = inicial + entradas - salidas - mermas + ajustes (con signo) */
function existencia(cod) {
  var m = mat(cod); var t = m && m.inicial != null ? Number(m.inicial) : 0;
  for (var i = 0; i < E.movs.length; i++) {
    var v = E.movs[i]; if (v.cod !== cod) continue;
    if (v.tipo === "ENTRADA") t += Number(v.cant) || 0;
    else if (v.tipo === "SALIDA") t -= Number(v.cant) || 0;
    else if (v.tipo === "MERMA") t -= Number(v.cant) || 0;
    else if (v.tipo === "AJUSTE") t += Number(v.cant) || 0;
  }
  return Math.round(t * 10000) / 10000;
}
function conocida(cod) {
  var m = mat(cod);
  if (m && m.inicial != null) return true;
  for (var i = 0; i < E.movs.length; i++) if (E.movs[i].cod === cod) return true;
  return false;
}
function estadoMat(cod) {
  var m = mat(cod);
  if (!conocida(cod)) return { t: "POR CONFIRMAR", c: "inv-c-warn" };
  if (m.precision === "POR CONFIRMAR") return { t: "CANTIDAD POR CONFIRMAR", c: "inv-c-warn" };
  var x = existencia(cod);
  if (x < 0) return { t: "NEGATIVO \u2014 REVISAR", c: "inv-c-crit" };
  if (x <= 0) return { t: "AGOTADO", c: "inv-c-crit" };
  if (m.min != null && x <= Number(m.min)) return { t: "CR\u00cdTICO", c: "inv-c-crit" };
  if (m.min != null && x <= Number(m.min) * 1.5) return { t: "BAJO", c: "inv-c-warn" };
  if (m.min == null) return { t: "SIN M\u00cdNIMO", c: "inv-c-mute" };
  return { t: "NORMAL", c: "inv-c-ok" };
}

/* ---------------- estado / conexi\u00f3n ---------------- */
function chip(txt, cls) {
  var c = $("#chip"); if (!c) return;
  c.className = "inv-status" + (cls ? " " + cls : "");
  $("#chiptxt").textContent = txt;
}

/* ---------------- toast ---------------- */
var toastTimer = null;
function toast(msg) {
  var old = $(".inv-toast"); if (old) old.remove();
  var d = document.createElement("div");
  d.className = "inv-toast"; d.textContent = msg;
  document.body.appendChild(d);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { d.remove(); }, 3200);
}

/* ---------------- pintado principal ---------------- */
var TABS = [
  { id: "existencias", t: "Existencias" },
  { id: "movimientos", t: "Movimientos" },
  { id: "exportar", t: "Exportar" }
];

function pintarTabs() {
  var alertas = E.materiales.filter(function (m) { return ["inv-c-crit"].indexOf(estadoMat(m.cod).c) >= 0; }).length;
  $("#tabs").innerHTML = TABS.map(function (tb) {
    var badge = (tb.id === "existencias" && alertas) ? '<span class="badge">' + alertas + "</span>" : "";
    return '<button class="inv-tab" role="tab" data-tab="' + tb.id + '" aria-selected="' + (tab === tb.id) + '">' + esc(tb.t) + badge + "</button>";
  }).join("");
}

function pintar() {
  pintarTabs();
  var v = $("#vista");
  if (tab === "existencias") v.innerHTML = vistaExistencias();
  else if (tab === "movimientos") v.innerHTML = vistaMovimientos();
  else v.innerHTML = vistaExportar();
  avisos();
}

function avisos() {
  var box = $("#avisos");
  var criticos = E.materiales.filter(function (m) { return estadoMat(m.cod).t === "CR\u00cdTICO" || estadoMat(m.cod).t === "AGOTADO"; }).length;
  var porConfirmar = E.materiales.filter(function (m) { return m.precision === "POR CONFIRMAR"; }).length;
  var html = "";
  if (criticos) html += '<div class="inv-banner crit"><b>' + criticos + " material(es)</b> en estado cr\u00edtico o agotado. Revise la pesta\u00f1a Existencias.</div>";
  if (porConfirmar) html += '<div class="inv-banner"><b>' + porConfirmar + " material(es)</b> con cantidad inicial por confirmar.</div>";
  box.innerHTML = html;
}

/* ---------------- vista: existencias ---------------- */
function vistaExistencias() {
  var lista = E.materiales.slice();
  if (filtro) {
    var f = filtro.toLowerCase();
    lista = lista.filter(function (m) { return (m.cod + " " + m.desc).toLowerCase().indexOf(f) >= 0; });
  }
  if (fCat) lista = lista.filter(function (m) { return m.cat === fCat; });
  if (fBodega) lista = lista.filter(function (m) { return m.bodega === fBodega; });
  if (fEstado) lista = lista.filter(function (m) { return estadoMat(m.cod).t === fEstado; });
  lista.sort(function (a, b) { return (a.cat + a.sub + a.desc).localeCompare(b.cat + b.sub + b.desc); });

  var total = E.materiales.length;
  var agotados = E.materiales.filter(function (m) { return estadoMat(m.cod).t === "AGOTADO"; }).length;
  var criticos = E.materiales.filter(function (m) { return estadoMat(m.cod).t === "CR\u00cdTICO"; }).length;
  var bajos = E.materiales.filter(function (m) { return estadoMat(m.cod).t === "BAJO"; }).length;

  var stats = '<div class="inv-stats">'
    + stat(total, "materiales")
    + stat(agotados, "agotados", "c")
    + stat(criticos, "cr\u00edticos", "c")
    + stat(bajos, "bajos", "w")
    + "</div>";

  var search = '<div class="inv-search">'
    + '<input type="search" id="buscar" placeholder="Buscar c\u00f3digo o descripci\u00f3n\u2026" value="' + esc(filtro) + '">'
    + select("cat", cats(), fCat, "Todas las categor\u00edas")
    + select("bodega", E.bodegas, fBodega, "Todas las bodegas")
    + select("estado", ["POR CONFIRMAR", "CANTIDAD POR CONFIRMAR", "AGOTADO", "CR\u00cdTICO", "BAJO", "SIN M\u00cdNIMO", "NORMAL", "NEGATIVO \u2014 REVISAR"], fEstado, "Todos los estados")
    + '<button class="inv-btn pri" data-act="nuevo-material">+ Material</button>'
    + "</div>";

  var items = lista.length
    ? '<div class="inv-list cols2">' + lista.map(itemCard).join("") + "</div>"
    : '<div class="inv-vacio">No hay materiales con esos filtros.</div>';

  return '<section class="inv-view"><div class="inv-head"><h1>Existencias</h1></div>'
    + '<p class="inv-hint">Existencia = inventario inicial + entradas \u2212 salidas \u2212 mermas + ajustes. Nadie la escribe a mano: se calcula sola a partir de los movimientos.</p>'
    + stats + search + items + "</section>";
}

function stat(v, l, cls) { return '<div class="inv-stat' + (cls ? " " + cls : "") + '"><div class="v">' + esc(v) + '</div><div class="l">' + esc(l) + "</div></div>"; }
function select(key, opts, val, placeholder) {
  return '<select data-f="' + key + '" class="' + (val ? "on" : "") + '"><option value="">' + esc(placeholder) + "</option>"
    + opts.map(function (o) { return '<option value="' + esc(o) + '"' + (o === val ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("")
    + "</select>";
}

function itemCard(m) {
  var x = existencia(m.cod);
  var e = estadoMat(m.cod);
  var bar = m.min != null && x >= 0
    ? '<div class="inv-mini-bar"></div>' : "";
  return '<div class="inv-item">'
    + '<div class="head">'
    + '<div class="id"><div class="cod">' + esc(m.cod) + "</div><div class=\"nom\">" + esc(m.desc) + "</div>"
    + '<div class="meta">' + esc(m.cat) + (m.sub ? " \u2039 " + esc(m.sub) : "") + " \u00b7 " + esc(ubiTxt(m)) + "</div>"
    + '<div class="chips"><span class="inv-chip ' + e.c + '"><span class="dot"></span>' + esc(e.t) + "</span>"
    + (m.min != null ? '<span class="inv-chip inv-c-mute">M\u00cdN. ' + num(m.min) + "</span>" : "")
    + (m.costo != null ? '<span class="inv-chip inv-c-mute">' + money(m.costo) + "</span>" : "")
    + "</div></div>"
    + '<div class="qty"><div class="n">' + num(x, x % 1 ? 2 : 0) + '</div><div class="u">' + esc(m.um) + "</div></div>"
    + "</div>"
    + '<div class="acts">'
    + '<button class="pri" data-act="entrada" data-cod="' + esc(m.cod) + '">Entrada</button>'
    + '<button data-act="salida" data-cod="' + esc(m.cod) + '">Salida</button>'
    + '<button data-act="ajuste" data-cod="' + esc(m.cod) + '">Ajuste</button>'
    + '<button class="sec" data-act="merma" data-cod="' + esc(m.cod) + '">Merma</button>'
    + '<button data-act="editar-material" data-cod="' + esc(m.cod) + '">Editar</button>'
    + "</div></div>";
}

/* ---------------- vista: movimientos ---------------- */
function vistaMovimientos() {
  var lista = E.movs.slice().sort(function (a, b) { return (b.fecha + b.id).localeCompare(a.fecha + a.id); });
  if (fTipoMov) lista = lista.filter(function (v) { return v.tipo === fTipoMov; });
  if (filtro) {
    var f = filtro.toLowerCase();
    lista = lista.filter(function (v) { return (v.cod + " " + (v.motivo || "") + " " + (v.obs || "")).toLowerCase().indexOf(f) >= 0; });
  }
  var search = '<div class="inv-search">'
    + '<input type="search" id="buscar" placeholder="Buscar por c\u00f3digo o motivo\u2026" value="' + esc(filtro) + '">'
    + select("tipomov", ["ENTRADA", "SALIDA", "AJUSTE", "MERMA"], fTipoMov, "Todos los tipos")
    + "</div>";
  var items = lista.length
    ? '<div class="inv-list">' + lista.map(movRow).join("") + "</div>"
    : '<div class="inv-vacio">A\u00fan no hay movimientos registrados.</div>';
  return '<section class="inv-view"><div class="inv-head"><h1>Movimientos</h1></div>'
    + '<p class="inv-hint">Historial de entradas, salidas, ajustes y mermas. Cada registro afecta la existencia calculada del material.</p>'
    + search + items + "</section>";
}

function movRow(v) {
  var m = mat(v.cod);
  var cls = v.tipo === "ENTRADA" ? "in" : v.tipo === "SALIDA" || v.tipo === "MERMA" ? "out" : "adj";
  var signo = v.tipo === "ENTRADA" ? "+" : v.tipo === "SALIDA" || v.tipo === "MERMA" ? "\u2212" : (Number(v.cant) >= 0 ? "+" : "");
  var detalle = [v.area ? "\u2192 " + v.area : "", v.responsable ? "resp. " + v.responsable : "", v.motivo || v.obs || ""].filter(Boolean).join(" \u00b7 ");
  return '<div class="inv-mov">'
    + '<div class="f">' + fdate(v.fecha) + "<br>" + esc(v.tipo) + "</div>"
    + '<div class="d"><div class="t">' + esc(v.cod) + " \u2014 " + esc(m ? m.desc : "material eliminado") + "</div>"
    + (detalle ? '<div class="s">' + esc(detalle) + "</div>" : "") + "</div>"
    + '<div class="q ' + cls + '">' + signo + num(Math.abs(Number(v.cant) || 0), 2) + "</div>"
    + '<div class="del"><button data-act="borrar-mov" data-id="' + esc(v.id) + '">eliminar</button></div>'
    + "</div>";
}

/* ---------------- vista: exportar ---------------- */
function vistaExportar() {
  var respaldo = JSON.stringify(E, null, 0);
  var csv = "codigo\tdescripcion\tcategoria\tsubcategoria\tunidad\tbodega\tubicacion\texistencia\tminimo\tcosto\tobs\n"
    + E.materiales.map(function (m) {
        return [m.cod, m.desc, m.cat, m.sub, m.um, m.bodega, m.ubicacion, existencia(m.cod), m.min == null ? "" : m.min, m.costo == null ? "" : m.costo, m.obs].join("\t");
      }).join("\n");
  return '<section class="inv-view"><div class="inv-head"><h1>Exportar</h1></div>'
    + '<p class="inv-hint">Los datos viven en este navegador (localStorage). Use el respaldo JSON para moverlos a otro equipo o guardarlos aparte, y la tabla para pegarla en Excel.</p>'
    + '<div class="inv-exp"><div class="h"><span class="t">Respaldo JSON</span><span class="n">' + E.materiales.length + " materiales \u00b7 " + E.movs.length + ' movimientos</span>'
    + '<span class="sp"><button class="inv-btn" data-act="copiar" data-tgt="resp-json">Copiar</button>'
    + '<button class="inv-btn" data-act="descargar" data-tgt="resp-json" data-nombre="inventario-respaldo.json">Descargar</button></span></div>'
    + '<textarea id="resp-json" readonly>' + esc(respaldo) + "</textarea></div>"
    + '<div class="inv-exp"><div class="h"><span class="t">Tabla para Excel</span>'
    + '<span class="sp"><button class="inv-btn" data-act="copiar" data-tgt="resp-csv">Copiar</button>'
    + '<button class="inv-btn" data-act="descargar" data-tgt="resp-csv" data-nombre="inventario.csv">Descargar</button></span></div>'
    + '<textarea id="resp-csv" readonly>' + esc(csv) + "</textarea></div>"
    + '<button class="inv-btn" data-act="restaurar">Restaurar desde un respaldo JSON\u2026</button>'
    + "</section>";
}

/* ---------------- modales gen\u00e9ricos ---------------- */
function cab(k, tit, sub) { return '<div class="mh"><div class="k">' + esc(k) + "</div><h3>" + tit + "</h3>" + (sub ? '<div class="sub">' + sub + "</div>" : "") + "</div>"; }
function pie(txtOk) { return '<div class="mf"><button type="button" class="inv-btn" data-close>Cancelar</button><button type="submit" class="inv-btn pri">' + esc(txtOk) + "</button></div>"; }

function abrir(html, onSubmit) {
  cerrar();
  var scrim = document.createElement("div");
  scrim.className = "inv-scrim";
  scrim.innerHTML = '<div class="inv-modal">' + html + "</div>";
  document.body.appendChild(scrim);
  scrim.addEventListener("click", function (ev) { if (ev.target === scrim) cerrar(); });
  var form = scrim.querySelector("form");
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    onSubmit(form);
  });
  return scrim;
}
function cerrar() { var s = $(".inv-scrim"); if (s) s.remove(); }

/* ---------------- modal: material nuevo / editar ---------------- */
function modalMaterial(codExistente) {
  var m = codExistente ? mat(codExistente) : null;
  var h = cab(m ? "Editar material" : "Nuevo material", m ? esc(m.cod) : "Registrar material",
    m ? "Los cambios se aplican de inmediato" : "El c\u00f3digo debe ser \u00fanico")
    + '<div class="mb"><form>'
    + '<div class="inv-fld req"><label>C\u00f3digo</label><input name="cod" required ' + (m ? 'value="' + esc(m.cod) + '" readonly' : 'placeholder="EJ: VIN-BRI-001"') + "></div>"
    + '<div class="inv-fld req"><label>Descripci\u00f3n</label><input name="desc" required value="' + esc(m ? m.desc : "") + '"></div>'
    + '<div class="inv-two">'
    + '<div class="inv-fld req"><label>Categor\u00eda</label><select name="cat" required>' + cats().map(function (c) { return '<option value="' + esc(c) + '"' + (m && m.cat === c ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select></div>"
    + '<div class="inv-fld"><label>Subcategor\u00eda</label><select name="sub"><option value="">\u2014</option>' + subs(m ? m.cat : cats()[0]).map(function (s) { return '<option value="' + esc(s) + '"' + (m && m.sub === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select></div>"
    + "</div>"
    + '<div class="inv-two">'
    + '<div class="inv-fld req"><label>Unidad de medida</label><input name="um" required value="' + esc(m ? m.um : "UNIDAD") + '"></div>'
    + '<div class="inv-fld"><label>Bodega</label><select name="bodega"><option value="">\u2014</option>' + E.bodegas.map(function (b) { return '<option value="' + esc(b) + '"' + (m && m.bodega === b ? " selected" : "") + ">" + esc(b) + "</option>"; }).join("") + "</select></div>"
    + "</div>"
    + '<div class="inv-fld"><label>Ubicaci\u00f3n (repisa, pasillo\u2026)</label><input name="ubicacion" value="' + esc(m ? m.ubicacion : "") + '"></div>'
    + '<div class="inv-two">'
    + '<div class="inv-fld"><label>Cantidad inicial</label><input name="inicial" type="number" step="any" value="' + (m && m.inicial != null ? m.inicial : "") + '"><div class="h">Vac\u00edo = a\u00fan no se ha contado</div></div>'
    + '<div class="inv-fld"><label>M\u00ednimo (alerta)</label><input name="min" type="number" step="any" value="' + (m && m.min != null ? m.min : "") + '"></div>'
    + "</div>"
    + '<div class="inv-fld"><label>Costo unitario (opcional)</label><input name="costo" type="number" step="any" value="' + (m && m.costo != null ? m.costo : "") + '"></div>'
    + '<div class="inv-fld"><label>Observaciones</label><textarea name="obs" rows="2">' + esc(m ? m.obs : "") + "</textarea></div>"
    + pie(m ? "Guardar cambios" : "Crear material")
    + "</form></div>";

  var modal = abrir(h, function (f) {
    var cod = f.cod.value.trim().toUpperCase();
    if (!m && mat(cod)) { toast("Ya existe un material con ese c\u00f3digo."); return; }
    var data = {
      cod: cod, desc: f.desc.value.trim(), cat: f.cat.value, sub: f.sub.value,
      um: f.um.value.trim().toUpperCase(), bodega: f.bodega.value, ubicacion: f.ubicacion.value.trim(),
      inicial: f.inicial.value === "" ? null : Number(f.inicial.value),
      precision: f.inicial.value === "" ? "POR CONFIRMAR" : (m ? m.precision : "EXACTO"),
      min: f.min.value === "" ? null : Number(f.min.value),
      costo: f.costo.value === "" ? null : Number(f.costo.value),
      obs: f.obs.value.trim()
    };
    if (m) { Object.keys(data).forEach(function (k) { m[k] = data[k]; }); }
    else { E.materiales.push(data); }
    cerrar(); guardar(); pintar();
    toast(m ? "Material " + cod + " actualizado." : "Material " + cod + " creado.");
  });
  var sc = modal.querySelector("[name=cat]");
  sc.addEventListener("change", function () {
    var ss = modal.querySelector("[name=sub]");
    ss.innerHTML = '<option value="">\u2014</option>' + subs(sc.value).map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("");
  });
}

/* ---------------- modal: movimiento (entrada/salida/ajuste/merma) ---------------- */
function modalMovimiento(tipo, cod) {
  var m = mat(cod); if (!m) return;
  var x = existencia(cod);
  var titulos = { ENTRADA: "Registrar entrada", SALIDA: "Registrar salida", AJUSTE: "Ajustar conteo", MERMA: "Registrar merma" };
  var esSalida = tipo === "SALIDA";
  var esAjuste = tipo === "AJUSTE";

  var camposExtra = "";
  if (esSalida) {
    camposExtra = '<div class="inv-fld"><label>\u00c1rea / destino</label><select name="area"><option value="">\u2014</option>'
      + E.areas.map(function (a) { return "<option>" + esc(a) + "</option>"; }).join("") + "</select></div>";
  }
  if (esAjuste) {
    camposExtra = '<div class="inv-calc">Existencia actual: <b>' + num(x, 2) + " " + esc(m.um) + "</b><br>Escriba la cantidad real contada; el sistema calcula la diferencia.</div>";
  }

  var h = cab(tipo, titulos[tipo], esc(m.cod) + " \u2014 " + esc(m.desc))
    + '<div class="mb"><form>'
    + (!esAjuste ? '<div class="inv-calc">Existencia actual: ' + num(x, 2) + " " + esc(m.um) + "</div>" : "")
    + camposExtra
    + '<div class="inv-fld req"><label>' + (esAjuste ? "Cantidad real contada" : "Cantidad") + "</label><input name=\"cant\" type=\"number\" step=\"any\" required autofocus></div>"
    + '<div class="inv-two">'
    + '<div class="inv-fld"><label>Fecha</label><input name="fecha" type="date" value="' + hoy() + '"></div>'
    + '<div class="inv-fld"><label>Responsable</label><input name="responsable" placeholder="Nombre"></div>'
    + "</div>"
    + '<div class="inv-fld"><label>' + (esSalida ? "Motivo / proyecto" : "Observaciones") + "</label><textarea name=\"obs\" rows=\"2\"></textarea></div>"
    + pie("Registrar")
    + "</form></div>";

  abrir(h, function (f) {
    var cant = Number(f.cant.value);
    if (!isFinite(cant) || (!esAjuste && cant <= 0)) { toast("Ingrese una cantidad v\u00e1lida."); return; }
    var mov = {
      id: uid(), fecha: f.fecha.value || hoy(), cod: cod, tipo: tipo,
      cant: esAjuste ? Math.round((cant - x) * 10000) / 10000 : cant,
      area: esSalida ? f.area.value : "",
      responsable: f.responsable.value.trim(),
      motivo: esSalida ? f.obs.value.trim() : "",
      obs: !esSalida ? f.obs.value.trim() : ""
    };
    if (esAjuste && mov.cant === 0) { toast("La cantidad contada es igual a la existencia actual; no se registr\u00f3 ajuste."); cerrar(); return; }
    if (m.precision === "POR CONFIRMAR" && (tipo === "AJUSTE")) m.precision = "EXACTO";
    E.movs.push(mov);
    cerrar(); guardar(); pintar();
    toast("Movimiento registrado.");
  });
}

/* ---------------- modal: restaurar respaldo ---------------- */
function modalRestaurar() {
  var h = cab("Restaurar", "Pegar un respaldo JSON", "Reemplaza todos los datos actuales de este navegador")
    + '<div class="mb"><form>'
    + '<div class="inv-alerta"><b>Cuidado.</b> Esto sustituye materiales y movimientos por los del respaldo. Descargue el respaldo actual antes, por si acaso.</div>'
    + '<div class="inv-fld req"><label>Respaldo JSON</label><textarea name="json" rows="7" required></textarea></div>'
    + pie("Restaurar")
    + "</form></div>";
  abrir(h, function (f) {
    var d;
    try { d = JSON.parse(f.json.value); } catch (e) { toast("El texto no es un respaldo v\u00e1lido."); return; }
    if (!d || !d.materiales || !d.movs) { toast("El respaldo no tiene la estructura esperada."); return; }
    E.materiales = d.materiales; E.movs = d.movs;
    if (d.catalogo) E.catalogo = d.catalogo;
    if (d.bodegas) E.bodegas = d.bodegas;
    if (d.areas) E.areas = d.areas;
    cerrar(); guardar(); pintar();
    toast("Respaldo restaurado: " + E.materiales.length + " materiales.");
  });
}

/* ---------------- descargas ---------------- */
function descargar(nombre, contenido) {
  var blob = new Blob([(/\.csv$/.test(nombre) ? "\ufeff" : "") + contenido], { type: "text/plain;charset=utf-8" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = nombre;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
}

/* ---------------- eventos ---------------- */
document.addEventListener("click", function (ev) {
  if (!ev.target || !ev.target.closest) return;
  if (ev.target.closest("[data-close]")) { cerrar(); return; }
  var t = ev.target.closest("[data-tab]");
  if (t) { tab = t.dataset.tab; filtro = ""; pintar(); window.scrollTo(0, 0); return; }
  var b = ev.target.closest("[data-act]");
  if (!b) return;
  var a = b.dataset.act;
  if (a === "entrada") modalMovimiento("ENTRADA", b.dataset.cod);
  else if (a === "salida") modalMovimiento("SALIDA", b.dataset.cod);
  else if (a === "ajuste") modalMovimiento("AJUSTE", b.dataset.cod);
  else if (a === "merma") modalMovimiento("MERMA", b.dataset.cod);
  else if (a === "nuevo-material") modalMaterial(null);
  else if (a === "editar-material") modalMaterial(b.dataset.cod);
  else if (a === "restaurar") modalRestaurar();
  else if (a === "borrar-mov") {
    if (confirm("\u00bfEliminar este movimiento? La existencia se recalcular\u00e1.")) {
      E.movs = E.movs.filter(function (v) { return v.id !== b.dataset.id; });
      guardar(); pintar(); toast("Movimiento eliminado.");
    }
  } else if (a === "copiar") {
    var ta = document.getElementById(b.dataset.tgt);
    ta.select(); ta.setSelectionRange(0, 999999);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    if (navigator.clipboard && !ok) navigator.clipboard.writeText(ta.value).then(function () { toast("Copiado."); });
    else toast(ok ? "Copiado." : "Seleccione el texto y c\u00f3pielo a mano.");
  } else if (a === "descargar") {
    var t2 = document.getElementById(b.dataset.tgt);
    descargar(b.dataset.nombre, t2.value);
  }
});

document.addEventListener("input", function (ev) {
  if (ev.target.id === "buscar") {
    filtro = ev.target.value;
    var p = ev.target.selectionStart;
    pintar();
    var f = $("#buscar");
    if (f) { f.focus(); try { f.setSelectionRange(p, p); } catch (e) {} }
  }
});
document.addEventListener("change", function (ev) {
  var k = ev.target.dataset ? ev.target.dataset.f : null;
  if (!k) return;
  if (k === "cat") fCat = ev.target.value;
  else if (k === "bodega") fBodega = ev.target.value;
  else if (k === "estado") fEstado = ev.target.value;
  else if (k === "tipomov") fTipoMov = ev.target.value;
  pintar();
});

/* ---------------- arranque ---------------- */
pintar();
chip("Guardado en este navegador");

})();
