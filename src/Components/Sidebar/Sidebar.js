import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../functions/auth';
import { useSocket } from '../../SocketProvider';
//
import Input from '../Elements/Input/Input';
import Modal from '../Modal/Modal';
import Button from '../../Components/Elements/Button/Button';
import StatusModal from '../../Modals/TweetModal/TweetModal';
//
import { getSearchedUsers } from '../../functions/user';
//
import styles from './Sidebar.module.css';
import Searchcard from '../Usercard/SearchCard';

const Sidebar = () => {
  const socket = useSocket();
  let [open, setOpen] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
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
      socket.emit('end');
      history.push('/');
    });
  };
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const searchHandler = (e) => {
    setQuery(e.target.value);
    search();
  };
  const search = () => {
    getSearchedUsers(query, user.token)
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.searchBar}>
        <div className={styles.toggleIcon} onClick={toggleSidebar}>
          <img src={user.photo.url} alt='profile_image' />
        </div>
        <div className={styles.search}>
          <Input type='text' value={query} onChange={searchHandler} placeholder='Search here...' />
          {users.length > 0 && (
            <div className={styles.dropdown}>
              <div className={styles.result}>
                {users.map((user) => (
                  <div key={user._id} className={styles.list}>
                    <Searchcard profile={user} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
            <NavLink to='/home' activeStyle={{ color: 'var(--activeSideBarLink)' }}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={`/${user.username}`} activeStyle={{ color: 'var(--activeSideBarLink)' }}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to='/connect' activeStyle={{ color: 'var(--activeSideBarLink)' }}>
              Connect
            </NavLink>
          </li>
          <li>
            <NavLink to='/settings' activeStyle={{ color: 'var(--activeSideBarLink)' }}>
              Settings
            </NavLink>
          </li>
          <li>
            <Button onClick={handleStatusModal}>Tweet</Button>
          </li>
          <li>
            <Button onClick={handleLogout}>Logout</Button>
          </li>
        </ul>
      </div>
      <Modal isOpen={isOpen}>
        <StatusModal user={user} setIsOpen={setIsOpen} />
      </Modal>
    </div>
  );
};

export default Sidebar;
