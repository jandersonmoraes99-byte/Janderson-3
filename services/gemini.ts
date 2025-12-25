
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeFile(fileName: string, content: string): Promise<string> {
    const prompt = `Analyze this Android project file: ${fileName}.\n\nContent:\n${content}\n\nExplain its purpose and suggest 2 improvements for modern Android development. Keep it concise.`;
    
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert Senior Android Engineer. Provide clear, technical, and helpful insights about Kotlin, Room, and Jetpack components.'
        }
      });
      return response.text || 'No response from AI.';
    } catch (error) {
      console.error('Gemini Analysis Error:', error);
      return 'Error analyzing file. Please check your API configuration.';
    }
  }

  async chatAboutProject(history: any[], currentFile: string | null, message: string): Promise<string> {
    const systemPrompt = `You are DroidArchitect AI, an expert Android assistant. You are helping a developer with a project structure containing Kotlin, Room, and Billing logic. ${currentFile ? `The developer is currently looking at ${currentFile}.` : ''} Provide helpful code snippets and architectural advice.`;
    
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: systemPrompt
        }
      });
      return response.text || 'Thinking...';
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      return 'Sorry, I encountered an issue while processing your message.';
    }
  }
}

export const gemini = new GeminiService();
