/* @flow */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, Hash } from 'tridoron';
import {
  createAdapter,
  initializeRouteReducerState
} from 'tridoron/lib/adapters/redux.js';
import { reducers } from './ducks';
import { Provider } from 'react-redux';
import { ConnectedMain } from './presentation/layout/Main/Main.js';
import { LocalStorageRepository } from './infrastructure/LocalStorageRepository.js';
import { routes } from './presentation/routes.js';

const middleware = applyMiddleware(
  thunk.withExtraArgument({
    todoRepository: new LocalStorageRepository(localStorage)
  })
);
const router = new Router(Hash, routes);
const store = createStore(
  reducers,
  {
    route: initializeRouteReducerState(router)
  },
  middleware
);
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
