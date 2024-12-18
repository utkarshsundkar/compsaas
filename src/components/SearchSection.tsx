import { Search, FileDown } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchSectionProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
  showExport: boolean;
  onExport: () => void;
}

export const SearchSection = ({ 
  query, 
  onQueryChange, 
  onSearch, 
  isLoading, 
  showExport, 
  onExport 
}: SearchSectionProps) => {
  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Search className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Search Competitors</h2>
          </div>
          {showExport && (
            <Button
              onClick={onExport}
              variant="outline"
              className="bg-white text-black hover:bg-gray-100"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          )}
        </div>

        <form onSubmit={onSearch} className="flex gap-2 mb-8">
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Enter company name or website..."
            className="bg-white border-2 border-black"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
    </div>
  );
};