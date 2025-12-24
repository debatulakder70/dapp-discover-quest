import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search tools, protocols, chains..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input pl-12 pr-4 py-6 text-base w-full"
      />
    </div>
  );
}
