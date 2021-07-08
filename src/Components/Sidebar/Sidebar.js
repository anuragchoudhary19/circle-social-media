import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../functions/auth';
import { SocketContext } from '../../App';
//
import Input from '../Elements/Input/Input';
import Modal from '../Modal/Modal';
import Button from '../../Components/Elements/Button/Button';
import StatusModal from '../../Modals/StatusModal/StatusModal';
//
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const socket = useContext(SocketContext);
  let [open, setOpen] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [query, setQuery] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();
  let history = useHistory();

  const handleStatusModal = () => {
    setIsOpen(true);
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

  const searchHandler = (e) => {
    setQuery(e.target.value);
  };
  return (
    <div className={styles.sidebar}>
      <div>
        <FontAwesomeIcon style={{ color: 'blue', fontSize: '2rem' }} icon={faAlignJustify} onClick={toggleSidebar} />
        <Input value={query} placeholder='Search' onChange={searchHandler} />
      </div>
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
          <li>
            <Button
              text='Logout'
              width='60%'
              onClick={handleLogout}
              style={{ marginTop: 'auto', marginBottom: '1rem' }}
            />
          </li>
        </ul>
      </div>
      <Modal isOpen={isOpen}>
        <StatusModal user={user} socket={socket} setIsOpen={setIsOpen} />
      </Modal>
    </div>
  );
};

export default Sidebar;
