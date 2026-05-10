import { GoogleGenAI, Type, Schema } from '@google/genai';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import fs from 'fs';

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

export interface MacroEstimation {
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: 'high' | 'medium' | 'low';
}

export async function estimateMacrosFromImage(imagePath: string, mimeType: string): Promise<MacroEstimation> {
  try {
    const filePart = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
        mimeType
      }
    };

    const prompt = `
      You are an expert nutritionist. Analyze this food image and estimate its macronutrients.
      - Identify the visible food items and portion sizes.
      - Estimate macros conservatively (slightly overestimate calories if unsure).
      - Do not hallucinate exact precision. Round to nearest 5 or 10.
      - Ensure the response perfectly matches the requested JSON schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            prompt,
            filePart
        ],
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        }
    });

    if (!response.text) {
        throw new Error("No text in Gemini response");
    }

    const estimation = JSON.parse(response.text) as MacroEstimation;
    return estimation;
  } catch (error) {
    logger.error({ error }, 'Error estimating macros from image');
    throw new Error('Failed to analyze image');
  }
}
