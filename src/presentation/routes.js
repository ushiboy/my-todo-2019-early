/* @flow */
import { route } from 'tridoron';
import { ConnectedTodoList } from './page/TodoList/TodoList.js';
import { ConnectedTodoForm } from './page/TodoForm/TodoForm.js';

export const routes = [
  route('/', ConnectedTodoList),
  route('/todos/new', ConnectedTodoForm),
  route('/todos/:id', ConnectedTodoForm)
];
