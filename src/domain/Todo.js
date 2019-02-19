/* @flow */
export type ISO_8601DateString = string;

export type TodoId = number;

export type Todo = {
  +id: TodoId,
  +title: string,
  +complete: boolean,
  +updatedAt: Date,
  +draft: boolean
};

export function createDraftTodo(): Todo {
  return {
    id: -1,
    title: '',
    complete: false,
    updatedAt: new Date(),
    draft: true
  };
}

export type ValidateResult = [boolean, TodoError];

export type TodoError = {
  title: ?string
};

export function clearTodoError(): TodoError {
  return {
    title: null
  };
}

export function clearTodoErrorByFieldName(
  error: TodoError,
  fieldName: string
): TodoError {
  return {
    ...error,
    [fieldName]: null
  };
}

export function validate(todo: Todo): ValidateResult {
  const e = clearTodoError();
  if (todo.title.length === 0) {
    e.title = '未入力です';
  }
  return [Object.entries(e).every(([, m]) => m === null), e];
}

export function filterActiveTodos(todos: Array<Todo>): Array<Todo> {
  return todos.filter(t => !t.complete);
}

export function filterCompletedTodos(todos: Array<Todo>): Array<Todo> {
  return todos.filter(t => t.complete);
}
