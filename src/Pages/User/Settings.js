import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, Switch, Route } from 'react-router-dom';
import Button from '../../Components/Elements/Button/Button';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Post from '../../Modals/StatusModal/StatusModal';
import { deleteUser } from '../../functions/user';
import styles from './Home.module.css';
const Settings = () => {
  const { post, user } = useSelector((state) => ({
    ...state,
  }));
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDeleteAccount = () => {
    deleteUser(user.token).then((res) => {
      console.log(res.data);
    });
  };
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <div className={styles.settings}>
          <header>Manage Settings</header>
          <div>
            <div style={{ color: 'red' }}>Delete Account</div>
            <Button text='Delete' width='20%' style={{ backgroundColor: 'red' }} onClick={handleDeleteAccount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
