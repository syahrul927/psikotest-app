import React from 'react';

interface VideoContentProps {
  videoUrl?: string;
  poster?: string;
  title?: string;
}

export const MemoizedVideoContent = React.memo(function MemoizedVideoContent({
  videoUrl,
  poster,
  title = "Video Instructions"
}: VideoContentProps) {
  if (!videoUrl) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-sm">
      <video
        controls
        preload="metadata"
        poster={poster}
        title={title}
        className="w-full"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

MemoizedVideoContent.displayName = "MemoizedVideoContent";