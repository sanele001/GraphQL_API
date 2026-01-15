import {  ActivityType} from '../models/activity.model';
import { WeatherData } from '../models/weather.model';
import { ActivityScore } from '../models/activity.model';
import { WeatherService } from './weather.service';

export class ActivityRankingService {
  constructor(private weatherService: WeatherService) {}

  rankActivities(weatherData: WeatherData): ActivityScore[] {
    const current = weatherData.current_weather;
    const scores: ActivityScore[] = [];

    scores.push(this.calculateSkiingScore(current));
    scores.push(this.calculateSurfingScore(current));
    scores.push(this.calculateIndoorSightseeingScore(current));
    scores.push(this.calculateOutdoorSightseeingScore(current));


    return scores.sort((a, b) => b.score - a.score);
  }

  private calculateSkiingScore(current: any): ActivityScore {
    const temperature = current.temperature;
    const isSnowy = this.weatherService.isSnowy(current.weathercode);
    const precipitation = current.precipitation;

    let score = 0;
    let explanation = '';
    let confidence = 0;


    if (temperature < 0) {
      score += 40;
      explanation += 'Perfect temperature for skiing. ';
      confidence += 0.4;
    } else if (temperature < 5) {
      score += 20;
      explanation += 'Cool but acceptable for skiing. ';
      confidence += 0.2;
    }

    if (isSnowy) {
      score += 50;
      explanation += 'Snow is falling. ';
      confidence += 0.5;
    } else if (precipitation > 0) {
      score += 10;
      explanation += 'Some precipitation. ';
      confidence += 0.1;
    }


    if (temperature < -5) {
      score += 10;
      explanation += 'Very cold, great for snow conditions. ';
      confidence += 0.1;
    }

    return {
      type: ActivityType.SKIING,
      score: Math.min(score, 100),
      explanation: explanation || 'Not ideal for skiing.',
      confidence: Math.min(confidence, 1),
    };
  }

  private calculateSurfingScore(current: any): ActivityScore {
    const temperature = current.temperature;
    const windSpeed = current.wind_speed_10m;
    const precipitation = current.precipitation;

    let score = 0;
    let explanation = '';
    let confidence = 0;


    if (temperature > 15 && temperature < 30) {
      score += 30;
      explanation += 'Comfortable water temperature. ';
      confidence += 0.3;
    }

    if (windSpeed > 5 && windSpeed < 20) {
      score += 40;
      explanation += 'Good wind for surfing. ';
      confidence += 0.4;
    } else if (windSpeed >= 20) {
      score += 10;
      explanation += 'Wind might be too strong. ';
      confidence += 0.1;
    }

    if (precipitation === 0) {
      score += 20;
      explanation += 'No rain, great visibility. ';
      confidence += 0.2;
    }

    // Penalty for cold water
    if (temperature < 10) {
      score -= 30;
      explanation += 'Water is very cold. ';
      confidence += 0.3;
    }

    return {
      type: ActivityType.SURFING,
      score: Math.max(0, Math.min(score, 100)),
      explanation: explanation || 'Not ideal for surfing.',
      confidence: Math.min(confidence, 1),
    };
  }

  private calculateIndoorSightseeingScore(current: any): ActivityScore {
    const isRainy = this.weatherService.isRainy(current.weathercode);
    const temperature = current.temperature;
    const precipitation = current.precipitation;

    let score = 0;
    let explanation = '';
    let confidence = 0;

    // Indoor activities are good when weather is bad
    if (isRainy) {
      score += 60;
      explanation += 'Rainy weather, perfect for indoor activities. ';
      confidence += 0.6;
    }

    if (precipitation > 5) {
      score += 20;
      explanation += 'Heavy precipitation. ';
      confidence += 0.2;
    }

    if (temperature < 0 || temperature > 35) {
      score += 20;
      explanation += 'Extreme temperatures. ';
      confidence += 0.2;
    }

    // Always some baseline score for indoor
    score += 10;
    explanation += 'Always a good backup option. ';
    confidence += 0.1;

    return {
      type: ActivityType.INDOOR_SIGHTSEEING,
      score: Math.min(score, 100),
      explanation,
      confidence: Math.min(confidence, 1),
    };
  }

  private calculateOutdoorSightseeingScore(current: any): ActivityScore {
    const isGoodWeather = this.weatherService.isGoodWeatherForOutdoor(current.weathercode);
    const temperature = current.temperature;
    const precipitation = current.precipitation;
    const isDay = current.is_day === 1;

    let score = 0;
    let explanation = '';
    let confidence = 0;

    if (isGoodWeather) {
      score += 50;
      explanation += 'Good weather conditions. ';
      confidence += 0.5;
    }

    if (temperature > 15 && temperature < 25) {
      score += 30;
      explanation += 'Perfect temperature for outdoor activities. ';
      confidence += 0.3;
    }

    if (precipitation === 0) {
      score += 20;
      explanation += 'No rain. ';
      confidence += 0.2;
    }

    if (!isDay) {
      score -= 30;
      explanation += 'Night time, limited visibility. ';
      confidence += 0.3;
    }

    return {
      type: ActivityType.OUTDOOR_SIGHTSEEING,
      score: Math.max(0, Math.min(score, 100)),
      explanation: explanation || 'Conditions could be better.',
      confidence: Math.min(confidence, 1),
    };
  }
}