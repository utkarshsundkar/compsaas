import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Competitor } from '../types/competitor';
import { HeroSection } from './HeroSection';
import { SearchSection } from './SearchSection';
import { CompetitorCard } from './CompetitorCard';
import { generateCompetitorPDF } from '../utils/pdfGenerator';

export const SearchCompetitors = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const fetchCompanyInfo = async (companyName: string) => {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides accurate company information. Return only JSON data.'
            },
            {
              role: 'user',
              content: `Find detailed information about ${companyName} including: founding date, founders names, funding details, services/features, and subscription plans. Return as JSON with fields: foundedDate, founders (array), funding, services (array), goldSubscription (boolean), description, url, linkedin, twitter.`
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company information');
      }

      const data = await response.json();
      console.log('Perplexity API response:', data);
      
      try {
        const parsedInfo = JSON.parse(data.choices[0].message.content);
        return parsedInfo;
      } catch (error) {
        console.error('Failed to parse company info:', error);
        throw new Error('Invalid company data format');
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  };

  const searchCompetitors = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to search competitors",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Searching for:', query);

    try {
      // First get competitor names using Gemini
      const genAI = new GoogleGenerativeAI("AIzaSyBz-z_wmd2rvquybWz3p74JJY_G-zCCqds");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `List 5 main competitors for ${query}. Return ONLY a JSON array of company names.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini response:', text);
      
      try {
        const cleanJson = text.replace(/```json\n|\n```/g, '').trim();
        const competitorNames = JSON.parse(cleanJson);
        
        // Fetch detailed info for each competitor using Perplexity
        const competitorPromises = competitorNames.map(async (name: string) => {
          const companyInfo = await fetchCompanyInfo(name);
          return {
            name,
            ...companyInfo
          };
        });

        const competitorsData = await Promise.all(competitorPromises);
        console.log('Fetched competitors data:', competitorsData);
        setCompetitors(competitorsData);
        
        toast({
          title: "Search Complete",
          description: `Found ${competitorsData.length} competitors`,
        });
      } catch (parseError) {
        console.error('Failed to parse competitor data:', parseError);
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
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            <span className="font-bold text-xl">Know Your Startup</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact us</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Sign in</a>
          </div>
        </div>
      </div>

      <HeroSection onTryNowClick={scrollToSearch} />
      
      <div id="search-section">
        <SearchSection
          query={query}
          onQueryChange={setQuery}
          onSearch={searchCompetitors}
          isLoading={isLoading}
          showExport={competitors.length > 0}
          onExport={exportToPDF}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64" />
              ))
            ) : (
              competitors.map((competitor, index) => (
                <CompetitorCard key={index} competitor={competitor} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};