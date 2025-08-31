import { fetchArtistById, fetchAlbumsByArtist } from './soundwave-api';

const modal = document.getElementById('artist-modal');
const overlay = modal.querySelector('.modal-overlay');
const closeBtn = modal.querySelector('.modal-close');
const loader = document.getElementById('loader');
const albumsContainer = document.getElementById('artist-albums');

let listeners = [];

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
  document.getElementById('artist-genres').textContent = `Genres: ${
    artist.genres?.join(', ') || 'information missing'
  }`;

  // Albums
  try {
    const albums = await fetchAlbumsByArtist(artist._id);
    albumsContainer.innerHTML = '';

    albums.forEach(album => {
      const albumDiv = document.createElement('div');
      albumDiv.classList.add('album');

      const tracks = album.tracks || album.albumsList?.tracks || [];

      albumDiv.innerHTML = `
        <h3>${album.strAlbum}</h3>
        <ul>
          <li class="album-header">
            <span>Track</span>
            <span>Time</span>
            <span></span>
          </li>
          ${tracks
            .map(
              track => `
            <li>
              <span>${track.strTrack}</span>
              <span>${track.intDuration || '-'}</span>
              ${
                track.movie
                  ? `<a href="${track.movie}" target="_blank" aria-label="YouTube link">▶</a>`
                  : ''
              }
            </li>
          `
            )
            .join('')}
        </ul>`;
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
  const learnMoreBtn = e.target.closest('.artists-link');
  if (!learnMoreBtn) return;

  e.preventDefault();
  const artistId = learnMoreBtn.dataset.id;
  if (artistId) {
    openArtistModal(artistId);
  }
});
