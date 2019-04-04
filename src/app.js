/* @flow */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from '@ushiboy/cyclone';
import { Router, Hash } from 'tridoron';
import { createAdapter } from './tridoronPlugin.js';
import { update, initState } from './ducks';
import { Provider } from '@ushiboy/react-cyclone';
import { ConnectedMain } from './presentation/layout/Main/Main.js';
import { LocalStorageRepository } from './infrastructure/LocalStorageRepository.js';
import { routes } from './presentation/routes.js';

const router = new Router(Hash, routes);
const store = createStore(initState(router), update, {
  todoRepository: new LocalStorageRepository(localStorage)
});
router.setAdapter(createAdapter(store));
router.start();

const el = document.querySelector('#app');
if (el) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedMain router={router} />
    </Provider>,
    el
  );
}
