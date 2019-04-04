/* @flow */
import type { AppState } from './types.js';
import { combine, reducer } from '@ushiboy/cyclone';
import { editTodo, initState as initEditTodo } from './editTodo/reducers.js';
import { reducer as route } from '../tridoronPlugin.js';
import { initializeRouteReducerState } from 'tridoron/lib/adapters/redux.js';
import { todos, initState as initTodos } from './todos/reducers.js';

export function initState(router: any): AppState {
  return {
    todos: initTodos(),
    editTodo: initEditTodo(),
    route: initializeRouteReducerState(router)
  };
}

export const update = combine<AppState, any>(
  reducer('route', route),
  reducer('todos', todos),
  reducer('editTodo', editTodo)
);
