import axios from 'axios';

interface VideoAnalysisResponse {
  summary: string;
  detectedObjects: string[];
  thumbnail: string;
}

// Cache for analysis results
const analysisCache = new Map<string, VideoAnalysisResponse>();

export async function analyzeVideo(url: string): Promise<VideoAnalysisResponse> {
  // Check cache first
  const cachedResult = analysisCache.get(url);
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-video`,
      { url },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    // Cache the result
    analysisCache.set(url, response.data);
    return response.data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    return {
      summary: "Unable to analyze video at this time.",
      detectedObjects: [],
      thumbnail: ''
    };
  }
}