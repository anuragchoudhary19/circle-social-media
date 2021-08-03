import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
//
import { SocketContext } from '../../../../App';
import { getLikedTweets } from '../../../../functions/tweet';
import styles from './Tweets.module.css';

const Likes = (props) => {
  const { userId } = props;
  const socket = useContext(SocketContext);
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    socket.on('feed-reload', (id) => {
      if (id === socket.id) {
        loadLikes();
      }
    });
  }, []);
  useEffect(() => {
    loadLikes();
    return () => loadLikes();
  }, [userId]);
  const loadLikes = () => {
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
  };
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
