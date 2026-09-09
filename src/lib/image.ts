/**
 * A blob: object URL from URL.createObjectURL is scoped to the document that made it.
 * Cases are persisted to localStorage, so a saved blob: URL is dead the moment the page
 * reloads and the report thumbnail renders as an empty grey box.
 *
 * This downscales the uploaded photo to a small JPEG data URL, which survives persistence.
 * 320px at quality 0.72 lands around 15-30 KB, so a realistic number of saved reports stays
 * well inside the ~5 MB localStorage budget.
 */

const MAX_EDGE = 320;
const QUALITY = 0.72;

export function toStoredImage(file: File, maxEdge = MAX_EDGE): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context unavailable");

        // White matte so transparent PNGs do not become black squares once flattened to JPEG.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode the selected image"));
    };

    img.src = url;
  });
}
