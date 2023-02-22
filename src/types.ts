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
  broker_name?: string;
  currency?: string;
  days_on_zillow?: number;
  image?: string;
  input?: string;
  is_zillow_owned?: boolean;
  latitude?: number;
  listing_type?: string;
  listing_url?: string;
  longitude?: number;
  price?: number;
  property_id: number;
  property_url?: string;
  rank?: number;
  rent_zestimate?: number;
  zestimate?: number;
  filename: string;
}
