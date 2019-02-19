/* @flow */
import type { ThunkAction } from '../types.js';
import type { ChangeVisibleFilterAction } from './types.js';

export const LOADING = 'todos/LOADING';
export const LOADED = 'todos/LOADED';
export const CHANGE_VISIBLE_FILTER = 'todos/CHANGE_VISIBLE_FILTER';

export function fetchTodos(): ThunkAction {
  return async (dispatch, getState, { todoRepository }) => {
    dispatch({ type: LOADING });
    const todos = await todoRepository.fetchAll();
    dispatch({
      type: LOADED,
      payload: {
        todos
      }
    });
  };
}

export function changeVisibleFilter(key: string): ChangeVisibleFilterAction {
  let filter = 'all';
  if (key === 'active' || key === 'completed') {
    filter = key;
  }
  return { type: CHANGE_VISIBLE_FILTER, payload: { filter } };
}
