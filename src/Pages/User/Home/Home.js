import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
//
import { createTweet } from '../../../functions/tweet';

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
  const [tweet, setTweet] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  const main = useRef();
  useEffect(() => {
    if (!user?.token) {
      history.push('/');
    }
  }, [history, user]);
  useEffect(() => {
    document.addEventListener('keydown', scrollPage);
    return () => document.removeEventListener('keydown', scrollPage);
  });
  const scrollPage = (e) => {
    if (e.code === 'Home') {
      main.current.scrollTop = 0;
    }
  };
  const handleTweet = (element) => {
    setError('');
    setTweet(element.target.value);
  };
  const postTweet = () => {
    if (!tweet) return setError('Write a tweet');
    setLoading(true);
    createTweet(tweet, user.token)
      .then((res) => {
        setLoading(false);
        setTweet('');
      })
      .catch((err) => {
        setLoading(false);
        setError('Error in posting the status');
      });
  };
  return (
    <div className={styles.page}>
      <Sidebar />
      <div id='home' className={styles.main} ref={main}>
        <header>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: '1.5rem', color: '#f1f1f1', margin: '0 1rem', cursor: 'pointer' }}
            onClick={() => history.goBack()}
          />
          <h2>Home</h2>
        </header>
        <div className={styles.tweetBox}>
          <div className={styles.profilePic}>
            <img src={user.photo.url} alt='profile' />
          </div>
          <div className={styles.textarea}>
            <TextArea value={tweet} onChange={(e) => handleTweet(e)} placeholder='Write here...' />
            {error && <span>*{error}</span>}
          </div>
          <div className={styles.postButton}>
            <Button onClick={postTweet} loading={loading}>
              Post
            </Button>
          </div>
        </div>
        <Feed />
      </div>
      <Footer>
        <Recommendations />
      </Footer>
    </div>
  );
};

export default Home;
