import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { fetchFeedbacks } from './soundwave-api.js';

const swiperWrapper = document.querySelector('.feedback-swiper .swiper-wrapper');
const nextBtn = document.querySelector('.swiper-button-next');
const prevBtn = document.querySelector('.swiper-button-prev');
const paginationEl = document.querySelector('.swiper-pagination');

// Функція створення відгуку
function createFeedbackCard(feedback) {
  const slide = document.createElement('div');
  slide.classList.add('swiper-slide', 'feedback-card');

  const rating = Math.round(feedback.rating ?? 0);
  let stars = '';

  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star" style="color: ${i <= rating ? '#764191' : 'transparent'};">★</span>`;
  }

  slide.innerHTML = `
    <div class="feedback-rating">${stars}</div>
    <p class="feedback-text">${feedback.descr}</p>
    <div class="feedback-author">${feedback.name}</div>
  `;
  return slide;
}

async function initFeedbacks() {
  try {
    const allFeedbacks = await fetchFeedbacks();
    const feedbacks = allFeedbacks.slice(0, 10);

    feedbacks.forEach(f => swiperWrapper.appendChild(createFeedbackCard(f)));

    const swiper = new Swiper('.feedback-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className}"></span>`;
        },
      },
      keyboard: { enabled: true },
      on: {
        slideChange: function () {
          prevBtn.classList.toggle('swiper-button-disabled', this.isBeginning);
          nextBtn.classList.toggle('swiper-button-disabled', this.isEnd);
        },
      },
    });

    // Початковий стан кнопок
    prevBtn.classList.add('swiper-button-disabled');
    if (feedbacks.length <= 1) nextBtn.classList.add('swiper-button-disabled');
  } catch (error) {
    console.error('Failed to load feedbacks:', error);
    swiperWrapper.innerHTML = '<p>Failed to load feedbacks.</p>';
  }
}

initFeedbacks();