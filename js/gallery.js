const galleryRoot = document.querySelector("[data-gallery-root]");

if (galleryRoot) {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const items = galleryRoot.querySelectorAll(".gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      items.forEach((item) => {
        const shouldShow = category === "all" || item.dataset.category === category;
        item.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  if (window.GLightbox) {
    window.GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });
  }
}
