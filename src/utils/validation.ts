export function validateCityQuery(query: string): void {
  if (!query || query.trim().length < 2) {
    throw new Error('Query must be at least 2 characters long');
  }

  if (query.length > 100) {
    throw new Error('Query must be less than 100 characters');
  }
}

export function validateCoordinates(latitude: number, longitude: number): void {
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
}

export function validateDate(dateString: string): void {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14); // Allow up to 14 days in future

  if (date < today) {
    throw new Error('Date cannot be in the past');
  }

  if (date > maxDate) {
    throw new Error('Date cannot be more than 14 days in the future');
  }
}