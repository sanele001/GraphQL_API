export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    apparent_temperature: string;
    weather_code: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    precipitation: string;
    humidity_2m: string;
    is_day: string;
  };
  current_weather: {
    time: string;
    interval: number;
    temperature: number;
    apparent_temperature: number;
    weathercode: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    humidity_2m: number;
    is_day: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    weather_code: number[];
    precipitation: number[];
    wind_speed_10m: number[];
  };
}

export interface WeatherConditions {
  [code: number]: {
    description: string;
    day: string;
    night: string;
    icon: string;
  };
}

export const WEATHER_CODES: WeatherConditions = {
  0: { description: 'Clear sky', day: 'Sunny', night: 'Clear', icon: '☀️' },
  1: { description: 'Mainly clear', day: 'Mostly sunny', night: 'Mostly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', day: 'Partly cloudy', night: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', day: 'Cloudy', night: 'Cloudy', icon: '☁️' },
  45: { description: 'Foggy', day: 'Fog', night: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', day: 'Freezing fog', night: 'Freezing fog', icon: '🌫️' },
  51: { description: 'Light drizzle', day: 'Light drizzle', night: 'Light drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', day: 'Light rain', night: 'Light rain', icon: '🌧️' },
  80: { description: 'Slight rain showers', day: 'Light showers', night: 'Light showers', icon: '🌦️' },
  95: { description: 'Thunderstorm', day: 'Storm', night: 'Storm', icon: '⛈️' },
};