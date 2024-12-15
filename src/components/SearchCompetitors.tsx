import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, ExternalLink, Key } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Competitor {
  name: string;
  description: string;
  url?: string;
}

export const SearchCompetitors = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved successfully",
      });
    }
  };

  const searchCompetitors = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Searching for:', query);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Find 5 main competitors for ${query}. Format the response as JSON array with objects containing name, description, and url fields. Keep descriptions under 100 words.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini response:', text);
      
      try {
        const parsedCompetitors = JSON.parse(text);
        console.log('Parsed competitors:', parsedCompetitors);
        setCompetitors(parsedCompetitors);
        
        toast({
          title: "Search Complete",
          description: `Found ${parsedCompetitors.length} competitors`,
        });
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        toast({
          title: "Error",
          description: "Failed to parse competitor data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to fetch competitor information. Please check your API key and try again.",
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
        
        <div className="bg-white/90 p-4 rounded-lg mb-6">
          <div className="flex gap-2 mb-2">
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
              placeholder="Enter your Gemini API key..."
              className="flex-grow"
            />
            <Button onClick={handleApiKeySubmit}>
              <Key className="w-4 h-4 mr-2" />
              Save Key
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Get your Gemini API key from{' '}
            <a 
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>
        
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