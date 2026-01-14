import axios from 'axios';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/errors';
import { WeatherData} from '../models/weather.model'
import { GeocodingResponse } from '../models/city.model';

export class OpenMeteoService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1';
  private readonly geocodingUrl = 'https://geocoding-api.open-meteo.com/v1';

  async searchCities(
    query: string,
    limit: number = 10,
    language: string = 'en'
  ): Promise<GeocodingResponse> {
    try {
      const response = await axios.get<GeocodingResponse>(
        `${this.geocodingUrl}/search`,
        {
          params: {
            name: query,
            count: limit,
            language,
            format: 'json',
          },
          timeout: 5000,
        }
      );

      

      if (!response.data.results) {
        return { results: [], generationtime_ms: 0 };
      }

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch cities:', error);
      throw new ApiError('Failed to fetch city data', 500);
    }
  }

  async getWeatherForecast(
    latitude: number,
    longitude: number,
    forecastDays: number = 1,
    includeHourly: boolean = false
  ): Promise<WeatherData> {
    try {
      const params: any = {
        latitude,
        longitude,
        timezone: 'auto',
        forecast_days: forecastDays,
        current_weather: true,
      };

      if (includeHourly) {
        params.hourly = [
          'temperature_2m',
          'apparent_temperature',
          'weather_code',
          'precipitation',
          'wind_speed_10m',
        ].join(',');
      }

      const response = await axios.get<WeatherData>(
        `${this.baseUrl}/forecast`,
        {
          params,
          timeout: 10000,
        }
      );

      console.log('OpenMeteo response data:', response.data);
     
      return response.data;
    } catch (error: any) {
      const details = error?.response?.data ?? error?.message ?? error;
      logger.error('Failed to fetch weather:', details);
      throw new ApiError('Failed to fetch weather data', 500);
    }
  }
}