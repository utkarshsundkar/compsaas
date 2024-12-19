import { DollarSign, Globe, Linkedin, Twitter, Calendar, Users, Gift } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Competitor } from '../types/competitor';

interface CompetitorCardProps {
  competitor: Competitor;
}

export const CompetitorCard = ({ competitor }: CompetitorCardProps) => {
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        View Full Analysis
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