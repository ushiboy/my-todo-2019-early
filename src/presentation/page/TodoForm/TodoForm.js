/* @flow */
import type { AppState, RouteState } from '../../../ducks/types.js';
import type { EditTodoState } from '../../../ducks/editTodo/types.js';
import type { ConnectedProps } from '../../../ducks/types.js';
import React from 'react';
import { connect } from 'react-redux';
import { LoadingMask } from '../../components/LoadingMask/LoadingMask.js';
import { Toast } from '../../components/Toast/Toast.js';
import { Link } from 'tridoron';
import {
  createDraft,
  fetchById,
  changeTitle,
  changeComplete,
  clearFieldError,
  save,
  remove,
  clear
} from '../../../ducks/editTodo/actions.js';
import styles from './TodoForm.scss';

type Props = {
  editTodo: EditTodoState,
  route: RouteState
} & ConnectedProps;

export class TodoForm extends React.Component<Props> {
  componentDidMount() {
    const { dispatch, route } = this.props;
    const { args } = route;
    if (args.length === 0) {
      dispatch(createDraft());
    } else if (args.length === 1) {
      const [id] = args;
      dispatch(fetchById(Number(id)));
    }
  }
  componentDidUpdate() {
    const { editTodo, router } = this.props;
    if (editTodo.syncCompleted) {
      router.navigateTo('/');
    }
  }
  componentWillUnmount() {
    this.props.dispatch(clear());
  }
  render() {
    const { dispatch, editTodo } = this.props;
    const { loading, fields, fieldErrors, message, messageType } = editTodo;
    const { title, draft, complete } = fields;

    let removeButton = null;
    if (!draft) {
      removeButton = <RemoveButton dispatch={dispatch} />;
    }
    return (
      <div className={`card ${styles.todoForm}`} data-test="todo-form">
        <div className="card-body">
          <LoadingMask show={loading}>
            <Toast message={message} messageType={messageType} />
            <form onSubmit={this.onFormSubmit.bind(this)}>
              <TitleText
                title={title}
                dispatch={dispatch}
                error={fieldErrors.title}
              />
              <div
                className="form-group form-check"
                style={{ display: draft ? 'none' : '' }}
              >
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    data-test="complete-field"
                    className="form-check-input"
                    checked={complete}
                    onChange={() => {
                      dispatch(changeComplete(!complete));
                    }}
                  />{' '}
                  完了
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                data-test="save-button"
              >
                <i className="fas fa-save" /> 保存
              </button>
              {removeButton}
              <Link className="btn btn-link" href="/">
                キャンセル
              </Link>
            </form>
          </LoadingMask>
        </div>
      </div>
    );
  }
  onFormSubmit(e: Event) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(save());
  }
}

function TitleText(props) {
  const { title, dispatch, error } = props;
  const cls = error !== null ? 'is-invalid' : '';
  return (
    <div className="form-group">
      <label>タイトル</label>
      <input
        type="text"
        className={`form-control ${cls}`}
        value={title}
        data-test="title-field"
        onChange={e => {
          const title = e.currentTarget.value;
          dispatch(changeTitle(title));
        }}
        onFocus={() => {
          dispatch(clearFieldError('title'));
        }}
      />
      <div className="invalid-feedback">{error}</div>
    </div>
  );
}

function RemoveButton(props) {
  const { dispatch } = props;
  return (
    <button
      type="button"
      data-test="remove-button"
      className={`btn btn-danger ${styles.removeButton}`}
      onClick={() => {
        if (confirm('削除します')) {
          dispatch(remove());
        }
      }}
    >
      <i className="fas fa-trash-alt" /> 削除
    </button>
  );
}

export const ConnectedTodoForm = connect((state: AppState) => {
  const { editTodo, route } = state;
  return {
    editTodo,
    route
  };
})(TodoForm);
