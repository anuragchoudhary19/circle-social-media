import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../App';
import { Link, useHistory } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import Comment from '../../Modals/Comment/Comment';
import { commentOnTweet } from '../../functions/tweet';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import date from 'date-and-time';
import TextArea from '../Elements/TextArea/TextArea';
import Button from '../Elements/Button/Button';

import styles from './Card.module.css';
import Modal from '../Modal/Modal';
import Options from '../../Modals/Options/Options';
import Footer from './Footer';

const Card = (props) => {
  const { expand, tweet } = props;
  const { current: profile } = useRef(tweet.user);

  const [openCommentModal, setOpenCommentModal] = useState(false);
  const socket = useContext(SocketContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [comment, setComment] = useState({ tweet: '', photo: { photo_id: '', public_url: '' }, video: '' });
  const [tweetId, setTweetId] = useState('');
  const [error, setError] = useState('');
  const [screen, setScreen] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const card = useRef();
  const dropdownNode = useRef();
  const popupNode = useRef();
  const history = useHistory();

  useEffect(() => {
    setScreen(window.screen.width);
    window.addEventListener('resize', () => setScreen(window.screen.width));
    return () => window.removeEventListener('resize', () => setScreen(window.screen.width));
  }, []);

  const handleClick = useCallback((e) => {
    console.log('click');
    if (dropdownNode.current?.contains(e.target)) {
      return;
    } else if (popupNode.current?.contains(e.target)) {
      return;
    } else if (card.current === e.target) {
      history.push(`/${profile.username}/tweet/${tweet?._id}`);
    }
    setTweetId('');
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handleClick]);

  const deleteHandle = async (id) => {
    import('../../functions/tweet').then(({ removeTweet }) => {
      removeTweet(id, user.token)
        .then(() => {
          props.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const commentHandle = (element) => {
    setError('');
    if (element) {
      const target = element.target ? element.target : element;
      target.style.height = '50px';
      target.style.height = `${target.scrollHeight}px`;
    }
    setComment({ ...comment, tweet: element.target.value });
  };
  const handleComment = () => {
    if (!comment) return setError('Comment is empty');
    setBtnLoading(true);
    commentOnTweet(comment, tweet._id, user.token)
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
        {props.isReply && <div></div>}
        <Link to={`/${profile.username}`}>
          <img src={profile?.photo?.url} alt='profile' />
        </Link>
        {props.isTweet && <div></div>}
      </div>
      <div className={styles.header}>
        <Link to={`/${profile.username}`}>
          <span className={styles.name}>{`${profile.firstname} ${profile.lastname}`}</span>
        </Link>
        <div className={styles.username}>@{profile.username} .</div>
        <span className={styles.date}>{checkTime(tweet?.createdAt)}</span>
      </div>
      <div className={styles.status}>
        <Link to={`/${profile.username}/tweet/${tweet?._id}`}>{tweet?.tweet}</Link>
      </div>
      {tweet.user?._id === user._id && (
        <div className={styles.dropdown} ref={dropdownNode} onClick={() => setTweetId(tweet?._id)}>
          <FontAwesomeIcon icon={faEllipsisH} />
          {screen > 768 ? (
            <Dropdown open={tweetId === tweet?._id}>
              <div onClick={() => deleteHandle(tweet?._id)}>Delete</div>
            </Dropdown>
          ) : (
            <Modal isOpen={tweetId === tweet?._id}>
              <Options>
                <div onClick={() => deleteHandle(tweet?._id)} ref={popupNode}>
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
          <Button loading={btnLoading} onClick={handleComment}>
            Reply
          </Button>
        </div>
        {error && <span>*{error}</span>}
      </div>
      <Footer tweet={tweet} socket={socket} handleOpenCommentModal={handleOpenCommentModal} />
      <Modal isOpen={openCommentModal}>
        <Comment tweet={tweet} profile={profile} socket={socket} setIsOpen={setOpenCommentModal} />
      </Modal>
    </div>
  );
};

export default Card;
