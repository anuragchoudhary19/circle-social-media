import React from 'react';
import classes from './Dropdown.module.css';
const Dropdown = (props) => {
  return (
    <div
      className={classes.dropdown}
      style={{ visibility: props.dropdown ? 'visible' : 'hidden', opacity: props.dropdown ? '1' : '0' }}>
      <div className={classes.menu} style={{ height: props.dropdown ? 'fit-content' : '0' }}>
        {props.children}
      </div>
    </div>
  );
};

export default Dropdown;
