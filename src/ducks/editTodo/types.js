/* @flow */
import type { Todo, TodoError } from '../../domain/Todo.js';

export type EditTodoState = {
  fields: Todo,
  fieldErrors: TodoError,
  loading: boolean,
  syncCompleted: boolean,
  message: string,
  messageType: string
};

export type CreateDraftAction = {
  type: 'editTodo/CREATE_DRAFT'
};

export type ChangeTitleAction = {
  type: 'editTodo/CHANGE_TITLE',
  payload: {
    title: string
  }
};

export type ChangeCompleteAction = {
  type: 'editTodo/CHANGE_COMPLETE',
  payload: {
    complete: boolean
  }
};

export type LoadingAction = {
  type: 'editTodo/LOADING'
};

export type LoadedAction = {
  type: 'editTodo/LOADED',
  payload: {
    todo: Todo
  }
};

export type InvalidTodoAction = {
  type: 'editTodo/INVALID',
  payload: {
    errors: TodoError
  }
};

export type ClearFieldErrorAction = {
  type: 'editTodo/CLEAR_FIELD_ERROR',
  payload: {
    fieldName: string
  }
};

export type SaveSuccessAction = {
  type: 'editTodo/SAVE_SUCCESS'
};

export type RemoveSuccessAction = {
  type: 'editTodo/REMOVE_SUCCESS'
};

export type ClearAction = {
  type: 'editTodo/CLEAR'
};

export type Action =
  | CreateDraftAction
  | ChangeTitleAction
  | ChangeCompleteAction
  | LoadingAction
  | LoadedAction
  | InvalidTodoAction
  | SaveSuccessAction
  | RemoveSuccessAction
  | ClearFieldErrorAction
  | ClearAction;
