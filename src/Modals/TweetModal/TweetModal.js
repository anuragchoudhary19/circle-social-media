import React, { useState, useRef } from 'react';
//
import { createTweet } from '../../functions/tweet';
import { uploadImage } from '../../FileUploads/images';
import { uploadVideo } from '../../FileUploads/video';
//
import { faTimes, faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextArea from '../../Components/Elements/TextArea/TextArea';
import Button from '../../Components/Elements/Button/Button';
import styles from './TweetModal.module.css';

const TweetModal = ({ user, setIsOpen }) => {
  const [tweet, setTweet] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const progressBar = useRef();
  const closeModal = () => {
    setIsOpen(false);
  };
  const postStatus = async () => {
    if (!tweet && images.length === 0 && video === '') return setError('Status cannot be empty');
    setLoading(true);
    let imagesLinks;
    if (images.length > 0) {
      let promises = [];
      for (let i = 0; i < images.length; i++) {
        promises.push(uploadImage(images[i], user.token));
      }
      imagesLinks = await Promise.all(promises);
    }
    let videoLink;
    if (video !== '') {
      videoLink = await uploadVideo(video, user.token, setProgress);
    }
    createTweet({ tweet, images: imagesLinks, video: videoLink }, user.token)
      .then((res) => {
        setLoading(false);
      })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        setLoading(false);
        setError('Error in posting the status');
      });
  };
  const statusHandler = (element) => {
    setError('');
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '150px';
      target.style.height = `${target.scrollHeight}px`;
    }
    setTweet(element.target.value);
  };
  const handleUploadImages = (e) => {
    // console.log(e.target.files);
    setError('');
    let selectedFileType = e.target.files[0].type.split('/')[0];
    if (selectedFileType === 'video' && e.target.files.length > 1) {
      setError('Select only upto 1 video');
      return;
    }
    if (selectedFileType === 'video') {
      setVideo(e.target.files[0]);
      return;
    }
    for (let i = 1; i < e.target.files.length; i++) {
      if (selectedFileType !== e.target.files[i].type.split('/')[0]) {
        setError('Select either 4 images or 1 video');
        return;
      }
    }
    if (selectedFileType === 'image' && e.target.files.length > 4) {
      setError('Select only upto 4 images');
      return;
    }
    if (selectedFileType === 'image') {
      setImages(e.target.files);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.modal} draggable='true'>
        <header className={styles.close}>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              style={{ marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}
              onClick={closeModal}
            />
          </div>
        </header>
        <div ref={progressBar} className={styles.progress} style={{ width: `${progress}%` }}></div>
        <div className={styles.tweet}>
          <div className={styles.avatar}>
            <img src={user?.photo?.url} alt='profile' />
          </div>
          <div className={styles.status}>
            <TextArea placeholder='Write here...' value={tweet} onChange={(e) => statusHandler(e)} />
            {images.length > 0 && (
              <div className={styles.images}>
                {Array.from(images).map((image) => (
                  <img key={image.name} src={URL.createObjectURL(image)} alt='file' />
                ))}
              </div>
            )}
            {video && (
              <div className={styles.video}>
                <video controls src={URL.createObjectURL(video)} type={video.type} />
              </div>
            )}
            {error && (
              <div className={styles.error} style={{ color: 'red' }}>
                * {error}
              </div>
            )}
          </div>
        </div>

        <div className={styles.menu}>
          <div className={styles.uploadOptions}>
            <label>
              <input type='file' multiple={true} accept='image/*,video/*' onChange={handleUploadImages} />
              <FontAwesomeIcon icon={faImages} style={{ cursor: 'pointer' }} />
            </label>
          </div>
          <div className={styles.uploadButton}>
            <Button btnStyle='primarySolid' btnSize='sm' loading={loading} onClick={postStatus}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetModal;
