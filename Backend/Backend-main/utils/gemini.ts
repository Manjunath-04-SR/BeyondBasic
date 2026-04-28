import https from "https";

export function geminiRequest(
  apiKey: string,
  model: string,
  payload: object,
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(payload);
    const options: https.RequestOptions = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: "POST",
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      },
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf-8") }));
    });

    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

export function extractGeminiText(data: any): string | null {
  const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
  // thinking models prepend parts with { "thought": true } — skip them
  const textParts = parts.filter((p: any) => !p.thought && typeof p.text === "string");
  if (textParts.length === 0) return null;
  return textParts.map((p: any) => p.text).join("");
}
