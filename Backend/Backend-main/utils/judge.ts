import { request as httpsReq } from "node:https";
import { Buffer } from "node:buffer";

const JUDGE0_HOST = "ce.judge0.com";
const JUDGE0_PATH = "/submissions?wait=true&base64_encoded=false";

const LANG_CONFIG: Record<string, { id: number }> = {
  python:     { id: 71 },
  javascript: { id: 63 },
  cpp:        { id: 54 },
  java:       { id: 62 },
  c:          { id: 50 },
};

function preprocessCode(language: string, code: string): string {
  if (language === "java") {
    return code.replace(/public\s+class\s+\w+/g, "public class Main");
  }
  return code;
}

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
        rejectUnauthorized: false,
      },
      (res) => {
        let data = "";
        res.on("data",  (chunk: Buffer) => { data += chunk.toString(); });
        res.on("end",   () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
          catch { reject(new Error(`Non-JSON from Judge0: ${data.slice(0, 200)}`)); }
        });
        res.on("error", reject);
      },
    );
    const timer = setTimeout(() => { req.destroy(); reject(new Error("Judge0 timed out")); }, timeoutMs);
    req.on("close", () => clearTimeout(timer));
    req.on("error", (e) => { clearTimeout(timer); reject(e); });
    req.write(payload);
    req.end();
  });
}

export async function runCode(
  language: string,
  code: string,
  stdin: string,
): Promise<{ stdout: string; stderr: string; exitCode: number; statusDesc: string }> {
  const cfg = LANG_CONFIG[language];
  if (!cfg) throw new Error(`Unsupported language: ${language}`);

  const { status, body: result } = await judge0Post({
    source_code: preprocessCode(language, code),
    language_id: cfg.id,
    stdin:       stdin || "",
  });

  if (status !== 200 && status !== 201) {
    return { stdout: "", stderr: `Judge0 HTTP ${status}`, exitCode: 1, statusDesc: "Error" };
  }

  const stdout     = result.stdout        || "";
  const compileOut = result.compile_output || "";
  const stderr     = compileOut || result.stderr || "";
  const statusDesc = result.status?.description || "Unknown";
  const exitCode   = compileOut ? 1 : (result.exit_code ?? (statusDesc === "Accepted" ? 0 : 1));

  return { stdout, stderr, exitCode, statusDesc };
}

export interface TestResult {
  input:          string;
  expectedOutput: string;
  actualOutput:   string;
  passed:         boolean;
  stderr:         string;
}

export type SubmissionStatus = "accepted" | "wrong_answer" | "runtime_error" | "compile_error";

export async function judgeSubmission(
  language: string,
  code: string,
  testCases: Array<{ input: string; expectedOutput: string }>,
): Promise<{ status: SubmissionStatus; testResults: TestResult[] }> {
  const testResults: TestResult[] = [];

  for (const tc of testCases) {
    const { stdout, stderr, exitCode, statusDesc } = await runCode(language, code, tc.input);

    if (statusDesc === "Compilation Error") {
      testResults.push({
        input: tc.input, expectedOutput: tc.expectedOutput,
        actualOutput: "", passed: false, stderr,
      });
      return { status: "compile_error", testResults };
    }

    if (exitCode !== 0) {
      testResults.push({
        input: tc.input, expectedOutput: tc.expectedOutput,
        actualOutput: stdout.trim(), passed: false, stderr,
      });
      return { status: "runtime_error", testResults };
    }

    const actual   = stdout.trim();
    const expected = tc.expectedOutput.trim();
    const passed   = actual === expected;
    testResults.push({ input: tc.input, expectedOutput: expected, actualOutput: actual, passed, stderr });

    if (!passed) return { status: "wrong_answer", testResults };
  }

  return { status: "accepted", testResults };
}
