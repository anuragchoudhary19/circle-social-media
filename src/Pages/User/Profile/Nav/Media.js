import React, { useEffect, useState, useCallback } from 'react';
//
import { getTweetsWithMedia } from '../../../../functions/tweet';
import { useSocket } from '../../../../SocketProvider';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
import styles from './Tweets.module.css';

const Media = ({ userId, user }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const socket = useSocket();
  const loadMedia = useCallback(() => {
    setLoading(true);
    getTweetsWithMedia(userId, user.token)
      .then((res) => {
        setTweets(res.data.tweets);
        setLoading(false);
        console.log(res.data.tweets);
      })
      .catch((err) => {
        setError('Not Found');
        setLoading(false);
      });
  }, [userId, user.token]);
  useEffect(() => {
    socket.on('fetch-new-list', () => {
      loadMedia();
    });
  }, [socket, loadMedia]);
  useEffect(() => {
    loadMedia();
    return () => loadMedia();
  }, [userId, user.token, loadMedia]);

  if (error) return <div>{error}</div>;
  return (
    <div className={styles.statuses}>
      {loading ? (
        <Loader />
      ) : tweets?.length ? (
        tweets.map((tweet) => (
          <div className={styles.card} key={tweet._id}>
            <Card tweet={tweet} isReply={true} expand={false} />
          </div>
        ))
      ) : (
        <div>No media yet</div>
      )}
    </div>
  );
};

export default Media;
