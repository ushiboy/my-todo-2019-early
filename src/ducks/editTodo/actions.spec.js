const assert = require('power-assert');
import { createMockStore } from '@ushiboy/cyclone-mock-store';
import {
  LOADING,
  LOADED,
  LOAD_FAILED,
  INVALID,
  SAVE_SUCCESS,
  REMOVE_SUCCESS,
  fetchById,
  fetchProcessById,
  saveProcess,
  removeProcess
} from './actions.js';
import { initState } from './reducers.js';
import {
  LocalStorageRepository,
  MemoryStorage
} from '../../infrastructure/LocalStorageRepository.js';
import { assertEqualTodo, assertEqualDate } from '../../testHelper.js';

const storage = new MemoryStorage();
const extra = {
  todoRepository: new LocalStorageRepository(storage)
};
const { mockDispatcher } = createMockStore();

describe('editTodo', function() {
  describe('actions', () => {
    const todos = [
      {
        id: 1,
        title: 't1',
        complete: false,
        updatedAt: '2019-01-01T00:00:00+09:00'
      },
      {
        id: 2,
        title: 't2',
        complete: true,
        updatedAt: '2019-01-01T01:00:00+09:00'
      }
    ];
    beforeEach(() => {
      storage.setItem('item-keys', '1,2');
      storage.setItem('1', JSON.stringify(todos[0]));
      storage.setItem('2', JSON.stringify(todos[1]));
    });
    afterEach(() => {
      storage.clear();
    });
    describe('fetchById()', () => {
      let store;
      beforeEach(() => {
        store = mockDispatcher(extra);
        return store.dispatch(fetchById(1));
      });
      it('LOADINGアクションを実行する', () => {
        const [a] = store.getActions();
        assert(a.type === LOADING);
        assert(a.payload.id === 1);
      });
    });
    describe('fetchProcessById()', () => {
      context('該当データが存在する場合', () => {
        let store;
        beforeEach(() => {
          store = mockDispatcher(extra);
          return store.dispatch(fetchProcessById(1));
        });
        it('LOADEDアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === LOADED);

          const { todo } = a.payload;
          const [r] = todos;
          assertEqualTodo(todo, r);
          assertEqualDate(todo.updatedAt, r.updatedAt);
        });
      });
      context('該当データが存在しない場合', () => {
        let store;
        beforeEach(() => {
          store = mockDispatcher(extra);
          return store.dispatch(fetchProcessById(99));
        });
        it('LOAD_FAILEDアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === LOAD_FAILED);
        });
      });
    });
    describe('saveProcess()', () => {
      context('新規データの追加の場合', () => {
        const draft = {
          id: -1,
          title: 'e1',
          complete: false,
          updatedAt: '2019-01-01T00:00:00+09:00',
          draft: true
        };
        let store;
        beforeEach(() => {
          const editTodo = {
            ...initState(),
            fields: {
              ...draft
            }
          };
          store = mockDispatcher(extra);
          return store.dispatch(saveProcess(editTodo));
        });
        it('SAVE_SUCCESSアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === SAVE_SUCCESS);
        });
        it('追加データをリポジトリに適用する', () => {
          const r = JSON.parse(storage.getItem('3'));
          assert(draft.title === r.title);
          assert(draft.complete === r.complete);
        });
      });
      context('既存データの更新の場合', () => {
        const modified = {
          id: 1,
          title: 'e1',
          complete: true,
          updatedAt: '2019-01-01T00:00:00+09:00',
          draft: false
        };
        let store;
        beforeEach(() => {
          const editTodo = {
            ...initState(),
            fields: {
              ...modified
            }
          };
          store = mockDispatcher(extra);
          return store.dispatch(saveProcess(editTodo));
        });
        it('SAVE_SUCCESSアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === SAVE_SUCCESS);
        });
        it('更新データをリポジトリに適用する', () => {
          const r = JSON.parse(storage.getItem('1'));
          assertEqualTodo(modified, r);
        });
      });
      context('バリデーションエラーが発生した場合', () => {
        const draft = {
          id: -1,
          title: '',
          complete: false,
          updatedAt: '2019-01-01T00:00:00+09:00',
          draft: true
        };
        let store;
        beforeEach(() => {
          const editTodo = {
            ...initState(),
            fields: {
              ...draft
            }
          };
          store = mockDispatcher(extra);
          return store.dispatch(saveProcess(editTodo));
        });
        it('INVALIDアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === INVALID);
          assert(a.payload.errors.title === '未入力です');
        });
      });
    });
    describe('removeProcess()', () => {
      let store;
      beforeEach(() => {
        const editTodo = {
          ...initState(),
          fields: {
            ...todos[0]
          }
        };
        store = mockDispatcher(extra);
        return store.dispatch(removeProcess(editTodo));
      });
      it('REMOVE_SUCCESSアクションを実行する', () => {
        const [a] = store.getActions();
        assert(a.type === REMOVE_SUCCESS);
      });
      it('削除データをリポジトリに適用する', () => {
        const r = storage.getItem('1');
        assert(r === undefined);
      });
    });
  });
});
