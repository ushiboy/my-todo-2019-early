/* @flow */
import React from 'react';
import style from './Header.scss';
import '../../../images/icon.svg';

export const Header = () => {
  return (
    <nav className={`navbar navbar-light ${style.head}`}>
      <span className={`navbar-brand ${style.sub}`}>
        <img
          src="images/icon.svg"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />{' '}
        Todo
      </span>
    </nav>
  );
};
