import axios from 'axios';

export const signup = async (username, email, password) => {
  return await axios.post(`${process.env.REACT_APP_API}/signup`, { username, email, password }, {});
};
export const signin = async (email, password) => {
  return await axios.post(`${process.env.REACT_APP_API}/signin`, { email, password }, {});
};
export const logout = async (email, password) => {
  return await axios.get(`${process.env.REACT_APP_API}/logout`);
};
