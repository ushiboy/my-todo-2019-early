/* @flow */
import moment from 'moment';

export function decodeISO8601ToDate(s: string): Date {
  return moment(s, moment.ISO_8601).toDate();
}

export function encodeDateToISO8601(d: Date): string {
  return moment(d).format();
}
