const API_BASE_URL = "http://127.0.0.1:8000";

export function getProductImageUrl(image: string | null | undefined): string {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const normalized = image.trim().replace(/^\/+/, "");

  if (!normalized) return "";

  const mediaPath = normalized.startsWith("media/")
    ? `/${normalized}`
    : `/media/${normalized}`;

  return `${API_BASE_URL}${mediaPath}`;
}
