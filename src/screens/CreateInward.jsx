import { useState } from "react";

const S = {
  page: "font-sans bg-[#f5f6fa] min-h-screen",
  topbar: "bg-white border-b border-[#e2e5ee] px-6 flex items-center gap-3 h-[50px]",
  card: "bg-white border border-[#e2e5ee] rounded-[10px] py-4 px-5 mb-4",
  label: "text-[12px] font-medium text-gray-700 mb-1 block",
  input: "w-full py-2 px-[11px] text-[14px] border border-gray-300 rounded-[7px] bg-white text-gray-900 box-border outline-none",
  readOnly: "w-full py-2 px-[11px] text-[14px] border border-gray-200 rounded-[7px] bg-gray-50 text-gray-500 box-border",
  secTitle: "text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] m-0 mb-[14px]",
  btnBlue: "py-[9px] px-[22px] text-[14px] font-semibold rounded-lg border-none bg-blue-600 text-white cursor-pointer",
  btnGreen: "py-[9px] px-[22px] text-[14px] font-semibold rounded-lg border-none bg-green-600 text-white cursor-pointer",
  ghost: "py-[6px] px-[13px] text-[12px] font-medium rounded-[7px] border border-gray-300 bg-transparent text-gray-700 cursor-pointer",
};

function F({ label, req, children, className }) {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      {label && <label className={S.label}>{label}{req && <span className="text-red-600"> *</span>}</label>}
      {children}
    </div>
  );
}
function Inp({ ro, className, ...p }) {
  return <input {...p} readOnly={!!ro} className={`${ro ? S.readOnly : S.input} ${className || ""}`} />;
}
function Sel({ children, className, ...p }) {
  return <select {...p} className={`${S.input} ${className || ""}`}>{children}</select>;
}

// ── mock data ──────────────────────────────────────────────────────────────
const PO_MAP = {
  "EX-PO-2026-Mar-1774357269737-1": {
    supplier: "Alpha Supplies Pvt Ltd", gst: "27AABCU9603R1ZX",
    issued: "24-Mar-2026", items: 1, total: "171.00",
    location: "RM Store – L101", from_node_id: 5, to_node_id: 2,
    item: "Steel Rod 12mm", item_code: "ITM-001", order_qty: "9.00",
  },
  "EX-PO-2026-Feb-1774291000111-3": {
    supplier: "Beta Materials Co.", gst: "29AABCB1234P1ZY",
    issued: "18-Feb-2026", items: 4, total: "9840.00",
    location: "RM Store – L101", from_node_id: 6, to_node_id: 2,
    item: "Copper Wire 4mm", item_code: "ITM-002", order_qty: "240.00",
  },
};

const MFG_UNITS = [
  { id: 1, label: "MFG-UNIT-01 – Gear Shop", store: "RM Store – L101" },
  { id: 2, label: "MFG-UNIT-02 – Assembly Line", store: "RM Store – L101" },
];

const PROD_ORDERS = {
  "WO-2026-001": { unit_id: 1, product: "Finished Gear A", target: "200.00", fg_store: "FG Store – L103", status: "In Progress" },
  "WO-2026-002": { unit_id: 2, product: "Shaft Assembly B", target: "50.00", fg_store: "FG Store – L103", status: "Scheduled" },
  "WO-2026-003": { unit_id: 1, product: "Bevel Gear Set", target: "120.00", fg_store: "WIP Store – L102", status: "In Progress" },
};

const MODES = [
  { key: "po", label: "PO Inward", sub: "Supply chain / vendor receipt", bg: "#eff6ff", color: "#1d4ed8", txn: "grn_receipt", ctx: "others", batchRef: "grn", batchLoc: "business_node" },
  { key: "mfg_rm", label: "Mfg RM Inward", sub: "PO receipt into manufacturing RM store", bg: "#f5f3ff", color: "#6d28d9", txn: "grn_receipt", ctx: "mfg_inward", batchRef: "grn", batchLoc: "mfg_unit" },
  { key: "prod_receipt", label: "Production Receipt", sub: "Finished / WIP goods from work order", bg: "#fff7ed", color: "#c2410c", txn: "production_receipt", ctx: "mfg_internal", batchRef: "production", batchLoc: "mfg_unit" },
];

