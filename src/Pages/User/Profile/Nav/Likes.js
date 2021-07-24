import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
//
import { SocketContext } from '../../../../App';
import { getLikes } from '../../../../functions/timeline';
import styles from './Tweets.module.css';

const Likes = ({ user }) => {
  const { username } = useParams();
  const socket = useContext(SocketContext);
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    socket.on('status-delete', (id) => {
      if (id === socket.id) {
        loadLikes();
      }
    });
  }, []);
  useEffect(() => {
    loadLikes();
    return () => loadLikes();
  }, [username]);
  const loadLikes = () => {
    setLoading(true);
    getLikes(username, user.token)
      .then((res) => {
        setLikes(res.data.likes);
        setLoading(false);
      })
      .catch((err) => {
        setError('Something went wrong');
        setLoading(false);
      });
  };
  if (error) return <div className={styles.statuses}>{error}</div>;
  if (loading)
    return (
      <div className={styles.statuses}>
        <Loader />
      </div>
    );
  return (
    <div className={styles.statuses}>
      {likes?.length > 0 &&
        likes.map((status) => (
          <div className={styles.card} key={status._id}>
            <Card
              status={status}
              likes={status.likes}
              forwards={status.retweets}
              comments={status.comments}
              profile={status.postedBy}
              expand={false}
            />
          </div>
        ))}
    </div>
  );
};

export default Likes;
