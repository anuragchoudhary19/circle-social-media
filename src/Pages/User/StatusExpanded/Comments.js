import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
//
import Card from '../../../Components/Card/Card';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { getStatusComments } from '../../../functions/status';
import { SocketContext } from '../../../App';
//
import styles from './StatusExpanded.module.css';

const Comments = ({ statusId }) => {
  const [comments, setComments] = useState();
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    socket.on('status-update', (updatedStatus) => {
      if (updatedStatus.id === statusId) {
        loadComments();
      }
    });
  }, []);
  useEffect(() => {
    loadComments();
    return () => loadComments();
  }, [statusId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await getStatusComments(statusId, user.token);
      setComments(res.data.comments);
      console.log(res.data.comments);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  return !loading ? (
    <div className={styles.comments}>
      {comments?.map((comment) => (
        <Card
          status={comment}
          likes={comment.likes}
          forwards={comment.retweets}
          profile={comment.commentedBy}
          key={comment._id}
          type='comment'
          expand={false}
        />
      ))}
    </div>
  ) : (
    <Loader />
  );
};

export default Comments;
