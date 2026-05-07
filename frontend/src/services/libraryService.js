import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('studySyncUser'));
  return { Authorization: `Bearer ${user.token}` };
};

export const getBooks = async () => {
  const { data } = await axios.get(API_URL, { headers: getAuthHeader() });
  return data;
};

export const addBook = async (bookData) => {
  const { data } = await axios.post(API_URL, bookData, { headers: getAuthHeader() });
  return data;
};
