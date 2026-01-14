import { GeolocationService } from '../../services/geolocation.service';
import { WeatherService } from '../../services/weather.service';
import { ActivityRankingService } from '../../services/activity-ranking.service';
import { CacheService } from '../../services/cache.service';
import { OpenMeteoService } from '../../services/openmeteo.service';


const cacheService = new CacheService();
const openMeteoService = new OpenMeteoService();
const geolocationService = new GeolocationService(openMeteoService);
const weatherService = new WeatherService(openMeteoService, cacheService);
const activityRankingService = new ActivityRankingService(weatherService);

export const weatherResolvers = {
  Query: {
    getWeatherForecast: async (
      _: any,
      { cityId, forecastDays = 1, includeHourly = false }: any
    ) => {
      const city = await geolocationService.getCityById(cityId);
      if (!city) {
        throw new Error(`City with ID ${cityId} not found`);
      }

      const weatherData = await weatherService.getWeatherForecast(
        city.latitude,
        city.longitude,
        forecastDays,
        includeHourly
      );

      console.log('Weather data fetched in resolver:', weatherData);

      const recommendedActivities = activityRankingService.rankActivities(weatherData);

      return {
        city,
        current: {
          temperature: weatherData.current_weather.temperature,
          apparentTemperature: weatherData.current_weather.temperature,
          weatherCode: weatherData.current_weather.weathercode,
          weatherDescription: weatherService.getWeatherDescription(
            weatherData.current_weather.weathercode
          ),
          precipitation: weatherData.current_weather.precipitation,
          windSpeed: weatherData.current_weather.wind_speed_10m,
          windDirection: weatherData.current_weather.wind_direction_10m,
          humidity: weatherData.current_weather.humidity_2m,
          isDay: weatherData.current_weather.is_day === 1,
          timestamp: weatherData.current_weather.time,
        },
        hourly: weatherData.hourly
          ? weatherData.hourly.time.map((time: string, index: number) => ({
              temperature: weatherData.hourly!.temperature_2m[index],
              apparentTemperature: weatherData.hourly!.apparent_temperature[index],
              weatherCode: weatherData.hourly!.weather_code[index],
              weatherDescription: weatherService.getWeatherDescription(
                weatherData.hourly!.weather_code[index]
              ),
              precipitation: weatherData.hourly!.precipitation[index],
              windSpeed: weatherData.hourly!.wind_speed_10m[index],
              timestamp: time,
            }))
          : [],
        recommendedActivities,
        bestActivity: recommendedActivities[0],
      };
    },

    getActivityRecommendations: async (_: any, { cityId, date }: any) => {
      const city = await geolocationService.getCityById(cityId);
      if (!city) {
        throw new Error(`City with ID ${cityId} not found`);
      }

      const weatherData = await weatherService.getWeatherForecast(
        city.latitude,
        city.longitude,
        1
      );

      return activityRankingService.rankActivities(weatherData);
    },
  },

  Mutation: {
    refreshWeatherData: async (_: any, { cityId }: any) => {
      const city = await geolocationService.getCityById(cityId);
      if (!city) {
        throw new Error(`City with ID ${cityId} not found`);
      }

      const weatherData = await weatherService.getWeatherForecast(
        city.latitude,
        city.longitude,
        1,
        false,
        true 
      );

      const recommendedActivities = activityRankingService.rankActivities(weatherData);

      return {
        city,
        current: {
          temperature: weatherData.current_weather.temperature,
          apparentTemperature: weatherData.current_weather.apparent_temperature,
          weatherCode: weatherData.current_weather.weathercode,
          weatherDescription: weatherService.getWeatherDescription(
            weatherData.current_weather.weathercode
          ),
          precipitation: weatherData.current_weather.precipitation,
          windSpeed: weatherData.current_weather.wind_speed_10m,
          windDirection: weatherData.current_weather.wind_direction_10m,
          humidity: weatherData.current_weather.humidity_2m,
          isDay: weatherData.current_weather.is_day === 1,
          timestamp: weatherData.current_weather.time,
        },
        hourly: [],
        recommendedActivities,
        bestActivity: recommendedActivities[0],
      };
    },
  },

  WeatherForecast: {
    city: (parent: any) => parent.city,
    current: (parent: any) => parent.current,
    hourly: (parent: any) => parent.hourly || [],
    recommendedActivities: (parent: any) => parent.recommendedActivities,
    bestActivity: (parent: any) => parent.bestActivity,
  },
};