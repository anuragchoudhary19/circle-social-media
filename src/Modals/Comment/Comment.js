import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { commentOnPostHandle } from '../../functions/status';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Comment.module.css';
import TextArea from '../../Components/Elements/TextArea/TextArea';
import Button from '../../Components/Elements/Button/Button';

const initialState = { text: '', photo: { photo_id: '', public_url: '' }, video: '' };
const Comment = ({ status, profile, socket, setIsOpen }) => {
  const [comment, setComment] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleComment = () => {
    if (!comment.text) return setError('Comment is empty');
    setLoading(true);
    commentOnPostHandle({ ...comment, statusId: status._id }, status._id, user.token)
      .then((res) => {
        setLoading(true);
        socket.emit('update', status._id);
        setComment(initialState);
      })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        setLoading(false);
        setError('Error in posting comment');
      });
  };
  const commentHandle = (element) => {
    setError('');
    console.log(element);
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '50px';
      target.style.height = `${target.scrollHeight}px`;
    }
    setComment({ ...comment, text: element.target.value });
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
            <div className={styles.status}>{status?.text}</div>
          </header>
        </div>
        <div className={styles.username}>
          replying to <span>@{profile.username}</span>
        </div>
        <div className={styles.textarea}>
          <div className={styles.avatar}>
            <img src={profile?.photo?.url} alt='profile' />
          </div>
          <TextArea
            comment={comment.text}
            placeholder='Reply here...'
            value={comment.text}
            onChange={(e) => commentHandle(e)}
          />
        </div>
        {error && (
          <div className={styles.error} style={{ color: 'red' }}>
            * {error}
          </div>
        )}
        <div className={styles.postButton}>
          <Button btnSize='sm' loading={loading} onClick={handleComment}>
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
