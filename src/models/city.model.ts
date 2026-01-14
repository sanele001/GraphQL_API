export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone?: string;
  admin1?: string; // State/Province
  admin2?: string; // County/District
}

export interface CitySuggestionParams {
  query: string;
  limit?: number;
  language?: string;
}

export interface GeocodingResponse {
  results: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id?: number;
    admin2_id?: number;
    timezone: string;
    population?: number;
    country_id: number;
    country: string;
    admin1?: string;
    admin2?: string;
  }>;
  generationtime_ms: number;
}