/** Appends prefilled message to a WhatsApp URL (handles wa.me and URLs that already have query params). */
export function buildWhatsappChatUrl(baseUrl: string, prefilledMessage: string): string {
  const text = encodeURIComponent(prefilledMessage);
  const trimmed = baseUrl.trim();
  if (trimmed.includes('text=')) return trimmed;
  return trimmed.includes('?') ? `${trimmed}&text=${text}` : `${trimmed}?text=${text}`;
}
