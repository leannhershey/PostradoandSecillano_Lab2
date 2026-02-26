const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PAGE_TRANSITION_MS = 320;

function navigateWithTransition(target) {
  if (!target) return;

  if (prefersReducedMotion) {
    window.location.href = target;
    return;
  }

  document.body.classList.add("page-leaving");
  window.setTimeout(() => {
    window.location.href = target;
  }, PAGE_TRANSITION_MS);
}

if (!prefersReducedMotion) {
  document.body.classList.add("page-enter");
  requestAnimationFrame(() => {
    document.body.classList.add("page-enter-active");
  });
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const goButtons = document.querySelectorAll("[data-go]");
goButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-go");
    navigateWithTransition(target);
  });
});

const pageLinks = document.querySelectorAll("a[href]");
pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#")) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const targetUrl = new URL(href, window.location.href);
    if (targetUrl.origin !== window.location.origin) return;
    if (targetUrl.href === window.location.href) return;

    event.preventDefault();
    navigateWithTransition(targetUrl.href);
  });
});

function initPostEntryModal() {
  const posts = document.querySelectorAll(".post-item");
  if (!posts.length) return;

  const modal = document.createElement("div");
  modal.className = "blog-entry-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="blog-entry-modal-backdrop" data-entry-close></div>
    <div class="blog-entry-modal-card" role="dialog" aria-modal="true" aria-labelledby="entryModalTitle">
      <button class="blog-entry-modal-close" type="button" aria-label="Close modal" data-entry-close>&times;</button>
      <img class="blog-entry-modal-image" src="" alt="" />
      <h4 class="blog-entry-modal-date" id="entryModalTitle"></h4>
      <p class="blog-entry-modal-text"></p>
    </div>
  `;

  document.body.appendChild(modal);

  const modalImage = modal.querySelector(".blog-entry-modal-image");
  const modalDate = modal.querySelector(".blog-entry-modal-date");
  const modalText = modal.querySelector(".blog-entry-modal-text");
  const closeTargets = modal.querySelectorAll("[data-entry-close]");
  let modalCarouselTimer = null;

  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const splitIntoThreeParagraphs = (text) => {
    const cleaned = (text || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return ["", "", ""];

    const sentences = cleaned.match(/[^.!?]+[.!?]*\s*/g)?.map((s) => s.trim()).filter(Boolean) || [cleaned];
    if (sentences.length < 3) {
      const words = cleaned.split(" ");
      const chunkSize = Math.ceil(words.length / 3);
      return [0, 1, 2]
        .map((i) => words.slice(i * chunkSize, (i + 1) * chunkSize).join(" ").trim())
        .filter(Boolean);
    }

    const size = Math.ceil(sentences.length / 3);
    return [0, 1, 2]
      .map((i) => sentences.slice(i * size, (i + 1) * size).join(" ").trim())
      .filter(Boolean);
  };

  const getPostImageSources = (post) => {
    const box = post.querySelector(".post-img-box");
    const image = post.querySelector(".post-img");
    if (!box || !image) return [];

    const fromData = (box.dataset.images || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    if (fromData.length) return fromData;

    const baseSrc = image.getAttribute("src") || "";
    const fallbackSrc = image.dataset.fallback || "";
    return [baseSrc, fallbackSrc].filter((src, index, arr) => Boolean(src) && arr.indexOf(src) === index);
  };

  const stopModalCarousel = () => {
    if (!modalCarouselTimer) return;
    window.clearInterval(modalCarouselTimer);
    modalCarouselTimer = null;
  };

  const closeModal = () => {
    stopModalCarousel();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");
  };

  const openModal = (post) => {
    const image = post.querySelector(".post-img");
    const date = post.querySelector("h4");
    const previewText = post.querySelector("p");
    const fullText = post.querySelector(".post-full-caption");
    const imageSources = getPostImageSources(post);

    if (!image || !date || !previewText) return;

    const currentSrc = image.getAttribute("src") || "";
    let currentIndex = Math.max(0, imageSources.indexOf(currentSrc));
    if (!imageSources.length) {
      imageSources.push(currentSrc);
      currentIndex = 0;
    }

    const setModalImage = (index) => {
      currentIndex = (index + imageSources.length) % imageSources.length;
      const nextSrc = imageSources[currentIndex];
      modalImage.src = encodeURI(nextSrc);
      modalImage.alt = image.getAttribute("alt") || "Post image";
    };

    stopModalCarousel();
    setModalImage(currentIndex);

    if (imageSources.length > 1 && !prefersReducedMotion) {
      modalCarouselTimer = window.setInterval(() => {
        setModalImage(currentIndex + 1);
      }, 2200);
    }

    modalImage.alt = image.getAttribute("alt") || "Post image";
    modalDate.textContent = date.textContent || "";
    const rawText = (fullText?.textContent || previewText.textContent || "").trim();
    const paragraphs = splitIntoThreeParagraphs(rawText);
    modalText.innerHTML = paragraphs.map((para) => `<p>${escapeHtml(para)}</p>`).join("");

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");
  };

  closeTargets.forEach((target) => {
    target.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  posts.forEach((post) => {
    post.addEventListener("click", () => {
      openModal(post);
    });
  });
}

initPostEntryModal();
