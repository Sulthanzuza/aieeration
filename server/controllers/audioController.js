const geminiConfig = require('../config/gemini');

class AudioController {
  constructor() {
    this.analyzeAudio = this.analyzeAudio.bind(this);
  }

  async analyzeAudio(req, res) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided'
        });
      }

      console.log('Processing audio file:', {
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      // Get the Gemini model
      const model = geminiConfig.getModel();

      // Prepare the audio data for Gemini
      const audioData = {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype,
        },
      };

      // Create the comprehensive prompt
      const prompt = this.createAnalysisPrompt();

      // Send request to Gemini API
      console.log('Sending request to Gemini API...');
      const result = await model.generateContent([prompt, audioData]);
      const response = await result.response;
      const text = response.text();

      console.log('Received response from Gemini API');

      // Parse the JSON response
      const analysisResult = this.parseGeminiResponse(text);

      // Return the structured response
      res.json({
        success: true,
        data: analysisResult,
        metadata: {
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          processedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error analyzing audio:', error);
      
      // Handle specific error types
      if (error.message.includes('API key')) {
        return res.status(500).json({
          success: false,
          error: 'API configuration error. Please check server setup.'
        });
      }

      if (error.message.includes('file size')) {
        return res.status(413).json({
          success: false,
          error: 'File too large. Please upload an audio file smaller than 25MB.'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to analyze audio. Please try again.'
      });
    }
  }

  createAnalysisPrompt() {
    return `Analyze the provided audio file and perform the following tasks:

1. Identify the primary language spoken.
2. Generate a full transcript (subtitles) of the audio in its original language.
3. **Transliterate the full transcript into English characters (roman script). For example, if the text is in Hindi "नमस्ते", it should become "Namaste".**
4. Create a concise summary of the audio in its original language.
5. Create a concise summary of the audio in English.
6. Translate the entire full transcript into English.

Return the result as a single JSON object with the following structure. If the identified language is already English, the 'englishTranslation' field should be a direct copy of the 'nativeSubtitles' field.
{
  "identifiedLanguage": "The name of the language identified",
  "nativeSubtitles": "The full transcript in the native language...",
  "englishTransliteration": "The transliterated transcript in English characters...",
  "nativeSummary": "The summary in the native language...",
  "englishSummary": "The summary in English...",
  "englishTranslation": "The full transcript translated into English..."
}

Important: Return ONLY the JSON object, no additional text or formatting.`;
  }

  parseGeminiResponse(responseText) {
    try {
      // Clean the response text
      let cleanedText = responseText.trim();
      
      // Remove markdown code block markers if present
      cleanedText = cleanedText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      
      // Parse the JSON
      const parsedResult = JSON.parse(cleanedText);
      
      // Validate required fields
      const requiredFields = ['identifiedLanguage', 'nativeSubtitles', 'nativeSummary', 'englishSummary', 'englishTranslation'];
      for (const field of requiredFields) {
        if (typeof parsedResult[field] === 'undefined') { // Check for undefined instead of falsy
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return parsedResult;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw response:', responseText);
      
      // Return a fallback structure
      return {
        identifiedLanguage: 'Unknown',
        nativeSubtitles: 'Error: Could not process audio transcription.',
        englishTransliteration: 'Error: Could not process transliteration.',
        nativeSummary: 'Error: Could not generate summary.',
        englishSummary: 'Error: Could not generate English summary.',
        englishTranslation: 'Error: Could not generate English translation.'
      };
    }
  }
}

module.exports = new AudioController();