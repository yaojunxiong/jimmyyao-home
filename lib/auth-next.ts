const allowedHosts = new Set([
  "jimmyyao.com",
  "www.jimmyyao.com",
  "study.jimmyyao.com",
  "forum.jimmyyao.com"
]);

function fallbackOrigin() {
  return process.env.AUTH_URL || "https://www.jimmyyao.com";
}

export function safeNextUrl(value: string | null | undefined, origin = fallbackOrigin()) {
  if (!value) {
    return origin;
  }

  try {
    const base = new URL(origin);
    const url = new URL(value, base);
    const isHttp = url.protocol === "https:";

    if (!isHttp || !allowedHosts.has(url.hostname)) {
      return origin;
    }

    return url.toString();
  } catch {
    return origin;
  }
}
