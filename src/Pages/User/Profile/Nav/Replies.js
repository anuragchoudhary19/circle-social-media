import React, { useEffect, useState } from 'react';
//
import { getComments } from '../../../../functions/timeline';
//
import Card from '../../../../Components/Card/Card';
import Loader from '../../../../Components/Elements/Loader/Loader';
import styles from './Tweets.module.css';

const Replies = ({ profile, user }) => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadStatuses();
  }, [profile]);
  const loadStatuses = () => {
    setLoading(true);
    getComments(profile.username, user.token)
      .then((res) => {
        setStatuses(res.data.comments);
        console.log(res.data.comments);
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
      ) : statuses.length ? (
        statuses.map((status) => (
          <div className={styles.card} key={status.statusId._id}>
            <Card
              status={status.statusId}
              likes={status.statusId.likes}
              forwards={status.statusId.retweets}
              comments={status.statusId.comments}
              profile={status.statusId.postedBy}
              isStatus={true}
              expand={false}
            />
            <Card
              status={status}
              likes={status.likes}
              forwards={status.retweets}
              comments={status.comments}
              profile={status.commentedBy}
              isComment={true}
              expand={false}
            />
          </div>
        ))
      ) : (
        <div>Make your first post</div>
      )}
    </div>
  );
};

export default Replies;
