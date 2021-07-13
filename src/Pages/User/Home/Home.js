import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
//
import { createStatus } from '../../../functions/status';
//
import Button from '../../../Components/Elements/Button/Button';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Recommendations from '../Recommendations/Recommendations';
import TextArea from '../../../Components/Elements/TextArea/TextArea';
//
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Feed from './Feed';
import styles from './Home.module.css';

const Home = () => {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();

  const handleStatus = (element) => {
    console.log(element);
    setError('');
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '4rem';
      target.style.height = `${target.scrollHeight}px`;
    }
    setStatus(element.target.value);
  };
  const postStatus = () => {
    if (!status) return setError('Status cannot be empty');
    setLoading(true);
    createStatus(status, user.token)
      .then((res) => {
        setLoading(false);
        setStatus('');
      })
      .catch((err) => {
        setLoading(false);
        setError('Error in posting the status');
      });
  };
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <header>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: '1.5rem', color: '#f1f1f1', margin: '0 1rem', cursor: 'pointer' }}
            onClick={() => history.goBack()}
          />
          <h2>Home</h2>
        </header>
        <div className={styles.status}>
          <img src={user.photo.url} alt='profile' />
          <div className={styles.textarea}>
            <TextArea value={status} onChange={(e) => handleStatus(e)} placeholder='Write here...' />
            {error && <span>*{error}</span>}
          </div>
          <div className={styles.postButton}>
            <Button onClick={postStatus} loading={loading}>
              Post
            </Button>
          </div>
        </div>
        <div className={styles.feed}>
          <Feed />
        </div>
      </div>
      <Footer>
        <Recommendations />
      </Footer>
    </div>
  );
};

export default Home;
