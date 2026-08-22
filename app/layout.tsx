import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const incomingHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "supplystar.co.kr";
  const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(incomingHost) ? incomingHost : "supplystar.co.kr";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const title = "서플라이스타 | 기업 맞춤 상품·서비스";
  const description = "오피스 간식, 사무용품, IT 장비 렌탈, 차량 서비스까지. 상품을 둘러보고 문의목록에 담아 기업 맞춤 견적을 받아보세요.";

  return {
    metadataBase,
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: "SUPPLYSTAR",
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "서플라이스타 기업 맞춤 상품·서비스" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
