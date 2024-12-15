import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, ExternalLink } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Competitor {
  name: string;
  description: string;
  url?: string;
}

const GEMINI_API_KEY = "AIzaSyBz-z_wmd2rvquybWz3p74JJY_G-zCCqds";

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
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Find 5 main competitors for ${query}. Return ONLY a JSON array with objects containing name, description, and url fields. Keep descriptions under 100 words. Do not include any markdown formatting or code blocks.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini response:', text);
      
      try {
        // Remove any potential markdown formatting
        const cleanJson = text.replace(/```json\n|\n```/g, '').trim();
        const parsedCompetitors = JSON.parse(cleanJson);
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
        description: "Unable to fetch competitor information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-500 to-purple-600">
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
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </Card>
            ))
          ) : (
            competitors.map((competitor, index) => (
              <Card 
                key={index}
                className="p-6 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow"
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