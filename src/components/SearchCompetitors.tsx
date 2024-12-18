import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, ExternalLink, DollarSign, Globe, Linkedin, Twitter, FileDown } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateCompetitorPDF } from '../utils/pdfGenerator';
import { Competitor, PricingInfo } from '../types/competitor';

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

  const exportToPDF = () => {
    const pdf = generateCompetitorPDF(competitors, query);
    pdf.save('competitor-analysis.pdf');
    
    toast({
      title: "PDF Exported",
      description: "Your competitor analysis has been downloaded",
    });
  };

  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    searchSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Search className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Know Your Competitor</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop searching everywhere for competitor analysis. Get instant insights about your competitors right here. Our AI-powered tool helps you understand your market better.
          </p>
          <Button 
            onClick={scrollToSearch}
            size="lg"
            className="bg-black text-white hover:bg-gray-800"
          >
            Try Now
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div id="search-section" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Search className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Search Competitors</h2>
            </div>
            {competitors.length > 0 && (
              <Button
                onClick={exportToPDF}
                variant="outline"
                className="bg-white text-black hover:bg-gray-100"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            )}
          </div>

          <form onSubmit={searchCompetitors} className="flex gap-2 mb-8">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

          <div className="grid gap-4 md:grid-cols-2">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse bg-gray-100">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </Card>
              ))
            ) : (
              competitors.map((competitor, index) => (
                <Card 
                  key={index}
                  className="p-6 bg-black text-white hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{competitor.name}</h3>
                  <p className="text-gray-300 mb-4">{competitor.description}</p>
                  {competitor.pricing && (
                    <div className="flex items-center text-green-400 mb-4">
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
                        className="inline-flex items-center text-blue-300 hover:text-blue-400"
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
                        className="inline-flex items-center text-blue-300 hover:text-blue-400"
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
                        className="inline-flex items-center text-blue-300 hover:text-blue-400"
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
    </div>
  );
};