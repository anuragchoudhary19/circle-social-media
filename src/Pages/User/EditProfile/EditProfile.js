import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { updateUser, getUser } from '../../../functions/user';
import { uploadImage, deleteImage } from '../../../FileUploads/images';
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';
import Loader from '../../../Components/Elements/Loader/Loader';
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './EditProfile.module.css';

const EditProfile = ({ socket }) => {
  const initialState = {
    username: '',
    firstname: '',
    lastname: '',
    bio: '',
    dob: '',
    photo: '',
    background: '',
  };
  const [info, setInfo] = useState(initialState);
  const [error, setError] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const closeModal = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal'));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    getUser(user.token)
      .then((res) => {
        setInfo(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const handleChange = (label) => (e) => {
    console.log(e.target.value);
    setError('');
    setInfo({ ...info, [label]: e.target.value });
  };

  const imageUploadHandle = (e, label) => {
    setError({ ...error, image: '' });
    if (e.target.files[0].size <= 2000000) {
      uploadImage(e.target.files[0], user.token, label).then((res) => {
        setInfo({ ...info, [label]: res });
      });
    } else {
      setError({ ...error, image: 'Image must be less than 2MB' });
    }
  };
  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (info.firstname === '') {
      setError({ ...error, firstname: 'Firstname cannot be empty' });
      return;
    }
    if (info.username === '') {
      setError({ ...error, username: 'Username cannot be empty' });
      return;
    }
    updateUser(info, user.token).then((res) => {
      console.log(res.data);
      setInfo(res.data.user);
      socket.emit('profile-update', socket.id);
      closeModal();
    });
  };
  const loadImage = (info, label) => {
    return (
      <>
        <img src={info.url} alt={label} />
        <FontAwesomeIcon
          icon={faCamera}
          style={{
            position: 'absolute',
            cursor: 'pointer',
            zIndex: '1',
          }}
        />
        <FontAwesomeIcon
          icon={faTimes}
          style={{
            position: 'absolute',
            bottom: '1rem',
            cursor: 'pointer',
            zIndex: '1',
          }}
          onClick={() => removeImage(info.public_id, label)}
        />
      </>
    );
  };
  const removeImage = (id, label) => {
    console.log(id);
    deleteImage(id, user.token).then((res) => {
      setInfo({ ...info, [label]: '' });
    });
  };
  return (
    <div className={styles.backdrop}>
      <form className={styles.modal}>
        <div className={styles.close}>
          <FontAwesomeIcon
            icon={faTimes}
            style={{ marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}
            onClick={closeModal}
          />
        </div>
        <header>
          <h2>Edit Profile</h2>
        </header>
        <section className={styles.images}>
          <div>
            <label className={styles.background}>
              <input type='file' hidden accept='image/*' onChange={(e) => imageUploadHandle(e, 'background')} />
              {loading ? <Loader /> : info?.background?.url ? loadImage(info?.background, 'background') : '+'}
            </label>
          </div>
          <label className={styles.photo}>
            <input type='file' hidden accept='image/*' onChange={(e) => imageUploadHandle(e, 'photo')} />
            {loading ? <Loader /> : info?.photo?.url ? loadImage(info?.photo, 'photo') : '+'}
          </label>
        </section>
        {error.image && <span className={styles.error}>{error.image}</span>}
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Input
              label='First Name'
              type='text'
              value={info?.firstname}
              error={error?.firstname}
              onChange={handleChange('firstname')}
            />
            <Input
              label='Last Name'
              type='text'
              value={info?.lastname}
              error={error?.lastname}
              onChange={handleChange('lastname')}
            />
          </div>
          <Input
            label='Username'
            type='text'
            value={info?.username}
            error={error?.username}
            onChange={handleChange('username')}
          />

          <Input label='Bio' type='text' value={info?.bio} error={error?.bio} onChange={handleChange('bio')} />
          <Input
            label='Date Of Birth'
            type='date'
            value={info?.dob}
            error={error?.dob}
            onChange={handleChange('dob')}
          />
          <br />
          <div style={{ marginLeft: 'auto', marginRight: '0.5rem', width: '40%' }}>
            <Button text='Save' type='submit' width='100%' onClick={handleUpdateUser} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
