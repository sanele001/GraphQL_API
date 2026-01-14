export enum ActivityType {
  SKIING = 'SKIING',
  SURFING = 'SURFING',
  INDOOR_SIGHTSEEING = 'INDOOR_SIGHTSEEING',
  OUTDOOR_SIGHTSEEING = 'OUTDOOR_SIGHTSEEING',
}

export interface ActivityScore {
  type: ActivityType;
  score: number;
  explanation: string;
  confidence: number;
}

export interface ActivityCriteria {
  minTemp?: number;
  maxTemp?: number;
  idealTemp?: number;
  needsPrecipitation?: boolean;
  precipitationType?: 'snow' | 'rain';
  minWindSpeed?: number;
  maxWindSpeed?: number;
  needsDaylight?: boolean;
  weatherCodes?: number[];
}