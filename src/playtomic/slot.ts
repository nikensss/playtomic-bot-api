import clone from 'clone';
import dayjs, { Dayjs } from 'dayjs';
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

  getUtcStartTime(): Dayjs {
    return dayjs.utc(`${this.startDate} ${this.slotJson.start_time}`, 'YYYY-MM-DD HH:mm:ss');
  }

  getStartTime(): SlotJson['start_time'] {
    return this.getUtcStartTime().tz(this.timezone).format('HH:mm:ss');
  }

  isLongEnough(): boolean {
    return this.slotJson.duration >= 90;
  }

  startsAt(...times: SlotJson['start_time'][]): boolean {
    return times.includes(this.getStartTime());
  }

  toJson(tenantId: string, courtId: string): { startTime: string; duration: number; link: string } {
    const dateTime = encodeURIComponent(this.getUtcStartTime().format('YYYY-MM-DDTHH:mm'));
    return {
      startTime: this.getStartTime(),
      duration: this.getDuration(),
      link: `https://playtomic.io/checkout/booking?s=${tenantId}~${courtId}~${dateTime}~${this.getDuration()}`,
    };
  }
}
