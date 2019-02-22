/* @flow */
import type { ThunkAction } from '../types.js';
import type {
  CreateDraftAction,
  ChangeTitleAction,
  ChangeCompleteAction,
  ClearFieldErrorAction,
  ClearAction
} from './types.js';
import type { TodoId } from '../../domain/Todo.js';
import { validate } from '../../domain/Todo.js';

export const CREATE_DRAFT = 'editTodo/CREATE_DRAFT';
export const LOADING = 'editTodo/LOADING';
export const LOADED = 'editTodo/LOADED';
export const LOAD_FAILED = 'editTodo/LOAD_FAILED';
export const CHANGE_TITLE = 'editTodo/CHANGE_TITLE';
export const CHANGE_COMPLETE = 'editTodo/CHANGE_COMPLETE';
export const INVALID = 'editTodo/INVALID';
export const SAVE_SUCCESS = 'editTodo/SAVE_SUCCESS';
export const REMOVE_SUCCESS = 'editTodo/REMOVE_SUCCESS';
export const CLEAR_FIELD_ERROR = 'editTodo/CLEAR_FIELD_ERROR';
export const CLEAR = 'editTodo/CLEAR';

export function createDraft(): CreateDraftAction {
  return { type: CREATE_DRAFT };
}

export function fetchById(id: TodoId): ThunkAction {
  return async (dispatch, getState, { todoRepository }) => {
    dispatch({ type: LOADING });
    try {
      const todo = await todoRepository.fetchById(id);
      dispatch({ type: LOADED, payload: { todo } });
    } catch (e) {
      dispatch({ type: LOAD_FAILED });
    }
  };
}

export function changeTitle(title: string): ChangeTitleAction {
  return { type: CHANGE_TITLE, payload: { title } };
}

export function changeComplete(complete: boolean): ChangeCompleteAction {
  return { type: CHANGE_COMPLETE, payload: { complete } };
}

export function save(): ThunkAction {
  return async (dispatch, getState, { todoRepository }) => {
    const { editTodo } = getState();
    const { fields } = editTodo;
    const [valid, errors] = validate(fields);
    if (valid) {
      if (fields.draft) {
        await todoRepository.add(fields);
        dispatch({ type: SAVE_SUCCESS });
      } else {
        await todoRepository.update(fields);
        dispatch({ type: SAVE_SUCCESS });
      }
    } else {
      dispatch({ type: INVALID, payload: { errors } });
    }
  };
}

export function remove(): ThunkAction {
  return async (dispatch, getState, { todoRepository }) => {
    const { editTodo } = getState();
    const { fields } = editTodo;
    await todoRepository.remove(fields);
    dispatch({ type: REMOVE_SUCCESS });
  };
}

export function clear(): ClearAction {
  return { type: CLEAR };
}

export function clearFieldError(fieldName: string): ClearFieldErrorAction {
  return { type: CLEAR_FIELD_ERROR, payload: { fieldName } };
}
