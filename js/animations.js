const revealElements = document.querySelectorAll("[data-reveal]");

if (revealElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  revealElements.forEach((element) => revealObserver.observe(element));
}
