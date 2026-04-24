import { motion } from 'framer-motion';
import { Share2, Network, Cpu, ShieldAlert } from 'lucide-react';

const gridFeatures = [
  {
    icon: Network,
    title: 'Real-Time Threat Intelligence',
    description: 'Instantly detect and track emerging cyber threats with live intelligence feeds.'
  },
  {
    icon: ShieldAlert,
    title: 'Advanced Attack Surface Monitoring',
    description: 'Continuously map, monitor, and secure your digital footprint.'
  },
  {
    icon: Share2,
    title: 'AI-Driven Threat Analysis',
    description: 'Leverage machine learning to identify, prioritize, and neutralize risks faster.'
  },
  {
    icon: Cpu,
    title: 'Actionable Security Insights',
    description: 'Get clear, data-driven alerts and reports that empower rapid response.'
  }
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/3">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white tracking-tight"
          >
            Collect, correlate and leverage
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg leading-relaxed"
          >
            Operationalize threat intelligence like never before. Share it timely across your security teams and build threat-informed defense.
          </motion.p>
        </div>
        
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {gridFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:border-cyan-500 transition-colors">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
