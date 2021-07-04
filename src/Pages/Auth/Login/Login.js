import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
//
import Logo from '../Logo';
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';
//
import { signin } from '../../../functions/auth';
import styles from './Login.module.css';

const initialErrorState = { general: '', email: '', password: '' };

const Login = () => {
  const [email, setEmail] = useState('anurag@gmail.com');
  const [password, setPassword] = useState('qwerty123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(initialErrorState);
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (user?.token) {
      history.push('/home');
    }
  }, []);
  const handleEmail = (e) => {
    setError({ ...error, email: '' });
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setError({ ...error, password: '' });
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(initialErrorState);
    setMessage('');
    signin(email, password)
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (window !== undefined) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: res.data.user,
        });
        history.push(`/home`);
      })
      .catch((err) => {
        console.log(err.response);
        setError({ ...error });
        setLoading(false);
      });
  };
  return (
    <div className={styles.page}>
      <Logo />
      <div className={styles.auth}>
        <div>
          <header>Sign In</header>
          {error.general && <span className={styles.error}>{error.general}</span>}
          {message && <span className={styles.success}>{message}</span>}
          <Input label='Email' type='email' value={email} error={error.email} onChange={handleEmail} />
          <Input label='Password' type='password' value={password} error={error.password} onChange={handlePassword} />
          <br />
          <Button type='submit' text='Sign In' loading={loading} onClick={handleSubmit} />
          <div className={styles.signin}>
            <Link to={'/signup'}>Create New Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
