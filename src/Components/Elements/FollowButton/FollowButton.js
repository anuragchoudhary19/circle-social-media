import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//
import { followUser, unFollowUser } from '../../../functions/user';
//
import Button from '../Button/Button';
//

const FollowButton = ({ profileId }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [following, setfollowing] = useState([...user?.following]);
  const dispatch = useDispatch();
  const handleFollow = (id) => {
    const list = [...following];
    followUser(id, user.token)
      .then((res) => {
        if (res.data.success) {
          list.push(id);
          setfollowing([...list]);
          window.localStorage.setItem('user', JSON.stringify({ ...user, following: list }));
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: { ...user, following: list },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUnFollow = (id) => {
    const list = [...following];
    unFollowUser(id, user.token)
      .then((res) => {
        if (res.data.success) {
          let index = list.indexOf(id);
          if (index > -1) {
            list.splice(index, 1);
          }
          setfollowing([...list]);
          window.localStorage.setItem('user', JSON.stringify({ ...user, following: list }));
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: { ...user, following: list },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (profileId === user._id) return null;
  return (
    <>
      {following.includes(profileId) ? (
        <Button btnStyle='primarySolid' btnSize='sm' onClick={() => handleUnFollow(profileId)}>
          Following
        </Button>
      ) : (
        <Button btnStyle='primaryOutline' btnSize='sm' onClick={() => handleFollow(profileId)}>
          Follow
        </Button>
      )}
    </>
  );
};

export default FollowButton;
