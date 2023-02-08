import clone from 'clone';
import dayjs from 'dayjs';
import { Slot, SlotJson } from './slot';

export interface AvailabilityJson {
  resource_id: string;
  start_date: Date;
  slots: SlotJson[];
}

export class Availability {
  private availabilityJson: AvailabilityJson;
  private slots: Slot[];

  constructor(availabilityJson: AvailabilityJson) {
    this.availabilityJson = clone(availabilityJson);
    this.slots = this.availabilityJson.slots.map(slotJson => new Slot(slotJson));
  }

  getId(): AvailabilityJson['resource_id'] {
    return this.availabilityJson.resource_id;
  }

  getStartDate(): AvailabilityJson['start_date'] {
    return this.availabilityJson.start_date;
  }

  getDayName(): string {
    return dayjs(this.getStartDate()).format('dddd').toLowerCase();
  }

  isWeekend(): boolean {
    return ['saturday', 'sunday'].includes(this.getDayName());
  }

  isAvailableAt(...times: SlotJson['start_time'][]): boolean {
    return this.getSlots().some(s => s.startsAt(...times) && s.isLongEnough());
  }

  keepSlotsAt(...times: SlotJson['start_time'][]): this {
    const slots = this.getSlots().filter(s => s.startsAt(...times) && s.isLongEnough());
    return this.setSlots(slots);
  }

  getSlots(): Slot[] {
    return clone(this.slots);
  }

  setSlots(slots: Slot[]): this {
    this.slots = clone(slots);
    return this;
  }

  toJson(): Record<string, unknown> {
    return {
      startDate: this.getStartDate(),
      slots: this.getSlots().map(s => s.toJson()),
    };
  }

  toString(indentationLevel = 0): string {
    const prefix = '\t'.repeat(indentationLevel);
    const slots = this.getSlots().map(s => s.toString(indentationLevel + 1));
    return `${prefix}${this.getStartDate()}:\n${slots.join('\n')}`;
  }
}
