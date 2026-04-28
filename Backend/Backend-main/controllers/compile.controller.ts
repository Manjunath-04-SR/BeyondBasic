import type { Request, Response } from "express";
import { request as httpsReq } from "node:https";
import { Buffer } from "node:buffer";

// ─── Judge0 CE — free, no API key ─────────────────────────────────────────────
const JUDGE0_HOST = "ce.judge0.com";
const JUDGE0_PATH = "/submissions?wait=true&base64_encoded=false";

const LANG_CONFIG: Record<string, { id: number; label: string }> = {
  python:     { id: 71, label: "Python 3"          },
  javascript: { id: 63, label: "JavaScript (Node)"  },
  cpp:        { id: 54, label: "C++ (GCC)"           },
  java:       { id: 62, label: "Java (OpenJDK)"      },
};

// ─── Pre-process: Judge0 Java requires public class named "Main" ──────────────
function preprocessCode(language: string, code: string): string {
  if (language === "java") {
    return code.replace(/public\s+class\s+\w+/g, "public class Main");
  }
  return code;
}

// ─── HTTPS helper — bypasses SSL cert issues (corporate proxies, etc.) ────────
function judge0Post(body: object, timeoutMs = 30_000): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);

    const req = httpsReq(
      {
        hostname: JUDGE0_HOST,
        path:     JUDGE0_PATH,
        method:   "POST",
        headers: {
          "Content-Type":   "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        rejectUnauthorized: false, // bypass corporate SSL inspection proxies
      },
      (res) => {
        let data = "";
        res.on("data",  (chunk: Buffer) => { data += chunk.toString(); });
        res.on("end",   () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            reject(new Error(`Non-JSON response from Judge0: ${data.slice(0, 100)}`));
          }
        });
        res.on("error", reject);
      },
    );

    const timer = setTimeout(() => {
      req.destroy();
      reject(new Error("Request timed out after 30s"));
    }, timeoutMs);

    req.on("close", () => clearTimeout(timer));
    req.on("error", (err) => { clearTimeout(timer); reject(err); });

    req.write(payload);
    req.end();
  });
}

// ─── Compile handler ──────────────────────────────────────────────────────────
export const compileCode = async (req: Request, res: Response) => {
  const { language, code, stdin = "" } = req.body;

  if (!language || !code) {
    return res.status(400).json({ message: "language and code are required" });
  }

  const cfg = LANG_CONFIG[language as string];
  if (!cfg) {
    return res.status(400).json({
      message: `Unsupported language: ${language}. Use: python, javascript, cpp, java`,
    });
  }

  const processedCode = preprocessCode(language, code);
  console.log(`🔧 Compiling ${cfg.label} via Judge0 CE`);

  try {
    const { status, body: result } = await judge0Post({
      source_code: processedCode,
      language_id: cfg.id,
      stdin:       stdin || "",
    });

    if (status !== 201 && status !== 200) {
      console.error(`Judge0 returned HTTP ${status}:`, result);
      return res.json({
        stdout: "", stderr: `Compiler service returned HTTP ${status}. Try again.`, exitCode: 1,
      });
    }

    const stdout        = result.stdout        || "";
    const stderr        = result.stderr        || "";
    const compileOutput = result.compile_output || "";
    const statusDesc    = result.status?.description || "Unknown";
    const exitCode      = compileOutput
      ? 1
      : (result.exit_code ?? (statusDesc === "Accepted" ? 0 : 1));

    console.log(`✅ ${cfg.label} — ${statusDesc}`);

    return res.json({
      stdout,
      stderr:   compileOutput || stderr,
      exitCode,
      status:   statusDesc,
      time:     result.time,
      memory:   result.memory,
    });
  } catch (err: any) {
    const msg = err.message || "unknown";
    console.error("Compile error:", msg);

    return res.json({
      stdout:   "",
      stderr:   msg.includes("timed out")
        ? "⏱ Execution timed out (30s). Check for infinite loops."
        : `❌ Compiler error: ${msg}`,
      exitCode: 1,
      status:   "Error",
    });
  }
};
