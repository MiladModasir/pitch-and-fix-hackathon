document.addEventListener("DOMContentLoaded", () => {
  // for each detail section…
  document.querySelectorAll(".category-section").forEach((section) => {
    const input    = section.querySelector(".search-input");
    const cards    = section.querySelectorAll(".product-card");
    const noResult = section.querySelector(".no-result-message");

    if (!input) return;  // skip the overview / any section without a search

    input.addEventListener("input", () => {
      const term     = input.value.trim().toLowerCase();
      let anyVisible = false;

      cards.forEach((card) => {
        const title   = card.querySelector("h3").textContent.toLowerCase();
        const matches = title.includes(term);
        card.style.display = matches ? "" : "none";
        if (matches) anyVisible = true;
      });

      if (!term) {
        noResult.classList.add("hidden");
        cards.forEach(c => c.style.display = ""); // reset
      } else {
        noResult.classList.toggle("hidden", anyVisible);
      }
    });
  });
});
