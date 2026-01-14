import { GeolocationService } from '../../services/geolocation.service';
import { OpenMeteoService } from '../../services/openmeteo.service';
import { CacheService } from '../../services/cache.service';


const cacheService = new CacheService();
const openMeteoService = new OpenMeteoService();
const geolocationService = new GeolocationService(openMeteoService);

export const cityResolvers = {
  Query: {
    suggestCities: async (
      _: any,
      { query, limit = 10, language = 'en' }: any
    ) => {
      return await geolocationService.suggestCities(query, limit);
    },

    getCityDetails: async (_: any, { cityId }: any) => {
      const city = await geolocationService.getCityById(cityId);
      if (!city) {
        throw new Error(`City with ID ${cityId} not found`);
      }
      return city;
    },
  },
};