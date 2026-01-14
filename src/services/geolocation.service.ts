import { OpenMeteoService } from './openmeteo.service';
import { City } from '../models/city.model';
import { logger } from '../utils/logger';
import { fetchCityByName } from './geocode.client';




export class GeolocationService {
  constructor(private openMeteoService: OpenMeteoService) {}

  async suggestCities(
    query: string,
    limit: number = 10
  ): Promise<City[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const response = await this.openMeteoService.searchCities(query, limit);
    
    return response.results.map((result, index) => ({
      id: this.generateCityId(result),
      name: result.name,
      country: result.country,
      countryCode: result.country_code,
      latitude: result.latitude,
      longitude: result.longitude,
      population: result.population,
      timezone: result.timezone,
      admin1: result.admin1,
      admin2: result.admin2,
    }));
  }

  

  async getCityById(cityId: string): Promise<City | null> {
    try {
      const [name, country] = this.decodeCityId(cityId);
      const response = await fetchCityByName(name, 1);
      
      if (response.results.length === 0) {
        return null;
      }

      const result = response.results[0];
      return {
        id: this.generateCityId(result),
        name: result.name,
        country: result.country,
        countryCode: result.country_code,
        latitude: result.latitude,
        longitude: result.longitude,
        population: result.population,
        timezone: result.timezone,
      };
    } catch (error) {
      logger.error('Failed to get city by ID:', error);
      return null;
    }
  }

  private generateCityId(result: any): string {
    return Buffer.from(
      `${result.name}|${result.country}|${result.latitude}|${result.longitude}`
    ).toString('base64');
  }

  private decodeCityId(cityId: string): [string, string] {
    const decoded = Buffer.from(cityId, 'base64').toString();
    const parts = decoded.split('|');
    return [parts[0], parts[1]];
  }
}