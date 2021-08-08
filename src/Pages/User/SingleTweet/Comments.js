import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
//
import Card from '../../../Components/Card/Card';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { getTweetComments } from '../../../functions/tweet';
import { useSocket } from '../../../SocketProvider';
//
import styles from './SingleTweet.module.css';

const Comments = ({ tweetId }) => {
  const socket = useSocket();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTweetComments(tweetId, user.token);
      setComments(res.data.comments);
      setLoading(false);
    } catch (error) {
      setError('Not found');
      setLoading(false);
    }
  }, [tweetId, user.token]);
  useEffect(() => {
    socket.on(`comment on ${tweetId}`, (comment) => {
      setComments((prevValue) => [comment, ...prevValue]);
    });
  }, [loadComments, socket, tweetId]);
  useEffect(() => {
    loadComments();
    return () => loadComments;
  }, [tweetId, loadComments]);

  return !loading ? (
    <div className={styles.comments}>
      {error && <div className={styles.error}>{error}</div>}
      {comments?.map((comment) => (
        <div className={styles.card} key={comment._id}>
          <Card tweet={comment} expand={false} />
        </div>
      ))}
    </div>
  ) : (
    <Loader />
  );
};

export default Comments;
