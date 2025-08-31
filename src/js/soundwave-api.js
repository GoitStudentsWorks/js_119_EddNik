import axios from 'axios';

export const BASE_URL = 'https://sound-wave.b.goit.study/api';

export async function fetchArtists(page = 1, limit = 8) {
  try {
    const response = await axios.get(`${BASE_URL}/artists`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching artists:', error);
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

// Відгуки
export async function fetchFeedbacks() {
  try {
    const response = await axios.get(`${BASE_URL}/feedbacks`);
    console.log('Raw feedback response:', response.data);
    
    // Якщо API обертає дані у response.data.data
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      // Повертаємо порожній масив, якщо формат незвичний
      return [];
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw error;
  }
}

export async function postFeedback(feedbackData) {
  try {
    const response = await axios.post(`${BASE_URL}/feedbacks`, feedbackData);
    return response.data; 
  } catch (error) {
    console.error("Error posting feedback:", error);
    throw error;
  }
}
