import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Logo from '../Logo';
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';

import { signin } from '../../../functions/auth';
import styles from './Login.module.css';

const initialErrorState = { general: '', email: '', password: '' };

const Login = () => {
  const [email, setEmail] = useState('anurag@gmail.com');
  const [password, setPassword] = useState('qwerty123');
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(initialErrorState);
  const history = useHistory();

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
        setUser(res.data.user);
        if (window !== undefined) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        history.push('/profile');
      })
      .catch((err) => {
        console.log(err.response);
        setError({ ...error, general: err.response.data.error });
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
