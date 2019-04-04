const assert = require('power-assert');
import { createMockStore } from '@ushiboy/cyclone-mock-store';
import {
  LOADING,
  LOADED,
  CHANGE_VISIBLE_FILTER,
  fetchTodos,
  fetchProcessTodos,
  changeVisibleFilter
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

describe('todos', function() {
  describe('actions', () => {
    describe('fetchTodos()', () => {
      let store;
      beforeEach(() => {
        store = mockDispatcher(extra);
        return store.dispatch(fetchTodos());
      });
      it('LOADINGアクションを実行する', () => {
        const [a] = store.getActions();
        assert(a.type === LOADING);
      });
    });
    describe('fetchProcessTodos()', () => {
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
      storage.setItem('item-keys', 'item-1,item-2');
      storage.setItem('item-1', JSON.stringify(todos[0]));
      storage.setItem('item-2', JSON.stringify(todos[1]));

      let store;
      beforeEach(() => {
        store = mockDispatcher(extra);
        return store.dispatch(fetchProcessTodos());
      });
      it('LOADEDアクションを実行する', () => {
        const [a] = store.getActions();
        assert(a.type === LOADED);

        const [t1, t2] = a.payload.todos;
        const [r1, r2] = todos;
        assertEqualTodo(t1, r1);
        assertEqualDate(t1.updatedAt, r1.updatedAt);

        assertEqualTodo(t2, r2);
        assertEqualDate(t2.updatedAt, r2.updatedAt);
      });
    });
    describe('changeVisibleFilter()', () => {
      it('CHANGE_VISIBLE_FILTERアクションを実行する', async () => {
        const store = mockDispatcher(extra);
        await store.dispatch(changeVisibleFilter('active'));
        const [a] = store.getActions();
        assert(a.type === CHANGE_VISIBLE_FILTER);
      });
      context('"active"が渡された場合', () => {
        it('"active"をフィルターとする', async () => {
          const store = mockDispatcher(extra);
          await store.dispatch(changeVisibleFilter('active'));
          const [a] = store.getActions();
          assert(a.payload.filter === 'active');
        });
      });
      context('"completed"が渡された場合', () => {
        it('"completed"をフィルターとする', async () => {
          const store = mockDispatcher(extra);
          await store.dispatch(changeVisibleFilter('completed'));
          const [a] = store.getActions();
          assert(a.payload.filter === 'completed');
        });
      });
      context('"active","completed"以外が渡された場合', () => {
        it('"all"をフィルターとする', async () => {
          const store = mockDispatcher(extra);
          await store.dispatch(changeVisibleFilter(''));
          const [a] = store.getActions();
          assert(a.payload.filter === 'all');
        });
      });
    });
  });
});
