import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
//
import Modal from '../../../../Components/Modal/Modal';
import Button from '../../../../Components/Elements/Button/Button';
import FollowButton from '../../../../Components/Elements/FollowButton/FollowButton';
import EditProfile from '../../EditProfile/EditProfile';
import DefaultPhoto from '../../../../images/default-photo.jpg';
import DefaultBackground from '../../../../images/images.png';
import styles from './UserProfile.module.css';

const UserProfile = ({ profile }) => {
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const { username } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  const { url, path } = useRouteMatch();
  console.log(url, path);
  const handleEditModal = () => {
    setOpenEditProfile(true);
  };
  return (
    <div className={styles.profile}>
      <header>
        <div className={styles.images}>
          <img src={profile.background ? profile.background.url : DefaultBackground} alt='background' />
          <img src={profile.photo ? profile.photo.url : DefaultPhoto} alt='profile' />
        </div>
        {profile._id === user._id && (
          <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: '1rem' }}>
            <Button onClick={handleEditModal}>Edit Profile</Button>
          </div>
        )}
        {profile._id !== user._id && (
          <div className={styles.follow}>
            <FollowButton profileId={profile._id} />
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
            <Link to={`/${username}/followers`}>
              <span>Followers {profile?.followers?.length}</span>
            </Link>
            <Link to={`/${username}/following`}>
              <span>Following {profile?.following?.length}</span>
            </Link>
          </div>
          <span className={styles.date}>Joined on {new Date(profile.createdAt).toDateString()}</span>
        </div>
      </header>

      <Modal isOpen={openEditProfile}>
        <EditProfile closeModal={setOpenEditProfile} />
      </Modal>
    </div>
  );
};

export default UserProfile;
