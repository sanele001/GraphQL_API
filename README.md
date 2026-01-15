# GraphQL_API
GRAPHQL application for travel app. back end only

# Travel Planning GraphQL API
A scalable GraphQL API for travel planning with weather-based activity recommendations.

## Features

- **City Search**: Dynamic city suggestions using OpenMeteo Geocoding API
- **Weather Forecasts**: Current and hourly weather data
- **Activity Ranking**: AI-powered ranking of activities based on weather conditions
- **Caching**: In-memory caching for improved performance
- **Type Safety**: Full TypeScript implementation

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd travel-api

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:unit

Example query
query GetActivityRecommendations($cityId: ID!) {
  getActivityRecommendations(cityId: $cityId) {
    type
    explanation
    score
    confidence
  }
}