import React, { useEffect, useState } from 'react';
//
import { getReplies } from '../../../../functions/tweet';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
import styles from './Tweets.module.css';

const Replies = ({ userId, user }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    loadStatuses();
    return () => loadStatuses;
  }, [userId]);
  const loadStatuses = () => {
    setLoading(true);
    getReplies(userId, user.token)
      .then((res) => {
        setTweets(res.data.tweets);
        console.log(res.data.tweets);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };
  if (error) return <div>{error}</div>;
  return (
    <div className={styles.statuses}>
      {loading ? (
        <Loader />
      ) : tweets.length ? (
        tweets.map((tweet) => (
          <div className={styles.card} key={tweet._id}>
            <Card tweet={tweet.repliedTo} isTweet={true} expand={false} />
            <Card tweet={tweet} isReply={true} expand={false} />
          </div>
        ))
      ) : (
        <div>Make your first post</div>
      )}
    </div>
  );
};

export default Replies;
