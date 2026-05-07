import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notes`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('studySyncUser'));
  return { Authorization: `Bearer ${user.token}` };
};

export const getNotes = async () => {
  const { data } = await axios.get(API_URL, { headers: getAuthHeader() });
  return data;
};

export const addNote = async (noteData) => {
  const { data } = await axios.post(API_URL, noteData, { headers: getAuthHeader() });
  return data;
};

export const updateNote = async (id, noteData) => {
  const { data } = await axios.put(`${API_URL}/${id}`, noteData, { headers: getAuthHeader() });
  return data;
};

export const deleteNote = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return data;
};
