import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/groups`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('studySyncUser'));
  return { Authorization: `Bearer ${user.token}` };
};

export const createGroup = async (name, description) => {
  const { data } = await axios.post(API_URL, { name, description }, { headers: getAuthHeader() });
  return data;
};

export const joinGroup = async (code) => {
  const { data } = await axios.post(`${API_URL}/join`, { code }, { headers: getAuthHeader() });
  return data;
};

export const getUserGroups = async () => {
  const { data } = await axios.get(API_URL, { headers: getAuthHeader() });
  return data;
};

export const getGroupDetails = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return data;
};
