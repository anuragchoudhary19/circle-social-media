import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { logout } from '../../functions/auth';
import { SocketContext } from '../../App';
import { store } from '../../index';

import Button from '../../Components/Elements/Button/Button';
import Post from '../../Modals/StatusModal/StatusModal';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const socket = useContext(SocketContext);
  let [classes, setClasses] = useState([styles.sidebar]);
  const { user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();
  let history = useHistory();

  const handleStatusModal = () => {
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <Post user={user} socket={socket} />
        </BrowserRouter>
      </Provider>,
      document.getElementById('modal')
    );
  };
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
  const toggleSidebar = () => {
    let style = [...classes];
    if (style.includes(styles.active)) {
      style.pop(styles.active);
      setClasses(style);
    } else {
      style.push(styles.active);
      setClasses(style);
    }
    console.log(classes);
  };
  const closeSidebar = () => {
    toggleSidebar();
  };
  return (
    <div
      className={styles.backdrop}
      onClick={closeSidebar}
      data-toggle={classes.includes(styles.active) ? true : false}>
      <div className={styles.toggle} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={classes.join(' ')}>
        <ul>
          <li>
            <NavLink to='/home' activeStyle={{ color: '#087fc4' }}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={`/${user.username}`} activeStyle={{ color: '#087fc4' }}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to='/connect' activeStyle={{ color: '#087fc4' }}>
              Connect
            </NavLink>
          </li>
          <li>
            <NavLink to='/settings' activeStyle={{ color: '#087fc4' }}>
              Settings
            </NavLink>
          </li>
          <li>
            <Button text='Status' width='60%' onClick={handleStatusModal} />
          </li>
        </ul>
        <div className={styles.logoutButton}>
          <Button
            text='Logout'
            width='60%'
            onClick={handleLogout}
            style={{ marginTop: 'auto', marginBottom: '1rem' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
