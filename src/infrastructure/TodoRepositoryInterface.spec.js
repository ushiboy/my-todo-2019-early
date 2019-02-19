const assert = require('power-assert');
import { decodeRawToTodo } from './TodoRepositoryInterface.js';
import { assertEqualTodo, assertEqualDate } from '../testHelper.js';

describe('TodoRepositoryInterface', function() {
  describe('decodeRawToTodo()', () => {
    it('RAWから変換する', () => {
      const r = {
        id: 1,
        title: 't',
        complete: false,
        updatedAt: '2019-01-01T00:00:00+09:00'
      };
      const t = decodeRawToTodo(r);
      assertEqualTodo(t, r);
      assertEqualDate(t.updatedAt, r.updatedAt);
    });
  });
});
