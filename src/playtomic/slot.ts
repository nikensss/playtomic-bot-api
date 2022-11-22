import clone from 'clone';

export interface SlotJson {
  start_time: string;
  duration: number;
  price: `${number} ${string}`;
}

export class Slot {
  private slotJson: SlotJson;

  constructor(slotJson: SlotJson) {
    this.slotJson = clone(slotJson);
  }

  getDuration(): SlotJson['duration'] {
    return this.slotJson.duration;
  }

  /**
   * Offset the hour by 1 because it seems for my current timezone, that's
   * what I need.
   */
  getStartTime(): SlotJson['start_time'] {
    const [hours, minutes, seconds] = this.slotJson.start_time.split(':');
    return `${(parseInt(hours) + 1).toString().padStart(2, '0')}:${minutes}:${seconds}`;
  }

  isLongEnough(): boolean {
    return this.slotJson.duration >= 90;
  }

  startsAt(...times: SlotJson['start_time'][]): boolean {
    return times.includes(this.getStartTime());
  }

  toString(indentationLevel = 0): string {
    const prefix = '\t'.repeat(indentationLevel);
    return `${prefix}${this.getStartTime()} (${this.getDuration()})`;
  }
}
