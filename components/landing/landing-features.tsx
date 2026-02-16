'use client';

import { Search, Calendar, Shield, Award } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find the right doctor and institution with advanced filtering and ratings from verified patients.',
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments instantly with real-time availability and automatic confirmations.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your medical information is protected with enterprise-grade security and privacy.',
  },
  {
    icon: Award,
    title: 'Verified Professionals',
    description: 'All doctors and institutions are verified and maintain the highest professional standards.',
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Why WE4LEAD</h2>
          <p className="text-sm text-gray-600">
            A trusted platform designed to connect you with healthcare professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-5 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition"
              >
                <div className="mb-3 w-8 h-8 text-gray-700 group-hover:text-gray-900">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
