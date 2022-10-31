import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
//
import { useSocket } from '../../SocketProvider';
import { commentOnTweet } from '../../functions/tweet';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//
import Dropdown from '../Dropdown/Dropdown';
import Comment from '../../Modals/Comment/Comment';
import TextArea from '../Elements/TextArea/TextArea';
import Button from '../Elements/Button/Button';
import Modal from '../Modal/Modal';
import DropdownModal from '../DropdownModal/DropdownModal';
import Options from '../../Modals/Options/Options';
import Footer from './Footer';
//
import date from 'date-and-time';
import styles from './Card.module.css';

const initialState = { tweet: '', photo: { photo_id: '', public_url: '' }, video: '' };
const Card = (props) => {
  const socket = useSocket();
  const { expand, tweet } = props;
  const { current: profile } = useRef(tweet?.user);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [comment, setComment] = useState(initialState);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const card = useRef();
  const dropdownNode = useRef();
  const popupNode = useRef();
  const history = useHistory();
  // const [divHeight, setDivHeight] = useState(0);

  // useEffect(() => {
  //   setDivHeight(card.current.clientHeight);
  //   console.log('height: ', card.current.clientHeight);

  //   console.log('width: ', card.current.clientWidth);
  // }, []);

  const handleClick = useCallback(
    (e) => {
      if (dropdownNode.current?.contains(e.target)) {
        return;
      } else if (popupNode.current?.contains(e.target)) {
        return;
      } else if (card.current === e.target) {
        history.push(`/${profile?.username}/tweet/${tweet?._id}`);
      }
      setShowDropdown(false);
    },
    [history, profile?.username, tweet._id]
  );
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handleClick]);

  const deleteHandle = (id) => {
    import('../../functions/tweet').then(({ removeTweet }) => {
      removeTweet(id, user.token)
        .then((res) => {
          setOpenConfirmModal(false);
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
        setComment(initialState);
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
        {props.isReply && <div className={styles.topLine}></div>}
        <Link to={`/${profile.username}`}>
          <img src={profile?.photo?.url} alt='profile' />
        </Link>
        {props.isTweet && <div className={styles.bottomLine}></div>}
      </div>
      <div className={styles.header}>
        <Link to={`/${profile.username}`}>
          <span className={styles.name}>{`${profile.firstname} ${profile.lastname}`}</span>
        </Link>
        <div className={styles.username}>
          @{profile.username}
          <span>&#8226;</span>
        </div>
        <span className={styles.date}>{checkTime(tweet?.createdAt)}</span>
      </div>
      <div className={styles.tweet}>
        <Link className={styles.text} to={`/${profile.username}/tweet/${tweet?._id}`}>
          {tweet?.tweet}
        </Link>
        {tweet?.images.length > 0 && (
          <div className={styles.images}>
            {tweet?.images.map((image) => (
              <div className={styles.image} key={image.public_id}>
                <img src={image.url} alt='file' />
              </div>
            ))}
          </div>
        )}
        {tweet?.video && (
          <div className={styles.images}>
            <video width='100%' height='100%' controls autoPlay>
              <source src={tweet.video.url} type='video/mp4' />
            </video>
          </div>
        )}
      </div>
      {tweet.user?._id === user._id && (
        <div className={styles.dropdown} ref={dropdownNode} onClick={() => setShowDropdown(true)}>
          <FontAwesomeIcon icon={faEllipsisH} />
          <Dropdown open={showDropdown}>
            <div onClick={() => setOpenConfirmModal(true)}>Delete</div>
          </Dropdown>
          <DropdownModal isOpen={showDropdown}>
            <Options>
              <div onClick={() => setOpenConfirmModal(true)} ref={popupNode}>
                Delete
              </div>
            </Options>
          </DropdownModal>
        </div>
      )}
      <Footer tweet={tweet} handleOpenCommentModal={handleOpenCommentModal} />
      <div className={styles.comment} data-card={expand}>
        <TextArea value={comment.tweet} placeholder='Reply here...' onChange={(e) => commentHandle(e)} />
        <div>
          <Button loading={btnLoading} onClick={handleComment}>
            Reply
          </Button>
        </div>
        {error && <span>*{error}</span>}
      </div>
      <Modal isOpen={openCommentModal}>
        <Comment tweet={tweet} profile={profile} socket={socket} setIsOpen={setOpenCommentModal} />
      </Modal>
      <Modal isOpen={openConfirmModal}>
        <div className={styles.confirmModal}>
          <div className={styles.modal}>
            <p>Are you sure you want to delete this tweet?</p>
            <div>
              <Button btnStyle='dangerSolid' btnSize='sm' onClick={() => deleteHandle(tweet?._id)}>
                Confirm
              </Button>
              <Button btnSize='sm' onClick={() => setOpenConfirmModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Card;
