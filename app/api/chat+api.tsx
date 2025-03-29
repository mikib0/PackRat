import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { serverEnv } from '~/env/serverEnvs';
import { mockPacks, mockPackItems, mockCatalogItems } from '~/data/mockData';
import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';

// Mock function to get pack details
async function getPackDetails(packId: string) {
  // In a real app, this would fetch from your database
  return mockPacks.find((pack) => pack.id === packId);
}

// Mock function to get item details
async function getItemDetails(itemId: string) {
  return (
    mockPackItems.find((item) => item.id === itemId) ||
    mockCatalogItems.find((item) => item.id === itemId)
  );
}

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

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { messages, contextType, itemId, packId, userId, location } = await req.json();

    // Get weather data
    const weatherData = await getWeatherData(location || 'Current Location');

    // Build context based on what was passed
    let systemPrompt = '';

    if (contextType === 'item' && itemId) {
      const item = await getItemDetails(itemId);
      if (item) {
        systemPrompt = `
          You are PackRat AI, a helpful assistant for hikers and outdoor enthusiasts.
          You're currently helping with an item named: ${item.name} (${item.category}).
          
          Item details:
          - Weight: ${item.weight} ${item.weightUnit}
          ${item.description ? `- Description: ${item.description}` : ''}
          ${item.notes ? `- Notes: ${item.notes}` : ''}
          ${item.consumable ? '- This is a consumable item' : ''}
          ${item.worn ? '- This is a worn item' : ''}
          
          Current weather in ${weatherData.location}: ${weatherData.temperature}°F, ${weatherData.conditions}, 
          ${weatherData.humidity}% humidity, wind ${weatherData.windSpeed} mph.
          
          Provide friendly, concise advice about this item. You can suggest alternatives, 
          maintenance tips, or ways to use it effectively based on the current weather conditions.
        `;
      }
    } else if (contextType === 'pack' && packId) {
      const pack = await getPackDetails(packId);
      if (pack) {
        systemPrompt = `
          You are PackRat AI, a helpful assistant for hikers and outdoor enthusiasts.
          You're currently helping with a pack named: ${pack.name} (${pack.category}).
          
          Pack details:
          - Items: ${pack.items.length} items
          - Categories: ${Array.from(new Set(pack.items.map((item) => item.category))).join(', ')}
          ${pack.description ? `- Description: ${pack.description}` : ''}
          ${pack.tags ? `- Tags: ${pack.tags.join(', ')}` : ''}
          
          Current weather in ${weatherData.location}: ${weatherData.temperature}°F, ${weatherData.conditions}, 
          ${weatherData.humidity}% humidity, wind ${weatherData.windSpeed} mph.
          
          Provide friendly, concise advice about this pack. You can suggest items that might be missing,
          ways to reduce weight, or improvements based on the pack's purpose and current weather conditions.
        `;
      }
    } else {
      // General outdoor conversation
      systemPrompt = `
        You are PackRat AI, a helpful assistant for hikers and outdoor enthusiasts.
        You provide advice on what items users should take in their packs based on their needs,
        weather conditions, and ultralight hiking best practices.
        
        Current weather in ${weatherData.location}: ${weatherData.temperature}°F, ${weatherData.conditions}, 
        ${weatherData.humidity}% humidity, wind ${weatherData.windSpeed} mph.
        
        Provide friendly, concise advice. Suggest items based on the user's questions and current weather.
        For ultralight hikers, focus on multi-purpose items and weight savings.
        For beginners, emphasize safety and comfort.
        `;
    }

    // Create a custom OpenAI provider with your API key
    const customOpenAI = createOpenAI({
      apiKey: serverEnv.OPENAI_API_KEY,
    });

    // Stream the AI response
    const result = streamText({
      model: customOpenAI('gpt-4o'),
      system: systemPrompt,
      messages,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('AI Chat API error:', error);
    return new Response('Failed to process AI chat request', { status: 500 });
  }
}
