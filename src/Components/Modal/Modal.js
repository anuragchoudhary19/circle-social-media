import React from 'react';
import ReactDom from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return ReactDom.createPortal(<div className={styles.modal}>{children}</div>, document.getElementById('modal'));
};

export default Modal;
