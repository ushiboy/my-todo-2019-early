const assert = require('power-assert');
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  LOADING,
  LOADED,
  CHANGE_VISIBLE_FILTER,
  fetchTodos,
  changeVisibleFilter
} from './actions.js';
import { initState } from './reducers.js';
import {
  LocalStorageRepository,
  MemoryStorage
} from '../../infrastructure/LocalStorageRepository.js';
import { encodeDateToISO8601 } from '../../utils/DateUtils.js';

const storage = new MemoryStorage();
const middlewares = [
  thunk.withExtraArgument({
    todoRepository: new LocalStorageRepository(storage)
  })
];
const mockStore = configureMockStore(middlewares);

describe('todos', function() {
  describe('actions', () => {
    describe('fetchTodos()', () => {
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
        store = mockStore({ todos: initState() });
        return store.dispatch(fetchTodos());
      });
      it('データ取得前にLOADINGアクションを実行する', () => {
        const [a] = store.getActions();
        assert(a.type === LOADING);
      });
      it('データ取得完了後にLOADEDアクションを実行する', () => {
        const [, a] = store.getActions();
        assert(a.type === LOADED);

        const [t1, t2] = a.payload.todos;
        const [r1, r2] = todos;
        assert(t1.id === r1.id);
        assert(t1.title === r1.title);
        assert(t1.complete === r1.complete);
        assert(t1.updatedAt.constructor === Date);
        assert(encodeDateToISO8601(t1.updatedAt) === r1.updatedAt);

        assert(t2.id === r2.id);
        assert(t2.title === r2.title);
        assert(t2.complete === r2.complete);
        assert(t2.updatedAt.constructor === Date);
        assert(encodeDateToISO8601(t2.updatedAt) === r2.updatedAt);
      });
    });
    describe('changeVisibleFilter()', () => {
      it('CHANGE_VISIBLE_FILTERアクションを実行する', () => {
        const store = mockStore({ todos: initState() });
        store.dispatch(changeVisibleFilter('active'));
        const [a] = store.getActions();
        assert(a.type === CHANGE_VISIBLE_FILTER);
      });
      context('"active"が渡された場合', () => {
        it('"active"をフィルターとする', () => {
          const store = mockStore({ todos: initState() });
          store.dispatch(changeVisibleFilter('active'));
          const [a] = store.getActions();
          assert(a.payload.filter === 'active');
        });
      });
      context('"completed"が渡された場合', () => {
        it('"completed"をフィルターとする', () => {
          const store = mockStore({ todos: initState() });
          store.dispatch(changeVisibleFilter('completed'));
          const [a] = store.getActions();
          assert(a.payload.filter === 'completed');
        });
      });
      context('"active","completed"以外が渡された場合', () => {
        it('"all"をフィルターとする', () => {
          const store = mockStore({ todos: initState() });
          store.dispatch(changeVisibleFilter(''));
          const [a] = store.getActions();
          assert(a.payload.filter === 'all');
        });
      });
    });
  });
});
