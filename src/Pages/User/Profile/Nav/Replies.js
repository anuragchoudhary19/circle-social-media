import React, { useEffect, useState, useCallback, useContext } from 'react';
//
import { getReplies } from '../../../../functions/tweet';
import { SocketContext } from '../../../../App';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
import styles from './Tweets.module.css';

const Replies = ({ userId, user }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const socket = useContext(SocketContext);
  const loadReplies = useCallback(() => {
    setLoading(true);
    getReplies(userId, user.token)
      .then((res) => {
        setTweets(res.data.tweets);
        setLoading(false);
      })
      .catch((err) => {
        setError('Not Found');
        setLoading(false);
      });
  }, [userId, user.token]);
  useEffect(() => {
    socket.on('fetch-new-list', () => {
      loadReplies();
    });
  }, [socket, loadReplies]);
  useEffect(() => {
    loadReplies();
    return () => loadReplies();
  }, [userId, user.token, loadReplies]);

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
        <div>No replies yet</div>
      )}
    </div>
  );
};

export default Replies;
