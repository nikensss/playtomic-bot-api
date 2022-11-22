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
  SATURDAY: Friday;
  SUNDAY: Friday;
  THURSDAY: Friday;
  TUESDAY: Friday;
  FRIDAY: Friday;
  MONDAY: Friday;
  WEDNESDAY: Friday;
  HOLIDAYS?: Friday;
}

export interface Friday {
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
  public static readonly RELEVANT_TENANTS = {
    PADEL_CITY: '19dd692d-32d8-4e22-8a25-989a00b2695f',
    ALLROUND_PADEL: 'cc65e668-bba9-42f6-8629-31c607c1b899',
    PLAZA_PADEL: '0bd51db2-7d73-4748-952e-2b628e4e7679',
  } as const;

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

  isRelevant(): boolean {
    const relevant_tenant_ids: string[] = Object.values(Tenant.RELEVANT_TENANTS);
    return relevant_tenant_ids.includes(this.tenantJson.tenant_id);
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

  summary(...times: SlotJson['start_time'][]): string {
    const courts = this.getCourtsAvailableAt(...times);
    const summary = [`${this.getName()}:`, ...courts.map(c => c.toString(1))];

    return summary.length === 1 ? `${this.getName()}: 💩` : summary.join('\n');
  }
}
