import { fetchArtistById, fetchAlbumsByArtist } from './soundwave-api';

const modal = document.getElementById('artist-modal');
const overlay = modal.querySelector('.modal-overlay');
const closeBtn = modal.querySelector('.modal-close');
const loader = document.getElementById('loader');
const albumsContainer = document.getElementById('artist-albums');
const modalBackdrop = document.querySelector('.js-modal-backdrop');

let listeners = [];

// format duration of track
function formatDuration(ms) {
  if (!ms || isNaN(ms)) return '-';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function openArtistModal(artistId) {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  loader.style.display = 'block';

  try {
    const artist = await fetchArtistById(artistId);
    await populateModal(artist);
    loader.style.display = 'none';
  } catch (err) {
    console.error(err);
    loader.textContent = 'Error loading data';
  }
}

async function populateModal(artist) {
  document.getElementById('artist-name').textContent = artist.strArtist;
  document.getElementById('artist-image').src = artist.strArtistThumb || '';

  // Years active
  const yearsEl = document.getElementById('artist-years');
  if (artist.intFormedYear && artist.intDiedYear) {
    yearsEl.textContent = `Years active: ${artist.intFormedYear} – ${artist.intDiedYear}`;
  } else if (artist.intFormedYear && !artist.intDiedYear) {
    yearsEl.textContent = `Years active: ${artist.intFormedYear} – present`;
  } else {
    yearsEl.textContent = 'Years active: information missing';
  }

  // Sex / Members
  const genderEl = document.getElementById('artist-gender');
  const membersEl = document.getElementById('artist-members');
  if (artist.strArtistType === 'person') {
    genderEl.textContent = `Sex: ${artist.strGender || 'information missing'}`;
    genderEl.classList.remove('hidden');
    membersEl.classList.add('hidden');
  } else {
    membersEl.textContent = `Members: ${
      artist.intMembers || 'information missing'
    }`;
    membersEl.classList.remove('hidden');
    genderEl.classList.add('hidden');
  }

  document.getElementById('artist-country').textContent = `Country: ${
    artist.strCountry || 'information missing'
  }`;
  document.getElementById('artist-bio').textContent = `Biography: ${
    artist.strBiographyEN || 'information missing'
  }`;

  // Genres
  let genresText = 'information missing';
  if (Array.isArray(artist.genres)) {
    genresText = artist.genres.join(', ');
  } else if (typeof artist.genres === 'string') {
    genresText = artist.genres;
  }
  document.getElementById(
    'artist-genres'
  ).textContent = `Genres: ${genresText}`;

  // Albums
  try {
    const albums = await fetchAlbumsByArtist(artist._id);
    albumsContainer.innerHTML = '';

    albums.albumsList.forEach(album => {
      const albumDiv = document.createElement('div');
      albumDiv.classList.add('album');

      const tracks = album.tracks || [];

      const headerHtml = `
        <div class="album-header">
          <span>Track</span>
          <span>Time</span>
          <span></span>
        </div>
      `;

      // albumDiv.innerHTML = `
      //   <h3>${album.strAlbum}</h3>
      //   <ul>
      //     <li class="album-header">
      //       <span>Track</span>
      //       <span>Time</span>
      //       <span></span>
      //     </li>
      //     ${tracks
      //       .map(
      //         track => `
      //       <li>
      //         <span>${track.strTrack}</span>
      //         <span>${track.intDuration || '-'}</span>
      //         ${
      //           track.movie
      //             ? ` <a href="${track.movie}" target="_blank" aria-label="YouTube link" class="youtube-link">
      //                   <svg class="icon-youtube" width="21" height="15" aria-hidden="true" focusable="false">
      //                       <use href="../img/sprite.svg#icon-Youtube"></use>
      //                   </svg>
      //                  </a>`
      //             : ''
      //         }

      //       </li>
      //     `
      //       )
      //       .join('')}
      //   </ul>`;
      const tracksHtml = tracks
        .map(track => {
          const youtubeLink = track.movie
            ? `
              <a href="${track.movie}" target="_blank" aria-label="YouTube link" class="youtube-link">
                <svg class="icon-youtube" width="21" height="15" aria-hidden="true" focusable="false">
                  <use href="../img/sprite.svg#icon-Youtube"></use>
                </svg>
              </a>`
            : '';

          return `
            <li>
              <span>${track.strTrack}</span>
              <div class="track-meta">
                <span>${formatDuration(track.intDuration)}</span>
                ${youtubeLink}
              </div>
            </li>
          `;
        })
        .join('');

      albumDiv.innerHTML = `
        <h3>${album.strAlbum}</h3>
        ${headerHtml}
        <ul>
          ${tracksHtml}
        </ul>
      `;

      albumsContainer.appendChild(albumDiv);
    });
  } catch (err) {
    console.error('Error loading albums:', err);
  }
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  listeners.forEach(({ el, event, handler }) =>
    el.removeEventListener(event, handler)
  );
  listeners = [];
}

function addListener(el, event, handler) {
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

// Init
addListener(closeBtn, 'click', closeModal);
addListener(overlay, 'click', closeModal);
addListener(document, 'keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// --- Opening modal by click on Learn more ---

addListener(document, 'click', e => {
  // addListener('click', e => {
  e.preventDefault();
  const learnMoreBtn = e.target.closest('.artists-link');
  if (!learnMoreBtn) return;

  const artistId = learnMoreBtn.dataset.id;
  console.log(artistId);
  if (artistId) {
    openArtistModal(artistId);
  }
});

modalBackdrop.addEventListener('click', closeBackdrop);
function closeBackdrop(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}
