import React, { useEffect, useState, useContext } from 'react';
//
import { listTweets } from '../../../../functions/tweet';
import { SocketContext } from '../../../../App';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
import styles from './Tweets.module.css';

const Statuses = ({ userId, user }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on('feed-reload', (id) => {
      if (id === socket.id) {
        loadTweets();
      }
    });
  }, []);
  useEffect(() => {
    loadTweets();
  }, [userId]);
  const loadTweets = () => {
    setLoading(true);
    listTweets(userId, user.token)
      .then((res) => {
        setTweets(res.data.tweets);
        setLoading(false);
      })
      .catch((err) => {
        setError('Not Found');
        setLoading(false);
      });
  };
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
            <Card tweet={tweet} reload={loadTweets} expand={false} />
          </div>
        ))
      ) : (
        <div>{user._id === userId ? 'Make your first post' : 'No post yet'}</div>
      )}
    </div>
  );
};

export default Statuses;
