import React, { useState } from 'react';
//
import { createTweet } from '../../functions/tweet';
//
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextArea from '../../Components/Elements/TextArea/TextArea';
import Button from '../../Components/Elements/Button/Button';
import styles from './TweetModal.module.css';

const TweetModal = ({ user, setIsOpen }) => {
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const closeModal = () => {
    setIsOpen(false);
  };
  const postStatus = () => {
    if (!tweet) return setError('Status cannot be empty');
    setLoading(true);
    createTweet(tweet, user.token)
      .then((res) => {
        setLoading(false);
      })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        setLoading(false);
        setError('Error in posting the status');
      });
  };
  const statusHandler = (element) => {
    setError('');
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '150px';
      target.style.height = `${target.scrollHeight}px`;
    }
    setTweet(element.target.value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.modal} draggable='true'>
        <header className={styles.close}>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              style={{ marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}
              onClick={closeModal}
            />
          </div>
        </header>
        <div className={styles.status}>
          <div className={styles.avatar}>
            <img src={user?.photo?.url} alt='profile' />
          </div>
          <div className={styles.textarea}>
            <TextArea rows='8' placeholder='Write here...' value={tweet} onChange={(e) => statusHandler(e)} />
          </div>
        </div>
        {error && (
          <div className={styles.error} style={{ color: 'red' }}>
            * {error}
          </div>
        )}
        <div className={styles.button}>
          <Button btnStyle='primarySolid' btnSize='sm' loading={loading} onClick={postStatus}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TweetModal;
