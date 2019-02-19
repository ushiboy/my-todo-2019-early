const assert = require('power-assert');
import {
  LocalStorageRepository,
  MemoryStorage
} from './LocalStorageRepository.js';
import { assertEqualTodo, assertEqualDate } from '../testHelper.js';

describe('LocalStorageRepository', function() {
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

  describe('fetchAll()', () => {
    let repo;
    beforeEach(() => {
      const s = new MemoryStorage();
      s.setItem('item-keys', 'item-1,item-2');
      s.setItem('item-1', JSON.stringify(todos[0]));
      s.setItem('item-2', JSON.stringify(todos[1]));
      repo = new LocalStorageRepository(s);
    });
    it('ストレージから取得したTodoをすべて返す', async () => {
      const r = await repo.fetchAll();
      assert(r.length === 2);
      const [t1, t2] = r;
      const [r1, r2] = todos;
      assertEqualTodo(t1, r1);
      assertEqualDate(t1.updatedAt, r1.updatedAt);

      assertEqualTodo(t2, r2);
      assertEqualDate(t2.updatedAt, r2.updatedAt);
    });
  });
  describe('add()', () => {
    let repo;
    let storage;
    beforeEach(() => {
      storage = new MemoryStorage();
      repo = new LocalStorageRepository(storage);
    });
    it('Todoをストレージに追加する', async () => {
      const dt1 = {
        title: 't1',
        complete: false
      };
      await repo.add(dt1);
      assert(storage.getItem('item-keys') === '1');
      const t1 = JSON.parse(storage.getItem('1'));
      assert(t1.id === 1);
      assert(t1.title === dt1.title);
      assert(t1.complete === false);

      const dt2 = {
        title: 't2',
        complete: false
      };
      await repo.add(dt2);
      assert(storage.getItem('item-keys') === '1,2');
      const t2 = JSON.parse(storage.getItem('2'));
      assert(t2.id === 2);
      assert(t2.title === dt2.title);
      assert(t2.complete === false);
    });
  });
  describe('fetchById()', () => {
    let repo;
    beforeEach(() => {
      const s = new MemoryStorage();
      s.setItem('item-keys', '1,2');
      s.setItem('1', JSON.stringify(todos[0]));
      s.setItem('2', JSON.stringify(todos[1]));
      repo = new LocalStorageRepository(s);
    });
    context('指定IDに該当するTodoが存在する場合', () => {
      it('ストレージから取得して返す', async () => {
        const t = await repo.fetchById(1);
        const [r] = todos;
        assertEqualTodo(t, r);
        assertEqualDate(t.updatedAt, r.updatedAt);
      });
    });
    context('指定IDに該当するTodoが存在しない場合', () => {
      it('エラーとする', async () => {
        try {
          await repo.fetchById(100);
          assert(false);
        } catch (e) {
          assert(e.message === 'Not Found');
        }
      });
    });
  });
  describe('update()', () => {
    let storage;
    let repo;
    beforeEach(() => {
      storage = new MemoryStorage();
      storage.setItem('item-keys', '1');
      storage.setItem('1', JSON.stringify(todos[0]));
      repo = new LocalStorageRepository(storage);
    });
    context('該当するTodoが存在する場合', () => {
      it('更新Todoをストレージに格納する', async () => {
        const t = {
          id: 1,
          title: 't2',
          complete: true,
          updatedAt: new Date('2019-01-01T00:00:00+09:00')
        };
        await repo.update(t);
        const t1 = JSON.parse(storage.getItem('1'));
        assertEqualTodo(t1, t);
      });
    });
    context('該当するTodoが存在しない場合', () => {
      it('エラーとする', async () => {
        try {
          await repo.update({
            id: 100,
            title: 't2',
            complete: true,
            updatedAt: new Date('2019-01-01T00:00:00+09:00')
          });
          assert(false);
        } catch (e) {
          assert(e.message === 'Not Found');
        }
      });
    });
  });
  describe('remove()', () => {
    let storage;
    let repo;
    beforeEach(() => {
      storage = new MemoryStorage();
      storage.setItem('item-keys', '1,2');
      storage.setItem('1', JSON.stringify(todos[0]));
      storage.setItem('2', JSON.stringify(todos[1]));
      repo = new LocalStorageRepository(storage);
    });
    it('対象のTodoをストレージから削除する', async () => {
      const t = {
        id: 1,
        title: 't',
        complete: false,
        updatedAt: new Date('2019-01-01T00:00:00+09:00')
      };
      await repo.remove(t);
      assert(storage.getItem('1') === undefined);
      assert(storage.getItem('item-keys') === '2');
    });
  });
});

describe('MemoryStorage', function() {
  describe('setItem()', () => {
    it('キーとデータをストレージに格納する', () => {
      const s = new MemoryStorage();
      s.setItem('a', '1');
      assert(s.getItem('a') === '1');
      s.setItem('a', '2');
      assert(s.getItem('a') === '2');
    });
  });
  describe('getItem()', () => {
    it('キーに該当するストレージの格納アイテムを返す', () => {
      const s = new MemoryStorage();
      s.setItem('a', '1');
      assert(s.getItem('a') === '1');
      assert(s.getItem('b') === undefined);
    });
  });
  describe('clear()', () => {
    it('ストレージの格納アイテム数をクリアする', () => {
      const s = new MemoryStorage();
      s.setItem('a', '1');
      s.setItem('b', '2');
      s.setItem('c', '3');
      assert(s.length === 3);
      s.clear();
      assert(s.length === 0);
    });
  });
  describe('removeItem()', () => {
    it('キーに該当するストレージの格納アイテムを削除する', () => {
      const s = new MemoryStorage();
      s.setItem('a', '1');
      assert(s.getItem('a') === '1');
      s.removeItem('a');
      assert(s.getItem('a') === undefined);
    });
  });
  describe('key()', () => {
    it('指定インデックスのストレージの格納キーを返す', () => {
      const s = new MemoryStorage();
      s.setItem('a', '1');
      s.setItem('b', '2');
      s.setItem('c', '3');
      assert(s.key(1) === 'b');
    });
  });
  describe('length', () => {
    it('ストレージの格納アイテム数を返す', () => {
      const s = new MemoryStorage();
      s.setItem('a', '1');
      s.setItem('b', '2');
      s.setItem('c', '3');
      assert(s.length === 3);
    });
  });
});
