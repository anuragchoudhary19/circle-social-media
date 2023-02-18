import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
//
import { getFeed } from '../../../functions/tweet';
import { useSocket } from '../../../SocketProvider';
//
import Loader from '../../../Components/Elements/Loader/Loader';
import styles from './Home.module.css';
import Card from '../../../Components/Card/Card';

const Feed = () => {
  const socket = useSocket();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const loadFeed = useCallback(() => {
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
  }, [user.token]);
  useEffect(() => {
    socket.on('fetch-new-list', (socketId) => {
      loadFeed();
    });
  }, [loadFeed, socket]);
  useEffect(() => {
    loadFeed();
    return () => loadFeed();
  }, [loadFeed]);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  return (
    <div id='feed' className={styles.feed}>
      {feed.length === 0 && <div className={styles.noFeed}>No tweets to show</div>}
      {feed.length > 0 &&
        feed.map((tweet) => (
          <div className={styles.card} key={tweet._id}>
            {tweet.isReply ? (
              <>
                {tweet.repliedTo ? (
                  <Card tweet={tweet.repliedTo} isTweet={true} expand={false} reload={loadFeed} />
                ) : (
                  <div className={styles.deletedTweet}>This tweet has been deleted.</div>
                )}
                <Card tweet={tweet} isReply={true} expand={false} reload={loadFeed} />
              </>
            ) : (
              <Card tweet={tweet} expand={false} reload={loadFeed} />
            )}
          </div>
        ))}
    </div>
  );
};

export default Feed;
