/* @flow */
import type { EditTodoState, Action } from './types.js';
import {
  CREATE_DRAFT,
  CHANGE_TITLE,
  CHANGE_COMPLETE,
  LOADING,
  LOADED,
  INVALID,
  SAVE_SUCCESS,
  REMOVE_SUCCESS,
  CLEAR_FIELD_ERROR,
  CLEAR
} from './actions.js';
import {
  createDraftTodo,
  clearTodoError,
  clearTodoErrorByFieldName
} from '../../domain/Todo.js';

export function editTodo(
  state: EditTodoState = initState(),
  action: Action
): EditTodoState {
  switch (action.type) {
    case CREATE_DRAFT: {
      return {
        ...state,
        fields: createDraftTodo(),
        syncCompleted: false
      };
    }
    case LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case LOADED: {
      const { todo } = action.payload;
      return {
        ...state,
        fields: {
          ...todo
        },
        loading: false
      };
    }
    case CHANGE_TITLE: {
      const { title } = action.payload;
      const fields = { ...state.fields, title };
      return {
        ...state,
        fields
      };
    }
    case CHANGE_COMPLETE: {
      const { complete } = action.payload;
      const fields = { ...state.fields, complete };
      return {
        ...state,
        fields
      };
    }
    case INVALID: {
      const { errors } = action.payload;
      return {
        ...state,
        fieldErrors: {
          ...errors
        }
      };
    }
    case SAVE_SUCCESS: {
      return {
        ...state,
        syncCompleted: true,
        message: '保存しました',
        messageType: 'success'
      };
    }
    case REMOVE_SUCCESS: {
      return {
        ...state,
        syncCompleted: true,
        message: '削除しました',
        messageType: 'success'
      };
    }
    case CLEAR_FIELD_ERROR: {
      const { fieldName } = action.payload;
      return {
        ...state,
        fieldErrors: clearTodoErrorByFieldName(state.fieldErrors, fieldName)
      };
    }
    case CLEAR: {
      return initState();
    }
    default: {
      return state;
    }
  }
}

export function initState(): EditTodoState {
  return {
    fields: createDraftTodo(),
    fieldErrors: clearTodoError(),
    loading: false,
    syncCompleted: false,
    message: '',
    messageType: ''
  };
}
