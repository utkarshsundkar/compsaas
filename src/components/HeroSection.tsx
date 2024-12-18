import { Search } from 'lucide-react';
import { Button } from './ui/button';

interface HeroSectionProps {
  onTryNowClick: () => void;
}

export const HeroSection = ({ onTryNowClick }: HeroSectionProps) => {
  return (
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
          onClick={onTryNowClick}
          size="lg"
          className="bg-black text-white hover:bg-gray-800"
        >
          Try Now
        </Button>
      </div>
    </div>
  );
};