import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { TIME_ZONE } from './constants';

export function ClearNilProperties<T extends Object>(
  object: T | Partial<T>,
): Partial<T> {
  return _.pickBy(object, (prop) => !_.isNil(prop));
}

export const FormatDate = (date: string, dateFormat = 'YYYY-MM-DD'): string => {
  return moment(date).tz(TIME_ZONE.VIETNAM).format(dateFormat);
};
