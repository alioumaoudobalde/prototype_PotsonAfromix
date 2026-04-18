const homepageReviews = document.querySelector(".reviews-swiper");

if (homepageReviews && window.Swiper) {
  new window.Swiper(".reviews-swiper", {
    loop: true,
    autoplay: { delay: 3800, disableOnInteraction: false },
    spaceBetween: 24,
    slidesPerView: 1,
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
}
