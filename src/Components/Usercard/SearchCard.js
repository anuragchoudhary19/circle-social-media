import React from 'react';
import { Link } from 'react-router-dom';
//
import styles from './Usercard.module.css';

const Searchcard = ({ profile }) => {
  return (
    <div className={styles.searchCard}>
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
    </div>
  );
};

export default Searchcard;
