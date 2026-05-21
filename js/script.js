// ── CATALOG SLIDER ──
document.addEventListener('DOMContentLoaded', function () {
  const catalogs = document.querySelectorAll('.catalog-section');

  catalogs.forEach(function (section) {
    const grid = section.querySelector('.products-grid');
    const btnPrev = section.querySelector('.btn-prev');
    const btnNext = section.querySelector('.btn-next');

    if (!grid || !btnPrev || !btnNext) return;

    let currentIndex = 0;
    const visibleCount = 6;

    function getCardWidth() {
      const card = grid.querySelector('.product-card');
      if (!card) return 0;
      const gap = 16;
      return card.offsetWidth + gap;
    }

    function getMaxIndex() {
      const cards = grid.querySelectorAll('.product-card');
      return Math.max(0, cards.length - visibleCount);
    }

    function slideTo(index) {
      const maxIndex = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const offset = currentIndex * getCardWidth();
      grid.style.transform = `translateX(-${offset}px)`;
      btnPrev.style.opacity = currentIndex === 0 ? '0.4' : '1';
      btnNext.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    }

    btnPrev.addEventListener('click', function () {
      slideTo(currentIndex - 1);
    });

    btnNext.addEventListener('click', function () {
      slideTo(currentIndex + 1);
    });

    // Init state
    slideTo(0);

    // Recalculate on resize
    window.addEventListener('resize', function () {
      slideTo(currentIndex);
    });
  });
});