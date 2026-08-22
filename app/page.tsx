"use client";

import { useEffect, useMemo, useState } from "react";
import {
  catalog,
  categoryLabels,
  formatPrice,
  type CatalogCategoryId,
  type CatalogProduct,
} from "@/lib/catalog";

const heroSlides = [
  { src: "/assets/hero-1.png", alt: "식음료 및 구매대행 정기배송 서비스" },
  { src: "/assets/hero-2.png", alt: "IT 장비 월 단위 렌탈 서비스" },
  { src: "/assets/hero-3.png", alt: "차량 및 수행기사 서비스" },
];

type SortOption = "featured" | "new" | "price-low" | "price-high";

function ProductVisual({ product }: { product: CatalogProduct }) {
  if (product.image) {
    // vinext의 현재 이미지 최적화 경로 대신 Sites 정적 자산을 직접 사용합니다.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="product-image" src={product.image} alt={`${product.name} 상품 사진`} />;
  }

  return (
    <div className="product-fallback" data-tone={product.tone} aria-label={`${product.name} 이미지 준비중`}>
      <span>{categoryLabels[product.category]}</span>
      <strong>{product.brand}</strong>
      <small>SUPPLYSTAR SELECT</small>
    </div>
  );
}

function ProductCard({
  product,
  inBasket,
  onSelect,
  onToggleBasket,
}: {
  product: CatalogProduct;
  inBasket: boolean;
  onSelect: () => void;
  onToggleBasket: () => void;
}) {
  return (
    <article className="product-card">
      <button className="product-visual" onClick={onSelect} aria-label={`${product.name} 자세히 보기`}>
        <ProductVisual product={product} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <span className="product-quick">상품 보기</span>
      </button>
      <div className="product-copy">
        <p className="product-brand">{product.brand}</p>
        <button className="product-name" onClick={onSelect}>{product.name}</button>
        <p className="product-unit">{product.unit}</p>
        <div className="product-bottom">
          <strong>{formatPrice(product.price)}</strong>
          <button
            className={`basket-add ${inBasket ? "selected" : ""}`}
            onClick={onToggleBasket}
            aria-label={inBasket ? `${product.name} 문의목록에서 빼기` : `${product.name} 문의목록에 담기`}
          >
            {inBasket ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [category, setCategory] = useState<CatalogCategoryId>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [menuOpen, setMenuOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
  const [basket, setBasket] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % heroSlides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem("supplystar-inquiry-list");
        if (saved) setBasket(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem("supplystar-inquiry-list");
      } finally {
        setStorageReady(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (storageReady) {
      window.localStorage.setItem("supplystar-inquiry-list", JSON.stringify(basket));
    }
  }, [basket, storageReady]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
        setBasketOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("ko-KR");
    const result = catalog.products.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const queryMatch = !keyword || [product.name, product.brand, product.description, product.unit]
        .join(" ")
        .toLocaleLowerCase("ko-KR")
        .includes(keyword);
      return categoryMatch && queryMatch;
    });

    return [...result].sort((a, b) => {
      if (sort === "new") return Number(b.isNew) - Number(a.isNew);
      if (sort === "price-low") return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      if (sort === "price-high") return (b.price ?? -1) - (a.price ?? -1);
      return Number(b.featured) - Number(a.featured);
    });
  }, [category, query, sort]);

  const basketProducts = basket
    .map((id) => catalog.products.find((product) => product.id === id))
    .filter((product): product is CatalogProduct => Boolean(product));

  const toggleBasket = (productId: string) => {
    setBasket((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
    setCopyStatus("");
  };

  const copyInquiryList = async () => {
    const lines = [
      "[서플라이스타 상품 문의]",
      ...basketProducts.map((product, index) => `${index + 1}. ${product.name} / ${product.unit} / ${formatPrice(product.price)}`),
      "",
      "희망 수량과 납품 일정을 함께 전달해 주세요.",
    ];

    try {
      await window.navigator.clipboard.writeText(lines.join("\n"));
      setCopyStatus("문의 목록을 복사했습니다.");
    } catch {
      setCopyStatus("복사할 수 없습니다. 상품명을 직접 전달해 주세요.");
    }
  };

  return (
    <main>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>B2B BUSINESS SUPPLY · 기업 맞춤 상품 카탈로그</span>
          <nav aria-label="고객 지원 메뉴">
            <a href="#process">이용안내</a>
            <a href="#contact">고객센터</a>
          </nav>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="서플라이스타 홈">
            <span className="brand-mark">★</span>
            <span className="brand-type"><b>SUPPLY</b>STAR<small>한 번에, 필요한 모든 것</small></span>
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="메뉴 열기"
          >
            <i /> <i /> <i />
          </button>
          <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="주요 메뉴">
            <a href="#catalog" onClick={() => setMenuOpen(false)}>상품</a>
            <a href="#service" onClick={() => setMenuOpen(false)}>서비스</a>
            <a href="#process" onClick={() => setMenuOpen(false)}>구매 안내</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>상담 문의</a>
          </nav>
          <button className="header-search" onClick={() => document.querySelector<HTMLInputElement>("#catalog-search")?.focus()}>
            <span>상품 검색</span><b>⌕</b>
          </button>
          <button className="basket-button" onClick={() => setBasketOpen(true)} aria-label={`문의목록 ${basket.length}개 열기`}>
            <span>문의목록</span><b>{basket.length}</b>
          </button>
        </div>
      </header>

      <section className="hero" id="top" aria-label="주요 서비스 안내">
        <div className="hero-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {heroSlides.map((item) => (
            // vinext의 현재 이미지 최적화 경로 대신 Sites 정적 자산을 직접 사용합니다.
            // eslint-disable-next-line @next/next/no-img-element
            <img key={item.src} src={item.src} alt={item.alt} />
          ))}
        </div>
        <button className="hero-arrow prev" onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)} aria-label="이전 배너">‹</button>
        <button className="hero-arrow next" onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="다음 배너">›</button>
        <div className="hero-control shell">
          <strong>0{slide + 1}</strong>
          <div className="hero-dots">
            {heroSlides.map((_, index) => (
              <button key={index} className={index === slide ? "active" : ""} onClick={() => setSlide(index)} aria-label={`${index + 1}번 배너`} />
            ))}
          </div>
          <span>0{heroSlides.length}</span>
        </div>
      </section>

      <section className="promise-bar" aria-label="서플라이스타 이용 장점">
        <div className="shell promise-grid">
          <div><b>01</b><p><strong>기업 맞춤 견적</strong><span>수량과 조건에 맞춘 제안</span></p></div>
          <div><b>02</b><p><strong>정기·일괄 납품</strong><span>반복 구매를 더 간편하게</span></p></div>
          <div><b>03</b><p><strong>세금계산서 지원</strong><span>기업 구매에 맞춘 정산</span></p></div>
          <div><b>04</b><p><strong>전담 상담</strong><span>상품부터 배송까지 한 번에</span></p></div>
        </div>
      </section>

      <section className="catalog-section shell" id="catalog">
        <div className="section-intro catalog-intro">
          <div><span>PRODUCT CATALOG</span><h1>업무에 필요한 상품을<br />한곳에서 확인하세요.</h1></div>
          <p>온라인 결제 없이도 쇼핑몰처럼 상품을 둘러보고 문의목록에 담을 수 있습니다.<br />희망 수량과 일정은 담당자 상담 후 최종 견적으로 안내합니다.</p>
        </div>

        <div className="catalog-tools">
          <div className="category-tabs" role="tablist" aria-label="상품 분류">
            {catalog.categories.map((item) => (
              <button
                key={item.id}
                className={category === item.id ? "active" : ""}
                onClick={() => setCategory(item.id)}
                role="tab"
                aria-selected={category === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="catalog-actions">
            <label className="catalog-search" htmlFor="catalog-search">
              <span>⌕</span>
              <input id="catalog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="상품명 또는 브랜드 검색" />
            </label>
            <label className="sort-select">
              <span className="sr-only">정렬 방식</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
                <option value="featured">추천순</option>
                <option value="new">신상품순</option>
                <option value="price-low">낮은 가격순</option>
                <option value="price-high">높은 가격순</option>
              </select>
            </label>
          </div>
        </div>

        <div className="catalog-result"><b>{filteredProducts.length}</b>개의 상품</div>
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                inBasket={basket.includes(product.id)}
                onSelect={() => setSelectedProduct(product)}
                onToggleBasket={() => toggleBasket(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-result"><strong>검색 결과가 없습니다.</strong><p>다른 상품명이나 브랜드로 검색해 보세요.</p></div>
        )}
        <p className="catalog-note">{catalog.taxNote}</p>
      </section>

      <section className="service-section" id="service">
        <div className="shell">
          <div className="section-intro service-intro">
            <div><span>OUR SERVICE</span><h2>구매 업무의 번거로움까지<br />함께 줄여드립니다.</h2></div>
            <p>단순 상품 공급을 넘어 기업 운영에 필요한 조달과 서비스를<br />한 담당자를 통해 유연하게 연결합니다.</p>
          </div>
          <div className="service-grid">
            <article className="service-card image-card snacks"><small>01</small><div><h3>오피스 간식<br />정기배송</h3><p>인원과 예산에 맞춘 구성부터 정기 보충까지</p></div></article>
            <article className="service-card image-card rentals"><small>02</small><div><h3>IT 장비<br />기업 렌탈</h3><p>도입 수량과 기간에 맞춘 월 단위 렌탈</p></div></article>
            <article className="service-card graphic-card"><small>03</small><div className="service-symbol">SS</div><div><h3>판촉물 · 유니폼<br />맞춤 제작</h3><p>목적과 수량을 반영한 제작 상담</p></div></article>
            <article className="service-card image-card drivers"><small>04</small><div><h3>차량 · 수행기사<br />비즈니스 지원</h3><p>중요한 일정에 맞춘 유연한 차량 서비스</p></div></article>
          </div>
        </div>
      </section>

      <section className="process-section shell" id="process">
        <div className="section-intro">
          <div><span>HOW IT WORKS</span><h2>상품 선택부터 납품까지<br />간단한 네 단계</h2></div>
          <p>웹사이트에서는 상품을 고르고, 실제 거래 조건은 담당자가 확인합니다.<br />온라인 결제 없이 기업별 구매 절차에 맞춰 진행합니다.</p>
        </div>
        <ol className="process-list">
          <li><b>01</b><strong>상품 둘러보기</strong><span>분류와 검색으로 필요한 상품을 찾습니다.</span></li>
          <li><b>02</b><strong>문의목록 담기</strong><span>관심 상품을 장바구니처럼 한곳에 모읍니다.</span></li>
          <li><b>03</b><strong>조건 상담</strong><span>수량, 일정, 정산 조건을 담당자와 확인합니다.</span></li>
          <li><b>04</b><strong>계약 및 납품</strong><span>확정 견적에 따라 오프라인 거래로 진행합니다.</span></li>
        </ol>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-inner">
          <div><span>BUSINESS INQUIRY</span><h2>필요한 상품과 조건을<br />편하게 알려주세요.</h2></div>
          <div className="contact-card">
            <p>기업 구매 · 정기배송 · 렌탈 상담</p>
            <a className="phone-link" href="tel:02-6925-1054">02-6925-1054</a>
            <a className="mail-link" href="mailto:supplystar@supplystar.co.kr">supplystar@supplystar.co.kr ↗</a>
            <small>평일 09:00–18:00 · 점심 12:00–13:00</small>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-main">
          <div className="footer-brand">
            <span className="brand-mark">★</span><b>SUPPLYSTAR</b>
            <p>기업 운영에 필요한 상품과 서비스를<br />한 번에 연결합니다.</p>
          </div>
          <div><h3>회사정보</h3><p>상호명 (주)서플라이스타<br />대표자 김진솔<br />서울특별시 영등포구 국회대로 800</p></div>
          <div><h3>고객지원</h3><p><a href="tel:02-6925-1054">02-6925-1054</a><br /><a href="mailto:supplystar@supplystar.co.kr">supplystar@supplystar.co.kr</a><br />평일 09:00–18:00</p></div>
          <div><h3>안내</h3><p><a href="#catalog">상품 카탈로그</a><br /><a href="#process">구매 절차</a><br /><a href="#contact">상담 문의</a></p></div>
        </div>
        <div className="shell footer-bottom"><span>COPYRIGHT © SUPPLYSTAR. ALL RIGHTS RESERVED.</span><span>온라인 카탈로그 · 오프라인 계약 및 납품</span></div>
      </footer>

      <button className="floating-basket" onClick={() => setBasketOpen(true)} aria-label={`문의목록 ${basket.length}개 열기`}>
        <span>문의목록</span><b>{basket.length}</b>
      </button>

      <div className={`drawer-backdrop ${basketOpen ? "show" : ""}`} onClick={() => setBasketOpen(false)} />
      <aside className={`basket-drawer ${basketOpen ? "open" : ""}`} aria-hidden={!basketOpen} aria-label="상품 문의목록">
        <div className="drawer-head"><div><span>INQUIRY LIST</span><h2>문의목록 <b>{basket.length}</b></h2></div><button onClick={() => setBasketOpen(false)} aria-label="문의목록 닫기">×</button></div>
        <p className="drawer-guide">장바구니처럼 상품을 모은 뒤 목록을 복사해 담당자에게 전달할 수 있습니다.</p>
        <div className="drawer-products">
          {basketProducts.length > 0 ? basketProducts.map((product) => (
            <article key={product.id}>
              <div className="drawer-thumb"><ProductVisual product={product} /></div>
              <div><strong>{product.name}</strong><span>{product.unit}</span><b>{formatPrice(product.price)}</b></div>
              <button onClick={() => toggleBasket(product.id)} aria-label={`${product.name} 삭제`}>×</button>
            </article>
          )) : <div className="drawer-empty"><strong>아직 담은 상품이 없습니다.</strong><span>카탈로그에서 관심 상품의 + 버튼을 눌러보세요.</span></div>}
        </div>
        <div className="drawer-footer">
          <div><span>선택 상품</span><strong>{basket.length}개</strong></div>
          <button className="primary-button" onClick={copyInquiryList} disabled={basket.length === 0}>문의 목록 복사</button>
          {copyStatus && <p role="status">{copyStatus}</p>}
          <a href="mailto:supplystar@supplystar.co.kr">이메일 상담하기</a>
        </div>
      </aside>

      {selectedProduct && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="상품 상세 닫기">×</button>
            <div className="modal-visual"><ProductVisual product={selectedProduct} /></div>
            <div className="modal-copy">
              <span>{selectedProduct.brand}</span>
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <p className="modal-unit">{selectedProduct.unit}</p>
              <strong className="modal-price">{formatPrice(selectedProduct.price)}</strong>
              <p className="modal-description">{selectedProduct.description}</p>
              <dl><div><dt>거래 방식</dt><dd>담당자 견적 후 오프라인 계약</dd></div><div><dt>배송 안내</dt><dd>수량·재고·납품지 확인 후 안내</dd></div></dl>
              <button className="primary-button" onClick={() => toggleBasket(selectedProduct.id)}>
                {basket.includes(selectedProduct.id) ? "문의목록에서 빼기" : "문의목록에 담기"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
