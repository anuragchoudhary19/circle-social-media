import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, Switch, Route } from 'react-router-dom';
import Button from '../../Components/Elements/Button/Button';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Post from '../../Modals/StatusModal/StatusModal';
import Profile from './Home';
import { logout } from '../../functions/auth';
import styles from './Home.module.css';
const Home = () => {
  const { post } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    logout().then((res) => {
      localStorage.setItem('user', '');
      dispatch({
        type: 'LOGOUT',
        payload: '',
      });
      history.push('/');
      console.log(res.data.message);
    });
  };
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <div className={styles.content}>Home</div>
      </div>
    </div>
  );
};

export default Home;
