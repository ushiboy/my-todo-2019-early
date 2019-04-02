/* @flow */
import type { NoneAction } from '@ushiboy/cyclone';
import type { Todo } from '../../domain/Todo.js';
import type { InjectionAction } from '../types.js';

export type VisibleFilter = 'all' | 'active' | 'completed';

export type TodosState = {
  records: Array<Todo>,
  visibleRecords: Array<Todo>,
  loading: boolean,
  filter: VisibleFilter
};

export type LoadingAction = {
  type: 'todos/LOADING'
};

export type LoadedAction = {
  type: 'todos/LOADED',
  payload: {
    todos: Array<Todo>
  }
};

export type ChangeVisibleFilterAction = {
  type: 'todos/CHANGE_VISIBLE_FILTER',
  payload: {
    filter: VisibleFilter
  }
};

export type Action =
  | LoadingAction
  | LoadedAction
  | ChangeVisibleFilterAction
  | NoneAction
  | InjectionAction<LoadedAction>;