function buildPayload(mode, { poRef, woRef, mfgUnitId, receiveDate, batchNo, unitPrice }) {
  const m = MODES.find(x => x.key === mode);
  const po = PO_MAP[poRef];
  const mfg = MFG_UNITS.find(u => u.id === mfgUnitId);
  return {
    GRN: {
      purchase_order_id: mode === "prod_receipt" ? null : (poRef || null),
      from_node_id: mode === "prod_receipt" ? (mfg?.id ?? null) : (po?.from_node_id ?? null),
      to_node_id: mode === "po" ? (po?.to_node_id ?? null) : (mfg?.id ?? null),
      mfg_unit_id: mode !== "po" ? mfgUnitId : null,
      received_date: receiveDate || null,
      status: "accepted",
    },
    NodeStockLedger: {
      transaction_type: m.txn,
      ledger_context: m.ctx,
      txn_date: receiveDate || null,
      from_location_type: mode === "prod_receipt" ? "mfg_unit" : "business_node",
      to_location_type: mode === "po" ? "business_node" : "mfg_unit",
      reference_type: mode === "prod_receipt" ? "production_order" : "purchase_order",
    },
    NodeBatch: {
      batch_no: batchNo || null,
      location_type: m.batchLoc,
      reference_type: m.batchRef,
      received_date: receiveDate || null,
      purchase_price: unitPrice || "0.00",
    },
  };
}

