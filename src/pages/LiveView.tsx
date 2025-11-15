import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { LiveIndicator } from '@/components/ui/live-indicator';
import { Activity, Pause, RotateCcw } from 'lucide-react';
import { gsap } from 'gsap';

export default function LiveView() {
  const headerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const recordingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Kinova - Live View';
    
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }

    if (viewerRef.current) {
      gsap.fromTo(
        viewerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.3 }
      );
    }

    if (controlsRef.current) {
      gsap.fromTo(
        controlsRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
      );
    }

    if (recordingRef.current) {
      gsap.fromTo(
        recordingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.7 }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Live View</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Real-time 3D gait visualization with full model controls
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Pause</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* 3D Viewer */}
          <div className="xl:col-span-3">
            <Card ref={viewerRef} className="bg-gradient-primary border-border/50 h-[400px] sm:h-[500px] lg:h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Enhanced 3D Model Viewer
                  </CardTitle>
                  <LiveIndicator />
                </div>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full bg-card/30 rounded-lg border border-border/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Activity className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">Enhanced 3D Model Viewer</h3>
                    <p className="text-muted-foreground max-w-md">
                      Real-time 3D visualization with full model controls
                    </p>
                    <p className="text-sm text-primary font-medium">
                      Three.js integration ready for GLTF/GLB models
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Display Controls */}
            <Card ref={controlsRef} className="bg-gradient-primary border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Display Controls
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure visualization options
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Show Skeleton</label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Show Grid</label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Auto Rotate</label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Recording Controls */}
            <Card ref={recordingRef} className="bg-gradient-success border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Recording
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Capture and export data
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
                  Start Recording
                </Button>
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
                
                <div className="pt-4 border-t border-border/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Connection Status</span>
                      <span className="text-success font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Sensors</span>
                      <span className="text-foreground">6 of 8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sample Rate</span>
                      <span className="text-foreground">60 Hz</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}