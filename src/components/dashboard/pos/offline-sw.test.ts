import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

type FetchEvent = {
  request: { method: string; mode: string; url: string };
  respondWith: (response: Promise<Response>) => void;
};

function loadWorker(fetcher: typeof fetch, cachedPage?: Response) {
  const listeners = new Map<string, (event: FetchEvent) => void>();
  const match = vi.fn(async () => cachedPage);
  const put = vi.fn(async () => undefined);
  const caches = { open: vi.fn(async () => ({ match, put })) };
  const self = {
    location: { origin: "https://pos.example.com" },
    addEventListener: (name: string, callback: (event: FetchEvent) => void) =>
      listeners.set(name, callback),
  };
  const source = readFileSync(new URL("../../../../public/offline-sw.js", import.meta.url), "utf8");
  runInNewContext(source, { self, caches, fetch: fetcher, URL, Request, Response, Set, Promise });
  return { onFetch: listeners.get("fetch")!, match, put };
}

describe("offline service worker", () => {
  it("serves the saved POS document when the network is unavailable", async () => {
    const cached = new Response("cached POS", { headers: { "content-type": "text/html" } });
    const worker = loadWorker(vi.fn(async () => { throw new Error("offline"); }), cached);
    let answer: Promise<Response> | undefined;
    worker.onFetch({
      request: { method: "GET", mode: "navigate", url: "https://pos.example.com/pos" },
      respondWith: (response) => { answer = response; },
    });
    expect(await answer?.then((response) => response.text())).toBe("cached POS");
    expect(worker.match).toHaveBeenCalledWith("/pos");
  });

  it("never intercepts backend requests", () => {
    const worker = loadWorker(vi.fn());
    const respondWith = vi.fn();
    worker.onFetch({
      request: { method: "GET", mode: "cors", url: "https://pos.example.com/api/backend/sales" },
      respondWith,
    });
    expect(respondWith).not.toHaveBeenCalled();
  });

  it("shows a useful fallback for an uncached server-backed screen", async () => {
    const worker = loadWorker(vi.fn(async () => { throw new Error("offline"); }));
    let answer: Promise<Response> | undefined;
    worker.onFetch({
      request: { method: "GET", mode: "navigate", url: "https://pos.example.com/reports" },
      respondWith: (response) => { answer = response; },
    });
    const response = await answer;
    expect(response?.status).toBe(503);
    expect(await response?.text()).toContain('href="/pos"');
  });
});
