import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../Button/Button';
import { followUser, unFollowUser, unsubscribe } from '../../../functions/user';

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
    <div style={{ width: '100%', marginLeft: 'auto', marginRight: '1rem' }}>
      {user?.following?.find((ele) => ele._id === profile._id) ? (
        <Button width='100%' text='Following' onClick={() => handleUnFollow(profile._id)} />
      ) : (
        <Button width='100%' text='Follow' onClick={() => handleFollow(profile._id)} />
      )}
    </div>
  );
};

export default FollowButton;
