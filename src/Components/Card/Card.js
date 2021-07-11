import React, { useRef, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../App';
import { Link, useHistory } from 'react-router-dom';
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
  const card = useRef();
  const node = useRef();
  const delRef = useRef();
  const history = useHistory();
  useEffect(() => {
    socket.on('status-update', (updatedStatus) => {
      if (updatedStatus.id === status._id) {
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
    setScreen(window.screen.width);
    window.addEventListener('resize', () => setScreen(window.screen.width));
    return () => window.removeEventListener('resize', () => setScreen(window.screen.width));
  }, []);
  console.log(status);
  const handleClick = (e) => {
    if (node.current?.contains(e.target)) {
      return;
    } else if (delRef.current?.contains(e.target)) {
      return;
    } else if (card.current === e.target) {
      history.push(`/${profile.username}/post/${status?._id}`);
    }
    setStatusId('');
  };

  const deleteHandle = async (id) => {
    if (props.type === 'comment') {
      removeComment(id, user.token)
        .then(() => {
          props.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      removeStatus(id, user.token)
        .then(() => {
          props.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const likeHandle = (statusId) => {
    let likesArray = [...likes];
    let index = likesArray.indexOf(user._id);
    if (index > -1) {
      likesArray.splice(index, 1);
    } else {
      likesArray.push(user._id);
    }
    setLikes(likesArray);
    likeUnlikePost(statusId, user.token)
      .then((res) => {
        //
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const retweetHandle = (postId) => {
    let forwardsArray = [...forwards];
    let index = forwardsArray.indexOf(user._id);
    if (index > -1) {
      forwardsArray.splice(index, 1);
    } else {
      forwardsArray.push(user._id);
    }
    setForward(forwardsArray);
    retweet(postId, user.token)
      .then((res) => {
        //
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const commentHandle = (element) => {
    setError('');
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

  const checkTime = (time) => {
    const currentDate = new Date();
    const statusDate = new Date(time);
    if (date.subtract(currentDate, statusDate).toSeconds() < 60) {
      return Math.floor(date.subtract(currentDate, statusDate).toSeconds()) + 's';
    } else if (date.subtract(currentDate, statusDate).toMinutes() < 60) {
      return Math.floor(date.subtract(currentDate, statusDate).toMinutes()) + 'min';
    } else if (date.subtract(currentDate, statusDate).toHours() <= 23) {
      return Math.floor(date.subtract(currentDate, statusDate).toHours()) + 'h';
    } else if (date.subtract(currentDate, statusDate).toDays() <= 7) {
      return Math.floor(date.subtract(currentDate, statusDate).toDays()) + 'd';
    } else if (date.subtract(currentDate, statusDate).toDays() <= 365) {
      return date.format(new Date(time), 'DD MMM');
    } else {
      return date.format(new Date(time), 'DD MMM YYYY');
    }
  };

  return (
    <div className={styles.card} ref={card} data-card={expand}>
      <div className={styles.avatar}>
        {props.isComment && <div></div>}
        <Link to={`/${profile.username}`}>
          <img src={profile?.photo?.url} alt='profile' />
        </Link>
        {props.isStatus && <div></div>}
      </div>
      <header className={styles.header}>
        <div className={styles.statusInfo}>
          <div className={styles.name}>
            {profile.firstname} {profile.lastname}
          </div>
          <Link to={`/${profile.username}`}>
            <div className={styles.username}>@{profile.username}</div>
          </Link>
          <div className={styles.date}>{checkTime(status?.createdAt)}</div>
        </div>
      </header>
      <div className={styles.status}>
        <Link to={`/${profile.username}/post/${status?._id}`}>{status?.text}</Link>
      </div>
      {(status.postedBy || status.postedBy?._id || status.commentedBy?._id) && (
        <div className={styles.dropdown} ref={node} onClick={() => setStatusId(status?._id)}>
          <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#595959' }} />
          {screen > 768 ? (
            <Dropdown dropdown={statusId === status?._id}>
              <div onClick={() => deleteHandle(status?._id)}>Delete</div>
            </Dropdown>
          ) : (
            <Modal isOpen={statusId === status?._id}>
              <Options>
                <div onClick={() => deleteHandle(status?._id)} ref={delRef}>
                  Delete
                </div>
              </Options>
            </Modal>
          )}
        </div>
      )}
      <div className={styles.commentArea} data-card={expand}>
        <TextArea comment={comment} placeholder='Reply here...' onChange={(e) => commentHandle(e)} />
        <div>
          <Button width='100%' text='Reply' loading={btnLoading} onClick={handleComment} />
        </div>
        {error && <span>*{error}</span>}
      </div>
      <footer className={styles.footer}>
        <div>
          {!status.statusId && (
            <div className={styles.commentIcon} onClick={() => handleOpenCommentModal(status._id)}>
              <FontAwesomeIcon icon={faCommentAlt} style={{ fontSize: '1rem', color: '#595959' }} />
              <span>{comments?.length > 0 && comments.length}</span>
            </div>
          )}
          <div
            className={styles.forwardsIcon}
            onClick={() => retweetHandle(status._id)}
            style={{ color: forwards?.includes(user._id) ? '#00ff00' : '#595959' }}>
            <RetweetOutlined style={{ fontSize: '1.2rem' }} />
            <span>{forwards?.length > 0 && forwards.length}</span>
          </div>
          <div
            className={styles.likeIcon}
            onClick={() => likeHandle(status._id)}
            style={{ color: likes?.includes(user._id) ? 'red' : '#595959' }}>
            <FontAwesomeIcon icon={likes.includes(user._id) ? FaHeart : faHeart} />
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
