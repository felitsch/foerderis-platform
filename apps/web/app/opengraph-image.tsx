import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Foerderis — Erfolgsbasierte Fördermittelberatung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: "64px",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "-2px",
          marginBottom: 24,
        }}
      >
        Foerderis
      </div>
      <div
        style={{
          color: "#a1a1aa",
          fontSize: 36,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        Erfolgsbasierte Fördermittelberatung für den deutschen Mittelstand
      </div>
      <div
        style={{
          color: "#22c55e",
          fontSize: 28,
          marginTop: 48,
          fontWeight: 600,
        }}
      >
        10 % Honorar — nur bei Bewilligung
      </div>
    </div>,
    { ...size }
  );
}
