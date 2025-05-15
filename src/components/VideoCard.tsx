import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Play } from 'lucide-react';
import { VideoMetadata } from '../types';
import { VideoModal } from './VideoModal';
import { analyzeVideo } from '../services/videoAnalysis';

interface VideoCardProps {
  video: VideoMetadata;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoData, setVideoData] = useState({
    aiDescription: video.aiDescription,
    detectedObjects: video.detectedObjects,
    thumbnail: video.thumbnail
  });
  const analysisRequested = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchVideoAnalysis = async () => {
      if (!analysisRequested.current) {
        analysisRequested.current = true;
        try {
          const analysis = await analyzeVideo(video.url);
          if (isMounted.current) {
            setVideoData(prev => ({
              aiDescription: analysis.summary || prev.aiDescription,
              detectedObjects: analysis.detectedObjects.length > 0 ? analysis.detectedObjects : prev.detectedObjects,
              thumbnail: analysis.thumbnail || prev.thumbnail
            }));
          }
        } catch (error) {
          console.error('Failed to fetch video analysis:', error);
        }
      }
    };

    fetchVideoAnalysis();
  }, [video.url]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const fallbackThumbnail = 'https://via.placeholder.com/800x450';

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div 
          className="aspect-video relative cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Open video modal"
          onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
        >
          <img 
            src={videoData.thumbnail || fallbackThumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src !== fallbackThumbnail) {
                img.src = fallbackThumbnail;
              }
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <Play 
              className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-hidden="true"
            />
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <p className="text-blue-600">@{video.username}</p>
            </div>
            {video.location && (
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {video.location}
              </div>
            )}
          </div>

          <div className="flex gap-4 text-gray-500 text-sm">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {video.engagement.likes.toLocaleString()}
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {video.engagement.comments.toLocaleString()}
            </div>
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-1" />
              {video.engagement.shares.toLocaleString()}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">{videoData.aiDescription}</p>
            
            <div className="flex flex-wrap gap-2">
              {video.hashtags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              <strong>Detected:</strong> {videoData.detectedObjects.join(', ')}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <VideoModal 
          url={video.url} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}