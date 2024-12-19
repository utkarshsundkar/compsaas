import { useState } from 'react';
import { Search } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useToast } from "@/components/ui/use-toast";
import { Competitor } from '../types/competitor';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { SearchSection } from './SearchSection';
import { CompetitorCard } from './CompetitorCard';
import { generateCompetitorPDF } from '../utils/pdfGenerator';

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SearchCompetitors = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const { toast } = useToast();

  const handleRateLimit = () => {
    toast({
      title: "Rate Limit Reached",
      description: "Please wait a moment before trying again",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  const searchCompetitors = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Searching for:', query);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBz-z_wmd2rvquybWz3p74JJY_G-zCCqds");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // First get competitor names
      const namesPrompt = `List 5 main competitors for ${query}. Return ONLY a JSON array of company names, without any markdown formatting or code blocks.`;
      const namesResult = await model.generateContent(namesPrompt);
      const namesResponse = await namesResult.response;
      const namesText = namesResponse.text();
      
      console.log('Gemini names response:', namesText);
      
      try {
        const competitorNames = JSON.parse(namesText);
        
        // Add delay between requests to avoid rate limiting
        const competitorPromises = competitorNames.map(async (name: string, index: number) => {
          // Add a 1-second delay between each request
          await delay(index * 1000);
          
          const infoPrompt = `For the company ${name}, provide these specific details in a JSON format without any markdown or code blocks:
          {
            "foundedDate": "<year>",
            "founders": ["<founder1>", "<founder2>"],
            "goldSubscription": {"price": "<price>"} or null if no gold subscription
          }`;
          
          try {
            const infoResult = await model.generateContent(infoPrompt);
            const infoResponse = await infoResult.response;
            const infoText = infoResponse.text();
            
            const companyInfo = JSON.parse(infoText);
            return {
              name,
              description: `A leading competitor in the ${query} space`,
              founders: companyInfo.founders,
              foundedDate: companyInfo.foundedDate,
              goldSubscription: companyInfo.goldSubscription
            };
          } catch (error) {
            console.error('Failed to fetch company info:', error);
            // Return partial data if we hit rate limits
            return {
              name,
              description: `A competitor in the ${query} space`,
              founders: ['Information temporarily unavailable'],
              foundedDate: 'Information pending',
              goldSubscription: null
            };
          }
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
          description: "Failed to parse competitor data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      if (error.status === 429) {
        handleRateLimit();
      } else {
        toast({
          title: "Search Failed",
          description: "Unable to fetch competitor information. Please try again.",
          variant: "destructive",
        });
      }
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
      <AboutSection />
      <ServicesSection />
      
      <div id="search-section">
        <SearchSection
          query={query}
          onQueryChange={setQuery}
          onSearch={searchCompetitors}
          isLoading={isLoading}
          showExport={competitors.length > 0}
          onExport={exportToPDF}
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