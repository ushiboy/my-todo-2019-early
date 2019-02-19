/* @flow */
import type { Todo, TodoId, ISO_8601DateString } from '../domain/Todo.js';
import { decodeISO8601ToDate } from '../utils/DateUtils.js';

export interface TodoRepository {
  fetchAll(): Promise<Array<Todo>>;
  add(draft: Todo): Promise<void>;
  fetchById(id: TodoId): Promise<Todo>;
  update(todo: Todo): Promise<void>;
  remove(todo: Todo): Promise<void>;
}

export type TodoRaw = {
  id: TodoId,
  title: string,
  complete: boolean,
  updatedAt: ISO_8601DateString
};

export function decodeRawToTodo(raw: TodoRaw): Todo {
  const { id, title, complete, updatedAt } = raw;
  return {
    id,
    title,
    complete,
    updatedAt: decodeISO8601ToDate(updatedAt),
    draft: false
  };
}

export function encodeTodo(todo: Todo): string {
  const { id, title, complete, updatedAt } = todo;
  return JSON.stringify({
    id,
    title,
    complete,
    updatedAt
  });
}
