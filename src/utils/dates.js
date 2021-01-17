import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {Utils} from '.';

const HUMAN_FORMAT = `DD/MM/YY HH:mm`;
const SHORT_HUMAN_FORMAT = `MMM DD`;
const MINUTE_NAME = `minute`;

dayjs.extend(customParseFormat);

export default class Dates {
  static addMinutes(minutes, instance = dayjs()) {
    return instance.add(minutes, MINUTE_NAME);
  }

  static getDiff(dateA, dateB) {
    return dayjs(dateA).diff(dateB);
  }

  static getFormattedDuration(startDate, endDate) {
    const startInstance = dayjs(startDate);
    const endInstance = dayjs(endDate);
    const minutes = endInstance.diff(startInstance, `minute`);
    const minuteStr = `${Utils.formatWithLead0(minutes % 60)}M`;

    if (minutes < 60) {
      return minuteStr;
    }

    const hours = endInstance.diff(startInstance, `hour`);
    const hourStr = `${Utils.formatWithLead0(hours % 24)}H`;
    if (hours < 24) {
      return `${hourStr} ${minuteStr}`;
    }

    const days = endInstance.diff(startInstance, `day`);
    return `${Utils.formatWithLead0(days)}D ${hourStr} ${minuteStr}`;
  }

  static getFormattedRange(dateA, dateB) {
    const startDate = dayjs(dateA);
    const endDate = dayjs(dateB);
    const isEqualMonths = startDate.month() === endDate.month();
    return {
      start: startDate.format(SHORT_HUMAN_FORMAT),
      end: endDate.format(isEqualMonths ? `DD` : SHORT_HUMAN_FORMAT)
    };
  }

  static getHumanDate(date) {
    return dayjs(date).format(SHORT_HUMAN_FORMAT);
  }

  static getISO(date) {
    return dayjs(date).format();
  }

  static getISODate(date) {
    return dayjs(date).format(`YYYY-MM-DD`);
  }

  static getTime(date) {
    return dayjs(date).format(`HH:mm`);
  }

  static getTimestampDuration(dateA, dateB) {
    return dayjs(dateA).unix() - dayjs(dateB).unix();
  }

  static isEqual(dateA, dateB) {
    return (!dateA && !dateB) || dayjs(dateA).isSame(dateB, `D`);
  }

  static humanize(date) {
    return dayjs(date).format(HUMAN_FORMAT);
  }

  static unhumanize(formattedDate) {
    return dayjs(formattedDate, HUMAN_FORMAT).toISOString();
  }
}
