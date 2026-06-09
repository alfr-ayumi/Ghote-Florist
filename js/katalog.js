const KATEGORI_ORDER = [
  "Buket Bunga",
  "Buket Boneka",
  "Buket Uang",
  "Buket Makanan",
  "Buket Thumbelina",
  "Buket Mini",
];

const WARNA_CARD = ["p1", "p2", "p3", "p4", "p5", "p6"];
const BATAS_HOMEPAGE = 6;

function formatHarga(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function buatKartuProduk(produk, index) {
  const warna = WARNA_CARD[index % WARNA_CARD.length];
  return `
    <div class="product-card">
      <div class="product-img">
        <div class="product-img-inner ${warna}">
          <img src="${produk.foto}" alt="${produk.nama}" loading="lazy" onerror="this.style.display='none'">
        </div>
      </div>
      <div class="product-info">
        <p class="product-name">${produk.nama}</p>
        <div class="product-price-row">
          <span class="product-price">${formatHarga(produk.harga)}</span>
        </div>
      </div>
    </div>
  `;
}

function buatKartuLihatSemua(kategori) {
  const url = `katalog-kategori.html?kat=${encodeURIComponent(kategori)}`;
  return `
    <a href="${url}" class="product-card product-card-viewall" style="text-decoration:none">
      <div class="viewall-circle">&#62;</div>
      <div class="viewall-label">Lihat Semua</div>
    </a>
  `;
}

function renderKatalog(semuaProduk) {
  const container = document.getElementById("katalog-container");
  if (!container) return;

  const perKategori = {};
  KATEGORI_ORDER.forEach(kat => { perKategori[kat] = []; });
  semuaProduk.forEach(p => {
    if (perKategori[p.kategori] !== undefined) perKategori[p.kategori].push(p);
  });

  let html = "";

  KATEGORI_ORDER.forEach(kategori => {
    const produkList = perKategori[kategori];
    if (produkList.length === 0) return;

    const tampil = produkList.slice(0, BATAS_HOMEPAGE);
    const [depan, ...belakang] = kategori.split(" ");

    html += `
      <div class="catalog-section">
        <div class="catalog-header">
          <div class="catalog-title">
            <strong>${depan}&nbsp;<em>${belakang.join(" ")}</em></strong>
            <div class="catalog-title-line"></div>
          </div>
        </div>
        <div class="catalog-scroll-wrap">
          <div class="products-grid">
            ${tampil.map((p, i) => buatKartuProduk(p, i)).join("")}
            ${buatKartuLihatSemua(kategori)}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html || `<p style="text-align:center;color:#888;padding:40px">Belum ada produk.</p>`;
  initSwipe();
  initScrollAnimasi();
}

function tampilLoading() {
  const container = document.getElementById("katalog-container");
  if (container) container.innerHTML = `
    <div style="text-align:center;padding:60px;color:var(--text-light)">
      <div style="font-size:32px;margin-bottom:12px">🌸</div>
      <p style="font-size:14px">Memuat produk...</p>
    </div>`;
}

function tampilError() {
  const container = document.getElementById("katalog-container");
  if (container) container.innerHTML = `
    <p style="text-align:center;color:#888;padding:40px">
      Produk tidak dapat dimuat. Coba refresh halaman.
    </p>`;
}

function initSwipe() {
  document.querySelectorAll(".catalog-scroll-wrap").forEach(wrap => {
    let startX = 0, scrollLeft = 0, isDragging = false;

    wrap.addEventListener("touchstart", e => { startX = e.touches[0].clientX; scrollLeft = wrap.scrollLeft; isDragging = true; }, { passive: true });
    wrap.addEventListener("touchmove", e => { if (!isDragging) return; wrap.scrollLeft = scrollLeft + (startX - e.touches[0].clientX); }, { passive: true });
    wrap.addEventListener("touchend", () => { isDragging = false; });
    wrap.addEventListener("mousedown", e => { startX = e.pageX - wrap.offsetLeft; scrollLeft = wrap.scrollLeft; isDragging = true; wrap.style.cursor = "grabbing"; });
    wrap.addEventListener("mousemove", e => { if (!isDragging) return; e.preventDefault(); wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX); });
    wrap.addEventListener("mouseup", () => { isDragging = false; wrap.style.cursor = ""; });
    wrap.addEventListener("mouseleave", () => { isDragging = false; wrap.style.cursor = ""; });
  });
}

function initScrollAnimasi() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".product-card, .stat-item").forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", async () => {
  tampilLoading();
  try {
    const produk = await fetchSemuaProduk();
    renderKatalog(produk);
  } catch {
    tampilError();
  }
});
