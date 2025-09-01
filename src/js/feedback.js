import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import 'css-star-rating/css/star-rating.css';
import { fetchFeedbacks } from './soundwave-api.js';

const swiperWrapper = document.querySelector('.feedback-swiper .swiper-wrapper');
const nextBtn = document.querySelector('.swiper-button-next');
const prevBtn = document.querySelector('.swiper-button-prev');
const paginationEl = document.querySelector('.swiper-pagination');

function createFeedbackCard(feedback) {
  const slide = document.createElement('div');
  slide.classList.add('swiper-slide');
  const rating = Math.round(feedback.rating ?? 0);

  slide.innerHTML = `
    <input type="number" class="star-rating" value="${rating}" readonly>
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

    // Створюємо три крапки вручну
    paginationEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      paginationEl.appendChild(span);
    }

    const swiper = new Swiper('.feedback-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      keyboard: { enabled: true },
      on: {
        slideChange: function () {
          prevBtn.classList.toggle('disabled', this.isBeginning);
          nextBtn.classList.toggle('disabled', this.isEnd);
          updateCustomPagination(this.activeIndex);
        },
      },
    });

    prevBtn.classList.add('disabled');
    if (feedbacks.length <= 1) nextBtn.classList.add('disabled');

    updateCustomPagination(swiper.activeIndex);

  } catch (error) {
    console.error('Failed to load feedbacks:', error);
    swiperWrapper.innerHTML = '<p>Failed to load feedbacks.</p>';
  }
}

function updateCustomPagination(activeIndex) {
  const bullets = paginationEl.querySelectorAll('span');
  bullets.forEach(b => b.classList.remove('swiper-pagination-bullet-active'));

  if (activeIndex === 0) bullets[0].classList.add('swiper-pagination-bullet-active'); // перша
  else if (activeIndex === 9) bullets[2].classList.add('swiper-pagination-bullet-active'); // остання
  else bullets[1].classList.add('swiper-pagination-bullet-active'); // проміжні
}

initFeedbacks();