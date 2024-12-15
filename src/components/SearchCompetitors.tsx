import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, ExternalLink, DollarSign, Globe, Linkedin, Twitter } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface PricingInfo {
  plan?: string;
  price?: string;
}

interface Competitor {
  name: string;
  description: string;
  url?: string;
  pricing?: string | PricingInfo;
  linkedin?: string;
  twitter?: string;
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

      const prompt = `Find 5 main competitors for ${query}. Return ONLY a JSON array with objects containing name, description, url, pricing, linkedin, and twitter fields. Include their pricing plans, website URL, LinkedIn and Twitter profiles if available. Keep descriptions under 100 words. The pricing should be a string. Do not include any markdown formatting or code blocks.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini response:', text);
      
      try {
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

  const renderPricing = (pricing: string | PricingInfo | undefined) => {
    if (!pricing) return null;
    
    if (typeof pricing === 'string') {
      return pricing;
    }
    
    if (pricing.plan && pricing.price) {
      return `${pricing.plan}: ${pricing.price}`;
    }
    
    return null;
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
                {competitor.pricing && (
                  <div className="flex items-center text-green-600 mb-4">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{renderPricing(competitor.pricing)}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {competitor.url && (
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  )}
                  {competitor.linkedin && (
                    <a
                      href={competitor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="w-4 h-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {competitor.twitter && (
                    <a
                      href={competitor.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Twitter className="w-4 h-4 mr-1" />
                      Twitter
                    </a>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};