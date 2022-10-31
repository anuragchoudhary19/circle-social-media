import React, { useEffect, useState, useCallback } from 'react';
//
import { listTweets } from '../../../../functions/tweet';
import { useSocket } from '../../../../SocketProvider';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
import styles from './Tweets.module.css';

const Tweets = ({ userId, user }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  const loadTweets = useCallback(() => {
    setLoading(true);
    listTweets(userId, user.token)
      .then((res) => {
        setLoading(false);
        setTweets(res.data.tweets);
      })
      .catch((err) => {
        setLoading(false);
        setError('Not Found');
      });
  }, [userId, user.token]);
  useEffect(() => {
    socket.on(`new tweet on profile ${userId}`, (tweet) => {
      setTweets((prevValue) => [tweet, ...prevValue]);
    });
    socket.on('tweet-deleted', (tweetId) => {
      setTweets((prevValue) => [...prevValue.filter((item) => item._id !== tweetId)]);
    });
  }, [socket, userId]);
  useEffect(() => {
    loadTweets();
    return () => {
      loadTweets();
      setLoading(false);
      setTweets([]);
      setError('');
    };
  }, [userId, user.token, loadTweets]);
  if (loading)
    return (
      <div className={styles.statuses}>
        <Loader />
      </div>
    );
  if (error) return <div className={styles.statuses}>{error}</div>;
  return (
    <div className={styles.statuses}>
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <div className={styles.card} key={tweet._id}>
            <Card tweet={tweet} expand={false} reload={loadTweets} />
          </div>
        ))
      ) : (
        <div>{user._id === userId ? 'Make your first post' : 'No post yet'}</div>
      )}
    </div>
  );
};

export default Tweets;
