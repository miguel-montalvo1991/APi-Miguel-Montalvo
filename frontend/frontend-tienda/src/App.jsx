// ============================================================
// src/App.jsx - Componente principal del frontend
// Estilo: Futurista con glassmorphism, tipografía Orbitron,
// esquinas decorativas, botones con bisel y cuadrícula de fondo
// ============================================================

import { useState, useEffect } from "react";

const API      = "https://api-miguel-montalvo.onrender.com";
const PASSWORD = "sena2026";

const headers = {
  "Content-Type": "application/json",
  password: PASSWORD,
};

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// Estilos globales futuristas inyectados en el head
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Rajdhani', sans-serif !important;
    background:
      linear-gradient(180deg, rgba(0,5,20,0.72) 0%, rgba(0,8,28,0.55) 50%, rgba(0,5,20,0.78) 100%),
      url('/galaxia.jpg') center/cover fixed no-repeat !important;
    min-height: 100vh;
  }

  .orbitron { font-family: 'Orbitron', monospace !important; }
  .rajdhani { font-family: 'Rajdhani', sans-serif !important; }

  /* Cuadrícula de fondo */
  .bg-grid {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  /* Esquinas decorativas reutilizables */
  .corner-box { position: relative; }
  .corner-box::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 18px; height: 18px;
    border-top: 2px solid #00c8ff;
    border-left: 2px solid #00c8ff;
    box-shadow: -2px -2px 8px rgba(0,200,255,0.3);
    z-index: 2;
    pointer-events: none;
  }
  .corner-box::after {
    content: '';
    position: absolute;
    bottom: -1px; right: -1px;
    width: 18px; height: 18px;
    border-bottom: 2px solid #00c8ff;
    border-right: 2px solid #00c8ff;
    box-shadow: 2px 2px 8px rgba(0,200,255,0.3);
    z-index: 2;
    pointer-events: none;
  }

  /* Chip de bisel */
  .bisel {
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .bisel-sm {
    clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
  }

  /* Scrollbar futurista */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: rgba(0,200,255,0.02); }
  ::-webkit-scrollbar-thumb { background: rgba(0,200,255,0.2); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,200,255,0.4); }

  /* Animaciones */
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  /* Hover en filas de tabla */
  .fila-hover:hover {
    background: rgba(0,200,255,0.04) !important;
    box-shadow: inset 3px 0 0 rgba(0,200,255,0.4) !important;
  }

  /* Input y select futuristas */
  .input-futuro {
    background: rgba(0,200,255,0.05) !important;
    border: 1px solid rgba(0,200,255,0.2) !important;
    color: #c8e8ff !important;
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 0.9rem !important;
    letter-spacing: 1px !important;
    transition: all 0.2s !important;
  }
  .input-futuro:focus {
    border-color: rgba(0,200,255,0.5) !important;
    box-shadow: 0 0 15px rgba(0,200,255,0.1) !important;
    outline: none !important;
  }
  .input-futuro::placeholder { color: rgba(0,200,255,0.25) !important; }
  .input-futuro option { background: #000d1f; }
`;

// Iconos SVG
const Icon = {
  user: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:18,height:18}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  box:  (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:18,height:18}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>),
  cart: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:18,height:18}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>),
  money:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:18,height:18}}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>),
  trash:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:13,height:13}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>),
  edit: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:13,height:13}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  plus: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} style={{width:13,height:13}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  close:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:18,height:18}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// ============================================================
// COMPONENTE: Toast futurista
// ============================================================
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const isOk = type === "ok";
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 20px",
      background: isOk ? "rgba(0,255,150,0.08)" : "rgba(255,50,80,0.08)",
      border: `1px solid ${isOk ? "rgba(0,255,150,0.3)" : "rgba(255,50,80,0.3)"}`,
      color: isOk ? "#00ff96" : "#ff6b8a",
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: "0.88rem", fontWeight: 600, letterSpacing: "1px",
      backdropFilter: "blur(20px)",
      clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
      boxShadow: `0 0 20px ${isOk ? "rgba(0,255,150,0.15)" : "rgba(255,50,80,0.15)"}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: isOk ? "#00ff96" : "#ff6b8a", boxShadow: `0 0 8px ${isOk ? "#00ff96" : "#ff6b8a"}` }} />
      {msg}
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.6, marginLeft: 4 }}>{Icon.close}</button>
    </div>
  );
}

