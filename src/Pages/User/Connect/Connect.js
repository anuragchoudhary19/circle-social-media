import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Usercard from '../../../Components/Usercard/Usercard';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllUsers } from '../../../functions/user';
import styles from './Connect.module.css';

const Connect = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  useEffect(() => {
    const loadProfile = () => {
      setLoading(true);
      getAllUsers(user.token).then((res) => {
        setLoading(false);
        setUsers(res.data.users);
      });
    };
    loadProfile();
  }, [user]);

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
          <h2>Connect</h2>
        </header>
        {loading ? (
          <Loader />
        ) : users?.length ? (
          users.map((user) => (
            <div key={user._id} className={styles.user}>
              <Usercard profile={user} />
            </div>
          ))
        ) : (
          <div>No User To Follow</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Connect;
