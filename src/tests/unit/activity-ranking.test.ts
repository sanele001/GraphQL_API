
import { ActivityRankingService } from '../../services/activity-ranking.service';
import { ActivityType } from '../../models/activity.model';

// Mock WeatherService
const mockWeatherService = {
  isSnowy: jest.fn(),
  isRainy: jest.fn(),
  isGoodWeatherForOutdoor: jest.fn(),
  getWeatherDescription: jest.fn(),
};

describe('ActivityRankingService', () => {
  let service: ActivityRankingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ActivityRankingService(mockWeatherService as any);
  });

  describe('rankActivities', () => {
    it('should return 4 activity scores', () => {
      mockWeatherService.isSnowy.mockReturnValue(false);
      mockWeatherService.isRainy.mockReturnValue(false);
      mockWeatherService.isGoodWeatherForOutdoor.mockReturnValue(true);

      const weatherData = {
        current_weather: {
          temperature: 20,
          weathercode: 1,
          precipitation: 0,
          wind_speed_10m: 10,
          wind_direction_10m: 180,
          humidity_2m: 50,
          is_day: 1,
        },
      };

      const result = service.rankActivities(weatherData as any);

      expect(result).toHaveLength(4);
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('score');
      expect(result[0]).toHaveProperty('explanation');
      expect(result[0]).toHaveProperty('confidence');
    });

    it('should sort activities by score descending', () => {
      mockWeatherService.isSnowy.mockReturnValue(false);
      mockWeatherService.isRainy.mockReturnValue(false);
      mockWeatherService.isGoodWeatherForOutdoor.mockReturnValue(true);

      const weatherData = {
        current_weather: {
          temperature: 20,
          weathercode: 1,
          precipitation: 0,
          wind_speed_10m: 10,
          wind_direction_10m: 180,
          humidity_2m: 50,
          is_day: 1,
        },
      };

      const result = service.rankActivities(weatherData as any);

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
      }
    });
  });

  describe('Skiing score calculation', () => {
    it('should give high score for cold temperature and snow', () => {
      mockWeatherService.isSnowy.mockReturnValue(true);

      const weatherData = {
        current_weather: {
          temperature: -5,
          weathercode: 73,
          precipitation: 5,
          wind_speed_10m: 5,
          wind_direction_10m: 180,
          humidity_2m: 80,
          is_day: 1,
        },
      };

      const result = service.rankActivities(weatherData as any);
      const skiing = result.find(a => a.type === ActivityType.SKIING);

      expect(skiing?.score).toBeGreaterThan(50);
      expect(skiing?.explanation).toContain('skiing');
    });

    it('should give low score for warm weather', () => {
      mockWeatherService.isSnowy.mockReturnValue(false);

      const weatherData = {
        current_weather: {
          temperature: 25,
          weathercode: 1,
          precipitation: 0,
          wind_speed_10m: 5,
          wind_direction_10m: 180,
          humidity_2m: 50,
          is_day: 1,
        },
      };

      const result = service.rankActivities(weatherData as any);
      const skiing = result.find(a => a.type === ActivityType.SKIING);

      expect(skiing?.score).toBeLessThan(50);
    });
  });

  describe('Surfing score calculation', () => {
    it('should give high score for warm temperature and moderate wind', () => {
      const weatherData = {
        current_weather: {
          temperature: 22,
          weathercode: 1,
          precipitation: 0,
          wind_speed_10m: 15,
          wind_direction_10m: 180,
          humidity_2m: 60,
          is_day: 1,
        },
      };

      const result = service.rankActivities(weatherData as any);
      const surfing = result.find(a => a.type === ActivityType.SURFING);

      expect(surfing?.score).toBeGreaterThan(50);
      expect(surfing?.explanation).toContain('surfing');
    });
  });

  describe('Indoor sightseeing score calculation', () => {
    it('should give high score when it is raining', () => {
      mockWeatherService.isRainy.mockReturnValue(true);

      const weatherData = {
        current_weather: {
          temperature: 15,
          weathercode: 61,
          precipitation: 10,
          wind_speed_10m: 10,
          wind_direction_10m: 180,
          humidity_2m: 90,
          is_day: 1,
        },
      };

      const result = service.rankActivities(weatherData as any);
      const indoor = result.find(a => a.type === ActivityType.INDOOR_SIGHTSEEING);

      expect(indoor?.score).toBeGreaterThan(50);
    });
  });

  describe('Outdoor sightseeing score calculation', () => {
    it('should give high score for good weather', () => {
      mockWeatherService.isGoodWeatherForOutdoor.mockReturnValue(true);
      mockWeatherService.isRainy.mockReturnValue(false);

      const weatherData = {
        current_weather: {
          temperature: 20,
          weathercode: 1,
          precipitation: 0,
          wind_speed_10m: 5,
          wind_direction_10m: 180,
          humidity_2m: 50,
          is_day: 1,
        },
      };

      const result = service.rankActivities(weatherData as any);
      const outdoor = result.find(a => a.type === ActivityType.OUTDOOR_SIGHTSEEING);

      expect(outdoor?.score).toBeGreaterThan(50);
    });

    it('should give low score at night', () => {
      mockWeatherService.isGoodWeatherForOutdoor.mockReturnValue(true);

      const weatherData = {
        current_weather: {
          temperature: 20,
          weathercode: 1,
          precipitation: 0,
          wind_speed_10m: 5,
          wind_direction_10m: 180,
          humidity_2m: 50,
          is_day: 0,
        },
      };

      const result = service.rankActivities(weatherData as any);
      const outdoor = result.find(a => a.type === ActivityType.OUTDOOR_SIGHTSEEING);

      expect(outdoor?.score).toBeLessThan(100);
    });
  });
});