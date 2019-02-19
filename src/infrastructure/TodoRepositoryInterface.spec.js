const assert = require('power-assert');
import { decodeRawToTodo } from './TodoRepositoryInterface.js';
import { encodeDateToISO8601 } from '../utils/DateUtils.js';

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
      assert(t.id === r.id);
      assert(t.title === r.title);
      assert(t.complete === r.complete);
      assert(encodeDateToISO8601(t.updatedAt) === r.updatedAt);
    });
  });
});
