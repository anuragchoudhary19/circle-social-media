import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (!user?.token) {
      history.push('/');
    }
  }, [history, user]);
  const handleTweet = (element) => {
    console.log(element);
    setError('');
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '4rem';
      target.style.height = `${target.scrollHeight}px`;
    }
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
      <div className={styles.main}>
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
