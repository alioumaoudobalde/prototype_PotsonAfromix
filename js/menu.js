const menuToggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

if (menuToggle && mobilePanel) {
  const toggleMenu = (forceState) => {
    const shouldOpen = typeof forceState === "boolean" ? forceState : !mobilePanel.classList.contains("open");
    mobilePanel.classList.toggle("open", shouldOpen);
    menuToggle.classList.toggle("active", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    document.body.classList.toggle("menu-open", shouldOpen);
  };

  menuToggle.addEventListener("click", () => toggleMenu());
  mobilePanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) toggleMenu(false);
  });
}
