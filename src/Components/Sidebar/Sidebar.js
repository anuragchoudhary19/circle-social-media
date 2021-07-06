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
//
import Button from '../../Components/Elements/Button/Button';
import Post from '../../Modals/StatusModal/StatusModal';
//
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Sidebar.module.css';
import Input from '../Elements/Input/Input';

const Sidebar = () => {
  const socket = useContext(SocketContext);
  let [open, setOpen] = useState(false);
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
    toggleSidebar();
  };
  const handleLogout = () => {
    logout().then((res) => {
      localStorage.setItem('user', '');
      dispatch({
        type: 'LOGOUT',
        payload: '',
      });
      history.push('/');
    });
  };
  const toggleSidebar = () => {
    setOpen(!open);
  };
  return (
    <div className={styles.sidebar}>
      <header>
        <div className={styles.toggle} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faAlignJustify} />
        </div>
        <Input placeholder='Search' />
      </header>
      <div className={styles.menu}>
        <div className={styles.backdrop} onClick={toggleSidebar} data-toggle={open}></div>
        <ul>
          <li className={styles.user}>
            <img src={user.photo.url} alt='profile' onClick={() => history.push(`/${user.username}`)} />
            <span>
              {user.firstname} {user.lastname}
            </span>
            <span>@{user.username}</span>
            <div>
              <span>Followers {user.followers.length}</span>
              <span>Following {user.following.length}</span>
            </div>
          </li>
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
          <li className={styles.logoutButton}>
            <Button
              text='Logout'
              width='60%'
              onClick={handleLogout}
              style={{ marginTop: 'auto', marginBottom: '1rem' }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
