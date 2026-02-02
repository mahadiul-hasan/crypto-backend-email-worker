export function isPermanentError(err: any) {
  const msg = err?.message?.toLowerCase() || "";

  return (
    msg.includes("quota") ||
    msg.includes("limit") ||
    msg.includes("daily") ||
    msg.includes("blocked") ||
    msg.includes("spam") ||
    msg.includes("invalid login")
  );
}

export function isNetworkError(err: any) {
  const msg = err?.message?.toLowerCase() || "";

  return (
    msg.includes("timeout") ||
    msg.includes("connection") ||
    msg.includes("socket") ||
    msg.includes("econn") ||
    msg.includes("network")
  );
}
