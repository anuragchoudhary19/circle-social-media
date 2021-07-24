import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
//
import Card from '../../../Components/Card/Card';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { getStatusComments } from '../../../functions/tweet';
import { SocketContext } from '../../../App';
//
import styles from './SingleTweet.module.css';

const Comments = ({ comments }) => {
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState(false);

  return !loading ? (
    <div className={styles.comments}>
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
