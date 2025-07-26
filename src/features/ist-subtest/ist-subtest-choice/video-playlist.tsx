"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play, Pause, SkipForward, Clock } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { type VideoData } from "./confirmation-dialog";

interface VideoPlaylistProps {
  videos: VideoData[];
  onAllVideosComplete?: () => void;
}

export const VideoPlaylist: React.FC<VideoPlaylistProps> = ({
  videos,
  onAllVideosComplete,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentVideoIndex];

  // Handle video end - autoplay next video
  const handleVideoEnd = () => {
    // Mark current video as watched
    if (currentVideo) {
      setWatchedVideos((prev) => new Set([...prev, currentVideo.id]));
    }

    if (currentVideoIndex < videos.length - 1) {
      // Move to next video
      setCurrentVideoIndex((prev) => prev + 1);
      // Will autoplay in useEffect
    } else {
      // All videos completed
      setIsPlaying(false);
      onAllVideosComplete?.();
    }
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle skip to next video
  const skipToNext = () => {
    if (currentVideoIndex < videos.length - 1 && currentVideo) {
      setWatchedVideos((prev) => new Set([...prev, currentVideo.id]));
      setCurrentVideoIndex((prev) => prev + 1);
    }
  };

  // Handle video selection from playlist
  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  // Update time progress
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle progress bar dragging
  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateProgressFromMouse(e);
  };

  const handleProgressMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateProgressFromMouse(e);
    }
  };

  const handleProgressMouseUp = () => {
    if (isDragging && videoRef.current) {
      videoRef.current.currentTime = dragTime;
      setCurrentTime(dragTime);
      setIsDragging(false);
    }
  };

  const updateProgressFromMouse = (e: React.MouseEvent | MouseEvent) => {
    if (duration > 0) {
      const progressBar = (e.target as HTMLElement).closest('.progress-container');
      if (progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;
        setDragTime(newTime);
        if (!isDragging) {
          // Direct click - seek immediately
          if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
          }
        }
      }
    }
  };

  // Handle video load
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercentage = duration > 0 ? (displayTime / duration) * 100 : 0;

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging, dragTime]);

  // Reset video state when video changes and autoplay if not first video
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsDragging(false);
    setDragTime(0);
    
    if (currentVideoIndex === 0) {
      // First video - don't autoplay
      setIsPlaying(false);
    } else {
      // Not first video - autoplay
      setIsPlaying(true);
      // Small delay to ensure video element is ready
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentVideoIndex]);

  if (!currentVideo) return null;

  return (
    <div className="space-y-4">
      {/* Video Player and Playlist Row */}
      <div className="flex gap-4">
        {/* Video Player - 65% width */}
        <div className="flex-[0_0_65%]">
          <div className="relative overflow-hidden rounded-lg bg-black group cursor-pointer">
            <video
              ref={videoRef}
              key={currentVideo.id}
              src={currentVideo.url}
              className="aspect-video w-full"
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              preload="metadata"
              onClick={togglePlayPause}
            />

            {/* Center Play/Pause Button - YouTube Style */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
              onClick={togglePlayPause}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-black/70 rounded-full backdrop-blur-sm hover:bg-black/80 transition-all duration-200 hover:scale-110 cursor-pointer">
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </div>
            </div>

            {/* Video Overlay Controls */}
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="space-y-2">
                {/* Draggable Progress Bar */}
                <div className="progress-container relative">
                  <Progress value={progressPercentage} className="h-2 bg-white/20" />
                  
                  {/* Draggable Progress Bar Overlay */}
                  <div 
                    className={`absolute top-0 left-0 right-0 h-2 cursor-pointer ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onMouseDown={handleProgressMouseDown}
                  />
                  
                  {/* Progress Handle/Thumb */}
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-transform ${
                      isDragging ? 'scale-125' : 'scale-100 hover:scale-110'
                    }`}
                    style={{ left: `calc(${progressPercentage}% - 6px)` }}
                    onMouseDown={handleProgressMouseDown}
                  />
                  
                  {/* Time Preview Tooltip */}
                  {isDragging && (
                    <div 
                      className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none"
                      style={{ left: `calc(${progressPercentage}% - 20px)` }}
                    >
                      {formatTime(dragTime)}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    {currentVideoIndex < videos.length - 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={skipToNext}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatTime(displayTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Video Info */}
          <div className="mt-3 text-center">
            <h5 className="text-lg font-medium">{currentVideo.title}</h5>
            <p className="text-muted-foreground text-sm">
              Video {currentVideoIndex + 1} dari {videos.length}
            </p>
          </div>
        </div>

        {/* Video Playlist - 35% width */}
        <div className="flex-[0_0_35%]">
          <div className="space-y-2">
            <h6 className="text-sm font-medium">Daftar Video:</h6>
            <div className="max-h-80 space-y-1 overflow-y-auto pr-2">
              {videos.map((video, index) => {
                const isWatched = watchedVideos.has(video.id);
                const isCurrent = index === currentVideoIndex;

                return (
                  <div
                    key={video.id}
                    onClick={() => selectVideo(index)}
                    className={`flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors ${isCurrent
                        ? "border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30"
                        : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                      }`}
                  >
                    <div className="flex flex-1 items-center space-x-2 min-w-0">
                      <div className="flex-shrink-0">
                        {isWatched ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : isCurrent ? (
                          <Play className="h-4 w-4 text-blue-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <p className="truncate text-sm font-medium">
                          {video.title}
                        </p>
                        {video.duration && (
                          <p className="text-muted-foreground text-xs">
                            {Math.floor(video.duration / 60)}:
                            {(video.duration % 60).toString().padStart(2, "0")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-2">
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Playing
                        </Badge>
                      )}
                      {isWatched && !isCurrent && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {watchedVideos.size === videos.length && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-800 dark:bg-green-950/30">
          <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Semua video telah ditonton!</span>
          </div>
        </div>
      )}
    </div>
  );
};