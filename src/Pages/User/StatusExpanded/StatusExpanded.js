import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
//
import Card from '../../../Components/Card/Card';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { getStatus } from '../../../functions/status';
import { SocketContext } from '../../../App';
//
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Recommendations from '../Recommendations/Recommendations';
import Comments from './Comments';
import styles from './StatusExpanded.module.css';

const StatusExpanded = () => {
  const { id } = useParams();
  const [status, setStatus] = useState();
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  useEffect(() => {
    loadStatus();
    return () => loadStatus;
  }, [id]);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await getStatus(id, user.token);
      setStatus(res.data.status);
      console.log(res.data.status);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  return !error ? (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <header>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: '1.5rem', color: '#f1f1f1', margin: '0 1rem', cursor: 'pointer' }}
            onClick={() => history.goBack()}
          />
          <h2>Status</h2>
        </header>
        {!loading && status ? (
          <div className={styles.card}>
            <Card
              status={status}
              likes={status.likes}
              forwards={status.retweets}
              comments={status.comments}
              profile={status.postedBy}
              expand={true}
            />
          </div>
        ) : (
          <Loader />
        )}
        {status && <Comments statusId={status._id} />}
      </div>
      <Footer>
        <Recommendations />
      </Footer>
    </div>
  ) : (
    <div>Not Found</div>
  );
};

export default StatusExpanded;
