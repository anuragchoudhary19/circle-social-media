import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, Provider } from 'react-redux';
import { BrowserRouter, NavLink, useParams, Link } from 'react-router-dom';
import { SocketContext } from '../../../../App';
import { store } from '../../../../index';
import Button from '../../../../Components/Elements/Button/Button';
import FollowButton from '../../../../Components/Elements/FollowButton/FollowButton';
import EditProfile from '../../EditProfile/EditProfile';
import DefaultPhoto from '../../../../images/default-photo.jpg';
import DefaultBackground from '../../../../images/images.png';
import styles from './UserProfile.module.css';

const UserProfile = ({ profile }) => {
  const { username } = useParams();
  const socket = useContext(SocketContext);
  const { user } = useSelector((state) => ({ ...state }));

  const handleEditModal = () => {
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <EditProfile profile={profile} socket={socket} />
        </BrowserRouter>
      </Provider>,
      document.getElementById('modal')
    );
  };
  const style = {
    fontWeight: 'bold',
    color: '#087fc4',
    border: '0px solid #3333ff',
    borderWidth: '0 0 5px 0',
  };
  return (
    <div className={styles.profile}>
      <header>
        <div className={styles.images}>
          <img src={profile.background ? profile.background.url : DefaultBackground} alt='background' />
          <img src={profile.photo ? profile.photo.url : DefaultPhoto} alt='profile' />
        </div>
        {profile._id === user._id && (
          <div style={{ width: '20%', marginLeft: 'auto', marginRight: '1rem' }}>
            <Button width='100%' text='Edit Profile' onClick={handleEditModal} />
          </div>
        )}
        {profile._id !== user._id && (
          <div className={styles.follow}>
            <FollowButton profile={profile} socket={socket} />
          </div>
        )}

        <div className={styles.bio}>
          <div className={styles.name}>
            <h3>{profile.firstname}</h3>
            <h3>{profile.lastname}</h3>
          </div>
          <span className={styles.username}>
            <h5>@{profile.username}</h5>
          </span>
          {profile.bio && <span className={styles.status}>{profile.bio}</span>}
          <div className={styles.connections}>
            <Link exact to='/followers'>
              <span>Followers {profile?.followers?.length}</span>
            </Link>
            <Link exact to='/following'>
              <span>Following {profile?.following?.length}</span>
            </Link>
          </div>
          <span className={styles.date}>Joined on {new Date(profile.createdAt).toDateString()}</span>
        </div>
      </header>
      <nav>
        <ul>
          <li>
            <NavLink exact to={`/${username}`} activeStyle={style}>
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink exact to={`/${username}/replies`} activeStyle={style}>
              Replies
            </NavLink>
          </li>
          <li>
            <NavLink exact to={`/${username}/media`} activeStyle={style}>
              Media
            </NavLink>
          </li>
          <li>
            <NavLink exact to={`/${username}/likes`} activeStyle={style}>
              Likes
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserProfile;