// ============================================================
// COMPONENTE: Modal futurista
// ============================================================
function Modal({ title, fields, values, onChange, onSave, onClose, loading }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      background: "rgba(0,5,20,0.75)", backdropFilter: "blur(10px)",
    }}>
      <div className="corner-box" style={{
        width: "100%", maxWidth: 440,
        background: "rgba(0,10,35,0.85)",
        backdropFilter: "blur(40px)",
        border: "1px solid rgba(0,200,255,0.2)",
        boxShadow: "0 0 60px rgba(0,200,255,0.08), 0 24px 64px rgba(0,0,0,0.6)",
        overflow: "hidden",
      }}>
        {/* Barra superior */}
        <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #00c8ff 40%, #7b2fff 60%, transparent)" }} />

        {/* Header del modal */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(0,200,255,0.1)",
          background: "rgba(0,200,255,0.025)",
        }}>
          <span className="orbitron" style={{ fontSize: "0.8rem", letterSpacing: 3, color: "#00c8ff", textShadow: "0 0 10px rgba(0,200,255,0.4)" }}>
            {title.toUpperCase()}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,200,255,0.4)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#00c8ff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(0,200,255,0.4)"}>
            {Icon.close}
          </button>
        </div>

        {/* Campos */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label className="orbitron" style={{ display: "block", fontSize: "0.55rem", letterSpacing: 3, color: "rgba(0,200,255,0.45)", marginBottom: 6, textTransform: "uppercase" }}>
                {f.label}
              </label>
              {f.type === "select" ? (
                <select value={values[f.key] || ""} onChange={e => onChange(f.key, e.target.value)}
                  className="input-futuro"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 2 }}>
                  <option value="">Seleccionar...</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || "text"} value={values[f.key] || ""}
                  onChange={e => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder || ""}
                  className="input-futuro"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 2 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 10, padding: "0 1.5rem 1.5rem" }}>
          <button onClick={onClose} className="bisel rajdhani" style={{
            flex: 1, padding: "8px", fontSize: "0.82rem", fontWeight: 600, letterSpacing: 2,
            textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}>
            Cancelar
          </button>
          <button onClick={onSave} disabled={loading} className="bisel rajdhani" style={{
            flex: 1, padding: "8px", fontSize: "0.82rem", fontWeight: 600, letterSpacing: 2,
            textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
            background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.4)", color: "#00c8ff",
            textShadow: "0 0 10px rgba(0,200,255,0.4)", opacity: loading ? 0.5 : 1,
          }}
          onMouseEnter={e => { if(!loading){ e.currentTarget.style.background = "rgba(0,200,255,0.18)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,200,255,0.2)"; }}}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,200,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}>
            {loading ? "Procesando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: Modulo con estilo futurista completo
// ============================================================
function Modulo({ nombre, color, icon, endpoint, fields, columns }) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal,   setModal]   = useState(null);
  const [toast,   setToast]   = useState(null);
  const [saving,  setSaving]  = useState(false);

  const toast_ok  = msg => setToast({ msg, type: "ok" });
  const toast_err = msg => setToast({ msg, type: "err" });

  async function cargar() {
    setLoading(true);
    const res = await api("GET", endpoint);
    setData(Array.isArray(res) ? res : []);
    setLoading(false);
  }

  useEffect(() => { cargar(); }, []);

  function abrirCrear() {
    const empty = {};
    fields.forEach(f => empty[f.key] = "");
    setModal({ mode: "crear", values: empty });
  }

  function abrirEditar(row) {
    const vals = {};
    fields.forEach(f => vals[f.key] = row[f.key] ?? "");
    setModal({ mode: "editar", values: vals, id: row.id });
  }

  async function guardar() {
    setSaving(true);
    const body = { ...modal.values };
    let res;
    if (modal.mode === "crear") {
      res = await api("POST", endpoint, body);
    } else {
      res = await api("PUT", `${endpoint}/${modal.id}`, body);
    }
    setSaving(false);
    if (res.success) {
      toast_ok(modal.mode === "crear" ? "Registro creado" : "Registro actualizado");
      setModal(null);
      cargar();
    } else {
      toast_err(res.message || "Error al guardar");
    }
  }

  async function eliminar(id) {
    if (!confirm("¿Confirmar eliminación del registro?")) return;
    const res = await api("DELETE", `${endpoint}/${id}`);
    if (res.success) { toast_ok("Registro eliminado"); cargar(); }
    else toast_err(res.message || "Error al eliminar");
  }

  // Colores por módulo
  const colorMap = {
    blue:   { main: "#00c8ff", glow: "rgba(0,200,255,0.3)",   bg: "rgba(0,200,255,0.08)",   border: "rgba(0,200,255,0.25)",   grad: "#7b2fff" },
    green:  { main: "#00ff96", glow: "rgba(0,255,150,0.3)",   bg: "rgba(0,255,150,0.08)",   border: "rgba(0,255,150,0.25)",   grad: "#00c8ff" },
    purple: { main: "#c084fc", glow: "rgba(192,132,252,0.3)", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.25)", grad: "#f472b6" },
    yellow: { main: "#fbbf24", glow: "rgba(251,191,36,0.3)",  bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  grad: "#f97316" },
  };
  const c = colorMap[color];

  return (
    <div className="corner-box" style={{
      borderRadius: 4, overflow: "visible",
      background: "rgba(0,10,35,0.42)",
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      border: `1px solid ${c.border}`,
      boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${c.glow.replace("0.3","0.05")}`,
    }}>
      {/* Barra superior con gradiente del color del módulo */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${c.main} 30%, ${c.grad} 70%, transparent)`, boxShadow: `0 0 12px ${c.glow}` }} />

      {/* Header de la tarjeta */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 1.6rem",
        background: `${c.bg.replace("0.08","0.025")}`,
        borderBottom: `1px solid ${c.border.replace("0.25","0.12")}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            background: c.bg, border: `1px solid ${c.border}`,
            color: c.main,
            clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
            boxShadow: `inset 0 0 20px ${c.glow.replace("0.3","0.08")}`,
          }}>
            {icon}
          </div>
          <div>
            <div className="orbitron" style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: 3, color: c.main, textShadow: `0 0 15px ${c.glow}` }}>
              {nombre.toUpperCase()}
            </div>
            <div className="rajdhani" style={{ fontSize: "0.68rem", letterSpacing: 2, color: `${c.main}66`, marginTop: 2 }}>
              {loading ? "Cargando..." : `${data.length} registros activos`}
            </div>
          </div>
        </div>

        <button onClick={abrirCrear} className="bisel rajdhani"
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 18px", fontSize: "0.82rem", fontWeight: 600,
            letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
            color: c.main, background: c.bg, border: `1px solid ${c.border}`,
            textShadow: `0 0 10px ${c.glow}`, transition: "all 0.25s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = c.bg.replace("0.08","0.15"); e.currentTarget.style.boxShadow = `0 0 20px ${c.glow}`; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = c.bg; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
          {Icon.plus} Nuevo
        </button>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        {loading ? (
          <div className="orbitron" style={{ padding: "4rem", textAlign: "center", fontSize: "0.65rem", letterSpacing: 4, color: `${c.main}44` }}>
            Cargando datos...
          </div>
        ) : data.length === 0 ? (
          <div className="orbitron" style={{ padding: "4rem", textAlign: "center", fontSize: "0.65rem", letterSpacing: 4, color: "rgba(255,255,255,0.15)" }}>
            Sin registros aún
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border.replace("0.25","0.1")}` }}>
                {columns.map(col => (
                  <th key={col.key} className="orbitron" style={{
                    padding: "0.85rem 1.3rem", textAlign: "left",
                    fontSize: "0.52rem", letterSpacing: 3, fontWeight: 400,
                    color: `${c.main}55`, textTransform: "uppercase",
                  }}>{col.label}</th>
                ))}
                <th className="orbitron" style={{
                  padding: "0.85rem 1.3rem", textAlign: "right",
                  fontSize: "0.52rem", letterSpacing: 3, fontWeight: 400,
                  color: `${c.main}55`, textTransform: "uppercase",
                }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id || i} className="fila-hover" style={{ borderBottom: "1px solid rgba(0,200,255,0.04)", transition: "all 0.2s" }}>
                  {columns.map(col => (
                    <td key={col.key} className="rajdhani" style={{ padding: "0.95rem 1.3rem", color: "rgba(200,232,255,0.75)", fontWeight: 500 }}>
                      {col.badge ? (
                        <span className="bisel-sm rajdhani" style={{
                          fontSize: "0.78rem", fontWeight: 600, padding: "3px 12px",
                          letterSpacing: 1,
                          ...(col.badgeMap?.[row[col.key]] === "bg-green-500/10 text-green-400 border border-green-500/20"
                            ? { background: "rgba(0,255,150,0.08)", border: "1px solid rgba(0,255,150,0.25)", color: "#00ff96" }
                            : col.badgeMap?.[row[col.key]] === "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            ? { background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }
                            : { background: "rgba(255,50,80,0.08)", border: "1px solid rgba(255,50,80,0.25)", color: "#ff6b8a" })
                        }}>{row[col.key]}</span>
                      ) : col.key === "id" ? (
                        <span className="bisel-sm orbitron" style={{
                          fontSize: "0.6rem", fontWeight: 600, padding: "3px 10px", letterSpacing: 1,
                          background: c.bg, border: `1px solid ${c.border}`, color: c.main,
                        }}>#{row[col.key]}</span>
                      ) : (
                        <span>{row[col.key] ?? "—"}</span>
                      )}
                    </td>
                  ))}
                  <td style={{ padding: "0.95rem 1.3rem" }}>
                    <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                      <button onClick={() => abrirEditar(row)} className="bisel-sm" style={{
                        width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(0,200,255,0.04)", border: "1px solid rgba(0,200,255,0.15)",
                        cursor: "pointer", color: "rgba(0,200,255,0.4)", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = c.main; e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.bg; e.currentTarget.style.boxShadow = `0 0 12px ${c.glow}`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(0,200,255,0.4)"; e.currentTarget.style.borderColor = "rgba(0,200,255,0.15)"; e.currentTarget.style.background = "rgba(0,200,255,0.04)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                        {Icon.edit}
                      </button>
                      <button onClick={() => eliminar(row.id)} className="bisel-sm" style={{
                        width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(255,50,80,0.04)", border: "1px solid rgba(255,50,80,0.15)",
                        cursor: "pointer", color: "rgba(255,50,80,0.4)", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#ff6b8a"; e.currentTarget.style.borderColor = "rgba(255,107,138,0.4)"; e.currentTarget.style.background = "rgba(255,50,80,0.1)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(255,50,80,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,50,80,0.4)"; e.currentTarget.style.borderColor = "rgba(255,50,80,0.15)"; e.currentTarget.style.background = "rgba(255,50,80,0.04)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                        {Icon.trash}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === "crear" ? `Nuevo ${nombre.slice(0,-1)}` : `Editar ${nombre.slice(0,-1)}`}
          fields={fields}
          values={modal.values}
          onChange={(k, v) => setModal(m => ({ ...m, values: { ...m.values, [k]: v } }))}
          onSave={guardar}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// Tabs y configuración
const TABS = [
  { key: "usuarios",  label: "Usuarios",  color: "blue",   icon: Icon.user  },
  { key: "productos", label: "Productos", color: "green",  icon: Icon.box   },
  { key: "pedidos",   label: "Pedidos",   color: "purple", icon: Icon.cart  },
  { key: "ventas",    label: "Ventas",    color: "yellow", icon: Icon.money },
];

const CONFIG = {
  usuarios: {
    endpoint: "/usuarios",
    fields: [
      { key: "nombre",   label: "Nombre",   placeholder: "ej. Carla" },
      { key: "apellido", label: "Apellido", placeholder: "ej. Bravo" },
      { key: "email",    label: "Email",    placeholder: "carla@mail.com" },
      { key: "telefono", label: "Teléfono", placeholder: "ej. 3001234567" },
    ],
    columns: [
      { key: "id",       label: "ID" },
      { key: "nombre",   label: "Nombre" },
      { key: "apellido", label: "Apellido" },
      { key: "email",    label: "Email" },
      { key: "telefono", label: "Teléfono" },
    ],
  },
  productos: {
    endpoint: "/productos",
    fields: [
      { key: "nombre",    label: "Nombre",    placeholder: "ej. Camisa" },
      { key: "categoria", label: "Categoría", placeholder: "ej. ropa" },
      { key: "precio",    label: "Precio",    type: "number", placeholder: "35000" },
      { key: "stock",     label: "Stock",     type: "number", placeholder: "10" },
    ],
    columns: [
      { key: "id",        label: "ID" },
      { key: "nombre",    label: "Nombre" },
      { key: "categoria", label: "Categoría" },
      { key: "precio",    label: "Precio" },
      { key: "stock",     label: "Stock" },
    ],
  },
  pedidos: {
    endpoint: "/pedidos",
    fields: [
      { key: "usuarioId",  label: "ID Usuario",  type: "number", placeholder: "ej. 1" },
      { key: "productoId", label: "ID Producto",  type: "number", placeholder: "ej. 2" },
      { key: "cantidad",   label: "Cantidad",     type: "number", placeholder: "ej. 3" },
      { key: "total",      label: "Total ($)",    type: "number", placeholder: "ej. 90000" },
    ],
    columns: [
      { key: "id",         label: "ID" },
      { key: "usuarioId",  label: "Usuario" },
      { key: "productoId", label: "Producto" },
      { key: "cantidad",   label: "Cantidad" },
      { key: "total",      label: "Total" },
    ],
  },
  ventas: {
    endpoint: "/ventas",
    fields: [
      { key: "usuarioId",  label: "ID Usuario",   type: "number", placeholder: "ej. 1" },
      { key: "fecha",      label: "Fecha",        type: "date" },
      { key: "total",      label: "Total ($)",    type: "number", placeholder: "ej. 60000" },
      { key: "metodoPago", label: "Método de Pago", type: "select", options: ["efectivo", "tarjeta", "transferencia"] },
      { key: "estado",     label: "Estado",        type: "select", options: ["pendiente", "completada", "cancelada"] },
    ],
    columns: [
      { key: "id",         label: "ID" },
      { key: "usuarioId",  label: "Usuario" },
      { key: "fecha",      label: "Fecha" },
      { key: "total",      label: "Total" },
      { key: "metodoPago", label: "Método" },
      { key: "estado",     label: "Estado", badge: true,
        badgeMap: {
          completada: "bg-green-500/10 text-green-400 border border-green-500/20",
          pendiente:  "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
          cancelada:  "bg-red-500/10 text-red-400 border border-red-500/20",
        }
      },
    ],
  },
};

// ============================================================
// COMPONENTE PRINCIPAL: App
// ============================================================
export default function App() {
  const [tab, setTab] = useState("usuarios");
  const cfg = CONFIG[tab];
  const t   = TABS.find(t => t.key === tab);

  const colorMap = {
    blue:   { main: "#00c8ff", border: "rgba(0,200,255,0.25)" },
    green:  { main: "#00ff96", border: "rgba(0,255,150,0.25)" },
    purple: { main: "#c084fc", border: "rgba(192,132,252,0.25)" },
    yellow: { main: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#c8e8ff" }}>

      {/* Estilos globales */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* Cuadrícula de fondo */}
      <div className="bg-grid" />

      {/* HEADER */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "0.9rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(0,5,20,0.6)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        borderBottom: "1px solid rgba(0,200,255,0.15)",
        boxShadow: "0 0 30px rgba(0,200,255,0.04)",
      }}>
        {/* Logo con esquinas decorativas */}
        <div style={{ position: "relative", padding: "6px 10px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 10, height: 10, borderTop: "1px solid rgba(0,200,255,0.6)", borderLeft: "1px solid rgba(0,200,255,0.6)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderBottom: "1px solid rgba(0,200,255,0.6)", borderRight: "1px solid rgba(0,200,255,0.6)" }} />
          <div className="orbitron" style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: 3 }}>
            <span style={{ color: "#fff" }}>TIENDA</span>
            <span style={{ color: "#00c8ff", textShadow: "0 0 20px rgba(0,200,255,0.6)" }}> VIRTUAL</span>
          </div>
          <div className="rajdhani" style={{ fontSize: "0.58rem", letterSpacing: 5, color: "rgba(0,200,255,0.35)", textTransform: "uppercase", marginTop: 2 }}>
            ADSO SENA · Panel de gestión
          </div>
        </div>

        {/* Status badge */}
        <div className="bisel rajdhani" style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "5px 18px",
          border: "1px solid rgba(0,255,150,0.25)",
          background: "rgba(0,255,150,0.05)",
          fontSize: "0.75rem", fontWeight: 600, letterSpacing: 2,
          color: "#00ff96", textTransform: "uppercase",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff96", boxShadow: "0 0 10px #00ff96", animation: "blink 1.5s infinite", display: "inline-block" }} />
          Sistema Online
        </div>
      </header>

      {/* TABS */}
      <div style={{
        background: "rgba(0,5,20,0.45)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,200,255,0.1)",
        padding: "0 2rem",
        display: "flex",
        overflowX: "auto",
      }}>
        {TABS.map(tb => {
          const active = tab === tb.key;
          const c = colorMap[tb.color];
          return (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className="rajdhani"
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "0.85rem 1.5rem",
                fontSize: "0.85rem", fontWeight: 600, letterSpacing: 2,
                textTransform: "uppercase",
                color: active ? c.main : "rgba(200,232,255,0.3)",
                cursor: "pointer", border: "none", background: "none",
                borderBottom: active ? `2px solid ${c.main}` : "2px solid transparent",
                transition: "all 0.3s", whiteSpace: "nowrap",
                textShadow: active ? `0 0 12px ${c.border}` : "none",
                fontFamily: "'Rajdhani', sans-serif",
              }}
              onMouseEnter={e => { if(!active) e.currentTarget.style.color = "rgba(200,232,255,0.65)"; }}
              onMouseLeave={e => { if(!active) e.currentTarget.style.color = "rgba(200,232,255,0.3)"; }}>
              <span style={{
                width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: active ? c.main : "rgba(200,232,255,0.3)",
                background: active ? `${c.border.replace("0.25","0.1")}` : "transparent",
                clipPath: active ? "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" : "none",
                transition: "all 0.3s",
              }}>
                {tb.icon}
              </span>
              {tb.label}
            </button>
          );
        })}
      </div>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "2rem", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <Modulo
          key={tab}
          nombre={t.label}
          color={t.color}
          icon={t.icon}
          endpoint={cfg.endpoint}
          fields={cfg.fields}
          columns={cfg.columns}
        />
      </main>

      {/* FOOTER */}
      <footer className="orbitron" style={{
        padding: "1.2rem 2rem",
        textAlign: "center",
        fontSize: "0.52rem",
        letterSpacing: 6,
        textTransform: "uppercase",
        color: "rgba(0,200,255,0.2)",
        background: "rgba(0,5,20,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,200,255,0.08)",
      }}>
        Luis Miguel Montalvo — SENA 2026
      </footer>
    </div>
  );
}