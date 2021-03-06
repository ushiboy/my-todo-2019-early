const assert = require('power-assert');
import { LOADING, LOADED, CHANGE_VISIBLE_FILTER } from './actions.js';
import { todos, initState } from './reducers.js';
import { decodeISO8601ToDate } from '../../utils/DateUtils.js';
import { assertEqualTodo } from '../../testHelper.js';

describe('todos', function() {
  describe('reducer', () => {
    context(`${LOADING}アクションの場合`, () => {
      it('ロード中にする', () => {
        const [s] = todos(initState(), {
          type: LOADING
        });
        assert(s.loading === true);
      });
    });
    context(`${LOADED}アクションの場合`, () => {
      const payloadTodos = [
        {
          id: 1,
          title: 't1',
          complete: false,
          updatedAt: decodeISO8601ToDate('2019-01-01T00:00:00+09:00')
        },
        {
          id: 2,
          title: 't2',
          complete: true,
          updatedAt: decodeISO8601ToDate('2019-01-01T01:00:00+09:00')
        }
      ];
      let state;
      beforeEach(() => {
        const b = {
          ...initState(),
          loading: true
        };
        [state] = todos(b, {
          type: LOADED,
          payload: {
            todos: payloadTodos
          }
        });
      });
      it('ロード完了にする', () => {
        assert(state.loading === false);
      });
      it('取得したTodoリストをrecordsに格納して持つ', () => {
        const { records } = state;
        const [t1, t2] = records;
        const [r1, r2] = payloadTodos;
        assertEqualTodo(t1, r1);
        assertEqualTodo(t2, r2);
      });
      it('取得したTodoリストをフィルタしてvisibleRecordsに格納して持つ', () => {
        const { visibleRecords } = state;

        const [t1, t2] = visibleRecords;
        const [r1, r2] = payloadTodos;
        assertEqualTodo(t1, r1);
        assertEqualTodo(t2, r2);
      });
    });
    context(`${CHANGE_VISIBLE_FILTER}アクションの場合`, () => {
      const records = [
        {
          id: 1,
          title: 't1',
          complete: false,
          updatedAt: new Date()
        },
        {
          id: 2,
          title: 't2',
          complete: true,
          updatedAt: new Date()
        }
      ];
      context('"active"の場合', () => {
        let state;
        beforeEach(() => {
          [state] = todos(
            { ...initState(), records },
            {
              type: CHANGE_VISIBLE_FILTER,
              payload: {
                filter: 'active'
              }
            }
          );
        });
        it('フィルタを"active"にする', () => {
          const { filter } = state;
          assert(filter === 'active');
        });
        it('表示対象レコードを未完了のTodoにする', () => {
          const { visibleRecords } = state;
          assert(visibleRecords.length === 1);
          const [t] = visibleRecords;
          const [r] = records;
          assert(t.id === r.id);
          assert(t.complete === false);
        });
      });
      context('"completed"の場合', () => {
        let state;
        beforeEach(() => {
          [state] = todos(
            { ...initState(), records },
            {
              type: CHANGE_VISIBLE_FILTER,
              payload: {
                filter: 'completed'
              }
            }
          );
        });
        it('フィルタを"completed"にする', () => {
          const { filter } = state;
          assert(filter === 'completed');
        });
        it('表示対象レコードを完了のTodoにする', () => {
          const { visibleRecords } = state;
          assert(visibleRecords.length === 1);
          const [t] = visibleRecords;
          const [, r] = records;
          assert(t.id === r.id);
          assert(t.complete === true);
        });
      });
      context('"all"の場合', () => {
        let state;
        beforeEach(() => {
          [state] = todos(
            { ...initState(), records },
            {
              type: CHANGE_VISIBLE_FILTER,
              payload: {
                filter: 'all'
              }
            }
          );
        });
        it('フィルタを"all"にする', () => {
          const { filter } = state;
          assert(filter === 'all');
        });
        it('表示対象レコードをすべてのTodoにする', () => {
          const { visibleRecords } = state;
          assert(visibleRecords.length === 2);
          const [t1, t2] = visibleRecords;
          const [r1, r2] = records;
          assertEqualTodo(t1, r1);
          assertEqualTodo(t2, r2);
        });
      });
    });
  });
});
