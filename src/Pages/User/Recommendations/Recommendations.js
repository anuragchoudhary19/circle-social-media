import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '../../../Components/Elements/Input/Input';
import Usercard from '../../../Components/Usercard/Usercard';
import { getNewUsers, getSearchedUsers } from '../../../functions/user';
import styles from './Recommendations.module.css';

const Recommendations = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    getNewUsers(user.token)
      .then((res) => {
        setNewUsers(res.data.newUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const searchHandle = (e) => {
    setText(e.target.value);
    console.log(text);
    search();
  };
  const search = () => {
    getSearchedUsers(text, user.token)
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.search}>
        <Input type='text' value={text} onChange={searchHandle} placeholder='Search here...' />
        <div className={styles.dropdown}>
          {users.length > 0 && (
            <div className={styles.result}>
              {users.map((user) => (
                <div key={user._id}>
                  <Usercard profile={user} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {newUsers.length > 0 && (
        <div className={styles.recommendation}>
          <header>
            <h2>Follow</h2>
          </header>
          {newUsers.map((user) => (
            <div key={user._id}>
              <Usercard profile={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
