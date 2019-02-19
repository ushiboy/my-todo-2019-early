const assert = require('power-assert');
import {
  createDraftTodo,
  clearTodoErrorByFieldName,
  validate,
  filterActiveTodos,
  filterCompletedTodos
} from './Todo.js';

describe('Todo', function() {
  describe('createDraftTodo()', () => {
    it('ドラフト用Todoを生成する', () => {
      const { id, title, complete, draft } = createDraftTodo();
      assert(id === -1);
      assert(title === '');
      assert(complete === false);
      assert(draft === true);
    });
  });
  describe('clearTodoErrorByFieldName()', () => {
    it('指定のフィールドのエラーをクリアする', () => {
      const e = { title: 'error' };
      const r = clearTodoErrorByFieldName(e, 'title');
      assert(r.title === null);
    });
  });
  describe('validate()', () => {
    context('タイトルが未入力の場合', () => {
      it('タイトル未入力エラーにする', () => {
        const [valid, errors] = validate({
          title: ''
        });
        assert(valid === false);
        assert(errors.title === '未入力です');
      });
    });
    context('タイトルが入力済みの場合', () => {
      it('エラーなしにする', () => {
        const [valid, errors] = validate({
          title: 't'
        });
        assert(valid === true);
      });
    });
  });
  describe('filterActiveTodos()', () => {
    it('未完了のTodoに絞り込む', () => {
      const todos = [
        {
          id: 1,
          title: 't1',
          complete: false,
          updatedAt: new Date(),
          draft: false
        },
        {
          id: 2,
          title: 't2',
          complete: true,
          updatedAt: new Date(),
          draft: false
        }
      ];
      const filtered = filterActiveTodos(todos);
      assert(filtered.length === 1);
      const [t] = filtered;
      const [r] = todos;
      assert(t.id === r.id);
      assert(t.complete === false);
    });
  });
  describe('filterCompletedTodos()', () => {
    it('完了のTodoに絞り込む', () => {
      const todos = [
        {
          id: 1,
          title: 't1',
          complete: false,
          updatedAt: new Date(),
          draft: false
        },
        {
          id: 2,
          title: 't2',
          complete: true,
          updatedAt: new Date(),
          draft: false
        }
      ];
      const filtered = filterCompletedTodos(todos);
      assert(filtered.length === 1);
      const [t] = filtered;
      const [, r] = todos;
      assert(t.id === r.id);
      assert(t.complete === true);
    });
  });
});
