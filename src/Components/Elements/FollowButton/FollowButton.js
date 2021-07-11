import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
//
import Button from '../Button/Button';
import { followUser, unFollowUser, unsubscribe } from '../../../functions/user';
import styles from './FollowButton.module.css';

const FollowButton = ({ profile, socket }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const handleFollow = (id) => {
    followUser(id, user.token)
      .then((res) => {
        unsubscribe(user.token, dispatch);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUnFollow = (id) => {
    unFollowUser(id, user.token)
      .then((res) => {
        unsubscribe(user.token, dispatch);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.followButton}>
      {user?.following?.find((ele) => ele._id === profile._id) ? (
        <Button text='Following' onClick={() => handleUnFollow(profile._id)} />
      ) : (
        <Button outline={true} text='Follow' onClick={() => handleFollow(profile._id)} />
      )}
    </div>
  );
};

export default FollowButton;
