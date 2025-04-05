import { getWeatherData } from "@/services/getWeatherData";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { getItemDetails, getPackDetails } from "@/utils/DbUtils";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Hono } from "hono";

const chatRoutes = new Hono();

chatRoutes.post("/", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { messages, contextType, itemId, packId, userId, location } =
      await c.req.json();

    // Get weather data for the specified location or default to user's location
    const weatherData = await getWeatherData(location || "New York, USA");

    // Build context based on what was passed
    let systemPrompt = "";

    if (contextType === "item" && itemId) {
      const item = await getItemDetails(itemId);
      if (item) {
        // Determine if it's a pack item or catalog item
        const isPackItem = "packId" in item;

        systemPrompt = `
          You are PackRat AI, a helpful assistant for hikers and outdoor enthusiasts.
          You're currently helping with an item named: ${item.name} (${
            item.category || "Uncategorized"
          }).
          
          Item details:
          - Weight: ${
            isPackItem
              ? `${item.weight} ${item.weightUnit}`
              : `${item.defaultWeight || "Unknown"} ${
                  item.defaultWeightUnit || "oz"
                }`
          }
          ${item.description ? `- Description: ${item.description}` : ""}
          ${isPackItem && item.notes ? `- Notes: ${item.notes}` : ""}
          ${isPackItem ? `- Consumable: ${item.consumable ? "Yes" : "No"}` : ""}
          ${isPackItem ? `- Worn: ${item.worn ? "Yes" : "No"}` : ""}
          ${!isPackItem && item.brand ? `- Brand: ${item.brand}` : ""}
          ${!isPackItem && item.model ? `- Model: ${item.model}` : ""}
          
          Current weather in ${weatherData.location}: ${
            weatherData.temperature
          }°F, ${weatherData.conditions}, 
          ${weatherData.humidity}% humidity, wind ${weatherData.windSpeed} mph.
          
          Provide friendly, concise advice about this item. You can suggest alternatives, 
          maintenance tips, or ways to use it effectively based on the current weather conditions.
          Keep your responses brief and focused on ultralight hiking principles when appropriate.
        `;
      }
    } else if (contextType === "pack" && packId) {
      const pack = await getPackDetails(packId);
      if (pack) {
        // Calculate total weight
        const totalWeight = pack.items.reduce((sum, item) => {
          // Skip worn items in base weight calculation
          if (item.worn) return sum;
          return sum + item.weight * item.quantity;
        }, 0);

        // Get unique categories
        const categories = Array.from(
          new Set(pack.items.map((item) => item.category || "Uncategorized"))
        );

        systemPrompt = `
          You are PackRat AI, a helpful assistant for hikers and outdoor enthusiasts.
          You're currently helping with a pack named: ${pack.name} (${
            pack.category || "Uncategorized"
          }).
          
          Pack details:
          - Items: ${JSON.stringify(pack.items)}
          - Base Weight: ${totalWeight.toFixed(2)} ${
            pack.items[0]?.weightUnit || "oz"
          }
          - Categories: ${categories.join(", ")}
          ${pack.description ? `- Description: ${pack.description}` : ""}
          ${pack.tags?.length ? `- Tags: ${pack.tags.join(", ")}` : ""}
          
          Current weather in ${weatherData.location}: ${
            weatherData.temperature
          }°F, ${weatherData.conditions}, 
          ${weatherData.humidity}% humidity, wind ${weatherData.windSpeed} mph.
          
          Provide friendly, concise advice about this pack. You can suggest items that might be missing,
          ways to reduce weight, or improvements based on the pack's purpose and current weather conditions.
          Keep your responses brief and focused on ultralight hiking principles when appropriate.
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
        Keep your responses brief and to the point.
      `;
    }

    // Create a custom OpenAI provider with your API key
    const customOpenAI = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Stream the AI response
    const result = streamText({
      model: customOpenAI("gpt-4o"),
      system: systemPrompt,
      messages,
      maxTokens: 1000,
      temperature: 0.7, // Add some creativity but not too much
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process AI chat request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});

export { chatRoutes };
