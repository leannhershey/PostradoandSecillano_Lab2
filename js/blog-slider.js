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
});
