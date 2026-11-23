// Tailwind utility classes, driven by the custom theme tokens in index.css.
export const DIFFICULTY_STYLES = {
  EASY: { text: "text-easy", bg: "bg-easy-soft", dot: "bg-easy" },
  MEDIUM: { text: "text-medium", bg: "bg-medium-soft", dot: "bg-medium" },
  HARD: { text: "text-hard", bg: "bg-hard-soft", dot: "bg-hard" },
};

export const STATUS_STYLES = {
  WISHLIST: { text: "text-wishlist", bg: "bg-wishlist-soft", dot: "bg-wishlist", label: "Wishlist" },
  APPLIED: { text: "text-applied", bg: "bg-applied-soft", dot: "bg-applied", label: "Applied" },
  OA: { text: "text-oa", bg: "bg-oa-soft", dot: "bg-oa", label: "OA" },
  INTERVIEW: { text: "text-interview", bg: "bg-interview-soft", dot: "bg-interview", label: "Interview" },
  OFFER: { text: "text-offer", bg: "bg-offer-soft", dot: "bg-offer", label: "Offer" },
  REJECTED: { text: "text-rejected", bg: "bg-rejected-soft", dot: "bg-rejected", label: "Rejected" },
};

export const DIFFICULTY_ORDER = ["EASY", "MEDIUM", "HARD"];
export const STATUS_ORDER = ["WISHLIST", "APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"];

// Raw hex values for chart fills (Recharts sets `fill` as a plain SVG attribute,
// which does not reliably resolve CSS var() across browsers) — kept in sync
// with the --difficulty-*/--status-* custom properties in index.css.
export const DIFFICULTY_HEX = {
  EASY: "#16a34a",
  MEDIUM: "#d97706",
  HARD: "#e11d48",
};

export const STATUS_HEX = {
  WISHLIST: "#6b7280",
  APPLIED: "#2563eb",
  OA: "#0d9488",
  INTERVIEW: "#d97706",
  OFFER: "#059669",
  REJECTED: "#e11d48",
};

// Recharts sets these as raw SVG attributes; kept as plain hex (matching
// index.css --primary/--border/--muted-foreground) rather than var() for
// guaranteed cross-browser rendering inside SVG.
export const CHART_PRIMARY_HEX = "#4f46e5";
export const CHART_GRID_HEX = "#e5e7eb";
export const CHART_AXIS_HEX = "#6b7280";
