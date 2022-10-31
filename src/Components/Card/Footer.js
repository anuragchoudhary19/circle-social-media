import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
//
import { useSocket } from '../../SocketProvider';
//
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { faHeart as FaHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RetweetOutlined } from '@ant-design/icons';
import styles from './Card.module.css';

const Footer = (props) => {
  const { tweet, handleOpenCommentModal } = props;
  const [liked, setLiked] = useState(tweet.liked);
  const [retweeted, setReweeted] = useState(tweet.retweeted);
  const [likes, setLikes] = useState(tweet.likes.length);
  const [retweets, setRetweets] = useState(tweet.retweets.length);
  const [comments, setComments] = useState(tweet.comments.length);
  const socket = useSocket();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    socket.on(`liked ${tweet._id}`, () => {
      setLikes((prevValue) => prevValue + 1);
    });
    socket.on(`unliked ${tweet._id}`, () => {
      setLikes((prevValue) => prevValue - 1);
    });
    socket.on(`retweet ${tweet._id}`, () => {
      setRetweets((prevValue) => prevValue + 1);
    });
    socket.on(`undo-retweet ${tweet._id}`, () => {
      setRetweets((prevValue) => prevValue - 1);
    });
    socket.on(`comment on ${tweet._id}`, () => {
      setComments((prevValue) => prevValue + 1);
    });
    socket.on('delete-comment', (userId, result) => {
      if (result.repliedTo === tweet._id) {
        setComments((prevValue) => prevValue - 1);
      }
    });
  }, [socket, tweet._id]);
  const likeHandle = (statusId) => {
    import('../../functions/tweet').then(({ likeTweet }) => {
      likeTweet(statusId, user.token)
        .then((res) => {
          setLiked((prevValue) => !prevValue);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const retweetHandle = (postId) => {
    import('../../functions/tweet').then(({ retweetTweet }) => {
      retweetTweet(postId, user.token)
        .then((res) => {
          setReweeted((prevValue) => !prevValue);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.commentIcon} onClick={() => handleOpenCommentModal(tweet._id)}>
          <FontAwesomeIcon icon={faCommentAlt} style={{ fontSize: '1rem', color: 'var(--icon)' }} />
          <span className='counter'>{comments > 0 && comments}</span>
        </div>
        <div
          className={styles.forwardsIcon}
          onClick={() => retweetHandle(tweet._id)}
          style={{ color: retweeted ? '#00ff00' : 'var(--icon)' }}>
          <RetweetOutlined style={{ fontSize: '1.2rem' }} />
          <span className='counter'>{retweets > 0 && retweets}</span>
        </div>
        <div
          className={styles.likeIcon}
          onClick={() => likeHandle(tweet._id)}
          style={{ color: liked ? 'red' : 'var(--icon)' }}>
          <FontAwesomeIcon icon={liked ? FaHeart : faHeart} />
          <span className='counter'>{likes > 0 && likes}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
