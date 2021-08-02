import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
//
import { getFeed } from '../../../functions/tweet';
import { SocketContext } from '../../../App';
//
import Loader from '../../../Components/Elements/Loader/Loader';
import styles from './Home.module.css';
import Card from '../../../Components/Card/Card';

const Feed = () => {
  const socket = useContext(SocketContext);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    socket.on('feed-reload', (socketId) => {
      if (socketId === socket.id) {
        getFeed(user?.token)
          .then((res) => {
            setFeed(res.data.feed);
          })
          .catch((err) => {
            setError('Something went wrong');
          });
      }
    });
  }, []);
  useEffect(() => {
    loadFeed();
    return () => loadFeed();
  }, []);
  const loadFeed = () => {
    setLoading(true);
    getFeed(user.token)
      .then((res) => {
        setLoading(false);
        setFeed(res.data.feed);
      })
      .catch((err) => {
        setLoading(false);
        setError('Something went wrong');
      });
  };
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  return (
    <div className={styles.feed}>
      {feed.length > 0 &&
        feed.map((tweet) => {
          let card = null;
          if (tweet.isReply) {
            card = (
              <div className={styles.card} key={tweet._id}>
                <Card tweet={tweet.repliedTo} isTweet={true} expand={false} />
                <Card tweet={tweet} isReply={true} expand={false} />
              </div>
            );
          } else {
            card = (
              <div className={styles.card} key={tweet._id}>
                <Card tweet={tweet} expand={false} />
              </div>
            );
          }
          return card;
        })}
    </div>
  );
};

export default Feed;
