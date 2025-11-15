import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LiveIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 1.2,
        opacity: 0.7,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, []);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        ref={dotRef}
        className={`${sizeClasses[size]} bg-success rounded-full shadow-glow-success`}
      />
      <span className={`${textSizeClasses[size]} text-success font-medium`}>
        LIVE
      </span>
    </div>
  );
};