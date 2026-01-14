import { OpenMeteoService } from '../../services/openmeteo.service';
import { GeolocationService } from '../../services/geolocation.service';
import { WeatherService } from '../../services/weather.service';
import { ActivityRankingService } from '../../services/activity-ranking.service';
import { CacheService } from '../../services/cache.service';
import { cityResolvers } from './city.resolver';
import { weatherResolvers } from './weather.resolver';


const cacheService = new CacheService();
const openMeteoService = new OpenMeteoService();
const geolocationService = new GeolocationService(openMeteoService);
const weatherService = new WeatherService(openMeteoService, cacheService);
const activityRankingService = new ActivityRankingService(weatherService);

export const resolvers = {
  Query: {
    ...cityResolvers.Query,
    ...weatherResolvers.Query,
  },
  Mutation: {
    ...weatherResolvers.Mutation,
  },
  WeatherForecast: {
    ...weatherResolvers.WeatherForecast,
  },
};