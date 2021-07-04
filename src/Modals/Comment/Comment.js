import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { commentOnPostHandle } from '../../functions/status';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Comment.module.css';

const Comment = ({ post, profile, socket }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));

  const closeModal = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal'));
  };
  const handleComment = () => {
    if (!comment) return setError('Comment is empty');
    commentOnPostHandle(comment, post._id, user.token)
      .then((res) => {
        socket.emit('update', post._id);
      })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        setError('Error in posting comment');
      });
  };
  const commentHandle = (value) => {
    setError('');
    setComment(value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.modal}>
        <div className={styles.close}>
          <FontAwesomeIcon
            icon={faTimes}
            style={{ marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}
            onClick={closeModal}
          />
        </div>
        <div className={styles.post}>
          <div className={styles.avatar}>
            <img src={profile?.photo?.url} alt='profile' />
          </div>
          <header className={styles.header}>
            <div className={styles.status}>{post?.post}</div>
          </header>
        </div>
        <div className={styles.username}>
          replying to <span>@{profile.username}</span>
        </div>
        <div className={styles.textarea}>
          <div className={styles.avatar}>
            <img src={profile?.photo?.url} alt='profile' />
          </div>
          <textarea
            rows='6'
            placeholder='Post your reply'
            value={comment}
            onChange={(e) => commentHandle(e.target.value)}
          />
        </div>
        {error && (
          <div className={styles.error} style={{ color: 'red' }}>
            * {error}
          </div>
        )}
        <button className={styles.postButton} onClick={handleComment}>
          Reply
        </button>
      </div>
    </div>
  );
};

export default Comment;
