import { DollarSign, Globe, Linkedin, Twitter, Calendar, Users, Gift, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Competitor } from '../types/competitor';
import { CompetitorDetail } from './CompetitorDetails';
import { useToast } from './ui/use-toast';

interface CompetitorCardProps {
  competitor: Competitor;
}

export const CompetitorCard = ({ competitor }: CompetitorCardProps) => {
  const { toast } = useToast();

  const handleSubscribe = () => {
    toast({
      title: "Subscription Required",
      description: "Please subscribe to access detailed competitor analysis.",
    });
  };

  return (
    <Card className="p-6 bg-black text-white hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{competitor.name}</h3>
      <p className="text-gray-300 mb-4">{competitor.description}</p>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="w-4 h-4" />
          <span>Founded: {competitor.foundedDate}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-300">
          <Users className="w-4 h-4" />
          <span>Founders: {competitor.founders.join(', ')}</span>
        </div>
        
        {competitor.goldSubscription && (
          <div className="flex items-center gap-2 text-green-400">
            <Gift className="w-4 h-4" />
            <span>Gold Subscription: ${competitor.goldSubscription.price}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 my-4 pt-4">
        <CompetitorDetail 
          title="SWOT Analysis"
          content="Detailed SWOT analysis of the competitor's strengths, weaknesses, opportunities, and threats."
        />
        
        <CompetitorDetail 
          title="Revenue Generated"
          content="Complete revenue analysis and financial performance metrics."
        />
        
        <CompetitorDetail 
          title="Marketing Strategy"
          content="In-depth analysis of marketing channels, campaigns, and effectiveness."
        />
        
        <CompetitorDetail 
          title="Global & Country Rank"
          content="Detailed ranking information across different markets and regions."
        />
        
        <CompetitorDetail 
          title="Monthly Traffic"
          content="Comprehensive traffic analysis including sources and user behavior."
        />
        
        <CompetitorDetail 
          title="Market Share"
          content="Detailed market share analysis and competitive positioning."
        />
      </div>

      <Button 
        onClick={handleSubscribe}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
      >
        Subscribe Now for Complete Analysis
      </Button>

      <div className="flex flex-wrap gap-3 mt-4">
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
  );
};