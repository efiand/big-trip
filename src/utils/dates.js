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

  static getFormattedDuration(startDate, finishDate) {
    const startInstance = dayjs(startDate);
    const finishInstance = dayjs(finishDate);
    const minutes = finishInstance.diff(startInstance, `minute`);
    const minuteStr = `${Utils.formatWithLead0(minutes % 60)}M`;

    if (minutes < 60) {
      return minuteStr;
    }

    const hours = finishInstance.diff(startInstance, `hour`);
    const hourStr = `${Utils.formatWithLead0(hours % 24)}H`;
    if (hours < 24) {
      return `${hourStr} ${minuteStr}`;
    }

    const days = finishInstance.diff(startInstance, `day`);
    return `${Utils.formatWithLead0(days)}D ${hourStr} ${minuteStr}`;
  }

  static getFormattedRange(dateA, dateB) {
    const startDate = dayjs(dateA);
    const finishDate = dayjs(dateB);
    const isEqualMonths = startDate.month() === finishDate.month();
    return {
      start: startDate.format(SHORT_HUMAN_FORMAT),
      finish: finishDate.format(isEqualMonths ? `DD` : SHORT_HUMAN_FORMAT)
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

  static humanize(date) {
    return dayjs(date).format(HUMAN_FORMAT);
  }

  static unhumanize(formattedDate) {
    return dayjs(formattedDate, HUMAN_FORMAT).toISOString();
  }
}
