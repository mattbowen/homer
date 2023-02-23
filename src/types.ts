export interface IRawProperty {
  address: string;
  area?: string;
  bathrooms?: string;
  bedrooms?: string;
  broker_name?: string;
  currency?: string;
  days_on_zillow?: string;
  image?: string;
  input?: string;
  is_zillow_owned?: string;
  land_area?: string;
  latitude?: string;
  listing_type?: string;
  listing_url?: string;
  longitude?: string;
  price?: string;
  property_id: string;
  property_url?: string;
  rank?: string;
  rent_zestimate?: string;
  sold_date?: string;
  zestimate?: string;
  filename: string | undefined;
}

export interface IRawPropertyWithFileInfo extends IRawProperty {
  filename: string;
}

export interface IRawZillowData {
  address: string;
  area?: number;
  bathrooms?: number;
  bedrooms?: number;
  brokerName?: string;
  currency?: string;
  daysOnZillow?: number;
  image?: string;
  input?: string;
  isZillowOwned?: boolean;
  latitude?: number;
  listingType?: string;
  listingUrl?: string;
  longitude?: number;
  price?: number;
  propertyId: string;
  propertyUrl?: string;
  rank?: number;
  rentZestimate?: number;
  zestimate?: number;
  filename: string;
}
