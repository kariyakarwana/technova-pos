/** Printed product labels contain a URL, while the lookup route needs only its token. */
export function productQrToken(value: string): string | null {
  const input = value.trim();
  if (!input) return null;

  if (/^(?:https?:\/\/|\/)/i.test(input)) {
    try {
      const url = new URL(input, "https://pos.nxcodeworks.com");
      const match = /^\/qr\/product\/([^/]+)\/?$/.exec(url.pathname);
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  }

  return /^[^\s/?#]+$/.test(input) ? input : null;
}
