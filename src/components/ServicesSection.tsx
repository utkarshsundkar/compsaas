import { Search, FileText, Lightbulb } from 'lucide-react';

export const ServicesSection = () => {
  const services = [
    {
      icon: <Search className="w-12 h-12 mb-4 text-blue-600" />,
      title: "Competitor Analysis",
      description: "Get detailed insights about your competitors, their strategies, and market position."
    },
    {
      icon: <Lightbulb className="w-12 h-12 mb-4 text-yellow-500" />,
      title: "Know Your Startup Name",
      description: "Generate and validate unique startup names that align with your brand vision."
    },
    {
      icon: <FileText className="w-12 h-12 mb-4 text-green-500" />,
      title: "Pitch Deck Reviews",
      description: "Get expert AI-powered reviews and suggestions to improve your pitch deck."
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-black mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center hover:transform hover:-translate-y-2 transition-transform duration-300">
              {service.icon}
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};