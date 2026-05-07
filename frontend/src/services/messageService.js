import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages`;
const UPLOAD_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('studySyncUser'));
  return { Authorization: `Bearer ${user.token}` };
};

export const getMessages = async (groupId) => {
  const { data } = await axios.get(`${API_URL}/${groupId}`, { headers: getAuthHeader() });
  return data;
};

export const sendMessage = async (messageData) => {
  const { data } = await axios.post(API_URL, messageData, { headers: getAuthHeader() });
  return data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post(UPLOAD_URL, formData, { 
    headers: { 
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    } 
  });
  return data;
};

export const deleteMessage = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return data;
};
