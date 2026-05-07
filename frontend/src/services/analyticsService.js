import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('studySyncUser'));
  return { Authorization: `Bearer ${user.token}` };
};

export const getAnalytics = async () => {
  const { data } = await axios.get(API_URL, { headers: getAuthHeader() });
  return data;
};
