import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../../Components/Elements/Button/Button';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import { deleteUser } from '../../../functions/user';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Settings.module.css';
import Modal from './../../../Components/Modal/Modal';
const Settings = () => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDeleteAccount = () => {
    deleteUser(user.token).then((res) => {
      localStorage.setItem('user', '');
      dispatch({
        type: 'LOGOUT',
        payload: '',
      });
      history.push('/');
    });
  };
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <header className={styles.header}>
          <FontAwesomeIcon icon={faArrowLeft} onClick={() => history.goBack()} />
          <h2>Settings</h2>
        </header>
        <div className={styles.settings}>
          <div className={styles.options}>
            <div className={styles.option}>
              <div style={{ color: 'red' }}>Delete Account</div>
              <div>
                <Button btnStyle='primarySolid' btnSize='md' onClick={() => setOpenConfirmModal(true)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={openConfirmModal}>
          <div className={styles.confirmModal}>
            <div className={styles.modal}>
              <p>Are you sure you want to delete this account?</p>
              <div>
                <Button btnStyle='dangerSolid' btnSize='sm' onClick={handleDeleteAccount}>
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
    </div>
  );
};

export default Settings;
