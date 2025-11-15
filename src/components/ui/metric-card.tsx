import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { gsap } from 'gsap';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: string;
  icon: React.ReactNode;
  trend?: string;
  color: 'primary' | 'success' | 'warning' | 'purple';
  delay?: number;
}

const colorClasses = {
  primary: {
    gradient: 'bg-gradient-primary',
    glow: 'shadow-glow',
    text: 'text-primary'
  },
  success: {
    gradient: 'bg-gradient-success',
    glow: 'shadow-glow-success',
    text: 'text-success'
  },
  warning: {
    gradient: 'bg-gradient-warning',
    glow: 'shadow-glow-warning',
    text: 'text-warning'
  },
  purple: {
    gradient: 'bg-gradient-purple',
    glow: 'shadow-glow-purple',
    text: 'text-purple-400'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  status,
  icon,
  trend,
  color,
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && iconRef.current && valueRef.current) {
      const tl = gsap.timeline({ delay: delay / 1000 });
      
      tl.fromTo(
        cardRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
      )
      .fromTo(
        iconRef.current,
        { scale: 0, rotation: -90 },
        { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo(
        valueRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: 'power2.out' },
        '-=0.2'
      );

      // Hover animation
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      cardRef.current.addEventListener('mouseenter', handleMouseEnter);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener('mouseenter', handleMouseEnter);
          cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, [delay]);

  const classes = colorClasses[color];

  return (
    <Card 
      ref={cardRef}
      className={`${classes.gradient} border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div ref={iconRef} className={`${classes.text}`}>
                {icon}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <div ref={valueRef} className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{value}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
              <p className="text-xs text-muted-foreground">{status}</p>
              {trend && (
                <p className={`text-xs font-medium ${classes.text}`}>{trend}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};