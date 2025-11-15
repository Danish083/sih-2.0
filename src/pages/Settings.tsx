 import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Zap, 
  Monitor, 
  User, 
  Shield,
  CheckCircle
} from 'lucide-react';
import { gsap } from 'gsap';

export default function Settings() {
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('sensors');

  const [settings, setSettings] = useState({
    sampleRate: '60',
    autoStart: true,
    bufferData: true,
    dataSmoothing: false,
    showSkeleton: false,
    showGrid: true,
    autoRotate: true
  });

  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  const sensors = [
    { name: 'Equilibrium', calibrated: true },
    { name: 'Postural Sway', calibrated: true },
    { name: 'Cadence', calibrated: false },
    { name: 'Frequency', calibrated: true },
    { name: 'Step Width', calibrated: true },
    { name: 'Stride Length', calibrated: false },
    { name: 'Walking Speed', calibrated: true },
    { name: 'Phase Mean', calibrated: true }
  ];

  useEffect(() => {
    document.title = 'Kinova - Settings';
    
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }

    if (tabsRef.current) {
      gsap.fromTo(
        tabsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 }
      );
    }

    // Fetch user profile on mount
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://internal-backend-1ju5.onrender.com/api/user/profile', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            role: data.user.role || '',
            avatar: data.user.avatar || ''
          });
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Configure sensor calibration, display preferences, and system settings
            </p>
          </div>
          <Button className="self-start sm:self-auto">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Settings Tabs */}
        <Tabs ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-card border border-border h-auto p-1">
            <TabsTrigger value="sensors" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sensors</span>
              <span className="sm:hidden">Sens</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Display</span>
              <span className="sm:hidden">Disp</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Sensors Tab */}
          <TabsContent value="sensors" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Sensor Calibration */}
              <Card className="bg-gradient-primary border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-success" />
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Sensor Calibration
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Calibrate individual sensors for accurate readings
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sensors.map((sensor, index) => (
                    <div key={sensor.name} className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${sensor.calibrated ? 'bg-success shadow-glow-success' : 'bg-muted'}`} />
                        <span className="font-medium text-foreground">{sensor.name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Calibrate
                      </Button>
                    </div>
                  ))}
                  <Button className="w-full mt-4 bg-success hover:bg-success/90 text-success-foreground">
                    Auto-Calibrate All
                  </Button>
                </CardContent>
              </Card>

              {/* Data Streaming */}
              <Card className="bg-gradient-primary border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Data Streaming
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure data collection and streaming settings
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">Sample Rate</label>
                      <p className="text-xs text-muted-foreground">Frequency of data collection</p>
                    </div>
                    <Select value={settings.sampleRate} onValueChange={(value) => handleSettingChange('sampleRate', value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Hz</SelectItem>
                        <SelectItem value="60">60 Hz</SelectItem>
                        <SelectItem value="120">120 Hz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">Auto-start streaming</label>
                      <p className="text-xs text-muted-foreground">Begin streaming on connection</p>
                    </div>
                    <Switch 
                      checked={settings.autoStart}
                      onCheckedChange={(checked) => handleSettingChange('autoStart', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">Buffer data locally</label>
                      <p className="text-xs text-muted-foreground">Store data for offline analysis</p>
                    </div>
                    <Switch 
                      checked={settings.bufferData}
                      onCheckedChange={(checked) => handleSettingChange('bufferData', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">Data smoothing</label>
                      <p className="text-xs text-muted-foreground">Apply noise reduction filters</p>
                    </div>
                    <Switch 
                      checked={settings.dataSmoothing}
                      onCheckedChange={(checked) => handleSettingChange('dataSmoothing', checked)}
                    />
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Connection Status</span>
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Receiving data from</span>
                        <span className="text-foreground">6 active sensors</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card className="bg-gradient-primary border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Visualization Preferences
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize the appearance of 3D models and data displays
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-foreground">Show Skeleton</label>
                    <p className="text-xs text-muted-foreground">Display bone structure in 3D model</p>
                  </div>
                  <Switch 
                    checked={settings.showSkeleton}
                    onCheckedChange={(checked) => handleSettingChange('showSkeleton', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-foreground">Show Grid</label>
                    <p className="text-xs text-muted-foreground">Display reference grid</p>
                  </div>
                  <Switch 
                    checked={settings.showGrid}
                    onCheckedChange={(checked) => handleSettingChange('showGrid', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-foreground">Auto Rotate</label>
                    <p className="text-xs text-muted-foreground">Automatically rotate 3D model</p>
                  </div>
                  <Switch 
                    checked={settings.autoRotate}
                    onCheckedChange={(checked) => handleSettingChange('autoRotate', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-primary border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  User Profile
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings and preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{userProfile.firstName} {userProfile.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{userProfile.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{userProfile.email}</p>
                </div>
                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                  <Button variant="outline" className="w-full">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gradient-primary border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Security Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage access control and data security
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Enable Two-Factor Authentication</Button>
                  <Button variant="outline" className="w-full">Manage API Keys</Button>
                  <Button variant="outline" className="w-full">Data Export Settings</Button>
                  <Button variant="destructive" className="w-full">Sign Out All Devices</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
