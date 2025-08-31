import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import 'css-star-rating/css/star-rating.css';

import { fetchFeedbacks } from './soundwave-api.js';

const swiperWrapper = document.querySelector(
  '.feedback-swiper .swiper-wrapper'
);

function roundRating(rating) {
  return Math.round(rating);
}

function createFeedbackCard(feedback) {
  const slide = document.createElement('div');
  slide.classList.add('swiper-slide');

  slide.innerHTML = `
  <div class="feedback-rating">${'⭐'.repeat(
    roundRating(feedback.rating)
  )}</div>
    <p class="feedback-text">${feedback.descr}</p>
    <div class="feedback-author">${feedback.name}</div>
    
  `;

  return slide;
}

async function initFeedbacks() {
  const feedbacks = await fetchFeedbacks(10);
  console.log(swiperWrapper);
  feedbacks.forEach(f => {
    swiperWrapper.appendChild(createFeedbackCard(f));
  });

  new Swiper('.feedback-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

initFeedbacks();
