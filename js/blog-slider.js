document.addEventListener("DOMContentLoaded", () => {
  const posts = Array.from(document.querySelectorAll(".post-item"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!posts.length || !prevBtn || !nextBtn) return;

  const postsPerPage = 3;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  let currentPage = 0;

  function renderPage() {
    posts.forEach((post, index) => {
      const start = currentPage * postsPerPage;
      const end = start + postsPerPage;
      post.style.display = index >= start && index < end ? "flex" : "none";
    });

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage -= 1;
      renderPage();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage += 1;
      renderPage();
    }
  });

  renderPage();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const imageBoxes = Array.from(document.querySelectorAll(".post-img-box"));
  imageBoxes.forEach((box) => {
    const imageEl = box.querySelector(".post-img");
    if (!imageEl) return;

    const sourcesFromAttr = (box.dataset.images || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    const baseSrc = imageEl.getAttribute("src") || "";
    const fallbackSrc = imageEl.dataset.fallback || "";

    const sources = sourcesFromAttr.length
      ? sourcesFromAttr
      : [baseSrc, fallbackSrc].filter((src, index, arr) => Boolean(src) && arr.indexOf(src) === index);

    if (sources.length <= 1 || prefersReducedMotion) return;

    let currentIndex = 0;
    const setImage = (nextIndex) => {
      currentIndex = (nextIndex + sources.length) % sources.length;
      const nextSrc = sources[currentIndex];
      const resolvedSrc = encodeURI(nextSrc);
      imageEl.style.display = "block";
      box.classList.remove("img-missing");
      imageEl.src = resolvedSrc;
      imageEl.dataset.fallback = resolvedSrc;
    };

    setImage(0);
    window.setInterval(() => {
      setImage(currentIndex + 1);
    }, 2200);
  });
});
