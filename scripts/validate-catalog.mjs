import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const catalogPath = resolve(projectRoot, "content/catalog.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));

assert.ok(Array.isArray(catalog.categories) && catalog.categories.length > 1, "카테고리가 필요합니다.");
assert.ok(Array.isArray(catalog.products) && catalog.products.length > 0, "상품이 한 개 이상 필요합니다.");

const categoryIds = new Set(catalog.categories.map((category) => category.id));
const productIds = new Set();

for (const product of catalog.products) {
  assert.match(product.id, /^[a-z0-9][a-z0-9-]*$/, `잘못된 상품 ID: ${product.id}`);
  assert.ok(!productIds.has(product.id), `중복 상품 ID: ${product.id}`);
  productIds.add(product.id);
  assert.ok(product.name?.trim(), `${product.id}: 상품명이 필요합니다.`);
  assert.ok(product.brand?.trim(), `${product.id}: 브랜드명이 필요합니다.`);
  assert.ok(categoryIds.has(product.category), `${product.id}: 존재하지 않는 카테고리입니다.`);
  assert.ok(product.price === null || (Number.isInteger(product.price) && product.price >= 0), `${product.id}: 가격은 0 이상의 정수 또는 null이어야 합니다.`);
  assert.ok(product.description?.trim(), `${product.id}: 설명이 필요합니다.`);

  if (product.image) {
    assert.ok(product.image.startsWith("/"), `${product.id}: 이미지 경로는 /로 시작해야 합니다.`);
    await access(resolve(projectRoot, `public${product.image}`));
  }
}

console.log(`카탈로그 검증 완료: ${catalog.products.length}개 상품, ${catalog.categories.length - 1}개 분류`);
