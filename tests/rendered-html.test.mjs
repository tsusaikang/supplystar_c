import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the SupplyStar business catalog", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>서플라이스타 \| 기업 맞춤 상품·서비스<\/title>/i);
  assert.match(html, /PRODUCT CATALOG/);
  assert.match(html, /리콜라 레몬민트 허브캔디/);
  assert.match(html, /문의목록/);
  assert.match(html, /오프라인 계약/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("keeps product content in the replaceable catalog file", async () => {
  const catalog = JSON.parse(
    await readFile(new URL("../content/catalog.json", import.meta.url), "utf8"),
  );

  assert.ok(catalog.products.length >= 12);
  assert.ok(catalog.categories.some((category) => category.id === "it"));
  assert.equal(new Set(catalog.products.map((product) => product.id)).size, catalog.products.length);
  assert.ok(catalog.products.every((product) => "image" in product));
});
