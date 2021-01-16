import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const HUMAN_FORMAT = `DD/MM/YY HH:mm`;

dayjs.extend(customParseFormat);

export default class Dates {
  static getNowISO() {
    return dayjs().toISOString();
  }

  static humanize(date) {
    return dayjs(date).format(HUMAN_FORMAT);
  }

  static unhumanize(formattedDate) {
    return dayjs(formattedDate, HUMAN_FORMAT).toISOString();
  }
}
