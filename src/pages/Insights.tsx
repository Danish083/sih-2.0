import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  Download,
  Activity,
  Footprints,
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGaitMetrics } from '@/hooks/useGaitMetrics';

// Recharts components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const headerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  const { data: gaitData, loading, error } = useGaitMetrics();

  useEffect(() => {
    document.title = 'Kinova - Insights';
    
    // GSAP animations (unchanged)
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }

    if (scoreRef.current) {
      gsap.fromTo(
        scoreRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.3 }
      );
    }

    if (curveRef.current) {
      gsap.fromTo(
        curveRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
      );
    }

    if (recommendationsRef.current) {
      gsap.fromTo(
        recommendationsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.7 }
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-foreground animate-pulse">
          Analyzing gait data...
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

  // Use the last 30 data points for analysis, which will be the most recent
  const latestData = gaitData.slice(-30);

  if (latestData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-muted-foreground">
          No historical data available to generate insights.
        </p>
      </div>
    );
  }
  
  // --- Dynamic Analysis based on real data ---
  // The gait score is calculated by multiplying the equilibriumScore by 100 to bring it to a 0-100 scale.
  const gaitScore = latestData.reduce((sum, entry) => sum + entry.equilibriumScore * 100, 0) / latestData.length;
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };

  const insights = [];
  const recommendations = [];

  // Insight 1: Overall Trend
  const startScore = latestData[0]?.equilibriumScore * 100 || 0;
  const endScore = latestData[latestData.length - 1]?.equilibriumScore * 100 || 0;
  const trend = ((endScore - startScore) / startScore) * 100;
  if (trend > 5) {
    insights.push({
      type: 'positive',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Strong Upward Trend',
      description: `Your equilibrium scores have improved by ${trend.toFixed(1)}% over recent sessions.`,
      color: 'primary'
    });
  } else if (trend < -5) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Downward Trend',
      description: `Equilibrium scores have declined by ${Math.abs(trend).toFixed(1)}%. It might be time to reassess.`,
      color: 'destructive'
    });
    recommendations.push({
      title: 'Focused Drills',
      description: 'Review and practice foundational balance exercises more frequently.',
      priority: 'high'
    });
  } else {
    insights.push({
      type: 'positive',
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Stable Performance',
      description: 'Your gait score is consistent, showing stable and reliable performance.',
      color: 'success'
    });
  }

  // Insight 2: Cadence Consistency
  const cadenceValues = latestData.map(d => d.cadence);
  const avgCadence = cadenceValues.reduce((a, b) => a + b, 0) / cadenceValues.length;
  const cadenceVariance = Math.sqrt(cadenceValues.reduce((sum, val) => sum + Math.pow(val - avgCadence, 2), 0) / cadenceValues.length);
  if (cadenceVariance > 20) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Cadence Variability',
      description: 'Step rhythm shows increased variation, which can impact efficiency.',
      color: 'warning'
    });
    recommendations.push({
      title: 'Rhythm Exercises',
      description: 'Practice metronome-guided walking to improve cadence consistency.',
      priority: 'medium'
    });
  } else {
    insights.push({
      type: 'positive',
      icon: <Footprints className="w-5 h-5" />,
      title: 'Consistent Cadence',
      description: 'Your walking rhythm is stable, contributing to efficient movement.',
      color: 'success'
    });
  }

  // Insight 3: Walking Speed
  const avgSpeed = latestData.reduce((sum, entry) => sum + entry.walkingSpeed, 0) / latestData.length;
  if (avgSpeed > 1) { // Assuming avgSpeed is in m/s, 1 m/s is a typical brisk walk
    insights.push({
      type: 'positive',
      icon: <Activity className="w-5 h-5" />,
      title: 'Effective Speed',
      description: `You are maintaining a brisk walking speed of ${avgSpeed.toFixed(2)} m/s.`,
      color: 'success'
    });
  }

  // Final recommendations check
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Maintain Consistency',
      description: 'Continue your current training to sustain excellent performance.',
      priority: 'low'
    });
  }

  // Prepare data for the Recharts graph
  const chartData = latestData.map(d => ({
    timestamp: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: d.equilibriumScore * 100 // Scale the score for the chart as well
  }));

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gait Insights</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              AI-powered gait analysis and personalized recommendations
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button size="sm" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Overall Gait Score */}
        <Card ref={scoreRef} className="bg-gradient-primary border-border/50">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Overall Gait Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="hsl(var(--success))"
                    strokeWidth="3"
                    strokeDasharray={`${gaitScore}, 100`}
                    className="drop-shadow-sm"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-3xl font-bold ${getScoreColor(gaitScore)}`}>
                    {gaitScore.toFixed(0)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
            </div>
            <div>
              <Badge variant="secondary" className="text-sm">
                {getScoreLabel(gaitScore)}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Based on key gait parameters over the last {latestData.length} data points
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Score Trend Curve */}
          <Card ref={curveRef} className="bg-gradient-primary border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Score Progression
              </CardTitle>
              <p className="text-sm text-muted-foreground">Recent gait score trend</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card ref={recommendationsRef} className="bg-gradient-primary border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Key Insights
              </CardTitle>
              <p className="text-sm text-muted-foreground">AI-generated observations</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-card/30 rounded-lg border border-border/30">
                  <div className={`text-${insight.color} mt-1`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-gradient-primary border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Personalized Recommendations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Tailored exercises to improve your gait performance
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-card/30 rounded-lg border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}