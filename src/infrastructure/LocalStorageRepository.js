/* @flow */
import type { Todo, TodoId } from '../domain/Todo.js';
import type { TodoRepository } from './TodoRepositoryInterface.js';
import { decodeRawToTodo, encodeTodo } from './TodoRepositoryInterface.js';

export class LocalStorageRepository implements TodoRepository {
  _storage: StorageInterface;

  constructor(storage: StorageInterface) {
    this._storage = storage;
  }

  async fetchAll(): Promise<Array<Todo>> {
    const keys = this._storage.getItem('item-keys');
    if (!keys) return [];
    return keys.split(',').reduce((r, k) => {
      const i = this._storage.getItem(k);
      if (i) {
        r.push(decodeRawToTodo(JSON.parse(i)));
      }
      return r;
    }, []);
  }

  async add(draft: Todo): Promise<void> {
    let id = 1,
      k = [];
    const s = this._storage.getItem('item-keys');
    if (s) {
      k = s.split(',');
      const l = k[k.length - 1];
      id = Number(l) + 1;
    }
    const t = {
      ...draft,
      id,
      updatedAt: new Date()
    };
    k.push(`${id}`);
    this._storage.setItem('item-keys', k.join(','));
    this._storage.setItem(`${id}`, encodeTodo(t));
  }

  async fetchById(id: TodoId): Promise<Todo> {
    const i = this._storage.getItem(`${id}`);
    if (i) {
      return decodeRawToTodo(JSON.parse(i));
    }
    throw new Error('Not Found');
  }

  async update(todo: Todo): Promise<void> {
    const { id } = todo;
    await this.fetchById(id);
    const t = {
      ...todo,
      updatedAt: new Date()
    };
    this._storage.setItem(`${id}`, encodeTodo(t));
  }

  async remove(todo: Todo): Promise<void> {
    const { id } = todo;
    const s = this._storage.getItem('item-keys');
    if (s) {
      const keys = s.split(',').filter(k => Number(k) !== id);
      this._storage.setItem('item-keys', keys.join(','));
      this._storage.removeItem(`${id}`);
    }
  }
}

interface StorageInterface {
  +length: number;
  getItem(key: string): ?string;
  setItem(key: string, data: string): void;
  clear(): void;
  removeItem(key: string): void;
}

export class MemoryStorage implements StorageInterface {
  _map: Map<string, string>;

  constructor() {
    this._map = new Map();
  }

  get length(): number {
    return this._map.size;
  }

  getItem(key: string): ?string {
    return this._map.get(key);
  }

  setItem(key: string, data: string): void {
    this._map.set(key, data);
  }

  clear(): void {
    this._map.clear();
  }

  removeItem(key: string): void {
    this._map.delete(key);
  }

  key(index: number): ?string {
    return Array.from(this._map.keys())[index];
  }
}
