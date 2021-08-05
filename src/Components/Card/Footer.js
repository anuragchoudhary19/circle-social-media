import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
//
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { faHeart as FaHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RetweetOutlined } from '@ant-design/icons';
import styles from './Card.module.css';

const Footer = (props) => {
  const { tweet, socket, handleOpenCommentModal } = props;
  const [liked, setLiked] = useState(tweet.liked);
  const [retweeted, setReweeted] = useState(tweet.retweeted);
  const [likes, setLikes] = useState(tweet.likes.length);
  const [retweets, setRetweets] = useState(tweet.retweets.length);
  const [comments, setComments] = useState(tweet.comments.length);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    socket.on('tweet-update', (updatedStatus) => {
      if (updatedStatus.id === tweet._id) {
        setComments(updatedStatus.comments);
        setRetweets(updatedStatus.retweets);
        setLikes(updatedStatus.likes);
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
          <FontAwesomeIcon icon={faCommentAlt} style={{ fontSize: '1rem', color: '#6e767d' }} />
          <span className='counter'>{comments > 0 && comments}</span>
        </div>
        <div
          className={styles.forwardsIcon}
          onClick={() => retweetHandle(tweet._id)}
          style={{ color: retweeted ? '#00ff00' : '#6e767d' }}>
          <RetweetOutlined style={{ fontSize: '1.2rem' }} />
          <span className='counter'>{retweets > 0 && retweets}</span>
        </div>
        <div
          className={styles.likeIcon}
          onClick={() => likeHandle(tweet._id)}
          style={{ color: liked ? 'red' : '#6e767d' }}>
          <FontAwesomeIcon icon={liked ? FaHeart : faHeart} />
          <span className='counter'>{likes > 0 && likes}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
