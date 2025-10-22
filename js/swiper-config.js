// js/swiper-config.js

document.addEventListener("DOMContentLoaded", function () {
  const trainersSwiperEl = document.querySelector('.trainers-swiper');
  if (!trainersSwiperEl) return;

  new Swiper('.trainers-swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {
      el: '.trainers-swiper .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.trainers-swiper-container .swiper-button-next',
      prevEl: '.trainers-swiper-container .swiper-button-prev',
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 },
      480: { slidesPerView: 2, spaceBetween: 15 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 20 }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const programSwiperEl = document.querySelector('.program-swiper');
  if (!programSwiperEl) return;

  new Swiper('.program-swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {
      el: '.program-swiper .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.program-swiper-container .swiper-button-next',
      prevEl: '.program-swiper-container .swiper-button-prev',
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 },
      480: { slidesPerView: 2, spaceBetween: 15 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 20 }
    }
  });
});