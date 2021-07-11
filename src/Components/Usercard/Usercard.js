import React, { useRef, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SocketContext } from '../../App';
import { store } from '../../index';
import { Link, BrowserRouter } from 'react-router-dom';
import date from 'date-and-time';
import styles from './Usercard.module.css';

import FollowButton from './../Elements/FollowButton/FollowButton';

const Usercard = ({ profile }) => {
  const socket = useContext(SocketContext);

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        <Link to={`/${profile.username}`}>
          <img src={profile?.photo?.url} alt='profile' />
        </Link>
      </div>
      <div className={styles.user}>
        <div className={styles.name}>
          {profile.firstname} {profile.lastname}
        </div>

        <div className={styles.username}>
          <Link to={`/${profile.username}`}>@{profile.username}</Link>
        </div>
      </div>
      <div className={styles.button}>
        <FollowButton profile={profile} socket={socket} />
      </div>
    </div>
  );
};

export default Usercard;
