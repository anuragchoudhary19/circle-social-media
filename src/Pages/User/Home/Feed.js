import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
//
import { getFeed } from '../../../functions/tweet';
//
import Loader from '../../../Components/Elements/Loader/Loader';
import styles from './Home.module.css';
import Card from '../../../Components/Card/Card';

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
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
        console.log(res.data.feed);
      })
      .catch((err) => {
        setLoading(false);
        setError('Something went wrong');
      });
  };
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  return (
    <>
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
    </>
  );
};

export default Feed;
