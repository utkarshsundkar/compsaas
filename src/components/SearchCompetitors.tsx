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
      const genAI = new GoogleGenerativeAI("AIzaSyBz-z_wmd2rvquybWz3p74JJY_G-zCCqds");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // First get competitor names
      const namesPrompt = `List 5 main competitors for ${query}. Return ONLY a JSON array of company names.`;
      const namesResult = await model.generateContent(namesPrompt);
      const namesResponse = await namesResult.response;
      const namesText = namesResponse.text();
      
      console.log('Gemini names response:', namesText);
      
      try {
        const cleanJson = namesText.replace(/```json\n|\n```/g, '').trim();
        const competitorNames = JSON.parse(cleanJson);
        
        // Fetch detailed info for each competitor using Gemini
        const competitorPromises = competitorNames.map(async (name: string) => {
          const infoPrompt = `For the company ${name}, provide ONLY these specific details:
          1. Founding date (year)
          2. Founders names (full names)
          3. Gold subscription details (if they have one, include its price)
          
          Return as JSON with fields: foundedDate (string), founders (array of strings), goldSubscription (object with price field if exists, or null if no gold subscription).`;
          
          const infoResult = await model.generateContent(infoPrompt);
          const infoResponse = await infoResult.response;
          const infoText = infoResponse.text();
          
          try {
            const cleanInfoJson = infoText.replace(/```json\n|\n```/g, '').trim();
            const companyInfo = JSON.parse(cleanInfoJson);
            return {
              name,
              description: `Founded in ${companyInfo.foundedDate}`,
              founders: companyInfo.founders,
              goldSubscription: companyInfo.goldSubscription,
              ...companyInfo
            };
          } catch (parseError) {
            console.error('Failed to parse company info:', parseError);
            throw new Error('Invalid company data format');
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