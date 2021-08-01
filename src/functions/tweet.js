import axios from 'axios';

export const createTweet = async (tweet, token) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/tweet`,
    { tweet },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getTweet = async (tweetId, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/tweet/${tweetId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getReplies = async (userId, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/tweets/replies/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listTweets = async (userId, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/tweets/all/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getFeed = async (token) => {
  return await axios.get(`${process.env.REACT_APP_API}/feed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getLikedTweets = async (userId, token) => {
  return await axios.get(`${process.env.REACT_APP_API}/tweets/likes/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeTweet = async (id, token) => {
  return await axios.delete(`${process.env.REACT_APP_API}/tweet/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const likeTweet = async (tweetId, token) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/tweet/like/${tweetId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const retweetTweet = async (tweetId, token) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/tweet/retweet/${tweetId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const commentOnTweet = async (comment, tweetId, token) => {
  console.log(comment);
  return await axios.post(
    `${process.env.REACT_APP_API}/tweet/comment/${tweetId}`,
    { comment },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
