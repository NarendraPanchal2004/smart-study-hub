import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/books`;

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

export const uploadLibraryFile = async (file) => {
  const UPLOAD_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`;
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post(UPLOAD_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeader()
    }
  });
  return data;
};
