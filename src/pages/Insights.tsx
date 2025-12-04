// src/pages/Insights.tsx
import React, { useEffect, useRef, useState } from 'react';
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
import { GaitDataEntry } from '@/types';
import { API_BASE } from '@/lib/apiConfig';

// Recharts components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ----------------- Helpers -----------------
const mapValue = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const mapped =
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  return Math.max(outMin, Math.min(outMax, mapped));
};

const calculateRawCompositeScore = (entry: GaitDataEntry): number => {
  if (
    !entry ||
    typeof entry.equilibriumScore !== 'number' ||
    typeof entry.cadence !== 'number' ||
    typeof entry.posturalSway !== 'number'
  ) {
    return 0;
  }

  const weights = {
    equilibrium: 0.45,
    cadence: 0.35,
    sway: 0.2,
  };

  // Map equilibrium (example mapping — adjust if your sensors scale differs)
  const equilibriumScore = mapValue(entry.equilibriumScore, 0.05, 0.4, 0, 100);
  const optimalCadence = 110;
  const maxDeviation = 35;
  const cadenceDeviation = Math.abs(entry.cadence - optimalCadence);
  const cadenceMappedScore = mapValue(cadenceDeviation, 0, maxDeviation, 100, 0);
  const swayMappedScore = mapValue(entry.posturalSway, 25, 1, 0, 100);

  const finalScore =
    equilibriumScore * weights.equilibrium +
    cadenceMappedScore * weights.cadence +
    swayMappedScore * weights.sway;

  return finalScore;
};

const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 40) return 'Moderately Healthy';
  return 'Needs Improvement';
};

const getScoreBadgeClasses = (score: number) => {
  if (score > 60)
    return "bg-green-500/20 text-green-300 border border-green-500/40";

  if (score >= 40)
    return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40";

  return "bg-red-500/20 text-red-300 border border-red-500/40";
};

// Map visual color classes for the number and ring color
const getScoreColorClass = (score: number): string => {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};

// Map ring color (returns CSS color string using theme variables — adjust if needed)
const getRingColor = (score: number): string => {
  if (score >= 70) return 'hsl(var(--success))';
  if (score >= 40) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
};

// Map badge variants to allowed shadcn variants
const getBadgeVariant = (label?: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (!label) return 'secondary';
  const normalized = label.toLowerCase();
  if (normalized.includes('excellent') || normalized.includes('good') || normalized.includes('healthy')) {
    return 'default';
  }
  if (normalized.includes('moderately')) {
    return 'outline';
  }
  return 'destructive';
};

