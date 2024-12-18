import { DollarSign, Globe, Linkedin, Twitter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Competitor } from '../types/competitor';

interface CompetitorCardProps {
  competitor: Competitor;
}

export const CompetitorCard = ({ competitor }: CompetitorCardProps) => {
  const renderPricing = (pricing: string | { plan?: string; price?: string } | undefined) => {
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
    <Card className="p-6 bg-black text-white hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{competitor.name}</h3>
      <p className="text-gray-300 mb-4">{competitor.description}</p>
      
      {competitor.pricing && (
        <div className="flex items-center text-green-400 mb-4">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>{renderPricing(competitor.pricing)}</span>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">SWOT Analysis</h4>
          <div className="blur-sm">
            <p>Strengths: Market leader in AI solutions</p>
            <p>Weaknesses: Limited global presence</p>
            <p>Opportunities: Emerging markets</p>
            <p>Threats: Increasing competition</p>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Revenue & Market Share</h4>
          <div className="blur-sm">
            <p>Annual Revenue: $50M</p>
            <p>Market Share: 15%</p>
            <p>Growth Rate: 25% YoY</p>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Marketing Strategy</h4>
          <div className="blur-sm">
            <p>Primary: Content Marketing</p>
            <p>Secondary: Social Media</p>
            <p>Budget: $5M annually</p>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Traffic & Rankings</h4>
          <div className="blur-sm">
            <p>Global Rank: #5,234</p>
            <p>Country Rank: #156</p>
            <p>Monthly Traffic: 2.5M visits</p>
          </div>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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