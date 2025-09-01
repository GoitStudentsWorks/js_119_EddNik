const openModalBtn = document.querySelector('[data-menu-open]');
const closeModalBtn = document.querySelector('[data-menu-close]');

function toggleModal() {
  refs.modal.classList.toggle('is-open');
  document.body.classList.toggle('no-scroll');
}

openModalBtn.addEventListener('click', toggleModal);
closeModalBtn.addEventListener('click', toggleModal);
