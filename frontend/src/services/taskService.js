import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('studySyncUser'));
  return { Authorization: `Bearer ${user.token}` };
};

export const getTasks = async (groupId = null) => {
  const url = groupId ? `${API_URL}?groupId=${groupId}` : API_URL;
  const { data } = await axios.get(url, { headers: getAuthHeader() });
  return data;
};

export const addTask = async (taskData) => {
  const { data } = await axios.post(API_URL, taskData, { headers: getAuthHeader() });
  return data;
};

export const updateTask = async (id, taskData) => {
  const { data } = await axios.put(`${API_URL}/${id}`, taskData, { headers: getAuthHeader() });
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return data;
};
