import { GoogleGenAI, Type, Schema } from '@google/genai';
import { env } from './src/config/env';
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    foods: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'List of identified food items',
    },
    calories: {
      type: Type.INTEGER,
      description: 'Estimated total calories (kcal)',
    },
    protein: {
      type: Type.INTEGER,
      description: 'Estimated total protein (g)',
    },
    carbs: {
      type: Type.INTEGER,
      description: 'Estimated total carbohydrates (g)',
    },
    fat: {
      type: Type.INTEGER,
      description: 'Estimated total fat (g)',
    },
    confidence: {
      type: Type.STRING,
      enum: ['high', 'medium', 'low'],
      description: 'Confidence level of the estimation',
    },
  },
  required: ['foods', 'calories', 'protein', 'carbs', 'fat', 'confidence'],
};
async function run() {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            "Test prompt",
            { inlineData: { data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", mimeType: "image/png" } }
        ],
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        }
    });
    console.log(response.text);
  } catch (e: any) {
    console.error(e);
  }
}
run();
