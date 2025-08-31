import { fetchArtists } from './soundwave-api';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const gallery = document.querySelector('.artist-gallery');
const loadMoreBtn = document.querySelector('.artists-btn-load');

let artists = [];
let currentPage = 1;
const limit = 8;
let maxPage = 0;

function createCardMarkup(artist) {
  return `
    <li class="artist-card">
      <img src="${artist.strArtistThumb}" alt="${artist.strArtist}">
      <ul class="artist-genres">
        ${artist.genres
          .map(genre => `<li class="genre-item">${genre}</li>`)
          .join('')}
      </ul>
      <div class="artist-container-info">
      <h3 class="artists-name">${artist.strArtist}</h3>
      <p class="artist-info">${artist.strBiographyEN.substring(0, 100)}...</p>
      </div>
      <a href="./modal.html?id=${artist._id}"
         class="link artists-link js-learn-more"
         data-id="${artist._id}">
        Learn more<span class="artists-arrow">▶</span>
      </a>
    </li>
  `;
}

function createGallery(artistsArray) {
  return artistsArray.map(createCardMarkup).join('');
}

async function loadArtists(page = 1) {
  try {
    const res = await fetchArtists(page, limit);

    if (!res.artists || res.artists.length === 0) {
      iziToast.error({
        position: 'topRight',
        message: 'No more artists',
      });
      hideLoadMoreButton();
      return;
    }

    artists = [...artists, ...res.artists];
    gallery.insertAdjacentHTML('beforeend', createGallery(res.artists));

    maxPage = Math.ceil(res.totalArtists / limit);
    checkBtnVisibleStatus();
  } catch (error) {
    console.error('Error loading artists:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load artists',
      position: 'topRight',
      color: 'red',
    });
  }
}

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  loadMoreBtn.disabled = true;
  await loadArtists(currentPage);
  loadMoreBtn.disabled = false;
});

function checkBtnVisibleStatus() {
  if (currentPage < maxPage) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
  }
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}
function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

loadArtists(currentPage);
