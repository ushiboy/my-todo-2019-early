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
  save,
  remove
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
      context('該当データが存在する場合', () => {
        let store;
        beforeEach(() => {
          store = mockDispatcher(extra);
          return store.dispatch(fetchById(1));
        });
        it('データ取得前にLOADINGアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === LOADING);
        });
        //it('データ取得完了後にLOADEDアクションを実行する', () => {
        //  const [, a] = store.getActions();
        //  assert(a.type === LOADED);

        //  const { todo } = a.payload;
        //  const [r] = todos;
        //  assertEqualTodo(todo, r);
        //  assertEqualDate(todo.updatedAt, r.updatedAt);
        //});
      });
      context('該当データが存在しない場合', () => {
        let store;
        beforeEach(() => {
          store = mockDispatcher(extra);
          return store.dispatch(fetchById(99));
        });
        it('データ取得前にLOADINGアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === LOADING);
        });
        //it('データ取得失敗後にLOAD_FAILEDアクションを実行する', () => {
        //  const [, a] = store.getActions();
        //  assert(a.type === LOAD_FAILED);
        //});
      });
    });
    describe('save()', () => {
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
          return store.dispatch(save(editTodo));
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
          return store.dispatch(save(editTodo));
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
          return store.dispatch(save(editTodo));
        });
        it('INVALIDアクションを実行する', () => {
          const [a] = store.getActions();
          assert(a.type === INVALID);
          assert(a.payload.errors.title === '未入力です');
        });
      });
    });
    describe('remove()', () => {
      let store;
      beforeEach(() => {
        const editTodo = {
          ...initState(),
          fields: {
            ...todos[0]
          }
        };
        store = mockDispatcher(extra);
        return store.dispatch(remove(editTodo));
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
