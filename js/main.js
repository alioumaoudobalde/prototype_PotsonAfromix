const siteHeader = document.querySelector("[data-header]");
const backToTop = document.querySelector("[data-back-to-top]");
const pageLoader = document.querySelector("[data-page-loader]");
const transitionLayer = document.querySelector("[data-page-transition]");
const hero = document.querySelector(".hero");
const heroCanvas = document.querySelector("[data-hero-particles]");

const setHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 80);
};

const initBackToTop = () => {
  if (!backToTop) return;
  const onScroll = () => backToTop.classList.toggle("hidden", window.scrollY < 400);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
};

const initLoader = () => {
  if (!pageLoader) return;
  document.body.classList.add("is-loading");
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      pageLoader.classList.add("hidden");
      document.body.classList.remove("is-loading");
    }, 1200);
  });
};

const initPageTransitions = () => {
  if (!transitionLayer) return;
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return;
    }

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      transitionLayer.classList.remove("hidden");
      transitionLayer.classList.add("active");
      window.setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
};

const initCounters = () => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.counter);
      const suffix = counter.dataset.suffix || "";
      const isDecimal = counter.dataset.decimal === "true";
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = target * (1 - Math.pow(1 - progress, 3));
        counter.textContent = `${isDecimal ? value.toFixed(1).replace(".", ",") : Math.round(value)}${suffix}`;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
      observer.unobserve(counter);
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => observer.observe(counter));
};

const initParallax = () => {
  if (!hero) return;
  const onScroll = () => {
    const offset = Math.min(window.scrollY * 0.2, 70);
    hero.style.backgroundPosition = `center ${offset}px`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
};

const initParticles = () => {
  if (!heroCanvas) return;
  const context = heroCanvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let particles = [];

  const resize = () => {
    width = heroCanvas.width = heroCanvas.offsetWidth * window.devicePixelRatio;
    height = heroCanvas.height = heroCanvas.offsetHeight * window.devicePixelRatio;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
    particles = Array.from({ length: 36 }, () => ({
      x: Math.random() * heroCanvas.offsetWidth,
      y: Math.random() * heroCanvas.offsetHeight,
      radius: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: Math.random() * 0.3 - 0.15,
      alpha: Math.random() * 0.35 + 0.1
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, heroCanvas.offsetWidth, heroCanvas.offsetHeight);
    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y -= particle.speedY;
      if (particle.y < -10) particle.y = heroCanvas.offsetHeight + 10;
      if (particle.x < -10) particle.x = heroCanvas.offsetWidth + 10;
      if (particle.x > heroCanvas.offsetWidth + 10) particle.x = -10;
      context.beginPath();
      context.fillStyle = `rgba(232, 196, 154, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
};

const initFaq = () => {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      item?.classList.toggle("open");
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setHeaderState();
  initBackToTop();
  initLoader();
  initPageTransitions();
  initCounters();
  initParallax();
  initParticles();
  initFaq();
  window.addEventListener("scroll", setHeaderState, { passive: true });
  if (window.AOS) {
    window.AOS.init({ once: true, duration: 800, easing: "ease-out-cubic", offset: 80 });
  }
});