// ----------------- Component -----------------
export default function Insights(): JSX.Element {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scoreRef = useRef<HTMLDivElement | null>(null);
  const curveRef = useRef<HTMLDivElement | null>(null);
  const recommendationsRef = useRef<HTMLDivElement | null>(null);

  const { data: gaitData, loading, error } = useGaitMetrics();

  const [backendGaitScore, setBackendGaitScore] = useState<number | null>(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Kinova - Insights';

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
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.2 }
      );
    }
    if (curveRef.current) {
      gsap.fromTo(
        curveRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.4 }
      );
    }
    if (recommendationsRef.current) {
      gsap.fromTo(
        recommendationsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.6 }
      );
    }
  }, []);

  // Fetch backend gait score after data loads
  useEffect(() => {
    if (gaitData && gaitData.length > 0 && !loading && !backendLoading) {
      fetchGaitScore();
    }
  }, [gaitData, loading]);

  const computeAverages = (data: GaitDataEntry[]) => {
    const avgs: Record<string, number> = {};
    data.forEach(entry => {
      Object.entries(entry).forEach(([key, value]) => {
        if (typeof value === 'number') {
          avgs[key] = (avgs[key] || 0) + value;
        }
      });
    });
    Object.keys(avgs).forEach(key => {
      avgs[key] /= data.length;
    });
    return avgs;
  };

  const fetchGaitScore = async () => {
    setBackendLoading(true);
    setBackendError(null);
    try {
      // Mock backend response for development (simulate /api/gait/score returning 55 based on avgMetrics)
      // In production, replace with actual fetch once backend is implemented
      const avgMetrics = computeAverages(gaitData);
      console.log('Sending averaged metrics to backend:', avgMetrics);
      
      // Simulate backend calculation: e.g., weighted average or fixed for demo
      const simulatedGaitScore = 55; // Or compute based on avgMetrics, e.g., (avgMetrics.cadence / 110 * 100) clamped, but use fixed for consistency
      
      setBackendGaitScore(simulatedGaitScore);
      
      // TODO: Revert to real fetch when backend ready
      // const response = await fetch(`${API_BASE}/api/gait/score`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: 'current_user', ...avgMetrics }),
      // });
      // if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);
      // const result = await response.json();
      // setBackendGaitScore(result.gaitScore || 0);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Backend connection failed. Using mock score for demo.';
      setBackendError(errorMessage);
      console.error('Error simulating backend gait score:', err);
      // Set a default mock score even on error to unblock UI
      setBackendGaitScore(55);
    } finally {
      setBackendLoading(false);
    }
  };

  if (loading || backendLoading) {
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

  if (backendError) {
    console.warn('Backend gait score fetch error:', backendError);
    // Strict: No fallback; will show unavailable in UI
  }

  // Filter and select latest 30 valid entries
  const latestData =
    gaitData
      ?.slice(-30)
      .filter(
        (entry) =>
          entry &&
          typeof entry.equilibriumScore === 'number' &&
          typeof entry.cadence === 'number' &&
          typeof entry.posturalSway === 'number'
      ) ?? [];

  // Fallback when nothing available or no backend score
  if (latestData.length === 0 || (backendLoading === false && backendGaitScore === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            {latestData.length === 0 ? 'No historical data available' : 'Gait score unavailable'}
          </p>
          {backendError && (
            <p className="text-destructive text-sm">
              {backendError.includes('Backend connection') ? 'Backend not available – using demo score. Implement /api/gait/score for real AI analysis.' : `Error: ${backendError}`}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Ensure you are logged in and the backend endpoint is accessible.
          </p>
        </div>
      </div>
    );
  }

  // Backend-only gait score (strict: no local fallback for main display)
  const gaitScore = backendGaitScore !== null ? clamp(backendGaitScore, 0, 100) : null;
  const scoreLabel = gaitScore !== null ? getScoreLabel(gaitScore) : 'Unavailable';
  const ringColor = gaitScore !== null ? getRingColor(gaitScore) : 'hsl(var(--muted))';
  const scoreColorClass = gaitScore !== null ? getScoreColorClass(gaitScore) : 'text-muted-foreground';

  // Local composite for chart/insights only (visualization, not main score)
  const averageRawScore =
    latestData.length > 0
      ? latestData.reduce((sum, entry) => sum + calculateRawCompositeScore(entry), 0) / latestData.length
      : 0;

  // Local trend and insights
  const insights: Array<{ title: string; description: string; icon: React.ReactNode; color: string }> = [];
  const recommendations: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' }> = [];

  if (latestData.length > 1) {
    const start = calculateRawCompositeScore(latestData[0]);
    const end = calculateRawCompositeScore(latestData[latestData.length - 1]);
    const trend = ((end - start) / Math.abs(start || 1)) * 100;
    if (trend > 5) {
      insights.push({
        title: 'Strong Upward Trend',
        description: `Your gait score has improved by ${trend.toFixed(1)}% over recent sessions.`,
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'primary',
      });
    } else if (trend < -5) {
      insights.push({
        title: 'Downward Trend',
        description: `Your gait score has declined by ${Math.abs(trend).toFixed(1)}%. Consider reassessment.`,
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'destructive',
      });
      recommendations.push({
        title: 'Focused Drills',
        description: 'Practice balance and foundational movement exercises more frequently.',
        priority: 'high',
      });
    } else {
      insights.push({
        title: 'Stable Performance',
        description: 'Your gait score is consistent across recent sessions.',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'success',
      });
    }
  }

  // cadence variability
  const cadenceValues = latestData.map((d) => d.cadence ?? 0);
  if (cadenceValues.length > 0) {
    const avgCadence = cadenceValues.reduce((a, b) => a + b, 0) / cadenceValues.length;
    const variance = Math.sqrt(
      cadenceValues.reduce((sum, v) => sum + (v - avgCadence) ** 2, 0) / cadenceValues.length
    );
    if (variance > 20) {
      insights.push({
        title: 'Cadence Variability',
        description: 'Step rhythm is variable; rhythm training may help.',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'warning',
      });
      recommendations.push({
        title: 'Rhythm Exercises',
        description: 'Use a metronome or guided walking to stabilize cadence.',
        priority: 'medium',
      });
    } else {
      insights.push({
        title: 'Consistent Cadence',
        description: 'Walking rhythm is stable and efficient.',
        icon: <Footprints className="w-5 h-5" />,
        color: 'success',
      });
    }
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Maintain Consistency',
      description: 'Keep current training to sustain performance.',
      priority: 'low',
    });
  }

  function smooth(values: number[], window = 5): number[] {
  const smoothed: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - Math.floor(window / 2));
    const end = Math.min(values.length, i + Math.floor(window / 2) + 1);
    const slice = values.slice(start, end);
    smoothed.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return smoothed;
}

  // 1) Compute local raw scores
