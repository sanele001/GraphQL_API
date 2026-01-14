import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum ActivityType {
    SKIING
    SURFING
    INDOOR_SIGHTSEEING
    OUTDOOR_SIGHTSEEING
  }

  type City {
    id: ID!
    name: String!
    country: String!
    countryCode: String
    latitude: Float!
    longitude: Float!
    population: Int
    timezone: String
  }

  type Weather {
    temperature: Float!
    apparentTemperature: Float!
    weatherCode: Int!
    weatherDescription: String!
    precipitation: Float!
    windSpeed: Float!
    windDirection: Float!
    humidity: Int!
    isDay: Boolean!
    timestamp: String!
  }

  type ActivityScore {
    type: ActivityType!
    score: Float!
    explanation: String!
    confidence: Float!
  }

  type WeatherForecast {
    city: City!
    current: Weather!
    hourly: [Weather!]!
    recommendedActivities: [ActivityScore!]!
    bestActivity: ActivityScore
  }

  type Query {
    # Get city suggestions based on partial input
    suggestCities(
      query: String!
      limit: Int = 10
      language: String = "en"
    ): [City!]!

    # Get weather forecast for a specific city
    getWeatherForecast(
      cityId: ID!
      forecastDays: Int = 1
      includeHourly: Boolean = false
    ): WeatherForecast!

    # Get activity recommendations for a city
    getActivityRecommendations(
      cityId: ID!
      date: String # ISO date string
    ): [ActivityScore!]!

    # Get detailed city information
    getCityDetails(cityId: ID!): City!
  }

  type Mutation {
    # Refresh weather data for a city (bypass cache)
    refreshWeatherData(cityId: ID!): WeatherForecast!
  }

  type Subscription {
    weatherUpdated(cityId: ID!): WeatherForecast!
  }
`;