export default function CreateInward() {
  const [mode, setMode] = useState("po");
  const [poRef, setPoRef] = useState("EX-PO-2026-Mar-1774357269737-1");
  const [woRef, setWoRef] = useState("WO-2026-001");
  const [mfgUnitId, setMfgUnitId] = useState(1);

  const [orderQty, setOrderQty] = useState("");
  const [damageQty, setDamageQty] = useState("");
  const [shortageQty, setShortageQty] = useState("");
  const [receiveQty, setReceiveQty] = useState("");
  const [mfgDate, setMfgDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [receiveDate, setReceiveDate] = useState("");

  const [itemOpen, setItemOpen] = useState(true);
  const [showPayload, setShowPayload] = useState(false);
  const [posted, setPosted] = useState(false);
  const [toast, setToast] = useState(null);

  const po = PO_MAP[poRef];
  const wo = PROD_ORDERS[woRef];
  const mfg = MFG_UNITS.find(u => u.id === mfgUnitId);
  const modeObj = MODES.find(m2 => m2.key === mode);

  // sync order qty from PO / WO when mode/refs change
  const effectiveOrderQty = mode === "prod_receipt"
    ? (orderQty || wo?.target || "")
    : (orderQty || po?.order_qty || "");

  const ordered = parseFloat(effectiveOrderQty) || 0;
  const received = parseFloat(receiveQty) || 0;
  const damaged = parseFloat(damageQty) || 0;
  const shortage = parseFloat(shortageQty) || 0;
  const netAcc = received - damaged - shortage;
  const variance = received - ordered;

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500); };

  const handleModeChange = (k) => {
    setMode(k); setPosted(false); setOrderQty(""); setReceiveQty(""); setDamageQty(""); setShortageQty("");
  };

  const handlePost = () => {
    if (!receiveQty) { showToast("Receive qty is required.", false); return; }
    if (!receiveDate) { showToast("Receive date is required.", false); return; }
    if (mode !== "prod_receipt" && !poRef) { showToast("Select a PO first.", false); return; }
    if (mode === "prod_receipt" && !woRef) { showToast("Select a work order first.", false); return; }
    setPosted(true);
    showToast("GRN created · Ledger entry posted · Batch recorded");
  };

  const payload = buildPayload(mode, { poRef, woRef, mfgUnitId, receiveDate, batchNo, unitPrice });

  const infoRow = (l, v, borderColor = "#e5e7eb", labelColor = "#9ca3af", valColor = "#111827") => (
    <div key={l} style={{ borderColor }} className="flex gap-2 border-b pb-1">
      <span style={{ color: labelColor }} className="min-w-[120px] text-[13px]">{l}</span>
      <span style={{ color: valColor }} className="font-medium text-[13px]">{v ?? "—"}</span>
    </div>
  );

  return (
    <div className={S.page}>

      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] py-2.5 px-[18px] rounded-[9px] text-[13px] font-medium border ${toast.ok ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
          {toast.msg}
        </div>
      )}

      {/* topbar */}
      <div className={S.topbar}>
        <span className="font-bold text-[15px] text-blue-900">MYWMS</span>
        <span className="text-[#e2e5ee]">|</span>
        <span className="text-[13px] text-gray-400">inward</span>
        <span className="text-[13px] text-gray-400">/</span>
        <span className="text-[13px] text-gray-900 font-medium">create-inward</span>
        {modeObj && (
          <span style={{ backgroundColor: modeObj.bg, color: modeObj.color }} className="text-[11px] font-semibold py-[2px] px-[9px] rounded-full">
            {modeObj.label}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <button className={S.ghost} onClick={() => setShowPayload(x => !x)}>
            {showPayload ? "Hide" : "Preview"} payload
          </button>
        </div>
      </div>

      <div className="max-w-[980px] mx-auto py-[22px] px-5">

        {/* Mode selector */}
        <div className={S.card}>
          <p className={S.secTitle}>Inward type</p>
          <div className="flex gap-2.5 flex-wrap">
            {MODES.map(m2 => {
              const active = mode === m2.key;
              return (
                <button key={m2.key} onClick={() => handleModeChange(m2.key)}
                  style={{ borderColor: active ? m2.color : "#e2e5ee", backgroundColor: active ? m2.bg : "#fff", borderWidth: active ? "2px" : "1px" }}
                  className="flex-auto basis-[220px] text-left py-3 px-[14px] rounded-[9px] cursor-pointer border-solid">
                  <div style={{ color: active ? m2.color : "#111827" }} className="text-[13px] font-semibold mb-[3px]">{m2.label}</div>
                  <div className="text-[11px] text-gray-500 mb-2">{m2.sub}</div>
                  <div className="flex gap-1.5">
                    <span style={{ backgroundColor: active ? m2.color + "18" : "#f3f4f6", color: active ? m2.color : "#6b7280" }} className="text-[10px] py-[2px] px-[7px] rounded-full font-medium">txn: {m2.txn}</span>
                    <span style={{ backgroundColor: active ? m2.color + "18" : "#f3f4f6", color: active ? m2.color : "#6b7280" }} className="text-[10px] py-[2px] px-[7px] rounded-full font-medium">ctx: {m2.ctx}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reference block */}
        <div className={S.card}>
          <p className={S.secTitle}>
            {mode === "po" && "Purchase order details"}
            {mode === "mfg_rm" && "PO + manufacturing unit"}
            {mode === "prod_receipt" && "Production order details"}
          </p>

          <div className={`grid gap-3 mb-[14px] ${mode === "mfg_rm" ? "grid-cols-2" : "grid-cols-1"}`}>
            {mode !== "prod_receipt" && (
              <F label="Purchase order" req>
                <Sel value={poRef} onChange={e => { setPoRef(e.target.value); setOrderQty(""); }}>
                  {Object.keys(PO_MAP).map(k => <option key={k} value={k}># {k}</option>)}
                </Sel>
              </F>
            )}
            {mode !== "po" && (
              <F label="Manufacturing unit" req>
                <Sel value={mfgUnitId} onChange={e => setMfgUnitId(Number(e.target.value))}>
                  {MFG_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                </Sel>
              </F>
            )}
          </div>

          {mode === "prod_receipt" && (
            <div className="mb-[14px]">
              <F label="Work order / production order" req>
                <Sel value={woRef} onChange={e => { setWoRef(e.target.value); setOrderQty(""); }}>
                  {Object.entries(PROD_ORDERS)
                    .filter(([, v]) => v.unit_id === mfgUnitId)
                    .map(([k]) => <option key={k}>{k}</option>)}
                </Sel>
              </F>
            </div>
          )}

          {/* PO detail grid */}
          {mode !== "prod_receipt" && po && (
            <div className="bg-slate-50 rounded-lg py-3 px-4 grid grid-cols-2 gap-y-[6px] gap-x-7">
              {infoRow("PO number", `# ${poRef}`)}
              {infoRow("Supplier", po.supplier)}
              {infoRow("GST no.", po.gst)}
              {infoRow("Issued date", po.issued)}
              {infoRow("Item", `${po.item} (${po.item_code})`)}
              {infoRow("Grand total", `₹${po.total}`)}
              {infoRow("To node", po.location)}
              {infoRow("from_node_id → to_node_id", `${po.from_node_id} → ${po.to_node_id}`)}
            </div>
          )}

          {/* Production order detail grid */}
          {mode === "prod_receipt" && wo && (
            <div className="bg-orange-50 rounded-lg py-3 px-4 grid grid-cols-2 gap-y-[6px] gap-x-7">
              {infoRow("Work order", woRef, "#fed7aa", "#9a3412", "#7c2d12")}
              {infoRow("MFG unit", mfg?.label, "#fed7aa", "#9a3412", "#7c2d12")}
              {infoRow("Product", wo.product, "#fed7aa", "#9a3412", "#7c2d12")}
              {infoRow("Target qty", wo.target, "#fed7aa", "#9a3412", "#7c2d12")}
              {infoRow("Output store", wo.fg_store, "#fed7aa", "#9a3412", "#7c2d12")}
              {infoRow("Status", wo.status, "#fed7aa", "#9a3412", "#7c2d12")}
              {infoRow("purchase_order_id", "null", "#fed7aa", "#9a3412", "#c2410c")}
              {infoRow("mfg_unit_id", String(mfgUnitId), "#fed7aa", "#9a3412", "#7c2d12")}
            </div>
          )}

          {mode === "mfg_rm" && mfg && (
            <div className="mt-2.5 py-2 px-[14px] bg-violet-50 rounded-lg text-[13px] text-violet-900">
              RM goods will be received into <strong>{mfg.store}</strong> under <strong>{mfg.label}</strong>.
              &nbsp;Ledger context: <code className="bg-violet-100 py-[1px] px-[5px] rounded">mfg_inward</code>
            </div>
          )}
        </div>

        {/* Item / qty block */}
        <div className={S.card}>
          <div onClick={() => setItemOpen(x => !x)}
            className={`flex justify-between items-center cursor-pointer ${itemOpen ? 'mb-[14px]' : 'mb-0'}`}>
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] font-medium text-gray-900">
                {mode === "prod_receipt" ? (wo?.product ?? "Item") : (po?.item ?? "Item")}
              </span>
              <span className="text-[12px] text-gray-400">
                {mode === "prod_receipt" ? woRef : (po?.item_code ?? "")}
              </span>
              {receiveQty && (
                <span className={`text-[11px] py-[2px] px-2 rounded-full font-semibold ${variance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {variance >= 0 ? "+" : ""}{variance.toFixed(2)} variance
                </span>
              )}
            </div>
            <span className="text-gray-400 text-[18px]">{itemOpen ? "∧" : "∨"}</span>
          </div>

          {itemOpen && (
            <>
              <div className="grid grid-cols-6 gap-3 mb-[14px]">
                <F label="Order qty" req>
                  <Inp ro value={effectiveOrderQty} />
                </F>
                <F label="Damage qty">
                  <Inp type="number" value={damageQty} onChange={e => setDamageQty(e.target.value)} placeholder="0" />
                </F>
                <F label="Shortage qty">
                  <Inp type="number" value={shortageQty} onChange={e => setShortageQty(e.target.value)} placeholder="0" />
                </F>
                <F label="Receive qty" req>
                  <Inp type="number" value={receiveQty} onChange={e => setReceiveQty(e.target.value)} placeholder="0"
                    className={receiveQty ? (received < ordered ? "!border-red-300" : "!border-green-300") : ""} />
                </F>
                <F label="Mfg. date">
                  <Inp type="date" value={mfgDate} onChange={e => setMfgDate(e.target.value)} />
                </F>
                <F label="Expiry date">
                  <Inp type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                </F>
              </div>

              {receiveQty && (
                <div className="flex gap-2.5 flex-wrap">
                  {[
                    { l: "Ordered", v: ordered, c: "#374151" },
                    { l: "Received", v: received, c: "#2563eb" },
                    { l: "Damaged", v: damaged, c: "#dc2626" },
                    { l: "Shortage", v: shortage, c: "#d97706" },
                    { l: "Net accepted", v: netAcc, c: "#16a34a" },
                  ].map(r => (
                    <div key={r.l} className="bg-slate-50 rounded-lg py-2 px-[14px] text-center flex-auto basis-[80px]">
                      <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.06em]">{r.l}</div>
                      <div style={{ color: r.c }} className="text-[20px] font-semibold mt-0.5">{r.v.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Batch + receive date + post */}
        <div className={`${S.card} !flex items-end gap-[14px] flex-wrap`}>
          <F label="Batch no." className="flex-auto basis-[180px]">
            <Inp value={batchNo} onChange={e => setBatchNo(e.target.value)} placeholder="Enter batch number..." />
          </F>
          {mode !== "prod_receipt" && (
            <F label="Unit price (₹)" className="flex-auto basis-[130px]">
              <Inp type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="0.00" />
            </F>
          )}
          <F label="Receive date" req className="flex-auto basis-[160px]">
            <Inp type="date" value={receiveDate} onChange={e => setReceiveDate(e.target.value)} />
          </F>
          <button onClick={handlePost} disabled={posted} className={posted ? S.btnGreen : S.btnBlue}>
            {posted ? "✓ Posted" : "Receive & Post"}
          </button>
        </div>

        {/* Payload preview */}
        {showPayload && (
          <div className="bg-slate-900 rounded-[10px] py-4 px-5 mb-4">
            <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-[0.07em] m-0 mb-3">
              Records that will be created on "Receive &amp; Post"
            </p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(payload).map(([key, val]) => (
                <div key={key} className="bg-slate-800 rounded-lg py-3 px-[14px]">
                  <div className="text-[11px] text-sky-300 font-semibold uppercase tracking-[0.06em] mb-2">{key}</div>
                  <pre className="m-0 text-[11px] text-slate-300 whitespace-pre-wrap break-all leading-[1.65]">
                    {JSON.stringify(val, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}