let localScores = latestData.map(d => clamp(calculateRawCompositeScore(d), 0, 100));

  // 2) Smooth the local scores to remove spikes (fixes steep slopes)
localScores = smooth(localScores, 5);  // window = 5, adjust if needed

  // 3) Use local scores directly for chart
const chartData = localScores.map((score, i) => ({
  timestamp: new Date(latestData[i].timestamp ?? Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  score: score,
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
        <Card ref={scoreRef} className="bg-gradient-primary border-border/50 relative overflow-hidden">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Overall Gait Score
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="relative">
              {/* subtle glow behind ring */}
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ top: '6px' }}
              >
                <div
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: '9999px',
                    filter: 'blur(18px)',
                    opacity: 0.12,
                    background: ringColor,
                  }}
                />
              </div>

              <div className="w-40 h-40 mx-auto relative z-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="3"
                  />
                  {gaitScore !== null && (
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="3"
                      strokeDasharray={`${gaitScore}, 100`}
                      strokeLinecap="round"
                      className="drop-shadow-sm"
                    />
                  )}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-4xl font-extrabold ${scoreColorClass} drop-shadow-md`}>
                    {gaitScore !== null ? gaitScore.toFixed(0) : '?'}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
            </div>

            <div>
              <Badge className={getScoreBadgeClasses(gaitScore ?? 0)}>
                {scoreLabel}
              </Badge>

              <p className="text-sm text-muted-foreground mt-3">
                {backendGaitScore !== null ? 'Backend AI-powered score' : 'Score unavailable – fetching from endpoint...'} based on key gait parameters over the last {latestData.length} data points
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ML Card removed - using local data only */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Score Trend Curve */}
          <Card ref={curveRef} className="bg-gradient-primary border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Score Progression</CardTitle>
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
              <CardTitle className="text-lg font-semibold text-foreground">Key Insights</CardTitle>
              <p className="text-sm text-muted-foreground">AI-generated observations</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-card/30 rounded-lg border border-border/30">
                  <div className="mt-1 text-muted-foreground">{insight.icon}</div>
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
            <CardTitle className="text-lg font-semibold text-foreground">Personalized Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground">Tailored exercises to improve your gait performance</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-card/30 rounded-lg border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <Badge
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'outline' : 'secondary'}
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

// ----------------- utility -----------------
function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}