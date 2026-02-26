document.addEventListener("DOMContentLoaded", function () {

  const cards = document.querySelectorAll(".lightpink-card");
  const cardsPerPage = 3;
  const totalCards = cards.length;

  let currentPage = 0;

  const leftArrow = document.querySelector(".arrow-left");
  const rightArrow = document.querySelector(".arrow-right");

  function updateCarousel() {
    // Hide all cards first
    cards.forEach(card => {
      card.style.display = "none";
    });

    // Calculate start & end index
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;

    // Show only the cards for this page
    for (let i = start; i < end && i < totalCards; i++) {
      cards[i].style.display = "flex";
    }

    // Disable arrows at limits (optional but clean)
    leftArrow.style.opacity = currentPage === 0 ? "0.3" : "1";
    rightArrow.style.opacity = end >= totalCards ? "0.3" : "1";
  }

  // NEXT
  rightArrow.addEventListener("click", function () {
    if ((currentPage + 1) * cardsPerPage < totalCards) {
      currentPage++;
      updateCarousel();
    }
  });

  // PREVIOUS
  leftArrow.addEventListener("click", function () {
    if (currentPage > 0) {
      currentPage--;
      updateCarousel();
    }
  });

  // Initialize first page
  updateCarousel();

});