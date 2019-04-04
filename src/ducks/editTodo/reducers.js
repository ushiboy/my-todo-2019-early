/* @flow */
import type { InjectionAction } from '../types.js';
import type { EditTodoState, Action } from './types.js';
import { none } from '@ushiboy/cyclone';
import {
  CREATE_DRAFT,
  CHANGE_TITLE,
  CHANGE_COMPLETE,
  LOADING,
  LOADED,
  LOAD_FAILED,
  INVALID,
  SAVE,
  SAVE_SUCCESS,
  REMOVE,
  REMOVE_SUCCESS,
  CLEAR_FIELD_ERROR,
  CLEAR,
  fetchProcessById,
  saveProcess,
  removeProcess
} from './actions.js';
import {
  createDraftTodo,
  clearTodoError,
  clearTodoErrorByFieldName
} from '../../domain/Todo.js';

export function editTodo(
  state: EditTodoState,
  action: Action
): [EditTodoState, Action | InjectionAction<Action>] {
  switch (action.type) {
    case CREATE_DRAFT: {
      return [
        {
          ...state,
          fields: createDraftTodo(),
          syncCompleted: false
        },
        none()
      ];
    }
    case LOADING: {
      return [
        {
          ...state,
          loading: true
        },
        fetchProcessById(action.payload.id)
      ];
    }
    case LOADED: {
      const { todo } = action.payload;
      return [
        {
          ...state,
          fields: {
            ...todo
          },
          loading: false
        },
        none()
      ];
    }
    case LOAD_FAILED: {
      return [
        {
          ...state,
          loading: false,
          loadFailed: true,
          message: '対象データの取得に失敗しました',
          messageType: 'danger'
        },
        none()
      ];
    }
    case CHANGE_TITLE: {
      const { title } = action.payload;
      const fields = { ...state.fields, title };
      return [
        {
          ...state,
          fields
        },
        none()
      ];
    }
    case CHANGE_COMPLETE: {
      const { complete } = action.payload;
      const fields = { ...state.fields, complete };
      return [
        {
          ...state,
          fields
        },
        none()
      ];
    }
    case SAVE: {
      return [state, saveProcess(state)];
    }
    case INVALID: {
      const { errors } = action.payload;
      return [
        {
          ...state,
          fieldErrors: {
            ...errors
          }
        },
        none()
      ];
    }
    case SAVE_SUCCESS: {
      return [
        {
          ...state,
          syncCompleted: true,
          message: '保存しました',
          messageType: 'success'
        },
        none()
      ];
    }
    case REMOVE: {
      return [state, removeProcess(state)];
    }
    case REMOVE_SUCCESS: {
      return [
        {
          ...state,
          syncCompleted: true,
          message: '削除しました',
          messageType: 'success'
        },
        none()
      ];
    }
    case CLEAR_FIELD_ERROR: {
      const { fieldName } = action.payload;
      return [
        {
          ...state,
          fieldErrors: clearTodoErrorByFieldName(state.fieldErrors, fieldName)
        },
        none()
      ];
    }
    case CLEAR: {
      return [initState(), none()];
    }
    default: {
      return [state, none()];
    }
  }
}

export function initState(): EditTodoState {
  return {
    fields: createDraftTodo(),
    fieldErrors: clearTodoError(),
    loading: false,
    syncCompleted: false,
    loadFailed: false,
    message: '',
    messageType: ''
  };
}
