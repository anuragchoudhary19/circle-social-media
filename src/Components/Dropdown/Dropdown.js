import React from 'react';
import classes from './Dropdown.module.css';
const Dropdown = (props) => {
  const { open } = props;
  return (
    <div className={classes.dropdown} style={{ visibility: open ? 'visible' : 'hidden', opacity: open ? '1' : '0' }}>
      <div className={classes.menu} style={{ height: open ? 'fit-content' : '0' }}>
        {props.children}
      </div>
    </div>
  );
};

export default Dropdown;
