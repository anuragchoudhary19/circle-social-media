import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
//
import Card from '../../../Components/Card/Card';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { getTweet } from '../../../functions/tweet';
//
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Recommendations from '../Recommendations/Recommendations';
import Comments from './Comments';
import styles from './SingleTweet.module.css';

const SingleTweet = () => {
  const { id } = useParams();
  const [tweet, setTweet] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  const loadTweet = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTweet(id, user.token);
      setTweet(res.data.tweet);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, [id, user.token]);
  useEffect(() => {
    loadTweet();
  }, [loadTweet]);
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <header className={styles.header}>
          <FontAwesomeIcon icon={faArrowLeft} onClick={() => history.goBack()} />
          <h2>Tweet</h2>
        </header>
        {error && <div className={styles.error}>This tweet is doesn't exist.</div>}
        <div className={styles.card}>
          {loading ? (
            <Loader />
          ) : tweet ? (
            <Card tweet={tweet} expand={true} />
          ) : (
            <div className={styles.error}>This tweet is unavailable.</div>
          )}
        </div>
        {tweet && <Comments tweetId={tweet._id} />}
      </div>
      <Footer>
        <Recommendations />
      </Footer>
    </div>
  );
};

export default SingleTweet;
