import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { load } from "npm:cheerio@1.0.0-rc.12";
import { encode } from "npm:gpt-3-encoder@1.1.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

interface VideoInfo {
  source: 'youtube' | 'instagram';
  id: string;
}

interface VideoAnalysis {
  summary: string;
  detectedObjects: string[];
  thumbnail: string;
}

async function extractVideoId(url: string): Promise<VideoInfo | null> {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?]*)/,
    /(?:youtube\.com\/shorts\/)([^&\n?]*)/
  ];
  
  // Instagram pattern
  const instagramPattern = /(?:instagram\.com\/)(?:reel|reels)\/([^/?]*)/;

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return { source: 'youtube', id: match[1] };
    }
  }

  const instaMatch = url.match(instagramPattern);
  if (instaMatch) {
    return { source: 'instagram', id: instaMatch[1] };
  }

  return null;
}

async function getYouTubeContent(videoId: string): Promise<{
  content: string;
  thumbnail: string;
}> {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    const $ = load(html);
    
    // Extract video description and title
    const title = $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[property="og:description"]').attr('content') || '';
    
    // Extract thumbnail URL - try multiple resolutions
    const thumbnail = 
      $('meta[property="og:image"]').attr('content') || // HD thumbnail
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` || // Max resolution
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` || // HQ thumbnail
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` || // Medium quality
      `https://img.youtube.com/vi/${videoId}/default.jpg`; // Default thumbnail
    
    return {
      content: `${title}\n\n${description}`,
      thumbnail
    };
  } catch (error) {
    console.error('Error fetching YouTube content:', error);
    return {
      content: '',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` // Fallback to HQ thumbnail
    };
  }
}

async function getInstagramContent(videoId: string): Promise<{
  content: string;
  thumbnail: string;
}> {
  try {
    const response = await fetch(
      `https://www.instagram.com/reel/${videoId}/embed/captioned/`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    const html = await response.text();
    const $ = load(html);
    
    // Try multiple methods to extract caption
    const content = 
      $('div.Caption').text() ||
      $('meta[property="og:description"]').attr('content') ||
      $('title').text() ||
      'No caption available';
    
    // Extract thumbnail URL
    const thumbnail = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:secure_url"]').attr('content') ||
      '';
    
    return {
      content: content.trim(),
      thumbnail
    };
  } catch (error) {
    console.error('Error fetching Instagram content:', error);
    return {
      content: '',
      thumbnail: ''
    };
  }
}

async function analyzeContent(content: string): Promise<string[]> {
  try {
    const words = content.toLowerCase().split(/\s+/);
    const detectedObjects = new Set<string>();
    
    // Simple object detection based on common nouns
    const commonObjects = ['person', 'car', 'building', 'tree', 'phone', 'computer', 'book', 'table', 'chair'];
    for (const word of words) {
      if (commonObjects.includes(word)) {
        detectedObjects.add(word);
      }
    }

    return Array.from(detectedObjects);
  } catch (error) {
    console.error('Error analyzing content:', error);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Video URL is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const videoInfo = await extractVideoId(url);
    if (!videoInfo) {
      return new Response(
        JSON.stringify({ error: "Unsupported URL format" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get content and thumbnail based on platform
    const { content, thumbnail } = await (videoInfo.source === 'youtube' 
      ? getYouTubeContent(videoInfo.id)
      : getInstagramContent(videoInfo.id));

    // Analyze the content
    const detectedObjects = await analyzeContent(content);

    const analysis: VideoAnalysis = {
      summary: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
      detectedObjects,
      thumbnail
    };

    return new Response(
      JSON.stringify(analysis),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});