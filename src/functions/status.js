import axios from 'axios';

export const createStatus = async (text, token) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/status`,
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getStatus = async (statusId, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/status/${statusId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getStatusComments = async (statusId, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/status/comments/${statusId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listStatuses = async (username, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/status/all/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getFeed = async (token) => {
  return await axios.get(`${process.env.REACT_APP_API}/status/feed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getStatusLikedByThisUser = async (userId, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/status/likes/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeStatus = async (id, token) => {
  return await axios.delete(`${process.env.REACT_APP_API}/status/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const removeComment = async (id, token) => {
  return await axios.delete(`${process.env.REACT_APP_API}//status/comment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const likeUnlikePost = async (postId, token) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/status/like/${postId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const retweet = async (postId, token) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/status/retweet/${postId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const commentOnPostHandle = async (comment, statusId, token) => {
  console.log(comment);
  return await axios.post(
    `${process.env.REACT_APP_API}/status/comment/${statusId}`,
    { comment },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
