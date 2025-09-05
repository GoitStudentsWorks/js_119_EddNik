import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { fetchFeedbacks } from './soundwave-api.js';

const swiperWrapper = document.querySelector('.feedback-swiper .swiper-wrapper');
const nextBtn = document.querySelector('.swiper-button-next');
const prevBtn = document.querySelector('.swiper-button-prev');
const dots = document.querySelectorAll('.custom-pagination .dot');


function createFeedbackCard(feedback) {
  const slide = document.createElement('div');
  slide.classList.add('swiper-slide', 'feedback-card');

  const rating = Math.round(feedback.rating ?? 0);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star" style="color: ${i <= rating ? '#764191' : '#ffffff'};">★</span>`;
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
      keyboard: { enabled: true },
      on: {
        slideChange: function () {
         
          prevBtn.classList.toggle('swiper-button-disabled', this.isBeginning);
          nextBtn.classList.toggle('swiper-button-disabled', this.isEnd);

         
          dots.forEach(dot => dot.classList.remove('active'));
          if (this.activeIndex === 0) dots[0].classList.add('active');
          else if (this.activeIndex === 9) dots[2].classList.add('active');
          else dots[1].classList.add('active');
        },
      },
    });

    prevBtn.classList.add('swiper-button-disabled');
    if (feedbacks.length <= 1) nextBtn.classList.add('swiper-button-disabled');

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = dot.dataset.index;
        if (index === 'first') swiper.slideTo(0);
        if (index === 'middle') swiper.slideTo(1);
        if (index === 'last') swiper.slideTo(9);
      });
    });

    dots[0].classList.add('active');

  } catch (error) {
    console.error('Failed to load feedbacks:', error);
    swiperWrapper.innerHTML = '<p>Failed to load feedbacks.</p>';
  }
}

initFeedbacks();

// Feedback modal

const leaveFeedbackBtn = document.querySelector('.leave-feedback-btn');
const feedbackModal    = document.getElementById('feedbackModal');
const feedbackForm     = feedbackModal.querySelector('.feedback-modal-form');
const modalCloseBtn    = feedbackModal.querySelector('.feedback-modal-close');

const nameInput    = document.getElementById('user-name');
const messageInput = document.getElementById('user-feedback');
const ratingInput  = document.getElementById('ratingValue');
const ratingError  = document.getElementById('ratingError');


function openModal() {
  feedbackModal.classList.remove('hidden');       
  document.body.style.overflow = 'hidden';        
  nameInput.focus();
}

function closeModal() {
  feedbackModal.classList.add('hidden');         
  document.body.style.overflow = '';       
  
  clearError(nameInput);
  clearError(messageInput);
  ratingError.textContent = '';
}

leaveFeedbackBtn.addEventListener('click', openModal);
modalCloseBtn.addEventListener('click', closeModal);
feedbackModal.addEventListener('click', (e) => {
  if (e.target === feedbackModal) closeModal();  
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !feedbackModal.classList.contains('hidden')) {
    closeModal();
  }
});


const stars = Array.from(document.querySelectorAll('.modal-star'));

function paintStars(r) {
  stars.forEach(star => {
    const v = Number(star.dataset.value);
    star.classList.toggle('active', v <= r);
  });
}

stars.forEach(star => {
  star.addEventListener('mouseenter', () => paintStars(Number(star.dataset.value)));
  star.addEventListener('mouseleave', () => paintStars(Number(ratingInput.value)));
  star.addEventListener('click', () => {
    ratingInput.value = String(Number(star.dataset.value));
    paintStars(Number(ratingInput.value));
    ratingError.textContent = '';
  });
});


function setError(inputEl, msg) {
  inputEl.classList.add('input-error');
 
  if (msg && inputEl === nameInput)   ratingError.textContent = msg;
  if (msg && inputEl === messageInput) ratingError.textContent = msg;
}
function clearError(inputEl) {
  inputEl.classList.remove('input-error');
}
function validate() {
  let ok = true;
  ratingError.textContent = '';


  const name = nameInput.value.trim();
  if (name.length < 2 || name.length > 50) {
    setError(nameInput, 'Name must be 2-50 characters.');
    ok = false;
  } else {
    clearError(nameInput);
  }

  const msg = messageInput.value.trim();
  if (msg.length < 5 || msg.length > 500) {
    setError(messageInput, 'Message must be 5-500 characters.');
    ok = false;
  } else {
    clearError(messageInput);
  }

  const rating = Number(ratingInput.value);
  if (!rating || rating < 1 || rating > 5) {
    ratingError.textContent = 'Please select a rating.';
    ok = false;
  }

  return ok;
}

feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) return;

 
  const payload = {
    name: nameInput.value.trim(),
    message: messageInput.value.trim(),
    rating: Number(ratingInput.value),
  };


  const submitBtn = feedbackForm.querySelector('.feedback-modal-btn');
  const prevText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      ratingError.textContent = 'Validation failed. Check your inputs.';
      return;
    }

    feedbackForm.reset();
    ratingInput.value = '0';
    paintStars(0);
    closeModal();

  } catch (err) {
    console.error('Feedback submit failed:', err);
    ratingError.textContent = 'Network error. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = prevText;
  }
});

paintStars(Number(ratingInput.value));