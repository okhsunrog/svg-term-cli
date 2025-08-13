import { test, expect } from "bun:test";
import { DOMParser } from "@xmldom/xmldom";
import pkg from "../package.json" assert { type: "json" };

const parser = new DOMParser();

type RunResult = { code: number; stdout: string; stderr: string };

async function runCli(args: string[] = [], input: string = ""): Promise<RunResult> {
  const proc = Bun.spawn({
    cmd: ["bun", "run", "src/cli.ts", ...args],
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
    env: process.env as Record<string, string>,
  });

  if (input !== "") {
    await proc.stdin.write(new TextEncoder().encode(input));
  }
  proc.stdin.end();

  await proc.exited;
  const code = proc.exitCode;
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  return { code, stdout, stderr };
}

test("prints help with non-zero exit code", async () => {
  const result = await runCli([], "");
  expect(result.code).not.toBe(0);
  expect(result.stderr).toContain(
    "svg-term: either stdin, --cast, --command or --in are required"
  );
});

test("prints help with zero exit code for --help", async () => {
  const result = await runCli(["--help"], "");
  expect(result.code).toBe(0);
  expect(result.stdout).toContain("Share terminal sessions as razor-sharp animated SVG everywhere");
});

test("prints version with zero exit code for --version", async () => {
  const result = await runCli(["--version"], "");
  expect(result.code).toBe(0);
  expect(result.stdout.trim()).toBe(pkg.version);
});

test("works for minimal stdin input", async () => {
  const result = await runCli([], '[{"version": 2, "width": 1, "height": 1}, [1, "o", "foo"]]');
  expect(result.code).toBe(0);
});

test("is silent on stderr for minimal stdin input", async () => {
  const result = await runCli([], '[{"version": 2, "width": 1, "height": 1}, [1, "o", "foo"]]');
  expect(result.stderr).toBe("");
  expect(result.code).toBe(0);
});

test("emits svg for minimal stdin input", async () => {
  const result = await runCli([], '[{"version": 2, "width": 1, "height": 1}, [1, "o", "foo"]]');
  const doc = parser.parseFromString(result.stdout, 'image/svg+xml');
  expect(doc.documentElement.tagName).toBe('svg');
});

test("fails for faulty stdin input", async () => {
  const result = await runCli([], '{}');
  expect(result.code).toBe(1);
});

test("emits error on stderr for faulty stdin input", async () => {
  const result = await runCli([], '{}');
  expect(result.stderr).toContain("only asciicast v1 and v2 formats can be opened");
});

test("is silent on stdout for faulty stdin input", async () => {
  const result = await runCli([], '{}');
  expect(result.stdout).toBe("");
});