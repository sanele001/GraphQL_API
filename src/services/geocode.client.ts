import axios from 'axios';
import { logger } from '../utils/logger';
import { GeocodingResponse } from '../models/city.model';

/**
 * Fetch geocoding results from Open-Meteo for a city name.
 * Example: https://geocoding-api.open-meteo.com/v1/search?name=London&count=1
 */
export async function fetchCityByName(
  name: string,
  count: number = 1,
  language: string = 'en'
): Promise<GeocodingResponse> {
  try {
    const url = 'https://geocoding-api.open-meteo.com/v1/search';
    const response = await axios.get<GeocodingResponse>(url, {
      params: {
        name,
        count,
        language,
        format: 'json',
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    logger.error('fetchCityByName failed', error);
    throw error;
  }
}

export default fetchCityByName;
