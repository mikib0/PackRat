import { createOpenAI, openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { serverEnv } from '~/env/serverEnvs';

// This is a simple mock function to get weather data
// In a real app, you would integrate with a weather API
async function getWeatherData(location: string) {
  // Mock data for demonstration
  return {
    location,
    temperature: 72,
    conditions: 'Sunny',
    humidity: 45,
    windSpeed: 8,
  };
}

// This is a simple mock function to get user's pack items
// In a real app, you would fetch this from your database
async function getUserPackItems(userId: string) {
  // Mock data for demonstration
  return [
    { id: '1', name: 'Tent', weight: '2.5 lbs', category: 'Shelter' },
    { id: '2', name: 'Sleeping Bag', weight: '1.8 lbs', category: 'Sleep' },
    { id: '3', name: 'Water Filter', weight: '0.3 lbs', category: 'Water' },
    { id: '4', name: 'Hiking Boots', weight: '2.2 lbs', category: 'Footwear' },
    { id: '5', name: 'Rain Jacket', weight: '0.8 lbs', category: 'Clothing' },
  ];
}

export async function POST(req: Request) {
  try {
    console.log('INCOMING REQUEST', req);
    const { messages, userId, location } = await req.json();

    // Get real data to enhance the AI's context
    const weatherData = await getWeatherData(location || 'Current Location');
    const userItems = await getUserPackItems(userId || 'default');

    // Create a system message with context about the app and available data
    const systemMessage = `
      You are PackRat AI, a helpful assistant for hikers and outdoor enthusiasts.
      You provide advice on what items users should take in their packs based on their needs, 
      the current weather, and ultralight hiking best practices.
      
      Current weather in ${weatherData.location}: ${weatherData.temperature}°F, ${weatherData.conditions}, 
      ${weatherData.humidity}% humidity, wind ${weatherData.windSpeed} mph.
      
      User's current pack items:
      ${userItems.map((item) => `- ${item.name} (${item.weight})`).join('\n')}
      
      Provide friendly, concise advice. Suggest items to add or remove based on conditions.
      For ultralight hikers, focus on multi-purpose items and weight savings.
      For beginners, emphasize safety and comfort.
    `;

    // Create a custom OpenAI provider with your API key
    const customOpenAI = createOpenAI({
      apiKey: serverEnv.OPENAI_API_KEY,
    });

    // Stream the AI response
    const result = streamText({
      model: customOpenAI('gpt-4o'),
      system: systemMessage,
      messages,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('2222AI Chat API error:', error);
    return new Response('Failed to process AI chat request', { status: 500 });
  }
}
