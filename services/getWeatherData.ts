type WeatherData = {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
};

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&units=imperial&appid=${process.env.OPENWEATHER_KEY}`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    return {
      location,
      temperature: Math.round(data.main.temp),
      conditions: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
