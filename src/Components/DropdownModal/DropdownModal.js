import React from 'react';
import ReactDom from 'react-dom';
import styles from './DropdownModal.module.css';

const DropdownModal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return ReactDom.createPortal(<div className={styles.modal}>{children}</div>, document.getElementById('modal'));
};

export default DropdownModal;
