/* @flow */
import type { TodosState, Action } from './types.js';
import { LOADING, LOADED, CHANGE_VISIBLE_FILTER } from './actions.js';
import { filterActiveTodos, filterCompletedTodos } from '../../domain/Todo.js';

export function todos(
  state: TodosState = initState(),
  action: Action
): TodosState {
  switch (action.type) {
    case LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case LOADED: {
      const { todos } = action.payload;
      return {
        ...state,
        records: todos,
        visibleRecords: filterVisibleRecords(todos, state.filter),
        loading: false
      };
    }
    case CHANGE_VISIBLE_FILTER: {
      const { filter } = action.payload;
      return {
        ...state,
        visibleRecords: filterVisibleRecords(state.records, filter),
        filter
      };
    }
    default: {
      return state;
    }
  }
}

function filterVisibleRecords(records, filter) {
  if (filter === 'active') {
    return filterActiveTodos(records);
  } else if (filter === 'completed') {
    return filterCompletedTodos(records);
  }
  return records;
}

export function initState(): TodosState {
  return {
    records: [],
    visibleRecords: [],
    loading: false,
    filter: 'all'
  };
}
