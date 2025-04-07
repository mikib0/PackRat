import type { LocationSearchResult } from '~/features/locations/types';
import { getWeatherIconName as getIconNameFromCode } from './weatherIcons';

// Your API key should be stored in environment variables
const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

// Base URL for the weather API
const API_BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Search for locations by name
 */
export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to our LocationSearchResult type
    return data.map((item: any) => ({
      id: `${item.id || item.lat}_${item.lon}`,
      name: item.name,
      region: item.region,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations');
  }
}

/**
 * Search for locations by coordinates
 */
export async function searchLocationsByCoordinates(
  latitude: number,
  longitude: number
): Promise<LocationSearchResult[]> {
  try {
    // Format coordinates for the API query
    const query = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

    // Use the same search endpoint but with coordinates
    const response = await fetch(
      `${API_BASE_URL}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // If no results, try a reverse geocoding approach with current conditions API
    if (!data || data.length === 0) {
      const currentResponse = await fetch(
        `${API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`
      );

      if (!currentResponse.ok) {
        throw new Error(`API error: ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      if (currentData && currentData.location) {
        // Create a single result from the current conditions response
        return [
          {
            id: `${currentData.location.lat}_${currentData.location.lon}`,
            name: currentData.location.name,
            region: currentData.location.region,
            country: currentData.location.country,
            lat: Number.parseFloat(currentData.location.lat),
            lon: Number.parseFloat(currentData.location.lon),
          },
        ];
      }
    }

    // Transform API response to our LocationSearchResult type
    return data.map((item: any) => ({
      id: `${item.id || item.lat}_${item.lon}`,
      name: item.name,
      region: item.region,
      country: item.country,
      lat: Number.parseFloat(item.lat),
      lon: Number.parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Error searching locations by coordinates:', error);
    throw new Error('Failed to find locations near you');
  }
}

/**
 * Get detailed weather data for a location
 */
export async function getWeatherData(latitude: number, longitude: number) {
  try {
    // Format coordinates for the API query
    const query = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

    // Get forecast data with all the details we need
    const response = await fetch(
      `${API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}&days=10&aqi=yes&alerts=yes`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting weather data:', error);
    throw new Error('Failed to get weather data');
  }
}

/**
 * Format raw weather data into our application's format
 */
export function formatWeatherData(data: any) {
  // Extract location data
  const location = data.location;
  const current = data.current;
  const forecast = data.forecast;
  const alerts = data.alerts;

  // Format date and time
  const localTime = new Date(location.localtime);
  const formattedTime = localTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Get today's forecast
  const todayForecast = forecast.forecastday[0];

  // Format hourly forecast
  const hourlyForecast = todayForecast.hour
    .filter((hour: any) => {
      const hourTime = new Date(hour.time);
      return hourTime > localTime;
    })
    .slice(0, 24) // Get next 24 hours
    .map((hour: any) => {
      const hourTime = new Date(hour.time);
      return {
        time: hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(hour.temp_f),
        icon: getIconNameFromCode(hour.condition.code, hour.is_day),
        weatherCode: hour.condition.code,
        isDay: hour.is_day,
      };
    });

  // Format daily forecast
  const dailyForecast = forecast.forecastday.map((day: any) => {
    const date = new Date(day.date);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(day.day.maxtemp_f),
      low: Math.round(day.day.mintemp_f),
      icon: getIconNameFromCode(day.day.condition.code, 1), // Always use day icon for daily forecast
      weatherCode: day.day.condition.code,
    };
  });

  // Format alerts if any
  let alertText = null;
  if (alerts && alerts.alert && alerts.alert.length > 0) {
    alertText = alerts.alert[0].headline || 'Weather Alert';
  }

  // Create the formatted weather data object
  return {
    id: `${location.lat}_${location.lon}`,
    name: location.name,
    temperature: Math.round(current.temp_f),
    condition: current.condition.text,
    time: formattedTime,
    highTemp: Math.round(todayForecast.day.maxtemp_f),
    lowTemp: Math.round(todayForecast.day.mintemp_f),
    alerts: alertText,
    lat: Number.parseFloat(location.lat),
    lon: Number.parseFloat(location.lon),
    details: {
      feelsLike: Math.round(current.feelslike_f),
      humidity: current.humidity,
      visibility: Math.round(current.vis_miles),
      uvIndex: current.uv,
      windSpeed: Math.round(current.wind_mph),
      weatherCode: current.condition.code,
      isDay: current.is_day,
    },
    hourlyForecast,
    dailyForecast,
  };
}

/**
 * Get background gradient colors based on weather condition
 */
export function getWeatherBackgroundColors(code: number, isNight: boolean): string[] {
  if (isNight) {
    // Night gradients
    if (code === 1000) return ['#1a2a3a', '#0c1824', '#05101a']; // Clear night
    if (code >= 1003 && code <= 1009) return ['#2c3e50', '#1a2a3a', '#0c1824']; // Partly cloudy night
    if (code >= 1030 && code <= 1039) return ['#4b6584', '#2c3e50', '#1a2a3a']; // Foggy night
    if (code >= 1063 && code <= 1069) return ['#3c6382', '#2c3e50', '#1a2a3a']; // Light rain night
    if (code >= 1087 && code <= 1117) return ['#2c2c54', '#1a1a2e', '#0c0c1a']; // Thunderstorm night
    if (code >= 1150 && code <= 1201) return ['#3c6382', '#2c3e50', '#1a2a3a']; // Rain night
    if (code >= 1204 && code <= 1237) return ['#4b6584', '#2c3e50', '#1a2a3a']; // Snow night
    if (code >= 1240 && code <= 1246) return ['#3c6382', '#2c3e50', '#1a2a3a']; // Heavy rain night
    if (code >= 1249 && code <= 1264) return ['#4b6584', '#2c3e50', '#1a2a3a']; // Sleet night
    if (code >= 1273 && code <= 1282) return ['#2c2c54', '#1a1a2e', '#0c0c1a']; // Thunderstorm with rain night
  } else {
    // Day gradients
    if (code === 1000) return ['#4287f5', '#3a77d9', '#2e5eae']; // Clear day
    if (code >= 1003 && code <= 1009) return ['#5d8bc3', '#4287f5', '#3a77d9']; // Partly cloudy day
    if (code >= 1030 && code <= 1039) return ['#7a7a7a', '#5d6273', '#4a4e5c']; // Foggy day
    if (code >= 1063 && code <= 1069) return ['#5d6273', '#4a4e5c', '#3a3e49']; // Light rain day
    if (code >= 1087 && code <= 1117) return ['#525580', '#3a3e5c', '#2e3149']; // Thunderstorm day
    if (code >= 1150 && code <= 1201) return ['#5d6273', '#4a4e5c', '#3a3e49']; // Rain day
    if (code >= 1204 && code <= 1237) return ['#a3b8cc', '#8ca6b9', '#7590a3']; // Snow day
    if (code >= 1240 && code <= 1246) return ['#5d6273', '#4a4e5c', '#3a3e49']; // Heavy rain day
    if (code >= 1249 && code <= 1264) return ['#7590a3', '#5d7a8c', '#4a6273']; // Sleet day
    if (code >= 1273 && code <= 1282) return ['#525580', '#3a3e5c', '#2e3149']; // Thunderstorm with rain day
  }

  // Default gradient
  return isNight ? ['#1a2a3a', '#0c1824', '#05101a'] : ['#4287f5', '#3a77d9', '#2e5eae'];
}
