import { VISION_SYSTEM_PROMPT, buildUserText } from "./prompt";
import type { RawVisionPayload, VisionInput, VisionProvider } from "./types";

/**
 * Server-only. Nothing in this file may be imported from a client component:
 * it reads the API key from the process environment.
 */

const DEFAULT_MODEL = "claude-sonnet-5";
const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
/** A farmer on a slow connection should not wait behind a hung provider call. */
const REQUEST_TIMEOUT_MS = 30_000;

/** Turns a model id into something readable, e.g. claude-sonnet-5 -> Claude Sonnet 5. */
function prettyModelName(id: string): string {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}

/** Strips markdown fences some models wrap JSON in, then parses. */
function parseJsonBlock(text: string): RawVisionPayload {
  const cleaned = text.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON object in model response");
  return JSON.parse(cleaned.slice(start, end + 1)) as RawVisionPayload;
}

const anthropicProvider: VisionProvider = {
  id: "anthropic",
  label: "Anthropic vision",

  isConfigured() {
    return Boolean(process.env.VISION_API_KEY);
  },

  displayName() {
    return prettyModelName(process.env.VISION_MODEL || DEFAULT_MODEL);
  },

  async analyze(input: VisionInput): Promise<RawVisionPayload> {
    const apiKey = process.env.VISION_API_KEY;
    if (!apiKey) throw new Error("VISION_API_KEY is not set");

    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), REQUEST_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(ANTHROPIC_ENDPOINT, {
      signal: abort.signal,
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.VISION_MODEL || DEFAULT_MODEL,
        max_tokens: 1024,
        system: VISION_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: input.mediaType, data: input.imageBase64 } },
              { type: "text", text: buildUserText(input) },
            ],
          },
        ],
      }),
    });

    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw new Error(`Provider timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      // Status and provider message only. The key and the image never reach a log.
      const detail = await res.text().catch(() => "");
      throw new Error(`Provider responded ${res.status}: ${detail.slice(0, 300)}`);
    }

    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (data.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("\n");

    if (!text.trim()) throw new Error("Provider returned no text content");
    return parseJsonBlock(text);
  },
};

const PROVIDERS: Record<string, VisionProvider> = {
  anthropic: anthropicProvider,
};

/**
 * Resolves the configured provider. Add an entry to PROVIDERS and set VISION_PROVIDER
 * to swap implementations. Nothing above this file knows which one is in use.
 */
export function getVisionProvider(): VisionProvider {
  const id = process.env.VISION_PROVIDER || "anthropic";
  const provider = PROVIDERS[id];
  if (!provider) throw new Error(`Unknown VISION_PROVIDER: ${id}`);
  return provider;
}
