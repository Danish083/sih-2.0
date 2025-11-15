import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  UserCircle,
  Palette,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export function ProfileDropdown({ 
  user = { 
    name: 'Dr. Smith', 
    email: 'dr.smith@sensorviz.com', 
    role: 'Administrator' 
  } 
}: ProfileDropdownProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    // const fetchUserProfile = async () => {
    //   try {
    //     const response = await fetch('https://localhost:5000/api/user/profile', {
    //       method: 'GET',
    //       credentials: 'include',
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       const userData = data.user;
    //       setCurrentUser({
    //         name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : user.name,
    //         email: userData.email || user.email,
    //         role: userData.role || user.role,
    //         avatar: userData.avatar || user.avatar
    //       });
    //     } else {
    //       console.error('Failed to fetch user profile');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user profile:', error);
    //   }
    // };
    // fetchUserProfile();
  }, []);

  const handleSignOut = async () => {
    // try {
    //   const response = await fetch('/api/user/logout', {
    //     method: 'POST',
    //     credentials: 'include',
    //   });
    //   if (response.ok) {
    //     // Clear any client-side auth state if needed
    //     navigate('/sign-in');
    //   } else {
    //     console.error('Logout failed');
    //   }
    // } catch (error) {
    //   console.error('Logout error:', error);
    // }
    navigate('/sign-in')
  };

  const menuItems = [
    {
      icon: UserCircle,
      label: 'Profile',
      action: () => navigate('/profile'),
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => navigate('/settings'),
    },
    {
      icon: Palette,
      label: 'Appearance',
      action: () => console.log('Appearance settings'),
    },
    {
      icon: Shield,
      label: 'Privacy',
      action: () => console.log('Privacy settings'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => console.log('Help & Support'),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-1 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-gradient-primary text-primary text-sm font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {menuItems.map((item, index) => (
          <DropdownMenuItem 
            key={index}
            onClick={item.action}
            className="cursor-pointer"
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
