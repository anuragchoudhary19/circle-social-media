import React, { useRef, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../App';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import Comment from '../../Modals/Comment/Comment';
import { commentOnPostHandle } from '../../functions/status';
import { removeStatus, removeComment, likeUnlikePost, retweet } from '../../functions/status';
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { faHeart as FaHeart, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import date from 'date-and-time';
import TextArea from '../Elements/TextArea/TextArea';
import Button from '../Elements/Button/Button';
import { RetweetOutlined } from '@ant-design/icons';
import styles from './Card.module.css';
import Modal from '../Modal/Modal';
import Options from '../../Modals/Options/Options';

const Card = (props) => {
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const { profile, expand, status } = props;
  const socket = useContext(SocketContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [comment, setComment] = useState({ text: '', photo: { photo_id: '', public_url: '' }, video: '' });
  const [comments, setComments] = useState(props.status.comments);
  const [forwards, setForward] = useState(props.status.retweets);
  const [likes, setLikes] = useState(props.status.likes);
  const [statusId, setStatusId] = useState('');
  const [error, setError] = useState('');
  const [screen, setScreen] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const node = useRef();
  const delRef = useRef();
  useEffect(() => {
    socket.on('post-update', (updatedStatus) => {
      console.log(updatedStatus);
      if (updatedStatus.id === status._id) {
        console.log(updatedStatus);
        setComments(updatedStatus.comments);
        setForward(updatedStatus.forwards);
        setLikes(updatedStatus.likes);
      }
    });
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  useEffect(() => {
    window.addEventListener('resize', () => setScreen(window.screen.width));
    return () => window.removeEventListener('resize', () => setScreen(window.screen.width));
  }, []);

  const handleClick = (e) => {
    if (node.current?.contains(e.target)) {
      return;
    } else if (delRef.current?.contains(e.target)) {
      return;
    }
    setStatusId('');
  };

  const deleteHandle = async (id) => {
    if (props.type === 'comment') {
      removeComment(id, user.token)
        .then(() => {
          //
          props.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      removeStatus(id, user.token)
        .then(() => {
          //
          props.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const likeHandle = (postId) => {
    likeUnlikePost(postId, user.token).then(() => {
      socket.emit('update', postId);
    });
  };
  const retweetHandle = (postId) => {
    retweet(postId, user.token).then(() => {
      socket.emit('update', postId);
    });
  };
  const commentHandle = (element) => {
    setError('');
    console.log(element);
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '50px';
      target.style.height = `${target.scrollHeight}px`;
    }
    setComment({ ...comment, text: element.target.value });
  };
  const handleComment = () => {
    if (!comment) return setError('Comment is empty');
    setBtnLoading(true);
    commentOnPostHandle({ ...comment, statusId: status._id }, status._id, user.token)
      .then((res) => {
        setBtnLoading(false);
        setComment('');
      })
      .catch((err) => {
        setBtnLoading(false);
        setError('Error in posting comment');
      });
  };
  const handleOpenCommentModal = () => {
    setOpenCommentModal(true);
  };
  console.log();
  return (
    <div className={styles.card} data-card={expand}>
      <div className={styles.avatar}>
        <Link to={`/${profile.username}`}>
          <img src={profile?.photo?.url} alt='profile' />
        </Link>
      </div>
      <header className={styles.header}>
        <div className={styles.statusInfo}>
          <div className={styles.name}>
            {profile.firstname} {profile.lastname}
          </div>
          <Link to={`/${profile.username}`}>
            <div className={styles.username}>@{profile.username}</div>
          </Link>
          <div className={styles.date}>{date.format(new Date(status?.createdAt.split('T')[0]), 'DD MMM YYYY')}</div>
        </div>
        <div className={styles.status}>
          <Link to={`/${profile.username}/post/${status?._id}`}>{status?.text}</Link>
        </div>
      </header>
      {status.postedBy === profile._id && (
        <div className={styles.dropdown} ref={node} onClick={() => setStatusId(status?._id)}>
          <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#595959' }} />
          <Dropdown dropdown={statusId === status?._id}>
            <div onClick={() => deleteHandle(status?._id)}>Delete</div>
          </Dropdown>
        </div>
      )}
      {status.postedBy === profile._id && (
        <div className={styles.popup} id='popup' onClick={() => setStatusId(status?._id)}>
          <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#595959' }} />
          <Modal isOpen={screen < 768 && statusId === status?._id}>
            <Options>
              <div onClick={() => deleteHandle(status?._id)} ref={delRef}>
                Delete
              </div>
            </Options>
          </Modal>
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.comment} data-card={expand}>
          <TextArea comment={comment} placeholder='Reply here...' onChange={(e) => commentHandle(e)} />
          <Button text='Reply' loading={btnLoading} onClick={handleComment} />
          {error && <span>*{error}</span>}
        </div>
        <div data-card={props.comment}>
          {props.type !== 'comment' && (
            <div onClick={() => handleOpenCommentModal(status._id)}>
              <FontAwesomeIcon icon={faCommentAlt} style={{ fontSize: '1rem', color: '#595959' }} />
              <span>{comments.length > 0 && comments.length}</span>
            </div>
          )}
          <div onClick={() => retweetHandle(status._id)}>
            <RetweetOutlined
              style={{ fontSize: '1.2rem', color: forwards?.includes(user._id) ? '#00ff00' : '#595959' }}
            />
            <span>{forwards?.length > 0 && forwards.length}</span>
          </div>
          <div onClick={() => likeHandle(status._id)}>
            <FontAwesomeIcon
              icon={likes.includes(user._id) ? FaHeart : faHeart}
              style={{ color: likes?.includes(user._id) ? 'red' : '#595959' }}
            />
            <span>{likes?.length > 0 && likes.length}</span>
          </div>
        </div>
      </footer>
      <Modal isOpen={openCommentModal}>
        <Comment status={status} profile={profile} socket={socket} setIsOpen={setOpenCommentModal} />
      </Modal>
    </div>
  );
};

export default Card;
