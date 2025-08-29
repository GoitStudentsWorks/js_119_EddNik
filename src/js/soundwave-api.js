import axios from "axios";

export const BASE_URL = "https://sound-wave.b.goit.study/api-docs/";

export async function fetchArtists(limit = 8) {
  try {
    const response = await axios.get(`${BASE_URL}/artists`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
}


export async function fetchArtistById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching artist with ID ${id}:`, error);
    throw error;
  }
}


export async function fetchAlbumsByArtist(id) {
  try {
    const response = await axios.get(`${BASE_URL}/artists/${id}/albums`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching albums for artist with ID ${id}:`, error);
    throw error;
  }
}

