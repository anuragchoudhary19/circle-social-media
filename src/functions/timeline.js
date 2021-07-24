import axios from 'axios';

export const getStatuses = async (username, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/statuses/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getLikes = async (username, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/likes/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getComments = async (username, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/comments/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
