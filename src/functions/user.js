import axios from 'axios';

export const getUser = async (token) => {
  return await axios.get(`${process.env.REACT_APP_API}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getProfile = async (username, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getFollowers = async (username, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/followers/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getFollowing = async (username, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/following/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getAllUsers = async (token) => {
  return await axios.get(`${process.env.REACT_APP_API}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getNewUsers = async (token) => {
  return await axios.get(`${process.env.REACT_APP_API}/newUsers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getSearchedUsers = async (query, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/users/${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const updateUser = (userData, token) => {
  return axios.put(
    `${process.env.REACT_APP_API}/user`,
    { userData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const removeImage = async (image, token) => {
  return await axios.delete(`${process.env.REACT_APP_API}/user/delete-image/${image}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const deleteUser = async (token) => {
  return await axios.delete(`${process.env.REACT_APP_API}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const setUserInLocalStorage = (res, token) => {
  window.localStorage.setItem('user', JSON.stringify({ ...res.data }));
};
const setUserInReduxStore = (res, token, dispatch) => {
  dispatch({
    type: 'LOGGED_IN_USER',
    payload: { ...res.data },
  });
};
export const unsubscribe = async (token, dispatch) => {
  return await getUser(token)
    .then((res) => {
      console.log(res);
      setUserInLocalStorage(res, token);
      setUserInReduxStore(res, token, dispatch);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const followUser = async (id, token) => {
  return await axios.patch(
    `${process.env.REACT_APP_API}/user/follow/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const unFollowUser = async (id, token) => {
  return await axios.patch(
    `${process.env.REACT_APP_API}/user/unfollow/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
