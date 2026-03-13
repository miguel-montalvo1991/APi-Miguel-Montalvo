import { useState, useEffect } from "react";

const API = "http://localhost:3000";
const PASSWORD = "sena2026";

const headers = {
  "Content-Type": "application/json",
  password: PASSWORD,
};

// ── utilidad fetch ──────────────────────────────────────────
async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ── iconos svg inline ───────────────────────────────────────
const Icon = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ── componente Toast ────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const color = type === "ok" ? "bg-emerald-500" : "bg-red-500";
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${color} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-bounce`}>
      {msg}
      <button onClick={onClose} className="opacity-70 hover:opacity-100">{Icon.close}</button>
    </div>
  );
}

// ── componente Modal formulario ─────────────────────────────
function Modal({ title, fields, values, onChange, onSave, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">{Icon.close}</button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{f.label}</label>
              {f.type === "select" ? (
                <select
                  value={values[f.key] || ""}
                  onChange={e => onChange(f.key, e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] || ""}
                  onChange={e => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder || ""}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-500 text-sm transition">
            Cancelar
          </button>
          <button onClick={onSave} disabled={loading}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition disabled:opacity-50">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── módulo genérico ─────────────────────────────────────────
function Modulo({ nombre, color, icon, endpoint, fields, columns, rowKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | { mode: 'crear'|'editar', values, id }
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const toast_ok = msg => setToast({ msg, type: "ok" });
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
      toast_ok(modal.mode === "crear" ? "Creado correctamente" : "Actualizado correctamente");
      setModal(null);
      cargar();
    } else {
      toast_err(res.message || "Error al guardar");
    }
  }

  async function eliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este registro?")) return;
    const res = await api("DELETE", `${endpoint}/${id}`);
    if (res.success) { toast_ok("Eliminado correctamente"); cargar(); }
    else toast_err(res.message || "Error al eliminar");
  }

  const colorMap = {
    blue:   { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",   dot: "bg-blue-400",   btn: "bg-blue-600 hover:bg-blue-500",   head: "text-blue-400" },
    green:  { badge: "bg-green-500/10 text-green-400 border-green-500/20", dot: "bg-green-400",  btn: "bg-green-600 hover:bg-green-500",  head: "text-green-400" },
    purple: { badge: "bg-purple-500/10 text-purple-400 border-purple-500/20", dot: "bg-purple-400", btn: "bg-purple-600 hover:bg-purple-500", head: "text-purple-400" },
    yellow: { badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dot: "bg-yellow-400", btn: "bg-yellow-600 hover:bg-yellow-500", head: "text-yellow-400" },
  };
  const c = colorMap[color];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-lg ${c.badge} border`}>{icon}</span>
          <div>
            <h2 className={`font-bold text-lg ${c.head}`}>{nombre}</h2>
            <p  className="text-xs text-gray-500">
               {loading ? "Cargando..." : `${data.length} registros`}
                 </p>
          </div>
        </div>
        <button onClick={abrirCrear}
          className={`flex items-center gap-2 ${c.btn} text-white text-sm font-semibold px-4 py-2 rounded-lg transition`}>
          {Icon.plus} Nuevo
        </button>
      </div>

      {/* tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-600 text-sm">Sin registros aún</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262d]">
                {columns.map(col => (
                  <th key={col.key} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {col.label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id || i} className="border-b border-[#21262d] hover:bg-[#1c2128] transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-300">
                      {col.badge ? (
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                          col.badgeMap?.[row[col.key]] || c.badge
                        }`}>{row[col.key]}</span>
                      ) : col.key === "id" ? (
                        <span className="text-gray-600 font-mono text-xs">#{row[col.key]}</span>
                      ) : (
                        <span>{row[col.key] ?? "—"}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => abrirEditar(row)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition">
                        {Icon.edit}
                      </button>
                      <button onClick={() => eliminar(row.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition">
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

      {/* modal */}
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

      {/* toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── App principal ───────────────────────────────────────────
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

export default function App() {
  const [tab, setTab] = useState("usuarios");
  const cfg = CONFIG[tab];
  const t = TABS.find(t => t.key === tab);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* header */}
      <header className="border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="text-blue-400">Tienda</span>
              <span className="text-white"> Virtual</span>
            </h1>
            <p className="text-xs text-gray-600 tracking-widest uppercase">ADSO SENA · Panel de gestión</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-gray-500">API conectada</span>
          </div>
        </div>
      </header>

      {/* tabs */}
      <div className="border-b border-[#21262d] bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const active = tab === t.key;
            const colorLine = { blue: "border-blue-400", green: "border-green-400", purple: "border-purple-400", yellow: "border-yellow-400" };
            const colorText = { blue: "text-blue-400", green: "text-green-400", purple: "text-purple-400", yellow: "text-yellow-400" };
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  active
                    ? `${colorLine[t.color]} ${colorText[t.color]}`
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}>
                {t.icon} {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* contenido */}
      <main className="max-w-6xl mx-auto px-6 py-8">
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

      {/* footer */}
      <footer className="border-t border-[#21262d] mt-16 py-6 text-center text-xs text-gray-700">
        Davier Quinto · Manuela Córdoba · Luis Miguel Montalvo — SENA 2026
      </footer>
    </div>
  );
}