import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, ExternalLink } from 'lucide-react';

interface Competitor {
  name: string;
  description: string;
  url?: string;
}

export const SearchCompetitors = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const { toast } = useToast();

  const searchCompetitors = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Searching for:', query);

    try {
      // Using a proxy to avoid CORS issues
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.google.com/search?q=${query}+competitors+companies`)}`)
      const html = await response.text();
      
      // Basic parsing of search results
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const results = Array.from(doc.querySelectorAll('.g')).slice(0, 5);
      
      const parsedCompetitors: Competitor[] = results.map(result => {
        const titleEl = result.querySelector('h3');
        const descEl = result.querySelector('.VwiC3b');
        const linkEl = result.querySelector('a');
        
        return {
          name: titleEl?.textContent || 'Unknown Company',
          description: descEl?.textContent || 'No description available',
          url: linkEl?.href || undefined
        };
      });

      console.log('Parsed competitors:', parsedCompetitors);
      setCompetitors(parsedCompetitors);
      
      toast({
        title: "Search Complete",
        description: `Found ${parsedCompetitors.length} competitors`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to fetch competitor information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 gradient-bg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Competitor Research Tool
        </h1>
        
        <form onSubmit={searchCompetitors} className="flex gap-2 mb-8">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter company name or website..."
            className="bg-white/90 border-0"
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="p-6 loading-shimmer">
                <div className="h-20"></div>
              </Card>
            ))
          ) : (
            competitors.map((competitor, index) => (
              <Card 
                key={index}
                className="p-6 bg-white/90 backdrop-blur-sm card-hover"
              >
                <h3 className="text-xl font-semibold mb-2">{competitor.name}</h3>
                <p className="text-gray-600 mb-4">{competitor.description}</p>
                {competitor.url && (
                  <a
                    href={competitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};