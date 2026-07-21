"use client";

import { useEffect, useState } from "react";

const heroSlides = [
  { src: "/assets/hero-1.png", alt: "식음료 및 구매대행 정기배송 서비스" },
  { src: "/assets/hero-2.png", alt: "IT 장비 월 단위 렌탈 서비스" },
  { src: "/assets/hero-3.png", alt: "차량 및 수행기사 서비스" },
];

const products = {
  snack: [
    ["🍋", "리콜라 레몬민트 허브캔디 (342g × 2개)", "24,700원"],
    ["🍑", "[Dole] 다이스 복숭아 과일 컵 113g × 16컵", "18,400원"],
    ["🍫", "로아커 웨하스 미니 믹스 800g (80개입)", "25,500원"],
    ["🍪", "타타와 초코/애플쿠키 60개입 × 2", "20,000원"],
    ["🥜", "코어틴 프로틴볼 단백질 초코볼 20g × 20입", "22,200원"],
  ],
  drink: [
    ["🥤", "레드불 에너지 드링크 250ml (24개)", "37,200원"],
    ["💧", "라인바싸 탄산수 (40개)", "19,500원"],
    ["⚡", "핫식스 250ml (30캔)", "24,800원"],
    ["🧃", "덴마크 테이크 얼라이브 120ml (24개)", "12,400원"],
    ["🥤", "레드불 슈가프리 250ml (24캔)", "35,200원"],
  ],
  office: [
    ["🖊️", "[모나미] 네임펜M 12개입", "12,500원"],
    ["📁", "[문화산업] 클리어화일 케이스", "1,800원"],
    ["📎", "[3M] 다용도 테이프 12mm × 20m", "1,900원"],
    ["✂️", "종이나라 나라풀 8g/15g/25g/35g", "650원"],
    ["📒", "오피스 데일리 노트 세트", "8,900원"],
  ],
  it: [
    ["💻", "[레노버] Thinkpad T14s Gen4", "견적문의"],
    ["💻", "[레노버] Thinkbook 15 Gen5", "견적문의"],
    ["🖥️", "[레노버] Thinkbook 16 Gen6", "견적문의"],
    ["⌨️", "업무용 주변기기 렌탈 패키지", "견적문의"],
    ["🖨️", "오피스 복합기 렌탈", "견적문의"],
  ],
} as const;

type ProductKey = keyof typeof products;

const tabs: { key: ProductKey; label: string }[] = [
  { key: "snack", label: "간식" },
  { key: "drink", label: "음료" },
  { key: "office", label: "사무용품" },
  { key: "it", label: "IT 장비" },
];

const newProducts = [
  ["🧄", "티벳 프리미엄 100% 대왕란 통 흑마늘", "31,000원"],
  ["🥛", "16온스 아이스컵 세트", "20,000원"],
  ["💙", "[동아오츠카] 포카리스웨트 500ml × 20PET", "26,000원"],
  ["🍑", "[Dole] 다이스 복숭아 과일 컵 113g × 16컵", "18,400원"],
  ["🧀", "Sweetory 치즈 쿠키 1.2kg", "24,000원"],
];

