import React, { useState } from 'react';
//
import { createStatus } from '../../functions/status';
//
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextArea from '../../Components/Elements/TextArea/TextArea';
import Button from '../../Components/Elements/Button/Button';
import styles from './StatusModal.module.css';

const StatusModal = ({ user, socket, setIsOpen }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const closeModal = () => {
    setIsOpen(false);
  };
  const postStatus = () => {
    if (!text) return setError('Status cannot be empty');
    setLoading(true);
    createStatus(text, user.token)
      .then((res) => {
        setLoading(false);
        socket.emit('new-post', socket.id);
      })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        setLoading(false);
        setError('Error in posting the status');
      });
  };
  const handleStatus = (element) => {
    setError('');
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '150px';
      target.style.height = `${target.scrollHeight}px`;
    }
    setText(element.target.value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.modal} draggable='true'>
        <header className={styles.close}>
          <FontAwesomeIcon
            icon={faTimes}
            style={{ marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}
            onClick={closeModal}
          />
        </header>
        <div className={styles.status}>
          <div className={styles.avatar}>
            <img src={user?.photo?.url} alt='profile' />
          </div>
          <div className={styles.textarea}>
            <TextArea rows='8' placeholder='Write here...' value={text} onChange={(e) => handleStatus(e)} />
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

export default StatusModal;
