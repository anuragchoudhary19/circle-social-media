import React, { useEffect, useState, useContext } from 'react';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
//
import { SocketContext } from '../../../../App';
import { getStatusLikedByThisUser } from '../../../../functions/status';
import styles from './Statuses.module.css';

const Likes = ({ profile, user }) => {
  const { _id } = profile;
  const socket = useContext(SocketContext);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on('reload', (id) => {
      if (id === socket.id) {
        loadLikes();
      }
    });
  }, []);
  useEffect(() => {
    loadLikes();
    return () => loadLikes();
  }, [_id]);
  const loadLikes = () => {
    setLoading(true);
    getStatusLikedByThisUser(profile._id, user.token)
      .then((res) => {
        setLikes(res.data.status);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.statuses}>
      {loading ? (
        <Loader />
      ) : likes?.length ? (
        likes.map((status) => (
          <Card
            key={status._id}
            status={status}
            likes={status.likes}
            forwards={status.retweets}
            comments={status.comments}
            profile={profile}
            expand={false}
          />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Likes;
