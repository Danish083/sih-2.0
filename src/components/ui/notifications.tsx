import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Sensor Connected',
    message: 'Equilibrium sensor is now online and transmitting data.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Low Battery',
    message: 'Walking speed sensor battery is below 20%.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Data Export Complete',
    message: 'Your gait analysis report has been generated.',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'Calibration Complete',
    message: 'All sensors have been successfully calibrated.',
    time: '2 hours ago',
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case 'info':
      return <Info className="h-4 w-4 text-info" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

export function Notifications() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-3 p-3 rounded-lg mb-2 transition-colors hover:bg-muted/50 ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium truncate">
                      {notification.title}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 opacity-60 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-border p-3">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}