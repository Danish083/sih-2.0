import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function Search({ placeholder = "Search gait metrics...", onSearch }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch?.('');
  };

  const recentSearches = [
    'Equilibrium sensor',
    'Gait analysis',
    'Walking speed data',
    'Postural sway metrics'
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10 bg-sidebar/50 border-sidebar-border focus:bg-background transition-colors"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-2">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
            Recent Searches
          </div>
          {recentSearches.map((search, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => {
                handleSearch(search);
                setIsOpen(false);
              }}
              className="w-full justify-start text-sm font-normal"
            >
              <SearchIcon className="h-3 w-3 mr-2" />
              {search}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}