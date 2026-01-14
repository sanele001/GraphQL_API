import { OpenMeteoService } from './openmeteo.service';
import { CacheService } from './cache.service';
import { WEATHER_CODES } from '../models/weather.model';
import { WeatherData } from '../models/weather.model';
import { logger } from '../utils/logger';

export class WeatherService {
  private readonly cacheKeyPrefix = 'weather:';

  constructor(
    private openMeteoService: OpenMeteoService,
    private cacheService: CacheService
  ) {}

  async getWeatherForecast(
    latitude: number,
    longitude: number,
    forecastDays: number = 1,
    includeHourly: boolean = false,
    forceRefresh: boolean = false
  ): Promise<WeatherData> {
    const cacheKey = `${this.cacheKeyPrefix}${latitude},${longitude}:${forecastDays}`;

    if (!forceRefresh) {
      const cached = await this.cacheService.get<WeatherData>(cacheKey);
      if (cached) {
        logger.debug('Cache hit for weather data');
        return cached;
      }
    }

    logger.debug('Cache miss, fetching fresh weather data');
    const weatherData = await this.openMeteoService.getWeatherForecast(
      latitude,
      longitude,
      forecastDays,
      includeHourly
    );

    await this.cacheService.set(cacheKey, weatherData, 1800);

    return weatherData;
  }

  getWeatherDescription(weatherCode: number): string {
    const condition = WEATHER_CODES[weatherCode];
    return condition ? condition.description : 'Unknown';
  }

  isGoodWeatherForOutdoor(weatherCode: number): boolean {
 
    return weatherCode <= 3;
  }

  isRainy(weatherCode: number): boolean {

    return weatherCode >= 51 && weatherCode <= 99;
  }

  isSnowy(weatherCode: number): boolean {
  
    return weatherCode >= 71 && weatherCode <= 77;
  }
}