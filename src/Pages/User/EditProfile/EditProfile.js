import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
//
import { updateUser, getUser } from '../../../functions/user';
import { uploadImage } from '../../../FileUploads/images';
//
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './EditProfile.module.css';

const EditProfile = ({ closeModal }) => {
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
  const [uploading, setUploading] = useState({ background: false, photo: false });
  const [error, setError] = useState(initialState);
  const [processing, setProcessing] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const close = () => {
    closeModal();
  };
  useEffect(() => {
    const loadProfile = () => {
      getUser(user.token)
        .then((res) => {
          setInfo(res.data);
        })
        .catch((err) => {
          //
        });
    };
    loadProfile();
    return () => loadProfile();
  }, [user.token]);

  const handleChange = (label) => (e) => {
    setError('');
    setInfo({ ...info, [label]: e.target.value });
  };

  const imageUploadHandle = (e, label) => {
    setError({ ...error, background: '', photo: '' });
    if (e.target.files[0].size > 2000000) {
      setError({ ...error, [label]: 'Image must be less than 2MB' });
      return;
    }
    setUploading({ ...uploading, [label]: true });
    uploadImage(e.target.files[0], user.token, label)
      .then((res) => {
        setUploading({ ...uploading, [label]: false });
        setInfo({ ...info, [label]: res });
      })
      .catch((err) => {
        setUploading({ ...uploading, [label]: false });
        setInfo({ ...info, [label]: '' });
      });
  };
  const updateProfileHandle = (e) => {
    e.preventDefault();
    if (info.firstname === '') {
      setError({ ...error, firstname: 'Firstname cannot be empty' });
      return;
    }
    if (info.username === '') {
      setError({ ...error, username: 'Username cannot be empty' });
      return;
    }
    setProcessing(true);
    updateUser(info, user.token)
      .then((res) => {
        window.location.replace(`/${res.data.username}`);
      })
      .then(() => {
        close();
      })
      .catch((err) => {
        setProcessing(false);
      });
  };
  const loadImage = (info, label) => {
    return (
      <div>
        {info?.url && <img src={info.url} alt={label} />}
        <FontAwesomeIcon
          icon={faCamera}
          style={{
            position: 'absolute',
            cursor: 'pointer',
            zIndex: '1',
          }}
        />
        {/* <FontAwesomeIcon
          icon={faTimes}
          style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '-0.7rem',
            cursor: 'pointer',
            zIndex: '1',
          }}
          onClick={() => removeImage(info.public_id, label)}
        /> */}
      </div>
    );
  };
  // const removeImage = (id, label) => {
  //   console.log(id);
  //   deleteImage(id, user.token).then((res) => {
  //     setInfo({ ...info, [label]: '' });
  //   });
  // };
  return (
    <div className={styles.backdrop}>
      <form className={styles.modal}>
        <header>
          <h2>Edit Profile</h2>
          <div className={styles.close}>
            <FontAwesomeIcon
              icon={faTimes}
              style={{ marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}
              onClick={close}
            />
          </div>
        </header>
        <div className={styles.images}>
          <div className={styles.background}>
            <label>
              <input type='file' hidden accept='image/*' onChange={(e) => imageUploadHandle(e, 'background')} />
              {uploading.background ? <Loader /> : loadImage(info?.background, 'background')}
            </label>
          </div>
          <div className={styles.photo}>
            <label>
              <input type='file' hidden accept='image/*' onChange={(e) => imageUploadHandle(e, 'photo')} />
              {uploading.photo ? <Loader /> : loadImage(info?.photo, 'photo')}
            </label>
          </div>
        </div>
        {error.image && <span className={styles.error}>{error.image}</span>}
        <div className={styles.form}>
          <div>
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
            <Button btnStyle='primaryOutline' btnSize='sm' loading={processing} onClick={updateProfileHandle}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
