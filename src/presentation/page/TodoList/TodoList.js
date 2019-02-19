/* @flow */
import type { AppState, RouteState } from '../../../ducks/types.js';
import type { TodosState } from '../../../ducks/todos/types.js';
import type { ConnectedProps } from '../../../ducks/types.js';
import styles from './TodoList.scss';
import React from 'react';
import { Link } from 'tridoron';
import { connect } from 'react-redux';
import {
  fetchTodos,
  changeVisibleFilter
} from '../../../ducks/todos/actions.js';
import { LoadingMask } from '../../components/LoadingMask/LoadingMask.js';

type Props = {
  todos: TodosState,
  route: RouteState
} & ConnectedProps;

export class TodoList extends React.Component<Props> {
  componentDidMount() {
    const { dispatch, route } = this.props;
    dispatch(changeVisibleFilter(route.query.filter || ''));
    dispatch(fetchTodos());
  }
  componentDidUpdate(prevProps: Props) {
    const { dispatch, route } = this.props;
    if (prevProps.route.query.filter !== route.query.filter) {
      dispatch(changeVisibleFilter(route.query.filter || ''));
    }
  }
  render() {
    const { visibleRecords, loading, filter } = this.props.todos;
    const rows = visibleRecords.map((t, i) => {
      return <TodoRow key={i} todo={t} />;
    });
    return (
      <div className={styles.todoList} data-test="todo-list">
        <div className="card">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <Link
                  data-test="all-tab"
                  className={`nav-link ${activateTab(filter === 'all')}`}
                  href="/"
                >
                  すべて
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  data-test="active-tab"
                  className={`nav-link ${activateTab(filter === 'active')}`}
                  href="/?filter=active"
                >
                  未完了
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  data-test="completed-tab"
                  className={`nav-link ${activateTab(filter === 'completed')}`}
                  href="/?filter=completed"
                >
                  完了
                </Link>
              </li>
            </ul>
          </div>
          <div className="card-body">
            <LoadingMask show={loading}>
              <table className="table">
                <thead>
                  <tr>
                    <th className={styles.editColumn} />
                    <th>タイトル</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </LoadingMask>
            <nav className="navbar navbar-light">
              <Link
                className="btn btn-primary"
                href="/todos/new"
                data-test="create-todo-button"
              >
                <i className="fas fa-plus-circle" /> 新規追加
              </Link>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

function TodoRow(props) {
  const { todo } = props;
  return (
    <tr data-test="todo-list-row">
      <td className={styles.editColumn}>
        <Link
          href={`/todos/${todo.id}`}
          className="btn btn-info"
          data-test="edit-todo-button"
        >
          <i className="fas fa-edit" />{' '}
          <span className={styles.buttonLabel}>編集</span>
        </Link>
      </td>
      <td className={styles.titleColumn} data-test="title-column">
        {todo.title}
      </td>
    </tr>
  );
}

function activateTab(condition) {
  return condition ? 'active' : '';
}

export const ConnectedTodoList = connect((state: AppState) => {
  const { todos, route } = state;
  return {
    todos,
    route
  };
})(TodoList);
