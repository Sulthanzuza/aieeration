const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiConfig {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
      }
      
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Gemini AI client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI client:', error);
      throw error;
    }
  }

  getModel() {
    if (!this.model) {
      throw new Error('Gemini model not initialized');
    }
    return this.model;
  }
}

module.exports = new GeminiConfig();