/* @flow */
import type { TodoRepository } from '../infrastructure/TodoRepositoryInterface.js';
import type {
  EditTodoState,
  Action as EditTodoAction
} from './editTodo/types.js';
import type { TodosState, Action as TodosAction } from './todos/types.js';
import { Router } from 'tridoron';

export type AppState = {
  editTodo: EditTodoState,
  route: RouteState,
  todos: TodosState
};

export type RouteState = {
  href: string,
  args: Array<string>,
  query: {
    [key: string]: string
  }
};

export type Action = TodosAction | EditTodoAction;

export type ThunkAction = (
  dispatch: Dispatch,
  getState: GetState,
  infrastructure: Infrastructure
) => Promise<void>;

export type Dispatch = (a: Action) => void;

export type GetState = () => AppState;

export type Infrastructure = {
  todoRepository: TodoRepository
};

export type ConnectedProps = {
  dispatch: (a: ThunkAction | Action) => void,
  router: Router
};
