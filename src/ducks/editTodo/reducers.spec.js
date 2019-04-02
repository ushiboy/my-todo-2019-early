const assert = require('power-assert');
import {
  CREATE_DRAFT,
  CHANGE_TITLE,
  CHANGE_COMPLETE,
  LOADING,
  LOADED,
  LOAD_FAILED,
  INVALID,
  SAVE_SUCCESS,
  REMOVE_SUCCESS,
  CLEAR_FIELD_ERROR,
  CLEAR
} from './actions.js';
import { editTodo, initState } from './reducers.js';
import { decodeISO8601ToDate } from '../../utils/DateUtils.js';

describe('editTodo', function() {
  describe('reducer', () => {
    context(`${CREATE_DRAFT}アクションの場合`, () => {
      let state;
      beforeEach(() => {
        const bs = {
          ...initState(),
          fields: {
            id: 1,
            title: 't',
            complete: true,
            updatedAt: new Date(),
            draft: false
          },
          syncCompleted: true
        };
        [state] = editTodo(bs, {
          type: CREATE_DRAFT
        });
      });
      it('フィールドをドラフト初期値にする', () => {
        const { fields } = state;
        assert(fields.id === -1);
        assert(fields.title === '');
        assert(fields.complete === false);
        assert(fields.draft === true);
      });
      it('同期を未完了にする', () => {
        assert(state.syncCompleted === false);
      });
    });
    context(`${LOADING}アクションの場合`, () => {
      it('ロード中にする', () => {
        const [s] = editTodo(initState(), {
          type: LOADING,
          payload: {
            id: 1
          }
        });
        assert(s.loading === true);
      });
    });
    context(`${LOADED}アクションの場合`, () => {
      const todo = {
        id: 1,
        title: 't',
        complete: true,
        updatedAt: new Date(),
        draft: false
      };
      let state;
      beforeEach(() => {
        const bs = {
          ...initState(),
          loading: true
        };
        [state] = editTodo(bs, {
          type: LOADED,
          payload: {
            todo
          }
        });
      });
      it('フィールドをpayloadのtodoにする', () => {
        const { fields } = state;
        assert(fields.id === todo.id);
        assert(fields.title === todo.title);
        assert(fields.complete === todo.complete);
        assert(fields.draft === todo.draft);
      });
      it('ロード完了にする', () => {
        assert(state.loading === false);
      });
    });
    context(`${LOAD_FAILED}アクションの場合`, () => {
      let state;
      beforeEach(() => {
        const bs = {
          ...initState(),
          loading: true
        };
        [state] = editTodo(bs, {
          type: LOAD_FAILED
        });
      });
      it('ロード完了にする', () => {
        assert(state.loading === false);
      });
      it('ロード失敗にする', () => {
        assert(state.loadFailed === true);
      });
      it('取得失敗メッセージを設定する', () => {
        assert(state.message === '対象データの取得に失敗しました');
        assert(state.messageType === 'danger');
      });
    });
    context(`${CHANGE_TITLE}アクションの場合`, () => {
      const title = 't2';
      let state;
      beforeEach(() => {
        [state] = editTodo(initState(), {
          type: CHANGE_TITLE,
          payload: {
            title
          }
        });
      });
      it('タイトルを変更する', () => {
        const { fields } = state;
        assert(fields.title === title);
      });
    });
    context(`${CHANGE_COMPLETE}アクションの場合`, () => {
      const complete = true;
      let state;
      beforeEach(() => {
        [state] = editTodo(initState(), {
          type: CHANGE_COMPLETE,
          payload: {
            complete
          }
        });
      });
      it('完了状態を変更する', () => {
        const { fields } = state;
        assert(fields.complete === complete);
      });
    });
    context(`${INVALID}アクションの場合`, () => {
      const errors = {
        title: 'error'
      };
      let state;
      beforeEach(() => {
        [state] = editTodo(initState(), {
          type: INVALID,
          payload: {
            errors
          }
        });
      });
      it('エラーメッセージを設定する', () => {
        assert(state.fieldErrors.title === errors.title);
      });
    });
    context(`${SAVE_SUCCESS}アクションの場合`, () => {
      let state;
      beforeEach(() => {
        [state] = editTodo(initState(), {
          type: SAVE_SUCCESS
        });
      });
      it('同期を完了にする', () => {
        assert(state.syncCompleted === true);
      });
      it('保存完了メッセージを設定する', () => {
        assert(state.message === '保存しました');
        assert(state.messageType === 'success');
      });
    });
    context(`${REMOVE_SUCCESS}アクションの場合`, () => {
      let state;
      beforeEach(() => {
        [state] = editTodo(initState(), {
          type: REMOVE_SUCCESS
        });
      });
      it('同期を完了にする', () => {
        assert(state.syncCompleted === true);
      });
      it('削除完了メッセージを設定する', () => {
        assert(state.message === '削除しました');
        assert(state.messageType === 'success');
      });
    });
    context(`${CLEAR_FIELD_ERROR}アクションの場合`, () => {
      let state;
      beforeEach(() => {
        const bs = {
          fieldErrors: {
            title: 'error'
          }
        };
        [state] = editTodo(bs, {
          type: CLEAR_FIELD_ERROR,
          payload: {
            fieldName: 'title'
          }
        });
      });
      it('対象フィールドのフィールドエラーをクリアする', () => {
        const { fieldErrors } = state;
        assert(fieldErrors.title === null);
      });
    });
    context(`${CLEAR}アクションの場合`, () => {
      let state;
      beforeEach(() => {
        const bs = {
          fields: {
            id: 1,
            title: 't',
            complete: true,
            updatedAt: new Date(),
            draft: false
          },
          loading: true,
          loadFailed: true,
          syncCompleted: true,
          message: 'm',
          messageType: 'mt'
        };
        [state] = editTodo(bs, {
          type: CLEAR
        });
      });
      it('フィールドをドラフト初期値にする', () => {
        const { fields } = state;
        assert(fields.id === -1);
        assert(fields.title === '');
        assert(fields.complete === false);
        assert(fields.draft === true);
      });
      it('ロード失敗なしにする', () => {
        assert(state.loadFailed === false);
      });
      it('同期を未完了にする', () => {
        assert(state.syncCompleted === false);
      });
      it('同期メッセージをクリアする', () => {
        assert(state.message === '');
        assert(state.messageType === '');
      });
      it('ロード完了にする', () => {
        assert(state.loading === false);
      });
    });
  });
});
