import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
//
import { useSocket } from '../../../../SocketProvider';
import { getLikedTweets } from '../../../../functions/tweet';
import styles from './Tweets.module.css';

const Likes = (props) => {
  const { userId } = props;
  const socket = useSocket();
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const loadLikes = useCallback(() => {
    setLoading(true);
    getLikedTweets(userId, user.token)
      .then((res) => {
        setLikes(res.data.tweets);
        setLoading(false);
      })
      .catch((err) => {
        setError('Something went wrong');
        setLoading(false);
      });
  }, [userId, user.token]);
  useEffect(() => {
    socket.on('unlike', (unLikedBy, tweetId) => {
      if (unLikedBy === userId) {
        setLikes((prevValue) => [...prevValue.filter((item) => item._id !== tweetId)]);
      }
    });
    socket.on('tweet-deleted', (tweetId) => {
      setLikes((prevValue) => [...prevValue.filter((item) => item._id !== tweetId)]);
    });
  }, [socket, userId]);
  useEffect(() => {
    loadLikes();
    return () => loadLikes();
  }, [userId, user.token, loadLikes]);

  if (error) return <div className={styles.statuses}>{error}</div>;
  if (loading)
    return (
      <div className={styles.statuses}>
        <Loader />
      </div>
    );
  return (
    <div className={styles.statuses}>
      {likes?.length > 0 &&
        likes.map((tweet) => (
          <div className={styles.card} key={tweet._id}>
            <Card tweet={tweet} expand={false} />
          </div>
        ))}
    </div>
  );
};

export default Likes;
