import clone from 'clone';
import { Availability } from './availability';
import { Court, Resource } from './court';
import { SlotJson } from './slot';

export interface TenantJson {
  default_currency: DefaultCurrency;
  tenant_id: string;
  tenant_uid: string;
  tenant_type: TenantType;
  tenant_status: Status;
  tenant_name: string;
  address: Address;
  images: string[];
  image_data?: ImageDatum[];
  properties: TentantsResponseProperties;
  resources: Resource[];
  booking_type: BookingType;
  playtomic_status: Status;
  is_playtomic_partner: boolean;
  default_cancelation_policy?: DefaultCancelationPolicy;
  opening_hours: OpeningHours;
  vat_rate: number;
  communications_language: CommunicationsLanguage;
  onboarding_status: OnboardingStatus;
  booking_settings?: TentantsResponseBookingSettings;
  sport_ids: SportID[];
  tenant_hostname: TenantName;
  cancelation_policies: CancelationPolicy[];
  url: string;
  google_place_id?: string;
  shared_secret?: string;
  tenant_short_name?: TenantName;
}

export interface Address {
  street: string;
  postal_code: string;
  city: string;
  sub_administrative_area: string;
  administrative_area: string;
  country: Country;
  country_code: CountryCode;
  coordinate: Coordinate;
  timezone: Timezone;
}

export interface Coordinate {
  lat: number;
  lon: number;
}

export enum Country {
  Netherlands = 'Netherlands',
}

export enum CountryCode {
  Nl = 'NL',
}

export enum Timezone {
  EuropeAmsterdam = 'Europe/Amsterdam',
}

export interface TentantsResponseBookingSettings {
  booking_ahead_limit: number;
  max_consecutive_bookable_time: number;
  max_bookable_time_per_day: number;
  max_number_of_active_bookings: number | null;
  max_number_of_bookings_per_day: number | null;
}

export enum BookingType {
  Public = 'PUBLIC',
}

export interface CancelationPolicy {
  sport_id: SportID;
  duration: DefaultCancelationPolicy;
  sport_ids: SportID[];
}

export interface DefaultCancelationPolicy {
  amount: number;
  unit: Unit;
}

export enum Unit {
  Hours = 'HOURS',
}

export enum SportID {
  Padel = 'PADEL',
  Squash = 'SQUASH',
  Tennis = 'TENNIS',
}

export enum CommunicationsLanguage {
  En = 'en',
  EnUS = 'en_US',
}

export enum DefaultCurrency {
  Eur = 'EUR',
}

export interface ImageDatum {
  image_id: string;
  url: string;
  client_type: ClientType;
}

export enum ClientType {
  Mobile = 'MOBILE',
  Web = 'WEB',
}

export enum OnboardingStatus {
  Finished = 'FINISHED',
}

export interface OpeningHours {
  SATURDAY: OpeningAndClosingTime;
  SUNDAY: OpeningAndClosingTime;
  THURSDAY: OpeningAndClosingTime;
  TUESDAY: OpeningAndClosingTime;
  FRIDAY: OpeningAndClosingTime;
  MONDAY: OpeningAndClosingTime;
  WEDNESDAY: OpeningAndClosingTime;
  HOLIDAYS?: OpeningAndClosingTime;
}

export interface OpeningAndClosingTime {
  opening_time: string;
  closing_time: string;
}

export enum Status {
  Active = 'ACTIVE',
}

export interface TentantsResponseProperties {
  [key: string]: unknown;
}

export enum TenantName {
  Anemone = 'anemone',
  Clubpadelrive = 'clubpadelrive',
  Nieuwesloot = 'nieuwesloot',
}

export enum TenantType {
  Anemone = 'ANEMONE',
  Syltekcrm = 'SYLTEKCRM',
}

export class Tenant {
  private tenantJson: TenantJson;
  private courts: Court[] = [];

  constructor(tenantJson: TenantJson) {
    this.tenantJson = clone(tenantJson);
    this.courts = this.tenantJson.resources.map(r => new Court(r));
  }

  getId(): TenantJson['tenant_id'] {
    return this.tenantJson.tenant_id;
  }

  getName(): TenantJson['tenant_name'] {
    return this.tenantJson.tenant_name.trim();
  }

  getTimezone(): string {
    return this.tenantJson.address.timezone;
  }

  getCourts(): Court[] {
    return clone(this.courts);
  }

  setCourts(courts: Court[]): this {
    this.courts = clone(courts);
    return this;
  }

  setAvailability(availability: Availability[]): this {
    const courts = this.getCourts();
    return this.setCourts(courts.map(c => c.setAvailability(availability)));
  }

  getCourtsAvailableAt(...times: SlotJson['start_time'][]): Court[] {
    return this.getCourts()
      .filter(c => c.isIndoor() && c.isAvailableAt(...times))
      .map(c => c.keepAvailabilitiesWithSlotsAt(...times));
  }

  toJson(...times: SlotJson['start_time'][]): { name: string; courts: ReturnType<Court['toJson']>[] } {
    return {
      name: this.getName(),
      courts: this.getCourtsAvailableAt(...times).map(c => c.toJson(this.getId())),
    };
  }
}
