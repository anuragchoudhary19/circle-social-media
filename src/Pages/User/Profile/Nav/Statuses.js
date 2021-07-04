import React, { useEffect, useState } from 'react';
//
import { listStatuses } from '../../../../functions/status';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
import styles from './Posts.module.css';

const Statuses = ({ profile, user }) => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadStatuses();
  }, [profile]);
  const loadStatuses = () => {
    setLoading(true);
    listStatuses(profile._id, user.token)
      .then((res) => {
        setStatuses(res.data.statuses);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.posts}>
      {loading ? (
        <Loader />
      ) : statuses.length ? (
        statuses.map((status) => (
          <Card
            key={status._id}
            status={status}
            likes={status.likes}
            forwards={status.retweets}
            comments={status.comments}
            profile={profile}
            reload={loadStatuses}
            expand={false}
          />
        ))
      ) : (
        <div>Make your first post</div>
      )}
    </div>
  );
};

export default Statuses;
