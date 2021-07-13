import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
//
import { getFeed } from '../../../functions/status';
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
        feed.map((status) => {
          let card = null;
          if (status.statusId) {
            card = (
              <div className={styles.card} key={status.statusId._id}>
                <Card
                  status={status.statusId}
                  likes={status.statusId.likes}
                  forwards={status.statusId.retweets}
                  comments={status.statusId.comments}
                  profile={status.statusId.postedBy}
                  isStatus={true}
                  expand={false}
                />
                <Card
                  status={status}
                  likes={status.likes}
                  forwards={status.retweets}
                  comments={status.comments}
                  profile={status.commentedBy}
                  isComment={true}
                  expand={false}
                />
              </div>
            );
          } else {
            card = (
              <div className={styles.card} key={status._id}>
                <Card
                  status={status}
                  likes={status.likes}
                  forwards={status.retweets}
                  comments={status.comments}
                  profile={status.postedBy || status.commentedBy}
                  expand={false}
                />
              </div>
            );
          }
          return card;
        })}
    </>
  );
};

export default Feed;
