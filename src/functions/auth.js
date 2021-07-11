import axios from 'axios';
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
export const signup = async (username, email, password) => {
  return await axios.post(`${process.env.REACT_APP_API}/signup`, { username, email, password }, { headers });
};
export const signin = async (email, password) => {
  return await axios.post(`${process.env.REACT_APP_API}/signin`, { email, password }, { headers });
};
export const logout = async (email, password) => {
  return await axios.get(`${process.env.REACT_APP_API}/logout`);
};
