import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetricCard } from '@/components/ui/metric-card';
import { 
  BarChart3, 
  Calendar, 
  Download,
  Target,
  Activity,
  Timer,
  Footprints,
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGaitMetrics } from '@/hooks/useGaitMetrics';

// Import Recharts components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const headerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  const { data: gaitData, loading, error } = useGaitMetrics();

  useEffect(() => {
    document.title = 'Kinova- Analytics';
    
    // GSAP animations (unchanged)
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
    }
    if (metricsRef.current) {
      gsap.fromTo(metricsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
    }
    if (chartsRef.current) {
      gsap.fromTo(chartsRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-foreground animate-pulse">
          Fetching historical analytics data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-destructive">
          Error loading data: {error.message}
        </p>
      </div>
    );
  }

  if (!gaitData || gaitData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-muted-foreground">
          No historical data available.
        </p>
      </div>
    );
  }

  // Calculate dynamic metrics from the fetched data
  const totalEquilibrium = gaitData.reduce((sum, entry) => sum + entry.equilibriumScore, 0);
  const avgEquilibrium = totalEquilibrium / gaitData.length;
  const peakCadence = gaitData.reduce((max, entry) => Math.max(max, entry.cadence), 0);
  
  const avgStrideLength = gaitData.reduce((sum, entry) => sum + entry.strideLength, 0) / gaitData.length;
  const variance = gaitData.reduce((sum, entry) => sum + Math.pow(entry.strideLength - avgStrideLength, 2), 0) / gaitData.length;
  const strideVariance = Math.sqrt(variance);

  const analyticsMetrics = [
    {
      title: 'Avg Equilibrium',
      value: avgEquilibrium.toFixed(2),
      unit: '%',
      status: avgEquilibrium > 90 ? 'Excellent' : 'Good',
      icon: <Target className="h-5 w-5" />,
      trend: '+12.5%',
      color: 'success' as const
    },
    {
      title: 'Peak Cadence',
      value: peakCadence.toFixed(0),
      unit: 'steps/min',
      status: 'High',
      icon: <Timer className="h-5 w-5" />,
      trend: '+8.3%',
      color: 'primary' as const
    },
    {
      title: 'Stride Variance',
      value: `±${strideVariance.toFixed(2)}`,
      unit: 'cm',
      status: strideVariance < 3 ? 'Stable' : 'Unstable',
      icon: <Footprints className="h-5 w-5" />,
      color: 'warning' as const
    },
    {
      title: 'Data Points',
      value: gaitData.length.toLocaleString(),
      unit: '',
      status: 'Collected',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'purple' as const
    }
  ];

  // Prepare chart data. We'll show the last 24 data points, sorted from oldest to newest.
  const chartData = [...gaitData].slice(-24).sort((a, b) => a.timestamp - b.timestamp).map(d => ({
    timestamp: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    equilibrium: d.equilibriumScore,
    cadence: d.cadence,
    speed: d.walkingSpeed,
    sway: d.posturalSway
  }));
  
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Historical gait analysis and movement insights
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Select defaultValue="7days">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">Last 24h</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Custom Range</span>
                <span className="sm:hidden">Range</span>
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div ref={metricsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {analyticsMetrics.map((metric, index) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              status={metric.status}
              icon={metric.icon}
              trend={metric.trend}
              color={metric.color}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Equilibrium Data Chart */}
          <Card className="bg-gradient-primary border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Equilibrium Data
              </CardTitle>
              <p className="text-sm text-muted-foreground">Historical equilibrium trends</p>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 256 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="equilibrium" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cadence Data Chart */}
          <Card className="bg-gradient-primary border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Cadence Data
              </CardTitle>
              <p className="text-sm text-muted-foreground">Historical cadence patterns</p>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 256 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="cadence" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Walking Speed Chart */}
          <Card className="bg-gradient-warning border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Walking Speed
              </CardTitle>
              <p className="text-sm text-muted-foreground">Speed variations over time</p>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 256 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="speed" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Postural Sway Chart */}
          <Card className="bg-gradient-purple border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Postural Sway
              </CardTitle>
              <p className="text-sm text-muted-foreground">Balance stability metrics</p>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 256 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="sway" stroke="rgb(147 51 234)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}