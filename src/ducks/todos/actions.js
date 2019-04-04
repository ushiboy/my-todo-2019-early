/* @flow */
import type { InjectionAction } from '../types.js';
import type {
  ChangeVisibleFilterAction,
  LoadingAction,
  LoadedAction
} from './types.js';

export const LOADING = 'todos/LOADING';
export const LOADED = 'todos/LOADED';
export const CHANGE_VISIBLE_FILTER = 'todos/CHANGE_VISIBLE_FILTER';

export function fetchTodos(): LoadingAction {
  return { type: LOADING };
}

export function fetchProcessTodos(): InjectionAction<LoadedAction> {
  return async ({ todoRepository }) => {
    const todos = await todoRepository.fetchAll();
    return {
      type: LOADED,
      payload: {
        todos
      }
    };
  };
}

export function changeVisibleFilter(key: string): ChangeVisibleFilterAction {
  let filter = 'all';
  if (key === 'active' || key === 'completed') {
    filter = key;
  }
  return { type: CHANGE_VISIBLE_FILTER, payload: { filter } };
}
