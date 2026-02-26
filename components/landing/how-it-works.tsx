'use client';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Find Therapist',
      description: 'Explore our qualified psychotherapists across different institutes at University of Sousse.',
    },
    {
      number: '02',
      title: 'Share Your Needs',
      description: 'Complete a confidential form about your situation. Your privacy is our priority.',
    },
    {
      number: '03',
      title: 'Get Support',
      description: 'The therapist contacts you to schedule your meeting at the university.',
    },
  ];

  return (
    <section className="w-full bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-base text-muted-foreground">
            Three simple steps to connect with professional support
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col">
              {/* Step Number */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-muted opacity-40">{step.number}</span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
