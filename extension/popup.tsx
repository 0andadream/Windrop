import { useEffect, useMemo, useState } from "react"

import {
  COLORS,
  GRADIENT,
  giftUrl,
  handleFromUrl,
  isValidHandle,
  TICKET_PRESETS,
  TICKET_PRICE_USDC
} from "~lib/windrop"

function Droplet({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <defs>
        <linearGradient id="pd-bg" x1="0" y1="0" x2="512" y2="512">
          <stop offset="0" stopColor={COLORS.blue} />
          <stop offset="0.55" stopColor={COLORS.iris} />
          <stop offset="1" stopColor={COLORS.green} />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="120" fill="url(#pd-bg)" />
      <path
        d="M256 96C316 190 372 262 372 328a116 116 0 1 1-232 0C140 262 196 190 256 96Z"
        fill="#fff"
      />
      <path
        d="M256 250c8 34 18 44 52 52-34 8-44 18-52 52-8-34-18-44-52-52 34-8 44-18 52-52Z"
        fill={COLORS.yellow}
      />
    </svg>
  )
}

function Popup() {
  const [handle, setHandle] = useState("")
  const [tickets, setTickets] = useState(5)
  const [detected, setDetected] = useState(false)

  // Prefill from the active tab if it's an X profile (activeTab permission).
  useEffect(() => {
    try {
      chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs?.[0]?.url
        const detectedHandle = url ? handleFromUrl(url) : null
        if (detectedHandle) {
          setHandle(detectedHandle)
          setDetected(true)
        }
      })
    } catch {
      // Not running as an extension popup (e.g. dev preview) — ignore.
    }
  }, [])

  const clean = handle.replace(/^@/, "").trim()
  const valid = isValidHandle(clean)
  const total = tickets * TICKET_PRICE_USDC

  const openGift = () => {
    if (!valid) return
    const url = giftUrl(clean, tickets)
    if (chrome.tabs?.create) chrome.tabs.create({ url })
    else window.open(url, "_blank", "noopener")
  }

  const surprise = () => setTickets(Math.floor(Math.random() * 25) + 1)

  const styles = useMemo(
    () => ({
      root: {
        width: 320,
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        background: COLORS.ink,
        color: "#fff",
        margin: 0
      } as React.CSSProperties,
      header: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "16px 18px",
        background: GRADIENT,
        backgroundSize: "160% 160%"
      } as React.CSSProperties,
      body: { padding: 18 } as React.CSSProperties,
      label: {
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "#8ea0c9",
        marginBottom: 6
      } as React.CSSProperties,
      input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        borderRadius: 14,
        border: `2px solid ${valid ? COLORS.green : "#26304f"}`,
        background: "#141a33",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        outline: "none"
      } as React.CSSProperties,
      countRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "16px 0 12px"
      } as React.CSSProperties,
      count: {
        fontSize: 44,
        fontWeight: 900,
        lineHeight: 1,
        background: GRADIENT,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      } as React.CSSProperties,
      stepBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        border: 0,
        background: "#1c2544",
        color: "#fff",
        fontSize: 20,
        fontWeight: 800,
        cursor: "pointer"
      } as React.CSSProperties,
      presets: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 6,
        marginBottom: 16
      } as React.CSSProperties,
      cta: {
        width: "100%",
        padding: "13px 16px",
        borderRadius: 16,
        border: 0,
        background: GRADIENT,
        backgroundSize: "160% 160%",
        color: "#fff",
        fontSize: 16,
        fontWeight: 800,
        cursor: valid ? "pointer" : "not-allowed",
        opacity: valid ? 1 : 0.5
      } as React.CSSProperties
    }),
    [valid]
  )

  const presetBtn = (active: boolean): React.CSSProperties => ({
    padding: "9px 0",
    borderRadius: 10,
    border: 0,
    background: active ? COLORS.blue : "#1c2544",
    color: "#fff",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer"
  })

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <Droplet />
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5 }}>
            WinDrop
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.9 }}>
            Gift Lottery Luck
          </div>
        </div>
      </div>

      <div style={styles.body}>
        <label style={styles.label} htmlFor="wd-handle">
          Recipient on X
        </label>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8ea0c9",
              fontWeight: 700
            }}>
            @
          </span>
          <input
            id="wd-handle"
            style={{ ...styles.input, paddingLeft: 26 }}
            value={clean}
            onChange={(e) => {
              setHandle(e.target.value)
              setDetected(false)
            }}
            placeholder="username"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        {detected && (
          <div style={{ marginTop: 6, fontSize: 12, color: COLORS.green }}>
            ✓ Detected from this profile
          </div>
        )}

        <div style={styles.countRow}>
          <button
            style={styles.stepBtn}
            onClick={() => setTickets((t) => Math.max(1, t - 1))}
            aria-label="Fewer tickets">
            −
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={styles.count}>{tickets}</div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#8ea0c9",
                marginTop: 2
              }}>
              {tickets === 1 ? "ticket" : "tickets"}
            </div>
          </div>
          <button
            style={styles.stepBtn}
            onClick={() => setTickets((t) => Math.min(100, t + 1))}
            aria-label="More tickets">
            +
          </button>
        </div>

        <div style={styles.presets}>
          {TICKET_PRESETS.map((p) => (
            <button
              key={p}
              style={presetBtn(tickets === p)}
              onClick={() => setTickets(p)}>
              {p}
            </button>
          ))}
          <button
            style={{
              ...presetBtn(false),
              background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.pink})`,
              fontSize: 15
            }}
            title="Surprise me!"
            onClick={surprise}>
            🎲
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            margin: "4px 2px 14px"
          }}>
          <span style={{ fontSize: 13, color: "#8ea0c9" }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 900 }}>
            {total}{" "}
            <span style={{ fontSize: 13, color: COLORS.blue }}>USDC</span>
          </span>
        </div>

        <button style={styles.cta} onClick={openGift} disabled={!valid}>
          🎁 Gift {tickets} {tickets === 1 ? "ticket" : "tickets"}
        </button>

        <div
          style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: 11,
            color: "#5c6a90"
          }}>
          Opens WinDrop on Base · Powered by Megapot
        </div>
      </div>
    </div>
  )
}

export default Popup
