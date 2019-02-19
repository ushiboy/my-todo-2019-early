/* @flow */
import type { AppState, RouteState } from '../../../ducks/types.js';
import React from 'react';
import { Router } from 'tridoron';
import styles from './Main.scss';
import { Header } from '../../components/Header/Header.js';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';

type Props = {
  router: Router,
  route: RouteState
};

export function Main(props: Props) {
  const { router } = props;
  return (
    <div className={styles.main}>
      <Header />
      <router.content />
      <ToastContainer />
    </div>
  );
}
export const ConnectedMain = connect((state: AppState) => {
  return {
    route: state.route
  };
})(Main);
