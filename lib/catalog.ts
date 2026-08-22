import catalogData from "@/content/catalog.json";

export type CatalogCategoryId = "all" | "snack" | "drink" | "office" | "it";

export type CatalogProduct = {
  id: string;
  name: string;
  brand: string;
  category: Exclude<CatalogCategoryId, "all">;
  price: number | null;
  unit: string;
  badge: string | null;
  description: string;
  image: string | null;
  tone: string;
  featured: boolean;
  isNew: boolean;
};

export type CatalogData = {
  updatedAt: string;
  taxNote: string;
  categories: { id: CatalogCategoryId; label: string }[];
  products: CatalogProduct[];
};

export const catalog = catalogData as CatalogData;

export const categoryLabels = Object.fromEntries(
  catalog.categories.map((category) => [category.id, category.label]),
) as Record<CatalogCategoryId, string>;

export function formatPrice(price: number | null) {
  return price === null ? "견적 문의" : `${price.toLocaleString("ko-KR")}원`;
}
