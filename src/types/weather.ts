export interface Region {
  id: string;
  name: string;
  swName: string;
  slug: string;
  lat: number;
  lng: number;
  capital: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  condition: string;
  conditionCode: number;
  icon: string;
  pressure?: number;
  visibility?: number;
  uv?: number;
  isDay: boolean;
  updatedAt: string;
  source: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  feelsLike?: number;
  precipitation: number;
  precipProb: number;
  humidity?: number;
  windSpeed?: number;
  condition: string;
  conditionCode: number;
  icon: string;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipSum: number;
  precipProb: number;
  condition: string;
  conditionCode: number;
  icon: string;
  sunrise?: string;
  sunset?: string;
  windSpeedMax?: number;
}

export interface Alert {
  id: string;
  event: string;
  severity: "Watch" | "Warning" | "Severe" | "Extreme" | "Unknown";
  headline: string;
  description: string;
  regions: string[];
  start: string;
  end: string;
  source: string;
}

export interface HistoryMonth {
  year: number;
  month: number;
  avgTemp: number;
  totalPrecip: number;
  rainyDays?: number;
}

export interface UnifiedWeather {
  region: Region;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: Alert[];
  history?: HistoryMonth[];
  sources: string[];
  fetchedAt: string;
}

export interface AIInsight {
  text: string;
  confidence: "High" | "Medium" | "Low";
  sources: string[];
  reasoning?: string[];
  generatedAt: string;
  lang: "en" | "sw";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: string;
}
