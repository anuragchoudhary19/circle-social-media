import React from 'react';
import { Link } from 'react-router-dom';
//
import FollowButton from './../Elements/FollowButton/FollowButton';
//
import styles from './Usercard.module.css';

const Usercard = ({ profile }) => {
  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        <Link to={`/${profile.username}`}>
          <img src={profile?.photo?.url} alt='profile' />
        </Link>
      </div>
      <div className={styles.user}>
        <div className={styles.name}>
          <Link to={`/${profile.username}`}>
            {profile.firstname} {profile.lastname}
          </Link>
        </div>
        <div className={styles.username}>
          <Link to={`/${profile.username}`}>@{profile.username} </Link>
        </div>
      </div>
      <div className={styles.button}>
        <FollowButton profileId={profile._id} />
      </div>
    </div>
  );
};

export default Usercard;
