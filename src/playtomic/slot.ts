import clone from 'clone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface SlotJson {
  start_time: string;
  duration: number;
  price: `${number} ${string}`;
}

export class Slot {
  private slotJson: SlotJson;
  private startDate: Date;
  private timezone: string;

  constructor(slotJson: SlotJson, startDate: Date, timezone: string) {
    this.slotJson = clone(slotJson);
    this.startDate = startDate;
    this.timezone = timezone;
  }

  getDuration(): SlotJson['duration'] {
    return this.slotJson.duration;
  }

  getStartTime(): SlotJson['start_time'] {
    const [hours, minutes, seconds] = this.slotJson.start_time.split(':');
    const startDateTimeUtc = dayjs
      .utc(this.startDate, 'YYYY-MM-DD')
      .set('hour', parseInt(hours))
      .set('minute', parseInt(minutes))
      .set('second', parseInt(seconds));

    return startDateTimeUtc.tz(this.timezone).format('HH:mm:ss');
  }

  isLongEnough(): boolean {
    return this.slotJson.duration >= 90;
  }

  startsAt(...times: SlotJson['start_time'][]): boolean {
    return times.includes(this.getStartTime());
  }

  toJson(): Record<string, unknown> {
    return {
      startTime: this.getStartTime(),
      duration: this.getDuration(),
    };
  }

  toString(indentationLevel = 0): string {
    const prefix = '\t'.repeat(indentationLevel);
    return `${prefix}${this.getStartTime()} (${this.getDuration()})`;
  }
}
