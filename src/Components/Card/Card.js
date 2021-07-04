import React, { useRef, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SocketContext } from '../../App';
import { store } from '../../index';
import { Link, BrowserRouter } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import Comment from '../../Modals/Comment/Comment';
import { commentOnPostHandle } from '../../functions/status';
import { removeStatus, removeComment, likeUnlikePost, retweet } from '../../functions/status';
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { faHeart as FaHeart, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import date from 'date-and-time';
import styles from './Card.module.css';
import TextArea from '../Elements/TextArea/TextArea';
import Button from '../Elements/Button/Button';
import { RetweetOutlined } from '@ant-design/icons';

const Card = (props) => {
  const { profile, expand, status } = props;
  const socket = useContext(SocketContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [comment, setComment] = useState({ text: '', photo: { photo_id: '', public_url: '' }, video: '' });
  const [comments, setComments] = useState(props.status.comments);
  const [forwards, setForward] = useState(props.status.retweets);
  const [likes, setLikes] = useState(props.status.likes);
  const [dropdown, setDropdown] = useState('');
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const node = useRef();
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

  const handleClick = (e) => {
    if (node.current && node.current.contains(e.target)) {
      return;
    }
    setDropdown('');
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
  const handleOpenCommentModal = (postId) => {
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <Comment post={status} profile={profile} socket={socket} />
        </BrowserRouter>
      </Provider>,
      document.getElementById('modal')
    );
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
      {user._id === profile._id && (
        <div className={styles.dropdown} ref={node} onClick={() => setDropdown(status?._id)}>
          <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#595959' }} />
          <Dropdown dropdown={dropdown === status?._id}>
            <div onClick={() => deleteHandle(status?._id)}>Delete</div>
          </Dropdown>
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
    </div>
  );
};

export default Card;