function ProductCard({ item }: { item: readonly [string, string, string] }) {
  return (
    <article className="product-card">
      <div className="product-visual" aria-hidden="true">
        <span>{item[0]}</span>
        <i>SUPPLYSTAR</i>
      </div>
      <button className="wish" aria-label={`${item[1]} 관심상품 추가`}>♡</button>
      <h3>{item[1]}</h3>
      <p>{item[2]}</p>
    </article>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<ProductKey>("snack");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % heroSlides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>기업 맞춤 원스톱 구매 서비스</span>
          <nav aria-label="회원 메뉴">
            <a href="#contact">회원가입</a><a href="#contact">로그인</a>
            <a href="#contact">주문조회</a><a href="#contact">고객센터</a>
          </nav>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="서플라이스타 홈">
            <span className="brand-mark">★</span>
            <span><b>SUPPLY</b>STAR<small>한 번에, 필요한 모든 것</small></span>
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="메뉴 열기">☰</button>
          <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="주요 메뉴">
            <a href="#best">제품&amp;서비스</a><a href="#best">IT 장비</a>
            <a href="#service">자수서비스</a><a href="#service">차량서비스</a>
            <a href="#best">안전용품</a><a href="#contact">개인결제</a>
            <a href="#contact">고객센터</a>
          </nav>
          <div className="header-tools"><button aria-label="검색">⌕</button><button aria-label="장바구니">▢<sup>0</sup></button></div>
        </div>
      </header>

      <section className="hero" id="top" aria-label="주요 서비스 안내">
        <div className="hero-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {heroSlides.map((item) => <img key={item.src} src={item.src} alt={item.alt} />)}
        </div>
        <button className="hero-arrow prev" onClick={() => setSlide((slide + 2) % 3)} aria-label="이전 배너">‹</button>
        <button className="hero-arrow next" onClick={() => setSlide((slide + 1) % 3)} aria-label="다음 배너">›</button>
        <div className="hero-dots">
          {heroSlides.map((_, i) => <button key={i} className={i === slide ? "active" : ""} onClick={() => setSlide(i)} aria-label={`${i + 1}번 배너`} />)}
        </div>
      </section>

      <section className="section shell" id="best">
        <div className="section-heading"><span>Best Item</span><h2>서플라이스타의 베스트 아이템</h2></div>
        <div className="tabs" role="tablist">
          {tabs.map((item) => <button key={item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)} role="tab" aria-selected={tab === item.key}>{item.label}</button>)}
        </div>
        <div className="product-grid">{products[tab].map((item) => <ProductCard key={item[1]} item={item} />)}</div>
      </section>

      <section className="service-section" id="service">
        <div className="shell">
          <div className="section-heading light"><span>Our Service</span><h2>서플라이스타만의 맞춤 서비스를 경험해보세요</h2></div>
          <div className="service-grid">
            <a className="service-card snacks" href="#contact"><small>01</small><h3>직원들을 위한<br />간식복지</h3><span>자세히 살펴보기 →</span></a>
            <a className="service-card rentals" href="#contact"><small>02</small><h3>IT 장비<br />렌탈 서비스</h3><span>자세히 살펴보기 →</span></a>
            <a className="service-card uniforms" href="#contact"><small>03</small><h3>판촉물 · 단체 유니폼<br />맞춤제작</h3><span>자세히 살펴보기 →</span></a>
            <a className="service-card drivers" href="#contact"><small>04</small><h3>언제 어디든지<br />차량서비스</h3><span>자세히 살펴보기 →</span></a>
          </div>
        </div>
      </section>

      <section className="shipping">
        <div className="shell shipping-inner"><div className="shipping-icon">▣</div><div><span>배송 안내</span><p>주문하신 상품은 보통 익일 출고되며 물류와 택배사 상황에 따라 영업일 기준 1~4일가량 소요될 수 있습니다.</p><p>여러 상품 주문 시 재고 준비 상황에 따라 개별 배송될 수 있습니다.</p></div><a href="#contact">더보기 +</a></div>
      </section>

      <section className="section shell">
        <div className="section-heading"><span>New Product</span><h2>서플라이스타의 신상품들을 만나보세요!</h2></div>
        <div className="product-grid">{newProducts.map((item) => <ProductCard key={item[1]} item={item} />)}</div>
      </section>

      <section className="weekly">
        <div className="shell weekly-inner">
          <div><span>Weekly Highlight</span><h2>이번 주 핫하게<br />뜨고 있는 제품</h2><p>업무 공간에 필요한 인기 품목을<br />합리적인 구성으로 만나보세요.</p><a href="#best">제품 둘러보기 →</a></div>
          <div className="weekly-boxes"><div>OFFICE<br /><b>SNACK</b></div><div>SMART<br /><b>RENTAL</b></div><div>BUSINESS<br /><b>CARE</b></div></div>
        </div>
      </section>

      <section className="notice shell"><strong>SupplyStar</strong><p>전 제품은 부가세 포함 가격입니다. 상품의 가격 및 사양은 제조사의 사정에 따라 달라질 수 있습니다.</p></section>

      <footer id="contact">
        <div className="shell footer-grid">
          <div className="footer-brand"><span>★</span><b>SUPPLYSTAR</b><p>기업 운영에 필요한 상품과 서비스를<br />한 번에 연결합니다.</p></div>
          <div><h3>고객센터</h3><strong>02-6925-1054</strong><p>평일 09:00–18:00<br />점심 12:00–13:00<br />주말·공휴일 휴무</p></div>
          <div><h3>회사정보</h3><p>상호명 (주)서플라이스타<br />대표자 김진솔<br />서울특별시 영등포구 국회대로 800<br />이메일 supplystar@supplystar.co.kr</p></div>
          <div><h3>바로가기</h3><p><a href="#best">제품&amp;서비스</a><br /><a href="#service">맞춤 서비스</a><br /><a href="#contact">이용안내</a><br /><a href="#contact">개인정보처리방침</a></p></div>
        </div>
        <div className="copyright shell">COPYRIGHT © SUPPLYSTAR. ALL RIGHTS RESERVED.</div>
      </footer>
    </main>
  );
}
