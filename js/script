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
