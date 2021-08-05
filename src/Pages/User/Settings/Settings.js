import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../../Components/Elements/Button/Button';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import { deleteUser } from '../../../functions/user';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Settings.module.css';
const Settings = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDeleteAccount = () => {
    deleteUser(user.token).then((res) => {
      localStorage.setItem('user', '');
      dispatch({
        type: 'LOGOUT',
        payload: '',
      });
      history.push('/');
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
          <h2>Settings</h2>
        </header>
        <div className={styles.settings}>
          <div>
            <div style={{ color: 'red' }}>Delete Account</div>
            <div>
              <Button btnStyle='primarySolid' btnSize='md' onClick={handleDeleteAccount}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
