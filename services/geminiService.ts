import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const processImageWithGemini = async (file: File, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("The API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const imagePart = await fileToGenerativePart(file);
    const textPart = { text: prompt };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        temperature: 0.3,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error processing image with Gemini:", error);
    if (error instanceof Error) {
        return `An error occurred: ${error.message}`;
    }
    return "An unknown error occurred while processing the image.";
  }
};
