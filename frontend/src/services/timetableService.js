import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/timetable`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('studySyncUser'));
  return { Authorization: `Bearer ${user.token}` };
};

export const getTimetable = async (groupId = null) => {
  const url = groupId ? `${API_URL}?groupId=${groupId}` : API_URL;
  const { data } = await axios.get(url, { headers: getAuthHeader() });
  return data;
};

export const addEvent = async (eventData) => {
  const { data } = await axios.post(API_URL, eventData, { headers: getAuthHeader() });
  return data;
};

export const deleteEvent = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return data;
};
