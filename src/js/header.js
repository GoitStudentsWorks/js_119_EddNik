document.addEventListener('DOMContentLoaded', () => {
  const refs = {
    openBtn: document.querySelector('[data-menu-open]'),
    closeBtns: document.querySelectorAll('[data-menu-close]'),
    modal: document.querySelector('[data-menu]'),
  };

  function toggleModal() {
    refs.modal.classList.toggle('is-open');
    document.body.classList.toggle('no-scroll');
  }

  refs.openBtn.addEventListener('click', toggleModal);

  refs.closeBtns.forEach(btn => {
    btn.addEventListener('click', toggleModal);
  });

  const navLinks = document.querySelectorAll(
    '[data-menu-close-artist], [data-menu-close-aboutus], [data-menu-close-reviews]'
  );
  navLinks.forEach(link => {
    link.addEventListener('click', toggleModal);
  });
});
