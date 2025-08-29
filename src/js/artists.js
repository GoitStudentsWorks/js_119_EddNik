import axios from 'axios';

const BASE_URL = 'https://sound-wave.b.goit.study/api-docs/';
const PER_PAGE = 8;

export async function getImagesByQuery(query, currentPage) {
  const response = await axios.get(BASE_URL, {
    params: {
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: PER_PAGE,
    },
  });

  return response.data;
}

const gallery = document.querySelector('.artists-gallery');

function createGallery(images) {
  return images
    .map(
      ({
        strArtistThumb,
        strArtist,
        genres: [],
        strGender,
        strBiographyEN,
      }) => `
      <li class="gallery-item">
          <img src="${strArtistThumb}" alt="${strArtist}" loading="lazy"/>

        <div class="genre">
        <b>genres:</b>${genres}</div>
        <div class="info">
          <p><b>strArtist:</b> ${strArtist}</p>
          <p><b>strGender:</b>${strGender}</p>
          <p><b>strBiographyEN:</b>${strBiographyEN}</p>

        </div>
      </li>
    `
    )
    .join('');
}

const markup = createGallery(res.hits);
refs.ulElem.insertAdjacentHTML('beforeend', markup);
