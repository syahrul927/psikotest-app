import Image from 'next/image';
import React from 'react';

interface MemoizedImageContentProps {
  isMemorizing: boolean;
  imageSrc: string;
  alt: string;
}

export const MemoizedImageContent = React.memo(function MemoizedImageContent({
  isMemorizing,
  imageSrc,
  alt,
}: MemoizedImageContentProps) {
  if (!isMemorizing) return null;

  return (
    <div className="relative mx-auto h-64 w-full overflow-hidden rounded-lg border shadow-sm">
      <Image
        src={imageSrc}
        fill
        alt={alt}
        className="object-contain dark:invert"
        priority={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
});

MemoizedImageContent.displayName = "MemoizedImageContent";