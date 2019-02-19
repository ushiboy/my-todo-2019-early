/* @flow */
import type { AppState } from './types.js';
import { combineReducers } from 'redux';
import { editTodo } from './editTodo/reducers.js';
import { reducer as route } from 'tridoron/lib/adapters/redux.js';
import { todos } from './todos/reducers.js';

export const reducers = combineReducers<any, AppState>({
  editTodo,
  route,
  todos
});
