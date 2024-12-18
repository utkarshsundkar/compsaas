import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateCompetitorPDF } from '../utils/pdfGenerator';
import { Competitor } from '../types/competitor';
import { HeroSection } from './HeroSection';
import { SearchSection } from './SearchSection';
import { CompetitorCard } from './CompetitorCard';

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
      <HeroSection onTryNowClick={scrollToSearch} />
      
      <div id="search-section">
        <SearchSection
          query={query}
          onQueryChange={setQuery}
          onSearch={searchCompetitors}
          isLoading={isLoading}
          showExport={competitors.length > 0}
          onExport={exportToPDF}
        />

        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="grid gap-4 md:grid-cols-2">
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