import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "서플라이스타 | 기업 맞춤 원스톱 구매 서비스",
  description: "식음료 정기배송, 사무용품, IT 장비 렌탈, 차량서비스까지 기업 운영에 필요한 모든 것을 한 번에 제공합니다.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
