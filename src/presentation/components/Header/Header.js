/* @flow */
import React from 'react';
import style from './Header.scss';

export const Header = () => {
  return (
    <nav className={`navbar navbar-light bg-dark ${style.head}`}>
      <span className={`navbar-brand mb-0 ${style.sub}`}>
        <i className="fas fa-list" /> Todo
      </span>
    </nav>
  );
};
