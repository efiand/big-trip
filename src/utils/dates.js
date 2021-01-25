import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {Utils} from '.';

const HUMAN_FORMAT = `DD/MM/YY HH:mm`;
const SHORT_HUMAN_FORMAT = `MMM DD`;
const MS_IN_DAY = 86400000;
const Name = {
  MINUTE: `minute`,
  DAY: `day`,
  HOUR: `hour`
};

dayjs.extend(customParseFormat);

export default class Dates {
  static addMinutes(minutes, dateInst = dayjs()) {
    return dateInst.add(minutes, Name.MINUTE);
  }

  static getDaysFromMs(ms) {
    return Math.ceil(ms / MS_IN_DAY);
  }

  static getDiff(dateInstA, dateInstB = dayjs()) {
    return dateInstA.diff(dateInstB);
  }

  static getFormattedDuration(dateInstA, dateInstB) {
    const minutes = dateInstB.diff(dateInstA, Name.MINUTE);
    const minuteStr = `${Utils.formatWithLead0(minutes % 60)}M`;

    if (minutes < 60) {
      return minuteStr;
    }

    const hours = dateInstB.diff(dateInstA, Name.HOUR);
    const hourStr = `${Utils.formatWithLead0(hours % 24)}H`;
    if (hours < 24) {
      return `${hourStr} ${minuteStr}`;
    }

    const days = dateInstB.diff(dateInstA, Name.DAY);
    return `${Utils.formatWithLead0(days)}D ${hourStr} ${minuteStr}`;
  }

  static getFormattedRange(dateInstA, dateInstB) {
    const isEqualMonths = dateInstA.month() === dateInstB.month();
    return {
      start: dateInstA.format(SHORT_HUMAN_FORMAT),
      end: dateInstB.format(isEqualMonths ? `DD` : SHORT_HUMAN_FORMAT)
    };
  }

  static getHumanDate(dateInst) {
    return dateInst.format(SHORT_HUMAN_FORMAT);
  }

  static getInst(dateStr, isHuman = false) {
    if (isHuman) {
      return dayjs(dateStr, HUMAN_FORMAT);
    }
    return dayjs(dateStr);
  }

  static getISO(dateInst) {
    return dateInst.format();
  }

  static getISODate(dateInst) {
    return dateInst.format(`YYYY-MM-DD`);
  }

  static getTime(dateInst) {
    return dateInst.format(`HH:mm`);
  }

  static getTimestampDuration(dateInstA, dateInstB) {
    return dateInstA.unix() - dateInstB.unix();
  }

  static humanize(dateInst) {
    return dateInst.format(HUMAN_FORMAT);
  }

  static isEqual(dateInstA, dateInstB) {
    return (!dateInstA && !dateInstB) || dayjs(dateInstA).isSame(dayjs(dateInstB));
  }
}
