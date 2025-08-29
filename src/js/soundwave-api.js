const BASE_URL = "https://sound-wave.b.goit.study/api";

// Функції для роботи з API 

async function fetchArtists() {
  const response = await fetch(`${BASE_URL}/artists`);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

async function fetchArtistById(id) {
  const response = await fetch(`${BASE_URL}/artists/${id}`);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

async function fetchAlbumsByArtist(id) {
  const response = await fetch(`${BASE_URL}/artists/${id}/albums`);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}


