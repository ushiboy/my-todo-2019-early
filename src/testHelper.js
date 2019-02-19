import moment from 'moment';
const assert = require('power-assert');

export function isDate(d) {
  return moment.isDate(d);
}

export function assertEqualDate(s, d) {
  return moment(s).isSame(d);
}

export function assertEqualTodo(s, d) {
  assert(s.id === d.id);
  assert(s.title === d.title);
  assert(s.complete === d.complete);
}
