import { Lock } from 'lucide-react';
import { Button } from './ui/button';

interface CompetitorDetailsProps {
  title: string;
  content: string;
  isBlurred?: boolean;
}

export const CompetitorDetail = ({ title, content, isBlurred = true }: CompetitorDetailsProps) => {
  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
        {title}
        {isBlurred && <Lock className="w-4 h-4" />}
      </h4>
      <p className={`text-gray-300 ${isBlurred ? 'blur-sm select-none' : ''}`}>
        {content}
      </p>
    </div>
  );
};