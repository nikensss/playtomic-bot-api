import clone from 'clone';
import { Availability } from './availability';
import { SlotJson } from './slot';
import { SportID } from './tenant';

export interface Resource {
  resource_id: string;
  name: string;
  description: string;
  sport_id: SportID;
  reservation_priority: number;
  is_active: boolean;
  merchant_resource_id: null | string;
  properties: ResourceProperties;
  booking_settings: ResourceBookingSettings | null;
}

export interface ResourceBookingSettings {
  start_time_policy: StartTimePolicy;
  allowed_duration_increments: number[];
  is_bookable_online: boolean;
  allows_onsite_payment: boolean;
  shared_resources: unknown[];
}

export enum StartTimePolicy {
  Any = 'ANY',
}

export interface ResourceProperties {
  resource_type: ResourceType;
  resource_size: ResourceSize;
  resource_feature?: ResourceFeature;
}

export enum ResourceFeature {
  Crystal = 'crystal',
  Panoramic = 'panoramic',
  Quick = 'quick',
  SyntheticGrass = 'synthetic_grass',
  Wall = 'wall',
}

export enum ResourceSize {
  Double = 'double',
  Single = 'single',
}

export enum ResourceType {
  Indoor = 'indoor',
  Outdoor = 'outdoor',
}

export class Court {
  private resource: Resource;

  private availability: Availability[] = [];

  constructor(resource: Resource) {
    this.resource = clone(resource);
  }

  getId(): Resource['resource_id'] {
    return this.resource.resource_id;
  }

  getName(): Resource['name'] {
    return this.resource.name.trim();
  }

  getType(): Resource['properties']['resource_type'] {
    return this.resource.properties.resource_type;
  }

  isIndoor(): boolean {
    return this.getType() === 'indoor';
  }

  setAvailability(availability: Availability[]): this {
    this.availability = clone(availability)
      .filter(a => a.getId() === this.getId())
      .filter(a => !a.isWeekend());

    return this;
  }

  getAvailability(): Availability[] {
    return clone(this.availability);
  }

  isAvailableAt(...times: SlotJson['start_time'][]): boolean {
    return this.availability.some(a => a.isAvailableAt(...times));
  }

  keepAvailabilitiesWithSlotsAt(...times: SlotJson['start_time'][]): this {
    const availabilities = this.getAvailability().map(a => a.keepSlotsAt(...times));
    return this.setAvailability(availabilities.filter(a => a.isAvailableAt(...times)));
  }

  toJson(tenantId: string): { name: string; type: string; availability: ReturnType<Availability['toJson']>[] } {
    return {
      name: this.getName(),
      type: this.getType(),
      availability: this.getAvailability().map(a => a.toJson(tenantId, this.getId())),
    };
  }
}
