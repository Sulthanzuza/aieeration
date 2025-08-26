class AudioService {
  constructor() {
    this.baseUrl = 'https://aieeration.onrender.com/api/audio';
  }

  async analyzeAudio(audioFile) {
    try {
      if (!audioFile) {
        throw new Error('No audio file provided');
      }

      // Validate file type
      if (!audioFile.type.startsWith('audio/')) {
        throw new Error('Please select a valid audio file');
      }

      // Validate file size (25MB limit)
      const maxSize = 25 * 1024 * 1024; // 25MB
      if (audioFile.size > maxSize) {
        throw new Error('File size exceeds 25MB limit. Please choose a smaller file.');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('audio', audioFile);

      console.log('Uploading audio file:', {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      });

      // Make API request
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      return result;
    } catch (error) {
      console.error('Audio analysis error:', error);
      
      // Re-throw with user-friendly message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please ensure the backend is running.');
      }
      
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default new AudioService();